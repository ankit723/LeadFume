import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#B7BC9B]">
      {/* Organic shape background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right blue shape */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#4B69FF] blur-3xl opacity-80 transform rotate-12" />
        
        {/* Left side blue shape */}
        <div className="absolute -left-40 top-1/4 w-[800px] h-[800px] rounded-full bg-[#4B69FF] blur-3xl opacity-80 transform -rotate-45" />
        
        {/* Bottom yellow shape */}
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-[#FFD84B] blur-3xl opacity-80 transform rotate-45" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex justify-center items-center min-h-screen py-24">
        <div className="w-full max-w-[480px] mx-4">
          <SignIn appearance={{
            elements: {
              rootBox: "mx-auto w-full bg-white rounded-3xl shadow-2xl overflow-hidden",
              card: "p-8",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-[#4B69FF] hover:bg-[#3951cc] transition-colors",
              formFieldInput: "rounded-lg border-gray-300 focus:ring-[#4B69FF] focus:border-[#4B69FF]",
              footerActionLink: "text-[#4B69FF] hover:text-[#3951cc]"
            },
          }} />
        </div>
      </div>
    </div>
  );
}