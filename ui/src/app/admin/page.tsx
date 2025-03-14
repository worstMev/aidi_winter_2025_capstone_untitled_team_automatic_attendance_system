"use client"; // Mark as a client component

import styles from "./admin.module.css";
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className={styles.adminPage}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Manage your courses, institutes, instructors, and students.</p>
        </div>

        {/* Action Cards */}
        <div className={styles.grid}>
          <Link href="/admin/create_course" className={styles.card}>
            <h2>Create Course</h2>
            <p>Add a new course to the system.</p>
          </Link>

          <Link href="/admin/create_institute" className={styles.card}>
            <h2>Create Institute</h2>
            <p>Register a new institute.</p>
          </Link>

          <Link href="/admin/create_instructor" className={styles.card}>
            <h2>Create Instructor</h2>
            <p>Add a new instructor profile.</p>
          </Link>

          <Link href="/admin/create_student" className={styles.card}>
            <h2>Create Student</h2>
            <p>Register a new student.</p>
          </Link>
        </div>

        {/* Back to Home Button */}
        <div className={styles.controls}>
          <Link href="/" className={styles.button}>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}