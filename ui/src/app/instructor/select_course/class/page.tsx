// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

//TODO : attendance manual override
export default function Class_home() {
    const params = useSearchParams();
    const router = useRouter();
    const classId = params.get('classId'); 
    return(
        <div>
            <Suspense>
                <p> Attendance for class {classId} </p>
            </Suspense>
            <button onClick={()=> router.back()}> back </button>
        </div>
    );
}
