"use client"

import { Button } from "@/components/ui/button"

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-[55.77px]  text-primary2 mt-10">About Us</h1>
      <hr className="bg-[#EED061] w-full h-[2.39px] my-3" />

      {/* Main content section */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Left column */}
        <div className="w-full md:w-1/2">
          <p className="text-base mb-6">
          &quot;At LeadFume, we revolutionize lead generation with our AI-powered platform, delivering real-time, accurate, and verified leads to businesses worldwide. Our focus is on empowering sales teams with cutting-edge technology to drive growth and maximize efficiency.&quot;
          </p>
          <Button className="bg-[#EED061] hover:bg-[#e6c64d] text-black font-medium cursor-pointer rounded-full px-8 py-3">
            More about us
          </Button>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Aim</h3>
            <p className="text-sm">
            &quot;Our aim is to redefine lead generation by providing businesses with fresh, targeted leads on demand, leveraging AI to enhance sales outcomes and fuel sustainable growth.&quot;
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Mission</h3>
            <p className="text-sm">
            &quot;Our mission is to deliver an innovative, real-time lead generation solution that eliminates outdated data, ensuring our clients achieve higher conversions with verified, actionable leads.&quot;
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Progress</h3>
            <p className="text-sm">
              &quot;LeadFume continues to set the standard in lead generation, marked by rapid adoption, exceptional lead accuracy, and a growing base of satisfied clients across industries.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Milestones section */}
      <div className="mt-20">
        <h2 className="text-primary2 text-5xl mb-4">Milestones</h2>
        <p className="mb-8">
          &quot;At LeadFume, our milestones reflect our dedication to innovation, client success, and leadership in AI-driven lead generation.&quot;
        </p>
        <hr className="bg-[#EED061] w-full h-[2.39px] my-6" />

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 py-8">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+15</h3>
            <p className="text-center text-sm mt-2">Industries Served</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+51</h3>
            <p className="text-center text-sm mt-2">Satisfied Clients</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+99%</h3>
            <p className="text-center text-sm mt-2">Lead Accuracy Rate</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+4</h3>
            <p className="text-center text-sm mt-2">Years of Innovation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About