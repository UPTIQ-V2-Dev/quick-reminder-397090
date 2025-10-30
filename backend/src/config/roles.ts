import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['getReminders', 'manageReminders'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'getReminders', 'manageReminders']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
