import { Reminder, CreateReminderData } from '../types/reminder';
import { mockReminders } from '../data/reminderMockData';

const STORAGE_KEY = 'reminders';

export const createReminder = (data: CreateReminderData): Promise<Reminder> => {
    return new Promise(resolve => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const newReminder: Reminder = {
                id: Date.now().toString(),
                text: data.text,
                dateTime: data.dateTime,
                createdAt: new Date(),
                status: data.dateTime > new Date() ? 'upcoming' : 'overdue'
            };
            resolve(newReminder);
            return;
        }

        const reminders = getRemindersFromStorage();
        const newReminder: Reminder = {
            id: Date.now().toString(),
            text: data.text,
            dateTime: data.dateTime,
            createdAt: new Date(),
            status: data.dateTime > new Date() ? 'upcoming' : 'overdue'
        };

        const updatedReminders = [...reminders, newReminder];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));

        resolve(newReminder);
    });
};

export const getReminders = (): Promise<Reminder[]> => {
    return new Promise(resolve => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            resolve(mockReminders);
            return;
        }

        const reminders = getRemindersFromStorage();
        resolve(reminders);
    });
};

export const deleteReminder = (id: string): Promise<void> => {
    return new Promise(resolve => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            resolve();
            return;
        }

        const reminders = getRemindersFromStorage();
        const updatedReminders = reminders.filter(reminder => reminder.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));

        resolve();
    });
};

export const updateReminder = (id: string, updates: Partial<Reminder>): Promise<Reminder> => {
    return new Promise((resolve, reject) => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockReminder = mockReminders.find(r => r.id === id);
            if (!mockReminder) {
                reject(new Error('Reminder not found'));
                return;
            }
            resolve({ ...mockReminder, ...updates });
            return;
        }

        const reminders = getRemindersFromStorage();
        const reminderIndex = reminders.findIndex(reminder => reminder.id === id);

        if (reminderIndex === -1) {
            reject(new Error('Reminder not found'));
            return;
        }

        const updatedReminder = { ...reminders[reminderIndex], ...updates };
        reminders[reminderIndex] = updatedReminder;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
        resolve(updatedReminder);
    });
};

const getRemindersFromStorage = (): Reminder[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        return parsed.map((reminder: any) => ({
            ...reminder,
            dateTime: new Date(reminder.dateTime),
            createdAt: new Date(reminder.createdAt)
        }));
    } catch {
        return [];
    }
};
