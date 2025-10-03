import prisma from "../lib/prisma.js";

enum PermissionsList {
    BLANK = 1 << 0,
}

const Permissions = {
    hasPermission: async (userId: string, requiredPermission: keyof typeof PermissionsList): Promise<boolean> => {
        if (!userId) return false

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { permissions: true }
        })
        if (!user) return false

        return (user.permissions & PermissionsList[requiredPermission]) === PermissionsList[requiredPermission];
    },
    addPermission: async (userId: string, permissionToAdd: keyof typeof PermissionsList): Promise<boolean> => {
        if (!userId) return false;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { permissions: true }
        });
        if (!user) return false;

        const newValue = user.permissions | PermissionsList[permissionToAdd];

        await prisma.user.update({
            where: { id: userId },
            data: { permissions: newValue }
        });

        return true;
    },
    removePermission: async (userId: string, permissionToAdd: keyof typeof PermissionsList): Promise<boolean> => {
        if (!userId) return false;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { permissions: true }
        });
        if (!user) return false;

        const newValue = user.permissions & ~PermissionsList[permissionToAdd];

        await prisma.user.update({
            where: { id: userId },
            data: { permissions: newValue }
        });

        return true;
    },
    listPermissions: async (userId): Promise<(keyof typeof PermissionsList)[]> => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { permissions: true }
        });
        if (!user) return [];

        const userPermissionsValue = user.permissions;

        return (Object.keys(PermissionsList) as (keyof typeof PermissionsList)[]).filter(permissionKey =>
            (userPermissionsValue & PermissionsList[permissionKey]) === PermissionsList[permissionKey]
        );
    }
};

export default Permissions;