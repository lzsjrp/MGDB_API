import prisma from "../lib/prisma.js";
import path from "path"
import * as uuid from "uuid"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const createChapter = async (req, res) => {
    const { titleId } = req.params;
    try {
        if (!req.body.number || req.body.number < 1) {
            return res.status(400).json({ error: "Chapter number must be a positive integer" });
        }
        if (!req.body.volume || req.body.volume < 1) {
            return res.status(400).json({ error: "Volume must be a positive integer" });
        }
        const existingBook = await prisma.book.findUnique({
            where: { id: titleId }
        })
        if (!existingBook) {
            return res.status(404).json({ error: "Title not found" });
        }
        const existingChapter = await prisma.bookChapter.findFirst({
            where: {
                bookId: titleId,
                number: Number(req.body.number),
            },
        });
        if (existingChapter) {
            return res.status(409).json({ error: "Chapter already exists" });
        }
        await prisma.$transaction(async (tx) => {
            const existingVolume = await prisma.bookVolume.findFirst({
                where: {
                    bookId: titleId,
                    number: Number(req.body.volume),
                }
            })
            const updatedVolume = await tx.bookVolume.upsert({
                where: { id: existingVolume.id },
                create: {
                    bookId: titleId,
                    number: Number(req.body.volume),
                    addedBy: req.session.userId,
                    title: req.body.volumeTitle || `Volume ${req.body.volume}`
                },
                update: {
                    addedBy: req.session.userId,
                    title: req.body.volumeTitle || `Volume ${req.body.volume}`
                },
            });
            const newChapter = await tx.bookChapter.create({
                data: {
                    bookId: titleId,
                    volumeId: updatedVolume.id,
                    title: req.body.title || `Chapter ${req.body.number}`,
                    number: Number(req.body.number),
                    content: req.body.content || undefined,
                    addedBy: req.session.userId,
                },
            });
            return res.status(201).json({ id: newChapter.id, message: "Chapter created successfully", chapter: newChapter, updatedVolume });
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create chapter", errorDetails: error.message });
    }
}

export const getChapter = async (req, res) => {
    const { titleId, chapterId } = req.params;
    try {
        const existingBook = await prisma.book.findUnique({
            where: { id: titleId }
        })
        if (!existingBook) {
            return res.status(404).json({ error: "Title not found" });
        }
        const chapter = await prisma.bookChapter.findUnique({
            where: { id: chapterId, bookId: titleId },
            include: { images: true }
        });
        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }
        res.status(200).json({ id: chapter.id, chapter });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve chapter", errorDetails: error.message });
    }
}

export const getChapterList = async (req, res) => {
    const { titleId } = req.params;
    try {
        const existingBook = await prisma.book.findUnique({
            where: { id: titleId }
        })
        if (!existingBook) {
            return res.status(404).json({ error: "Title not found" });
        }
        const chapters = await prisma.bookChapter.findMany({
            where: { bookId: titleId }
        })
        return res.status(200).json({ bookId: titleId, chapters })
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve chapters list", errorDetails: error.message });
    }
}

export const deleteChapter = async (req, res) => {
    const { titleId, chapterId } = req.params;
    try {
        const existingBook = await prisma.book.findUnique({
            where: { id: titleId }
        })
        if (!existingBook) {
            return res.status(404).json({ error: "Title not found" });
        }
        const chapter = await prisma.bookChapter.findUnique({ where: { id: chapterId, bookId: titleId } })
        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }
        if (chapter.addedBy !== req.session.userId) {
            return res.status(403).json({ error: "You do not have permission to delete this chapter" });
        }
        await prisma.bookChapter.delete({ where: { id: chapterId, bookId: titleId } });
        res.status(200).json({ id: chapterId, message: "Chapter deleted successfully", chapter });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete chapter", errorDetails: error.message });
    }
}

export const chapterPageUpload = async (req, res) => {
    const { titleId, chapterId } = req.params;
    try {
        const existingBook = await prisma.book.findUnique({
            where: { id: titleId }
        })
        if (!existingBook) {
            return res.status(404).json({ error: "Title not found" });
        }
        if (existingBook.type !== 'MANGA') {
            return res.status(400).json({ error: "Chapter images only avaliable for type 'MANGA'" });
        }
        const pageNumber = parseInt(req.body.pageNumber);
        if (!pageNumber) {
            return res.status(400).json({ error: "Page number not specified" });
        }
        if (!req.file.buffer) {
            return res.status(400).json({ error: "No image provided" });
        }
        const existingPage = await prisma.imageChapter.findFirst({
            where: { chapterId, pageNumber }
        })
        let pageId = uuid.v4()
        let filename;
        if (existingPage) {
            filename = existingPage.id + path.extname(req.file.originalname).toLowerCase();
        } else {
            filename = pageId + path.extname(req.file.originalname).toLowerCase();
        }
        const { data, error } = await supabase.storage
            .from("image-bucket")
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            })
        if (error) throw error;
        const { data: image_url } = supabase.storage.from("image-bucket").getPublicUrl(filename);
        const newPage = await prisma.imageChapter.upsert({
            where: { id: existingPage.id || pageId },
            create: {
                id: pageId,
                bookId: existingBook.id,
                chapterId,
                pageNumber,
                imageUrl: image_url.publicUrl,
                addedBy: res.session.userId,
            },
            update: {
                chapterId,
                pageNumber,
                imageUrl: image_url.publicUrl,
                addedBy: res.session.userId,
            },
        });

        res.status(201).json({ chapterId, pageId, message: "Page uploaded successfully", page: newPage });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload chapter page", errorDetails: error.message });
    }
};

export const updateChapter = async (req, res) => {
    return res.status(400).json({ error: "Not implemented yet" });
}