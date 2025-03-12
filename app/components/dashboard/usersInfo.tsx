import React from 'react'
import { CircleUserIcon } from 'lucide-react'
const UsersInfo = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4 relative overflow-hidden">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total User</span>
                                <span className="text-2xl font-bold">40,689</span>
                                <span className="text-xs text-green-600 mt-1">
                                    <span className="text-green-500">↑ 8.5%</span> Up from yesterday
                                </span>
                            </div>
                            <div className="absolute right-4 top-4">
                                <CircleUserIcon className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden border">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total New</span>
                                <span className="text-2xl font-bold">10293</span>
                                <span className="text-xs text-green-600 mt-1">
                                    <span className="text-green-500">↑ 1.3%</span> Up from past week
                                </span>
                            </div>
                            <div className="absolute right-4 top-4">
                                <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden border">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Spend</span>
                                <span className="text-2xl font-bold">89,000</span>
                                <span className="text-xs text-gray-500 mt-1">Past one year</span>
                            </div>
                            <div className="absolute right-4 top-4">
                                <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden border">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Customers</span>
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">34,249</span>
                                        <span className="text-sm text-primary">• New Customers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">1,420</span>
                                        <span className="text-sm text-muted-foreground">• Repeated</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-4 top-4">
                                <div className="relative h-8 w-8">
                                    <svg className="h-8 w-8 transform -rotate-90">
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15"
                                            cx="16"
                                            cy="16"
                                        />
                                        <circle
                                            className="text-yellow-500"
                                            strokeWidth="2"
                                            strokeDasharray={94}
                                            strokeDashoffset={94 * 0.4}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15"
                                            cx="16"
                                            cy="16"
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="text-xs font-medium">60%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
  )
}

export default UsersInfo