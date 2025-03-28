import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";


export default async function Nav() {

  const user = await getUser()

  return (
    <nav className="flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-12 py-3 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/10 h-16">
      {/* Logo - Scales Responsively */}
      <div className="">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Eluvex Logo"
            width={150}
            height={35}
            priority
            className="w-[150px] h-auto"
          />
        </Link>
      </div>

      {/* Navigation Links - Hidden on Small Screens */}
      <div className="hidden md:flex text-black dark:text-gray-200 space-x-6 text-sm lg:text-base font-medium">
        <Link href="/" className="hover:bg-primary/30 dark:hover:bg-primary/20 py-2 px-4 rounded-lg m-5">Home</Link>
        <Link href="/service" className="hover:bg-primary/30 dark:hover:bg-primary/20 py-2 px-4 rounded-lg m-5">Service</Link>
        <Link href="/contact" className="hover:bg-primary/30 dark:hover:bg-primary/20 py-2 px-4 rounded-lg m-5">Contact</Link>
        <Link href="/help" className="hover:bg-primary/30 dark:hover:bg-primary/20 py-2 px-4 rounded-lg m-5">Help</Link>
      </div>

      {/* Sign-in & Get Started - Buttons Stay Fixed */}
      <div className="flex justify-center items-center gap-3">
      <div className="cursor-pointer"><ThemeToggle /></div>
      {!user?(

        <div className="flex items-center space-x-3 sm:space-x-4">
        <Link href="/sign-in" className="text-[#008080] dark:text-primary text-xs sm:text-sm font-medium">
          Sign in
        </Link>
        <Link href="/sign-up">
          <Button className="cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
      ):(
        <Link href="/dashboard">
          <Button className="cursor-pointer">
            Go to Dashboard
          </Button>
        </Link>
      )}
      </div>
    </nav>
  );
}
