// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import ClassInfo from '@/component/class_info';
import StudentSearch from '@/component/student_search';
import { fetchAttendance, removeFromAttendance } from '@/fetchData';

//TODO : attendance manual override
export default function Class_home() {
    const params = useSearchParams();
    const router = useRouter();
    const class_id = params.get('classId'); 

    const [ students , set_students ] = useState([]);

    useEffect(() => {
        const fetchData = async (class_id) => {
            console.log('get data in class attendance, class_id :', class_id);
            const stds = await fetchAttendance(class_id);
            set_students(stds);
        }

        fetchData(class_id);
    },[]);

    const remove_student = async (student_id, class_id ) => {
        console.log('remove_student :', student_id, class_id);
        const response = await removeFromAttendance(student_id, class_id);
        if( response.deleted ) {
            const stds = await fetchAttendance(class_id);
            set_students(stds);
        }
    }

    let students_display ;
    if (students) {
        students_display = students.map((student) =>{ 
            const student_id = student.STUDENT_ID;
            return(
                <Student 
                    key={student_id} 
                    remove = {async  () => {await remove_student(student_id,class_id)}}
                    student={student} 
                />
            );
        })
    }
    return(
        <div className={styles.page}>
            <Suspense>
                <ClassInfo class_id={class_id} />
            </Suspense>
            <div className={styles.attendance}>
                {students_display}
            </div>
            <div className={styles.search}>
                <StudentSearch class_id= {class_id} />
            </div>
            <button onClick={()=> router.back()}> back </button>
        </div>
    );
}

function Student (props){
    const { student, remove } = props;
    let last_seen = student.LAST_SEEN;
    last_seen = new Date(last_seen).toLocaleString();
    return (
        <div className={styles.student}>
            <div className={styles.std_info}>
                <p> {student.STUDENT_NAME} </p>
                <p> last seen : {last_seen} </p>
            </div>
            <div>
                <button onClick={remove} > Remove </button>
            </div>
        </div>
    )
}
