# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from face_recognition import detect_and_recognize

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    data = request.json
    image_data = data.get('image')
    if image_data:
        # Split the data URL header from the base64 encoded string.
        header, encoded = image_data.split(",", 1)
        try:
            image_bytes = base64.b64decode(encoded)
        except Exception as e:
            return jsonify({"status": "error", "message": "Invalid image data", "error": str(e)}), 400

        # Convert image bytes to a NumPy array and decode it into an OpenCV image.
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process the frame using the detect_and_recognize function.
        processed_frame = detect_and_recognize(frame)

        # Encode the processed frame back to a base64 string.
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')
        data_url = "data:image/jpeg;base64," + processed_base64

        # Return the processed image in the JSON response.
        return jsonify({"status": "processed", "image": data_url})
    
    return jsonify({"status": "error", "message": "No image data provided"}), 400

if __name__ == "__main__":
    app.run(debug=True)
