# face_recognition.py
import cv2
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
    # Convert frame to grayscale for face detection.
    gray_image = cv2.cvtColor(screen_frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))

    datest = date.today()
    formatted_date = datest.strftime("%Y-%m-%d")
    
    for (x, y, w, h) in faces:
        # Extract face region of interest (ROI)
        face_roi = screen_frame[y:y+h, x:x+w]
        # For DeepFace, we can use the ROI directly (or convert from BGR to RGB if needed)
        face_roi_rgb = face_roi
        
        try:
            # Use DeepFace.represent() to compute the embedding.
            results = DeepFace.represent(img_path=face_roi_rgb, model_name="Facenet", anti_spoofing= False)

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

                ## only new people in the session will allow to run the merge query 
                if label not in session_attendance:

                    # Build and execute the attendance merge query.
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
        
        # Draw rectangle and label on the frame.
        cv2.rectangle(screen_frame, (x, y), (x+w, y+h), (0, 255, 0), 4)
        cv2.putText(screen_frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return screen_frame
