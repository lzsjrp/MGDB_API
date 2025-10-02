import prisma from "../lib/prisma.js";
import fs from "fs"
import path from "path"

const projectRoot = process.cwd();

export const uploadCover = async (req, res) => {
    const { titleId } = req.params
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }
        const titleImg = await prisma.titleCover.upsert({
            where: {
                titleId
            },
            create: {
                titleId,
                imageUrl: req.file.filename,
                addedBy: req.session.userId
            },
            update: {
                titleId,
                imageUrl: req.file.filename,
                addedBy: req.session.userId
            }
        })
        return res.status(201).json({ id: titleId, message: "Cover uploaded successfully", cover: titleImg });
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
        const imagePath = path.join(projectRoot, 'covers', titleCover.imageUrl);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Cover not found" });;
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get cover", errorDetails: error.message });
    }

}