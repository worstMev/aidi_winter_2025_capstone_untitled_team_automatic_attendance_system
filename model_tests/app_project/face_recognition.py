# face_recognition.py
import cv2
import numpy as np 
from datetime import date
from deepface import DeepFace
from snowflake_connection import cs  # Import the global cursor from our Snowflake module

# Load Haar cascade for face detection.
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


## list to register new people in the class, if identified face is in list 
## the merge query wont run
session_attendance = []


## treshhold for recognition with euclidean distance 

threshold = 10 


def detect_and_recognize(screen_frame):
    """
    Processes the input frame by extracting faces using DeepFace,
    computing embeddings for each face, and then drawing rectangles
    and labels on the original image based on recognition results.
    """
    try:
        # Use DeepFace.extract_faces to detect and extract faces.
        # You can adjust parameters as needed (e.g., detector_backend, align, etc.)
        faces_info = DeepFace.extract_faces(
            img_path=screen_frame,
            detector_backend="opencv",
            enforce_detection=False,
            anti_spoofing=False,

        )
    except Exception as e:
        print("Error during face extraction:", e)
        return screen_frame

    # Get current date for logging attendance.
    datest = date.today()
    formatted_date = datest.strftime("%Y-%m-%d")
    
    # Iterate through each detected face.
    for face_info in faces_info:
        # Extract the face ROI and the facial area information.
        ##face_roi = face_info["face"] 
        facial_area = face_info["facial_area"]
        x = facial_area["x"]
        y = facial_area["y"]
        w = facial_area["w"]
        h = facial_area["h"]


        face_roi = screen_frame[y:y+h, x:x+w]

        try:
            # Use DeepFace.represent to compute the embedding for the extracted face.
            results = DeepFace.represent(
                img_path=face_roi,
                model_name="Facenet",
                anti_spoofing=False,
                enforce_detection= False
            )

            if len(results) > 0 and len(results[0]["embedding"]) > 0:
                embedding_target = results[0]["embedding"]

                # Construct the SQL query to search for the best match in the embeddings table.
                snow_query_search = f"""
                    SELECT IMG_NAME, VECTOR_L2_DISTANCE(EMBEDDING, {embedding_target}::VECTOR(FLOAT,128)) as SIMILARITY
                    FROM RECOG_DB.ATTEND.embeddings_test
                    WHERE SIMILARITY < {threshold} 
                    ORDER BY SIMILARITY ASC
                    LIMIT 1
                """
                
                best_match = cs.execute(snow_query_search).fetchall()
                label = best_match[0][0].split('/')[-1].split('.')[0]

                # Only update attendance if this label hasn't been processed in this session.
                if label not in session_attendance:
                    attendance_merge = f"""
                        MERGE INTO RECOG_DB.ATTEND.attendance_test AS target
                        USING (
                            SELECT '{label}' AS student_name,
                                   'CAPSTONE_PROJECT' AS class_name,
                                   '{formatted_date}'::DATE AS attendance_date
                        ) AS source
                        ON target.student_name = source.student_name 
                           AND target.attendance_date = source.attendance_date
                        WHEN NOT MATCHED THEN
                            INSERT (student_name, class_name, attendance_date)
                            VALUES (source.student_name, source.class_name, source.attendance_date)
                    """
                    cs.execute(attendance_merge)
                    session_attendance.append(label)
            else:
                label = 'unknown'
        except Exception as e:
            label = "Unknown_from_exception"
            print("Recognition error:", e)
        
        # Draw a rectangle and label on the original frame using the facial area coordinates.
        cv2.rectangle(screen_frame, (x, y), (x+w, y+h), (0, 255, 0), 4)
        cv2.putText(screen_frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return screen_frame