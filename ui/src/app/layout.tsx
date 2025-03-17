import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Top_header from '@/app/top_header';
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Video chat",
  description: "One-to-one video chat application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Head>
          <meta name="description" content="One-to-one video chat application." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="Video Chat" />
          <meta property="og:description" content="One-to-one video chat" />
          <meta property="og:image" content="/path-to-image.jpg" />
          <meta property="og:url" content="https://yourwebsite.com" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Video Chat" />
          <meta name="twitter:description" content="One-to-one video chat" />
          <meta name="twitter:image" content="/path-to-image.jpg" />
        </Head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Top_header handleDrawerToggle={undefined} />
        <AppRouterCacheProvider>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <main className="container" style={{ flex: 1 }}>
              {children}
            </main>
            <footer style={{ 
              textAlign: 'center', 
              padding: '1rem', 
              backgroundColor: 'var(--background)', 
              borderTop: '1px solid var(--border-color)'
            }}>
              <p>© 2025 Video Atten. All rights reserved. made with ❤️ by Majid, Herify, Andy & Joshua</p>
            </footer>
          </div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
