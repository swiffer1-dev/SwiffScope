import './globals.css';
import React from 'react';

export const metadata = {
  title: 'MemeScout',
  description: 'Meme coin risk & momentum analytics'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="max-w-6xl mx-auto py-6">{children}</div>
      </body>
    </html>
  );
}
