// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import styles from './create_course.module.css'; // Import CSS module
import { createCourse, fetchInstructors } from '@/fetchData';

export default function CreateCourse() {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseDuration, setCourseDuration] = useState('');

    //if we come from instructor page, get instructorId from session : when session implemented
    const [ selectedInstructor , setSelectedInstructor ] = useState('');
    const [ instructors, setInstructors ] = useState([]);
    //TODO , Program implementation as well
    //get institution_id from session when session is implemented or not since one instructor can be linked to multiple institution , course creation should be pure adim stuff then
    //const [ selectedInstitution, setSelectedInstitution ] = useState(null);
    //const [ institutions, setInstitutions ] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const {instructors} = await fetchInstructors();
            console.log('instructors', instructors);
            setInstructors(instructors);
            setSelectedInstructor(instructors[0][0])
        }

        fetchData();
    },[])

    //TODO make create course , need institution_id, instructor_id
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for submitting the course data
        let data = {
            instructor_id : selectedInstructor,
            course_name : courseName,
        }
        data = JSON.stringify(data);
        console.log('create course :',data);
        
        //await createCourse();
        try{
            let res = await createCourse(data);
            console.log('response :',res);
            if (res.inserted){
                alert('Course created.');
                setCourseName('');
                setCourseDescription('');
            }
        }catch(err){
            console.log('error in create_course ui:', err);
        }


    };

    let instructors_display ;
    if (instructors){
        instructors_display = instructors.map((inst) => {
            return (
                <option key={inst[0]} value={inst[0]}>
                {inst[1]}
                </option>
            );
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Course</h1>
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="courseInstructor" className={styles.label}>
                    Course Instructor
                    </label>
                    <select
                    id="instructor_id"
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    className={styles.input}
                    required
                    >
                        {instructors_display}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="courseName" className={styles.label}>
                    Course Name
                    </label>
                    <input
                    type="text"
                    id="courseName"
                    placeholder="Enter course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className={styles.input}
                    required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="courseDescription" className={styles.label}>
                    Course Description
                    </label>
                    <textarea
                    id="courseDescription"
                    placeholder="Enter course description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className={styles.textarea}
                    required
                    />
                </div>


                <button type="submit" className={styles.submitButton}>
                Create Course
                </button>
            </form>
        </div>
    );
}
