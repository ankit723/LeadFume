import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OnboardingForm from "../components/forms/onboardingForm";
import { prisma } from "@/lib/prisma";

const page = async () => {
    const {userId} = await auth();
    console.log("userId", userId);
    if (!userId) return redirect("/sign-in");

    const user = await currentUser();
    console.log("user", user);
    if (!user) return redirect("/sign-in");

    // Check if user exists in DB
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) return redirect("/dashboard");
    
    // Serialize the user data to avoid passing non-serializable properties
    const serializedUser = {
      id: user.id,
      emailAddresses: user.emailAddresses.map(email => ({
        emailAddress: email.emailAddress
      })),
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl
    };

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
        <OnboardingForm user={serializedUser} />
      </div>
    </div>
  )
}

export default page