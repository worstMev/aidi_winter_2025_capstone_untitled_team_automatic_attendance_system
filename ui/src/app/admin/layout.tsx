// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"; // Mark as a client component if you use hooks or client-side features

import styles from "./admin.module.css";
 // Import the Top Header
import Link from 'next/link';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    

      <div className={styles.content}>
        
        <div>
            <Suspense fallback={<p> Loading admin ... </p>}>
                {children}
            </Suspense>
        </div>
        
      </div>
    
  );
}
