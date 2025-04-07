import filterOptions from "@/app/config/filterOptions"
import React from "react"
import UsersInfo from "@/app/components/dashboard/usersInfo"
import { FilterOption } from "@/app/types/filterOptions"
import { Button } from "@/components/ui/button";
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
    <div>
      <div className="flex-1 flex flex-col gap-4 mx-4">
        <UsersInfo />
      </div>
      <div className="flex-1 flex flex-wrap gap-4 mx-4">
        {filterComponent && <DynamicFilter />}  
        <div className="flex-1 flex flex-col gap-4 mx-4"> 
          <FilterResults isUserPremium={!user?.subscription?true:false} />
        </div>
      </div>
        
    </div>
  )
}

export default page