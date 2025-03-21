// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';

export default function Instructor_home() {
    const LOCAL = 'http://localhost:8000';

    const [instructors, setInstructors] = useState([]);
    const [ selectedInstructor, setSelectedInstructor ] = useState(0);  

    const router = useRouter();

    useEffect(() => {
      const fecthData = async () => {
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
              setInstructors(data.instructors);
              setSelectedInstructor(data.instructors[0][0]);
              return data;
          } catch (error) {
              console.error('Error sending data:', error);
          }
      }

      fecthData();

    }, [])

    const changeSelectedInstructor = (e) => {
        console.log('changeSelectedInstructor to ',e.target.value);
        setSelectedInstructor(e.target.value);
    }

    const openCourse = (e) => {
        console.log('open course for instructor ', selectedInstructor)
        if( selectedInstructor ) {
            let params = new URLSearchParams({ instructorId : selectedInstructor })
            router.push(`/instructor/select_course?${params}` )
        }
    }

    let instructors_display = instructors.map( (instructor) => 
                                      <option key={instructor[0]} value={instructor[0]}>
                                        {instructor[1]}
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
                <p> Who are you ? (placeholder for a login) </p>
                <select
                    value= {selectedInstructor}
                    onChange= {changeSelectedInstructor}
                
                >
                    {instructors_display}
                </select>
                <button
                    onClick= {openCourse}
                >
                Proceed
                </button>
              </div>
          </div> 
        </div>
    );
}
