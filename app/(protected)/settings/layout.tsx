import { Card, CardContent } from "@/components/ui/card"
import SettingsTabs from "@/app/components/settingsTabs"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, CreditCard, FileText, Home, Settings, User, HelpCircle, Book, Mail } from "lucide-react"
import Link from "next/link"

// This is a server component
const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-6">
            {/* Breadcrumb navigation */}
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
                <span className="text-foreground font-medium flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                </span>
            </nav>

            {/* Page header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground max-w-md">
                        Manage your account settings, preferences, and subscription details.
                    </p>
                </div>
            </div>
            
            <Separator className="my-2" />
            
            {/* Main content with responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar navigation on larger screens */}
                <div className="hidden md:block col-span-1 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2" >
                            <Settings className="h-4 w-6" />
                            Settings
                        </h3>
                        <div className="flex flex-col space-y-1">
                            <Link 
                                href="/settings" 
                                className="text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <User className="h-4 w-6" />
                                Account
                            </Link>
                            <Link 
                                href="/settings/requests" 
                                className="text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <FileText className="h-4 w-6" />
                                Requests
                            </Link>
                            <Link 
                                href="/settings/subscriptions" 
                                className="text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <CreditCard className="h-4 w-6" />
                                Subscriptions
                            </Link>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <HelpCircle className="h-4 w-6" />
                            Help & Support
                        </h3>
                        <div className="flex flex-col space-y-1">
                            <Link 
                                href="/help" 
                                className="text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <Book className="h-4 w-6" />
                                Documentation
                            </Link>
                            <Link 
                                href="/contact" 
                                className="text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <Mail className="h-4 w-6" />
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Main content section */}
                <div className="col-span-1 md:col-span-3 space-y-6">
                    {/* Tabs for mobile screens only */}
                    <div className="md:hidden">
                        <SettingsTabs />
                    </div>
                    
                    <Card className="border rounded-lg shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Layout