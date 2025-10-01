import prisma from "../lib/prisma.js";

export const createChapter = async (req, res) => {
    console.log(req.params)
    if (!req.body.number || !req.body.volume || !req.body.type) {
        return res.status(400).json({ error: "Number, volume, and type are required" });
    }
    try {
        if (req.body.type !== "Manga" && req.body.type !== "Light Novel" && req.body.type !== "One Shot") {
            return res.status(400).json({ error: "Invalid type. Must be 'Manga', 'Light Novel', or 'One Shot'" });
        }
        if (req.body.type === "One Shot") {
            req.body.volume = "One Shot"
            req.body.number = 1;
            return res.status(400).json({ error: "Not implemented yet" });
        }
        if (req.body.type === "Manga") {
            return res.status(400).json({ error: "Not implemented yet" });
        }
        if (req.body.type === "Light Novel") {
            if (!req.body.volume || req.body.volume < 1) {
                return res.status(400).json({ error: "Volume must be a positive integer" });
            }
            if (req.body.number < 1) {
                return res.status(400).json({ error: "Number must be a positive integer" });
            }
            const existingChapter = await prisma.novelChapter.findFirst({
                where: {
                    webNovelId: req.params.webnovelId,
                    number: Number(req.body.number),
                },
            });
            if (existingChapter) {
                return res.status(409).json({ error: "Chapter number already exists" });
            }
            await prisma.$transaction(async (tx) => {
                const volume = await tx.novelVolume.findFirst({
                    where: {
                        webNovelId: req.params.webnovelId,
                        number: Number(req.body.volume),
                    },
                });
                let newVolume;
                if (!volume) {
                    newVolume = await tx.novelVolume.create({
                        data: {
                            webNovelId: req.params.webnovelId,
                            number: Number(req.body.volume),
                            addedBy: req.session.userId,
                            title: req.body.volumeTitle || `Volume ${req.body.volume}`
                        },
                    });
                }
                const newChapter = await tx.novelChapter.create({
                    data: {
                        webNovelId: req.params.webnovelId,
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
    const { chapterId } = req.params;
    try {
        const chapter = await prisma.novelChapter.findUnique({
            where: { id: chapterId },
        });
        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }
        res.status(200).json({ id: chapter.id, chapter });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve chapter", errorDetails: error.message });
    }
}

export const deleteChapter = async (req, res) => {
    const { chapterId } = req.params;
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

export const updateChapter = async (req, res) => {
    return res.status(400).json({ error: "Not implemented yet" });
}