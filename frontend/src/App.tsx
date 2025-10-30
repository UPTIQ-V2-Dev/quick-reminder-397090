import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { RemindersPage } from './pages/RemindersPage';
import { CreateReminderPage } from './pages/CreateReminderPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                    <Routes>
                        <Route
                            path='/'
                            element={<RemindersPage />}
                        />
                        <Route
                            path='/create'
                            element={<CreateReminderPage />}
                        />
                    </Routes>
                    <Toaster
                        position='top-right'
                        richColors
                    />
                </div>
            </Router>
        </QueryClientProvider>
    );
};
