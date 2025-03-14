"use client"; // Mark as a client component if you use hooks or client-side features

import styles from "./admin.module.css";
 // Import the Top Header
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    

      <div className={styles.content}>
        
        <div>{children}</div>
        
      </div>
    
  );
}