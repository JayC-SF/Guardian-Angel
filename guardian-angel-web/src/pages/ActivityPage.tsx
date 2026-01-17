import { Milk, Droplet, Moon, Activity } from 'lucide-react';

const ActivityPage = () => {
  const activities = [
    { time: '8:15 PM', type: 'feeding', duration: '15 min', icon: Milk, color: 'from-rose-400 to-pink-400' },
    { time: '7:45 PM', type: 'diaper', note: 'Changed', icon: Droplet, color: 'from-blue-400 to-cyan-400' },
    { time: '7:30 PM', type: 'sleep', duration: '45 min', icon: Moon, color: 'from-amber-400 to-yellow-400' },
    { time: '6:30 PM', type: 'play', duration: '30 min', icon: Activity, color: 'from-green-400 to-emerald-400' },
    { time: '5:45 PM', type: 'feeding', duration: '20 min', icon: Milk, color: 'from-rose-400 to-pink-400' },
    { time: '5:15 PM', type: 'diaper', note: 'Changed', icon: Droplet, color: 'from-blue-400 to-cyan-400' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Activity Log</h2>
          <p className="text-gray-500 mt-1">Track your baby's daily routine</p>
        </div>

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100 hover:shadow-xl transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${activity.color.replace('400', '50')}`}>
                    <Icon className={`w-6 h-6 text-gray-700`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">{activity.type}</h3>
                    {activity.duration && (
                      <p className="text-sm text-gray-500">Duration: {activity.duration}</p>
                    )}
                    {activity.note && (
                      <p className="text-sm text-gray-500">{activity.note}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
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
