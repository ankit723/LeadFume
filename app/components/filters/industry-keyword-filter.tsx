"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(true)
  const [isTypeOfKeywordsOpen, setIsTypeOfKeywordsOpen] = useState(true)
  const [isIncludeAllTypeOpen, setIsIncludeAllTypeOpen] = useState(true)
  const [isExcludeTypeOpen, setIsExcludeTypeOpen] = useState(true)
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false)
  const [isIncludeKeywordsDropdownOpen, setIsIncludeKeywordsDropdownOpen] = useState(false)
  const [isIncludeAllDropdownOpen, setIsIncludeAllDropdownOpen] = useState(false)
  const [isExcludeKeywordsDropdownOpen, setIsExcludeKeywordsDropdownOpen] = useState(false)
  const [industrySearch, setIndustrySearch] = useState("")
  const [includeKeywordsSearch, setIncludeKeywordsSearch] = useState("")
  const [includeAllSearch, setIncludeAllSearch] = useState("")
  const [excludeKeywordsSearch, setExcludeKeywordsSearch] = useState("")
  const [excludeIndustrySearch, setExcludeIndustrySearch] = useState("")

  // Filters synced with URL
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    searchParams.getAll('organizationIndustryTagIds[]') || []
  )
  const [selectedExcludeIndustries, setSelectedExcludeIndustries] = useState<string[]>(
    searchParams.getAll('organizationNotIndustryTagIds[]') || []
  )
  const [includeKeywords, setIncludeKeywords] = useState(
    searchParams.has('qOrganizationKeywordTags[]')
  )
  const [includeAll, setIncludeAll] = useState(
    searchParams.has('qOrganizationKeywordTags[]')
  )
  const [excludeKeywords, setExcludeKeywords] = useState(
    searchParams.has('qNotOrganizationKeywordTags[]')
  )
  const [advancedFilter, setAdvancedFilter] = useState<"none" | "known" | "unknown">(
    searchParams.get('existFields[]') === 'organization_linkedin_industry_tag_ids-isknown'
      ? 'known'
      : searchParams.get('notExistFields[]') === 'organization_linkedin_industry_tag_ids-isunknown'
      ? 'unknown'
      : searchParams.getAll('organizationNotIndustryTagIds[]').length > 0
      ? 'none'
      : 'known'
  )
  const [selectedIncludeKeywords, setSelectedIncludeKeywords] = useState<string[]>(
    searchParams.getAll('qOrganizationKeywordTags[]') || []
  )
  const [selectedIncludeAllKeywords, setSelectedIncludeAllKeywords] = useState<string[]>(
    searchParams.getAll('qOrganizationKeywordTags[]') || []
  )
  const [selectedExcludeKeywords, setSelectedExcludeKeywords] = useState<string[]>(
    searchParams.getAll('qNotOrganizationKeywordTags[]') || []
  )

  // Keyword types states synced with URL
  const [keywordTypes, setKeywordTypes] = useState({
    name: searchParams.get('includedOrganizationKeywordFields[]')?.includes('name') || false,
    tags: searchParams.get('includedOrganizationKeywordFields[]')?.includes('tags') || false,
    social_media_description: searchParams.get('includedOrganizationKeywordFields[]')?.includes('social_media_description') || false,
    seo_description: searchParams.get('includedOrganizationKeywordFields[]')?.includes('seo_description') || false,
  })

  const [includeAllTypes, setIncludeAllTypes] = useState({
    name: searchParams.get('includedOrganizationKeywordFields[]')?.includes('name') || false,
    tags: searchParams.get('includedOrganizationKeywordFields[]')?.includes('tags') || false,
    social_media_description: searchParams.get('includedOrganizationKeywordFields[]')?.includes('social_media_description') || false,
    seo_description: searchParams.get('includedOrganizationKeywordFields[]')?.includes('seo_description') || false,
  })

  const [excludeTypes, setExcludeTypes] = useState({
    name: searchParams.get('excludedOrganizationKeywordFields[]')?.includes('name') || false,
    tags: searchParams.get('excludedOrganizationKeywordFields[]')?.includes('tags') || false,
    social_media_description: searchParams.get('excludedOrganizationKeywordFields[]')?.includes('social_media_description') || false,
    seo_description: searchParams.get('excludedOrganizationKeywordFields[]')?.includes('seo_description') || false,
  })

  // Sample data
  const industries: Industry[] = [
    { id: "55718f947369642142b84a12", name: "accounting" },
    { id: "2495545", name: "investment banking" },
    { id: "37895", name: "media production" },
    { id: "4455", name: "public safety" },
    { id: "5551", name: "agriculture" },
  ]

  const keywordTypeOptions: KeywordType[] = [
    { id: "name", name: "Company name" },
    { id: "tags", name: "Social media tags", hasTooltip: true },
    { id: "social_media_description", name: "Social media description", hasTooltip: true },
    { id: "seo_description", name: "SEO description", hasTooltip: true },
  ]

  // Create query string with unencoded []
  const createQueryString = (params: Record<string, string | boolean | string[]>) => {
    const queryParts: string[] = []

    // Preserve existing params except those being updated
    searchParams.forEach((value, key) => {
      if (!Object.keys(params).includes(key)) {
        queryParts.push(`${key}=${encodeURIComponent(value)}`)
      }
    })

    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val) {
            queryParts.push(`${key}=${encodeURIComponent(val)}`)
          }
        })
      } else if (value !== false && value !== '' && value !== null) {
        queryParts.push(`${key}=${encodeURIComponent(String(value))}`)
      }
    })

    // Replace encoded %5B%5D with []
    return queryParts
      .join('&')
      .replace(/%5B%5D/g, '[]')
  }

  // Handle filter changes and update URL
  const handleFilterChange = (updates: Record<string, string | boolean | string[]>) => {
    const queryString = createQueryString(updates)
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  const handleNestedFilterChange = (
    prefix: string,
    nestedKey: string,
    value: boolean,
    currentValues: string[]
  ) => {
    let newValues = [...currentValues]
    if (value) {
      if (!newValues.includes(nestedKey)) newValues.push(nestedKey)
    } else {
      newValues = newValues.filter((v) => v !== nestedKey)
    }
    const queryString = createQueryString({ [prefix]: newValues })
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  const handleIndustrySelect = (industryId: string) => {
    const updated = selectedIndustries.includes(industryId)
      ? selectedIndustries.filter((id) => id !== industryId)
      : [...selectedIndustries, industryId]
    setSelectedIndustries(updated)
    handleFilterChange({ 'organizationIndustryTagIds[]': updated })
    setIsIndustryDropdownOpen(false)
  }

  const handleRemoveIndustry = (industryId: string) => {
    const updated = selectedIndustries.filter((id) => id !== industryId)
    setSelectedIndustries(updated)
    handleFilterChange({ 'organizationIndustryTagIds[]': updated })
  }

  const handleExcludeIndustrySelect = (industryId: string) => {
    const updated = selectedExcludeIndustries.includes(industryId)
      ? selectedExcludeIndustries.filter((id) => id !== industryId)
      : [...selectedExcludeIndustries, industryId]
    setSelectedExcludeIndustries(updated)
    handleFilterChange({ 'organizationNotIndustryTagIds[]': updated })
    setIsExcludeIndustryDropdownOpen(false)
  }

  const handleRemoveExcludeIndustry = (industryId: string) => {
    const updated = selectedExcludeIndustries.filter((id) => id !== industryId)
    setSelectedExcludeIndustries(updated)
    handleFilterChange({ 'organizationNotIndustryTagIds[]': updated })
  }

  const handleKeywordSelect = (type: "include" | "includeAll" | "exclude", keyword: string) => {
    const setFunction =
      type === "include"
        ? setSelectedIncludeKeywords
        : type === "includeAll"
        ? setSelectedIncludeAllKeywords
        : setSelectedExcludeKeywords
    const selectedKeywords =
      type === "include"
        ? selectedIncludeKeywords
        : type === "includeAll"
        ? selectedIncludeAllKeywords
        : selectedExcludeKeywords

    const updated = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter((k) => k !== keyword)
      : [...selectedKeywords, keyword]
    setFunction(updated)

    if (type === "include") {
      handleFilterChange({ 'qOrganizationKeywordTags[]': updated })
      setIsIncludeKeywordsDropdownOpen(false)
    } else if (type === "includeAll") {
      handleFilterChange({ 'qOrganizationKeywordTags[]': updated })
      setIsIncludeAllDropdownOpen(false)
    } else {
      handleFilterChange({ 'qNotOrganizationKeywordTags[]': updated })
      setIsExcludeKeywordsDropdownOpen(false)
    }
  }

  const handleRemoveKeyword = (type: "include" | "includeAll" | "exclude", keyword: string) => {
    const setFunction =
      type === "include"
        ? setSelectedIncludeKeywords
        : type === "includeAll"
        ? setSelectedIncludeAllKeywords
        : setSelectedExcludeKeywords
    const selectedKeywords =
      type === "include"
        ? selectedIncludeKeywords
        : type === "includeAll"
        ? selectedIncludeAllKeywords
        : selectedExcludeKeywords
    const updated = selectedKeywords.filter((k) => k !== keyword)
    setFunction(updated)

    if (type === "include") {
      handleFilterChange({ 'qOrganizationKeywordTags[]': updated })
    } else if (type === "includeAll") {
      handleFilterChange({ 'qOrganizationKeywordTags[]': updated })
    } else {
      handleFilterChange({ 'qNotOrganizationKeywordTags[]': updated })
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "include" | "includeAll" | "exclude"
  ) => {
    if (e.key === "Enter" && (type === "include" ? includeKeywordsSearch : type === "includeAll" ? includeAllSearch : excludeKeywordsSearch).trim()) {
      e.preventDefault()
      const searchValue = type === "include" ? includeKeywordsSearch : type === "includeAll" ? includeAllSearch : excludeKeywordsSearch
      handleKeywordSelect(type, searchValue.trim())
      if (type === "include") setIncludeKeywordsSearch("")
      else if (type === "includeAll") setIncludeAllSearch("")
      else setExcludeKeywordsSearch("")
    }
  }

  // New state for exclude industry dropdown
  const [isExcludeIndustryDropdownOpen, setIsExcludeIndustryDropdownOpen] = useState(false)

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <div className="space-y-1">
        {/* Header */}
        <h4 className="text-base text-center font-semibold mb-2 bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm">
          Industry & Keywords
        </h4>

        {/* Industry Search */}
        <div className="">   
          <Popover open={isIndustryDropdownOpen} onOpenChange={setIsIndustryDropdownOpen}>
            <PopoverTrigger asChild>
              <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                {selectedIndustries.map((id) => {
                  const industry = industries.find((i) => i.id === id)
                  return (
                    <div
                      key={id}
                      className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                    >
                      {industry ? industry.name : id}
                      <X
                        className="h-3 w-3 text-gray-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveIndustry(id)
                        }}
                      />
                    </div>
                  )
                })}
                {selectedIndustries.length === 0 && (
                  <span>Select industries...</span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search industries..."
                  value={industrySearch}
                  onValueChange={setIndustrySearch}
                />
                <CommandList className="max-h-[160px] overflow-y-auto">
                  {industries.filter((industry) =>
                    industry.name.toLowerCase().includes(industrySearch.toLowerCase())
                  ).map((industry) => (
                    <CommandItem
                      key={industry.id}
                      value={industry.name}
                      onSelect={() => handleIndustrySelect(industry.id)}
                      className="flex items-center gap-2 py-2"
                    >
                      <span className="text-sm font-medium dark:text-gray-200">{industry.name}</span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Advanced Settings */}
        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="mb-2 border-gray-200 dark:border-gray-700 pt-1"
        >
          <CollapsibleTrigger className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 text-sm rounded-md transition-colors">
            {isAdvancedOpen ? "Hide advanced settings" : "Advanced settings"}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isAdvancedOpen && "transform rotate-180"
              )}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="">
            <div className="flex space-x-1 mb-2">
              <button
                className={cn(
                  "py-1 px-2 rounded-md text-sm transition-colors",
                  advancedFilter === "none"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("none")
                  handleFilterChange({
                    'organizationNotIndustryTagIds[]': selectedExcludeIndustries.length > 0 ? selectedExcludeIndustries : ['5567ce1f7369643b78570000'],
                    'existFields[]': '',
                    'notExistFields[]': ''
                  })
                }}
              >
                Is not any of
              </button>
              <button
                className={cn(
                  "py-1 px-3 rounded-md text-sm transition-colors",
                  advancedFilter === "known"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("known")
                  handleFilterChange({
                    'existFields[]': 'organization_linkedin_industry_tag_ids-isknown',
                    'notExistFields[]': '',
                    'organizationNotIndustryTagIds[]': ''
                  })
                }}
              >
                Is known
              </button>
              <button
                className={cn(
                  "py-1 px-3 rounded-md text-sm transition-colors",
                  advancedFilter === "unknown"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                )}
                onClick={() => {
                  setAdvancedFilter("unknown")
                  handleFilterChange({
                    'notExistFields[]': 'organization_linkedin_industry_tag_ids-isunknown',
                    'existFields[]': '',
                    'organizationNotIndustryTagIds[]': ''
                  })
                }}
              >
                Is unknown
              </button>
            </div>

            {/* New Exclude Industries Search */}
            <Popover open={isExcludeIndustryDropdownOpen} onOpenChange={setIsExcludeIndustryDropdownOpen}>
              <PopoverTrigger asChild>
                <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  {selectedExcludeIndustries.map((id) => {
                    const industry = industries.find((i) => i.id === id)
                    return (
                      <div
                        key={id}
                        className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                      >
                        {industry ? industry.name : id}
                        <X
                          className="h-3 w-3 text-gray-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveExcludeIndustry(id)
                          }}
                        />
                      </div>
                    )
                  })}
                  {selectedExcludeIndustries.length === 0 && (
                    <span>Search industries to exclude...</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search industries to exclude..."
                    value={excludeIndustrySearch}
                    onValueChange={setExcludeIndustrySearch}
                  />
                  <CommandList className="max-h-[160px] overflow-y-auto">
                    {industries.filter((industry) =>
                      industry.name.toLowerCase().includes(excludeIndustrySearch.toLowerCase())
                    ).map((industry) => (
                      <CommandItem
                        key={industry.id}
                        value={industry.name}
                        onSelect={() => handleExcludeIndustrySelect(industry.id)}
                        className="flex items-center gap-2 py-2"
                      >
                        <span className="text-sm font-medium dark:text-gray-200">{industry.name}</span>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CollapsibleContent>
        </Collapsible>

        {/* Company Keywords Section */}
        <div className="mb-1 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-semibold dark:text-gray-200">
              <span>Company Keywords</span>
              <HelpCircle className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              onClick={() => setIsKeywordsOpen(!isKeywordsOpen)}
              className="group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                  isKeywordsOpen && "transform rotate-180"
                )}
              />
            </button>
          </div>

          {isKeywordsOpen && (
            <div className="">
              {/* Include Keywords */}
              <div className="p-1 dark:bg-gray-800 rounded-lg mt-2">
                <label className="flex items-center gap-2 p-1 rounded-md">
                  <Checkbox
                    checked={includeKeywords}
                    onCheckedChange={(checked) => {
                      const newValue = !!checked
                      setIncludeKeywords(newValue)
                      if (!newValue) {
                        setSelectedIncludeKeywords([])
                        handleFilterChange({ 'qOrganizationKeywordTags[]': [], 'includedOrganizationKeywordFields[]': [] })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Include keywords</span>
                </label>

                {includeKeywords && (
                  <>
                    <Popover
                      open={isIncludeKeywordsDropdownOpen}
                      onOpenChange={setIsIncludeKeywordsDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex items-center gap-1 p-1 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                          {selectedIncludeKeywords.map((keyword) => (
                            <div
                              key={keyword}
                              className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                            >
                              {keyword}
                              <X
                                className="h-3 w-3 text-gray-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveKeyword("include", keyword)
                                }}
                              />
                            </div>
                          ))}
                          {selectedIncludeKeywords.length === 0 && (
                            <span className="text-gray-500 dark:text-gray-400">Add keywords...</span>
                          )}
                          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Type a keyword..."
                            value={includeKeywordsSearch}
                            onValueChange={setIncludeKeywordsSearch}
                            onKeyDown={(e) => handleKeyDown(e, "include")}
                          />
                          <CommandEmpty>No keywords found</CommandEmpty>
                          <CommandItem
                            value={includeKeywordsSearch}
                            onSelect={() => {
                              if (includeKeywordsSearch.trim()) {
                                handleKeywordSelect("include", includeKeywordsSearch.trim())
                                setIncludeKeywordsSearch("")
                              }
                            }}
                          >
                            <span className="text-sm font-medium dark:text-gray-200">Add &quot;{includeKeywordsSearch}&quot;</span>
                          </CommandItem>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Collapsible
                      open={isTypeOfKeywordsOpen}
                      onOpenChange={setIsTypeOfKeywordsOpen}
                      className="mt-1"
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors">
                        Type of Keywords
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                            isTypeOfKeywordsOpen && "transform rotate-180"
                          )}
                        />
                        <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 pl-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          What kind of keywords would you like to search for?
                        </p>
                        {keywordTypeOptions.map((type) => (
                          <label
                            key={type.id}
                            className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1"
                          >
                            <input
                              type="checkbox"
                              checked={keywordTypes[type.id as keyof typeof keywordTypes]}
                              onChange={() => {
                                const newValue = !keywordTypes[type.id as keyof typeof keywordTypes]
                                setKeywordTypes({
                                  ...keywordTypes,
                                  [type.id]: newValue,
                                })
                                const currentFields =
                                  searchParams.getAll('includedOrganizationKeywordFields[]') || []
                                handleNestedFilterChange(
                                  'includedOrganizationKeywordFields[]',
                                  type.id,
                                  newValue,
                                  currentFields
                                )
                              }}
                              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && (
                              <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            )}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>

              {/* Include ALL */}
              <div className=" dark:bg-gray-800 rounded-lg ">
                <label className="flex items-center gap-2 ml-2 rounded-md">
                  <Checkbox
                    checked={includeAll}
                    onCheckedChange={(checked) => {
                      const newValue = !!checked
                      setIncludeAll(newValue)
                      if (!newValue) {
                        setSelectedIncludeAllKeywords([])
                        handleFilterChange({ 'qOrganizationKeywordTags[]': [], 'includedOrganizationKeywordFields[]': [] })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Include ALL</span>
                </label>

                {includeAll && (
                  <>
                    <Popover
                      open={isIncludeAllDropdownOpen}
                      onOpenChange={setIsIncludeAllDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex items-center gap-1 p-1 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                          {selectedIncludeAllKeywords.map((keyword) => (
                            <div
                              key={keyword}
                              className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                            >
                              {keyword}
                              <X
                                className="h-3 w-3 text-gray-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveKeyword("includeAll", keyword)
                                }}
                              />
                            </div>
                          ))}
                          {selectedIncludeAllKeywords.length === 0 && (
                            <span className="text-gray-500 dark:text-gray-400">Add keywords...</span>
                          )}
                          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Type a keyword..."
                            value={includeAllSearch}
                            onValueChange={setIncludeAllSearch}
                            onKeyDown={(e) => handleKeyDown(e, "includeAll")}
                          />
                          <CommandEmpty>No keywords found</CommandEmpty>
                          <CommandItem
                            value={includeAllSearch}
                            onSelect={() => {
                              if (includeAllSearch.trim()) {
                                handleKeywordSelect("includeAll", includeAllSearch.trim())
                                setIncludeAllSearch("")
                              }
                            }}
                          >
                            <span className="text-sm font-medium dark:text-gray-200">Add &quot;{includeAllSearch}&quot;</span>
                          </CommandItem>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Collapsible
                      open={isIncludeAllTypeOpen}
                      onOpenChange={setIsIncludeAllTypeOpen}
                      className="mt-1"
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors">
                        Type of Keywords
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                            isIncludeAllTypeOpen && "transform rotate-180"
                          )}
                        />
                        <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 pl-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          What kind of keywords would you like to search for?
                        </p>
                        {keywordTypeOptions.map((type) => (
                          <label
                            key={type.id}
                            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1"
                          >
                            <input
                              type="checkbox"
                              checked={includeAllTypes[type.id as keyof typeof includeAllTypes]}
                              onChange={() => {
                                const newValue = !includeAllTypes[type.id as keyof typeof includeAllTypes]
                                setIncludeAllTypes({
                                  ...includeAllTypes,
                                  [type.id]: newValue,
                                })
                                const currentFields =
                                  searchParams.getAll('includedOrganizationKeywordFields[]') || []
                                handleNestedFilterChange(
                                  'includedOrganizationKeywordFields[]',
                                  type.id,
                                  newValue,
                                  currentFields
                                )
                              }}
                              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && (
                              <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            )}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>

              {/* Exclude Keywords */}
              <div className=" dark:bg-gray-800 rounded-lg ">
                <label className="flex items-center gap-2 p-2 rounded-md">
                  <Checkbox
                    checked={excludeKeywords}
                    onCheckedChange={(checked) => {
                      const newValue = !!checked
                      setExcludeKeywords(newValue)
                      if (!newValue) {
                        setSelectedExcludeKeywords([])
                        handleFilterChange({ 'qNotOrganizationKeywordTags[]': [], 'excludedOrganizationKeywordFields[]': [] })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">Exclude keywords</span>
                </label>

                {excludeKeywords && (
                  <>
                    <Popover
                      open={isExcludeKeywordsDropdownOpen}
                      onOpenChange={setIsExcludeKeywordsDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex items-center gap-1 p-1 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                          {selectedExcludeKeywords.map((keyword) => (
                            <div
                              key={keyword}
                              className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                            >
                              {keyword}
                              <X
                                className="h-3 w-3 text-gray-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveKeyword("exclude", keyword)
                                }}
                              />
                            </div>
                          ))}
                          {selectedExcludeKeywords.length === 0 && (
                            <span className="text-gray-500 dark:text-gray-400">Add keywords...</span>
                          )}
                          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-auto" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Type a keyword..."
                            value={excludeKeywordsSearch}
                            onValueChange={setExcludeKeywordsSearch}
                            onKeyDown={(e) => handleKeyDown(e, "exclude")}
                          />
                          <CommandEmpty>No keywords found</CommandEmpty>
                          <CommandItem
                            value={excludeKeywordsSearch}
                            onSelect={() => {
                              if (excludeKeywordsSearch.trim()) {
                                handleKeywordSelect("exclude", excludeKeywordsSearch.trim())
                                setExcludeKeywordsSearch("")
                              }
                            }}
                          >
                            <span className="text-sm font-medium dark:text-gray-200">Add &quot;{excludeKeywordsSearch}&quot;</span>
                          </CommandItem>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Collapsible
                      open={isExcludeTypeOpen}
                      onOpenChange={setIsExcludeTypeOpen}
                      className="mt-1"
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                        Type of Keywords
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                            isExcludeTypeOpen && "transform rotate-180"
                          )}
                        />
                        <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 pl-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          What kind of keywords would you like to exclude?
                        </p>
                        {keywordTypeOptions.map((type) => (
                          <label
                            key={type.id}
                            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors mb-1"
                          >
                            <input
                              type="checkbox"
                              checked={excludeTypes[type.id as keyof typeof excludeTypes]}
                              onChange={() => {
                                const newValue = !excludeTypes[type.id as keyof typeof excludeTypes]
                                setExcludeTypes({
                                  ...excludeTypes,
                                  [type.id]: newValue,
                                })
                                const currentFields =
                                  searchParams.getAll('excludedOrganizationKeywordFields[]') || []
                                handleNestedFilterChange(
                                  'excludedOrganizationKeywordFields[]',
                                  type.id,
                                  newValue,
                                  currentFields
                                )
                              }}
                              className="w-4 h-4 mr-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs dark:text-gray-200">{type.name}</span>
                            {type.hasTooltip && (
                              <HelpCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            )}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 dark:text-gray-400">
            Keywords filters may slow down your search.
          </p>
        </div>
      </div>
    </div>
  )
}