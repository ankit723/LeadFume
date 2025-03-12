import filterOptions from "@/app/config/filterOptions"
import React from "react"

interface PageProps {
  params: Promise<{ category: string, filter: string }>;
}

const page = async ({params}:PageProps) => {
  const {category, filter} = await params
  const filterComponent = filterOptions.find((option:any) => (option.filterCategory === category && option.filterName === filter))?.filterComponent
  const DynamicFilter = filterComponent as React.ComponentType;
  return (
    <div className="flex">
        {filterComponent && <DynamicFilter />}  
      <div className="flex-1 flex flex-col gap-4 mx-4">
        <h1 className="text-2xl font-bold">Filter Results</h1>

      </div>
        
    </div>
  )
}

export default page