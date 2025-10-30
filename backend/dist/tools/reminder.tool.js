import { reminderService } from "../services/index.js";
import pick from "../utils/pick.js";
import { z } from 'zod';
const reminderSchema = z.object({
    id: z.string(),
    text: z.string(),
    dateTime: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number()
});
const createReminderTool = {
    id: 'reminder_create',
    name: 'Create Reminder',
    description: 'Create a new reminder for authenticated user',
    inputSchema: z.object({
        text: z.string().min(1),
        dateTime: z.string().datetime(),
        userId: z.number().int()
    }),
    outputSchema: reminderSchema,
    fn: async (inputs) => {
        const reminder = await reminderService.createReminder(inputs.userId, inputs.text, new Date(inputs.dateTime));
        return {
            ...reminder,
            dateTime: reminder.dateTime.toISOString(),
            createdAt: reminder.createdAt.toISOString(),
            updatedAt: reminder.updatedAt.toISOString()
        };
    }
};
const getRemindersTool = {
    id: 'reminder_get_all',
    name: 'Get All Reminders',
    description: 'Get all reminders for authenticated user with optional filters and pagination',
    inputSchema: z.object({
        userId: z.number().int(),
        status: z.string().optional(),
        limit: z.number().int().optional(),
        page: z.number().int().optional()
    }),
    outputSchema: z.object({
        reminders: z.array(reminderSchema)
    }),
    fn: async (inputs) => {
        const filter = { userId: inputs.userId, ...pick(inputs, ['status']) };
        const options = pick(inputs, ['limit', 'page']);
        const result = await reminderService.queryReminders(filter, options);
        return {
            reminders: result.map(reminder => ({
                ...reminder,
                dateTime: reminder.dateTime.toISOString(),
                createdAt: reminder.createdAt.toISOString(),
                updatedAt: reminder.updatedAt.toISOString()
            }))
        };
    }
};
const getReminderTool = {
    id: 'reminder_get_by_id',
    name: 'Get Reminder By ID',
    description: 'Get a single reminder by ID for authenticated user',
    inputSchema: z.object({
        reminderId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: reminderSchema,
    fn: async (inputs) => {
        const reminder = await reminderService.getReminderById(inputs.reminderId, inputs.userId);
        if (!reminder) {
            throw new Error('Reminder not found');
        }
        return {
            ...reminder,
            dateTime: reminder.dateTime.toISOString(),
            createdAt: reminder.createdAt.toISOString(),
            updatedAt: reminder.updatedAt.toISOString()
        };
    }
};
const updateReminderTool = {
    id: 'reminder_update',
    name: 'Update Reminder',
    description: 'Update reminder information by ID for authenticated user',
    inputSchema: z.object({
        reminderId: z.string(),
        userId: z.number().int(),
        text: z.string().optional(),
        dateTime: z.string().datetime().optional(),
        status: z.string().optional()
    }),
    outputSchema: reminderSchema,
    fn: async (inputs) => {
        const updateBody = pick(inputs, ['text', 'status']);
        if (inputs.dateTime) {
            updateBody.dateTime = new Date(inputs.dateTime);
        }
        const reminder = await reminderService.updateReminderById(inputs.reminderId, inputs.userId, updateBody);
        if (!reminder) {
            throw new Error('Reminder not found');
        }
        return {
            ...reminder,
            dateTime: reminder.dateTime.toISOString(),
            createdAt: reminder.createdAt.toISOString(),
            updatedAt: reminder.updatedAt.toISOString()
        };
    }
};
const deleteReminderTool = {
    id: 'reminder_delete',
    name: 'Delete Reminder',
    description: 'Delete a reminder by ID for authenticated user',
    inputSchema: z.object({
        reminderId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    fn: async (inputs) => {
        await reminderService.deleteReminderById(inputs.reminderId, inputs.userId);
        return { success: true };
    }
};
export const reminderTools = [
    createReminderTool,
    getRemindersTool,
    getReminderTool,
    updateReminderTool,
    deleteReminderTool
];
