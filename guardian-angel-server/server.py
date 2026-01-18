from flask import Flask, request, send_file
from flask_cors import CORS
from google import genai  # New SDK
from elevenlabs.client import ElevenLabs
import os
import io
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- PASTE YOUR ACTUAL KEYS HERE ---
GEMINI_KEY = os.getenv('GEMINI_KEY')
ELEVEN_KEY = os.getenv('ELEVEN_KEY')
VOICE_ID = os.getenv('VOICE_ID')
PORT = os.getenv('PORT')


google_client = genai.Client(api_key=GEMINI_KEY)
eleven_client = ElevenLabs(api_key=ELEVEN_KEY)


@app.route('/generate-lullaby', methods=['POST'])
def generate_lullaby():
    try:
        data = request.json
        topic = data.get('topic', 'sweet dreams')
        print(f"1. Writing story about: {topic}...")

        # 1. Generate Text (New SDK Syntax)
        response = google_client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"Write a very short, soothing 3-sentence bedtime story for a child who loves {topic}."
        )
        story_text = response.text
        print(f"Story: {story_text}")

        # 2. Generate Audio
        print("2. Generating Audio...")
        audio_generator = eleven_client.text_to_speech.convert(
            voice_id=VOICE_ID,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
            text=story_text
        )

        # 3. Stream back to React
        audio_bytes = b"".join(audio_generator)

        return send_file(
            io.BytesIO(audio_bytes),
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="lullaby.mp3"
        )

    except Exception as e:
        print(f"ERROR: {e}")
        return {"error": str(e)}, 500


if __name__ == '__main__':
    app.run(debug=True, port=PORT)
