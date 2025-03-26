
#import snowflake
import snowflake.connector
import uuid
from deepface import DeepFace
MODEL_NAME = 'ArcFace'
FACE_DETECT_MODEL = 'retinaface'
my_db_params ={
  "account" : "FUKSKIX-MJ13450",
  "user" : "untitled",
  "password" : "Capstoneproject2025!",
  "role" : "ACCOUNTADMIN",
  "warehouse" : "COMPUTE_WH",
  "database" : "FACE_RECOGNITION_DB",
  "schema" : "PUBLIC",
  }
conn = snowflake.connector.connect(
        **my_db_params
)

cursor = conn.cursor()

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
        #enroll to IT EXPO
        #IT EXPO , course_id :d0abd913-3669-428f-8e45-217a970d31d3
        query_course = """
        INSERT INTO student_course (course_id , student_id) 
        VALUES ( %(course_id)s , %(student_id)s )
        """
        params = {
                'course_id' : 'd0abd913-3669-428f-8e45-217a970d31d3',
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
                          anti_spoofing= True)
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

def list_classes(courseId) :
    global cursor
    query = """
    SELECT course_name, to_char(class_start, 'HH12:MI'), class_id, class_date
    FROM class
    JOIN course using (course_id)
    WHERE course_id = %(courseId)s;
    """
    params = {
            'courseId': courseId
            }
    #print(f'query = {query}')
    res = cursor.execute(query,params).fetchall()
    return res

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
                              anti_spoofing= True)
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


async def insert_in_attendance(student_ids, class_id) :
    #create query in a for loop
    #execute the query
    print(f'insert in attendance {student_ids} - {class_id}')
