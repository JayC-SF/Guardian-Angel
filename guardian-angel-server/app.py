from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import tensorflow_hub as hub
import librosa
import numpy as np

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
