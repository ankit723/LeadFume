"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, User2, Info,  Plus } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  // Sample data
  const jobTitles = ["manager", "project manager", "teacher", "owner", "student", "director"];
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
      if (value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });
    return newSearchParams.toString();
  };

  // Current filters from URL
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
  // const getActiveFilterCount = () => {
  //   let count = 0;
  //   if (currentFilters.jobTitle) count++;
  //   if (currentFilters.excludeJobTitle) count++;
  //   if (currentFilters.pastJobTitle) count++;
  //   if (currentFilters.knownStatus) count++;
  //   if (currentFilters.managementLevels.length > 0) count++;
  //   if (currentFilters.departments.length > 0) count++;
  //   return count;
  // };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | boolean | string[]) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  // Handle management level changes
  const handleManagementLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...currentFilters.managementLevels, level]
      : currentFilters.managementLevels.filter((l) => l !== level);
    handleFilterChange("managementLevels", newLevels);
  };

  // Handle department changes
  const handleDepartmentChange = (department: string, checked: boolean) => {
    const newDepartments = checked
      ? [...currentFilters.departments, department]
      : currentFilters.departments.filter((d) => d !== department);
    handleFilterChange("departments", newDepartments);
  };

  // Clear all filters
  // const clearAllFilters = () => {
  //   router.push(pathname);
  // };

  const filteredJobTitles = jobTitles.filter((title) =>
    title.toLowerCase().includes(jobTitleSearchValue.toLowerCase())
  );
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
          {/* <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 dark:text-gray-400"
                onClick={clearAllFilters}
              >
                <X className="h-3 w-3 mr-1" />
                {getActiveFilterCount()}
              </Button>
            )}
            <CollapsibleTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                  isOpen && "transform rotate-180"
                )}
              />
            </CollapsibleTrigger>
          </div> */}
        </div>

        <CollapsibleContent className="">
          {/* Job Title Type Section */}
          <div className="space-y-3">
            <RadioGroup
              defaultValue={currentFilters.jobTitleType}
              onValueChange={(value) => handleFilterChange("jobTitleType", value)}
            >
              {/* Is Any Of */}
              <div className="">
                <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem value="isAnyOf" id="isAnyOf" />
                  <Label htmlFor="isAnyOf" className="text-sm font-medium dark:text-gray-200">
                    Is any of
                  </Label>
                </div>
                <Popover open={jobTitleDropdownOpen} onOpenChange={setJobTitleDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[90%] justify-between text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 ml-3 text-gray-600 dark:text-gray-400"
                    >
                      {currentFilters.jobTitle || "Search for a job title"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[260px]">
                    <Input
                      placeholder="Search for a job title"
                      value={jobTitleSearchValue}
                      onChange={(e) => setJobTitleSearchValue(e.target.value)}
                      className=""
                    />
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredJobTitles.map((title) => (
                        <div
                          key={title}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
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

              {/* Is Not Any Of */}
              <div className="">
                <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <RadioGroupItem value="isNotAnyOf" id="isNotAnyOf" />
                  <Label htmlFor="isNotAnyOf" className="text-sm font-medium dark:text-gray-200">
                    Is not any of
                  </Label>
                </div>
                {currentFilters.jobTitleType === "isNotAnyOf" && (
                  <Popover open={excludeTitleDropdownOpen} onOpenChange={setExcludeTitleDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[90%] justify-between text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 ml-3 text-gray-600 dark:text-gray-400"
                      >
                        {currentFilters.excludeJobTitle || "Enter titles to exclude"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-1">
                      <Input
                        placeholder="Enter titles to exclude"
                        value={excludeTitleSearchValue}
                        onChange={(e) => setExcludeTitleSearchValue(e.target.value)}
                        className=""
                      />
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredJobTitles.map((title) => (
                          <div
                            key={title}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
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

              {/* Past Job Titles */}
              <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                <Checkbox
                  id="includePastJobTitles"
                  checked={currentFilters.includePastJobTitles}
                  onCheckedChange={(checked) => handleFilterChange("includePastJobTitles", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="includePastJobTitles" className="text-sm font-medium dark:text-gray-200">
                    Include past job titles
                  </Label>
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-help" />
                </div>
              </div>

              {currentFilters.includePastJobTitles && (
                <Popover open={pastJobTitleDropdownOpen} onOpenChange={setPastJobTitleDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[90%] justify-between text-xs bg-white ml-3 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {currentFilters.pastJobTitle || "Search for past job title"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[260px] ">
                    <Input
                      placeholder="Search for a past job title"
                      value={pastJobTitleSearchValue}
                      onChange={(e) => setPastJobTitleSearchValue(e.target.value)}
                      className=" "
                    />
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredJobTitles.map((title) => (
                        <div
                          key={title}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
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
              )}
            </RadioGroup>
          </div>

          {/* Known Status */}
          <div className=" border-t dark:border-gray-700 pt-1">
            <RadioGroup
              defaultValue={currentFilters.knownStatus}
              onValueChange={(value) => handleFilterChange("knownStatus", value)}
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
            className=" pt-2 border-t border-gray-200 dark:border-gray-700 pl-2"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm  font-semibold dark:text-gray-200">Management Level</h4>
              <CollapsibleTrigger className="group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                    managementLevelOpen && "transform rotate-180"
                  )}
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="">
              {managementLevels.map((level) => (
                <div
                  key={level.label}
                  className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    id={`level-${level.label}`}
                    checked={currentFilters.managementLevels.includes(level.label)}
                    onCheckedChange={(checked) => handleManagementLevelChange(level.label, checked as boolean)}
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
              <h4 className="text-sm font-semibold dark:text-gray-200 ">Departments</h4>
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
                      checked={currentFilters.departments.includes(dept.label)}
                      onCheckedChange={(checked) => handleDepartmentChange(dept.label, checked as boolean)}
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobTitleFilter;