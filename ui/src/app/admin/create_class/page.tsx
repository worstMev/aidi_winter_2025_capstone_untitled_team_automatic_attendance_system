// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useState, useEffect } from 'react';
import styles from './create_class.module.css'; // Import CSS module
import { useSearchParams, useRouter } from 'next/navigation';

import { fetchInstructors, fetchCourses, createClass } from '@/fetchData.ts';

export default function CreateClass() {

    const router = useRouter();
    const params = useSearchParams();
    const instructorId =  params.get('instructorId') || '';

    const [formData, setFormData] = useState({
        class_date : '',
        class_start : '',
        class_end : '',
    });

    const [ instructors , setInstructors ] = useState([]);
    const [ courses , setCourses ] = useState([]);
    const [ selectedInstructor , setSelectedInstructor ] = useState(instructorId);
    const [ selectedCourse , setSelectedCourse ] = useState('');


    useEffect(() => {
        const fetchDataInstructors = async () => {
            console.log('fetchIntructors');
            let data = await fetchInstructors();
            let instructors = data.instructors;
            console.log('instructors' , instructors[0][0]);
            setInstructors(instructors);
            setSelectedInstructor(instructors[0][0]);
        }
        const fetchDataCourses = async () => {
            console.log('fetchCourses')
            let data = await fetchCourses(selectedInstructor);
            let courses = data.courses;
            console.log('courses', courses);
            setCourses(courses);
            setSelectedCourse(courses[0][0]);
        }

        //console.log('selectedInstructor', selectedInstructor);
        if (!selectedInstructor) {
            fetchDataInstructors();
        }else{
            fetchDataCourses();
        }
    },[selectedInstructor])

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('change ',name, value)
        setFormData((prevData) => ({ ...prevData, [name] : value}));
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for submitting the class data
        console.log('submit new class ',formData);
        let jsonData = JSON.stringify({ ...formData, course_id : selectedCourse});
        console.log('Form Data:', jsonData);
        let res = await createClass(jsonData);
        if (res.inserted) router.back();

    };

    const instructors_display = instructors.map( (instructor) => 
                                                <option key={instructor[0]} value={instructor[0]}>
                                                    {instructor[1]}
                                                </option>

   );
   let courses_display;

   if (courses){
       courses_display = courses.map( (course) => 
                                         <option key={course[0]} value={course[0]}>
                                         {course[1]}
                                         </option>
                                        );
   }
   //console.log('selectedInstructor', selectedInstructor)

                                               
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New class</h1>
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="Instructor" className={styles.label}>
                        Instructor
                    </label>
                    <select 
                        value = {selectedInstructor}
                        onChange = { (e) => setSelectedInstructor(e.target.value) }
                        >
                        {instructors_display}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="Course" className={styles.label}>
                        Course
                    </label>
                    <select
                        value = {selectedCourse}
                        onChange = { (e) => setSelectedCourse(e.target.value) }
                        >
                        {courses_display}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>
                    date 
                        <input 
                            type = "date"
                            name= "class_date"
                            value={formData.class_date}
                            onChange={handleChange}
                            required
                            />
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label>
                    start
                        <input 
                            type = "time"
                            name= "class_start"
                            value={formData.class_start}
                            onChange={handleChange}
                            required
                            />
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label>
                    end
                        <input 
                            type = "time"
                            name= "class_end"
                            value={formData.class_end}
                            onChange={handleChange}
                            required
                            />
                    </label>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Create class
                </button>
            </form>
        </div>
    );
}
