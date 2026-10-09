import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';

export const metadata: Metadata = {
  title: "Zakovat Intellectual Platform — Bilimingizni Sinang, Afsonaga Aylaning",
  description: "O'zbekistondagi birinchi intellektual o'yin platformasi. Aqlli javob baholash tizimi, 90+ toifadagi zakovat turnir savollari va peshqadamlar bellashuvi.",
  keywords: ["Zakovat", "Zakovat o'yini", "Intellektual o'yin", "Mantiqiy savollar", "Zakovat savollari"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#07080c] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
        </AuthProvider>
      </body>
    </html>
  );
}
