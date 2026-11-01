import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Safar - India's #1 Bus Booking System",
  description: "Book bus tickets online safely and conveniently with Safar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/hero.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

