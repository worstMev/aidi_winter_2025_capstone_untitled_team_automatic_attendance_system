'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';

const CreateInstitute = () => {
  const [formData, setFormData] = useState({
    instituteId: '',
    name: '',
    institutionType: '',
    country: '',
    stateProvince: '',
    city: '',
    postalCode: '',
    websiteURL: '',
    timestamp: '',
  });

  useEffect(() => {
    const generateInstituteId = () => {
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setFormData((prevData) => ({ ...prevData, instituteId: `INST-${randomId}` }));
    };

    generateInstituteId();
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
    alert('Institute created successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Institute</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Institute ID"
          name="instituteId"
          value={formData.instituteId}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name of Institute"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <Select
          label="Institution Type"
          name="institutionType"
          value={formData.institutionType}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select Type</MenuItem>
          <MenuItem value="School">School</MenuItem>
          <MenuItem value="College">College</MenuItem>
          <MenuItem value="University">University</MenuItem>
          <MenuItem value="Training Center">Training Center</MenuItem>
        </Select>
        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="State/Province"
          name="stateProvince"
          value={formData.stateProvince}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Website URL"
          name="websiteURL"
          value={formData.websiteURL}
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

export default CreateInstitute;
