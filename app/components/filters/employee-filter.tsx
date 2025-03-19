"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
// import { cn } from "@/lib/utils"
// import { ChevronDown, Users, X } from "lucide-react"

const EmployeeFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
//   const [isExpanded, setIsExpanded] = useState(true)
  const [localSelectedRanges, setLocalSelectedRanges] = useState<string[]>([])

  useEffect(() => {
    const rangesFromUrl = searchParams.get("employeeRanges")?.split(",") || []
    setLocalSelectedRanges(rangesFromUrl)
  }, [searchParams])

  const createQueryString = useCallback(
    (params: Record<string, string | boolean | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([key, value]) => {
        if (value === false || value === "" || value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      })
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const employeeRangeType = searchParams.get("employeeRangeType") || "predefined"
  const minEmployees = searchParams.get("minEmployees") || ""
  const maxEmployees = searchParams.get("maxEmployees") || ""

  const employeeRanges = [
    { id: "1-10", label: "1-10", count: "24.9M" },
    { id: "11-20", label: "11-20", count: "11.7M" },
    { id: "21-50", label: "21-50", count: "18.3M" },
    { id: "51-100", label: "51-100", count: "15.2M" },
    { id: "101-200", label: "101-200", count: "16.7M" },
    { id: "201-500", label: "201-500", count: "21.7M" },
    { id: "501-1000", label: "501-1000", count: "16.4M" },
    { id: "1001-2000", label: "1001-2000", count: "15.8M" },
    { id: "2001-5000", label: "2001-5000", count: "16.3M" },
    { id: "5001-10000", label: "5001-10000", count: "12.1M" },
    { id: "10001+", label: "10001+", count: "48.2M" },
  ]

  const handleRangeTypeChange = (value: string) => {
    const params: Record<string, string | boolean | null> = {
      employeeRangeType: value,
      employeeRanges: null,
      minEmployees: null,
      maxEmployees: null,
    }
    setLocalSelectedRanges([])
    router.replace(`${pathname}?${createQueryString(params)}`, { scroll: false })
  }

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
        employeeRangeType: "predefined",
        employeeRanges: newRanges.length ? newRanges.join(",") : null,
      })}`,
      { scroll: false }
    )
  }

  const handleCustomRangeChange = (min: string, max: string) => {
    if (min && max && Number.parseInt(min) > Number.parseInt(max)) {
      alert("Minimum value cannot be greater than maximum value.")
      return
    }
    router.replace(
      `${pathname}?${createQueryString({
        employeeRangeType: "custom",
        employeeRanges: null,
        minEmployees: min || null,
        maxEmployees: max || null,
      })}`,
      { scroll: false }
    )
  }

//   const getSelectedCount = () => {
//     if (employeeRangeType === "predefined" && localSelectedRanges.length > 0) {
//       return localSelectedRanges.length
//     }
//     if (employeeRangeType === "custom" && (minEmployees || maxEmployees)) {
//       return 1
//     }
//     if (employeeRangeType === "unknown") {
//       return 1
//     }
//     return 0
//   }

//   const clearFilters = () => {
//     setLocalSelectedRanges([])
//     router.replace(pathname, { scroll: false })
//   }

//   const selectedCount = getSelectedCount()

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-3">
        <h4 className="text-base text-center font-semibold mb-6 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Employees
        </h4>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* {selectedCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-3 w-3" />
                <span>{selectedCount}</span>
              </button>
            )} */}
          </div>
        </div>

        <div className="space-y-4">
            {/* Predefined Range */}
            <div className="space-y-2">
              <div
                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors cursor-pointer"
                onClick={() => handleRangeTypeChange("predefined")}
              >
                <Checkbox
                  checked={employeeRangeType === "predefined"}
                  onCheckedChange={() => handleRangeTypeChange("predefined")}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm font-medium dark:text-gray-200">Predefined Range</span>
              </div>
              {employeeRangeType === "predefined" && (
                <div className="ml-6 space-y-1 max-h-[200px] overflow-y-auto">
                  {employeeRanges.map((range) => (
                    <div
                      key={range.id}
                      className="flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
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
              )}
            </div>

            {/* Custom Range */}
            <div className="space-y-2 border-t dark:border-gray-700 pt-4">
              <div
                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors cursor-pointer"
                onClick={() => handleRangeTypeChange("custom")}
              >
                <Checkbox
                  checked={employeeRangeType === "custom"}
                  onCheckedChange={() => handleRangeTypeChange("custom")}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm font-medium dark:text-gray-200">Custom Range</span>
              </div>
              {employeeRangeType === "custom" && (
                <div className="ml-6 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minEmployees}
                    onChange={(e) => handleCustomRangeChange(e.target.value, maxEmployees as string)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    min="0"
                  />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxEmployees}
                    onChange={(e) => handleCustomRangeChange(minEmployees as string, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    min="0"
                  />
                </div>
              )}
            </div>

            {/* Unknown */}
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <Checkbox
                  checked={employeeRangeType === "unknown"}
                  onCheckedChange={() => handleRangeTypeChange("unknown")}
                />
                <span className="text-sm font-medium dark:text-gray-200"># of employees is unknown</span>
              </div>
            </div>
          </div>

        {/* {isExpanded && (
         
        )} */}
      </div>
    </div>
  )
}

export default EmployeeFilter