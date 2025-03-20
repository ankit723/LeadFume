"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Industry = {
  name: string
  id: string
}

type KeywordType = {
  id: string
  name: string
  description?: string
  hasTooltip?: boolean
}

export default function IndustryKeywordFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // States
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(true)
  const [isTypeOfKeywordsOpen, setIsTypeOfKeywordsOpen] = useState(true)
  const [isIncludeAllTypeOpen, setIsIncludeAllTypeOpen] = useState(true)
  const [isExcludeTypeOpen, setIsExcludeTypeOpen] = useState(true)
  const [industrySearch, setIndustrySearch] = useState("")
//   const [showKeywordTooltip, setShowKeywordTooltip] = useState(false)

  // Filters synced with URL
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(searchParams.get('industry') || null)
  const [includeKeywords, setIncludeKeywords] = useState(searchParams.get('includeKeywords') === 'true')
  const [includeAll, setIncludeAll] = useState(searchParams.get('includeAll') === 'true')
  const [excludeKeywords, setExcludeKeywords] = useState(searchParams.get('excludeKeywords') === 'true')
  const [advancedFilter, setAdvancedFilter] = useState<"none" | "known" | "unknown">(
    (searchParams.get('advancedFilter') as "none" | "known" | "unknown") || "known"
  )
  const [includeKeywordsText, setIncludeKeywordsText] = useState(searchParams.get('includeKeywordsText') || '')
  const [includeAllText, setIncludeAllText] = useState(searchParams.get('includeAllText') || '')
  const [excludeKeywordsText, setExcludeKeywordsText] = useState(searchParams.get('excludeKeywordsText') || '')

  // Keyword types states synced with URL
  const [keywordTypes, setKeywordTypes] = useState({
    companyName: searchParams.get('keywordTypes.companyName') === 'true',
    socialMediaTags: searchParams.get('keywordTypes.socialMediaTags') === 'true',
    socialMediaDescription: searchParams.get('keywordTypes.socialMediaDescription') === 'true',
    seoDescription: searchParams.get('keywordTypes.seoDescription') === 'true',
  })

  const [includeAllTypes, setIncludeAllTypes] = useState({
    companyName: searchParams.get('includeAllTypes.companyName') === 'true',
    socialMediaTags: searchParams.get('includeAllTypes.socialMediaTags') === 'true',
    socialMediaDescription: searchParams.get('includeAllTypes.socialMediaDescription') === 'true',
    seoDescription: searchParams.get('includeAllTypes.seoDescription') === 'true',
  })

  const [excludeTypes, setExcludeTypes] = useState({
    companyName: searchParams.get('excludeTypes.companyName') === 'true',
    socialMediaTags: searchParams.get('excludeTypes.socialMediaTags') === 'true',
    socialMediaDescription: searchParams.get('excludeTypes.socialMediaDescription') === 'true',
    seoDescription: searchParams.get('excludeTypes.seoDescription') === 'true',
  })

  // Sample data
  const industries: Industry[] = [
    { id: "1", name: "banking" },
    { id: "2", name: "investment banking" },
    { id: "3", name: "media production" },
    { id: "4", name: "public safety" },
    { id: "5", name: "tobacco" },
  ]

  const keywordTypeOptions: KeywordType[] = [
    { id: "companyName", name: "Company name" },
    { id: "socialMediaTags", name: "Social media tags", hasTooltip: true },
    { id: "socialMediaDescription", name: "Social media description", hasTooltip: true },
    { id: "seoDescription", name: "SEO description", hasTooltip: true },
  ]

  // Filter industries based on search
  const filteredIndustries = industries.filter((industry) =>
    industry.name.toLowerCase().includes(industrySearch.toLowerCase())
  )

  // Refs for handling clicks outside dropdowns
  const industryDropdownRef = useRef<HTMLDivElement>(null)
  const keywordTooltipRef = useRef<HTMLDivElement>(null)

  // Create URLSearchParams object for manipulation
  const createQueryString = (params: Record<string, string | boolean>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === false || value === '' || value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    })
    
    return newSearchParams.toString()
  }

  // Handle filter changes and update URL
  const handleFilterChange = (key: string, value: string | boolean) => {
    const queryString = createQueryString({ [key]: value })
    router.push(`${pathname}?${queryString}`)
  }

  const handleNestedFilterChange = (
    prefix: string,
    nestedKey: string,
    value: boolean
  ) => {
    const queryString = createQueryString({ [`${prefix}.${nestedKey}`]: value })
    router.push(`${pathname}?${queryString}`)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setIsIndustryOpen(false)
      }
      if (keywordTooltipRef.current && !keywordTooltipRef.current.contains(event.target as Node)) {
        // setShowKeywordTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-1">
        {/* Header */}
        <h4 className="text-base text-center font-semibold mb-2 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Industry & Keywords
        </h4>

        {/* Industry Search */}
        <div ref={industryDropdownRef} className="relative">
          <div
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer"
            onClick={() => setIsIndustryOpen(!isIndustryOpen)}
          >
            <span className="text-sm font-medium dark:text-gray-200">{selectedIndustry || "Search industries..."}</span>
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto" />
          </div>

          {isIndustryOpen && (
            <div className="absolute z-10 w-full  bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              <input
                type="text"
                value={industrySearch}
                onChange={(e) => setIndustrySearch(e.target.value)}
                className="w-full p-1 border-b dark:border-gray-700 focus:outline-none bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Search..."
                autoFocus
              />
              <div>
                {filteredIndustries.length > 0 ? (
                  filteredIndustries.map((industry) => (
                    <div
                      key={industry.id}
                      className="p-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-200 transition-colors"
                      onClick={() => {
                        setSelectedIndustry(industry.name)
                        handleFilterChange('industry', industry.name)
                        setIsIndustryOpen(false)
                        setIndustrySearch("")
                      }}
                    >
                      {industry.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 dark:text-gray-400">No industries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="mb-2 border-t border-gray-200 dark:border-gray-700 pt-1"
        >
          <CollapsibleTrigger className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 text-sm rounded-md transition-colors">
            {isAdvancedOpen ? "Hide advanced settings" : "Advanced settings"}
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-300",
              isAdvancedOpen && "transform rotate-180"
            )} />
          </CollapsibleTrigger>

          <CollapsibleContent className="">
            <div className="flex space-x-1">
              <button
                className={cn(
                  "py-1 px-2 rounded-md text-sm transition-colors",
                  advancedFilter === "none" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("none")
                  handleFilterChange('advancedFilter', 'none')
                }}
              >
                Is not any of
              </button>
              <button
                className={cn(
                  "py-1 px-3 rounded-md text-sm transition-colors",
                  advancedFilter === "known" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("known")
                  handleFilterChange('advancedFilter', 'known')
                }}
              >
                Is known
              </button>
              <button
                className={cn(
                  "py-1 px-3 rounded-md text-sm transition-colors",
                  advancedFilter === "unknown" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("unknown")
                  handleFilterChange('advancedFilter', 'unknown')
                }}
              >
                Is unknown
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Company Keywords Section */}
        <div className="mb-1 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between ">
            <div className="flex items-center text-sm font-semibold dark:text-gray-200">
              <span>Company Keywords</span>
              <HelpCircle className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />
            </div>
            <button 
              onClick={() => setIsKeywordsOpen(!isKeywordsOpen)} 
              className="group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                isKeywordsOpen && "transform rotate-180"
              )} />
            </button>
          </div>

          {isKeywordsOpen && (
            <div className="">
              {/* Include Keywords */}
              <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <label className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors ">
                  <input
                    type="checkbox"
                    checked={includeKeywords}
                    onChange={() => {
                      setIncludeKeywords(!includeKeywords)
                      handleFilterChange('includeKeywords', !includeKeywords)
                    }}
                    className="w-4 h-4  text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Include keywords</span>
                </label>

                {includeKeywords && (
                  <>
                    <div className="relative  pl-2">
                      <input
                        type="text"
                        value={includeKeywordsText}
                        onChange={(e) => {
                          setIncludeKeywordsText(e.target.value)
                          handleFilterChange('includeKeywordsText', e.target.value)
                        }}
                        className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="e.g. Cloud, AWS"
                      />
                    </div>

                    <Collapsible open={isTypeOfKeywordsOpen} onOpenChange={setIsTypeOfKeywordsOpen}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                        Type of Keywords
                        <ChevronDown className={cn(
                          "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                          isTypeOfKeywordsOpen && "transform rotate-180"
                        )} />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-1 pl-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">What kind of keywords would you like to search for?</p>
                        {keywordTypeOptions.map((type) => (
                          <label key={type.id} className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1">
                            <input
                              type="checkbox"
                              checked={keywordTypes[type.id as keyof typeof keywordTypes]}
                              onChange={() => {
                                const newValue = !keywordTypes[type.id as keyof typeof keywordTypes]
                                setKeywordTypes({
                                  ...keywordTypes,
                                  [type.id]: newValue,
                                })
                                handleNestedFilterChange('keywordTypes', type.id, newValue)
                              }}
                              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>

              {/* Include ALL */}
              <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <label className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={includeAll}
                    onChange={() => {
                      setIncludeAll(!includeAll)
                      handleFilterChange('includeAll', !includeAll)
                    }}
                    className="w-4 h-4 mr-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Include ALL</span>
                </label>

                {includeAll && (
                  <div className="mt-2 pl-2">
                    <input
                      type="text"
                      value={includeAllText}
                      onChange={(e) => {
                        setIncludeAllText(e.target.value)
                        handleFilterChange('includeAllText', e.target.value)
                      }}
                      className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="e.g. Cloud, AWS"
                    />

                    <Collapsible open={isIncludeAllTypeOpen} onOpenChange={setIsIncludeAllTypeOpen}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mt-1">
                        Type of Keywords
                        <ChevronDown className={cn(
                          "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                          isIncludeAllTypeOpen && "transform rotate-180"
                        )} />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-2 pl-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">What kind of keywords would you like to search for?</p>
                        {keywordTypeOptions.map((type) => (
                          <label key={type.id} className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1">
                            <input
                              type="checkbox"
                              checked={includeAllTypes[type.id as keyof typeof includeAllTypes]}
                              onChange={() => {
                                const newValue = !includeAllTypes[type.id as keyof typeof includeAllTypes]
                                setIncludeAllTypes({
                                  ...includeAllTypes,
                                  [type.id]: newValue,
                                })
                                handleNestedFilterChange('includeAllTypes', type.id, newValue)
                              }}
                              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>

              {/* Exclude Keywords */}
              <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <label className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={excludeKeywords}
                    onChange={() => {
                      setExcludeKeywords(!excludeKeywords)
                      handleFilterChange('excludeKeywords', !excludeKeywords)
                    }}
                    className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Exclude keywords</span>
                </label>

                {excludeKeywords && (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={excludeKeywordsText}
                      onChange={(e) => {
                        setExcludeKeywordsText(e.target.value)
                        handleFilterChange('excludeKeywordsText', e.target.value)
                      }}
                      className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="e.g. Cloud, AWS"
                    />

                    <Collapsible open={isExcludeTypeOpen} onOpenChange={setIsExcludeTypeOpen}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors ">
                        Type of Keywords
                        <ChevronDown className={cn(
                          "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                          isExcludeTypeOpen && "transform rotate-180"
                        )} />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-1 pl-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">What kind of keywords would you like to exclude?</p>
                        {keywordTypeOptions.map((type) => (
                          <label key={type.id} className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1">
                            <input
                              type="checkbox"
                              checked={excludeTypes[type.id as keyof typeof excludeTypes]}
                              onChange={() => {
                                const newValue = !excludeTypes[type.id as keyof typeof excludeTypes]
                                setExcludeTypes({
                                  ...excludeTypes,
                                  [type.id]: newValue,
                                })
                                handleNestedFilterChange('excludeTypes', type.id, newValue)
                              }}
                              className="w-4 h-4 mr-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 dark:text-gray-400">Keywords filters may slow down your search.</p>
        </div>
      </div>
    </div>
  )
}