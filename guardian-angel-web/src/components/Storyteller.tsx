import { useState, useRef } from 'react';
import './Storyteller.css';

export default function StoryTeller() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic!");

    setIsLoading(true);
    setStatus('Asking Gemini & ElevenLabs...');

    try {
      // 1. Call YOUR Python Server (Running on port 5000)
      const response = await fetch('http://127.0.0.1:5000/generate-lullaby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server failed");
      }

      // 2. The server sends back an MP3 blob directly
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // 3. Play it
      setStatus('Playing Lullaby 🎵');
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();

    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
      setStatus('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="storyteller-container">
      <h2 className="storyteller-title">🌙 Bedtime Storyteller</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What does Leo love? (e.g. Dinosaurs)"
        className="storyteller-input"
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className={`storyteller-button ${isLoading ? 'disabled' : ''}`}
      >
        {isLoading ? status : "✨ Write & Read Story"}
      </button>

      {/* Stop Button */}
      <button
        onClick={() => { if (audioRef.current) audioRef.current.pause(); setStatus("Stopped"); }}
        className="storyteller-stop-button"
      >
        Stop Audio
      </button>
    </div>
  );
}