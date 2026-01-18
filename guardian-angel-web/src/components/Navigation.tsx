import { Baby, Moon, Settings, LogOut, Video } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  activeTab: string;
}

const Navigation = ({ activeTab }: NavigationProps) => {
  const { user, logout } = useAuth0();
  const { isDarkMode } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'monitor', label: 'Live Monitor', icon: Baby },
    //{ id: 'activity', label: 'View', icon: Activity },
    { id: 'lullaby', label: 'Lullaby', icon: Moon },
    { id: 'call', label: 'Feed', icon: Video },
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
    <nav className={`border-b shadow-sm transition-colors duration-200 ${isDarkMode
      ? 'bg-slate-800 border-slate-700'
      : 'bg-white border-rose-100'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl transition-colors duration-200 ${isDarkMode
              ? 'bg-gradient-to-br from-rose-900/30 to-blue-900/30'
              : 'bg-gradient-to-br from-rose-100 to-blue-100'
              }`}>
              <Baby className={`w-6 h-6 transition-colors duration-200 ${isDarkMode ? 'text-rose-300' : 'text-rose-500'
                }`} />
            </div>
            <h1 className={`text-2xl font-semibold bg-clip-text text-transparent transition-all duration-200 ${isDarkMode
              ? 'bg-gradient-to-r from-rose-300 to-blue-300'
              : 'bg-gradient-to-r from-rose-400 to-blue-400'
              }`}>
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
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-rose-900/30 to-blue-900/30 text-rose-300 shadow-sm'
                          : 'bg-gradient-to-r from-rose-50 to-blue-50 text-rose-600 shadow-sm'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-rose-300 hover:bg-slate-700/50'
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${isDarkMode
                  ? 'hover:bg-slate-700/50'
                  : 'hover:bg-rose-50/50'
                  }`}
              >
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className={`w-8 h-8 rounded-full border-2 transition-colors duration-200 ${isDarkMode ? 'border-rose-700' : 'border-rose-200'
                      }`}
                  />
                )}
                <span className={`text-sm font-medium hidden sm:inline transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 transition-colors duration-200 ${isDarkMode
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-rose-100'
                  }`}>
                  <div className={`p-4 border-b transition-colors duration-200 ${isDarkMode ? 'border-slate-700' : 'border-rose-50'
                    }`}>
                    <p className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>{user?.name}</p>
                    <p className={`text-xs mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout({ logoutParams: { returnTo: window.location.origin } });
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${isDarkMode
                      ? 'text-red-400 hover:bg-slate-700'
                      : 'text-red-600 hover:bg-red-50'
                      }`}
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
