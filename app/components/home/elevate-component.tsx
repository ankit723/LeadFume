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
  excludeSpecialStyling?: boolean // New prop to exclude special styling
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  number,
  title,
  description,
  fullWidth = false,
  hasConsultingButton = false,
  excludeSpecialStyling = false, // Default to false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  return (
    <div
      className={`relative bg-[#A08EFC] rounded-3xl p-6 text-white ${
        fullWidth ? "col-span-2" : "col-span-1"
      }`}
    >
      {/* Special corner shape */}
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

      {/* Arrow button with hover effect */}
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
            className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-7 py-2.5 text-xs sm:text-sm font-medium relative"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Free consulting 40 min
            <div className="absolute sm:-right-1 -right-2 sm:top-1 top-1 bg-black rounded-full p-2">
              <ArrowUpRight
                size={14}
                className={`text-white transition-transform duration-300 ease-in-out ${
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
      <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-3">Elevate Your Brand Digitally</h1>
      <p className="text-gray-600 mb-6 max-w-3xl">
        Our tailored solutions empower your online presence, ensuring growth and success in a digitized landscape.
      </p>

      <hr className="border-yellow-300 border-t-2 mb-10" />

      <div className="md:grid grid-cols-1 md:grid-cols-3 md:gap-6 flex flex-col gap-3">
        {/* Card 1 */}
        <FeatureCard
          number="01"
          title="Expansive Database"
          description="310 million+ contact records, with fresh data added daily."
        />

        {/* Card 2 */}
        <FeatureCard
          number="02"
          title="Real-Time Data Optimization"
          description="Dynamic data enrichment through cutting-edge web scraping. AI-powered algorithms & real-time verification for top-tier quality."
        />

        {/* Card 3 */}
        <FeatureCard
          number="03"
          title="Tech Intelligence at Scale"
          description="Track over 10,000+ technologies used by businesses and brands."
        />

        {/* Card 4 */}
        <FeatureCard
          number="04"
          title="Guaranteed Lowest Industry Pricing"
          description="Guaranteed lowest industry pricing - the best value. It is what is the lowest rates in the market, maximizing your ROI for sales and marketing success."
        />

        {/* Card 5 - Full Width */}
        <FeatureCard
          number="05"
          title="The Fastest-Growing & Most Accurate Data Provider"
          description="LeadFuze is rapidly outpacing competitors with 99% data accuracy, using its own proprietary data-building technology instead of relying on third-party sources. Expansive Database - 310 million+ contact records, with fresh data added."
          fullWidth={true}
          hasConsultingButton={true}
          excludeSpecialStyling={true} // Exclude special styling for this card
        />

        {/* Card 6 */}
        <FeatureCard
          number="06"
          title="Email Verification Tool"
          description="Verify emails with precision to reduce bounce rates and ensure high deliverability for your outreach."
        />

        {/* Card 7 */}
        <FeatureCard
          number="07"
          title="ABM Filters & Data Appending"
          description="Enhance your targeting by uploading your own data (e.g., domains, company name, etc) and applying Include/Exclude criteria to build targeted lists for your highly focused outreach."
        />

        {/* Card 8 */}
        <FeatureCard
          number="08"
          title="AI-Powered Target Prospecting"
          description="Simplify your prospecting process with AI. Just input your companies and watch it deliver the best leads instantly."
        />

        {/* Card 9 */}
        <FeatureCard
          number="09"
          title="Personalized News & Alerts"
          description="Stay ahead with key updates on your targets, industry trends, and prospecting insights, keeping you informed for smarter decision-making."
        />

        {/* Card 10 - Full Width */}
        <FeatureCard
          number="10"
          title="Comprehensive Data Fields"
          description="Access detailed insights, including company details, website, contact names, job titles, emails, phone numbers, location, employee count, revenue, LinkedIn profiles (company & personal), and tech stack for precise targeting."
          fullWidth={true}
          hasConsultingButton={true}
          excludeSpecialStyling={true} // Exclude special styling for this card
        />
      </div>
    </div>
  )
}

export default ElevateComponent