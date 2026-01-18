import { useState, useRef } from 'react';

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
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">🌙 Bedtime Storyteller</h2>
      
      <input 
        type="text" 
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What does Leo love? (e.g. Dinosaurs)"
        className="border p-3 rounded w-full mb-4 focus:ring-2 focus:ring-purple-300 outline-none"
      />
      
      <button 
        onClick={handleGenerate} 
        disabled={isLoading}
        className={`w-full p-3 rounded text-white font-bold transition-all ${
          isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isLoading ? status : "✨ Write & Read Story"}
      </button>

      {/* Stop Button */}
      <button 
        onClick={() => { if(audioRef.current) audioRef.current.pause(); setStatus("Stopped"); }}
        className="mt-2 text-sm text-red-500 underline w-full text-center"
      >
        Stop Audio
      </button>
    </div>
  );
}