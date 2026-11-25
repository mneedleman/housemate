import { Navigate, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import AuthPage from './components/auth/AuthPage';
import AuthProvider from './components/auth/AuthProvider';
import AuthedRoute from './components/auth/AuthedRoute';
import DashboardPage from './components/dashboard/DashboardPage';
import HouseholdsPage from './components/households/HouseholdsPage';
import LeftoversPage from './components/leftovers/LeftoversPage';
import TestApi from './components/TestApi';
import TimelinePage from './components/timeline/TimelinePage';

const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path={'/dashboard'} element={<AuthedRoute><DashboardPage /></AuthedRoute>} />
        <Route path={'/timeline'} element={<AuthedRoute><TimelinePage /></AuthedRoute>} />
        <Route path={'/login'} element={<AuthPage to={'/dashboard'} />} />
        <Route path={'/testApi'} element={<AuthedRoute><TestApi /></AuthedRoute>} />
        <Route path={'/leftovers'} element={<AuthedRoute><LeftoversPage /></AuthedRoute>} />
        <Route path={'/households'} element={<AuthedRoute><HouseholdsPage /></AuthedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeButton={false}
        theme={prefersDark ? 'dark' : 'light'}
      />
    </AuthProvider>
  );
}

export default App;
