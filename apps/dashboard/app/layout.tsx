import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'FiveM Bot Ultimate V3',
  description: 'Production-ready FiveM Server Management System with Discord Bot, Web Dashboard & AI Assistant',
  keywords: ['FiveM', 'Discord Bot', 'Server Management', 'ESX', 'QBCore'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              color: '#e2e8f0',
            },
          }}
        />
      </body>
    </html>
  );
}
