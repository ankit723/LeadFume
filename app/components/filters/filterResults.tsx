'use client'
import { Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const ConfirmRequestModal = ({setIsModalOpen}:{setIsModalOpen: (isModalOpen: boolean) => void}) => {

    const handleRequest = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="w-96 bg-white rounded-lg p-4 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Are you sure you want to place this request?</h1>
                <p className="text-sm text-gray-500">Your credits will be deducted from your account for this request!</p>

                <div className="grid grid-cols-2 gap-4 justify-center items-center">
                    <Button variant="destructive" onClick={() => setIsModalOpen(false)}>
                        <p>No</p>
                    </Button>
                    <Button variant="default" onClick={() => handleRequest()}>
                        <p>Yes</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const FilterResults = ({isUserPremium}:{isUserPremium:boolean}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    if(isUserPremium){
        return (
            <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                {isModalOpen && <ConfirmRequestModal setIsModalOpen={setIsModalOpen} />}
                <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                    <h1 className="text-2xl font-bold">Make sure you select correct filters to get the best results !</h1> 
                    <p className="text-sm text-gray-500">
                        You filter request will be processed within 6 hours to ensure the highest quality data !
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Place Request
                    </Button>
                </div>
            </div>
        )
    }else{
        return (
            <div>
                <h1 className="text-2xl font-bold">Filter Results</h1>
            </div>
        )
    }
}

export default FilterResults