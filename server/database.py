
#import snowflake
import snowflake.connector
import uuid
import cv2
from deepface import DeepFace
from snowflake.connector import DictCursor

MODEL_NAME = 'ArcFace'
FACE_DETECT_MODEL = 'retinaface'

private_key_file = 'rsa_key.p8'
private_key_file_pwd = 'hello'

my_db_params ={
    "account" : "FUKSKIX-MJ13450",
    "user" : "untitled",
    'authenticator': 'SNOWFLAKE_JWT',
    'private_key_file': private_key_file,
    'private_key_file_pwd':private_key_file_pwd,
    "role" : "ACCOUNTADMIN",
    "warehouse" : "COMPUTE_WH",
    "database" : "FACE_RECOGNITION_DB",
    "schema" : "PUBLIC",
  }
conn = snowflake.connector.connect(
        **my_db_params
)

cursor = conn.cursor()
dict_cursor = conn.cursor(DictCursor)

def insert_institution(**kwargs) :
    global cursor
    query = """
    INSERT INTO institution (institution_id, institution_name)
    VALUES(%(institution_id)s , %(institution_name)s)
    """
    params = {
            'institution_id' : kwargs.get('instituteId'),
            'institution_name' : kwargs.get('name'),
            'institutionType' : kwargs.get('institutionType'),
            }

    #cursor.execute(query,kwargs)
    cursor.execute(query,params)
    print('inserted in institution ',kwargs);

def insert_instructor(**kwargs) :
    global cursor
    query = """
    INSERT INTO instructor (instructor_id, instructor_name)
    VALUES(%(instructor_id)s , %(instructor_name)s)
    """
    params = {
            'instructor_id' : kwargs.get('instructorId') ,
            'instructor_name' : kwargs.get('firstName') + ' ' + kwargs.get('lastName')
            }
    cursor.execute(query,params)
    print('inserted in instructor ',kwargs)


def insert_student(**kwargs) :
    global cursor
    print('inserted in student ',kwargs)
    query = """
    INSERT INTO student (student_id, student_name, institution_id)
    VALUES(%(student_id)s , %(student_name)s , %(institution_id)s)
    """
    params_student = {
            'student_id' : kwargs.get('studentId'),
            'student_name' : kwargs.get('firstName') + ' ' + kwargs.get('lastName'),
            #TODO : use real institution_id
            'institution_id' : 'c1088478-c5e1-4c85-b18e-1667213955d8'
            }

    res_cursor = cursor.execute(query,params_student)
    #if ok TODO : how to check query went well
    if ( res_cursor.rowcount ) :
        #enroll to capstone presentation
        #capstone presentation , course_id :7ec1d8d5-a94a-40e2-b17d-e9b9067fb458
        query_course = """
        INSERT INTO student_course (course_id , student_id) 
        VALUES ( %(course_id)s , %(student_id)s )
        """
        params = {
                'course_id' : '7ec1d8d5-a94a-40e2-b17d-e9b9067fb458',
                'student_id' : kwargs.get('studentId')
                }
        res_cursor = cursor.execute(query_course, params)

        return { 'inserted' : True , 'student' : params_student }
    return { 'inserted': False }

def insert_embedding(studentId, img) :
    global cursor
    objs = DeepFace.represent(img_path=img,
                          model_name=MODEL_NAME,
                          detector_backend=FACE_DETECT_MODEL,
                          normalization='ArcFace',
                          anti_spoofing= False)
    embedding = objs[0]['embedding']

    params = {
        'embedding_id' : str(uuid.uuid4()),
        'student_id' : studentId,
        'content' : str(embedding)
    }
# query = """
# INSERT INTO embedding (embedding_id, student_id, content)
#   SELECT %(embedding_id)s , %(student_id)s , %(content)s::VECTOR(float,512)
# """
    query_f = f"""
    INSERT INTO embedding (embedding_id, student_id, content)
      SELECT  %(embedding_id)s , %(student_id)s , {embedding}::VECTOR(float,512)
    """;


    res = cursor.execute(query_f, params)
    if ( res.rowcount ) :
        print('embedding for student created ', params.get('student_id'))
        return {'inserted': True}
    return { 'inserted' : False }

def insert_class(**kwargs) :
    global cursor
    query = """
    INSERT INTO class (class_id, course_id, class_date, class_start)
    VALUES(%(class_id)s , %(course_id)s , %(class_date)s, %(class_start)s)
    """
    params = {
        'class_id' : str(uuid.uuid4()),
        'course_id' : kwargs.get('course_id'),
        'class_date' : kwargs.get('class_date'),
        'class_start' : kwargs.get('class_start'), #24hour format
        #'class_end' : kwargs.get('class_end'), #24hour format #TODO
        }
    res_cursor = cursor.execute(query,params)
    #if ok TODO : how to check query went well
    if ( res_cursor.rowcount ) :
        return { 'inserted' : True , 'class' : params }
    return { 'inserted': False }
    
def insert_course(**kwargs) :
    global cursor
    query = """
    INSERT INTO course (course_id, course_name, instructor_id, institution_id)
    VALUES(%(course_id)s , %(course_name)s , %(instructor_id)s, %(institution_id)s)
    """
    params = {
        'course_id' : str(uuid.uuid4()),
        'course_name' : kwargs.get('course_name'),
        'instructor_id' : kwargs.get('instructor_id'),
        'institution_id' : 'c1088478-c5e1-4c85-b18e-1667213955d8'#need institution to subscribe
    }

    res_cursor = cursor.execute(query,params)
    #if ok TODO : how to check query went well
    if ( res_cursor.rowcount ) :
        return { 'inserted' : True , 'course' : params }
    return { 'inserted': False }

def list_courses(instructorId) :
    global cursor
    query = """
    SELECT course_id, course_name, instructor_name 
    FROM course
    JOIN instructor using (instructor_id)
    WHERE instructor_id = %(instructorId)s
    """
    params = {
            'instructorId' : instructorId
            }
    res = cursor.execute(query,params).fetchall()
    return res;

def list_instructors() :
    global cursor
    query = """
    SELECT * 
    FROM instructor
    """
    res = cursor.execute(query).fetchall()
    return res;

def list_classes(courseId = None , class_id = None) :
    global cursor
    query = """
    SELECT course_name, to_char(class_start, 'HH12:MI'), class_id, class_date
    FROM class
    JOIN course using (course_id)
    """
    if courseId :
        query += """WHERE course_id = %(courseId)s"""
        params = {
                'courseId': courseId
                }
    else :
        query += """WHERE class_id = %(class_id)s"""
        params = {
                'class_id' : class_id
                }
    #print(f'query = {query}')
    res = cursor.execute(query,params).fetchall()
    return res

def list_attendance(class_id) :
    global dict_cursor
    print(f'list_attendance {class_id}')
    query = """
    SELECT student_name, last_seen , student_id
    FROM attendance
    JOIN student USING (student_id)
    WHERE class_id = %(class_id)s
    ORDER BY student_name ASC
    """
    params = {
            'class_id' : class_id 
            }
    res = dict_cursor.execute(query,params).fetchall()
    return res

def list_student_class(class_id, not_in_class = True) :
    global dict_cursor
    print(f'list_student_class , not in attendance {class_id}')
    query = """
        WITH in_class as (
         SELECT student_id 
         FROM attendance 
         WHERE class_id = %(class_id)s
        )
        SELECT student_name, student_id, class_id
        FROM student
        JOIN student_course using (student_id)
        JOIN course using (course_id)
        JOIN class using (course_id)
        WHERE class_id = %(class_id)s
    """
    if ( not_in_class ) :
        query += """
        AND student_id not in ( SELECT student_id from in_class)
        """
    query += """
    ORDER BY student_name ASC
    """
    params = {
            'class_id' : class_id,
            }
    res = dict_cursor.execute(query,params).fetchall();
    return res;


def deepface_recon(img_path) :
    # use deepface on the file
    # it's like all the files are at the root
    db = {
            'img_db/herify.jpg' : 'herify',
            'img_db/herify_1.png' : 'herify',
            'img_db/joshua_1.jpg' : 'joshua',
            'img_db/majid_1.jpg' : 'majid',
            'img_db/andres.png':'andres',
            }
    dfs = DeepFace.find(
            img_path = f'{name_file}',
            db_path = 'img_db',
            #model_name = 'SFace',
            model_name = MODEL_NAME,
            detector_backend = FACE_DETECT_MODEL,
            align=True,
            enforce_detection=False
            );
    print(f'dfs : {dfs}');
    new_attendance = set()
    for df in dfs :
        if not df.empty :
            file_name = df.iloc[0]['identity'];
            # get the identity from db using file_name
            identity = db.get(file_name)
            # update the attendance table
            new_attendance.add(identity)
            # send the attendance
    return list(new_attendance)

def face_recon(img_path, class_id) :
    #represent the faces 
    print('face_recon start')
    faces = DeepFace.represent(img_path=img_path,
                              model_name="ArcFace",
                              detector_backend="retinaface",
                              anti_spoofing= False)
    found_faces = []
    unknown = 0
    for face in faces :
        embedding_target = str(face['embedding'])
        search_query = f"""
          WITH results as (
            SELECT
              student_name, student_id,
              VECTOR_COSINE_SIMILARITY( content , {embedding_target}::VECTOR(FLOAT,512) ) as similarity
              FROM class
                    JOIN course using(course_id)
                    JOIN student_course using(course_id)
                    JOIN student using(student_id)
                    JOIN embedding using (student_id)
            WHERE class_id = '{class_id}'
          )
          SELECT student_name, student_id, similarity
          FROM results
          WHERE similarity > 0.5
          ORDER BY similarity DESC
        """
        res = cursor.execute(search_query).fetchall()
        if (len(res)>0) :
            student_name = res[0][0]
            student_id = res[0][1]
        else :
            unknown += 1
            student_name = f'unknown_{unknown}'
            student_id = 'unknown'

        found_faces.append({'student_name':student_name,'student_id' : student_id})

    print(found_faces)
    return found_faces
    #return student_id recognized else unknown
    #update attendance table of class_id

def count_head(frame) :
    print('count_head')
    try:
        faces = DeepFace.extract_faces(img_path=frame,
                                        detector_backend="retinaface",
                                        enforce_detection=False,
                                        anti_spoofing=False,)
    except Exception as e:
        print("Error during face extraction:", e)
        return frame

    
    nb = 1;
    for face in faces :
        facial_area = face.get("facial_area")
        x = facial_area["x"]
        y = facial_area["y"]
        w = facial_area["w"]
        h = facial_area["h"]
        label = f'person #{nb}';
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 4)
        cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return { 'frame' : frame, 'nb' : len(faces) }

def detect_and_recognize(frame, class_id) :
    print('detect_and_recognize')
    faces = DeepFace.represent(img_path=frame,
                              model_name="ArcFace",
                              detector_backend="retinaface",
                              normalization='ArcFace',
                              anti_spoofing= False)
    found_faces = []
    unknown = 0
    for face in faces :
        facial_area = face.get("facial_area")
        x = facial_area["x"]
        y = facial_area["y"]
        w = facial_area["w"]
        h = facial_area["h"]
        embedding_target = str(face['embedding'])
        search_query = f"""
          WITH results as (
            SELECT
              student_name, student_id,
              VECTOR_COSINE_SIMILARITY( content , {embedding_target}::VECTOR(FLOAT,512) ) as similarity
              FROM class
                    JOIN course using(course_id)
                    JOIN student_course using(course_id)
                    JOIN student using(student_id)
                    JOIN embedding using (student_id)
            WHERE class_id = '{class_id}'
          )
          SELECT student_name, student_id, similarity
          FROM results
          WHERE similarity > 0.5
          ORDER BY similarity DESC
        """
        res = cursor.execute(search_query).fetchall()
        if (len(res)>0) :
            student_name = res[0][0]
            student_id = res[0][1]
        else :
            unknown += 1
            student_name = f'unknown_{unknown}'
            student_id = 'unknown'
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 4)
        cv2.putText(frame, student_name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        found_faces.append({'student_name':student_name,'student_id' : student_id})

    print(found_faces)
    return { 'frame' : frame, 'found_faces' : found_faces };


def insert_in_attendance(student_ids, class_id) :
    #create query in a for loop
    #execute the query
    print(f'insert in attendance {student_ids} - {class_id}')
    #check if already inside
    for student_id in student_ids :
        search_query = """
        SELECT *
        FROM attendance 
        WHERE student_id = %(student_id)s AND class_id = %(class_id)s
        """
        params = {
                'student_id': student_id,
                'class_id' : class_id,
                }
        search_res = cursor.execute(search_query, params).fetchall()
        if ( len(search_res)>0 ) :
            print('update attendance last seen column')
            query = """
            UPDATE attendance
            SET last_seen = localtimestamp()
            WHERE student_id = %(student_id)s
            and class_id = %(class_id)s
            """
        else :
            print('insert in attendance new row')
            query = """
            INSERT INTO attendance (student_id, class_id, last_seen)
            VALUES ( %(student_id)s , %(class_id)s , localtimestamp() )
            """

        res = cursor.execute(query,params);
    #check last  status TODO : rollback commit queries
    q_id = res.sfqid;
    if ( conn.is_an_error( conn.get_query_status(q_id))) :
        return 'ERROR inserting/updating attendance table'
    else :
        return { 'inserted' : True , 'attendance' : params }

    
def delete_att(student_id, class_id) :
    print('delete_att :', student_id, class_id)
    query = """
    DELETE 
    FROM attendance
    WHERE student_id = %(student_id)s and class_id = %(class_id)s
    """
    params = {
            'student_id' : student_id,
            'class_id' : class_id
            }
    res = cursor.execute(query,params);
    q_id = res.sfqid;
    if ( conn.is_an_error( conn.get_query_status(q_id))) :
        return 'ERROR deleting attendance table'
    else :
        return { 'deleted' : True , 'attendance' : params }

def add_to_attendance(student_id, class_id) :
    print('add_to_attendance :', student_id, class_id)
    search_query = """
    SELECT *
    FROM attendance 
    WHERE student_id = %(student_id)s AND class_id = %(class_id)s
    """
    params = {
            'student_id': student_id,
            'class_id' : class_id,
            }
    search_res = cursor.execute(search_query, params).fetchall()
    if ( len(search_res) < 1 ) :
        query = """
        INSERT 
        INTO attendance(student_id, class_id, last_seen)
        VALUES ( %(student_id)s , %(class_id)s ,localtimestamp() )
        """
        res = cursor.execute(query, params);
        q_i = res.sfqid;
        if ( conn.is_an_error ( conn.get_query_status(q_i))) :
            return ' ERRROR inserting attendance table'
        else :
            return { 'inserted': True , 'attendance' : params }
    else :
        return { 'inserted' : True, 'attendance' : params }
