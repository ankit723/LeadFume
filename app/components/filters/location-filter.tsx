"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, HelpCircle, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type LocationFilterState = {
  filterType: "region" | "zip"
  selectedLocations: string[]
  excludedLocations: string[]
  zipCode: string
  radius: string
}

export default function LocationFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isExcludeSectionOpen, setIsExcludeSectionOpen] = useState(false)
  const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false)
  const [isRadiusDropdownOpen, setIsRadiusDropdownOpen] = useState(false)

  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const excludeDropdownRef = useRef<HTMLDivElement>(null)
  const radiusDropdownRef = useRef<HTMLDivElement>(null)

  // Initialize separate states for contact and account
  const [contactFilter, setContactFilter] = useState<LocationFilterState>({
    filterType: "region",
    selectedLocations: [],
    excludedLocations: [],
    zipCode: "",
    radius: "100"
  })

  const [accountFilter, setAccountFilter] = useState<LocationFilterState>({
    filterType: "region",
    selectedLocations: [],
    excludedLocations: [],
    zipCode: "",
    radius: "100"
  })

  // Current tab state (not stored in URL)
  const [currentTab, setCurrentTab] = useState<"contact" | "account">("contact")

  const locations = [
    "United States",
    "Americas",
    "North America",
    "EMEA",
    "Dallas/Fort Worth Area",
    "Greater Houston Area",
  ]

  const radiusOptions = [
    { value: "25", label: "within 25 miles" },
    { value: "50", label: "within 50 miles" },
    { value: "100", label: "within 100 miles" },
    { value: "300", label: "within 300 miles" }
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

  const createQueryString = (params: Record<string, string | string[] | null>) => {
    const newSearchParams = new URLSearchParams()

    // Copy all existing params
    searchParams.forEach((value, key) => {
      // Include all parameters, we'll override specific ones later
      newSearchParams.append(key, value)
    })

    // Apply new params for the specific filter being updated
    Object.entries(params).forEach(([key, value]) => {
      // Remove existing entries for this key to avoid duplicates
      newSearchParams.delete(key)
      if (value === "" || value === null || (Array.isArray(value) && value.length === 0)) {
        // Do not add empty values
      } else if (Array.isArray(value)) {
        value.forEach(v => {
          newSearchParams.append(key, v)
        })
      } else {
        newSearchParams.set(key, value)
      }
    })

    // Ensure tab parameter is not included
    newSearchParams.delete('tab')

    // Convert to string and handle URL encoding
    let queryString = newSearchParams.toString()
    queryString = queryString.replace(/%5B%5D/g, '[]')
    queryString = queryString.replace(/\+/g, '%20')

    return queryString
  }

  const handleFilterChange = (newState: LocationFilterState, tab: "contact" | "account") => {
    if (tab === "contact") {
      setContactFilter(newState)
    } else {
      setAccountFilter(newState)
    }

    const params: Record<string, string | string[] | null> = {}

    // Update parameters for the current tab
    if (newState.filterType === "region") {
      params[`${tab === 'contact' ? 'person' : 'organization'}Locations[]`] = 
        newState.selectedLocations.length > 0 ? newState.selectedLocations : null
      params[`${tab === 'contact' ? 'personNot' : 'organizationNot'}Locations[]`] = 
        newState.excludedLocations.length > 0 ? newState.excludedLocations : null
      params[`${tab === 'contact' ? 'personLocationName' : 'organizationLocationName'}`] = null
      params[`${tab === 'contact' ? 'personLocationRadius' : 'organizationLocationRadius'}`] = null
    } else {
      params[`${tab === 'contact' ? 'personLocationName' : 'organizationLocationName'}`] = 
        newState.zipCode || null
      params[`${tab === 'contact' ? 'personLocationRadius' : 'organizationLocationRadius'}`] = 
        newState.radius || null
      params[`${tab === 'contact' ? 'person' : 'organization'}Locations[]`] = null
      params[`${tab === 'contact' ? 'personNot' : 'organizationNot'}Locations[]`] = null
    }

    const queryString = createQueryString(params)
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const handleFilterTypeChange = (value: "region" | "zip") => {
    const newState = {
      ...currentFilter,
      filterType: value,
      ...(value === "region" ? { 
        zipCode: "",
      } : {
        selectedLocations: [],
        excludedLocations: []
      })
    }
    handleFilterChange(newState, currentTab)
  }

  const removeLocation = (location: string) => {
    const updatedLocations = currentFilter.selectedLocations.filter((loc) => loc !== location)
    handleFilterChange({
      ...currentFilter,
      selectedLocations: updatedLocations
    }, currentTab)
  }

  const removeExcludedLocation = (location: string) => {
    const updatedExcluded = currentFilter.excludedLocations.filter((loc) => loc !== location)
    handleFilterChange({
      ...currentFilter,
      excludedLocations: updatedExcluded
    }, currentTab)
  }

  const addLocation = (location: string) => {
    if (!currentFilter.selectedLocations.includes(location)) {
      const updatedLocations = [...currentFilter.selectedLocations, location]
      handleFilterChange({
        ...currentFilter,
        selectedLocations: updatedLocations
      }, currentTab)
    }
    setIsLocationDropdownOpen(false)
  }

  const addExcludedLocation = (location: string) => {
    if (!currentFilter.excludedLocations.includes(location)) {
      const updatedExcluded = [...currentFilter.excludedLocations, location]
      handleFilterChange({
        ...currentFilter,
        excludedLocations: updatedExcluded
      }, currentTab)
    }
    setIsExcludeDropdownOpen(false)
  }

  // Get current filter based on tab
  const currentFilter = currentTab === "contact" ? contactFilter : accountFilter

  // Get current radius label for display
  const currentRadiusLabel = radiusOptions.find(opt => opt.value === currentFilter.radius)?.label || "within 100 miles"

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-2">
        <h4 className="text-base text-center font-semibold mb-6 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Location
        </h4>

        {/* Tabs */}
        <div className="flex justify-between border-b dark:border-gray-700 pb-1">
          <button
            className={`flex items-center gap-1 text-sm font-medium pb-1 ${
              currentTab === "contact" 
                ? "text-primary2 border-b-2 border-primary" 
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setCurrentTab("contact")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Contact
          </button>
          <button
            className={`flex items-center gap-2 text-sm font-medium pb-1 ${
              currentTab === "account"
                ? "text-primary2 border-b-2 border-primary"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setCurrentTab("account")}
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
          <RadioGroup
            value={currentFilter.filterType}
            onValueChange={handleFilterTypeChange}
            className="space-y-1"
          >
            {/* Region Filter */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                <RadioGroupItem value="region" id="region" />
                <Label htmlFor="region" className="text-sm font-medium dark:text-gray-200 cursor-pointer">
                  Select Region
                </Label>
              </div>

              {currentFilter.filterType === "region" && (
                <div className="ml-2 space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">City / State / Country / ZIP</p>

                  <div className="relative mb-4" ref={locationDropdownRef}>
                    <div
                      className="w-full p-2 border border-gray-300 rounded flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800"
                      onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    >
                      {currentFilter.selectedLocations.length > 0 ? (
                        currentFilter.selectedLocations.map((location) => (
                          <span
                            key={location}
                            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                          >
                            {location}
                            <X
                              className="h-4 w-4 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeLocation(location)
                              }}
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Enter locations...</span>
                      )}
                      <ChevronDown 
                        className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto cursor-pointer" 
                      />
                    </div>

                    {isLocationDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {locations.map((location) => (
                          <button
                            key={location}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm dark:text-gray-200"
                            onClick={() => addLocation(location)}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="text-primary dark:text-primary2 text-sm flex items-center"
                      onClick={() => setIsExcludeSectionOpen((prev) => !prev)}
                    >
                      Exclude locations {isExcludeSectionOpen ? "▼" : "▲"}
                    </button>
                  </div>

                  {isExcludeSectionOpen && (
                    <div className="relative mt-1" ref={excludeDropdownRef}>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">City / State / Country to exclude:</p>
                      <div className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800">
                        {currentFilter.excludedLocations.length > 0 ? (
                          currentFilter.excludedLocations.map((location) => (
                            <span
                              key={location}
                              className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                            >
                              {location}
                              <X
                                className="h-4 w-4 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeExcludedLocation(location)
                                }}
                              />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Enter locations to exclude...</span>
                        )}
                        <ChevronDown 
                          className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsExcludeDropdownOpen((prev) => !prev)
                          }}
                        />
                      </div>

                      {isExcludeDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                          {locations.map((location) => (
                            <button
                              key={location}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm dark:text-gray-200"
                              onClick={() => addExcludedLocation(location)}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ZIP Code Filter */}
            <div className="space-y-1 border-t dark:border-gray-700 pt-2">
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                <RadioGroupItem value="zip" id="zip" />
                <Label htmlFor="zip" className="text-sm font-medium dark:text-gray-200 cursor-pointer">
                  Select ZIP Code Radius
                </Label>
              </div>

              {currentFilter.filterType === "zip" && (
                <div className="ml-2 space-y-1">
                  <Input
                    type="text"
                    placeholder="e.g. 94105"
                    value={currentFilter.zipCode}
                    onChange={(e) => {
                      handleFilterChange({
                        ...currentFilter,
                        zipCode: e.target.value
                      }, currentTab)
                    }}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                  <div className="relative" ref={radiusDropdownRef}>
                    <button
                      className="w-full p-2 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-sm"
                      onClick={() => setIsRadiusDropdownOpen(!isRadiusDropdownOpen)}
                    >
                      <span className="text-black dark:text-white">{currentRadiusLabel}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    {isRadiusDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg">
                        {radiusOptions.map((option) => (
                          <button
                            key={option.value}
                            className={`w-full text-left px-3 py-2 text-sm dark:text-gray-200 ${
                              currentFilter.radius === option.value 
                                ? "bg-primary text-white" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              setIsRadiusDropdownOpen(false)
                              handleFilterChange({
                                ...currentFilter,
                                radius: option.value
                              }, currentTab)
                            }}
                          >
                            {option.label}
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
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}