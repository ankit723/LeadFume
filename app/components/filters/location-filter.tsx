"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function LocationFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false)
  const [isRadiusDropdownOpen, setIsRadiusDropdownOpen] = useState(false)

  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const excludeDropdownRef = useRef<HTMLDivElement>(null)
  const radiusDropdownRef = useRef<HTMLDivElement>(null)

  // Get current filter values from URL
  const currentFilters = {
    location: searchParams.get('location') || "",
    excludeLocation: searchParams.get('excludeLocation') || "",
    radius: searchParams.get('radius') || "within 50 miles",
    filterType: searchParams.get('filterType') as "region" | "zip" || "region",
    tab: searchParams.get('tab') as "contact" | "account" || "contact"
  }

  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })
    return newSearchParams.toString()
  }

  const handleFilterChange = (params: Record<string, string | null>) => {
    const queryString = createQueryString(params)
    router.push(`${pathname}?${queryString}`, { scroll: false })
  }

  const locations = [
    "United States",
    "Americas",
    "North America",
    "EMEA",
    "Dallas/Fort Worth Area",
    "Greater Houston Area",
  ]

  const radiusOptions = [
    "within 25 miles",
    "within 50 miles",
    "within 100 miles",
    "within 300 miles"
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false)
      }
      if (excludeDropdownRef.current && !excludeDropdownRef.current.contains(event.target as Node)) {
        setIsExcludeDropdownOpen(false)
      }
      if (radiusDropdownRef.current && !radiusDropdownRef.current.contains(event.target as Node)) {
        setIsRadiusDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-2">
        <h4 className="text-base text-center font-semibold mb-6 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Location
        </h4>

        {/* Tabs */}
        <div className="flex justify-between border-b dark:border-gray-700 pb-1">
          <button
            className={`flex items-center gap-1 text-sm font-medium pb- ${
              currentFilters.tab === "contact" 
                ? "text-primary2 border-b-2 border-primary" 
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => handleFilterChange({ tab: "contact" })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Contact
          </button>
          <button
            className={`flex items-center gap-2 text-sm font-medium pb-1 ${
              currentFilters.tab === "account"
                ? "text-primary2 border-b-2 border-primary"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => handleFilterChange({ tab: "account" })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Account HQ
          </button>
        </div>

        {/* Filter Options */}
        <div className="space-y-1">
          {/* Region Filter */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
              <Checkbox
                checked={currentFilters.filterType === "region"}
                onCheckedChange={() => handleFilterChange({ filterType: "region" })}
              />
              <span className="text-sm font-medium dark:text-gray-200">Select Region</span>
            </div>

            {currentFilters.filterType === "region" && (
              <div className="ml-2 space-y-1">
                <div className="relative" ref={locationDropdownRef}>
                  <button
                    className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  >
                    <span className={currentFilters.location ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                      {currentFilters.location || "Enter locations..."}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  {isLocationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                      {locations.map((location) => (
                        <button
                          key={location}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm dark:text-gray-200"
                          onClick={() => {
                            setIsLocationDropdownOpen(false)
                            handleFilterChange({ location })
                          }}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={excludeDropdownRef}>
                  <button
                    className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                    onClick={() => setIsExcludeDropdownOpen(!isExcludeDropdownOpen)}
                  >
                    <span className={currentFilters.excludeLocation ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                      {currentFilters.excludeLocation || "Exclude locations..."}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  {isExcludeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                      {locations.map((location) => (
                        <button
                          key={location}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm dark:text-gray-200"
                          onClick={() => {
                            setIsExcludeDropdownOpen(false)
                            handleFilterChange({ excludeLocation: location })
                          }}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ZIP Code Filter */}
          <div className="space-y-1 border-t dark:border-gray-700 pt-2">
            <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
              <Checkbox
                checked={currentFilters.filterType === "zip"}
                onCheckedChange={() => handleFilterChange({ filterType: "zip" })}
              />
              <span className="text-sm font-medium dark:text-gray-200">Select ZIP Code Radius</span>
            </div>

            {currentFilters.filterType === "zip" && (
              <div className="ml-2 space-y-1">
                <Input
                  type="text"
                  placeholder="e.g. 94105"
                  value={searchParams.get('zip') || ""}
                  onChange={(e) => handleFilterChange({ zip: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <div className="relative" ref={radiusDropdownRef}>
                  <button
                    className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                    onClick={() => setIsRadiusDropdownOpen(!isRadiusDropdownOpen)}
                  >
                    <span className="text-black dark:text-white">{currentFilters.radius}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  {isRadiusDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg">
                      {radiusOptions.map((option) => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 py-2 text-sm dark:text-gray-200 ${
                            currentFilters.radius === option 
                              ? "bg-primary text-white" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => {
                            setIsRadiusDropdownOpen(false)
                            handleFilterChange({ radius: option })
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-600">
                  <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>This filter only applies to net new people, not existing contacts.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 