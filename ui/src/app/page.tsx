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
          <Link href="/admin" className={styles.link}>
            Admin
          </Link>
          <Link href="/video_chat" className={styles.link}>
            Start Video Chat
          </Link>
          <Link href="/settings" className={styles.link}>
            Settings
          </Link>
        </div>
      </div> 
    </div>
  );
}
