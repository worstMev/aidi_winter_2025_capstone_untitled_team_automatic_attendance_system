import cv2
import os
import face_recognition
import dlib
import numpy as np

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")  # Download this model if not present
face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")  # Download this model if not present

def capture_images():
    name = input("Enter the name of the person to capture images for: ").strip()
    if not name:
        print("No name entered. Exiting...")
        return

    output_folder = "training_images"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    person_folder = os.path.join(output_folder, name)
    if not os.path.exists(person_folder):
        os.makedirs(person_folder)

    video_capture = cv2.VideoCapture(0)
    print(f"Starting image capture for {name}. Press 's' to save an image, or 'q' to quit.")
    
    count = 0
    num_images = 10
    while count < num_images:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to capture image. Exiting...")
            break

        cv2.imshow('Video', frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord('s'):
            image_path = os.path.join(person_folder, f"{name}_{count + 1}.jpg")
            cv2.imwrite(image_path, frame)
            print(f"Saved {image_path}")
            count += 1

        elif key == ord('q'):
            print("Quitting...")
            break

    video_capture.release()
    cv2.destroyAllWindows()
    print(f"Captured {count} images of {name}.")

def load_training_data(training_folder="training_images"):
    known_face_encodings = []
    known_face_names = []

    for person_name in os.listdir(training_folder):
        person_folder = os.path.join(training_folder, person_name)
        if not os.path.isdir(person_folder):
            continue

        for image_file in os.listdir(person_folder):
            image_path = os.path.join(person_folder, image_file)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) > 0:
                known_face_encodings.append(encodings[0])
                known_face_names.append(person_name)

    return known_face_encodings, known_face_names

def get_face_encodings(image):
    # Detect faces in the image
    detected_faces = detector(image, 1)
    
    # List to hold the face encodings
    encodings = []

    for face in detected_faces:
        # Get the landmarks for the face
        shape = predictor(image, face)
        
        # Get the face encoding using the face recognition model
        face_encoding = np.array(face_rec_model.compute_face_descriptor(image, shape, num_jitters=1))
        encodings.append(face_encoding)
    
    return encodings

def recognize_faces(known_face_encodings, known_face_names):
    video_capture = cv2.VideoCapture(0)
    print("Starting real-time face recognition. Press 'q' to quit.")

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to capture video. Exiting...")
            break

        # Resize frame of video to 1/4 size for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Get face encodings from the current frame
        face_encodings = get_face_encodings(rgb_small_frame)

        for face_encoding in face_encodings:
            matches = []
            if known_face_encodings:
                matches = np.linalg.norm(known_face_encodings - face_encoding, axis=1) <= 0.6  # Compare with known encodings
            name = "Unknown"
            

            if np.any(matches):
                best_match_index = np.argmin(np.linalg.norm(known_face_encodings - face_encoding, axis=1))
                name = known_face_names[best_match_index]

            # Draw a box and label for each detected face (only showing the name for simplicity)
            # Note: We're not drawing boxes here as we didn't extract face locations explicitly
            print(f"Recognized: {name}")

        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    print("Face Recognition System")
    print("1. Capture Images")
    print("2. Train and Recognize Faces")
    choice = input("Enter your choice (1/2): ")

    if choice == '1':
        capture_images()
    elif choice == '2':
        known_face_encodings, known_face_names = load_training_data()
        recognize_faces(known_face_encodings, known_face_names)
    else:
        print("Invalid choice. Exiting...")