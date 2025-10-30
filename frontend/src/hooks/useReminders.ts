import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createReminder, getReminders, deleteReminder, updateReminder } from '../services/reminderService';
import { Reminder } from '../types/reminder';

export const useReminders = () => {
    return useQuery({
        queryKey: ['reminders'],
        queryFn: getReminders
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            toast.success('Reminder created successfully!');
        },
        onError: () => {
            toast.error('Failed to create reminder');
        }
    });
};

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            toast.success('Reminder deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete reminder');
        }
    });
};

export const useUpdateReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Reminder> }) => updateReminder(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            toast.success('Reminder updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update reminder');
        }
    });
};
