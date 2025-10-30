import { useNavigate } from 'react-router-dom';
import { CreateReminderForm } from '../components/reminder/CreateReminderForm';
import { useCreateReminder } from '../hooks/useReminders';
import { CreateReminderInput } from '../types/reminder';
import { parseDateTime } from '../utils/dateUtils';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const CreateReminderPage = () => {
    const navigate = useNavigate();
    const createReminderMutation = useCreateReminder();

    const handleSubmit = (data: CreateReminderInput) => {
        const reminderData = {
            text: data.text,
            dateTime: parseDateTime(data.dateTime)
        };

        createReminderMutation.mutate(reminderData, {
            onSuccess: () => {
                navigate('/');
            }
        });
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-6'>
                    <Button
                        variant='ghost'
                        onClick={handleGoBack}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to Reminders
                    </Button>
                </div>

                <CreateReminderForm
                    onSubmit={handleSubmit}
                    isLoading={createReminderMutation.isPending}
                />
            </div>
        </div>
    );
};
