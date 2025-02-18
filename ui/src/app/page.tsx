import styles from "./page.module.css";
import Link from 'next/link';


export default function Home() {
  return (
    <div className={styles.page}>
        <Link href="/admin">
            admin
        </Link>
    </div>
  );
}
