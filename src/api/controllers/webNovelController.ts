import prisma from "../lib/prisma.js";

export const createWebNovel = async (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).json({ error: "Title and author are required" });
    }
    try {
        const newWebNovel = await prisma.webNovel.create({
            data: {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description || "",
                genre: req.body.genre || [],
                addedBy: req.session.userId,
                type: req.body.type || "Light Novel",
                status: req.body.status || "Ongoing",
            },
        });
        res.status(201).json({ id: newWebNovel.id, message: "Web novel created successfully", webNovel: newWebNovel });
    } catch (error) {
        res.status(500).json({ error: "Failed to create web novel", errorDetails: error.message });
    }
}

export const getWebNovel = async (req, res) => {
    const { webnovelId } = req.params;
    try {
        const webNovel = await prisma.webNovel.findUnique({
            where: { id: webnovelId },
            include: { chapter: true, NovelCover: true },
        });
        if (!webNovel) {
            return res.status(404).json({ error: "Web novel not found" });
        }
        res.status(200).json({ id: webNovel.id, webNovel });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve web novel", errorDetails: error.message });
    }
}

export const deleteWebNovel = async (req, res) => {
    const { webnovelId } = req.params;
    try {
        const webNovel = await prisma.webNovel.findUnique({ where: { id: webnovelId } });
        if (!webNovel) {
            return res.status(404).json({ error: "Web novel not found" });
        }
        if (webNovel.addedBy !== req.session.userId) {
            return res.status(403).json({ error: "You do not have permission to delete this web novel" });
        }
        await prisma.webNovel.delete({ where: { id: webnovelId } });
        res.status(200).json({ id: webnovelId, message: "Web novel deleted successfully", webNovel });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete web novel", errorDetails: error.message });
    }
}

export const updateWebNovel = async (req, res) => {
    const { webnovelId } = req.params;
    try {
        const webNovel = await prisma.webNovel.findUnique({ where: { id: webnovelId } });
        if (!webNovel) {
            return res.status(404).json({ error: "Web novel not found" });
        }
        if (webNovel.addedBy !== req.session.userId) {
            return res.status(403).json({ error: "You do not have permission to update this web novel" });
        }
        const updatedWebNovel = await prisma.webNovel.update({
            where: { id: webnovelId },
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
    } catch (error) {
        res.status(500).json({ error: "Failed to update web novel", errorDetails: error.message });
    }
}