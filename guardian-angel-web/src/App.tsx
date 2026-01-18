import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
import Call from './pages/Call';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50">
          <Routes>
            
            <Route path="/monitor" element={
              <>
                <Navigation activeTab="monitor" />           
                <MonitorPage />
              </>
            } />

            <Route path="/activity" element={
              <>
                <Navigation activeTab="activity" />
                <ActivityPage />
              </>
            } />

            <Route path="/lullabies" element={
              <>
                <Navigation activeTab="lullabies" />
                <RecordPage />
              </>
            } />

            <Route path="/settings" element={
              <>
                <Navigation activeTab="settings" />
                <SettingsPage />
              </>
            } />

            <Route path="/call" element={
              <>
                <Navigation activeTab="activity" />
                <Call />
              </>
            } />

            <Route path="/storyteller" element={
              <>
                <Navigation activeTab="lullabies" />
                <StoryTeller />
              </>
            } />

            {/* Default Route */}
            <Route path="*" element={
                <>
                <Navigation activeTab="monitor" />
                <MonitorPage />
                </>
            } />

          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;