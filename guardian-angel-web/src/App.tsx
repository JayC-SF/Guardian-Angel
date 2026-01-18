import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

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



function AppContent() {
  const { isLoading, isAuthenticated } = useAuth0();
  const { isDarkMode } = useTheme();

  // 1. Loading Spinner (While Auth0 checks if user is logged in)
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 transition-colors duration-200 ${
            isDarkMode ? 'border-rose-300' : 'border-rose-400'
          }`}></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50'
    }`}>
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

          <Route path="/lullaby" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="lullaby" />
                <RecordPage />
              </>
            ) : <Navigate to="/" replace />
          } />

          <Route path="/setting" element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="setting" />
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
          <Route path="/" element={<Navigate to={isAuthenticated ? "/monitor" : "/"} replace />} />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;