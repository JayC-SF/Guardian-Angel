import { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Record.css';

interface Recording {
  _id: string; // MongoDB uses _id, not id
  name: string;
  duration: number;
  audio_url: string; // URL from server
  created_at: string;
}

export const RecordPage = () => {
  const { user, isAuthenticated } = useAuth0();

  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [isUploading, setIsUploading] = useState(false); // New loading state

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // 1. FETCH RECORDINGS FROM SERVER
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchRecordings();
    }
  }, [isAuthenticated, user]);

  const fetchRecordings = async () => {
    try {
      // Re-using the get-library endpoint we made earlier
      const url = window.location.hostname == 'localhost' ? `http://127.0.0.1:5000/get-library/${user?.sub}` : `${import.meta.env.VITE_PYTHON_SERVER}/get-library/${user?.sub}`;
      const res = await fetch(url);
      const data = await res.json();
      // Filter to only show recordings (if you want to mix them, remove the filter)
      setRecordings(data);
    } catch (e) {
      console.error('Error loading recordings:', e);
    }
  };

  const startRecording = async () => {
    if (!isAuthenticated) return alert("Please log in to save recordings.");

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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = recordingTime; // Capture time before reset

        // 2. UPLOAD TO SERVER
        await handleUpload(audioBlob, duration);

        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
        setRecordingName('');
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const handleUpload = async (blob: Blob, duration: number) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('user_id', user?.sub || 'guest');
    formData.append('name', recordingName || `Lullaby ${new Date().toLocaleDateString()}`);
    formData.append('duration', duration.toString());

    try {
      const url = window.location.hostname == 'localhost' ? 'http://127.0.0.1:5000/upload-lullaby' : `${import.meta.env.VITE_PYTHON_SERVER}/upload-lullaby`;
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Refresh list from DB
        fetchRecordings();
      } else {
        alert("Failed to save recording to server.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
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

  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const deleteRecording = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    // Optimistic update
    setRecordings(recordings.filter(r => r._id !== id));

    // Call server API
    const url = window.location.hostname == 'localhost' ? `http://127.0.0.1:5000/delete-lullaby/${id}` : `${import.meta.env.VITE_PYTHON_SERVER}/delete-lullaby/${id}`;
    await fetch(url, { method: 'DELETE' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="record-container p-6">
      <div className="record-header mb-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700">🎤 Parent's Voice</h1>
        <p className="text-gray-600">Record a soothing message or song for your baby.</p>
      </div>

      <div className="record-section max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

        {/* RECORDER CARD */}
        <div className="recorder-card bg-white p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-4">New Recording</h2>

          {!isRecording ? (
            <div className="space-y-4">
              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recording Name</label>
                <input
                  type="text"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder="e.g. Goodnight Song"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-300 outline-none"
                />
              </div>

              <button
                onClick={startRecording}
                disabled={isUploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? "Saving..." : "🔴 Start Recording"}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="text-4xl font-mono text-red-500 font-bold animate-pulse">
                {formatTime(recordingTime)}
              </div>
              <div className="text-sm text-gray-500">Recording in progress...</div>

              <button
                onClick={stopRecording}
                className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-4 rounded-full border-2 border-red-200 transition-all"
              >
                ⏹️ Stop & Save
              </button>
            </div>
          )}
        </div>

        {/* LIST CARD */}
        <div className="recordings-list bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Library</h2>

          {recordings.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No recordings yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recordings.map((rec) => (
                <div key={rec._id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">{rec.name || "Untitled"}</h3>
                    <p className="text-xs text-gray-500">
                      {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => playRecording(rec.audio_url)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-full"
                      title="Play"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => deleteRecording(rec._id)}
                      className="p-2 text-red-400 hover:bg-red-100 rounded-full"
                      title="Delete"
                    >
                      🗑️
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