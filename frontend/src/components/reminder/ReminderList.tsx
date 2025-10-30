import { Reminder } from '../../types/reminder';
import { ReminderCard } from './ReminderCard';
import { sortRemindersByDate, updateReminderStatuses } from '../../utils/reminderUtils';
import { CalendarPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface ReminderListProps {
    reminders: Reminder[];
}

export const ReminderList = ({ reminders }: ReminderListProps) => {
    const updatedReminders = updateReminderStatuses(reminders);
    const sortedReminders = sortRemindersByDate(updatedReminders);

    if (sortedReminders.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-6'>
                        <CalendarPlus className='h-12 w-12 text-gray-400' />
                    </div>
                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>No reminders yet</h3>
                        <p className='text-gray-600 dark:text-gray-400 max-w-sm'>
                            Get started by creating your first reminder. Stay organized and never miss important tasks!
                        </p>
                    </div>
                    <Link to='/create'>
                        <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                            <CalendarPlus className='h-4 w-4 mr-2' />
                            Create Your First Reminder
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Your Reminders</h2>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>({sortedReminders.length})</span>
                </div>
                <Link to='/create'>
                    <Button
                        size='sm'
                        className='bg-blue-600 hover:bg-blue-700 text-white'
                    >
                        <CalendarPlus className='h-4 w-4 mr-2' />
                        Add New
                    </Button>
                </Link>
            </div>

            <div className='grid gap-4'>
                {sortedReminders.map(reminder => (
                    <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                    />
                ))}
            </div>
        </div>
    );
};
