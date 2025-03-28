"use client"

import type React from "react"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

interface FeatureCardProps {
  number: string
  title: string
  description: string
  fullWidth?: boolean
  hasConsultingButton?: boolean
  excludeSpecialStyling?: boolean
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  number,
  title,
  description,
  fullWidth = false,
  hasConsultingButton = false,
  excludeSpecialStyling = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  return (
    <div
      className={`relative bg-[#A08EFC] rounded-3xl p-6 text-white ${
        fullWidth ? "col-span-2" : "col-span-1"
      }`}
    >
      {!excludeSpecialStyling && (
        <div
          className="absolute top-0 right-0 overflow-hidden"
          style={{
            width: "120px",
            height: "120px",
            borderTopRightRadius: "40px",
          }}
        >
          <div className="absolute right-0 w-[80px] h-[80px] bg-white rounded-bl-[60px]"></div>
        </div>
      )}

      {!excludeSpecialStyling && (
        <div
          className={`absolute -top-1 right-0 rounded-full w-[60px] h-[60px] flex items-center justify-center transition-colors duration-300 ease-in-out cursor-pointer ${
            isHovered ? "bg-yellow-400" : "bg-black"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ArrowUpRight
            className={`text-white w-8 h-8 transition-transform duration-300 ease-in-out ${
              isHovered ? "rotate-90" : "rotate-45"
            }`}
          />
        </div>
      )}

      <div className="mb-2 text-2xl font-bold">{number}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-white/90">{description}</p>

      {hasConsultingButton && (
        <div className="mt-6">
          <button
            className="bg-white cursor-pointer text-purple-600 hover:bg-white/90 rounded-full px-7 py-2.5 text-xs sm:text-sm font-medium relative"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Free consulting 40 min
            <div className="absolute sm:-right-1 -right-2 sm:top-1 top-1 bg-black rounded-full p-2">
              <ArrowUpRight
                size={14}
                className={`text-white cursor-pointer transition-transform duration-300 ease-in-out ${
                  isButtonHovered ? "rotate-90" : "rotate-45"
                }`}
              />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

const ElevateComponent = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-primary2 mb-3">Elevate Your Lead Generation</h1>
      <p className="text-gray-600 mb-6 max-w-3xl">
        LeadFume’s AI-driven, real-time lead generation empowers your sales team with fresh, verified leads tailored to your business needs.
      </p>

      <hr className="border-yellow-300 border-t-2 mb-10" />

      <div className="md:grid grid-cols-1 md:grid-cols-3 md:gap-6 flex flex-col gap-3">
        {/* Card 1 */}
        <FeatureCard
          number="01"
          title="Real-Time Data Collection"
          description="LeadFume crawls over 1 million web pages per second to deliver the most recent and relevant leads, ensuring you never work with outdated data."
        />

        {/* Card 2 */}
        <FeatureCard
          number="02"
          title="AI-Powered Smart Filtering"
          description="Our AI categorizes and filters leads based on your specific criteria, delivering only the most relevant prospects for your business."
        />

        {/* Card 3 */}
        <FeatureCard
          number="03"
          title="Best-in-Class Validation"
          description="Every lead undergoes multi-step verification, checking emails, phone numbers, and social profiles for maximum accuracy."
        />

        {/* Card 4 */}
        <FeatureCard
          number="04"
          title="Ultra-Fast Lead Retrieval"
          description="With over 1 million pages crawled per second, LeadFume provides instant access to high-quality leads, saving you time and effort."
        />

        {/* Card 5 - Full Width */}
        <FeatureCard
          number="05"
          title="100% Customizable Searches"
          description="Refine your searches by industry, location, job title, company size, revenue, and more to find the exact prospects you need, all in real-time."
          fullWidth={true}
          hasConsultingButton={true}
          excludeSpecialStyling={true}
        />

        {/* Card 6 */}
        <FeatureCard
          number="06"
          title="Cost-Effective Pricing"
          description="LeadFume offers the best pricing in the market, delivering verified, fresh leads at an affordable rate to maximize your ROI."
        />

        {/* Card 7 */}
        <FeatureCard
          number="07"
          title="Targeted B2B Leads"
          description="Access decision-makers and industry professionals with verified contact details, perfect for B2B sales and outreach."
        />

        {/* Card 8 */}
        <FeatureCard
          number="08"
          title="Instant Lead Delivery"
          description="Get real-time, exportable leads as soon as they’re verified, allowing your team to act quickly and close deals faster."
        />

        {/* Card 9 */}
        <FeatureCard
          number="09"
          title="Boost Sales Efficiency"
          description="With accurate, up-to-date leads, your sales team can focus on converting prospects instead of chasing outdated contacts."
        />

        {/* Card 10 - Full Width */}
        <FeatureCard
          number="10"
          title="The Future of Lead Generation"
          description="LeadFume’s AI-driven platform eliminates stale data and guesswork, providing fresh, targeted leads on demand for businesses of all sizes."
          fullWidth={true}
          hasConsultingButton={true}
          excludeSpecialStyling={true}
        />
      </div>
    </div>
  )
}

export default ElevateComponent