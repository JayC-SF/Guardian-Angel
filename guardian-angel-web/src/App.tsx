import Navigation from './components/Navigation';
import MonitorPage from './pages/MonitorPage';
import ActivityPage from './pages/ActivityPage';
import { RecordPage } from './pages/RecordPage';
import SettingsPage from './pages/SettingsPage';
import { BrowserRouter, Route, Routes }  from 'react-router';
import StoryTeller from './components/Storyteller';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/monitor" element={
            <>
              <Navigation activeTab={"monitor"} />
              
              <MonitorPage />
              <StoryTeller />
              
            </>} />
          <Route path="/activity" element={
            <>
              <Navigation activeTab={"activity"} />
              <ActivityPage />
            </>} />
          <Route path="/lullabies" element={
            <>
              <Navigation activeTab={"lullabies"} />
              <RecordPage />
            </>} />
          <Route path="/settings" element={
            <>
              <Navigation activeTab={"settings"} />
              <SettingsPage />
            </>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
