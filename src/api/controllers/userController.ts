import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    const { email, name, password } = req.body || {};
    if (!email || !name || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: "Email already in use" });
            }
            const newUser = await tx.user.create({
                data: { email, name, password: hash },
            });
            return res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
        })
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to register user", errorMessage: error.message, errorObj: error });
    }
};

export const getSessionUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { id: true, email: true, name: true, permissions: true }
        });
        if (!user) {
            return res.status(500).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch user", errorMessage: error.message, errorObj: error });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params || {};
    if (!id) {
        return res.status(400).json({ error: "Missing user identifier" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: id.includes('@') ? { email: id } : { id },
            select: { id: true, email: true, name: true, permissions: true }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params || {};
    if (!id) {
        return res.status(400).json({ error: "Missing user identifier" });
    }
    if (req.session.userId !== id && req.session.user.email !== id) {
        return res.status(403).json({ error: "Unauthorized to delete this user" });
    }
    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: id.includes('@') ? { email: id } : { id },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            await tx.user.delete({
                where: { id: user.id }
            });
            return res.status(200).json({ message: "User deleted successfully" });
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Failed to delete user", errorMessage: error.message, errorObj: error  });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params || {};
    const { email, name, password } = req.body || {};
    if (!id) {
        return res.status(400).json({ error: "Missing user identifier" });
    }
    if (req.session.userId !== id && req.session.user.email !== id) {
        return res.status(403).json({ error: "Unauthorized to update this user" });
    }
    if (!email && !name && !password) {
        return res.status(400).json({ error: "No fields to update" });
    }
    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: id.includes('@') ? { email: id } : { id },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const updateData = { email: undefined, name: undefined, password: undefined };
            if (email) updateData.email = email;
            if (name) updateData.name = name;
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
                await tx.session.deleteMany({ where: { userId: user.id } });
            }
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: updateData,
                select: { id: true, email: true, name: true, permissions: true }
            });
            return res.status(200).json(updatedUser);
        }
        );
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user", errorMessage: error.message, errorObj: error  });
    }
};