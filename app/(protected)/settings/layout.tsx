'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import SettingsTabs from "@/app/components/settingsTabs"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, CreditCard, FileText, Home, Settings, User, HelpCircle, Book, Mail, BellRing, LogOut, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/themeToggle"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// This is a client component, so we can't export metadata here
// Metadata should be in a server component layout file or page.tsx file

// This is now a client component
const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState("Account")
    
    // Update active tab based on the pathname
    useEffect(() => {
        if (pathname.includes("/settings/requests")) {
            setActiveTab("Requests")
        } else if (pathname.includes("/settings/subscriptions")) {
            setActiveTab("Subscription")
        }else if (pathname.includes("/settings/support")) {
            setActiveTab("Support")
        }else {
            setActiveTab("Account")
        }
    }, [pathname])
    
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Navbar - always visible at the top */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <div className="flex items-center gap-2 group">
                                <div className="rounded-full overflow-hidden bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
                                    <Settings className="h-7 w-7 text-primary group-hover:rotate-45 transition-transform duration-500" />
                                </div>
                                <span className="font-semibold hidden md:inline-block text-foreground/90 group-hover:text-foreground transition-colors">Leadfume</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" className="hidden md:flex gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200">
                            <BellRing className="h-4 w-4" />
                            <span className="hidden lg:inline">Notifications</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                                    <div className="rounded-full bg-muted h-9 w-9 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 animate-in zoom-in-90 duration-200">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                                    <Link href="/settings" className="flex items-center gap-2 w-full">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                                        <Home className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            
            {/* Main content section */}
            <div className="flex flex-col w-full max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-6 flex-1">
                {/* Breadcrumb navigation - dynamic based on tab */}
                <nav className="flex items-center text-sm text-muted-foreground">
                    <Link href="/" className="flex items-center hover:text-primary transition-colors">
                        <Home className="h-4 w-4 mr-1" />
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link href="/dashboard" className="hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link href="/settings" className="hover:text-primary transition-colors">
                        <span className="flex items-center">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                        </span>
                    </Link>
                    {activeTab !== "Account" && (
                        <>
                            <ChevronRight className="h-4 w-4 mx-1" />
                            <span className="text-foreground font-medium flex items-center">
                                {activeTab === "Requests" && <FileText className="h-4 w-4 mr-1" />}
                                {activeTab === "Subscription" && <CreditCard className="h-4 w-4 mr-1" />}
                                {activeTab === "Support" && <HelpCircle className="h-4 w-4 mr-1" />}
                                {activeTab}
                            </span>
                        </>
                    )}
                </nav>

                {/* Page header with animated gradient background */}
                <div className="rounded-xl p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {activeTab === "Account" ? "Settings" : `${activeTab} Settings`}
                            </h1>
                            <p className="text-muted-foreground max-w-md">
                                {activeTab === "Account" && "Manage your account settings, preferences, and subscription."}
                                {activeTab === "Requests" && "View and manage your pending and past requests."}
                                {activeTab === "Subscription" && "Manage your subscription plan and billing information."}
                                {activeTab === "Support" && "View and manage your support tickets."}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <Badge variant="secondary" className="py-1 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer">
                                <BellRing className="h-3 w-3 mr-1 text-primary group-hover:animate-ping animate-once" />
                                <span className="text-primary/80 group-hover:text-primary transition-colors">Notifications: On</span>
                            </Badge>
                            <Badge variant="outline" className="py-1 border-primary/20 hover:bg-primary/5 transition-colors">
                                <span className="text-primary/80">Account: Active</span>
                            </Badge>
                        </div>
                    </div>
                </div>
                
                <Separator className="my-2 bg-primary/10" />
                
                {/* Main content with responsive layout */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Tabs for both mobile and desktop */}
                    <div className="w-full">
                        <SettingsTabs />
                    </div>
                    
                    {/* Main content and side panel in a 2-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Main content section - wider on desktop */}
                        <div className="md:col-span-3 space-y-6">
                            <Card className="border border-border/40 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <CardContent className="p-6">
                                    {children}
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Side panel with help and additional resources */}
                        <div className="col-span-1 space-y-4">
                            <Card className="border rounded-lg shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/30 border-primary/10">
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4 text-primary" />
                                        Help & Support
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Get assistance with your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-3 space-y-2">
                                    <Link 
                                        href="/help" 
                                        className="text-sm px-3 py-2 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 w-full"
                                    >
                                        <Book className="h-4 w-4" />
                                        Documentation
                                    </Link>
                                    <Link 
                                        href="/help/contact" 
                                        className="text-sm px-3 py-2 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 w-full"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </Link>
                                </CardContent>
                            </Card>
                            <Card className="border rounded-lg shadow-sm overflow-hidden bg-gradient-to-br from-primary/5 to-background border-primary/10 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                        <span className="font-medium text-sm">Subscription Status</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Your current plan includes all premium features. Renews on <span className="font-medium text-primary">May 15, 2024</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout