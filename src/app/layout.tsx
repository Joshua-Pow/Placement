import './globals.css';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Theme } from '@radix-ui/themes';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="dark">{children}</Theme>
        <Toaster />
      </body>
    </html>
  );
}