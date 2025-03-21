'use client'

import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { User, FileText, CreditCard } from "lucide-react"

// Create a client component for the tab navigation

const SettingsTabs = () => {
    const pathname = usePathname()
    
    // Determine which tab is active based on the current path
    const getActiveTab = () => {
        if (pathname.includes("/settings/requests")) return "requests"
        if (pathname.includes("/settings/subscriptions")) return "subscriptions"
        return "account"
    }
    
    return (
        <Tabs defaultValue={getActiveTab()} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
                <Link href="/settings" className="col-span-1">
                    <TabsTrigger 
                        value="account" 
                        className="flex items-center gap-2 w-full"
                        data-active={getActiveTab() === "account"}
                    >
                        <User className="h-4 w-6" />
                        <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                </Link>
                <Link href="/settings/requests" className="col-span-1">
                    <TabsTrigger 
                        value="requests" 
                        className="flex items-center gap-2 w-full"
                        data-active={getActiveTab() === "requests"}
                    >
                        <FileText className="h-4 w-6" />
                        <span className="hidden sm:inline">Requests</span>
                    </TabsTrigger>
                </Link>
                <Link href="/settings/subscriptions" className="col-span-1">
                    <TabsTrigger 
                        value="subscription" 
                        className="flex items-center gap-2 w-full"
                        data-active={getActiveTab() === "subscriptions"}
                    >
                        <CreditCard className="h-4 w-6" />
                        <span className="hidden sm:inline">Subscription</span>
                    </TabsTrigger>
                </Link>
            </TabsList>
        </Tabs>
    )
}

export default SettingsTabs