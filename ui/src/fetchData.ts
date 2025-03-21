
const LOCAL = 'http://localhost:8000';

export const fetchInstructors = async () => {
    let url_instructor = LOCAL+'/instructor';
    try {
        const res = await fetch(url_instructor, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

export const fetchCourses = async (instructorId) => {
    let url_course = `${LOCAL}/courses/${instructorId}`;
    try {
        const res = await fetch(url_course, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('Error fecthDataCourses:', error);
    }
}

export const fetchClasses = async (selectedCourse) => {
    console.log('get classes for courses', selectedCourse)
    let url_course = `${LOCAL}/classes/${selectedCourse}`;
    try {
        const res = await fetch(url_course, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log('Response from server:', data);
        return data.classes;
    } catch (error) {
        console.error('Error fecthDataClasses:', error);
    }
}

export const createClass = async (jsonData) => {
    let url_create_class = `${LOCAL}/create_class`;
    console.log('createClass:', jsonData);
    try {
        const res = await fetch(url_create_class, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        console.log('Response from server, createClass:', data);
        return data;
    } catch (error) {
        console.error('Error sending data:', error);
    }
}
