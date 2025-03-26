from pydantic import BaseModel

class Institution(BaseModel):
    instituteId: str | None = None
    name: str | None = None
    institutionType: str | None = None
    country: str | None = None
    stateProvince: str | None = None
    city: str | None = None
    postalCode: str | None = None
    address : str | None = None
    websiteURL: str | None = None
    timestamp: str | None = None

class Instructor(BaseModel):
    instructorId: str | None = None
    institutionId: str | None = None
    firstName: str | None = None
    middleName: str | None = None
    lastName: str | None = None
    email: str | None = None
    employmentType: str | None = None
    isActive: bool = False
    timestamp: str | None = None

class Student(BaseModel):
    studentId: str | None = None
    firstName: str | None = None
    middleName: str | None = None
    lastName: str | None = None
    email: str | None = None
    semester: str | None = None
    timestamp: str | None = None

class Classe(BaseModel) :
    class_id : str | None = None
    course_id : str | None = None
    class_date : str | None = None
    class_start : str | None = None
    class_end : str | None = None

class Course(BaseModel) :
    course_id : str | None = None
    instructor_id : str | None = None
    course_name : str | None = None
