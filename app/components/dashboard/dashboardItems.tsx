'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { navLinks } from '@/app/config/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Lock, Users2, Building } from 'lucide-react'

interface DashboardItemsProps {
    onItemClick?: () => void;
}

const DashboardItems = ({ onItemClick }: DashboardItemsProps) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentParams = searchParams.toString()
    
    // Determine current view based on pathname
    const getCurrentView = () => {
        if (pathname.startsWith('/dashboard/companies')) return 'companies'
        if (pathname.startsWith('/dashboard/people')) return 'people'
        return 'people' // default to people
    }
    
    const [currentView, setCurrentView] = useState<'people' | 'companies'>(getCurrentView())

    const createLink = (baseHref: string) => {
        if (currentParams) {
            return `${baseHref}?${currentParams}`;
        }
        return baseHref;
    };

    const toggleView = (view: 'people' | 'companies') => {
        setCurrentView(view)
        if (onItemClick) onItemClick()
    };
    
    return (
        <div className='flex flex-col gap-4 p-2'>
            {/* Toggle Buttons */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                    onClick={() => toggleView('people')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all",
                        currentView === 'people' 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background"
                    )}
                >
                    <Users2 className="w-4 h-4" />
                    People
                </button>
                <button
                    onClick={() => toggleView('companies')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all",
                        currentView === 'companies' 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background"
                    )}
                >
                    <Building className="w-4 h-4" />
                    Companies
                </button>
            </div>

            {/* Show only the selected category */}
            {Object.entries(navLinks)
                .filter(([key]) => key === currentView)
                .map(([key, category]) => (
                <div key={key} className="flex flex-col gap-1">
                    {/* Category Header */}
                    <Link 
                        href={createLink(category.url)}
                        className={cn('bg-primary dark:bg-primary/90 text-primary-foreground dark:text-primary-foreground/90 flex items-center gap-2 px-2 py-2 rounded-md transition-all text-sm')}
                        onClick={onItemClick}
                    >
                        <category.icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{category.label}</span>
                    </Link>
                    
                    {/* Category Items */}
                    <div className="flex flex-col gap-1 pl-2">
                        {category.items.map((item) => (
                            <Link
                                key={item.name}
                                href={createLink(item.locked ? '/pricing' : item.href)}
                                onClick={onItemClick}
                                className={cn(
                                    pathname === item.href 
                                        ? `bg-primary/60 dark:bg-primary/50 text-white dark:text-white ${item.locked ? 'cursor-not-allowed bg-primary2/50 dark:bg-primary2/40' : ''}`
                                        : `text-muted-foreground dark:text-muted-foreground/80 ${item.locked 
                                            ? 'cursor-not-allowed hover:bg-primary2/50 dark:hover:bg-primary2/40' 
                                            : 'hover:bg-primary/20 dark:hover:bg-primary/10'}`,
                                    'flex items-center justify-between gap-2 px-2 py-2 rounded-md transition-all text-sm'
                                )}
                            >
                                <div className='flex items-center gap-2'>
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </div>
                                {item.locked && <Lock className="w-4 h-4 text-primary2 dark:text-primary2/90" />}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DashboardItems