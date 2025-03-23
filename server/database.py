
#import snowflake
import snowflake.connector
import uuid
from deepface import DeepFace

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
        return { 'inserted' : True , 'student' : params_student }
    return { 'inserted': False }

def insert_embedding(studentId, img) :
    global cursor
    objs = DeepFace.represent(img_path=img,
                          model_name="ArcFace",
                          detector_backend="retinaface",
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
