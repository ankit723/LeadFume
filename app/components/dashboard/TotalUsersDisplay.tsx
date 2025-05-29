'use client'

import React, { useState, useEffect } from 'react'
import { CircleUserIcon } from 'lucide-react'

const TotalUsersDisplay = () => {
  const [totalUsers, setTotalUsers] = useState(Math.floor(Math.random() * 100) + 4700);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUsers(prevUsers => prevUsers + Math.floor(Math.random() * 3) + 1);
    }, 2000); // Update every 2 seconds, adjust as needed

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4 relative overflow-hidden">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total User</span>
        <span className="text-2xl font-bold">{totalUsers.toLocaleString()}</span>
        <span className="text-xs text-green-600 mt-1">
          <span className="text-green-500">↑ 8.5%</span> Up from yesterday
        </span>
      </div>
      <div className="absolute right-4 top-4">
        <CircleUserIcon className="h-6 w-6 text-yellow-500" />
      </div>
    </div>
  );
}

export default TotalUsersDisplay; 