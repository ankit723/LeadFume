import Nav from '@/app/components/home/Nav';
import { ReactNode } from 'react';
// import Link from 'next/link';

interface PolicyLayoutProps {
  children: ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Policy Navigation Bar */}
      <Nav/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}