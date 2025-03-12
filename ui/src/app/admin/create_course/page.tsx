'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    programName: '',
    instructorId: '',
    instructorName: '',
    year: '',
    semester: '',
    studentIds: '',
    timestamp: '',
  });

  useEffect(() => {
    const generateCourseId = () => {
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setFormData((prevData) => ({ ...prevData, courseId: `CRS-${randomId}` }));
    };

    generateCourseId();
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
    alert('Course created successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Course ID"
          name="courseId"
          value={formData.courseId}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course Name"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Program Name"
          name="programName"
          value={formData.programName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Instructor ID"
          name="instructorId"
          value={formData.instructorId}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Instructor Name"
          name="instructorName"
          value={formData.instructorName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
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
          label="Student IDs (comma-separated)"
          name="studentIds"
          value={formData.studentIds}
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
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateCourse;

