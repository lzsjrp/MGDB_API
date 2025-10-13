import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createSession = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        const { password: _, createdAt: __, updatedAt: ___, ...safeUser } = user;
        let sessionWithUser = { ...session, user: safeUser };
        return res.status(200).json({ sessionWithUser });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", errorMessage: error.message, errorObj: error  });
    }
};

export const getSession = async (req, res) => {
    if (!req.session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json({ session: req.session });
};