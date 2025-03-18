"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, User2, Info, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const JobTitleFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [jobTitleSearchValue, setJobTitleSearchValue] = useState("");
  const [excludeTitleSearchValue, setExcludeTitleSearchValue] = useState("");
  const [pastJobTitleSearchValue, setPastJobTitleSearchValue] = useState("");
  const [departmentSearchValue, setDepartmentSearchValue] = useState("");
  const [jobTitleDropdownOpen, setJobTitleDropdownOpen] = useState(false);
  const [excludeTitleDropdownOpen, setExcludeTitleDropdownOpen] = useState(false);
  const [pastJobTitleDropdownOpen, setPastJobTitleDropdownOpen] = useState(false);
  const [managementLevelOpen, setManagementLevelOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  // Sample job titles for the dropdown
  const jobTitles = ["manager", "project manager", "teacher", "owner", "student", "director"];

  // Sample management levels with counts
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

  // Sample departments with counts
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

  // Create URLSearchParams object for manipulation
  const createQueryString = (params: Record<string, string | boolean | string[]>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
  
    Object.entries(params).forEach(([key, value]) => {
      if (value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
        newSearchParams.delete(key);
      } else {
        if (Array.isArray(value)) {
          newSearchParams.set(key, value.join(","));
        } else {
          newSearchParams.set(key, String(value));
        }
      }
    });
  
    return newSearchParams.toString();
  };
  
  // Get current filter values from URL
  const currentFilters = {
    jobTitleType: searchParams.get("jobTitleType") || "isAnyOf",
    jobTitle: searchParams.get("jobTitle") || "",
    excludeJobTitle: searchParams.get("excludeJobTitle") || "",
    includePastJobTitles: searchParams.get("includePastJobTitles") === "true",
    pastJobTitle: searchParams.get("pastJobTitle") || "",
    knownStatus: searchParams.get("knownStatus") || "",
    managementLevels: searchParams.get("managementLevels")?.split(",") || [],
    departments: searchParams.get("departments")?.split(",") || [],
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.jobTitle) count++;
    if (currentFilters.excludeJobTitle) count++;
    if (currentFilters.pastJobTitle) count++;
    if (currentFilters.knownStatus) count++;
    if (currentFilters.managementLevels.length > 0) count++;
    if (currentFilters.departments.length > 0) count++;
    return count;
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | boolean | string[]) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  // Handle management level checkbox changes
  const handleManagementLevelChange = (level: string, checked: boolean) => {
    let newLevels = [...currentFilters.managementLevels];

    if (checked) {
      if (!newLevels.includes(level)) {
        newLevels.push(level);
      }
    } else {
      newLevels = newLevels.filter((l) => l !== level);
    }

    handleFilterChange("managementLevels", newLevels);
  };

  // Handle department checkbox changes
  const handleDepartmentChange = (department: string, checked: boolean) => {
    let newDepartments = [...currentFilters.departments];

    if (checked) {
      if (!newDepartments.includes(department)) {
        newDepartments.push(department);
      }
    } else {
      newDepartments = newDepartments.filter((d) => d !== department);
    }

    handleFilterChange("departments", newDepartments);
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  const filteredJobTitles = jobTitles.filter((title) =>
    title.toLowerCase().includes(jobTitleSearchValue.toLowerCase()),
  );

  const filteredDepartments = departments.filter((dept) =>
    dept.label.toLowerCase().includes(departmentSearchValue.toLowerCase()),
  );

  return (
    <div className="w-[350px] bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Job Titles</h4>
          </div>
          <div className="flex items-center gap-3">
            {getActiveFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs rounded-full border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={clearAllFilters}
              >
                <X className="h-3 w-3 mr-2" />
                {getActiveFilterCount()}
              </Button>
            )}
            <CollapsibleTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300",
                  isOpen && "transform rotate-180",
                )}
              />
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 shadow-sm">
            <RadioGroup
              defaultValue={currentFilters.jobTitleType}
              onValueChange={(value) => handleFilterChange("jobTitleType", value)}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="isAnyOf" id="isAnyOf" className="text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="isAnyOf" className="font-medium text-gray-900 dark:text-gray-100">
                    Is any of
                  </Label>
                </div>

                <Popover open={jobTitleDropdownOpen} onOpenChange={setJobTitleDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md"
                    >
                      {currentFilters.jobTitle || "Search for a job title"}
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <Input
                        type="text"
                        placeholder="Search for a job title"
                        className="w-full p-2 text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={jobTitleSearchValue}
                        onChange={(e) => setJobTitleSearchValue(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredJobTitles.map((title) => (
                        <div
                          key={title}
                          className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100"
                          onClick={() => {
                            handleFilterChange("jobTitle", title);
                            setJobTitleDropdownOpen(false);
                          }}
                        >
                          {title}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="isNotAnyOf" id="isNotAnyOf" className="text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="isNotAnyOf" className="font-medium text-gray-900 dark:text-gray-100">
                    Is not any of
                  </Label>
                </div>

                {currentFilters.jobTitleType === "isNotAnyOf" && (
                  <Popover open={excludeTitleDropdownOpen} onOpenChange={setExcludeTitleDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md"
                      >
                        {currentFilters.excludeJobTitle || "Enter titles to exclude"}
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <Input
                          type="text"
                          placeholder="Enter titles to exclude"
                          className="w-full p-2 text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          value={excludeTitleSearchValue}
                          onChange={(e) => setExcludeTitleSearchValue(e.target.value)}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredJobTitles.map((title) => (
                          <div
                            key={title}
                            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100"
                            onClick={() => {
                              handleFilterChange("excludeJobTitle", title);
                              setExcludeTitleDropdownOpen(false);
                            }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="flex items-center space-x-3 ">
                <Checkbox
                  id="includePastJobTitles"
                  checked={currentFilters.includePastJobTitles}
                  onCheckedChange={(checked) => handleFilterChange("includePastJobTitles", checked as boolean)}
                  className="text-blue-600 dark:text-blue-400"
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="includePastJobTitles" className="text-sm text-gray-900 dark:text-gray-100">
                    Include past job titles
                  </Label>
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-help" />
                </div>
              </div>

              {currentFilters.includePastJobTitles && (
                <div className="">
                  <Popover open={pastJobTitleDropdownOpen} onOpenChange={setPastJobTitleDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md"
                      >
                        {currentFilters.pastJobTitle || "Search for a past job title"}
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <Input
                          type="text"
                          placeholder="Search for a past job title"
                          className="w-full p-2 text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          value={pastJobTitleSearchValue}
                          onChange={(e) => setPastJobTitleSearchValue(e.target.value)}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredJobTitles.map((title) => (
                          <div
                            key={title}
                            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100"
                            onClick={() => {
                              handleFilterChange("pastJobTitle", title);
                              setPastJobTitleDropdownOpen(false);
                            }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </RadioGroup>
          </div>

          <RadioGroup
            defaultValue={currentFilters.knownStatus}
            onValueChange={(value) => handleFilterChange("knownStatus", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <RadioGroupItem value="known" id="known" className="text-blue-600 dark:text-blue-400" />
              <Label htmlFor="known" className="font-medium text-gray-900 dark:text-gray-100">
                Is known
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <RadioGroupItem value="unknown" id="unknown" className="text-blue-600 dark:text-blue-400" />
              <Label htmlFor="unknown" className="font-medium text-gray-900 dark:text-gray-100">
                Is unknown
              </Label>
            </div>
          </RadioGroup>

          <Collapsible
            open={managementLevelOpen}
            onOpenChange={setManagementLevelOpen}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Management Level</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300",
                  managementLevelOpen && "transform rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-4 space-y-3">
                {managementLevels.map((level) => (
                  <div key={level.label} className="flex items-center space-x-3">
                    <Checkbox
                      id={`level-${level.label}`}
                      checked={currentFilters.managementLevels.includes(level.label)}
                      onCheckedChange={(checked) => handleManagementLevelChange(level.label, checked as boolean)}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <Label htmlFor={`level-${level.label}`} className="flex-1 text-gray-900 dark:text-gray-100">
                      {level.label}
                    </Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({level.count})</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={departmentsOpen}
            onOpenChange={setDepartmentsOpen}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Departments & Job Function</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300",
                  departmentsOpen && "transform rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-4 space-y-4">
                <Input
                  placeholder="Search departments"
                  value={departmentSearchValue}
                  onChange={(e) => setDepartmentSearchValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`dept-${dept.label}`}
                          checked={currentFilters.departments.includes(dept.label)}
                          onCheckedChange={(checked) => handleDepartmentChange(dept.label, checked as boolean)}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        <Label htmlFor={`dept-${dept.label}`} className="text-gray-900 dark:text-gray-100">
                          {dept.label}
                        </Label>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-md transition-colors"
          >
            <User2 className="h-5 w-5" />
            Create New Persona
          </Button>

          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              What&apos;s a Persona?
            </a>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobTitleFilter;
