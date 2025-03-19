import EmailStatusFilter from "@/app/components/filters/email-status-filter"
import { FilterOptions } from "@/app/types/filterOptions"
import JobTitleFilter from "../components/filters/JobTitleFilter"
import CompanyFilter from "../components/filters/company-filter"

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
]

export default filterOptions