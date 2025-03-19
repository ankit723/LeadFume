"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Building, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const companySuggestions = [
  { name: "Amazon", domain: "amazon.com", logo: "/amazon-logo.png" },
  { name: "Apple", domain: "apple.com", logo: "/apple-logo.png" },
  { name: "Accenture", domain: "accenture.com", logo: "/accenture-logo.png" },
  { name: "Adecco", domain: "adecco.com", logo: "/adecco-logo.png" },
  { name: "Deloitte", domain: "deloitte.com", logo: "/deloitte-logo.png" },
  { name: "Google", domain: "google.com", logo: "/google-logo.png" },
  { name: "Microsoft", domain: "microsoft.com", logo: "/microsoft-logo.png" },
];

const CompanyFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCompanyOpen, setIsCompanyOpen] = useState(true);
  const [isIncludeExcludeOpen, setIsIncludeExcludeOpen] = useState(false);
  const [isIncludeDropdownOpen, setIsIncludeDropdownOpen] = useState(false);
  const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false);
  const [isPastDropdownOpen, setIsPastDropdownOpen] = useState(false);

  const [selectedIncludeCompanies, setSelectedIncludeCompanies] = useState<string[]>([]);
  const [selectedExcludeCompanies, setSelectedExcludeCompanies] = useState<string[]>([]);
  const [selectedPastCompanies, setSelectedPastCompanies] = useState<string[]>([]);
  const [searchInclude, setSearchInclude] = useState("");
  const [searchExclude, setSearchExclude] = useState("");
  const [searchPast, setSearchPast] = useState("");

  const includeCompaniesParam = searchParams.get("includeCompanies") || "";
  const excludeCompaniesParam = searchParams.get("excludeCompanies") || "";
  const pastCompaniesParam = searchParams.get("pastCompanies") || "";

  const currentFilters = useMemo(
    () => ({
      companyFilterType: searchParams.get("companyFilterType") || "isAnyOf",
      isNotAnyOf: searchParams.get("isNotAnyOf") === "true",
      includePastCompany: searchParams.get("includePastCompany") === "true",
      domainExists: searchParams.get("domainExists") === "true",
      includeCompanies: includeCompaniesParam ? includeCompaniesParam.split(",") : [],
      excludeCompanies: excludeCompaniesParam ? excludeCompaniesParam.split(",") : [],
      pastCompanies: pastCompaniesParam ? pastCompaniesParam.split(",") : [],
    }),
    [searchParams, includeCompaniesParam, excludeCompaniesParam, pastCompaniesParam]
  );

  useEffect(() => {
    setSelectedIncludeCompanies(currentFilters.includeCompanies);
    setSelectedExcludeCompanies(currentFilters.excludeCompanies);
    setSelectedPastCompanies(currentFilters.pastCompanies);
  }, [currentFilters.includeCompanies, currentFilters.excludeCompanies, currentFilters.pastCompanies]);

  const createQueryString = (params: Record<string, string | boolean | string[]>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === false || (Array.isArray(value) && value.length === 0)) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });
    return newSearchParams.toString();
  };

  const handleFilterChange = (key: string, value: string | boolean | string[]) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  const handleRadioChange = (value: string) => {
    handleFilterChange("companyFilterType", value);
  };

  const handleCompanySelect = (type: "include" | "exclude" | "past", company: string) => {
    const setFunction =
      type === "include"
        ? setSelectedIncludeCompanies
        : type === "exclude"
        ? setSelectedExcludeCompanies
        : setSelectedPastCompanies;
    const selectedCompanies =
      type === "include"
        ? selectedIncludeCompanies
        : type === "exclude"
        ? selectedExcludeCompanies
        : selectedPastCompanies;

    const updated = selectedCompanies.includes(company)
      ? selectedCompanies.filter((c) => c !== company)
      : [...selectedCompanies, company];
    setFunction(updated);

    if (type === "include") {
      handleFilterChange("includeCompanies", updated);
      setIsIncludeDropdownOpen(false);
    } else if (type === "exclude") {
      handleFilterChange("excludeCompanies", updated);
      setIsExcludeDropdownOpen(false);
    } else if (type === "past") {
      handleFilterChange("pastCompanies", updated);
      setIsPastDropdownOpen(false);
    }
  };

  const handleRemoveCompany = (type: "include" | "exclude" | "past", company: string) => {
    const setFunction =
      type === "include"
        ? setSelectedIncludeCompanies
        : type === "exclude"
        ? setSelectedExcludeCompanies
        : setSelectedPastCompanies;
    const selectedCompanies =
      type === "include"
        ? selectedIncludeCompanies
        : type === "exclude"
        ? selectedExcludeCompanies
        : selectedPastCompanies;
    const updated = selectedCompanies.filter((c) => c !== company);
    setFunction(updated);

    if (type === "include") {
      handleFilterChange("includeCompanies", updated);
    } else if (type === "exclude") {
      handleFilterChange("excludeCompanies", updated);
    } else if (type === "past") {
      handleFilterChange("pastCompanies", updated);
    }
  };

  const handleSaveAndSearch = (type: "include" | "exclude") => {
    if (type === "include") {
      handleFilterChange("includeCompanies", selectedIncludeCompanies);
    } else {
      handleFilterChange("excludeCompanies", selectedExcludeCompanies);
    }
  };

  const handleTextAreaChange = (type: "include" | "exclude", value: string) => {
    const companies = value.split(/[\s,]+/).filter(Boolean);
    if (type === "include") {
      setSelectedIncludeCompanies(companies);
    } else {
      setSelectedExcludeCompanies(companies);
    }
  };

  const clearFilters = () => {
    setSelectedIncludeCompanies([]);
    setSelectedExcludeCompanies([]);
    setSelectedPastCompanies([]);
    router.push(pathname);
  };

  const activeFiltersCount = [
    ...selectedIncludeCompanies,
    ...selectedExcludeCompanies,
    ...selectedPastCompanies,
    currentFilters.isNotAnyOf ? 1 : 0,
    currentFilters.includePastCompany ? 1 : 0,
    currentFilters.domainExists ? 1 : 0,
  ].filter(Boolean).length;

  const filteredIncludeSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchInclude.toLowerCase())
  );
  const filteredExcludeSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchExclude.toLowerCase())
  );
  const filteredPastSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchPast.toLowerCase())
  );

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <Collapsible open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base text-center font-semibold bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm flex-1">
            Company
          </h4>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 dark:text-gray-400"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                {activeFiltersCount}
              </Button>
            )}
            <CollapsibleTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                  isCompanyOpen && "transform rotate-180"
                )}
              />
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          {/* Company Filter Type Section */}
          <div className="space-y-3">
            <RadioGroup
              value={currentFilters.companyFilterType}
              onValueChange={handleRadioChange}
            >
              {/* Is Any Of */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem value="isAnyOf" id="isAnyOf" />
                  <Label htmlFor="isAnyOf" className="text-sm font-medium dark:text-gray-200">
                    Is any of
                  </Label>
                </div>
                {currentFilters.companyFilterType === "isAnyOf" && (
                  <div className="space-y-2">
                    <Popover open={isIncludeDropdownOpen} onOpenChange={setIsIncludeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                          {selectedIncludeCompanies.map((company) => (
                            <div
                              key={company}
                              className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                            >
                              {company}
                              <X
                                className="h-3 w-3 text-gray-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveCompany("include", company);
                                }}
                              />
                            </div>
                          ))}
                          {selectedIncludeCompanies.length === 0 && (
                            <span>Select companies...</span>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search companies..."
                            value={searchInclude}
                            onValueChange={setSearchInclude}
                          />
                          <CommandList className="max-h-[160px] overflow-y-auto">
                            {filteredIncludeSuggestions.map((company) => (
                              <CommandItem
                                key={company.domain}
                                value={company.name}
                                onSelect={() => handleCompanySelect("include", company.name)}
                                className="flex items-center gap-2 py-2"
                              >
                                <div className="w-6 h-6 flex-shrink-0">
                                  {company.logo ? (
                                    <Image
                                      src={company.logo}
                                      alt={`${company.name} logo`}
                                      width={24}
                                      height={24}
                                    />
                                  ) : (
                                    <Building className="h-4 w-4 text-gray-500" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium dark:text-gray-200">{company.name}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{company.domain}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Is Not Any Of */}
                    <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        id="isNotAnyOf"
                        checked={currentFilters.isNotAnyOf}
                        onCheckedChange={(checked) => handleFilterChange("isNotAnyOf", checked as boolean)}
                      />
                      <Label htmlFor="isNotAnyOf" className="text-sm font-medium dark:text-gray-200">
                        Is not any of
                      </Label>
                    </div>

                    {currentFilters.isNotAnyOf && (
                      <Popover open={isExcludeDropdownOpen} onOpenChange={setIsExcludeDropdownOpen}>
                        <PopoverTrigger asChild>
                          <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                            {selectedExcludeCompanies.map((company) => (
                              <div
                                key={company}
                                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                              >
                                {company}
                                <X
                                  className="h-3 w-3 text-gray-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCompany("exclude", company);
                                  }}
                                />
                              </div>
                            ))}
                            {selectedExcludeCompanies.length === 0 && (
                              <span>Select companies to exclude...</span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search companies..."
                              value={searchExclude}
                              onValueChange={setSearchExclude}
                            />
                            <CommandList className="max-h-[160px] overflow-y-auto">
                              {filteredExcludeSuggestions.map((company) => (
                                <CommandItem
                                  key={company.domain}
                                  value={company.name}
                                  onSelect={() => handleCompanySelect("exclude", company.name)}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="w-6 h-6 flex-shrink-0">
                                    {company.logo ? (
                                      <Image
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        width={24}
                                        height={24}
                                      />
                                    ) : (
                                      <Building className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium dark:text-gray-200">{company.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{company.domain}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Include Past Company */}
                    <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        id="includePastCompany"
                        checked={currentFilters.includePastCompany}
                        onCheckedChange={(checked) => handleFilterChange("includePastCompany", checked as boolean)}
                      />
                      <Label htmlFor="includePastCompany" className="text-sm font-medium dark:text-gray-200">
                        Include past company
                      </Label>
                    </div>

                    {currentFilters.includePastCompany && (
                      <Popover open={isPastDropdownOpen} onOpenChange={setIsPastDropdownOpen}>
                        <PopoverTrigger asChild>
                          <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                            {selectedPastCompanies.map((company) => (
                              <div
                                key={company}
                                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                              >
                                {company}
                                <X
                                  className="h-3 w-3 text-gray-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCompany("past", company);
                                  }}
                                />
                              </div>
                            ))}
                            {selectedPastCompanies.length === 0 && (
                              <span>Select past companies...</span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search past companies..."
                              value={searchPast}
                              onValueChange={setSearchPast}
                            />
                            <CommandList className="max-h-[160px] overflow-y-auto">
                              {filteredPastSuggestions.map((company) => (
                                <CommandItem
                                  key={company.domain}
                                  value={company.name}
                                  onSelect={() => handleCompanySelect("past", company.name)}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="w-6 h-6 flex-shrink-0">
                                    {company.logo ? (
                                      <Image
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        width={24}
                                        height={24}
                                      />
                                    ) : (
                                      <Building className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium dark:text-gray-200">{company.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{company.domain}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Domain Exists */}
                    <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        id="domainExists"
                        checked={currentFilters.domainExists}
                        onCheckedChange={(checked) => handleFilterChange("domainExists", checked as boolean)}
                      />
                      <Label htmlFor="domainExists" className="text-sm font-medium dark:text-gray-200">
                        Domain exists
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Is Known */}
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors border-t dark:border-gray-700 pt-4">
                <RadioGroupItem value="isKnown" id="isKnown" />
                <Label htmlFor="isKnown" className="text-sm font-medium dark:text-gray-200">
                  Is known
                </Label>
              </div>

              {/* Is Unknown */}
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <RadioGroupItem value="isUnknown" id="isUnknown" />
                <Label htmlFor="isUnknown" className="text-sm font-medium dark:text-gray-200">
                  Is unknown
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Include/Exclude List */}
          <Collapsible
            open={isIncludeExcludeOpen}
            onOpenChange={setIsIncludeExcludeOpen}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold dark:text-gray-200">Include/Exclude List</h4>
              <CollapsibleTrigger className="group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                    isIncludeExcludeOpen && "transform rotate-180"
                  )}
                />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium dark:text-gray-200">Include list of companies</Label>
                <Textarea
                  placeholder="e.g. http://cisco.com, name@example.com, www.dell.com, salesforce.com"
                  className="min-h-[100px] text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  defaultValue={currentFilters.includeCompanies.join(", ")}
                  onChange={(e) => handleTextAreaChange("include", e.target.value)}
                />
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => handleSaveAndSearch("include")}
                >
                  Save and Search
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  I only have company names
                  <span className="cursor-help">ⓘ</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium dark:text-gray-200">Exclude list of companies</Label>
                <Textarea
                  placeholder="e.g. http://cisco.com, name@example.com, www.dell.com, salesforce.com"
                  className="min-h-[100px] text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  defaultValue={currentFilters.excludeCompanies.join(", ")}
                  onChange={(e) => handleTextAreaChange("exclude", e.target.value)}
                />
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => handleSaveAndSearch("exclude")}
                >
                  Save and Search
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  I only have company names
                  <span className="cursor-help">ⓘ</span>
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CompanyFilter;