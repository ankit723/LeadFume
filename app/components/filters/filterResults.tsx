'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import { Request, RequestStatus, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { addRequest } from '@/app/actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

const ConfirmRequestModal = ({setIsModalOpen, user}:{setIsModalOpen: (isModalOpen: boolean) => void, user: User}) => {
    //get the dynamic search params from the url 
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const [name, setName] = useState('')
    const allParams = Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
        if (acc[key]) {
          if (Array.isArray(acc[key])) {
            acc[key].push(value);
          } else {
            acc[key] = [acc[key], value];
          }
        } else {
          acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | string[]>);
      
    
    const paramsString = Object.entries(allParams)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
        : [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
    )
    .join('&');
  
    
    const handleRequest = async () => {
        if(name === ''){
            toast.error('Please enter a name for your request!')
            return
        }
        const request:Request = {
            id: uuidv4(), // Generate a unique ID for the request
            userId: user?.id,
            name: name,
            status: RequestStatus.ORDERED,
            expectedDeliveryDate: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
            requestQueryParams: allParams,
            requestParameterisedURL:`app.apollo.io/#/${params.category}?page=1&sortAscending=false&sortByField=%5Bnone%5D&` + paramsString,
            createdAt: new Date(),
            updatedAt: new Date(),
            creditsNeeded: 100,
            assignedEmployeeId: null,
            completedEmployeeId: null,
        }
        
        const order = await addRequest(request)
        if(order){
            toast.success('Request placed successfully!')
            router.push('/settings/requests')
        }else{
            toast.error('Request failed! Please try again later.')
        }
        setIsModalOpen(false)
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="w-96 bg-white rounded-lg p-4 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Are you sure you want to place this request?</h1>
                <p className="text-sm text-gray-500">Your credits will be deducted from your account for this request!</p>
                <Input type="text" placeholder="Enter a name for your request" value={name} onChange={(e) => setName(e.target.value)} className='border-primary focus-visible:ring-0 focus-visible:ring-offset-0'/>
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

const FilterResults = ({isUserPremium, user}:{isUserPremium:boolean, user: User|null}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    if(isUserPremium){
        return (
            <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                {isModalOpen && user && <ConfirmRequestModal setIsModalOpen={setIsModalOpen} user={user} />}
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