'use client';
import Link from 'next/link';
import styles from './create_student.module.css';
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

import TakePicture from '@/component/take_picture';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    photoId: '',
    semester: '',
    timestamp: '',
  });

  useEffect(() => {
    const generateStudentId = () => {
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setFormData((prevData) => ({ ...prevData, studentId: `STU-${randomId}` }));
    };

    generateStudentId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setFormData((prevData) => ({ ...prevData, timestamp }));
    console.log('Form Data:', formData);
    alert('Student created successfully!');
  };

  return (
    <div className={styles.all}>
      <h2>Create Student</h2>
      <form onSubmit={handleSubmit} >
        <TextField
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Photo ID (URL)"
          name="photoId"
          value={formData.photoId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Timestamp"
          name="timestamp"
          value={formData.timestamp}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <div className={styles.label}>
            Take picture :
                <TakePicture/>
        </div>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateStudent;

