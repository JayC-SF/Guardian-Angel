import { Baby, Activity, Moon, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';

interface NavigationProps {
  activeTab: string;
}

const Navigation = ({ activeTab }: NavigationProps) => {
  const { user, logout } = useAuth0();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'monitor', label: 'Live Monitor', icon: Baby },
    //{ id: 'activity', label: 'View', icon: Activity },
    { id: 'lullaby', label: 'Lullaby', icon: Moon },
    //{ id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'setting', label: 'Setting', icon: Settings },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={`/${tab.id}`}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                      transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-50 to-blue-50 text-rose-600 shadow-sm'
                        : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-rose-50/50 transition-all cursor-pointer"
              >
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-rose-200"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-rose-100 z-50">
                  <div className="p-4 border-b border-rose-50">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout({ logoutParams: { returnTo: window.location.origin } });
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
