"use client"

import { Button } from "@/components/ui/button"

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-[55.77px] text-primary2 mt-10">About Us</h1>
      <hr className="bg-[#EED061] w-full h-[2.39px] my-3" />

      {/* Main content section */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Left column */}
        <div className="w-full md:w-1/2">
          <p className="text-base mb-6">
          &quot;At LEADFUME, we are pioneers in the realm of IT solutions, dedicated to transforming businesses
            through innovative technologies. With a relentless commitment to excellence, we specialize in custom
            software development, cloud computing, cybersecurity, IT consulting, and managed services.&quot;
          </p>
          <Button className="bg-[#EED061] hover:bg-[#e6c64d] text-black font-medium rounded-full px-8 py-3">
            More about us
          </Button>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Aim</h3>
            <p className="text-sm">
            &quot;Our aim is to revolutionize businesses through cutting-edge IT solutions. We strive to empower
              organizations with innovative technologies, fostering growth, efficiency, and sustained success.&quot;
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Mission</h3>
            <p className="text-sm">
            &quot;Our mission is to be a trusted IT partner, delivering exceptional solutions that align with our clients&apos;
              unique needs. We are dedicated to driving digital transformation, enhancing productivity.&quot;
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-[31.87px] text-primary2">Progress</h3>
            <p className="text-sm">
            &quot;Driven by a commitment to excellence, LEADFUME has consistently achieved milestones in providing
              top-notch IT services. Our progress is marked by successful implementations, satisfied clients.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Milestones section */}
      <div className="mt-20">
        <h2 className="text-primary2 text-5xl mb-4">Milestones</h2>
        <p className="mb-8">
        &quot;At LEADFUME, Milestones Mark Our Success, Representing Achievements, Growth, And Our Unwavering
          Commitment To Excellence.&quot;
        </p>
        <hr className="bg-[#EED061] w-full h-[2.39px] my-6" />

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+15</h3>
            <p className="text-center text-sm mt-2">Number of Projects Completed</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+51</h3>
            <p className="text-center text-sm mt-2">Happy Customer</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+99%</h3>
            <p className="text-center text-sm mt-2">Increased Customer satisfaction</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold">+4</h3>
            <p className="text-center text-sm mt-2">Year of Experiences</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

