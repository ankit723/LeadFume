"use client";

import type { FC } from "react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

interface QuestionProps {
  question: string;
  answer: string;
}

const questionsData: QuestionProps[] = [
  {
    question: "How does LeadFume collect data in real-time?",
    answer:
      "LeadFume uses AI-powered web crawling technology to scan over 1 million web pages per second, gathering and processing the most recent and relevant lead data tailored to your needs.",
  },
  {
    question: "What makes LeadFume different from traditional lead generation tools?",
    answer:
      "Unlike traditional tools that rely on outdated databases, LeadFume dynamically fetches fresh leads in real-time, ensuring accuracy and relevance without storing old data.",
  },
  {
    question: "How does LeadFume ensure the accuracy of leads?",
    answer:
      "LeadFume runs every contact through a multi-step verification process, validating emails, phone numbers, and cross-referencing with business databases to ensure high-quality, accurate leads.",
  },
  {
    question: "Can I customize my lead searches with LeadFume?",
    answer:
      "Yes, LeadFume offers 100% customizable searches based on parameters like industry, location, job title, company size, revenue brackets, and keywords, ensuring highly targeted results.",
  },
  {
    question: "How fast does LeadFume deliver leads?",
    answer:
      "LeadFume crawls over 1 million pages per second, providing ultra-fast lead retrieval so you get instant access to fresh, verified leads without delay.",
  },
  {
    question: "Who can benefit from using LeadFume?",
    answer:
      "LeadFume benefits B2B sales teams, marketing agencies, recruiters, startups, and enterprises by providing real-time, verified leads tailored to their specific goals.",
  },
  {
    question: "Is LeadFume cost-effective?",
    answer:
      "Yes, LeadFume offers the best pricing in the market, delivering high-quality, verified leads at an affordable rate, maximizing ROI for businesses of all sizes.",
  },
];

const Questions: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <p className="text-primary2 font-medium mb-2">
              Frequently Asked Questions
            </p>
            <h2 className="text-4xl font-bold mb-4">
              Let&apos;s clarify some of your questions
            </h2>
            <p className="text-[#36485C]">
              Get answers about how LeadFume revolutionizes lead generation with real-time, AI-driven technology.
            </p>
          </div>

          <div className="lg:w-2/3">
              {questionsData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="bg-blue-50 rounded-lg border-none shadow-sm mb-4 overflow-hidden">
              {/* Question Section */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center"
              >
                <span className="text-left font-medium text-black">{item.question}</span>
                
                {/* Smooth Icon Transition */}
                <div
                  className={`w-5 h-5 text-indigo-600 cursor-pointer transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {isOpen ? <Minus /> : <Plus />}
                </div>
              </button>

              {/* Smooth Expand and Collapse */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4 pt-0 text-gray-700">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
              
            
        </div>
      </section>

      <section className="mx-auto px-4 pb-16">
        <div className="bg-indigo-600 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section */}
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              {/* START NOW Section */}
              <div className="flex items-center gap-4 mb-2">
                <p className="text-cyan-300 font-medium uppercase tracking-wider">
                  START NOW
                </p>
                <div className="w-24 h-0.5 bg-cyan-300"></div>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Get Start For Free No Credit Card Required
              </h2>

              {/* Form Section */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  placeholder="Email address"
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 w-full sm:max-w-xs"
                />
                <button className="bg-[#20cfc6] hover:bg-[#20cfc6] font-medium px-6 py-3 rounded-lg">
                  Get Started
                </button>
              </div>

              {/* Contact Text */}
              <p className="text-indigo-100">
                Want to contact our team and book a call?{" "}
                <a href="#" className="text-cyan-300 hover:underline">
                  Try it now
                </a>
              </p>
            </div>
            <div className="relative w-[90%]  md:w-[40%] sm:min-h-[500px] items-center flex justify-center">
              <Image
                src="/home/Images.svg"
                alt="Team collaboration"
                width={600}
                height={500}
                className="object-cover rounded-tl-2xl md:rounded-tl-none rounded-bl-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Questions;