// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const LOCAL = 'http://localhost:8000';
const SERVER = 'http://18.191.140.215:8000';
const SERVER_GPU = 'http://3.143.251.171:8000';
export const BASE = SERVER;


const apiCall = async (url,method,jsonData) => {
    console.log('postCall to :',url,method,jsonData);
    const options = {
        method : method,
        headers : {
            'Content-Type': 'application/json',
        },
    }
    if (method === 'POST' && jsonData) {
        //add body to options
        options.body = jsonData
    }
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        console.log('Response from server,', url, data);
        return data;
    } catch (error) {
        console.error('Error sending data:', url, error);
    }
}



export const fetchInstructors = async () => {
    let url_instructor = BASE+'/instructor';
    const response = await apiCall(url_instructor, 'GET', null);
    return response;
}

export const fetchCourses = async (instructorId) => {
    let url_course = `${BASE}/courses/${instructorId}`;
    const response = await apiCall(url_course, 'GET', null);
    return response;
}

export const fetchClasses = async (selectedCourse) => {
    console.log('get classes for courses', selectedCourse)
    let url_course = `${BASE}/classes/${selectedCourse}`;
    const response = await apiCall(url_course, 'GET', null);
    return response.classes;
}

export const createClass = async (jsonData) => {
    let url_create_class = `${BASE}/create_class`;
    console.log('createClass:', jsonData);
    const response = await apiCall(url_create_class, 'POST', jsonData);
    return response;
}

export const createCourse = async (jsonData) => {
    //TODO
    let url_create_course = `${BASE}/create_course`;
    console.log('createCourse', jsonData);
}


export const createInstitute = async (jsonData) => {
    let url_create_institute = `${BASE}/create_institution`;
    console.log('createInstitute:', jsonData);
    const response = await apiCall(url_create_institute, 'POST', jsonData);
    return response;
}

export const createInstructor = async (jsonData) => {
    let url_create_instructor = `${BASE}/create_instructor`;
    console.log('createInstructor :', jsonData);
    const response = await apiCall(url_create_instructor, 'POST', jsonData);
    return response;
}

export const createStudent = async (jsonData) => {
    let url_create_student = `${BASE}/create_student`;
    console.log('createStudent : ', jsonData);
    const response = await apiCall(url_create_student, 'POST', jsonData);
    return response;
}

export const createEmbedding = async (studentId, pic) => {
    let url_create_embedding = `${BASE}/save_picture/${studentId}`;
    try {
        const res = await fetch(url_create_embedding, {
            method: 'POST',
            body: pic,
            //headers: {
            //    'Content-Type': 'multipart/form-data',
            //},
        });
        const response = await res.json()
        console.log('Response from server:', response);
        return response;
    }catch(error){
        console.log('error in createEmbedding :',error);
    }

}
