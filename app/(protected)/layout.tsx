import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { CircleUserIcon, SendIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import DashboardItems from "@/app/components/dashboard/dashboardItems";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SearchBar from "../components/dashboard/searchBar";
import { getUser } from "../actions";
const layout = async ({ children }: { children: React.ReactNode }) => {
    const user= await getUser();
    return (
        <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <aside className="hidden md:block border-r bg-white dark:bg-background">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <Image src={logo} alt="logo" className="" width={200} height={200}/>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <nav className="grid items-start text-sm font-medium">
                            <DashboardItems />
                        </nav>
                    </div>
                </div>
            </aside>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 bg-white dark:bg-background">
                    <div className="w-full grid grid-cols-9">
                        <div className="col-span-3">
                            <SearchBar />
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                    <div className="ml-auto flex items-center gap-x-5">
                        <Link href={'/pricing'}>
                            <Button variant="secondary" className="bg-primary/80 cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">
                                Upgrade To pro
                            </Button>
                        </Link>

                        <Button 
                        variant="secondary" 
                        className="relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium flex items-center gap-2"
                        >
                        <span className="animate-pulse">
                            <SendIcon className="h-4 w-4" />
                        </span>
                        Run AI Prompt
                        </Button>

                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
                                    {user?.profileImage ? (
                                        <Image src={user?.profileImage || ""} alt="user" className="rounded-full h-8 w-8" width={32} height={32}/>
                                    ) : (
                                        <CircleUserIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                    <LogOutIcon className="h-4 w-4" /> 
                                    <SignOutButton />
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <SettingsIcon className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
                    
                    {children}
                </main>
            </div>
        </section>
    );
};

export default layout;