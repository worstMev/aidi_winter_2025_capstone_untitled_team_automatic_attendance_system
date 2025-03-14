"use client";
import React, { useState, useEffect } from 'react';
import styles from './create_instructor.module.css';

const CreateInstructor = () => {
  const [formData, setFormData] = useState({
    instructorId: '',
    institutionId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    employmentType: '',
    isActive: false,
    timestamp: '',
  });

  useEffect(() => {
    const generateInstructorId = () => {
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setFormData((prevData) => ({ ...prevData, instructorId: `INST-${randomId}` }));
    };

    generateInstructorId();
  }, []);

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setFormData((prevData) => ({ ...prevData, timestamp }));
    console.log('Form Data:', formData);
    alert('Instructor created successfully!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Instructor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="instructorId" className={styles.label}>
            Instructor ID
          </label>
          <input
            type="text"
            id="instructorId"
            name="instructorId"
            value={formData.instructorId}
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="institutionId" className={styles.label}>
            Institution ID
          </label>
          <input
            type="text"
            id="institutionId"
            name="institutionId"
            value={formData.institutionId}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="middleName" className={styles.label}>
            Middle Name
          </label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employmentType" className={styles.label}>
            Employment Type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="isActive" className={styles.label}>
            Is Active
          </label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className={styles.checkbox}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timestamp" className={styles.label}>
            Timestamp
          </label>
          <input
            type="text"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            className={styles.input}
            readOnly
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateInstructor;