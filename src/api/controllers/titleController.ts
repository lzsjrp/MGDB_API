import prisma from "../lib/prisma.js";

export const createTitle = async (req, res) => {
    if (!req.body.title || !req.body.author || !req.body.type) {
        return res.status(400).json({ error: "Title, author, type are required" });
    }
    if (req.body.type !== "Manga" && req.body.type !== "Light Novel") {
        return res.status(400).json({ error: "Invalid type. Must be 'Manga' or 'Light Novel'" });
    }
    try {
        if (req.body.type === "Light Novel") {
            const newWebNovel = await prisma.webNovel.create({
                data: {
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description || "",
                    genre: req.body.genre || [],
                    addedBy: req.session.userId,
                    type: req.body.type,
                    status: req.body.status || "Ongoing",
                },
            });
            res.status(201).json({ id: newWebNovel.id, message: "Web novel created successfully", webNovel: newWebNovel });
        }
        if (req.body.type === "Manga") {
            const newManga = await prisma.manga.create({
                data: {
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description || "",
                    genre: req.body.genre || [],
                    addedBy: req.session.userId,
                    type: req.body.type,
                    status: req.body.status || "Ongoing",
                },
            });
            res.status(201).json({ id: newManga.id, message: "Manga created successfully", manga: newManga });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to create title", errorDetails: error.message });
    }
}

export const getTitle = async (req, res) => {
    const { webNovelId, mangaId } = req.params;
    try {
        if (webNovelId) {
            const webNovel = await prisma.webNovel.findUnique({
                where: { id: webNovelId },
                include: { volumes: true },
            });
            if (!webNovel) {
                return res.status(404).json({ error: "Web novel not found" });
            }
            return res.status(200).json({ id: webNovel.id, webNovel });
        }
        if (mangaId) {
            const manga = await prisma.manga.findUnique({
                where: { id: mangaId },
                include: { chapters: true },
            });
            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }
            return res.status(200).json({ id: manga.id, manga });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve title", errorDetails: error.message });
    }
}

export const deleteTitle = async (req, res) => {
    const { webNovelId, mangaId } = req.params;
    try {
        if (webNovelId) {
            const webNovel = await prisma.webNovel.findUnique({ where: { id: webNovelId } });
            if (!webNovel) {
                return res.status(404).json({ error: "Web novel not found" });
            }
            if (webNovel.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to delete this web novel" });
            }
            await prisma.webNovel.delete({ where: { id: webNovelId } });
            res.status(200).json({ id: webNovelId, message: "Web novel deleted successfully", webNovel });
        }
        if (mangaId) {
            const manga = await prisma.manga.findUnique({ where: { id: mangaId } });
            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }
            if (manga.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to delete this manga" });
            }
            await prisma.manga.delete({ where: { id: mangaId } });
            res.status(200).json({ id: mangaId, message: "Manga deleted successfully", manga });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete title", errorDetails: error.message });
    }
}

export const updateTitle = async (req, res) => {
    const { webNovelId, mangaId } = req.params;
    try {
        if (webNovelId) {
            const webNovel = await prisma.webNovel.findUnique({ where: { id: webNovelId } });
            if (!webNovel) {
                return res.status(404).json({ error: "Web novel not found" });
            }
            if (webNovel.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to update this web novel" });
            }
            const updatedWebNovel = await prisma.webNovel.update({
                where: { id: webNovelId },
                data: {
                    title: req.body.title || webNovel.title,
                    author: req.body.author || webNovel.author,
                    description: req.body.description || webNovel.description,
                    genre: req.body.genre || webNovel.genre,
                    type: req.body.type || webNovel.type,
                    status: req.body.status || webNovel.status,
                },
            });
            res.status(200).json({ id: updatedWebNovel.id, message: "Web novel updated successfully", webNovel: updatedWebNovel });
        }
        if (mangaId) {
            const manga = await prisma.manga.findUnique({ where: { id: mangaId } });
            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }
            if (manga.addedBy !== req.session.userId) {
                return res.status(403).json({ error: "You do not have permission to update this manga" });
            }
            const updatedManga = await prisma.manga.update({
                where: { id: mangaId },
                data: {
                    title: req.body.title || manga.title,
                    author: req.body.author || manga.author,
                    description: req.body.description || manga.description,
                    genre: req.body.genre || manga.genre,
                    type: req.body.type || manga.type,
                    status: req.body.status || manga.status,
                },
            });
            res.status(200).json({ id: manga.id, message: "Manga updated successfully", webNovel: updatedManga });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update title", errorDetails: error.message });
    }
}