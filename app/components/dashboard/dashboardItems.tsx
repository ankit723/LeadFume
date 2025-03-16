'use client'
import React from 'react'
import Link from 'next/link'
import { navLinks } from '@/app/config/navigation'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'
const DashboardItems = () => {
    const pathname = usePathname()
    
    return (
        <div className='flex flex-col gap-4 p-2'>
            {Object.entries(navLinks).map(([key, category]) => (
                <div key={key} className="flex flex-col gap-1">
                    {/* Category Header */}
                    <Link href={category.url} className={cn('bg-primary dark:bg-primary/90 text-primary-foreground dark:text-primary-foreground/90 flex items-center gap-2 px-2 py-2 rounded-md transition-all text-sm'
                    )}>
                        <category.icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{category.label}</span>
                    </Link>
                    
                    {/* Category Items */}
                    {/* add every item to the query parament after the category label */}
                    <div className="flex flex-col gap-1 pl-2">
                        {category.items.map((item) => (
                            <Link
                                key={item.name}
                                href={`${item.locked ? '/pricing' : item.href}`}
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