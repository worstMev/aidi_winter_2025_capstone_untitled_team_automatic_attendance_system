
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
      <div className={styles.page} style={{ 
          backgroundImage: 'url(/background.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          paddingTop: '64px', // Adjust for the height of the Top_header
      }}>
          <div className={styles.card}>
              <h1>Welcome to Live Video Attendance</h1>
              <p>Attendance through seamless video calls.</p>
              <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div>
                      <Link href="/instructor" className={styles.link}>
                      Instructor
                      </Link>
                      <Link href="/admin/create_instructor"> Sign up as a new instructor </Link>
                  </div>
                  <div>
                      <Link href="/student" className={styles.link}>
                          Student
                      </Link>
                      <Link href="/admin/create_student"> Sign up as a new student </Link>
                  </div>
                  <Link href="/test_attendance?class_id=class_id_1" className={styles.link}>
                  Test
                  </Link>
                  <Link href="/video_chat" className={styles.link}>
                  all_Test
                  </Link>
              </div>
          </div> 
      </div>

  );
}
