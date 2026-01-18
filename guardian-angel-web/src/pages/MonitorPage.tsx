import { Heart, Thermometer, Wind, Volume2, Video, Camera, Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const MonitorPage = () => {
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
    peer.on('call', (call: MediaConnection) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.play();
          }

          call.answer(stream);

          call.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        })
        .catch((err) => console.error('Failed to get local stream', err));
    });

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
      const newState = !isMuted;

      myStream.getAudioTracks().forEach(track => {
        track.enabled = !newState; // enabled: true means unmuted
      });

      setIsMuted(newState);
    }
  };
  console.log(isMuted);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 p-6">
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
            {myStream != null ? (
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="absolute top-4 right-4 flex space-x-2">
                  {myStream && (<button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all">
                    {isMuted ? <MicOff className="w-5 h-5 text-gray-700" onClick={toggleMute} /> : <Mic className="w-5 h-5 text-red-600" onClick={toggleMute} />}
                  </button>)}
                </div>
                <video className="w-full h-full" ref={remoteVideoRef} style={{ width: '100%', background: '#000' }} />
              </div>
            ) :
              (
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all">
                      <Camera className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Camera Feed</p>
                    <p className="text-sm text-gray-400 mt-1">Connect your camera to view live feed</p>
                  </div>
                </div>
              )}
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