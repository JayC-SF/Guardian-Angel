from flask import Flask, request, send_file
from flask_cors import CORS
from google import genai  # New SDK
from elevenlabs.client import ElevenLabs
import os
import io
from dotenv import load_dotenv
import tensorflow as tf
from tensorflow.keras.models import load_model
import tensorflow_hub as hub
import librosa
import numpy as np

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- PASTE YOUR ACTUAL KEYS HERE ---
GEMINI_KEY = os.getenv('GEMINI_KEY')
ELEVEN_KEY = os.getenv('ELEVEN_KEY')
VOICE_ID = os.getenv('VOICE_ID')


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


# Load YAMNet
yamnet_model = hub.load("https://tfhub.dev/google/yamnet/1")

# Load classifier
model = load_model("./baby_cry_classifier.keras")


def extract_embedding(file_path):
    audio, _ = librosa.load(file_path, sr=16000)
    scores, embeddings, spectrogram = yamnet_model(audio)
    avg_embedding = tf.reduce_mean(embeddings, axis=0)
    return avg_embedding.numpy()


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = "temp.wav"
    file.save(file_path)

    embedding = extract_embedding(file_path)
    prob = model.predict(np.expand_dims(embedding, axis=0))[0][0]
    label = "cry" if prob > 0.5 else "not_cry"

    return jsonify({"prediction": label, "probability": float(prob)})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
