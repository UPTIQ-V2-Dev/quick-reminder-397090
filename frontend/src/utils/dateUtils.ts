import { format } from 'date-fns';

export const formatReminderDate = (date: Date): string => {
    return format(date, 'PPP p'); // e.g., "December 25th, 2024 at 3:00 PM"
};

export const formatDateForInput = (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const isValidFutureDate = (date: Date): boolean => {
    return date > new Date();
};

export const parseDateTime = (dateTimeStr: string): Date => {
    return new Date(dateTimeStr);
};
