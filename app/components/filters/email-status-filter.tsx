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

  // Helper function to handle square brackets in URL params
  const getAllParams = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    // Convert the URLSearchParams to a string and replace encoded brackets
    const paramsString = params.toString().replace(/%5B%5D/g, '[]')
    return new URLSearchParams(paramsString).getAll(name)
  }

  const getParam = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const paramsString = params.toString().replace(/%5B%5D/g, '[]')
    return new URLSearchParams(paramsString).get(name)
  }

  // Exact mapping of filter keys to the specified parameter values
  const filterMap = {
    safeToSend: 'verified',
    safeToCaution: 'unverified',
    doNotSendUpdate: 'new_data_available',
    doNotSendUnusable: 'unavailable',
  }

  // Get current filter states from URL parameters
  const currentFilters = {
    safeToSend: getAllParams('contactEmailStatusV2[]').includes('verified'),
    safeToCaution: getAllParams('contactEmailStatusV2[]').includes('unverified'),
    doNotSendUpdate: getAllParams('contactEmailStatusV2[]').includes('new_data_available'),
    doNotSendUnusable: getAllParams('contactEmailStatusV2[]').includes('unavailable'),
    includeCatchAll: getParam('includeCatchAll') === 'true',
    showUserManaged: getParam('showUserManaged') === 'true',
  }

  // Function to update query string with exact parameter format
  const updateQueryString = (key: string, checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const currentValues = getAllParams('contactEmailStatusV2[]')
    
    // Handle email status filters
    if (key in filterMap) {
      const paramValue = filterMap[key as keyof typeof filterMap]
      
      // Clear existing contactEmailStatusV2[] parameters
      newSearchParams.delete('contactEmailStatusV2[]')
      
      // Update the array with the exact values
      const updatedValues = currentValues.filter(val => val !== paramValue)
      if (checked) {
        updatedValues.push(paramValue)
      }
      
      // Rebuild the contactEmailStatusV2[] array
      updatedValues.forEach(value => newSearchParams.append('contactEmailStatusV2[]', value))
    } 
    // Handle advanced filters separately
    else if (key === 'includeCatchAll' || key === 'showUserManaged') {
      if (checked) {
        newSearchParams.set(key, 'true')
      } else {
        newSearchParams.delete(key)
      }
    }

    // Convert to string and replace encoded brackets
    let queryString = newSearchParams.toString()
    queryString = queryString.replace(/%5B%5D/g, '[]')
    return queryString
  }

  // Handle filter changes and update URL
  const handleFilterChange = (key: string, value: boolean) => {
    const queryString = updateQueryString(key, value)
    router.push(`${pathname}?${queryString}`)
  }

  return (
    <div className="w-[280px] bg-card p-4 rounded-lg border shadow-sm">
      <div className="space-y-3">
        {/* Email Status Section */}
        <div>
          <h4 className="text-base text-center font-semibold mb-6 bg-primary text-primary-foreground p-2 rounded-md shadow-sm">
            Email Status
          </h4>
          
          {/* Safe To Send */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
              <Checkbox 
                id="safe-to-send" 
                checked={currentFilters.safeToSend}
                onCheckedChange={(checked) => handleFilterChange('safeToSend', checked as boolean)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Safe To Send</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md font-medium">Verified</span>
              </div>
            </div>

            {/* Safe To Caution */}
            <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
              <Checkbox 
                id="safe-to-caution" 
                checked={currentFilters.safeToCaution}
                onCheckedChange={(checked) => handleFilterChange('safeToCaution', checked as boolean)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Safe To Caution</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md font-medium">Unverified</span>
              </div>
            </div>

            {/* Do Not Send Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                <Checkbox 
                  id="do-not-send-update" 
                  checked={currentFilters.doNotSendUpdate}
                  onCheckedChange={(checked) => handleFilterChange('doNotSendUpdate', checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Do Not Send - Update Available</span>
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-md font-medium">New Data</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                <Checkbox 
                  id="do-not-send-unusable" 
                  checked={currentFilters.doNotSendUnusable}
                  onCheckedChange={(checked) => handleFilterChange('doNotSendUnusable', checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Do Not Send - Unusable</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md font-medium">Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="mt-4 pt-4 border-t"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-semibold">Advanced</h4>
              <CollapsibleTrigger className="group hover:bg-muted p-2 rounded-full transition-colors">
                <ChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
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
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Include catch-all emails</span>
                      <span className="text-xs text-muted-foreground cursor-help">ⓘ</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Use Apollo intelligence to identify verified emails from catch-all domains.</p>
                  </div>
                  <Switch 
                    checked={currentFilters.includeCatchAll}
                    onCheckedChange={(checked) => handleFilterChange('includeCatchAll', checked)}
                  />
                </div>

                {/* Show only user managed */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Show only user managed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Emails that are owned, managed, and updated by you.</p>
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