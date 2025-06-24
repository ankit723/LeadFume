import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Apollo Organization Search API integration
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user to check credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            subscriptionType: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has sufficient credits
    if (user.creditsAvailable <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    const searchParams = await request.json()

    // Apollo API configuration
    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return NextResponse.json(
        { error: 'Apollo API key not configured' },
        { status: 500 }
      )
    }

    // Transform our filter parameters to Apollo API format
    const apolloParams = transformToApolloCompanyParams(searchParams)

    // Make request to Apollo API
    const apolloResponse = await fetch('https://api.apollo.io/api/v1/mixed_companies/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apolloApiKey,
      },
      body: JSON.stringify({
        ...apolloParams,
        page: searchParams.page || 1,
        per_page: searchParams.per_page || 25,
      }),
    })

    if (!apolloResponse.ok) {
      const errorData = await apolloResponse.json().catch(() => ({}))
      return NextResponse.json(
        { 
          error: 'Apollo API request failed',
          details: errorData,
          status: apolloResponse.status 
        },
        { status: apolloResponse.status }
      )
    }

    const apolloData = await apolloResponse.json()

    // Update user credits based on Apollo response
    const creditsConsumed = apolloData.credits_consumed || 1
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsAvailable: Math.max(0, user.creditsAvailable - creditsConsumed)
      }
    })

    return NextResponse.json({
      success: true,
      data: apolloData,
      creditsConsumed,
      remainingCredits: Math.max(0, user.creditsAvailable - creditsConsumed)
    })

  } catch (error) {
    console.error('Apollo Company Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Transform our internal filter format to Apollo Company API parameters
function transformToApolloCompanyParams(params: any) {
  const apolloParams: any = {}

  // Organization employee count ranges - use organization_num_employees_ranges (without brackets)
  if (params.organizationNumEmployeesRanges && params.organizationNumEmployeesRanges.length > 0) {
    apolloParams.organization_num_employees_ranges = params.organizationNumEmployeesRanges
  }

  // Organization locations - use organization_locations (without brackets)
  if (params.organizationLocations && params.organizationLocations.length > 0) {
    apolloParams.organization_locations = params.organizationLocations
  }

  // Organization NOT locations (exclusions) - use organization_not_locations (without brackets)
  if (params.organizationNotLocations && params.organizationNotLocations.length > 0) {
    apolloParams.organization_not_locations = params.organizationNotLocations
  }

  // Organization Keywords - use q_organization_keyword_tags for keyword-based industry searches
  if (params.qOrganizationKeywordTags && params.qOrganizationKeywordTags.length > 0) {
    apolloParams.q_organization_keyword_tags = params.qOrganizationKeywordTags
  }

  // Organization NOT Keywords - use q_not_organization_keyword_tags for excluded keywords
  if (params.qNotOrganizationKeywordTags && params.qNotOrganizationKeywordTags.length > 0) {
    apolloParams.q_not_organization_keyword_tags = params.qNotOrganizationKeywordTags
  }

  // Organization name search
  if (params.qOrganizationName) {
    apolloParams.q_organization_name = params.qOrganizationName
  }

  // Specific organization IDs - use organization_ids (without brackets)
  if (params.organizationIds && params.organizationIds.length > 0) {
    apolloParams.organization_ids = params.organizationIds
  }

  // Excluded organization IDs - use organization_not_ids (without brackets)
  if (params.organizationNotIds && params.organizationNotIds.length > 0) {
    apolloParams.organization_not_ids = params.organizationNotIds
  }

  // Technology filters (premium feature) - use organization_technology_slugs (without brackets)
  if (params.organizationTechnologySlugs && params.organizationTechnologySlugs.length > 0) {
    apolloParams.organization_technology_slugs = params.organizationTechnologySlugs
  }

  // Revenue ranges (premium feature) - use organization_revenue_ranges (without brackets)
  if (params.organizationRevenueRanges && params.organizationRevenueRanges.length > 0) {
    apolloParams.organization_revenue_ranges = params.organizationRevenueRanges
  }

  // Founded year ranges - use organization_founded_year_ranges (without brackets)
  if (params.organizationFoundedYearRanges && params.organizationFoundedYearRanges.length > 0) {
    apolloParams.organization_founded_year_ranges = params.organizationFoundedYearRanges
  }

  // Funding stage - use organization_latest_funding_stage_cd (without brackets)
  if (params.organizationLatestFundingStageCd && params.organizationLatestFundingStageCd.length > 0) {
    apolloParams.organization_latest_funding_stage_cd = params.organizationLatestFundingStageCd
  }

  return apolloParams
} 