import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Retro Roulette — Who gets the mic next?',
  description: 'An engaging, weighted spinning wheel picker for team retrospectives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-retro-mesh min-h-screen text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
