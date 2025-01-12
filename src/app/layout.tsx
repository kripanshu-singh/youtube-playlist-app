"use client"; // Mark this component as a Client Component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { Geist, Geist_Mono } from "next/font/google";
import { metadata } from "./matadata"; // Import metadata from the new file
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>{" "}
        {/* Wrap children with SessionProvider */}
      </body>
    </html>
  );
}
