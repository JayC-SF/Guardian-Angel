👼 Guardian Angel
Participant at McHacks 2026

Guardian Angel is an AI-powered smart baby monitor system that goes beyond simple observation. It detects distress, alerts parents via SMS, and uses Generative AI to soothe the baby with custom bedtime stories and lullabies—all in real-time.

🚀 Features
🎥 Live Monitoring
WebRTC Video & Audio: Low-latency, secure peer-to-peer streaming between the baby's room (Camera) and the parent's device (Monitor).

Health Dashboard: Real-time visualization of simulated vitals (Heart Rate, Temperature, Breathing Rate).

🤖 AI Storyteller (The "Soothe" Engine)
Instant Lullabies: Parents can type a topic (e.g., "A brave bunny"), and Google Gemini generates a soothing bedtime story on the fly.

Realistic Voice: The story is narrated instantly using ElevenLabs text-to-speech technology.

Remote Trigger: Parents can trigger the story to play on the baby's device remotely via Data Channels.

🚨 Smart Alerts
Twilio Integration: If the system detects crying (or the manual alert is triggered), it instantly sends an SMS to the parent's phone with a link to the video feed.

☁️ Cloud & Database
MongoDB Atlas: Stores recordings and logs of alerts/events.

🛠️ Tech Stack
Frontend:

React + TypeScript + Vite

Tailwind CSS (Styling)

PeerJS (WebRTC Video/Audio & Data Channels)

Lucide React (Icons)

Backend:

Python (Flask)

Google Gemini API (Text Generation)

ElevenLabs API (Voice Synthesis)

Twilio API (SMS Alerts)

MongoDB (Database)

⚙️ Installation & Setup
Prerequisites
Node.js (v18+)

Python (v3.10+)

API Keys for Google Gemini, ElevenLabs, Twilio, and MongoDB.

1. Clone the Repository
Bash
git clone https://github.com/JayC-SF/Guardian-Angel.git
cd Guardian-Angel
2. Backend Setup (Flask)
Navigate to the server folder:

Bash
cd guardian-angel-server
Create and activate a virtual environment:

Bash
# Windows
python -m venv ai_env
.\ai_env\Scripts\activate

# Mac/Linux
python3 -m venv ai_env
source ai_env/bin/activate
Install dependencies:

Bash
pip install -r requirements.txt
Configure Environment Variables: Create a .env file in guardian-angel-server/ and add your keys:

Code snippet
GEMINI_KEY=your_google_gemini_key
ELEVEN_KEY=your_elevenlabs_key
VOICE_ID=your_elevenlabs_voice_id
MONGO_URI=your_mongodb_connection_string

# Twilio Configuration
TWILIO_SID=AC...
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=+1...
PARENT_PHONE=+1...
Run the server:

Bash
python server.py
Server runs on http://127.0.0.1:5000

3. Frontend Setup (React)
Open a new terminal and navigate to the client folder (assuming root or client):

Bash
cd guardian-angel-client
npm install
npm run dev
Client runs on http://localhost:5173

📱 How to Demo
Open "Baby" View: Open http://localhost:5173/monitor in one browser window. This acts as the camera.

Open "Parent" View: Open the same URL in a different browser window (or Incognito mode).

Connect: Copy the Peer ID from the "Baby" window and paste it into the "Remote ID" input on the "Parent" window. Click Call Peer.

Test AI Story: On the Parent window, type "Space Cats" in the Remote Storyteller box and click the Wand button. You will hear the story play on the Baby's window.

Test Alert: Click the "Simulate Alert" button under the video. Check your real phone for the SMS!

🔮 Future Improvements
Real AI Sound Classification: Replace the "Simulate Alert" button with a TensorFlow.js model that listens to the microphone and automatically detects baby cry frequencies.

Mobile App: Convert the React web app to React Native for easier phone access.

Night Vision: Apply image processing filters to improve low-light video visibility.
