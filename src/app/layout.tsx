import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tasktify',
  description: 'Your daily tasks, simplified.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-white text-gray-900 max-w-[430px] mx-auto min-h-screen relative">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
