"'use client"

import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import Image from "next/image"

const GetTouch = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* First section - Customer Support */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-20">
        {/* Dashboard Image */}
        <div className="w-full md:w-1/2 bg-[#f0f7ff] p-6 rounded-lg">
          <div className="relative aspect-square max-w-[588px] mx-auto">
            <Image
              src="/home/Image1.svg"
              alt="Customer dashboard"
              width={588}
              height={588}
              className="object-contain"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-blue-500 bg-white px-2 py-1 rounded-md shadow-sm">
              588.74 × 588.74
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 space-y-4">
          <p className="text-primary2 font-medium">Customer Support</p>
          <h2 className="text-3xl md:text-4xl font-bold">Get in touch with your customers</h2>
          <p className="text-gray-600">
            Stay on top of things and revamp your work process with our game-changing feature. Get a bird&apos;s eye view
            with our customizable dashboard.
          </p>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Lorem ipsum dolor sit amet</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Consectetur adipiscing elit</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Sed do eiusmod tempor incididunt ut labore</p>
            </div>
          </div>

          <Button variant="link" className="text-primary2 p-0 flex items-center gap-2 font-medium">
            Learn More
            <div className="bg-yellow-300 rounded-full p-1">
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>

      {/* Second section - Sales Monitoring */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-8">
        {/* Dashboard Image */}
        <div className="w-full md:w-1/2 bg-[#fffbeb] p-6 rounded-lg">
          <div className="relative aspect-square max-w-[588px] mx-auto">
            <Image
              src="/home/Image2.svg"
              alt="Sales dashboard"
              width={588}
              height={588}
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 space-y-4">
          <p className="text-blue-500 font-medium">Sales Monitoring</p>
          <h2 className="text-3xl md:text-4xl font-bold">Simplify your sales monitoring</h2>
          <p className="text-gray-600">
            Stay on top of things and revamp your work process with our game-changing feature. Get a bird&apos;s eye view
            with our customizable dashboard.
          </p>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Lorem ipsum dolor sit amet</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Consectetur adipiscing elit</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckIcon className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Sed do eiusmod tempor incididunt ut labore</p>
            </div>
          </div>

          <Button variant="link" className="text-blue-500 p-0 flex items-center gap-2 font-medium">
            Learn More
            <div className="bg-yellow-300 rounded-full p-1">
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GetTouch

