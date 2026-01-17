import { Heart, Thermometer, Wind, Volume2, Video, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';

const MonitorPage = () => {
  const [heartRate, setHeartRate] = useState(120);
  const [temperature, setTemperature] = useState(36.8);
  const [breathing, setBreathing] = useState(32);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(118 + Math.random() * 6);
      setTemperature(36.5 + Math.random() * 0.8);
      setBreathing(30 + Math.random() * 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: Math.round(heartRate),
      unit: 'BPM',
      color: 'from-rose-400 to-pink-400',
      bgColor: 'from-rose-50 to-pink-50',
      status: 'Normal',
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: temperature.toFixed(1),
      unit: '°C',
      color: 'from-amber-400 to-orange-400',
      bgColor: 'from-amber-50 to-orange-50',
      status: 'Normal',
    },
    {
      icon: Wind,
      label: 'Breathing',
      value: Math.round(breathing),
      unit: '/min',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'from-blue-50 to-cyan-50',
      status: 'Normal',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Live Monitor</h2>
            <p className="text-gray-500 mt-1">Real-time monitoring of your little one</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-sm font-medium text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-100">
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all">
                  <Camera className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all">
                  <Volume2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Camera Feed</p>
                <p className="text-sm text-gray-400 mt-1">Connect your camera to view live feed</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-rose-50 to-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Baby's Room • 8:34 PM</span>
                <span className="text-sm font-medium text-green-600">Sleeping peacefully</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      {stat.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </span>
                      <span className="text-sm text-gray-400">{stat.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '8:30 PM', event: 'Baby moved', type: 'info' },
              { time: '8:15 PM', event: 'Feeding time completed', type: 'success' },
              { time: '7:45 PM', event: 'Diaper changed', type: 'success' },
              { time: '7:30 PM', event: 'Started sleeping', type: 'info' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50/50 to-blue-50/50 hover:from-rose-50 hover:to-blue-50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <span className="text-sm text-gray-700">{activity.event}</span>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;
