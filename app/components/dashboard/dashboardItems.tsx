'use client'
import React from 'react'
import Link from 'next/link'
import { navLinks } from '@/app/config/navigation'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const DashboardItems = () => {
    const pathname = usePathname()
    
    return (
        <div className='flex flex-col gap-4 p-2'>
            {Object.entries(navLinks).map(([key, category]) => (
                <div key={key} className="flex flex-col gap-1">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 px-2 py-2 bg-primary rounded-lg">
                        <category.icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{category.label}</span>
                    </div>
                    
                    {/* Category Items */}
                    <div className="flex flex-col gap-1 pl-2">
                        {category.items.map((item) => (
                            <Link
                                href={item.href}
                                key={item.name}
                                className={cn(
                                    pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/20',
                                    'flex items-center gap-2 px-2 py-2 rounded-md transition-all text-sm'
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DashboardItems