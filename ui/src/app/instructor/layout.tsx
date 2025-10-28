// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"; // Mark as a client component if you use hooks or client-side features

import styles from "./layout.module.css";
 // Import the Top Header
import Link from 'next/link';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    

      <div className={styles.content}>
        
            <Suspense fallback={<p> Loading instructor ... </p>}>
                {children}
            </Suspense>
        
      </div>
    
  );
}
