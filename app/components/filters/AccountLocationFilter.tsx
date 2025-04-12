"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type LocationFilterState = {
  filterType: "region" | "zipcode"
  selectedLocations: string[]
  excludedLocations: string[]
  zipCode: string
  radius: string
}

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

  // Initialize filter state
  const [filter, setFilter] = useState<LocationFilterState>({
    filterType: (searchParams.get('filterType') as "region" | "zipcode") || "region",
    selectedLocations: searchParams.getAll('locations[]') || [],
    excludedLocations: searchParams.getAll('excludeLocations[]') || [],
    zipCode: searchParams.get('zip') || "",
    radius: searchParams.get('radius') || "50"
  })

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
      newSearchParams.append(key, value)
    })

    // Apply new params
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.delete(key) // Remove existing values to avoid duplicates
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

    // Convert to string and handle URL encoding
    let queryString = newSearchParams.toString()
    queryString = queryString.replace(/%5B%5D/g, '[]')
    queryString = queryString.replace(/\+/g, '%20')

    return queryString
  }

  const handleFilterChange = (newState: LocationFilterState) => {
    setFilter(newState)

    const params: Record<string, string | string[] | null> = {}

    if (newState.filterType === "region") {
      params['organizationLocations[]'] = newState.selectedLocations.length > 0 ? newState.selectedLocations : null
      params['organizationNotLocations[]'] = newState.excludedLocations.length > 0 ? newState.excludedLocations : null
      params['organizationLocationName'] = null
      params['organizationLocationRadius'] = null
    } else {
      params['organizationLocationName'] = newState.zipCode || null
      params['organizationLocationRadius'] = newState.radius || null
      params['organizationLocations[]'] = null
      params['organizationNotLocations[]'] = null
    }

    const queryString = createQueryString(params)
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const handleFilterTypeChange = (value: "region" | "zipcode") => {
    const newState = {
      ...filter,
      filterType: value,
      ...(value === "region" ? { 
        zipCode: "",
        radius: "50"
      } : {
        selectedLocations: [],
        excludedLocations: []
      })
    }
    handleFilterChange(newState)
  }

  const removeLocation = (location: string) => {
    const updatedLocations = filter.selectedLocations.filter((loc) => loc !== location)
    handleFilterChange({
      ...filter,
      selectedLocations: updatedLocations
    })
  }

  const removeExcludedLocation = (location: string) => {
    const updatedExcluded = filter.excludedLocations.filter((loc) => loc !== location)
    handleFilterChange({
      ...filter,
      excludedLocations: updatedExcluded
    })
  }

  const addLocation = (location: string) => {
    if (!filter.selectedLocations.includes(location)) {
      const updatedLocations = [...filter.selectedLocations, location]
      handleFilterChange({
        ...filter,
        selectedLocations: updatedLocations
      })
    }
    setIsLocationDropdownOpen(false)
  }

  const addExcludedLocation = (location: string) => {
    if (!filter.excludedLocations.includes(location)) {
      const updatedExcluded = [...filter.excludedLocations, location]
      handleFilterChange({
        ...filter,
        excludedLocations: updatedExcluded
      })
    }
    setIsExcludeDropdownOpen(false)
  }

  // Get current radius label for display
  const currentRadiusLabel = radiusOptions.find(opt => opt.value === filter.radius)?.label || "within 50 miles"

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
            <RadioGroup
              value={filter.filterType}
              onValueChange={handleFilterTypeChange}
              className="space-y-1"
            >
              {/* Region Selection Option */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                  <RadioGroupItem value="region" id="region" />
                  <Label htmlFor="region" className="text-sm font-medium dark:text-gray-200 cursor-pointer">
                    Select Region
                  </Label>
                </div>

                {filter.filterType === "region" && (
                  <div className="ml-2 space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">City / State / Country / ZIP</p>
                    <div className="relative mb-4" ref={locationDropdownRef}>
                      <div
                        className="w-full p-2 border border-gray-300 rounded flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                      >
                        {filter.selectedLocations.length > 0 ? (
                          filter.selectedLocations.map((location) => (
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
                        className="text-primary2 dark:text-primary/80 text-sm flex items-center"
                        onClick={() => setIsExcludeExpanded(!isExcludeExpanded)}
                      >
                        Exclude locations {isExcludeExpanded ? "▼" : "▲"}
                      </button>
                    </div>

                    {isExcludeExpanded && (
                      <div className="relative mt-1" ref={excludeDropdownRef}>
                        <

p className="text-sm text-gray-700 dark:text-gray-300 mb-1">City / State / Country to exclude:</p>
                        <div
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800"
                          onClick={() => setIsExcludeDropdownOpen(!isExcludeDropdownOpen)}
                        >
                          {filter.excludedLocations.length > 0 ? (
                            filter.excludedLocations.map((location) => (
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

              {/* ZIP Code Radius Option */}
              <div className="space-y-1 border-t dark:border-gray-700 pt-2">
                <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
                  <RadioGroupItem value="zipcode" id="zipcode" />
                  <Label htmlFor="zipcode" className="text-sm font-medium dark:text-gray-200 cursor-pointer">
                    Select ZIP Code Radius
                  </Label>
                </div>

                {filter.filterType === "zipcode" && (
                  <div className="ml-2 space-y-3">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Address / City / ZIP</p>
                      <Input
                        type="text"
                        placeholder="e.g. 94105"
                        value={filter.zipCode}
                        onChange={(e) => {
                          handleFilterChange({
                            ...filter,
                            zipCode: e.target.value
                          })
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
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
                                filter.radius === option.value 
                                  ? "bg-primary2/80 text-white" 
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => {
                                setIsRadiusDropdownOpen(false)
                                handleFilterChange({
                                  ...filter,
                                  radius: option.value
                                })
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  )
}