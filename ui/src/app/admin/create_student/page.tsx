// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import Link from 'next/link';
import styles from './create_student.module.css';
import React, { useState, useEffect } from 'react';

import { createStudent, createEmbedding } from '@/fetchData';

import TakePicture from '@/component/take_picture';
//TODO : institution select

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    photoId: '',
    semester: '',
  });

  const [picData,setPicData] = useState(null);
  const [ studentCreated, setStudentCreated ] = useState(false);
  const [ canTakePicture, setCanTakePicture ] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    let jsonData = JSON.stringify(formData);
    console.log('Form Data:', jsonData);
    const data = await createStudent(jsonData);
    if (data.inserted){
        setCanTakePicture(data.inserted);
        setFormData(data.student);
    }
    alert('Student created successfully!');
  };

  const savePic = async (pic_data) => {
      if( canTakePicture ) {
          console.log('send pic data',pic_data);
          setPicData(pic_data);
          //save blob 
          //send blob

          let pic = new FormData();
          pic.append('picture',pic_data);
          //pic.append('picture','pic_data text');

          const data = await createEmbedding(formData.student_id, pic);
          if( data.inserted ){
              setStudentCreated(true);
          }
      }
  }

  const takeMorePic = () => {
      console.log('takeMorePic');
      setCanTakePicture(true);
      setStudentCreated(false);
      
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Student</h1>
      { !canTakePicture && !studentCreated &&
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="studentId" className={styles.label}>
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            className={styles.input}
            readOnly
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



        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
      }

    { canTakePicture &&
        <div className={styles.formGroup}>
         <label htmlFor="takePicture" className={styles.label}>
           Take Picture for {formData.student_name} :
         </label>
         <TakePicture savePic= {savePic} pictureTaken={studentCreated} />
        </div>
    }
    { studentCreated &&
        <>
        <p> Student registered successfully. </p>
        <button 
            onClick = {takeMorePic}
        > 
            Take another picture 
        </button>
        <Link href="/"> Go back to main page </Link>
        </>
    }
    </div>
  );
};

export default CreateStudent;
