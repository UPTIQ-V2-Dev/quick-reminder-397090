export interface Reminder {
    id: string;
    text: string;
    dateTime: Date;
    createdAt: Date;
    status: 'upcoming' | 'overdue' | 'completed';
}

export interface CreateReminderData {
    text: string;
    dateTime: Date;
}

export interface CreateReminderInput {
    text: string;
    dateTime: string;
}
