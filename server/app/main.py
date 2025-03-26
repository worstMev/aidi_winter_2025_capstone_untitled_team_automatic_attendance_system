from fastapi import FastAPI,File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import socketio
import numpy as np
from deepface import DeepFace

#import data model
from data_model import Institution, Instructor, Student, Course, Classe
from database import insert_class, insert_institution, insert_instructor, insert_student, insert_embedding, list_courses, list_instructors, list_classes, face_recon, deepface_recon, insert_in_attendance, insert_course





origins = [
        'http://localhost:3000',
        ]
origins_all = '*'
app = FastAPI();

#configure socket io server
sio = socketio.AsyncServer(async_mode = 'asgi',
                           #cors_allowed_origins = origins_all, custom socket io is only cors
                           allowEIO3 = True,
                           )
sio_app = socketio.ASGIApp(sio, socketio_path='/ws/socket.io')
app.mount('/ws', sio_app)

#configure fastapi
app.add_middleware(
        CORSMiddleware,
        allow_origins = origins_all,
        allow_credentials = True,
        allow_methods=['*'],
        allow_headers=['*']
        )

#emulate database, list of names
db = {
        'img_db/herify.jpg' : 'herify',
        'img_db/herify_1.png' : 'herify',
        'img_db/joshua_1.jpg' : 'joshua',
        'img_db/majid_1.jpg' : 'majid',
        'img_db/andres.png':'andres',
        }
attendance_db = []

# test api
@app.get('/')
def root() :
    return { 'message' : 'Hello world' }

@app.get('/instructor')
async def get_instructors():
    print(f'get instructors list')
    instructor_list = list_instructors()
    return { 'instructors': instructor_list }

@app.get('/courses/{instructorId}')
async def get_courses(instructorId) : 
    print(f'get course for instructor ',instructorId)
    course_list = list_courses(instructorId)
    return { 'courses' : course_list }

@app.get('/classes/{courseId}')
async def get_classes(courseId) : 
    print(f'get classes for course ',courseId)
    class_list = list_classes(courseId)
    return { 'classes' : class_list }

@app.post('/create_institution')
def create_instructor (institution : Institution) :
    institution_dict = institution.dict()
    insert_institution(**institution_dict)
    return institution


@app.post('/create_instructor')
def create_instructor (instructor : Instructor) :
    instructor_dict = instructor.dict()
    insert_instructor(**instructor_dict)
    return instructor


@app.post('/create_student')
def create_student (student : Student) :
    student_dict = student.dict()
    results = insert_student(**student_dict)
    return results

@app.post('/save_picture/{studentId}')
async def save_picture (studentId,picture : UploadFile) :
    print('save picture for studentId : ',studentId)
    print( type(picture))
    name_pic = f'temp_student_pic/{studentId}.png'
    blob = await picture.read()
    with open(name_pic,'ab') as file:
        file.write(blob)
    results = insert_embedding(studentId,name_pic)
    return results

@app.post('/create_class')
async def  create_class(classe : Classe) :
    classe_dict = classe.dict()
    results = insert_class(**classe_dict)
    return results

@app.post('/create_course')
async def create_course(course : Course) :
    course_dict = course.dict()
    results = insert_course(**course_dict)
    return results


# handle socket-io events
@sio.event
async def connect(sid, *args, **kwargs):
    print(f'{sid} connected')
    await sio.emit( 'hello', { 'data' : 'hello world' }, to=sid);
    return

@sio.on('message')
async def  handle_message(sid, data) :
    data = data + ' from server'
    await sio.emit('message', { 'data' : data }, to=sid)
    return


@sio.on('stream')
async def handle_stream(sid, *args, **kwargs):
    print(f'-'*40);
    print(f'sid {sid}');

    # testing logs
    #print(f'args : {args}');
    #print(f'data : {data}');
    #print(f'kwargs : {kwargs}');

    #get the data
    blob = args[0]['blob'];
    #data = args[0]['data'];


    #read buffer
    #read_buffer = io.BytesIO(data)

    #name_file
    name_file = f'buffer/buffer_{sid}.png'

    #save file
    with open(name_file,'ab') as file :
        file.write(blob)

    # use deepface on the file
    # it's like all the files are at the root
    dfs = DeepFace.find(
            img_path = f'{name_file}',
            db_path = 'img_db',
            #model_name = 'SFace',
            model_name = 'ArcFace',
            detector_backend = 'retinaface',
            align=True,
            enforce_detection=False
            );

    print(f'dfs : {dfs}');

    for df in dfs :
        if not df.empty :
            global attendance_db
            new_attendance = set(attendance_db)
            file_name = df.iloc[0]['identity'];

            # get the identity from db using file_name
            identity = db.get(file_name)
            # update the attendance table
            new_attendance.add(identity)
            # send the attendance
            attendance_db = list(new_attendance)
            print('Detected :', identity );
            # await sio.emit('detection', { 'data' : identity});
            await sio.emit('attendance', { 'attendance' : attendance_db});

    print(f'-'*40);

    # test emit
    #await sio.emit('detection',{ 'data' : 'fake herify'})

    return { 'message': 'return outside' }



@sio.on('stream_class')
async def handle_stream_class(sid, *args, **kwargs):
    print('class_id',args[0]['class_id'])

    class_id = args[0]['class_id']
    blob = args[0]['blob']
    name_file = f'buffer/buffer_{sid}.png'
    #save file
    with open(name_file,'wb') as file :
        file.write(blob)

    await sio.emit('received_pic', to =sid)
    recognized = face_recon(name_file,class_id)
    #emit socket with recognized tag , remove unkown > student_ids
    student_names = [
            face.get('student_name')
            for face in recognized
    ]
    await sio.emit('recognized', {'recognized' : recognized} , to = sid)
    student_ids = [
        face.get('student_id')
        for face in recognized if face.get('student_id') != 'unknown'
    ]

    await insert_in_attendance(student_ids, class_id)
    #emit socket recon


