import prisma from "../lib/prisma";

export const useToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid Authorization header format" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const session = await prisma.session.findUnique({
            where: { token },
        });
        if (!session) {
            return res.status(401).json({ error: "Invalid session" });
        }
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, email: true, name: true },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid session" });
        }
        if (session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Session expired" });
        }
        req.session = { ...session, user };
        next();
    } catch (error) {
        console.error("Error validating session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};