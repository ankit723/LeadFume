'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Flame, Wind } from "lucide-react";

export default function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute right-1/4 top-1/3 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute left-1/3 bottom-1/4 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 text-center px-6">
        {/* 404 with creative Leadfume branding */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <Flame className="w-12 h-12 text-primary animate-float" />
          <h1 className="text-8xl font-bold tracking-tighter">
            4
            <span className="inline-block text-primary animate-bounce">
              <Wind className="w-16 h-16 transform -rotate-45" />
            </span>
            4
          </h1>
          <Flame className="w-12 h-12 text-primary animate-float transform rotate-180" />
        </div>

        {/* Branding and message */}
        <h2 className="text-3xl font-bold mb-4">
          Lea<span className="text-primary">d</span>s Lost in the Fume
        </h2>
        
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Looks like the page you &apos;re looking for has evaporated into thin air. 
          Don&apos;t worry, our lead generation engine is still running strong!
        </p>

        {/* Action button */}
        <Button asChild className="group hover:scale-105 transition-transform duration-200">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Link>
        </Button>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 