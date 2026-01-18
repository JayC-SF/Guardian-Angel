import React, { useState, useRef } from 'react';

const AudioToggleRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);

    // Refs to persist objects across renders without causing re-renders
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    const handleButtonClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                await uploadAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Auto-stop after 3 seconds
            timeoutIdRef.current = setTimeout(() => {
                stopRecording();
            }, 3000);

        } catch (err) {
            console.error("Microphone access denied:", err);
        }
    };

    const stopRecording = () => {
        // 1. Clear the auto-stop timer so it doesn't fire twice
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }

        // 2. Stop the actual recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const uploadAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        try {
            console.log("Uploading...");
            const response = await fetch('/flask/predict', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) console.log("Success!");
            const res = await response.json()
            console.log(`Label: ${res.prediction}, Confidence: ${res.probability}`);
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-10">
            <button
                onClick={handleButtonClick}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
                    }`}
            >
                {isRecording ? (
                    <div className="w-6 h-6 bg-white rounded-sm" /> // Stop Icon
                ) : (
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" /> // Play/Record Icon
                )}
            </button>
            <p className="font-medium">
                {isRecording ? "Recording... Click to stop" : "Click to record (max 3s)"}
            </p>
        </div>
    );
};

export default AudioToggleRecorder;