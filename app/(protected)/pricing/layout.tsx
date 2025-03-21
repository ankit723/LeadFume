import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { SendIcon } from "lucide-react";
import ClientDashboardItems from "@/app/components/dashboard/ClientDashboardItems";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import ClientSearchBar from "@/app/components/dashboard/ClientSearchBar";
import MobileSidebar from "@/app/components/dashboard/MobileSidebar";
import ClientUserButton from "@/app/components/dashboard/ClientUserButton";

const Layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar - hidden on mobile */}
            <aside className="hidden md:block border-r bg-white dark:bg-background">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <Image src={logo} alt="logo" className="" width={200} height={200}/>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <nav className="grid items-start text-sm font-medium">
                            <ClientDashboardItems />
                        </nav>
                    </div>
                </div>
            </aside>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-2 md:gap-4 border-b px-2 md:px-4 lg:h-[60px] lg:px-6 bg-white dark:bg-background">
                    {/* Mobile Sidebar Component */}
                    <MobileSidebar />
                    
                    <div className="w-full flex-1">
                        <div className="max-w-md w-full">
                            <ClientSearchBar />
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-x-5">
                        <Link href={'/pricing'} className="hidden sm:block">
                            <Button variant="secondary" className="bg-primary/80 cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">
                                Upgrade To Pro
                            </Button>
                        </Link>

                        <Button 
                        variant="secondary" 
                        className="relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium flex items-center gap-2 hidden sm:flex"
                        >
                        <span className="animate-pulse">
                            <SendIcon className="h-4 w-4" />
                        </span>
                        Run AI Prompt
                        </Button>

                        <ThemeToggle />
                        <ClientUserButton />
                    </div>
                </header>
                <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
                    {children}
                </main>
            </div>
        </section>
    );
};

export default Layout;