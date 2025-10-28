// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect , useState } from 'react';
import { fetchStudentClass } from '@/fetchData';

export default function StudentSearch(props) {
    const { class_id } = props;

    useEffect(() => {
        //get list of students from course from class_id
        const fetchData = async (class_id) => {
            await fetchStudentClass(class_id);
        }

        if (class_id){
            fetchData(class_id);
        }

    },[]);
    return(
        <div>
            <p> Search student from class {class_id} </p>
        </div>
    )
}
