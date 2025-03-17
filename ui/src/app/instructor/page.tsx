// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Instructor_home() {
    const LOCAL = 'http://localhost:8000/courses/instruc_id';

    const [courses, setCourses] = useState([]);

    useEffect(() => {
      const fecthData = async () => {
          try {
              const res = await fetch(LOCAL, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              const data = await res.json();
              console.log('Response from server:', data);
              setCourses(data.courses);
              return data;
          } catch (error) {
              console.error('Error sending data:', error);
          }
      }

      fecthData();

    }, [])

    let courses_display = courses.map( (course) => 
                                      <option key={course}>
                                        {course}
                                      </option>
    );

    return (
        <div className={styles.page} style={{ 
          backgroundImage: 'url(/background.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          paddingTop: '64px', // Adjust for the height of the Top_header
        }}>
          <div className={styles.card}>
              <h1>Welcome to Live Video Attendance.</h1>
              <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <p> Select a course </p>
                <select>
                    {courses_display}
                </select>
              </div>
          </div> 
        </div>
    );
}
