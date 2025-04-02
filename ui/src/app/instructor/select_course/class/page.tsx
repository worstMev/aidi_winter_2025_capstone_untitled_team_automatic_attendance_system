// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import ClassInfo from '@/component/class_info';
//import StudentSearch from '@/component/student_search';
import { fetchAttendance, removeFromAttendance, fetchStudentClass, addToAttendance } from '@/fetchData';

//TODO : attendance manual override
export default function Class_home() {
    const params = useSearchParams();
    const router = useRouter();
    const class_id = params.get('classId'); 

    const [ students , set_students ] = useState([]);
    const [ students_not_in , set_students_not_in ] = useState([]);

    useEffect(() => {
        const fetchData = async (class_id) => {
            console.log('get data in class attendance, class_id :', class_id);
            const stds = await fetchAttendance(class_id);
            const stds_not_in = await fetchStudentClass(class_id);
            set_students_not_in(stds_not_in);
            set_students(stds);
        }

        fetchData(class_id);
    },[]);

    const remove_student = async (student_id, class_id ) => {
        console.log('remove_student :', student_id, class_id);
        const response = await removeFromAttendance(student_id, class_id);
        if( response.deleted ) {
            const stds = await fetchAttendance(class_id);
            const stds_not_in = await fetchStudentClass(class_id);
            set_students_not_in(stds_not_in);
            set_students(stds);
        }
    }

    const add_student = async (student_id, class_id) => {
        console.log('add_student ',student_id, class_id);
        const response = await addToAttendance(student_id, class_id);
        if (response.inserted ){
            console.log('students inserted');
            const stds = await fetchAttendance(class_id);
            const stds_not_in = await fetchStudentClass(class_id);
            set_students_not_in(stds_not_in);
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
                    action = {async  () => {await remove_student(student_id,class_id)}}
                    action_name = 'remove'
                    student={student} 
                />
            );
        })
    }
    let students_not_in_display ;
    if (students_not_in) {
        students_not_in_display = students_not_in.map((student) =>{ 
            const student_id = student.STUDENT_ID;
            return(
                <Student 
                    key={student_id} 
                    action = {async  () => {await add_student(student_id,class_id)}}
                    action_name = 'add'
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
                <p> Student{(students.length > 1) ? 's':'' } in class : {students.length} </p>
                {students_display}
            </div>
            <div className={styles.not_in}>
                <p> Student{(students_not_in.length > 1) ? 's':'' } not in class : {students_not_in.length} </p>
                {students_not_in_display}
            </div>
            <button onClick={()=> router.back()}> back </button>
        </div>
    );
}

function Student (props){
    const { student, action, action_name } = props;
    let last_seen_og = student.LAST_SEEN;
    let last_seen = new Date(last_seen_og).toLocaleString();
    return (
        <div className={styles.student}>
            <div className={styles.std_info}>
                <p> {student.STUDENT_NAME} </p>
                { last_seen_og &&
                    <p> last seen : {last_seen} </p>
                }
            </div>
            <div>
                <button onClick={action} > {action_name} </button>
            </div>
        </div>
    )
}
