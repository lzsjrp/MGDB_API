import prisma from "../lib/prisma.js";
import path from "path"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const uploadCover = async (req, res) => {
    const { titleId } = req.params
    try {
        if (!req.file.buffer) {
            return res.status(400).json({ error: "No image uploaded" });
        }
        const fileName = titleId + path.extname(req.file.originalname).toLowerCase();
        const titleCover = await prisma.$transaction(async (tx) => {
            const { data, error } = await supabase.storage
                .from("image-bucket")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                })
            if (error) throw error;

            const { data: image_url } = supabase.storage.from("image-bucket").getPublicUrl(fileName);

            return await tx.titleCover.upsert({
                where: {
                    titleId
                },
                create: {
                    titleId,
                    imageUrl: image_url.publicUrl,
                    addedBy: req.session.userId
                },
                update: {
                    titleId,
                    imageUrl: image_url.publicUrl,
                    addedBy: req.session.userId
                }
            })
        })
        return res.status(200).json({ id: titleId, message: "Cover uploaded", cover: titleCover })
    } catch (error) {
        res.status(500).json({ error: "Failed to upload cover", errorDetails: error.message });
    }
}

export const getCover = async (req, res) => {
    const { titleId } = req.params
    try {
        const titleCover = await prisma.titleCover.findFirst({
            where: {
                titleId
            }
        })
        if (!titleCover) return res.status(400).json({ error: "Cover not found" });
        return res.status(200).json({ id: titleId, cover: titleCover })
    } catch (error) {
        res.status(500).json({ error: "Failed to get cover", errorDetails: error.message });
    }

}