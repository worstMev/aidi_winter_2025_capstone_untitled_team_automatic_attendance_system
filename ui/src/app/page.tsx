
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
      <div className={styles.page} style={{ 
//          backgroundImage: 'url(/background.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          paddingTop: '64px', // Adjust for the height of the Top_header
      }}>
          <div className={styles.card}>
              <h1>Welcome to Live Video Attendance</h1>
              <p>Seamless Attedance through live video.</p>
              <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div>
                      <Link href="/instructor" className={styles.link}>
                      Instructor
                      </Link>
                      <Link href="/admin/create_instructor"> Sign up as a new instructor </Link>
                  </div>
                  <div>
                      <Link href="/admin/create_student" className={styles.link}>
                          Sign up as a new student
                      </Link>
                  </div>
                  <Link href="/test_attendance?class_id=775abe7b-bfcc-47b6-9fb2-dcfaf38b140f" className={styles.link}>
                  Test
                  </Link>
                  <Link href="/test_ext_feed?class_id=775abe7b-bfcc-47b6-9fb2-dcfaf38b140f" className={styles.link}>
                  Test external feed
                  </Link>
                  <Link href="/multi_video?class_id=775abe7b-bfcc-47b6-9fb2-dcfaf38b140f" className={styles.link}>
                  Test multi video chat
                  </Link>
              </div>
          </div> 
      </div>

  );
}
