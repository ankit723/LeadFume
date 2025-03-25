'use client'

import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { User, FileText, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

// Create a client component for the tab navigation
const SettingsTabs = () => {
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false)
    
    // Set isMounted to true after component mounts to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    // Determine which tab is active based on the current path
    const getActiveTab = () => {
        if (pathname.includes("/settings/requests")) return "requests"
        if (pathname.includes("/settings/subscriptions")) return "subscriptions"
        return "account"
    }
    
    if (!isMounted) {
        return null // Avoid hydration issues
    }
    
    return (
        <Tabs defaultValue={getActiveTab()} className="w-full">
            <TabsList className="flex flex-wrap w-full h-auto bg-muted/50 p-1.5 rounded-xl">
                <Link href="/settings" className="flex-1 min-w-[100px]">
                    <TabsTrigger 
                        value="account" 
                        className="flex items-center gap-2 w-full h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"
                        data-active={getActiveTab() === "account"}
                    >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Account</span>
                        {getActiveTab() === "account" && <Badge variant="secondary" className="ml-auto hidden lg:inline-flex h-5 px-1.5">Active</Badge>}
                    </TabsTrigger>
                </Link>
                <Link href="/settings/requests" className="flex-1 min-w-[100px]">
                    <TabsTrigger 
                        value="requests" 
                        className="flex items-center gap-2 w-full h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"
                        data-active={getActiveTab() === "requests"}
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Requests</span>
                        {getActiveTab() === "requests" && <Badge variant="secondary" className="ml-auto hidden lg:inline-flex h-5 px-1.5">3 New</Badge>}
                    </TabsTrigger>
                </Link>
                <Link href="/settings/subscriptions" className="flex-1 min-w-[100px]">
                    <TabsTrigger 
                        value="subscriptions" 
                        className="flex items-center gap-2 w-full h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"
                        data-active={getActiveTab() === "subscriptions"}
                    >
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Subscription</span>
                        {getActiveTab() === "subscriptions" && <Badge variant="secondary" className="ml-auto hidden lg:inline-flex h-5 px-1.5">Premium</Badge>}
                    </TabsTrigger>
                </Link>
            </TabsList>
        </Tabs>
    )
}

export default SettingsTabs