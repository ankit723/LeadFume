import Image from "next/image";
import Link from "next/link";
import light_logo from "@/public/light_logo.png";
import dark_logo from "@/public/dark_logo.png";
import { SendIcon } from "lucide-react";
import ClientDashboardItems from "@/app/components/dashboard/ClientDashboardItems";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Button } from "@/components/ui/button";
import ClientSearchBar from "@/app/components/dashboard/ClientSearchBar";
import MobileSidebar from "@/app/components/dashboard/MobileSidebar";
import ClientUserButton from "@/app/components/dashboard/ClientUserButton";
import { getUser } from "@/app/actions";
import ActiveFiltersDisplay from "@/app/components/dashboard/ActiveFiltersDisplay";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const checkIsAnnual = (startDate?: string, renewalDate?: string): boolean => {
    if (!startDate || !renewalDate) return false;
    
    const start = new Date(startDate);
    const renewal = new Date(renewalDate);
    
    // If renewal date is more than 6 months ahead, consider it annual
    const diffMonths = (renewal.getFullYear() - start.getFullYear()) * 12 + 
                       (renewal.getMonth() - start.getMonth());
    
    return diffMonths >= 6;
  };

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser()
    const isUserPremium = user?.subscription
    const isAnnual = checkIsAnnual(user?.subscription?.subscriptionStartDate?.toString(), user?.subscription?.subscriptionRenewalDate?.toString())


    return (
        <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar - hidden on mobile */}
            <aside className="hidden md:block border-r bg-white dark:bg-background">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <Image src={light_logo} alt="logo" className="dark:hidden" width={200} height={200} />
                            <Image src={dark_logo} alt="logo" className="dark:block" width={200} height={200} />
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
                        {!isUserPremium && (
                        <Link href={'/pricing'} className="hidden sm:block">
                            <Button variant="secondary" className="bg-primary/80 cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">
                                Upgrade To Pro
                            </Button>
                        </Link>
                        )}

                        <Button 
                        variant="secondary" 
                        className="relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium flex items-center gap-2 hidden sm:flex"
                        >
                        <span className="animate-pulse">
                            <SendIcon className="h-4 w-4" />
                        </span>
                        Run AI Prompt
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="secondary" className="bg-primary/80 cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">Show Subscription Details</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    {user?.subscription ? (
                                        <>
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Subscription Details</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    View your current plan details.
                                                </p>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <span className="text-sm font-medium">Plan:</span>
                                                    <span className="text-sm text-right">{user.subscription.subscriptionType.name}</span>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <span className="text-sm font-medium">Status:</span>
                                                    <span className="text-sm text-right">{user.subscription.status}</span>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <span className="text-sm font-medium">Price:</span>
                                                    <span className="text-sm text-right">${user.subscription.price}/{isAnnual ? "year" : "month"}</span>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <span className="text-sm font-medium">Credits:</span>
                                                    <span className="text-sm text-right">{user.subscription.subscriptionType.credits}/month</span>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <span className="text-sm font-medium">Renews on:</span>
                                                    <span className="text-sm text-right">
                                                        {new Date(user.subscription.subscriptionRenewalDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">No Active Subscription</h4>
                                            <p className="text-sm text-muted-foreground">
                                                You do not have an active subscription.
                                            </p>
                                            <Link href="/pricing">
                                                <Button className="w-full mt-2">View Plans</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <ThemeToggle />
                        
                        <ClientUserButton />
                    </div>
                </header>
                <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
                    <ActiveFiltersDisplay />
                    {children}
                </main>
            </div>
        </section>
    );
};

export default Layout;