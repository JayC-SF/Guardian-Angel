import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const VideoChat: React.FC = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');

    // Explicitly type the refs
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement>(null);
    const peerInstance = useRef<Peer | null>(null);

    useEffect(() => {
        // Initialize Peer
        const peer = new Peer();

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

    const callPeer = (remoteId: string) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (currentUserVideoRef.current) {
                    currentUserVideoRef.current.srcObject = stream;
                    currentUserVideoRef.current.play();
                }

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

    return (
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <p>Local Video (You)</p>
                    <video ref={currentUserVideoRef} muted style={{ width: '100%', background: '#000' }} />
                </div>
                <div>
                    <p>Remote Video (Peer)</p>
                    <video ref={remoteVideoRef} style={{ width: '100%', background: '#000' }} />
                </div>
            </div>
        </div>
    );
};

export default VideoChat;