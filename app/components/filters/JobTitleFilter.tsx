"use client";

import React from "react";
import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, User2, Info, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const JobTitleFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [departmentSearchValue, setDepartmentSearchValue] = useState("");
  const [managementLevelOpen, setManagementLevelOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  // Job title filter states
  const [personTitles, setPersonTitles] = useState<string[]>([]);
  const [personNotTitles, setPersonNotTitles] = useState<string[]>([]);
  const [personTitlesPast, setPersonTitlesPast] = useState<string[]>([]);
  const [personNotTitlesPast, setPersonNotTitlesPast] = useState<string[]>([]);
  const [isPersonTitlesDropdownOpen, setIsPersonTitlesDropdownOpen] = useState(false);
  const [isPersonNotTitlesDropdownOpen, setIsPersonNotTitlesDropdownOpen] = useState(false);
  const [isPersonTitlesPastDropdownOpen, setIsPersonTitlesPastDropdownOpen] = useState(false);
  const [isPersonNotTitlesPastDropdownOpen, setIsPersonNotTitlesPastDropdownOpen] = useState(false);
  const [jobTitleFilterType, setJobTitleFilterType] = useState<"isAny" | "isNotAny" | "both">(
    "isAny"
  );
  const [includePastIsAny, setIncludePastIsAny] = useState(false);
  const [includePastIsNotAny, setIncludePastIsNotAny] = useState(false);

  // Sample data
  const allOptions = ["manager", "student", "developer", "designer", "intern"];
  const managementLevels = [
    { label: "Owner", count: 0 },
    { label: "Founder", count: 0 },
    { label: "C suite", count: 0 },
    { label: "Partner", count: 0 },
    { label: "Vp", count: 0 },
    { label: "Head", count: 0 },
    { label: "Director", count: 0 },
    { label: "Manager", count: 0 },
    { label: "Senior", count: 0 },
  ];
  const departments = [
    { label: "C-Suite", count: 0 },
    { label: "Product", count: 0 },
    { label: "Engineering & Technical", count: 0 },
    { label: "Design", count: 0 },
    { label: "Education", count: 0 },
    { label: "Finance", count: 0 },
    { label: "Human Resources", count: 0 },
    { label: "Information Technology", count: 0 },
    { label: "Legal", count: 0 },
    { label: "Marketing", count: 0 },
    { label: "Medical & Health", count: 0 },
    { label: "Operations", count: 0 },
  ];

  // URL manipulation function
  const createQueryString = (params: Record<string, string | boolean | string[]>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
        // Do nothing, as delete was already called
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          newSearchParams.append(key, encodeURIComponent(item));
        });
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    let queryString = newSearchParams.toString();
    queryString = queryString.replace(/%5B%5D/g, "[]");
    return queryString;
  };

  // Current filters from URL
  const currentFilters = {
    personTitles: searchParams.getAll("personTitles[]") || [],
    personNotTitles: searchParams.getAll("personNotTitles[]") || [],
    personTitlesPast: searchParams.getAll("personTitlesPast[]") || [],
    personNotTitlesPast: searchParams.getAll("personNotTitlesPast[]") || [],
    knownStatus: searchParams.get("knownStatus") || "",
    existFields: searchParams.getAll("existFields[]") || [],
    notExistFields: searchParams.getAll("notExistFields[]") || [],
    personSeniorities: searchParams.getAll("personSeniorities[]") || [],
    personDepartmentOrSubdepartments:
      searchParams.getAll("personDepartmentOrSubdepartments[]") || [],
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | boolean | string[]) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // Handle management level changes
  const handleManagementLevelChange = (level: string) => {
    const isCurrentlyChecked = currentFilters.personSeniorities.includes(level);
    const newLevels = isCurrentlyChecked
      ? currentFilters.personSeniorities.filter((l) => l !== level)
      : [...currentFilters.personSeniorities, level];
    handleFilterChange("personSeniorities[]", newLevels);
  };

  // Handle department changes
  const handleDepartmentChange = (department: string) => {
    const isCurrentlyChecked = currentFilters.personDepartmentOrSubdepartments.includes(department);
    const newDepartments = isCurrentlyChecked
      ? currentFilters.personDepartmentOrSubdepartments.filter((d) => d !== department)
      : [...currentFilters.personDepartmentOrSubdepartments, department];
    handleFilterChange("personDepartmentOrSubdepartments[]", newDepartments);
  };

  // Handle job title type change
  const handleIsNotAnyChange = (checked: boolean) => {
    if (checked) {
      setJobTitleFilterType(
        personTitles.length > 0 || personTitlesPast.length > 0 ? "both" : "isNotAny"
      );
    } else {
      setJobTitleFilterType("isAny");
      handleFilterChange("personNotTitles[]", []);
      handleFilterChange("personNotTitlesPast[]", []);
      setPersonNotTitles([]);
      setPersonNotTitlesPast([]);
      setIncludePastIsNotAny(false);
    }
  };

  const handleIsAnyChange = () => {
    setJobTitleFilterType(
      personNotTitles.length > 0 || personNotTitlesPast.length > 0 ? "both" : "isAny"
    );
  };

  // Dropdown toggle functions
  const toggleOption = (
    option: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const removeOption = (
    option: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    filterKey: string
  ) => {
    const newSelected = (
      filterKey === "personTitles[]"
        ? personTitles
        : filterKey === "personNotTitles[]"
        ? personNotTitles
        : filterKey === "personTitlesPast[]"
        ? personTitlesPast
        : personNotTitlesPast
    ).filter((item) => item !== option);
    setSelected(newSelected);
    handleFilterChange(filterKey, newSelected);
    if (
      filterKey === "personNotTitles[]" &&
      newSelected.length === 0 &&
      personNotTitlesPast.length === 0
    ) {
      setJobTitleFilterType("isAny");
    } else if (
      filterKey === "personNotTitlesPast[]" &&
      newSelected.length === 0 &&
      personNotTitles.length === 0
    ) {
      setJobTitleFilterType("isAny");
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.label.toLowerCase().includes(departmentSearchValue.toLowerCase())
  );

  return (
    <div className="w-[280px] bg-white dark:bg-background p-4 rounded-lg border dark:border-gray-800 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-base text-center font-semibold bg-primary dark:bg-primary/70 text-black dark:text-white p-2 rounded-md shadow-sm flex-1">
            Job Titles
          </h4>
        </div>

        <CollapsibleContent>
          <div className="space-y-2">
            {/* Is Any Of */}
            <div>
              <div className="rounded p-4 w-full">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    checked={jobTitleFilterType === "isAny" || jobTitleFilterType === "both"}
                    onChange={handleIsAnyChange}
                  />
                  <label className="font-medium text-sm">Is any of</label>
                </div>
                <div className="relative">
                  <div
                    className="flex flex-wrap gap-1 p-2 border rounded min-h-[40px] cursor-pointer"
                    onClick={() => setIsPersonTitlesDropdownOpen(!isPersonTitlesDropdownOpen)}
                  >
                    {personTitles.map((option) => (
                      <span
                        key={option}
                        className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                      >
                        {option}
                        <X
                          size={12}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOption(option, setPersonTitles, "personTitles[]");
                          }}
                        />
                      </span>
                    ))}
                    <ChevronDown className="ml-auto" size={16} />
                  </div>
                  {isPersonTitlesDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow rounded mt-1 z-10 max-h-40 overflow-y-auto">
                      {allOptions.map((option) => (
                        <div
                          key={option}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            toggleOption(option, setPersonTitles);
                            handleFilterChange(
                              "personTitles[]",
                              personTitles.includes(option)
                                ? personTitles.filter((item) => item !== option)
                                : [...personTitles, option]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={personTitles.includes(option)}
                            readOnly
                            className="mr-2"
                          />
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Include Past Job Titles for Is Any Of */}
                <div className="flex items-center gap-1 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="includePastIsAny"
                    checked={includePastIsAny}
                    onCheckedChange={(checked) => {
                      setIncludePastIsAny(checked === true);
                      if (checked !== true) {
                        handleFilterChange("personTitlesPast[]", []);
                        setPersonTitlesPast([]);
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="includePastIsAny"
                      className="text-sm font-medium dark:text-gray-200"
                    >
                      Include past job titles
                    </Label>
                    <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-help" />
                  </div>
                </div>
                {includePastIsAny && (
                  <div className="relative mt-2">
                    <div
                      className="flex flex-wrap gap-1 p-2 border rounded min-h-[40px] cursor-pointer"
                      onClick={() =>
                        setIsPersonTitlesPastDropdownOpen(!isPersonTitlesPastDropdownOpen)
                      }
                    >
                      {personTitlesPast.map((option) => (
                        <span
                          key={option}
                          className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                        >
                          {option}
                          <X
                            size={12}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOption(option, setPersonTitlesPast, "personTitlesPast[]");
                            }}
                          />
                        </span>
                      ))}
                      <ChevronDown className="ml-auto" size={16} />
                    </div>
                    {isPersonTitlesPastDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white shadow rounded mt-1 z-10 max-h-40 overflow-y-auto">
                        {allOptions.map((option) => (
                          <div
                            key={option}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              toggleOption(option, setPersonTitlesPast);
                              handleFilterChange(
                                "personTitlesPast[]",
                                personTitlesPast.includes(option)
                                  ? personTitlesPast.filter((item) => item !== option)
                                  : [...personTitlesPast, option]
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={personTitlesPast.includes(option)}
                              readOnly
                              className="mr-2"
                            />
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Is Not Any Of */}
            <div className="-mt-8">
              <div className="rounded p-4 w-full">
                <div className="flex gap-2">
                  <Checkbox
                    id="isNotAny"
                    checked={jobTitleFilterType === "isNotAny" || jobTitleFilterType === "both"}
                    onCheckedChange={(checked) => handleIsNotAnyChange(checked === true)}
                  />
                  <Label htmlFor="isNotAny" className="font-medium text-sm">
                    Is not any of
                  </Label>
                </div>
                {(jobTitleFilterType === "isNotAny" || jobTitleFilterType === "both") && (
                  <>
                    <div className="relative">
                      <div
                        className="flex flex-wrap gap-1 p-2 border rounded min-h-[40px] cursor-pointer"
                        onClick={() =>
                          setIsPersonNotTitlesDropdownOpen(!isPersonNotTitlesDropdownOpen)
                        }
                      >
                        {personNotTitles.map((option) => (
                          <span
                            key={option}
                            className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                          >
                            {option}
                            <X
                              size={12}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOption(option, setPersonNotTitles, "personNotTitles[]");
                              }}
                            />
                          </span>
                        ))}
                        <ChevronDown className="ml-auto" size={16} />
                      </div>
                      {isPersonNotTitlesDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white shadow rounded mt-1 z-10 max-h-40 overflow-y-auto">
                          {allOptions.map((option) => (
                            <div
                              key={option}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                toggleOption(option, setPersonNotTitles);
                                handleFilterChange(
                                  "personNotTitles[]",
                                  personNotTitles.includes(option)
                                    ? personNotTitles.filter((item) => item !== option)
                                    : [...personNotTitles, option]
                                );
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={personNotTitles.includes(option)}
                                readOnly
                                className="mr-2"
                              />
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Include Past Job Titles for Is Not Any Of */}
                    <div className="flex items-center gap-1 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <Checkbox
                        id="includePastIsNotAny"
                        checked={includePastIsNotAny}
                        onCheckedChange={(checked) => {
                          setIncludePastIsNotAny(checked === true);
                          if (checked !== true) {
                            handleFilterChange("personNotTitlesPast[]", []);
                            setPersonNotTitlesPast([]);
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="includePastIsNotAny"
                          className="text-sm font-medium dark:text-gray-200"
                        >
                          Include past job titles
                        </Label>
                        <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-help" />
                      </div>
                    </div>
                    {includePastIsNotAny && (
                      <div className="relative mt-2">
                        <div
                          className="flex flex-wrap gap-1 p-2 border rounded min-h-[40px] cursor-pointer"
                          onClick={() =>
                            setIsPersonNotTitlesPastDropdownOpen(!isPersonNotTitlesPastDropdownOpen)
                          }
                        >
                          {personNotTitlesPast.map((option) => (
                            <span
                              key={option}
                              className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                            >
                              {option}
                              <X
                                size={12}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeOption(option, setPersonNotTitlesPast, "personNotTitlesPast[]");
                                }}
                              />
                            </span>
                          ))}
                          <ChevronDown className="ml-auto" size={16} />
                        </div>
                        {isPersonNotTitlesPastDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 bg-white shadow rounded mt-1 z-10 max-h-40 overflow-y-auto">
                            {allOptions.map((option) => (
                              <div
                                key={option}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  toggleOption(option, setPersonNotTitlesPast);
                                  handleFilterChange(
                                    "personNotTitlesPast[]",
                                    personNotTitlesPast.includes(option)
                                      ? personNotTitlesPast.filter((item) => item !== option)
                                      : [...personNotTitlesPast, option]
                                  );
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={personNotTitlesPast.includes(option)}
                                  readOnly
                                  className="mr-2"
                                />
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Known Status */}
            <div className="border-t dark:border-gray-700 pt-1">
              <RadioGroup
                value={
                  currentFilters.existFields.includes("person_title_normalized")
                    ? "known"
                    : currentFilters.notExistFields.includes("person_title_normalized")
                    ? "unknown"
                    : ""
                }
                onValueChange={(value) => {
                  if (value === "known") {
                    const newParams = {
                      "existFields[]": ["person_title_normalized"],
                      "notExistFields[]": [],
                    };
                    const queryString = createQueryString(newParams);
                    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
                  } else if (value === "unknown") {
                    const newParams = {
                      "notExistFields[]": ["person_title_normalized"],
                      "existFields[]": [],
                    };
                    const queryString = createQueryString(newParams);
                    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
                  }
                }}
              >
                <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem value="known" id="known" />
                  <Label htmlFor="known" className="text-sm font-medium dark:text-gray-200">
                    Is known
                  </Label>
                </div>
                <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown" className="text-sm font-medium dark:text-gray-200">
                    Is unknown
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Management Level */}
            <Collapsible
              open={managementLevelOpen}
              onOpenChange={setManagementLevelOpen}
              className="pt-2 border-t border-gray-200 dark:border-gray-700 pl-2"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold dark:text-gray-200">Management Level</h4>
                <CollapsibleTrigger className="group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                      managementLevelOpen && "transform rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                {managementLevels.map((level) => (
                  <div
                    key={level.label}
                    className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                  >
                    <Checkbox
                      id={`level-${level.label}`}
                      checked={currentFilters.personSeniorities.includes(level.label)}
                      onCheckedChange={() => handleManagementLevelChange(level.label)}
                    />
                    <Label
                      htmlFor={`level-${level.label}`}
                      className="flex-1 text-sm font-medium dark:text-gray-200"
                    >
                      {level.label}
                    </Label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({level.count})</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Departments */}
            <Collapsible
              open={departmentsOpen}
              onOpenChange={setDepartmentsOpen}
              className="pt-2 pl-2 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold dark:text-gray-200">Departments</h4>
                <CollapsibleTrigger className="group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                      departmentsOpen && "transform rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-1">
                <Input
                  placeholder="Search departments"
                  value={departmentSearchValue}
                  onChange={(e) => setDepartmentSearchValue(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredDepartments.map((dept) => (
                    <div
                      key={dept.label}
                      className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                    >
                      <Checkbox
                        id={`dept-${dept.label}`}
                        checked={currentFilters.personDepartmentOrSubdepartments.includes(
                          dept.label
                        )}
                        onCheckedChange={() => handleDepartmentChange(dept.label)}
                      />
                      <Label
                        htmlFor={`dept-${dept.label}`}
                        className="flex-1 text-sm font-medium dark:text-gray-200"
                      >
                        {dept.label}
                      </Label>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Create Persona Button */}
            <Button
              variant="outline"
              className="w-full mt-4 flex items-center justify-center gap-2 text-sm border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <User2 className="h-4 w-4" />
              Create New Persona
            </Button>

            <div className="text-center">
              <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                What&apos;s a Persona?
              </a>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobTitleFilter;