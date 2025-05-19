import Link from 'next/link';
import { HelpCircle, Book, Play, Wallet, Headset } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-gray-600">
          Welcome to the LeadFume Help Center. Find answers to your questions and learn how to get the most out of our platform.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/help/getting-started"
          className="p-6 border rounded-lg transition-all bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <Play className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Getting Started</h2>
          </div>
          <p className="text-gray-600">Learn the basics of LeadFume and set up your account.</p>
        </Link>

        <Link 
          href="/help/documentation"
          className="p-6 border rounded-lg transition-all bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <Book className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Documentation</h2>
          </div>
          <p className="text-gray-600">Detailed guides and references for all platform features.</p>
        </Link>

        <Link 
          href="/help/faq"
          className="p-6 border rounded-lg transition-all bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">FAQ</h2>
          </div>
          <p className="text-gray-600">Answers to commonly asked questions about our platform.</p>
        </Link>

        <Link 
          href="/help/subscriptions"
          className="p-6 border rounded-lg transition-all bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Subscription & Credits</h2>
          </div>
          <p className="text-gray-600">Information about subscriptions, billing, and credits usage.</p>
        </Link>

        <Link 
          href="/help/contact"
          className="p-6 border rounded-lg transition-all bg-white hover:bg-gray-50 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <Headset className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Support</h2>
          </div>
          <p className="text-gray-600">Get in touch with our support team for personalized assistance.</p>
        </Link>
      </div>
    </div>
  );
} 