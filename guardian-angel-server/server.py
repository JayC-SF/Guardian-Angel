from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google import genai
from elevenlabs.client import ElevenLabs
from pymongo import MongoClient
import certifi
import os
import io   # <--- Required for audio streaming
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# --- CRITICAL: Enable Static Folder so recordings can be played ---
app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# --- KEYS ---
GEMINI_KEY = os.getenv('GEMINI_KEY')
ELEVEN_KEY = os.getenv('ELEVEN_KEY')
VOICE_ID = os.getenv('VOICE_ID')
MONGO_URI = os.getenv('Mongo_URL') 

google_client = genai.Client(api_key=GEMINI_KEY)
eleven_client = ElevenLabs(api_key=ELEVEN_KEY)

# --- DATABASE CONNECTION ---
try:
    mongo_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = mongo_client['guardian_angel']
    lullabies_collection = db['lullabies']
    print("✅ Connected to MongoDB!")
except Exception as e:
    print(f"❌ Database Error: {e}")

# --- ROUTES ---

@app.route('/generate-lullaby', methods=['POST'])
def generate_lullaby():
    try:
        data = request.json
        topic = data.get('topic', 'sweet dreams')
        print(f"1. Writing story about: {topic}...")

        # 1. Generate Text (USING YOUR MODEL)
        response = google_client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"Write a very short, soothing 3-sentence bedtime story for a baby who loves {topic}."
        )
        story_text = response.text
        print(f"Story: {story_text}")

        # 2. Generate Audio (USING YOUR MODEL)
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

@app.route('/upload-lullaby', methods=['POST'])
def upload_lullaby():
    # This endpoint SAVES parent recordings to Disk + MongoDB
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        user_id = request.form.get('user_id', 'guest')
        name = request.form.get('name', 'My Recording')
        duration = request.form.get('duration', 0)

        # 1. Save locally
        if not os.path.exists('static'):
            os.makedirs('static')
            
        filename = f"parent_{int(time.time())}.webm"
        filepath = os.path.join("static", filename)
        file.save(filepath)
        
        # 2. Generate URL
        file_url = f"http://127.0.0.1:5000/static/{filename}"

        # 3. Save Receipt to MongoDB
        lullabies_collection.insert_one({
            "user_id": user_id,
            "name": name,
            "type": "recording",
            "duration": duration,
            "audio_url": file_url,
            "created_at": datetime.utcnow()
        })
        
        print(f"✅ Saved recording: {name}")
        return jsonify({"status": "success", "url": file_url})

    except Exception as e:
        print(f"❌ Upload Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get-library/<user_id>', methods=['GET'])
def get_library(user_id):
    # This is required for the RecordPage to show the list!
    try:
        # Fetch stories for this user, newest first
        stories = list(lullabies_collection.find({"user_id": user_id}).sort("created_at", -1))
        
        # Convert ObjectId to string
        for s in stories:
            s['_id'] = str(s['_id'])
            
        return jsonify(stories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete-lullaby/<id>', methods=['DELETE'])
def delete_lullaby(id):
    try:
        from bson.objectid import ObjectId
        lullabies_collection.delete_one({'_id': ObjectId(id)})
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)