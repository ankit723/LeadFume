"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// type FilterOption = "region" | "zipcode"

export default function AccountLocationFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isExpanded, setIsExpanded] = useState(true)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false)
  const [isRadiusDropdownOpen, setIsRadiusDropdownOpen] = useState(false)
  const [isExcludeExpanded, setIsExcludeExpanded] = useState(false)

  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const excludeDropdownRef = useRef<HTMLDivElement>(null)
  const radiusDropdownRef = useRef<HTMLDivElement>(null)

  // Get current filter values from URL
  const currentFilters = {
    location: searchParams.get('location') || "",
    excludeLocation: searchParams.get('excludeLocation') || "",
    zip: searchParams.get('zip') || "",
    radiusTitles: searchParams.get('radiusTitles') || "within 50 miles",
    filterType: searchParams.get('filterType') as "region" | "zipcode" || "region",
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
        <div 
          className="flex items-center justify-between cursor-pointer mb-2 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h4 className="text-base font-semibold">Account Location</h4>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>

        {isExpanded && (
          <div className="space-y-1">
            {/* Region Selection Option */}
            <div className="space-y-1">
              <label className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                <input
                  type="checkbox"

                  checked={currentFilters.filterType === "region"}
                  onChange={() => handleFilterChange({ filterType: "region" })}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <span className="text-sm font-medium dark:text-gray-200">Select Region</span>
              </label>

              {currentFilters.filterType === "region" && (
                <div className="ml-2 space-y-3">
                  <div className="relative" ref={locationDropdownRef}>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">City / State / Country / ZIP</p>
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

                  <div ref={excludeDropdownRef}>
                    <div
                      className="flex items-center text-primary2 dark:text-primary/80 text-sm cursor-pointer mb-1"
                      onClick={() => setIsExcludeExpanded(!isExcludeExpanded)}
                    >
                      <span>Exclude locations</span>
                      {isExcludeExpanded ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>

                    {isExcludeExpanded && (
                      <div className="relative">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">City / State / Country to exclude:</p>
                        <button
                          className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                          onClick={() => setIsExcludeDropdownOpen(!isExcludeDropdownOpen)}
                        >
                          <span className={currentFilters.excludeLocation ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                            {currentFilters.excludeLocation || "Enter locations to exclude..."}
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
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ZIP Code Radius Option */}
            <div className="space-y-1 border-t dark:border-gray-700 pt-2">
              <label className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.filterType === "zipcode"}
                  onChange={() => handleFilterChange({ filterType: "zipcode" })}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <span className="text-sm font-medium dark:text-gray-200">Select ZIP Code Radius</span>
              </label>

              {currentFilters.filterType === "zipcode" && (
                <div className="ml-2 space-y-3">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Address / City / ZIP</p>
                    <input
                      type="text"
                      placeholder="e.g. 94105"
                      value={currentFilters.zip}
                      onChange={(e) => handleFilterChange({ zip: e.target.value })}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md text-sm"
                    />
                  </div>
                  <div className="relative" ref={radiusDropdownRef}>
                    <button
                      className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                      onClick={() => setIsRadiusDropdownOpen(!isRadiusDropdownOpen)}
                    >
                      <span className="text-black dark:text-white">{currentFilters.radiusTitles}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    {isRadiusDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg">
                        {radiusOptions.map((option) => (
                          <button
                            key={option}
                            className={`w-full text-left px-3 py-2 text-sm dark:text-gray-200 ${
                              currentFilters.radiusTitles === option 
                                ? "bg-primary2/80 text-white" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              setIsRadiusDropdownOpen(false)
                              handleFilterChange({ radiusTitles: option })
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}