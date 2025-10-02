import prisma from "../lib/prisma.js";
import path from "path"
import * as uuid from "uuid"

import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const createChapter = async (req, res) => {
    const { webNovelId, mangaId } = req.params;
    try {
        if (!req.body.number || req.body.number < 1) {
            return res.status(400).json({ error: "Number must be a positive integer" });
        }
        if (mangaId) {
            const existingManga = await prisma.manga.findUnique({
                where: {
                    id: mangaId
                }
            })
            if (!existingManga) {
                return res.status(404).json({ error: "Manga not found" });
            }
            const existingChapter = await prisma.mangaChapter.findFirst({
                where: {
                    mangaId: mangaId,
                    number: Number(req.body.number),
                },
            });
            if (existingChapter) {
                return res.status(409).json({ error: "Chapter number already exists" });
            }
            await prisma.$transaction(async (tx) => {
                const newChapter = await tx.mangaChapter.create({
                    data: {
                        mangaId,
                        title: req.body.title || `Chapter ${req.body.number}`,
                        number: Number(req.body.number),
                        pagesCount: 0,
                        addedBy: req.session.userId,
                    },
                });
                return res.status(201).json({ id: newChapter.id, message: "Chapter created successfully", chapter: newChapter });
            })
        }
        if (webNovelId) {
            if (!req.body.volume || req.body.volume < 1) {
                return res.status(400).json({ error: "Volume must be a positive integer" });
            }
            const existingWebNovel = await prisma.webNovel.findUnique({
                where: {
                    id: webNovelId
                }
            })
            if (!existingWebNovel) {
                return res.status(404).json({ error: "Web novel not found" });
            }
            const existingChapter = await prisma.novelChapter.findFirst({
                where: {
                    webNovelId: webNovelId,
                    number: Number(req.body.number),
                },
            });
            if (existingChapter) {
                return res.status(409).json({ error: "Chapter number already exists" });
            }
            await prisma.$transaction(async (tx) => {
                const volume = await tx.novelVolume.findFirst({
                    where: {
                        webNovelId: webNovelId,
                        number: Number(req.body.volume),
                    },
                });
                let newVolume;
                if (!volume) {
                    newVolume = await tx.novelVolume.create({
                        data: {
                            webNovelId: webNovelId,
                            number: Number(req.body.volume),
                            addedBy: req.session.userId,
                            title: req.body.volumeTitle || `Volume ${req.body.volume}`
                        },
                    });
                }
                const newChapter = await tx.novelChapter.create({
                    data: {
                        webNovelId: webNovelId,
                        volumeId: volume ? volume.id : newVolume.id,
                        title: req.body.title || `Chapter ${req.body.number}`,
                        number: Number(req.body.number),
                        content: req.body.content || "",
                        addedBy: req.session.userId,
                    },
                });
                return res.status(201).json({ id: newChapter.id, message: "Chapter created successfully", chapter: newChapter, volume: volume ? volume : newVolume });
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create chapter", errorDetails: error.message });
    }
}

export const getChapter = async (req, res) => {
    const { webNovelId, mangaId, chapterId } = req.params;
    try {
        if (webNovelId) {
            const chapter = await prisma.novelChapter.findUnique({
                where: { id: chapterId },
            });
            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }
            res.status(200).json({ id: chapter.id, chapter });
        }
        if (mangaId) {
            const chapter = await prisma.mangaChapter.findUnique({
                where: { id: chapterId },
                include: {
                    pages: true
                }
            });
            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }
            res.status(200).json({ id: chapter.id, chapter });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve chapter", errorDetails: error.message });
    }
}

export const getChapterList = async (req, res) => {
    const { webNovelId, mangaId } = req.params;
    if (webNovelId) {
        try {
            const chapterList = await prisma.novelChapter.findMany({
                where: {
                    webNovelId
                }
            })
            return res.status(200).json({ id: webNovelId, chapters: chapterList })
        } catch (error) {
            return res.status(500).json({ error: "Failed to retrieve chapters", errorDetails: error.message });
        }
    }
    if (mangaId) {
        try {
            const chapterList = await prisma.mangaChapter.findMany({
                where: {
                    mangaId
                }
            })
            return res.status(200).json({ id: mangaId, chapters: chapterList })
        } catch (error) {
            return res.status(500).json({ error: "Failed to retrieve chapters", errorDetails: error.message });
        }
    }
}

export const deleteChapter = async (req, res) => {
    const { webNovelId, mangaId, chapterId } = req.params;
    if (webNovelId) {
        try {
            const chapter = await prisma.novelChapter.findUnique({ where: { id: chapterId } })
            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }
            if (chapter.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to delete this chapter" });
            }
            await prisma.novelChapter.delete({ where: { id: chapterId } });
            res.status(200).json({ id: chapterId, message: "Chapter deleted successfully", chapter });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete chapter", errorDetails: error.message });
        }
    }
    if (mangaId) {
        try {
            const chapter = await prisma.mangaChapter.findUnique({ where: { id: chapterId } })
            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }
            if (chapter.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to delete this chapter" });
            }
            await prisma.novelChapter.delete({ where: { id: chapterId } });
            res.status(200).json({ id: chapterId, message: "Chapter deleted successfully", chapter });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete chapter", errorDetails: error.message });
        }
    }
}

export const chapterPageUpload = async (req, res) => {
    const { mangaId, chapterId } = req.params;
    if (!mangaId) return res.status(400).json({ error: "Chapter pages only avaliable for 'Manga'" });
    try {
        const pageNumber = parseInt(req.body.pageNumber);
        if (!pageNumber) {
            return res.status(400).json({ error: "Page number not specified" });
        }
        if (!req.file.buffer) {
            return res.status(400).json({ error: "No image provided" });
        }
        const existingPage = await prisma.mangaChapterPage.findFirst({
            where: {
                chapterId,
                pageNumber
            }
        })
        if (existingPage) {
            const fileName = existingPage.id + path.extname(req.file.originalname).toLowerCase();
            const { data, error } = await supabase.storage
                .from("image-bucket")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                })
            if (error) throw error;
            const { data: image_url } = supabase.storage.from("image-bucket").getPublicUrl(fileName);
            const updatedPage = await prisma.mangaChapterPage.update({
                where: {
                    id: existingPage.id,
                    pageNumber
                },
                data: {
                    imageUrl: image_url.publicUrl,
                    addedBy: req.session.userId,
                },
            });
            return res.status(200).json({ chapterId, pageId: existingPage.id, message: "Page updated successfully", page: updatedPage });
        }
        const pageId = uuid.v4()
        const fileName = pageId + path.extname(req.file.originalname).toLowerCase();
        const { data, error } = await supabase.storage
            .from("image-bucket")
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            })
        if (error) throw error;
        const { data: image_url } = supabase.storage.from("image-bucket").getPublicUrl(fileName);
        const newPage = await prisma.mangaChapterPage.create({
            data: {
                id: pageId,
                chapterId,
                pageNumber,
                imageUrl: image_url.publicUrl,
                addedBy: req.session.userId,
            },
        });
        const pageCount = await prisma.mangaChapterPage.count({
            where: { chapterId },
        });

        await prisma.mangaChapter.update({
            where: { id: chapterId },
            data: { pagesCount: pageCount },
        });
        res.status(201).json({ chapterId, pageId, message: "Page uploaded successfully", page: newPage });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload chapter page", errorDetails: error.message });
    }
};



export const updateChapter = async (req, res) => {
    return res.status(400).json({ error: "Not implemented yet" });
}