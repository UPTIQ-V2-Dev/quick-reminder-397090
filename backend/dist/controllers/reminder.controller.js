import { reminderService } from "../services/index.js";
import ApiError from "../utils/ApiError.js";
import catchAsyncWithAuth from "../utils/catchAsyncWithAuth.js";
import pick from "../utils/pick.js";
import httpStatus from 'http-status';
const createReminder = catchAsyncWithAuth(async (req, res) => {
    const { text, dateTime } = req.body;
    const userId = req.user.id;
    const reminder = await reminderService.createReminder(userId, text, new Date(dateTime));
    res.status(httpStatus.CREATED).send(reminder);
});
const getReminders = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const filter = { userId, ...pick(req.validatedQuery, ['status']) };
    const options = pick(req.validatedQuery, ['limit', 'page']);
    const result = await reminderService.queryReminders(filter, options);
    res.send(result);
});
const getReminder = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const reminder = await reminderService.getReminderById(req.params.reminderId, userId);
    if (!reminder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reminder not found');
    }
    res.send(reminder);
});
const updateReminder = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const updateBody = { ...req.body };
    if (updateBody.dateTime) {
        updateBody.dateTime = new Date(updateBody.dateTime);
    }
    const reminder = await reminderService.updateReminderById(req.params.reminderId, userId, updateBody);
    res.send(reminder);
});
const deleteReminder = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    await reminderService.deleteReminderById(req.params.reminderId, userId);
    res.status(httpStatus.OK).send({});
});
export default {
    createReminder,
    getReminders,
    getReminder,
    updateReminder,
    deleteReminder
};
