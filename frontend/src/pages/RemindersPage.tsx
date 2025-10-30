import { useReminders } from '../hooks/useReminders';
import { ReminderList } from '../components/reminder/ReminderList';
import { Button } from '../components/ui/button';
import { AlertCircle, CalendarPlus, RefreshCw, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { toast } from 'sonner';

export const RemindersPage = () => {
    const { data: reminders = [], isLoading, error, refetch } = useReminders();
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            toast.success('Logged out successfully');
            navigate('/login');
        },
        onError: (error: any) => {
            console.error('Logout error:', error);
            toast.error('Logout failed. Please try again.');
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='flex items-center gap-3'>
                    <RefreshCw className='h-6 w-6 animate-spin text-blue-600' />
                    <span className='text-gray-600 dark:text-gray-400'>Loading reminders...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center p-8'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='rounded-full bg-red-100 dark:bg-red-900 p-6'>
                            <AlertCircle className='h-12 w-12 text-red-600 dark:text-red-400' />
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                                Failed to load reminders
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                There was an error loading your reminders. Please try again.
                            </p>
                        </div>
                        <Button
                            onClick={() => refetch()}
                            variant='outline'
                        >
                            <RefreshCw className='h-4 w-4 mr-2' />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-2'>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>My Reminders</h1>
                        <div className='flex items-center gap-3'>
                            <Link to='/create'>
                                <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                                    <CalendarPlus className='h-4 w-4 mr-2' />
                                    Create Reminder
                                </Button>
                            </Link>
                            <Button
                                variant='outline'
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className='h-4 w-4 mr-2' />
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </Button>
                        </div>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400'>Stay organized and never miss important tasks</p>
                </div>

                <ReminderList reminders={reminders} />
            </div>
        </div>
    );
};
