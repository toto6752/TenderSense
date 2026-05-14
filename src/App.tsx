import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TenderList from './pages/TenderList';
import TenderDetail from './pages/TenderDetail';
import AIAssistant from './pages/AIAssistant';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { StatsProvider } from './context/StatsContext';
import ProtectedRoute from './components/ProtectedRoute';

import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import FloatingChat from './components/FloatingChat';
import AdminStatsModal from './components/AdminStatsModal';

export default function App() {
  return (
    <LanguageProvider>
      <StatsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<Home />} />
              
              {/* Auth Pages */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/register" element={<Navigate to="/auth" replace />} />
              <Route path="/verify/:token" element={<VerifyEmail />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Dashboard/Platform Area (Protected) */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenders" element={<TenderList />} />
                <Route path="/tenders/:id" element={<TenderDetail />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/profile" element={<UserProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FloatingChat />
            <AdminStatsModal />
          </BrowserRouter>
        </AuthProvider>
      </StatsProvider>
    </LanguageProvider>
  );
}
