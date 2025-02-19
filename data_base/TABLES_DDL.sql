USE ROLE CREATOR;



CREATE OR REPLACE TABLE RECOG_DB.ATTEND.institution (
    institution_id INT AUTOINCREMENT PRIMARY KEY,
    name_of_institution VARCHAR,
    institution_type VARCHAR NOT NULL,
    country VARCHAR,
    region_province_state VARCHAR,
    city VARCHAR,
    postal_code VARCHAR,
    address VARCHAR,
    website_url VARCHAR,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE TABLE RECOG_DB.ATTEND.instructor(
    sys_id INT AUTOINCREMENT,
    institution_id INT,
    institutional_id VARCHAR ,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    employment_type VARCHAR ,
    is_active BOOLEAN DEFAULT TRUE,  -- Whether they are currently active
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ( institution_id, institutional_id)
);


CREATE OR REPLACE TABLE RECOG_DB.ATTEND.course(
    sys_id INT AUTOINCREMENT,
    institution_id INT NOT NULL,
    course_ins_id VARCHAR NOT NULL,
    course_name VARCHAR NOT NULL,
    program_name VARCHAR NOT NULL,
    instructor_id VARCHAR NOT NULL,
    year INT NOT NULL,
    semester VARCHAR NOT NULL,
    section INT,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_ins_id,year, semester,section)
);


CREATE OR REPLACE TABLE RECOG_DB.ATTEND.students(
    sys_id INT AUTOINCREMENT,
    institution_id VARCHAR NOT NULL,
    student_ins_id VARCHAR NOT NULL,
    student_name VARCHAR NOT NULL,
    student_middle_name VARCHAR,
    student_lastname VARCHAR NOT NULL,
    student_email VARCHAR NOT NULL,
    photo_id_path VARCHAR,
    PRIMARY KEY (student_ins_id)

);

DROP TABLE RECOG_DB.ATTEND.class_atendance;


CREATE OR REPLACE TABLE RECOG_DB.ATTEND.class_attendance (
    sys_id INT AUTOINCREMENT,
    institution_id INT,
    course_ins_id VARCHAR NOT NULL,
    instuctor_ins_id VARCHAR,
    class_date DATE NOT NULL,
    student_id VARCHAR,
    attended BOOLEAN,
    PRIMARY KEY (course_ins_id,class_date,student_id)
);


CREATE OR REPLACE TABLE RECOG_DB.ATTEND.course_enrollment (
    enrollment_id INT AUTOINCREMENT,
    course_ins_id VARCHAR NOT NULL,
    year INT NOT NULL,
    semester VARCHAR NOT NULL,
    section INT,  -- matches the COURSE table
    instructor_ins_id VARCHAR NOT NULL,
    student_ins_id VARCHAR NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR DEFAULT 'active',  -- e.g., active, dropped, completed
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_ins_id, year, semester, section, student_ins_id),
    FOREIGN KEY (course_ins_id, year, semester, section)
        REFERENCES RECOG_DB.ATTEND.course(course_ins_id, year, semester, section),
    FOREIGN KEY (student_ins_id)
        REFERENCES RECOG_DB.ATTEND.students(student_ins_id)
);



