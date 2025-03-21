// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState } from 'react';
import styles from './create_course.module.css'; // Import CSS module

export default function CreateCourse() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for submitting the course data
    console.log({ courseName, courseDescription, courseDuration });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Course</h1>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="courseName" className={styles.label}>
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            placeholder="Enter course name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="courseDescription" className={styles.label}>
            Course Description
          </label>
          <textarea
            id="courseDescription"
            placeholder="Enter course description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="courseDuration" className={styles.label}>
            Course Duration
          </label>
          <input
            type="text"
            id="courseDuration"
            placeholder="Enter course duration (e.g., 4 weeks)"
            value={courseDuration}
            onChange={(e) => setCourseDuration(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Course
        </button>
      </form>
    </div>
  );
}
