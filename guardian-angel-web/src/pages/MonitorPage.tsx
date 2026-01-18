import { Heart, Thermometer, Wind, Video, Camera, Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useTheme } from '../contexts/ThemeContext';

const MonitorPage = () => {
  const { isDarkMode } = useTheme();
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');

  // Explicitly type the refs
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);

  const [heartRate, setHeartRate] = useState(120);
  const [temperature, setTemperature] = useState(36.8);
  const [breathing, setBreathing] = useState(32);
  const [isConnected, /*setIsConnected*/] = useState(true);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  useEffect(() => {
    // Initialize Peer
    const peer = new Peer('', {
      host: window.location.hostname,
      port: parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80),
      path: '/peerjs/myapp',
      secure: window.location.protocol === 'https:'
    });

    peer.on('open', (id: string) => {
      setPeerId(id);
    });

    // Listen for incoming calls
    // peer.on('call', (call: MediaConnection) => {
    //   navigator.mediaDevices.getUserMedia({ audio: true })
    //     .then((stream) => {
    //       if (currentUserVideoRef.current) {
    //         currentUserVideoRef.current.srcObject = stream;
    //         currentUserVideoRef.current.play();
    //       }

    //       call.answer(stream);

    //       call.on('stream', (remoteStream: MediaStream) => {
    //         if (remoteVideoRef.current) {
    //           remoteVideoRef.current.srcObject = remoteStream;
    //           remoteVideoRef.current.play();
    //         }
    //       });
    //     })
    //     .catch((err) => console.error('Failed to get local stream', err));
    // });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
    };
  }, []);

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

  const callPeer = (remoteId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {

        // Mute it immediately
        stream.getAudioTracks().forEach(track => {
          track.enabled = false;
        });

        stream.getVideoTracks().forEach(track => {
          track.enabled = false;
        });

        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();
        }
        setMyStream(stream);
        setIsMuted(true);

        // Check if peerInstance exists before calling
        const call = peerInstance.current?.call(remoteId, stream);

        call?.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
      })
      .catch((err) => console.error('Failed to get local stream', err));
  };

  const toggleMute = () => {
    if (myStream) {
      const newMuted = !isMuted;

      myStream.getAudioTracks().forEach(track => {
        track.enabled = !newMuted; // enabled: true means unmuted
      });

      setIsMuted(newMuted);
    }
  };
  console.log(isMuted);
  return (
    <div className={`min-h-[calc(100vh-4rem)] p-6 transition-colors duration-200 ${isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50'
      }`}>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h3>Your Peer ID: <span style={{ color: '#007bff' }}>{peerId}</span></h3>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
            placeholder="Enter Remote ID"
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button onClick={() => callPeer(remotePeerIdValue)} style={{ padding: '8px 16px' }}>
            Call Peer
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-3xl font-semibold transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Live Monitor</h2>
            <p className={`mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Real-time monitoring of your little one</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-2xl shadow-lg overflow-hidden border transition-colors duration-200 ${isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-rose-100'
            }`}>
            {myStream != null ? (
              <div className={`relative aspect-video flex items-center justify-center transition-colors duration-200 ${isDarkMode
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {myStream && (<button className={`p-2 backdrop-blur-sm rounded-lg shadow-md transition-all ${isDarkMode
                      ? 'bg-slate-700/90 hover:bg-slate-700'
                      : 'bg-white/90 hover:bg-white'
                    }`}>
                    {isMuted ? <MicOff className={`w-5 h-5 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`} onClick={toggleMute} /> : <Mic className="w-5 h-5 text-red-600" onClick={toggleMute} />}
                  </button>)}
                </div>
                <video className="w-full h-full" ref={remoteVideoRef} style={{ width: '100%', background: '#000' }} />
              </div>
            ) :
              (
                <div className={`relative aspect-video flex items-center justify-center transition-colors duration-200 ${isDarkMode
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className={`p-2 backdrop-blur-sm rounded-lg shadow-md transition-all ${isDarkMode
                        ? 'bg-slate-700/90 hover:bg-slate-700'
                        : 'bg-white/90 hover:bg-white'
                      }`}>
                      <Camera className={`w-5 h-5 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`} />
                    </button>
                  </div>
                  <div className="text-center">
                    <Video className={`w-16 h-16 mx-auto mb-3 transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>Camera Feed</p>
                    <p className={`text-sm mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>Connect your camera to view live feed</p>
                  </div>
                </div>
              )}
            <div className={`p-4 transition-colors duration-200 ${isDarkMode
                ? 'bg-gradient-to-r from-slate-700 to-slate-800'
                : 'bg-gradient-to-r from-rose-50 to-blue-50'
              }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Baby's Room • 8:34 PM</span>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>Sleeping peacefully</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all ${isDarkMode
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-rose-100'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-colors duration-200 ${isDarkMode
                        ? stat.bgColor.includes('rose')
                          ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30'
                          : stat.bgColor.includes('amber')
                            ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30'
                            : 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30'
                        : `bg-gradient-to-br ${stat.bgColor}`
                      }`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200 ${isDarkMode
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      {stat.status}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{stat.label}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </span>
                      <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>{stat.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg p-6 border transition-colors duration-200 ${isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-rose-100'
          }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '8:30 PM', event: 'Baby moved', type: 'info' },
              { time: '8:15 PM', event: 'Feeding time completed', type: 'success' },
              { time: '7:45 PM', event: 'Diaper changed', type: 'success' },
              { time: '7:30 PM', event: 'Started sleeping', type: 'info' },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${isDarkMode
                    ? 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-700 hover:to-slate-800'
                    : 'bg-gradient-to-r from-rose-50/50 to-blue-50/50 hover:from-rose-50 hover:to-blue-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{activity.event}</span>
                </div>
                <span className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;

// const BabyCamera: React.FC = () => {
//   const [peerId, setPeerId] = useState<string>('');
//   const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');

//   // Explicitly type the refs
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const currentUserVideoRef = useRef<HTMLVideoElement>(null);
//   const peerInstance = useRef<Peer | null>(null);

//   useEffect(() => {
//     // Initialize Peer
//     const peer = new Peer('', {
//       host: window.location.hostname,
//       port: parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80),
//       path: '/peerjs/myapp',
//       secure: window.location.protocol === 'https:'
//     });

//     peer.on('open', (id: string) => {
//       setPeerId(id);
//     });

//     // Listen for incoming calls
//     peer.on('call', (call: MediaConnection) => {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           if (currentUserVideoRef.current) {
//             currentUserVideoRef.current.srcObject = stream;
//             currentUserVideoRef.current.play();
//           }

//           call.answer(stream);

//           call.on('stream', (remoteStream: MediaStream) => {
//             if (remoteVideoRef.current) {
//               remoteVideoRef.current.srcObject = remoteStream;
//               remoteVideoRef.current.play();
//             }
//           });
//         })
//         .catch((err) => console.error('Failed to get local stream', err));
//     });

//     peerInstance.current = peer;

//     return () => {
//       peer.destroy();
//     };
//   }, []);

//   const callPeer = (remoteId: string) => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         if (currentUserVideoRef.current) {
//           currentUserVideoRef.current.srcObject = stream;
//           currentUserVideoRef.current.play();
//         }

//         // Check if peerInstance exists before calling
//         const call = peerInstance.current?.call(remoteId, stream);

//         call?.on('stream', (remoteStream: MediaStream) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             remoteVideoRef.current.play();
//           }
//         });
//       })
//       .catch((err) => console.error('Failed to get local stream', err));
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
//       <h3>Your Peer ID: <span style={{ color: '#007bff' }}>{peerId}</span></h3>

//       <div style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           value={remotePeerIdValue}
//           onChange={(e) => setRemotePeerIdValue(e.target.value)}
//           placeholder="Enter Remote ID"
//           style={{ padding: '8px', marginRight: '10px' }}
//         />
//         <button onClick={() => callPeer(remotePeerIdValue)} style={{ padding: '8px 16px' }}>
//           Call Peer
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//         <div>
//           <p>Local Video (You)</p>
//           <video ref={currentUserVideoRef} muted style={{ width: '100%', background: '#000' }} />
//         </div>
//         <div>
//           <p>Remote Video (Peer)</p>
//           <video ref={remoteVideoRef} style={{ width: '100%', background: '#000' }} />
//         </div>
//       </div>
//     </div>
//   );
// };