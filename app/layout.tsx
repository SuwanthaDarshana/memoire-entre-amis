// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Mémoire entre Amis — University Memories Together',
    template: '%s | Mémoire entre Amis',
  },
  description: 'A private, invite-only platform for university friends to collect, share, and relive their best moments together. Photos, videos, and memories — all in one place.',
  keywords: ['university memories', 'photo sharing', 'private album', 'friends', 'college photos', 'group memories'],
  authors: [{ name: 'CyberDog' }],
  creator: 'CyberDog',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Mémoire entre Amis',
    title: 'Mémoire entre Amis — University Memories Together',
    description: 'A private space for university friends to collect, share, and relive the moments that made your years unforgettable.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mémoire entre Amis — University Memories Together',
    description: 'A private space for university friends to collect, share, and relive the moments that made your years unforgettable.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

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
        {children}
        {/* Toast notifications — shown globally */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "10px",
              background: "#1a1a1a",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}