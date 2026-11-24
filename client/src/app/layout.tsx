import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CompareProvider } from '@/contexts/CompareContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompareBar from '@/components/CompareBar';

export const metadata: Metadata = {
  title: 'AutoMarket - Buy & Sell Cars and Bikes',
  description: 'Find your perfect ride on AutoMarket. Buy and sell cars and bikes with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <CompareProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CompareBar />
              </CompareProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
