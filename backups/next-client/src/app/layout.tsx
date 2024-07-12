import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'An example app using nextjs, workers, and send emails',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={clsx(inter.className, 'h-full w-[1280px]')}>{children}</body>
    </html>
  );
}
