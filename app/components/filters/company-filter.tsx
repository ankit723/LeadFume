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

// Company suggestions with IDs matching your requirements
const companySuggestions = [
  { name: "Amazon", domain: "amazon.com", logo: "/amazon-logo.png", id: "57c4ace7a6da9867ee5599e7" },
  { name: "Apple", domain: "apple.com", logo: "/apple-logo.png", id: "5f2a39cb77a7440112460cf5" },
  { name: "Accenture", domain: "accenture.com", logo: "/accenture-logo.png", id: "accenture-org-id" },
  { name: "Adecco", domain: "adecco.com", logo: "/adecco-logo.png", id: "adecco-org-id" },
  { name: "Deloitte", domain: "deloitte.com", logo: "/deloitte-logo.png", id: "deloitte-org-id" },
  { name: "Google", domain: "google.com", logo: "/google-logo.png", id: "google-org-id" },
  { name: "Microsoft", domain: "microsoft.com", logo: "/microsoft-logo.png", id: "ms-org-id" },
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

  // Local state to track checkbox status without adding to URL
  const [isNotAnyOf, setIsNotAnyOf] = useState(false);
  const [includePastCompany, setIncludePastCompany] = useState(false);

  // Parse query parameters without %5B%5D encoding
  const organizationIds = searchParams.getAll("organizationIds[]") || [];
  const notOrganizationIds = searchParams.getAll("notOrganizationIds[]") || [];
  const personPastOrganizationIds = searchParams.getAll("personPastOrganizationIds[]") || [];
  const existFields = searchParams.getAll("existFields[]") || [];
  const notExistFields = searchParams.getAll("notExistFields[]") || [];
  const qOrganizationSearchListId = searchParams.get("qOrganizationSearchListId") || "";
  const qNotOrganizationSearchListId = searchParams.get("qNotOrganizationSearchListId") || "";

  const currentFilters = useMemo(
    () => ({
      companyFilterType:
        existFields.includes("organization_id") ? "isKnown" :
        notExistFields.includes("organization_id") ? "isUnknown" : "isAnyOf",
      isNotAnyOf: notOrganizationIds.length > 0, // Infer from presence of notOrganizationIds[]
      includePastCompany: personPastOrganizationIds.length > 0, // Infer from presence of personPastOrganizationIds[]
      domainExists: existFields.includes("organization_domain"),
      organizationIds,
      notOrganizationIds,
      personPastOrganizationIds,
      qOrganizationSearchListId,
      qNotOrganizationSearchListId,
    }),
    [searchParams]
  );

  useEffect(() => {
    setSelectedIncludeCompanies(currentFilters.organizationIds);
    setSelectedExcludeCompanies(currentFilters.notOrganizationIds);
    setSelectedPastCompanies(currentFilters.personPastOrganizationIds);
    setIsNotAnyOf(currentFilters.isNotAnyOf);
    setIncludePastCompany(currentFilters.includePastCompany);
  }, [
    currentFilters.organizationIds,
    currentFilters.notOrganizationIds,
    currentFilters.personPastOrganizationIds,
  ]);

  const createQueryString = (params: Record<string, string | boolean | string[]>) => {
    const parts: string[] = [];
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        // Manually construct array parameters without encoding [] as %5B%5D
        value.forEach((val) => parts.push(`${key}[]=${val}`));
      } else if (value && !Array.isArray(value)) {
        parts.push(`${key}=${value}`);
      }
    });
    return parts.join("&");
  };

  const handleFilterChange = (updates: Record<string, string | boolean | string[]>) => {
    const queryString = createQueryString({
      "organizationIds": selectedIncludeCompanies,
      "notOrganizationIds": isNotAnyOf ? selectedExcludeCompanies : [],
      "personPastOrganizationIds": includePastCompany ? selectedPastCompanies : [],
      "existFields": currentFilters.domainExists ? ["organization_domain"] : [],
      "qOrganizationSearchListId": currentFilters.qOrganizationSearchListId,
      "qNotOrganizationSearchListId": currentFilters.qNotOrganizationSearchListId,
      ...updates,
    });
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleRadioChange = (value: string) => {
    const updates: Record<string, string | boolean | string[]> = { companyFilterType: value };
    if (value === "isKnown") {
      updates.existFields = ["organization_id"];
      updates.notExistFields = [];
      updates.organizationIds = [];
      updates.notOrganizationIds = [];
      updates.personPastOrganizationIds = [];
      setIsNotAnyOf(false);
      setIncludePastCompany(false);
      updates.qOrganizationSearchListId = "";
      updates.qNotOrganizationSearchListId = "";
    } else if (value === "isUnknown") {
      updates.notExistFields = ["organization_id"];
      updates.existFields = [];
      updates.organizationIds = [];
      updates.notOrganizationIds = [];
      updates.personPastOrganizationIds = [];
      setIsNotAnyOf(false);
      setIncludePastCompany(false);
      updates.qOrganizationSearchListId = "";
      updates.qNotOrganizationSearchListId = "";
    } else if (value === "isAnyOf") {
      updates.existFields = currentFilters.domainExists ? ["organization_domain"] : [];
      updates.notExistFields = [];
    }
    const queryString = createQueryString(updates);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleCompanySelect = (type: "include" | "exclude" | "past", companyId: string) => {
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

    const updated = selectedCompanies.includes(companyId)
      ? selectedCompanies.filter((c) => c !== companyId)
      : [...selectedCompanies, companyId];
    setFunction(updated);

    if (type === "include") {
      handleFilterChange({ "organizationIds": updated });
      setIsIncludeDropdownOpen(false);
    } else if (type === "exclude") {
      handleFilterChange({ "notOrganizationIds": updated });
      setIsExcludeDropdownOpen(false);
    } else if (type === "past") {
      handleFilterChange({ "personPastOrganizationIds": updated });
      setIsPastDropdownOpen(false);
    }
  };

  const handleRemoveCompany = (type: "include" | "exclude" | "past", companyId: string) => {
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
    const updated = selectedCompanies.filter((c) => c !== companyId);
    setFunction(updated);

    if (type === "include") {
      handleFilterChange({ "organizationIds": updated });
    } else if (type === "exclude") {
      handleFilterChange({ "notOrganizationIds": updated });
    } else if (type === "past") {
      handleFilterChange({ "personPastOrganizationIds": updated });
    }
  };

  const handleSaveAndSearch = (type: "include" | "exclude") => {
    if (type === "include") {
      handleFilterChange({ "qOrganizationSearchListId": "67f7a5c0c024a6000d38d658" });
    } else {
      handleFilterChange({ "qNotOrganizationSearchListId": "67f7a5f83467020019a3efb6" });
    }
  };

  const handleTextAreaChange = (type: "include" | "exclude", value: string) => {
    const companies = value.split(/[\s,]+/).filter(Boolean);
    const companyIds = companies.map((name) => {
      const company = companySuggestions.find((c) => c.name === name || c.domain === name);
      return company ? company.id : name;
    });
    if (type === "include") {
      setSelectedIncludeCompanies(companyIds);
    } else {
      setSelectedExcludeCompanies(companyIds);
    }
  };

  const filteredIncludeSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchInclude.toLowerCase())
  );
  const filteredExcludeSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchExclude.toLowerCase())
  );
  const filteredPastSuggestions = companySuggestions.filter((company) =>
    company.name.toLowerCase().includes(searchPast.toLowerCase())
  );

  const hidePastCompany = pathname === "/dashboard/companies/company";

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <Collapsible open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-base text-center font-semibold bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm flex-1">
            Company
          </h4>
        </div>

        <CollapsibleContent className="space-y-4">
          <div className="space-y-3">
            <RadioGroup
              value={currentFilters.companyFilterType}
              onValueChange={handleRadioChange}
            >
              <div className="">
                <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem className="cursor-pointer" value="isAnyOf" id="isAnyOf" />
                  <Label htmlFor="isAnyOf" className="text-sm font-medium dark:text-gray-200">
                    Is any of
                  </Label>
                </div>
                {currentFilters.companyFilterType === "isAnyOf" && (
                  <div className="">
                    <Popover open={isIncludeDropdownOpen} onOpenChange={setIsIncludeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                          {selectedIncludeCompanies.map((id) => {
                            const company = companySuggestions.find((c) => c.id === id);
                            return (
                              <div
                                key={id}
                                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                              >
                                {company ? company.name : id}
                                <X
                                  className="h-3 w-3 text-gray-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCompany("include", id);
                                  }}
                                />
                              </div>
                            );
                          })}
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
                                key={company.id}
                                value={company.name}
                                onSelect={() => handleCompanySelect("include", company.id)}
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

                    <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        className="cursor-pointer"
                        id="isNotAnyOf"
                        checked={isNotAnyOf}
                        onCheckedChange={(checked) => {
                          setIsNotAnyOf(checked as boolean);
                          if (!checked) setSelectedExcludeCompanies([]);
                          handleFilterChange({ "notOrganizationIds": checked ? selectedExcludeCompanies : [] });
                        }}
                      />
                      <Label htmlFor="isNotAnyOf" className="text-sm font-medium dark:text-gray-200">
                        Is not any of
                      </Label>
                    </div>

                    {isNotAnyOf && (
                      <Popover open={isExcludeDropdownOpen} onOpenChange={setIsExcludeDropdownOpen}>
                        <PopoverTrigger asChild>
                          <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                            {selectedExcludeCompanies.map((id) => {
                              const company = companySuggestions.find((c) => c.id === id);
                              return (
                                <div
                                  key={id}
                                  className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                                >
                                  {company ? company.name : id}
                                  <X
                                    className="h-3 w-3 text-gray-500 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveCompany("exclude", id);
                                    }}
                                  />
                                </div>
                              );
                            })}
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
                                  key={company.id}
                                  value={company.name}
                                  onSelect={() => handleCompanySelect("exclude", company.id)}
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

                    {!hidePastCompany && (
                      <>
                        <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                          <Checkbox
                            className="cursor-pointer"
                            id="includePastCompany"
                            checked={includePastCompany}
                            onCheckedChange={(checked) => {
                              setIncludePastCompany(checked as boolean);
                              if (!checked) setSelectedPastCompanies([]);
                              handleFilterChange({ "personPastOrganizationIds": checked ? selectedPastCompanies : [] });
                            }}
                          />
                          <Label htmlFor="includePastCompany" className="text-sm font-medium dark:text-gray-200">
                            Include past company
                          </Label>
                        </div>

                        {includePastCompany && (
                          <Popover open={isPastDropdownOpen} onOpenChange={setIsPastDropdownOpen}>
                            <PopoverTrigger asChild>
                              <div className="border rounded-md bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1 min-h-[40px] cursor-pointer border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                                {selectedPastCompanies.map((id) => {
                                  const company = companySuggestions.find((c) => c.id === id);
                                  return (
                                    <div
                                      key={id}
                                      className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center gap-1"
                                    >
                                      {company ? company.name : id}
                                      <X
                                        className="h-3 w-3 text-gray-500 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveCompany("past", id);
                                        }}
                                      />
                                    </div>
                                  );
                                })}
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
                                      key={company.id}
                                      value={company.name}
                                      onSelect={() => handleCompanySelect("past", company.id)}
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
                      </>
                    )}

                    <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        className="cursor-pointer"
                        id="domainExists"
                        checked={currentFilters.domainExists}
                        onCheckedChange={(checked) =>
                          handleFilterChange({ "existFields": checked ? ["organization_domain"] : [] })
                        }
                      />
                      <Label htmlFor="domainExists" className="text-sm font-medium dark:text-gray-200">
                        Domain exists
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center -mt-2 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors border-t dark:border-gray-700 pt-2">
                <RadioGroupItem value="isKnown" id="isKnown" />
                <Label htmlFor="isKnown" className="text-sm font-medium dark:text-gray-200">
                  Is known
                </Label>
              </div>

              <div className="flex -mt-2 items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <RadioGroupItem value="isUnknown" id="isUnknown" />
                <Label htmlFor="isUnknown" className="text-sm font-medium dark:text-gray-200">
                  Is unknown
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Collapsible
            open={isIncludeExcludeOpen}
            onOpenChange={setIsIncludeExcludeOpen}
            className="pt-2 border-t -mt-2 border-gray-200 dark:border-gray-700"
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
                  defaultValue={selectedIncludeCompanies
                    .map((id) => companySuggestions.find((c) => c.id === id)?.domain || id)
                    .join(", ")}
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
                  defaultValue={selectedExcludeCompanies
                    .map((id) => companySuggestions.find((c) => c.id === id)?.domain || id)
                    .join(", ")}
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