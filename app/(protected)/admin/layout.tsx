import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { Shield, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import ClientUserButton from "@/app/components/dashboard/ClientUserButton";
import AdminMobileSidebar from "@/app/components/admin/AdminMobileSidebar";
import AdminSidebarItems from "@/app/components/admin/AdminSidebarItems";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:block border-r border-amber-200 dark:border-amber-800/30 bg-gradient-to-b from-white to-amber-50/30 dark:from-background dark:to-amber-950/5">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-amber-200 dark:border-amber-800/30 px-4 lg:h-[60px]">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Image src={logo} alt="logo" className="" width={200} height={200}/>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/30 px-3 py-2.5 text-sm text-amber-900 dark:text-amber-300 shadow-sm">
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="font-medium">Admin Area</span>
              </div>
            </div>
            <nav className="grid items-start text-sm font-medium">
              <AdminSidebarItems />
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className={cn(
          "flex h-14 items-center gap-2 md:gap-4 border-b px-2 md:px-4 lg:h-[60px] lg:px-6",
          "bg-gradient-to-r from-white to-amber-50/30 dark:from-background dark:to-amber-950/5",
          "border-amber-200 dark:border-amber-800/30"
        )}>
          {/* Mobile Sidebar Component */}
          <AdminMobileSidebar />
          
          <div className="ml-auto flex items-center gap-x-5">
            <Link href="/dashboard">
              <Button 
                variant="secondary" 
                className="relative bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-600 dark:hover:from-amber-500 dark:hover:to-yellow-500 font-medium flex items-center gap-3 py-2 hidden sm:flex"
              >
                <Shield className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              className="relative bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-600 dark:hover:from-amber-500 dark:hover:to-yellow-500 font-medium flex items-center gap-3 py-2 hidden sm:flex"
            >
              <Shield className="h-4 w-4" />
              Admin Controls
            </Button>

            <Button 
              variant="outline"
              size="icon"
              className="relative border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 hidden sm:flex"
            >
              <Settings className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            </Button>

            <ThemeToggle />
            <ClientUserButton />
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 lg:px-6 lg:py-8 bg-gradient-to-br from-white via-white to-amber-50/20 dark:from-background dark:via-background dark:to-amber-950/5">
          {children}
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
