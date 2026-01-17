import { useState } from 'react';
import Navigation from './components/Navigation';
import MonitorPage from './pages/MonitorPage';
import ActivityPage from './pages/ActivityPage';

function App() {
  const [activeTab, setActiveTab] = useState('monitor');

  const renderPage = () => {
    switch (activeTab) {
      case 'monitor':
        return <MonitorPage />;
      case 'activity':
        return <ActivityPage />;
      case 'sleep':
        return (
          <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6 flex items-center justify-center">
            <p className="text-gray-500">Sleep tracking coming soon...</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6 flex items-center justify-center">
            <p className="text-gray-500">Alerts coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6 flex items-center justify-center">
            <p className="text-gray-500">Settings coming soon...</p>
          </div>
        );
      default:
        return <MonitorPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderPage()}
    </div>
  );
}

export default App;
