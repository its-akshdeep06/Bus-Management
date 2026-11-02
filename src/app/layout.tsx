import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Safar — Express Bus Journeys Across India",
  description:
    "Experience premium, verified bus travel across India with real-time seat selection, transparent fares, and instant confirmation.",
  icons: {
    icon: '/assets/brand/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
