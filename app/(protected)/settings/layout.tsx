'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import SettingsTabs from "@/app/components/settingsTabs"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, CreditCard, FileText, Home, Settings, User, HelpCircle, Book, Mail, BellRing, SearchIcon, LogOut, Globe } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/themeToggle"
import { Button } from "@/components/ui/button"
import Image from "next/image"
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
        }else {
            setActiveTab("Account")
        }
    }, [pathname])
    
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Navbar - always visible at the top */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full overflow-hidden bg-primary/10 p-1">
                                    <Settings className="h-7 w-7 text-primary" />
                                </div>
                                <span className="font-medium hidden md:inline-block">Leadfume</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" className="hidden md:flex gap-1">
                            <BellRing className="h-4 w-4" />
                            <span className="hidden lg:inline">Notifications</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
                                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/settings" className="flex items-center gap-2 w-full">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                                        <Home className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
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
                    <Link href="/" className="flex items-center hover:text-foreground transition-colors">
                        <Home className="h-4 w-4 mr-1" />
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link href="/settings" className="hover:text-foreground transition-colors">
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
                                {activeTab}
                            </span>
                        </>
                    )}
                </nav>

                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {activeTab === "Account" ? "Settings" : `${activeTab} Settings`}
                        </h1>
                        <p className="text-muted-foreground max-w-md">
                            {activeTab === "Account" && "Manage your account settings, preferences, and subscription ."}
                            {activeTab === "Requests" && "View and manage your pending and past requests."}
                            {activeTab === "Subscription" && "Manage your subscription plan and billing information."}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Badge variant="secondary" className="py-1">
                            <BellRing className="h-3 w-3 mr-1" />
                            Notifications: On
                        </Badge>
                        <Badge variant="outline" className="py-1">
                            Account: Active
                        </Badge>
                    </div>
                </div>
                
                <Separator className="my-2" />
                
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
                            <Card className="border rounded-lg shadow-sm overflow-hidden">
                                <CardContent className="p-6">
                                    {children}
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Side panel with help and additional resources */}
                        <div className="col-span-1 space-y-4">
                            <Card className="border rounded-lg shadow-sm overflow-hidden bg-muted/30">
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        Help & Support
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Get assistance with your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-3 space-y-2">
                                    <Link 
                                        href="/help" 
                                        className="text-sm px-3 py-2 rounded-md bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 w-full"
                                    >
                                        <Book className="h-4 w-4" />
                                        Documentation
                                    </Link>
                                    <Link 
                                        href="/contact" 
                                        className="text-sm px-3 py-2 rounded-md bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 w-full"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </Link>
                                </CardContent>
                            </Card>
                            <Card className="border rounded-lg shadow-sm overflow-hidden bg-gradient-to-br from-violet-50 to-slate-50 dark:from-violet-950/20 dark:to-slate-950/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm">Subscription Status</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Your current plan includes all premium features. Renews on <span className="font-medium">May 15, 2024</span>
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