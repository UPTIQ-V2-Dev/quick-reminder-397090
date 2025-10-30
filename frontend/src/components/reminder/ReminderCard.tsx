import { Reminder } from '../../types/reminder';
import { formatReminderDate } from '../../utils/dateUtils';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Trash2 } from 'lucide-react';
import { useDeleteReminder } from '../../hooks/useReminders';

interface ReminderCardProps {
    reminder: Reminder;
}

export const ReminderCard = ({ reminder }: ReminderCardProps) => {
    const deleteReminderMutation = useDeleteReminder();

    const handleDelete = () => {
        deleteReminderMutation.mutate(reminder.id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const isOverdue = reminder.dateTime < new Date() && reminder.status !== 'completed';

    return (
        <Card
            className={`transition-all duration-200 hover:shadow-md ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}
        >
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
                <div className='flex items-center gap-2'>
                    <Badge className={getStatusColor(isOverdue ? 'overdue' : reminder.status)}>
                        {isOverdue ? 'Overdue' : reminder.status}
                    </Badge>
                </div>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDelete}
                    className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                    disabled={deleteReminderMutation.isPending}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </CardHeader>

            <CardContent className='space-y-3'>
                <p className='text-gray-900 dark:text-gray-100 text-sm leading-relaxed'>{reminder.text}</p>

                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                    <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        <span>{formatReminderDate(reminder.dateTime)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
