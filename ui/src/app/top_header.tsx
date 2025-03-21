
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"; // Add this directive at the very top
import { useState } from 'react';
import styles from "./top_header.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Top_header({ handleDrawerToggle }) {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }} // Show only on mobile
        >
          <MenuIcon />
        </IconButton>
        <Image 
          src="/logo_atten-removebg-preview.png" 
          alt="Video Chat Logo" 
          width={60} 
          height={60} 
        />
        <h1 className={styles.title}>Video Atten</h1>
      </div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/admin" className={styles.navLink}>
          Admin
        </Link>
        <Link href="/video_chat" className={styles.navLink}>
          Video Chat
        </Link>
      </nav>
    </div>
  );
}
