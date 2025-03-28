import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/themeToggle";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/10 px-3 sm:px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Leadfume Logo"
                width={150}
                height={35}
                priority
                className="w-[150px] h-auto mb-4"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Elevate your lead generation with accurate and targeted data solutions.
            </p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-black dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Documents */}
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-black dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/data-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  LeadFume Data Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr-compliance" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  LeadFume GDPR Compliance
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-black dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-600 dark:text-gray-400">
                Email: support@leadfume.com
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                Phone: +1 (123) 456-7890
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="https://twitter.com/leadfume" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                Twitter
              </a>
              <a href="https://linkedin.com/company/leadfume" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} LeadFume. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Designed and developed with ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 