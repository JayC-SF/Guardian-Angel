import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import StoryTeller from '../components/Storyteller';
import { Video, Camera, Copy, Check } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';

const BabyCamera: React.FC = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Explicitly type the refs
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement>(null);
    const peerInstance = useRef<Peer | null>(null);

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
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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

    const copyPeerId = () => {
        navigator.clipboard.writeText(peerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-semibold bg-gradient-to-r from-rose-400 to-blue-400 dark:from-rose-300 dark:to-blue-300 bg-clip-text text-transparent">
                            Baby Camera Feed
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Watch your little one and tell them a story</p>
                    </div>
                    {peerId && (
                        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 shadow-md border border-rose-100 dark:border-slate-700">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Peer ID:</span>
                            <span className="text-sm font-mono font-semibold bg-gradient-to-r from-rose-400 to-blue-400 dark:from-rose-300 dark:to-blue-300 bg-clip-text text-transparent">
                                {peerId}
                            </span>
                            <button
                                onClick={copyPeerId}
                                className="ml-2 p-1.5 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-all"
                                title="Copy Peer ID"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Camera Feed - Takes 2 columns */}
                    <AudioRecorder />
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-rose-100 dark:border-slate-700">
                            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                {remoteVideoRef.current?.srcObject ? (
                                    <video
                                        ref={remoteVideoRef}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-gradient-to-br from-rose-100 to-blue-100 dark:from-rose-900/30 dark:to-blue-900/30 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                            <Camera className="w-12 h-12 text-rose-400 dark:text-rose-300" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">Camera Feed</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Waiting for connection...</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gradient-to-r from-rose-50 to-blue-50 dark:from-slate-700 dark:to-slate-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Baby's Room • Live Feed</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Connected</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Storyteller - Takes 1 column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                            <StoryTeller />
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                        <Video className="w-5 h-5 text-rose-400 dark:text-rose-300" />
                        <span>How to Connect</span>
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-blue-100 dark:from-rose-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold bg-gradient-to-r from-rose-400 to-blue-400 dark:from-rose-300 dark:to-blue-300 bg-clip-text text-transparent">1</span>
                            </div>
                            <p>Share your Peer ID with the device you want to connect to</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-blue-100 dark:from-rose-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold bg-gradient-to-r from-rose-400 to-blue-400 dark:from-rose-300 dark:to-blue-300 bg-clip-text text-transparent">2</span>
                            </div>
                            <p>The other device will automatically connect and start streaming</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-blue-100 dark:from-rose-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold bg-gradient-to-r from-rose-400 to-blue-400 dark:from-rose-300 dark:to-blue-300 bg-clip-text text-transparent">3</span>
                            </div>
                            <p>Use the Storyteller to create personalized bedtime stories while watching</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BabyCamera;