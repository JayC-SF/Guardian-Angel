import Navigation from './components/Navigation';
import MonitorPage from './pages/MonitorPage';
import ActivityPage from './pages/ActivityPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import LullabiesPage from './pages/LullabiesPage';
import { Route, Routes, Navigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import BabyCameraNavigation from './components/BabyCameraNavigation';
import BabyCamera from './pages/BabyCamera';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  // Auto-redirect to monitor if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      window.history.replaceState(null, '', '/monitor');
    }
  }, [isAuthenticated, isLoading]);

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50">
      <Routes>
        {/* Login/Landing Page - Accessible to all, redirects if authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/monitor" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Protected Routes - Only accessible when authenticated */}
        <Route
          path="/monitor"
          element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="monitor" />
                <MonitorPage />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/activity"
          element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="activity" />
                <ActivityPage />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/call"
          element={
            isAuthenticated ? (
              <>
                <BabyCameraNavigation />
                <BabyCamera />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        <Route
          path="/setting"
          element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="setting" />
                <SettingPage />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/lullaby"
          element={
            isAuthenticated ? (
              <>
                <Navigation activeTab="lullaby" />
                <LullabiesPage />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/monitor" : "/"} replace />} />
      </Routes>
    </div>
  );
}

export default App;