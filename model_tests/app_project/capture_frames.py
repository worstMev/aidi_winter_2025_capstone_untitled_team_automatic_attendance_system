from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import datetime
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Set the folder path for storing captured frames.
UPLOAD_FOLDER = r"C:\Users\User\Pictures\screen_captures_test"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load Haar cascade for face detection.
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_and_recognize(screen_frame):
    """
    Processes the input frame by converting it to grayscale,
    detecting faces, and drawing rectangles with a simple label.
    """
    gray_image = cv2.cvtColor(screen_frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))
    for (x, y, w, h) in faces:
        cv2.rectangle(screen_frame, (x, y), (x + w, y + h), (0, 255, 0), 4)
        cv2.putText(screen_frame, "face", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    return screen_frame

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

        # Process the frame: detect faces and draw boxes.
        processed_frame = detect_and_recognize(frame)

        # Optionally save the processed image to disk.
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")
        processed_filename = os.path.join(UPLOAD_FOLDER, f"processed_{timestamp}.jpg")
        cv2.imwrite(processed_filename, processed_frame)

        # Encode the processed frame back to a base64 string.
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')
        data_url = "data:image/jpeg;base64," + processed_base64

        # Return the processed image in the response.
        return jsonify({"status": "processed", "image": data_url})
    
    return jsonify({"status": "error", "message": "No image data provided"}), 400

if __name__ == "__main__":
    app.run(debug=True)
