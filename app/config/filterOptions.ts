import EmailStatusFilter from "@/app/components/filters/email-status-filter"
import { FilterOptions } from "@/app/types/filterOptions"
import JobTitleFilter from "../components/filters/JobTitleFilter"
import CompanyFilter from "../components/filters/company-filter"
import EmployeeFilter from "../components/filters/employee-filter"

const filterOptions: FilterOptions = [
    {
        filterCategory: "people",
        filterName: "email-status",
        filterComponent: EmailStatusFilter,
    },
    {
        filterCategory: "people",
        filterName: "job-title",
        filterComponent: JobTitleFilter,
      },
      {
        filterCategory: "people",
        filterName: "company",
        filterComponent: CompanyFilter,
      },
      {
        filterCategory: "people",
        filterName: "employees",
        filterComponent: EmployeeFilter,
      },
]

export default filterOptions