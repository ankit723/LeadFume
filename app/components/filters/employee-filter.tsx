"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState, useCallback, useEffect } from "react"

const EmployeeFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [localSelectedRanges, setLocalSelectedRanges] = useState<string[]>([])
  const [unknownChecked, setUnknownChecked] = useState(false)
  const [customMin, setCustomMin] = useState("")
  const [customMax, setCustomMax] = useState("")

  useEffect(() => {
    const rangesFromUrl = searchParams.getAll("organizationNumEmployeesRanges[]") || []
    setLocalSelectedRanges(rangesFromUrl)
    setUnknownChecked(searchParams.has("notExistFields[]"))
    
    // Parse custom range from URL if it exists
    const customRange = rangesFromUrl.find(range => range.includes(","))
    if (customRange) {
      const [min, max] = customRange.split(",")
      setCustomMin(min)
      setCustomMax(max)
    }
  }, [searchParams])

  const createQueryString = useCallback(
    (params: Record<string, string | string[] | boolean | number | null>) => {
      const newSearchParams = new URLSearchParams()
      
      // Preserve existing search params except the ones we're managing
      searchParams.forEach((value, key) => {
        if (!key.startsWith("organizationNumEmployeesRanges") && 
            !key.startsWith("notExistFields")) {
          newSearchParams.set(key, value)
        }
      })

      // Handle the new params
      Object.entries(params).forEach(([key, value]) => {
        if (value === false || value === "" || value === null || (Array.isArray(value) && value.length === 0)) {
          // Remove the param if it's falsy
          if (key === "organizationNumEmployeesRanges[]") {
            newSearchParams.delete(key)
          } else if (key === "notExistFields[]") {
            newSearchParams.delete(key)
          }
        } else if (key === "organizationNumEmployeesRanges[]" && Array.isArray(value)) {
          // Handle array of ranges
          value.forEach(range => {
            newSearchParams.append(key, range)
          })
        } else if (key === "notExistFields[]" && value === true) {
          newSearchParams.append(key, "organization_estimated_number_employees")
        }
      })

      // Convert to string and ensure proper format
      let queryString = newSearchParams.toString()
      queryString = queryString.replace(/%5B%5D/g, "[]")
      
      // Add & prefix if there are any parameters
      if (queryString) {
        queryString = "&" + queryString
      }
      
      return queryString
    },
    [searchParams]
  )

  // const minEmployees = searchParams.get("minEmployees") || ""
  // const maxEmployees = searchParams.get("maxEmployees") || ""

  const employeeRanges = [
    { id: "1,10", label: "1-10", count: "24.9M" },
    { id: "11,20", label: "11-20", count: "11.7M" },
    { id: "21,50", label: "21-50", count: "18.3M" },
    { id: "51,100", label: "51-100", count: "15.2M" },
    { id: "101,200", label: "101-200", count: "16.7M" },
    { id: "201,500", label: "201-500", count: "21.7M" },
    { id: "501,1000", label: "501-1000", count: "16.4M" },
    { id: "1001,2000", label: "1001-2000", count: "15.8M" },
    { id: "2001,5000", label: "2001-5000", count: "16.3M" },
    { id: "5001,10000", label: "5001-10000", count: "12.1M" },
    { id: "10001,", label: "10001+", count: "48.2M" },
  ]

  const handleRangeChange = (rangeId: string, checked: boolean) => {
    let newRanges = [...localSelectedRanges]
    if (checked) {
      newRanges.push(rangeId)
    } else {
      newRanges = newRanges.filter((id) => id !== rangeId)
    }
    setLocalSelectedRanges(newRanges)
    
    router.replace(
      `${pathname}?${createQueryString({
        "organizationNumEmployeesRanges[]": newRanges,
        "notExistFields[]": unknownChecked
      })}`,
      { scroll: false }
    )
  }

  const handleCustomRangeChange = (min: string, max: string) => {
    setCustomMin(min)
    setCustomMax(max)
    
    const customRange = min && max ? [`${min},${max}`] : []
    const otherRanges = localSelectedRanges.filter(range => !range.includes(","))
    
    router.replace(
      `${pathname}?${createQueryString({
        "organizationNumEmployeesRanges[]": [...otherRanges, ...customRange],
        "notExistFields[]": unknownChecked
      })}`,
      { scroll: false }
    )
  }

  const handleUnknownChange = (checked: boolean) => {
    setUnknownChecked(checked)
    router.replace(
      `${pathname}?${createQueryString({
        "organizationNumEmployeesRanges[]": localSelectedRanges,
        "notExistFields[]": checked
      })}`,
      { scroll: false }
    )
  }

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="">
        <h4 className="text-base text-center font-semibold bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Employees
        </h4>

        <div className="space-y-1">
          {/* Predefined Ranges */}
          <div className="mt-2">
            <h5 className="text-sm font-medium mb-2 dark:text-gray-200">Predefined Ranges</h5>
            <div className="max-h-[200px] overflow-y-auto">
              {employeeRanges.map((range) => (
                <div
                  key={range.id}
                  className="flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="cursor-pointer"
                      id={`range-${range.id}`}
                      checked={localSelectedRanges.includes(range.id)}
                      onCheckedChange={(checked) => handleRangeChange(range.id, checked as boolean)}
                    />
                    <label htmlFor={`range-${range.id}`} className="text-sm dark:text-gray-200">
                      {range.label}
                    </label>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md px-2 py-1 font-medium">
                    {range.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="border-t dark:border-gray-700 pt-3">
            <h5 className="text-sm font-medium mb-2 dark:text-gray-200">Custom Range</h5>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => handleCustomRangeChange(e.target.value, customMax)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                min="0"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={(e) => handleCustomRangeChange(customMin, e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                min="0"
              />
            </div>
          </div>

          {/* Unknown */}
          <div className="border-t dark:border-gray-700 pt-3">
            <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
              <Checkbox
                className="cursor-pointer"
                checked={unknownChecked}
                onCheckedChange={(checked) => handleUnknownChange(checked as boolean)}
              />
              <span className="text-sm font-medium dark:text-gray-200 tracking-tighter">
                # of employees is unknown
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeFilter