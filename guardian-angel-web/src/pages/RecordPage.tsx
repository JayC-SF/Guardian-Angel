import { useState, useRef, useEffect } from 'react';
import './Record.css';

interface Recording {
  id: string;
  name: string;
  duration: number;
  date: Date;
  blob: Blob;
}

export const RecordPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Load saved recordings from localStorage
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('guardian-angel-recordings');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert date strings back to Date objects
          const recordingsWithDates = parsed.map((r: any) => ({
            ...r,
            date: new Date(r.date)
          }));
          setRecordings(recordingsWithDates);
        }
      }
    } catch (e) {
      console.error('Error loading recordings:', e);
    }
  }, []);

  const saveRecordings = (newRecordings: Recording[]) => {
    setRecordings(newRecordings);
    try {
      if (typeof window !== 'undefined') {
        // Save to localStorage (excluding blob data for storage efficiency)
        const toSave = newRecordings.map(r => ({
          id: r.id,
          name: r.name,
          duration: r.duration,
          date: r.date.toISOString()
        }));
        localStorage.setItem('guardian-angel-recordings', JSON.stringify(toSave));
      }
    } catch (e) {
      console.error('Error saving recordings:', e);
    }
  };

  const startRecording = async () => { 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = recordingTime;
  

    
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: recordingName || `Lullaby ${recordings.length + 1}`,
          duration,
          date: new Date(),
          blob: audioBlob
        };

        const updated = [...recordings, newRecording];
        saveRecordings(updated);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
        setRecordingName('');
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = (recording: Recording) => {
    const audioUrl = URL.createObjectURL(recording.blob);
    const audio = new Audio(audioUrl);
    audio.play();
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };

  const deleteRecording = (id: string) => {
    const updated = recordings.filter(r => r.id !== id);
    saveRecordings(updated);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="record-container">
      <div className="record-header">
        <h1>Record Lullaby</h1>
        <p>Create a soothing lullaby recording for your little one</p>
      </div>

      <div className="record-section">
        <div className="recorder-card">
          <h2>New Recording</h2>
          
          {!isRecording ? (
            <>
              <div className="input-group">
                <label htmlFor="recording-name">Recording Name (optional)</label>
                <input
                  type="text"
                  id="recording-name"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder="My Lullaby"
                />
              </div>
              
              <button onClick={startRecording} className="record-btn start">
                🎤 Start Recording
              </button>
            </>
          ) : (
            <>
              <div className="recording-status">
                <div className="recording-indicator">
                  <span className="pulse-dot"></span>
                  <span>Recording...</span>
                </div>
                <div className="recording-time">{formatTime(recordingTime)}</div>
              </div>
              
              <button onClick={stopRecording} className="record-btn stop">
                ⏹️ Stop Recording
              </button>
            </>
          )}
        </div>

        <div className="recordings-list">
          <h2>Your Recordings</h2>
          
          {recordings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎵</span>
              <p>No recordings yet. Start recording your first lullaby!</p>
            </div>
          ) : (
            <div className="recordings-grid">
              {recordings.map((recording) => (
                <div key={recording.id} className="recording-card">
                  <div className="recording-info">
                    <h3>{recording.name}</h3>
                    <p className="recording-meta">
                      {formatTime(recording.duration)} • {recording.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="recording-actions">
                    <button
                      onClick={() => playRecording(recording)}
                      className="action-btn play"
                    >
                      ▶️ Play
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="action-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

