import EmailStatusFilter from "@/app/components/filters/email-status-filter"
import { FilterOptions } from "@/app/types/filterOptions"
import JobTitleFilter from "../components/filters/JobTitleFilter"
import CompanyFilter from "../components/filters/company-filter"
import EmployeeFilter from "../components/filters/employee-filter"
import IndustryKeywordFilter from "../components/filters/industry-keyword-filter"
import LocationFilter from "../components/filters/location-filter"
import AccountLocationFilter from "../components/filters/AccountLocationFilter"

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
      {
        filterCategory: "people",
        filterName: "industry",
        filterComponent: IndustryKeywordFilter,
      },
      {
        filterCategory: "people",
        filterName: "location",
        filterComponent: LocationFilter,
      },
      {
        filterCategory: "companies",
        filterName: "company",
        filterComponent: CompanyFilter,
      },
      {
        filterCategory: "companies",
        filterName: "account-location",
        filterComponent: AccountLocationFilter,
      },
      {
        filterCategory: "companies",
        filterName: "employees",
        filterComponent: EmployeeFilter,
      },
      {
        filterCategory: "companies",
        filterName: "industry",
        filterComponent: IndustryKeywordFilter,
      },
      
]

export default filterOptions