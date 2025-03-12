'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, Checkbox, FormControlLabel } from '@mui/material';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setFormData((prevData) => ({ ...prevData, timestamp }));
    console.log('Form Data:', formData);
    alert('Instructor created successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Instructor</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Instructor ID"
          name="instructorId"
          value={formData.instructorId}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Institution ID"
          name="institutionId"
          value={formData.institutionId}
          onChange={handleChange}
          required
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
        <Select
          label="Employment Type"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select Type</MenuItem>
          <MenuItem value="Full-Time">Full-Time</MenuItem>
          <MenuItem value="Part-Time">Part-Time</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          }
          label="Is Active"
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

export default CreateInstructor;
