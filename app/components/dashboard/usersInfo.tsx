import React from 'react'
import { getUser } from '@/app/actions'
import TotalUsersDisplay from './TotalUsersDisplay'

const UsersInfo = async () => {
  const user = await getUser()
  const subscriptionType = user?.subscription?.subscriptionType.name
  const totalCredits = user?.subscription?.subscriptionType.credits ?? 0
  const availableCredits = user?.creditsAvailable ?? 0
  const creditsUsed = totalCredits - availableCredits;
  
  return (
    <div className="space-y-8 w-full my-4">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TotalUsersDisplay />
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Credit Usage</h2>
          {subscriptionType && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Subscription: {subscriptionType}</p>}
          
          <div className="mb-3">
            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <span>Credits Used: {creditsUsed.toLocaleString()}</span>
              <span>Remaining: {availableCredits.toLocaleString()} / {totalCredits.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: totalCredits > 0 ? `${(creditsUsed / totalCredits) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">Total Credits: {totalCredits.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default UsersInfo