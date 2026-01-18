import { Milk, Droplet, Moon, Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ActivityPage = () => {
  const { isDarkMode } = useTheme();
  const activities = [
    { time: '8:15 PM', type: 'feeding', duration: '15 min', icon: Milk, color: 'from-rose-400 to-pink-400' },
    { time: '7:45 PM', type: 'diaper', note: 'Changed', icon: Droplet, color: 'from-blue-400 to-cyan-400' },
    { time: '7:30 PM', type: 'sleep', duration: '45 min', icon: Moon, color: 'from-amber-400 to-yellow-400' },
    { time: '6:30 PM', type: 'play', duration: '30 min', icon: Activity, color: 'from-green-400 to-emerald-400' },
    { time: '5:45 PM', type: 'feeding', duration: '20 min', icon: Milk, color: 'from-rose-400 to-pink-400' },
    { time: '5:15 PM', type: 'diaper', note: 'Changed', icon: Droplet, color: 'from-blue-400 to-cyan-400' },
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-6 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className={`text-3xl font-semibold transition-colors duration-200 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>Activity Log</h2>
          <p className={`mt-1 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Track your baby's daily routine</p>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-rose-100'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl transition-colors duration-200 ${
                    isDarkMode 
                      ? activity.color.includes('rose') 
                        ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30'
                        : activity.color.includes('blue')
                        ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30'
                        : activity.color.includes('amber')
                        ? 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30'
                        : 'bg-gradient-to-br from-green-900/30 to-emerald-900/30'
                      : `bg-gradient-to-br ${activity.color.replace('400', '50')}`
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold capitalize transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>{activity.type}</h3>
                    {activity.duration && (
                      <p className={`text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Duration: {activity.duration}</p>
                    )}
                    {activity.note && (
                      <p className={`text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{activity.note}</p>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>{activity.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
