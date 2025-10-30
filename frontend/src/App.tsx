import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { LoginPage } from './pages/LoginPage';
import { RemindersPage } from './pages/RemindersPage';
import { CreateReminderPage } from './pages/CreateReminderPage';
import { isAuthenticated } from './lib/api';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? (
        <>{children}</>
    ) : (
        <Navigate
            to='/login'
            replace
        />
    );
};

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                    <Routes>
                        <Route
                            path='/login'
                            element={<LoginPage />}
                        />
                        <Route
                            path='/'
                            element={
                                <ProtectedRoute>
                                    <RemindersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/create'
                            element={
                                <ProtectedRoute>
                                    <CreateReminderPage />
                                </ProtectedRoute>
                            }
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
