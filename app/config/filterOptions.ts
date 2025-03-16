import EmailStatusFilter from "@/app/components/filters/email-status-filter"
import { FilterOptions } from "@/app/types/filterOptions"

const filterOptions: FilterOptions = [
    {
        filterCategory: "people",
        filterName: "email-status",
        filterComponent: EmailStatusFilter,
    },
]

export default filterOptions