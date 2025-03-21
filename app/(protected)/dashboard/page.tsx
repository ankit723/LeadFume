import React from 'react'
import { SearchIcon } from 'lucide-react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Leadfume",
  description: "Manage your leads and track your lead generation metrics in one place.",
  robots: {
    index: false,
    follow: false,
  }
};

const Dashboard = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='flex flex-col gap-4 items-center'>
        <SearchIcon className='h-10 w-10 text-muted-foreground' />
        <p className='text-sm text-muted-foreground'>Start your people search by applying any filters in the filter panel.</p>
      </div>
    </div>
  )
}

export default Dashboard