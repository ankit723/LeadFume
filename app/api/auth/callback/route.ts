import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const {userId} = await auth();
    console.log("userId", userId);
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

    const user = await currentUser();
    if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));

    // Check if user exists in DB
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          profileImage: user.imageUrl || `https://avatar.vercel.sh/rauchg.svg?text=${user.firstName} ${user.lastName}`,
          phone: "",
          dateOfBirth: "",
          gender: "",
        },
      });
    }

    // Redirect user to dashboard or home page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
}
