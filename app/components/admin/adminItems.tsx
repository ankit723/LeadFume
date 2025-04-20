'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  CreditCard, 
  Settings, 
  FileText, 
} from 'lucide-react'

interface AdminItemsProps {
  onItemClick?: () => void;
}

const AdminItems = ({ onItemClick }: AdminItemsProps) => {
  const pathname = usePathname()
  
  const adminNavLinks = {
    
    users: {
      label: "User Management",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          name: "All Users",
          href: "/admin/users",
          icon: Users,
          locked: false
        },
        {
          name: "All Requests",
          href: "/admin/requests",
          icon: FileText,
          locked: false
        }
      ]
    },
    subscriptions: {
      label: "Subscriptions",
      url: "/admin/subscriptions",
      icon: CreditCard,
      items: [
        {
          name: "Manage Plans",
          href: "/admin/subscriptions",
          icon: CreditCard,
          locked: false
        },
        {
          name: "Subscription Creator",
          href: "/admin/subscription-creator",
          icon: CreditCard,
          locked: false
        }
      ]
    },
    settings: {
      label: "Admin Settings",
      url: "/admin/employees",
      icon: Settings,
      items: [
        {
          name: "All Employees",
          href: "/admin/employees",
          icon: Settings,
          locked: false
        }
      ]
    }
  }
  
  return (
    <div className='flex flex-col gap-4 p-2'>
      {Object.entries(adminNavLinks).map(([key, category]) => (
        <div key={key} className="flex flex-col gap-1">
          {/* Category Header */}
          <Link 
            href={category.url} 
            className={cn(
              'bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600',
              'text-white dark:text-white flex items-center gap-2 px-3 py-2.5 rounded-md',
              'transition-all duration-200 shadow-sm hover:shadow-md hover:from-amber-600 hover:to-yellow-600',
              'dark:hover:from-amber-500 dark:hover:to-yellow-500 text-sm'
            )}
            onClick={onItemClick}
          >
            <category.icon className="w-4 h-4" />
            <span className="font-semibold text-sm">{category.label}</span>
          </Link>
          
          {/* Category Items */}
          <div className="flex flex-col gap-1.5 pl-2 mt-1">
            {category.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    isActive 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium'
                      : 'text-muted-foreground dark:text-muted-foreground/80 hover:bg-amber-50 dark:hover:bg-amber-900/10',
                    'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200',
                    'hover:translate-x-0.5 text-sm'
                  )}
                >
                  <item.icon className={cn(
                    'w-4 h-4',
                    isActive ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground/70'
                  )} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminItems 