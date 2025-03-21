// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState, } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Select_course_home() {

    return (
        <div>
            <p> select a class </p>
            <p> or </p>
            <Link href='/admin/create_class'> Create a new one </Link>
        </div>
    );
}
