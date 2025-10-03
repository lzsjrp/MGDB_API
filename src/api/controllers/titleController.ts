import prisma from "../lib/prisma.js";

export const createTitle = async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.type) {
            return res.status(400).json({ error: "Title, author and type are required" });
        }
        if (req.body.type !== "MANGA" && req.body.type !== "WEB_NOVEL") {
            return res.status(400).json({ error: "Invalid type. Must be 'MANGA' or 'WEB_NOVEL'" });
        }
        const newBook = await prisma.book.create({
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
        res.status(201).json({ id: newBook.id, message: "Title created successfully", book: newBook });
    } catch (error) {
        res.status(500).json({ error: "Failed to create title", errorDetails: error.message });
    }
}

export const getTitle = async (req, res) => {
    const { titleId } = req.params;
    try {
        const book = await prisma.book.findUnique({
            where: { id: titleId },
            include: { volumes: true },
        });
        if (!book) {
            return res.status(404).json({ error: "Title not found" });
        }
        return res.status(200).json({ id: book.id, book });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve title", errorDetails: error.message });
    }
}

export const deleteTitle = async (req, res) => {
    const { titleId } = req.params;
    try {
        const book = await prisma.book.findUnique({ where: { id: titleId } });
        if (!book) {
            return res.status(404).json({ error: "Title not found" });
        }
        if (book.addedBy !== req.session.userId) {
            return res.status(403).json({ error: "You do not have permission to delete this web novel" });
        }
        await prisma.book.delete({ where: { id: titleId } });
        res.status(200).json({ id: titleId, message: "Title deleted successfully", book });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete title", errorDetails: error.message });
    }
}

export const updateTitle = async (req, res) => {
    const { titleId } = req.params;
    try {
        const book = await prisma.book.findUnique({ where: { id: titleId } });
        if (!book) {
            return res.status(404).json({ error: "Title not found" });
        }
        if (book.addedBy !== req.session.userId) {
            return res.status(403).json({ error: "You do not have permission to update this web novel" });
        }
        const updatedBook = await prisma.book.update({
            where: { id: titleId },
            data: {
                title: req.body.title || book.title,
                author: req.body.author || book.author,
                description: req.body.description || book.description,
                genre: req.body.genre || book.genre,
                type: req.body.type || book.type,
                status: req.body.status || book.status,
            },
        });
        res.status(200).json({ id: book.id, message: "Title updated successfully", book: updatedBook });
    } catch (error) {
        res.status(500).json({ error: "Failed to update title", errorDetails: error.message });
    }
}