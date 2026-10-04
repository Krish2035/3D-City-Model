import type { Metadata } from 'next';
import { Inria_Sans, Inter } from 'next/font/google';
import './globals.css';

const inriaSans = Inria_Sans({
  variable: '--font-inria',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DEMO PROJECT | Interactive Master Plan & Plot Viewer',
  description:
    'Explore DEMO PROJECT - a premium RERA-registered plotted villa development in Darapura, Padra, Vadodara featuring wide avenues, landscaped parks, and modern amenities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inriaSans.variable} ${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full w-full h-full overflow-hidden bg-slate-950 text-slate-100 select-none">
        {children}
      </body>
    </html>
  );
}
