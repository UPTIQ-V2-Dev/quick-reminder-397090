import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { DateTimePicker } from './DateTimePicker';
import { CreateReminderInput } from '../../types/reminder';
import { parseDateTime, isValidFutureDate } from '../../utils/dateUtils';

const reminderSchema = z.object({
    text: z.string().min(1, 'Reminder text is required').max(500, 'Reminder text must be less than 500 characters'),
    dateTime: z
        .string()
        .min(1, 'Date and time is required')
        .refine(dateStr => {
            const date = parseDateTime(dateStr);
            return isValidFutureDate(date);
        }, 'Date and time must be in the future')
});

interface CreateReminderFormProps {
    onSubmit: (data: CreateReminderInput) => void;
    isLoading?: boolean;
}

export const CreateReminderForm = ({ onSubmit, isLoading = false }: CreateReminderFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreateReminderInput>({
        resolver: zodResolver(reminderSchema)
    });

    const dateTimeValue = watch('dateTime');

    const handleFormSubmit = (data: CreateReminderInput) => {
        onSubmit(data);
    };

    return (
        <div className='max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg'>
            <h1 className='text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white'>Create New Reminder</h1>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className='space-y-6'
            >
                <div className='space-y-2'>
                    <Label
                        htmlFor='reminder-text'
                        className='text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                        Reminder:
                    </Label>
                    <Textarea
                        id='reminder-text'
                        placeholder='Enter your reminder details... (e.g., Call doctor, Buy groceries, Project deadline)'
                        className={`resize-none h-24 ${errors.text ? 'border-red-500 focus:ring-red-500' : ''}`}
                        {...register('text')}
                    />
                    {errors.text && <p className='text-sm text-red-500 mt-1'>{errors.text.message}</p>}
                </div>

                <DateTimePicker
                    value={dateTimeValue}
                    onChange={value => setValue('dateTime', value)}
                    error={errors.dateTime?.message}
                />

                <Button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium'
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Reminder'}
                </Button>
            </form>
        </div>
    );
};
