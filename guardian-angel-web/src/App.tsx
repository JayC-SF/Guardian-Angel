import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navigation from './components/Navigation';
import StoryTeller from './components/Storyteller';

// Pages
import MonitorPage from './pages/MonitorPage';
import ActivityPage from './pages/ActivityPage';
import { RecordPage } from './pages/RecordPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import BabyCameraNavigation from './components/BabyCameraNavigation';
import BabyCamera from './pages/BabyCamera';



function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  // 1. Loading Spinner (While Auth0 checks if user is logged in)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50">
        <Routes>
          
          {/* --- PUBLIC ROUTE --- */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/monitor" replace /> : <LoginPage />
          } />

          {/* --- PROTECTED ROUTES (Require Login) --- */}
          
          {/* Monitor: Includes your StoryTeller! */}
          <Route path="/monitor" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="monitor" />
                <div className="space-y-6">
                    <MonitorPage />
                    <StoryTeller />
                </div>
              </>
            ) : <Navigate to="/" replace />
          } />

          <Route path="/activity" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="activity" />
                <ActivityPage />
              </>
            ) : <Navigate to="/" replace />
          } />

          <Route path="/lullabies" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="lullabies" />
                <RecordPage />
              </>
            ) : <Navigate to="/" replace />
          } />

          <Route path="/settings" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="settings" />
                <SettingsPage />
              </>
            ) : <Navigate to="/" replace />
          } />

          <Route path="/call" element={
            isAuthenticated ? (
              <>
                
                <BabyCameraNavigation />
                <BabyCamera />
              </>
            ) : <Navigate to="/" replace />
          } />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/monitor" : "/"} replace />} />

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;