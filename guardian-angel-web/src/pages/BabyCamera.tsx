import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const BabyCamera: React.FC = () => {
    const [peerId, setPeerId] = useState<string>('');

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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h3>Your Peer ID: <span style={{ color: '#007bff' }}>{peerId}</span></h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <video ref={remoteVideoRef} style={{ width: '100%', background: '#000' }} />
            </div>
        </div>
    );
};

export default BabyCamera;