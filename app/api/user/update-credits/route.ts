import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { creditsToDeduct } = await request.json()

    if (!creditsToDeduct || creditsToDeduct < 0) {
      return NextResponse.json(
        { error: 'Invalid credits amount' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has sufficient credits
    if (user.creditsAvailable < creditsToDeduct) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        creditsAvailable: Math.max(0, user.creditsAvailable - creditsToDeduct)
      }
    })

    return NextResponse.json({
      success: true,
      remainingCredits: updatedUser.creditsAvailable,
      creditsDeducted: creditsToDeduct
    })

  } catch (error) {
    console.error('Update credits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 