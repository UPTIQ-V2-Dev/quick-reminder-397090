import prisma from "../client.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';
/**
 * Create a reminder
 * @param {number} userId
 * @param {string} text
 * @param {Date} dateTime
 * @returns {Promise<Reminder>}
 */
const createReminder = async (userId, text, dateTime) => {
    return await prisma.reminder.create({
        data: {
            text,
            dateTime,
            userId
        }
    });
};
/**
 * Query for reminders
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Reminder[]>}
 */
const queryReminders = async (filter, options) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const reminders = await prisma.reminder.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: 'desc' }
    });
    return reminders;
};
/**
 * Get reminder by id
 * @param {string} id
 * @param {number} userId - User ID to ensure ownership
 * @returns {Promise<Reminder | null>}
 */
const getReminderById = async (id, userId) => {
    return await prisma.reminder.findFirst({
        where: {
            id,
            userId
        }
    });
};
/**
 * Update reminder by id
 * @param {string} reminderId
 * @param {number} userId - User ID to ensure ownership
 * @param {Object} updateBody
 * @returns {Promise<Reminder>}
 */
const updateReminderById = async (reminderId, userId, updateBody) => {
    const reminder = await getReminderById(reminderId, userId);
    if (!reminder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reminder not found');
    }
    const updatedReminder = await prisma.reminder.update({
        where: { id: reminder.id },
        data: updateBody
    });
    return updatedReminder;
};
/**
 * Delete reminder by id
 * @param {string} reminderId
 * @param {number} userId - User ID to ensure ownership
 * @returns {Promise<Reminder>}
 */
const deleteReminderById = async (reminderId, userId) => {
    const reminder = await getReminderById(reminderId, userId);
    if (!reminder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reminder not found');
    }
    await prisma.reminder.delete({ where: { id: reminder.id } });
    return reminder;
};
export default {
    createReminder,
    queryReminders,
    getReminderById,
    updateReminderById,
    deleteReminderById
};
