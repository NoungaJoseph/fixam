import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { useEffect } from 'react';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProviderHomePage from './pages/ProviderHomePage';
import ProviderListPage from './pages/ProviderListPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import PostTaskPage from './pages/PostTaskPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import WalletPage from './pages/WalletPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CategoryHubPage from './pages/CategoryHubPage';

function AuthRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate(user.role?.toUpperCase() === 'PROVIDER' ? '/provider-home' : '/home', { replace: true });
  }, [user, navigate]);
  return null;
}

function AppRoutes() {
  const { user, isLoading, isRestoring } = useAuth();

  if (isLoading || isRestoring) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 border-2 border-[var(--navy)] border-t-transparent animate-spin rounded-none" />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Loading Fixam</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/categories" element={<CategoryHubPage />} />
        <Route path="/providers" element={<ProviderListPage />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/profile/:userId" element={<ProviderProfilePage />} />

        <Route path="/login" element={user ? <Navigate to={user.role?.toUpperCase() === 'PROVIDER' ? '/provider-home' : '/home'} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={user.role?.toUpperCase() === 'PROVIDER' ? '/provider-home' : '/home'} /> : <RegisterPage />} />

        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/provider-home" element={user ? <ProviderHomePage /> : <Navigate to="/login" />} />
        <Route path="/post-task" element={user ? <PostTaskPage /> : <Navigate to="/login" />} />

        <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/messages/:conversationId" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <Navigate to="/messages" replace /> : <Navigate to="/login" />} />

        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <WalletPage /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to={user ? (user.role?.toUpperCase() === 'PROVIDER' ? '/provider-home' : '/home') : '/'} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
