import filterOptions from "@/app/config/filterOptions"
import React from "react"
import UsersInfo from "@/app/components/dashboard/usersInfo"
import { FilterOption } from "@/app/types/filterOptions"
import FilterResults from "@/app/components/filters/filterResults";
import { getUser } from "@/app/actions";
interface PageProps {
  params: Promise<{ category: string, filter: string }>;
}

const page = async ({params}:PageProps) => {
  const user = await getUser()
  const {category, filter} = await params
  const filterComponent = filterOptions.find((option: FilterOption) => (option.filterCategory === category && option.filterName === filter))?.filterComponent
  const DynamicFilter = filterComponent as React.ComponentType;

  return (
    <div className="min-h-screen max-h-[200rem] flex flex-col">
      {/* Top section with user info */}
      <div className="flex-shrink-0 mx-4 mb-4">
        <UsersInfo />
      </div>
      
      {/* Main content area with filters and results side by side */}
      <div className="flex-1 flex gap-4 mx-4 min-h-0 overflow-hidden">
        {/* Filter section - fixed width */}
        <div className="flex-shrink-0">
          {filterComponent && <DynamicFilter />}  
        </div>
        
        {/* Results section - flexible width with horizontal scroll */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <FilterResults isUserPremium={user?.subscription?true:false} user={user}/>
        </div>
      </div>
    </div>
  )
}

export default page