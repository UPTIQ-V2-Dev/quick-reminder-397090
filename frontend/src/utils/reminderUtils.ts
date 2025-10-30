import { Reminder } from '../types/reminder';

export const sortRemindersByDate = (reminders: Reminder[]): Reminder[] => {
    return [...reminders].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
};

export const filterUpcomingReminders = (reminders: Reminder[]): Reminder[] => {
    return reminders.filter(reminder => reminder.status === 'upcoming');
};

export const isOverdue = (reminder: Reminder): boolean => {
    return reminder.dateTime < new Date() && reminder.status !== 'completed';
};

export const updateReminderStatuses = (reminders: Reminder[]): Reminder[] => {
    return reminders.map(reminder => ({
        ...reminder,
        status: isOverdue(reminder) ? 'overdue' : reminder.status
    }));
};
