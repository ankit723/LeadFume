'use client'
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const EmailStatusFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true)

  // Create URLSearchParams object for manipulation
  const createQueryString = (params: Record<string, string | boolean>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === false || value === '') {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    })
    
    return newSearchParams.toString()
  }

  // Get current filter values from URL
  const currentFilters = {
    safeToSend: searchParams.get('safeToSend') === 'true',
    safeToCaution: searchParams.get('safeToCaution') === 'true',
    doNotSendUpdate: searchParams.get('doNotSendUpdate') === 'true',
    doNotSendUnusable: searchParams.get('doNotSendUnusable') === 'true',
    includeCatchAll: searchParams.get('includeCatchAll') === 'true',
    showUserManaged: searchParams.get('showUserManaged') === 'true',
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: boolean) => {
    const queryString = createQueryString({ [key]: value })
    router.push(`${pathname}?${queryString}`)
  }

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-3">
        {/* Email Status Section */}
        <div>
          <h4 className="text-base text-center font-semibold mb-6 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
            Email Status
          </h4>
          
          {/* Safe To Send */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
              <Checkbox 
                id="safe-to-send" 
                checked={currentFilters.safeToSend}
                onCheckedChange={(checked) => handleFilterChange('safeToSend', checked as boolean)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium dark:text-gray-200">Safe To Send</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md font-medium">Verified</span>
              </div>
            </div>

            {/* Safe To Caution */}
            <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
              <Checkbox 
                id="safe-to-caution" 
                checked={currentFilters.safeToCaution}
                onCheckedChange={(checked) => handleFilterChange('safeToCaution', checked as boolean)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium dark:text-gray-200">Safe To Caution</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md font-medium">Unverified</span>
              </div>
            </div>

            {/* Do Not Send Section */}
            <div className="space-y-1 border-t dark:border-gray-700 pt-4">
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <Checkbox 
                  id="do-not-send-1" 
                  checked={currentFilters.doNotSendUpdate}
                  onCheckedChange={(checked) => handleFilterChange('doNotSendUpdate', checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium dark:text-gray-200">Do Not Send</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md font-medium">Update Required</span>
                </div>
              </div>
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <Checkbox 
                  id="do-not-send-2" 
                  checked={currentFilters.doNotSendUnusable}
                  onCheckedChange={(checked) => handleFilterChange('doNotSendUnusable', checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium dark:text-gray-200">Do Not Send</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md font-medium">Unusable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Section */}
          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-semibold dark:text-gray-200">Advanced</h4>
              <CollapsibleTrigger className="group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                  isAdvancedOpen && "transform rotate-180"
                )} />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="relative overflow-hidden transition-all duration-300 ease-in-out">
              <div className={cn(
                "space-y-3 transform transition-all duration-300",
                isAdvancedOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              )}>
                {/* Include catch-all emails */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium dark:text-gray-200">Include catch-all emails</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 cursor-help">ⓘ</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Use Apollo intelligence to identify verified emails from catch-all domains.</p>
                  </div>
                  <Switch 
                    checked={currentFilters.includeCatchAll}
                    onCheckedChange={(checked) => handleFilterChange('includeCatchAll', checked)}
                  />
                </div>

                {/* Show only user managed */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium dark:text-gray-200">Show only user managed</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Emails that are owned, managed, and updated by you.</p>
                  </div>
                  <Switch 
                    checked={currentFilters.showUserManaged}
                    onCheckedChange={(checked) => handleFilterChange('showUserManaged', checked)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}

export default EmailStatusFilter