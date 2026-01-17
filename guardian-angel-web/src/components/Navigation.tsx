import { Baby, Activity, Moon, Bell, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const tabs = [
    { id: 'monitor', label: 'Live Monitor', icon: Baby },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'sleep', label: 'Sleep Tracking', icon: Moon },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-rose-100 to-blue-100 p-2 rounded-xl">
              <Baby className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-rose-400 to-blue-400 bg-clip-text text-transparent">
              Guardian Angel
            </h1>
          </div>

          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-50 to-blue-50 text-rose-600 shadow-sm'
                        : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
