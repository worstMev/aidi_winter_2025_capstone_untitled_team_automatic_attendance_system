// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"; // Mark as a client component if you use hooks or client-side features

 // Import the Top Header
import Link from 'next/link';
import styles from "./layout.module.css";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchClasses, fetchCourses } from '@/fetchData';

export default function Layout({ children }: { children: React.ReactNode }) {
    const LOCAL = 'http://localhost:8000';

    const params = useSearchParams();
    const router = useRouter();


    const instructorId = params.get('instructorId')
    const [instructorName, setInstructorName] = useState('');
    const [courses, setCourses] = useState([]);
    const [ selectedCourse, setSelectedCourse ] = useState('');
    const [classes , setClasses] = useState([]);

    useEffect(() => {
        const fecthDataCourses = async () => {
            if (!instructorId) router.push('/instructor');
            console.log('instructorId ',instructorId);
            console.log('params ',params);
            try{
                const data = await fetchCourses(instructorId);
                setCourses(data.courses);
                setSelectedCourse(data.courses[0][0]);
                setInstructorName(data.courses[0][2]);
            }catch(error){
                console.log('error in fecthDataCourses :', error);
            }
        }
        const fecthDataClasses = async () => {
            console.log('get classes for courses', selectedCourse)
            try {
                const classes = await fetchClasses(selectedCourse);
                setClasses(classes);
            } catch (error) {
                console.error('Error fecthDataClasses:', error);
            }
        }

        if (selectedCourse) {
            fecthDataClasses()
        }else{
            fecthDataCourses()
        }

    }, [selectedCourse])


    const openClass = (classId) => {
        console.log('open classe id : ', classId)
        if( selectedCourse && classId ) {
            let params = new URLSearchParams({ classId : classId })
            router.push(`/instructor/select_course/class?${params}` )
        }
    }

    let courses_display = courses.map( (course) => 
                                      <option key={course[0]} value={course[0]}>
                                        {course[1]}
                                      </option>
    );

    let classes_display = classes.map( (classe) => 
                                      <button key={classe[2]} onClick={()=> openClass(classe[2])}>
                                      {`${classe[0]} - ${classe[3]} at  ${classe[1]}`}
                                      </button>
    );

    return (
        <div className={styles.page}>
            <div className={styles.selectPane} >
                <Suspense>
                    <h1>{instructorName}</h1>
                </Suspense>
                <div className={styles.courses}>
                    <p> Select a course : </p>
                    <select
                        value = {selectedCourse}
                        onChange = { (e) => setSelectedCourse(e.target.value)}
                        >
                        {courses_display}
                    </select>
                </div>
                <div className={styles.classes}>
                    <p>classes :</p>
                    {classes_display}
                </div>
            </div>
            <div className={styles.display}>
                {children}
            </div>
        </div>
    );
    

    
}
