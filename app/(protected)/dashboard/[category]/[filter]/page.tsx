import filterOptions from "@/app/config/filterOptions"
import React from "react"
import UsersInfo from "@/app/components/dashboard/usersInfo"
interface PageProps {
  params: Promise<{ category: string, filter: string }>;
}

const page = async ({params}:PageProps) => {
  const {category, filter} = await params
  const filterComponent = filterOptions.find((option:any) => (option.filterCategory === category && option.filterName === filter))?.filterComponent
  const DynamicFilter = filterComponent as React.ComponentType;
  return (
    <div>
      <div className="flex-1 flex flex-col gap-4 mx-4">
        <UsersInfo />
      </div>
      <div className="flex-1 flex gap-4 mx-4">
        {filterComponent && <DynamicFilter />}  
        <div className="flex-1 flex flex-col gap-4 mx-4"> 
          <h1 className="text-2xl font-bold">Filter Results</h1>
        </div>
      </div>
        
    </div>
  )
}

export default page