import type { Metadata } from 'next';
import { Geist, Geist_Mono, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/providers/QueryProvider';
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Savore - Nhà hàng ẩm thực cao cấp',
  description: 'Savore mang đến trải nghiệm ẩm thực Nhật Bản tinh tế với các món ăn độc đáo và không gian sang trọng.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        beVietnamPro.variable,
        'font-sans',
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}<Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
