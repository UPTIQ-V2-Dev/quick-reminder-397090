import { forwardRef } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Clock } from 'lucide-react';
import { formatDateForInput } from '../../utils/dateUtils';

interface DateTimePickerProps {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(({ value, onChange, error }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const getMinDateTime = () => {
        const now = new Date();
        return formatDateForInput(now);
    };

    return (
        <div className='space-y-2'>
            <Label
                htmlFor='datetime'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                Time & Date:
            </Label>
            <div className='relative'>
                <Input
                    ref={ref}
                    id='datetime'
                    type='datetime-local'
                    value={value || ''}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    className={`w-full pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder='YYYY-M-DD HH:MM AM/PM'
                />
                <Clock className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            </div>
            {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
        </div>
    );
});

DateTimePicker.displayName = 'DateTimePicker';
