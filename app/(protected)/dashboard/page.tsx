import React from 'react'
import { SearchIcon } from 'lucide-react'
const Dashboard = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='flex flex-col gap-4 items-center'>
        <SearchIcon className='h-10 w-10 text-muted-foreground' />
        <p className='text-sm text-muted-foreground'>Select the Category and Start you Journey</p>
      </div>
    </div>
  )
}

export default Dashboard