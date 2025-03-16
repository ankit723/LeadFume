"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-12 py-6 lg:py-8 gap-6">
      {/* Left Content */}
      <div className="lg:max-w-[65%]">
        <h1 className="text-4xl tracking-wide md:text-6xl font-bold text-primary2 leading-tight">
          Implementing <br /> Software<br /> Solutions
        </h1>
        <p className="mt-3 text-black text-base md:text-lg font-normal max-w-lg">
          Innovating Tomorrow's Solutions, Today. Logo – Your Trusted IT Partner
        </p>

        {/* Email Input & Button */}
        <div className="mt-4 gap-2 flex items-center relative">
            <Mail className="text-primary w-6 h-6 absolute right-35"/>
            <Input
              type="email"
              placeholder="Your email address"
              className="p-4 bg-white"
            />
          <Link href="/dashboard">
            <Button className="p-3 py-4">
                Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="lg:max-w-[55%]">
        <Image
          src="/home/Group.svg" 
          alt="Hero Illustration"
          width={350}
          height={260}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}