// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import KYCVerification from './modules/KYCVerification';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { user, isAuthenticated, isKYCVerified } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/verify" 
          element={isAuthenticated && !isKYCVerified ? <KYCVerification /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard/*" 
          element={isAuthenticated && isKYCVerified ? <Dashboard user={user} /> : <Navigate to="/verify" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
