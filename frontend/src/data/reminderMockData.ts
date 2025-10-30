import { Reminder } from '../types/reminder';

export const mockReminders: Reminder[] = [
    {
        id: '1',
        text: 'Call doctor for appointment',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        createdAt: new Date(),
        status: 'upcoming'
    },
    {
        id: '2',
        text: 'Buy groceries from the market',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        createdAt: new Date(),
        status: 'upcoming'
    },
    {
        id: '3',
        text: 'Submit project deadline',
        dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdAt: new Date(),
        status: 'upcoming'
    }
];
