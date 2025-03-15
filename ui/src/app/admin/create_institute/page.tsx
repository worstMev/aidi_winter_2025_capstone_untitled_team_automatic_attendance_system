// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import styles from './create_institute.module.css';

const LOCAL = 'http://localhost:8000/create_institution';
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async  (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setFormData((prevData) => ({ ...prevData, timestamp }));
    console.log('Form Data:', formData);
    let jsonData = JSON.stringify(formData);
    console.log('Form Data:', jsonData);
    try {
        const res = await fetch(LOCAL, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        console.log('Response from server:', data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
    alert('Institute created successfully!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Institute</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="instituteId" className={styles.label}>
            Institute ID
          </label>
          <input
            type="text"
            id="instituteId"
            name="instituteId"
            value={formData.instituteId}
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name of Institute
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="institutionType" className={styles.label}>
            Institution Type
          </label>
          <select
            id="institutionType"
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select Type</option>
            <option value="School">School</option>
            <option value="College">College</option>
            <option value="University">University</option>
            <option value="Training Center">Training Center</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country" className={styles.label}>
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stateProvince" className={styles.label}>
            State/Province
          </label>
          <input
            type="text"
            id="stateProvince"
            name="stateProvince"
            value={formData.stateProvince}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="postalCode" className={styles.label}>
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="websiteURL" className={styles.label}>
            Website URL
          </label>
          <input
            type="text"
            id="websiteURL"
            name="websiteURL"
            value={formData.websiteURL}
            onChange={handleChange}
            className={styles.input}
            required
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

export default CreateInstitute;
