import Nav from '@/app/components/home/Nav';
import { ReactNode } from 'react';

interface HelpLayoutProps {
  children: ReactNode;
}

export default function HelpLayout({ children }: HelpLayoutProps) {
  return (
    <div className="min-h-screen">
      <Nav/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 