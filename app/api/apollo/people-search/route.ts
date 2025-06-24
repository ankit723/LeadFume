import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Apollo People Search API integration
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
    const apolloParams = transformToApolloParams(searchParams)

    // Make request to Apollo API
    const apolloResponse = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
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
    console.error('Apollo People Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Transform our internal filter format to Apollo API parameters
function transformToApolloParams(params: any) {
  const apolloParams: any = {}

  // Email Status Filter - correct parameter name (no brackets)
  if (params.contactEmailStatusV2 && params.contactEmailStatusV2.length > 0) {
    apolloParams.contact_email_status = params.contactEmailStatusV2
  }

  // Person Titles (Job Title Filter) - use person_titles (without brackets)
  if (params.personTitles && params.personTitles.length > 0) {
    apolloParams.person_titles = params.personTitles
  }

  // Person Locations - use person_locations (without brackets)
  if (params.personLocations && params.personLocations.length > 0) {
    apolloParams.person_locations = params.personLocations
  }

  // Person Seniorities - use person_seniorities (without brackets)
  if (params.personSeniorities && params.personSeniorities.length > 0) {
    apolloParams.person_seniorities = params.personSeniorities
  }

  // Organization parameters - use organization_locations (without brackets)
  if (params.organizationLocations && params.organizationLocations.length > 0) {
    apolloParams.organization_locations = params.organizationLocations
  }

  // Organization IDs
  if (params.organizationIds && params.organizationIds.length > 0) {
    apolloParams.organization_ids = params.organizationIds
  }

  // Excluded Organization IDs
  if (params.organizationNotIds && params.organizationNotIds.length > 0) {
    apolloParams.organization_not_ids = params.organizationNotIds
  }

  // Employee count ranges - use organization_num_employees_ranges (without brackets)
  if (params.organizationNumEmployeesRanges && params.organizationNumEmployeesRanges.length > 0) {
    apolloParams.organization_num_employees_ranges = params.organizationNumEmployeesRanges
  }

  // Industries and keywords - use q_organization_keyword_tags (without brackets)
  if (params.qOrganizationKeywordTags && params.qOrganizationKeywordTags.length > 0) {
    apolloParams.q_organization_keyword_tags = params.qOrganizationKeywordTags
  }

  // Organization NOT Keywords - for excluding people based on company industry
  if (params.qNotOrganizationKeywordTags && params.qNotOrganizationKeywordTags.length > 0) {
    apolloParams.q_not_organization_keyword_tags = params.qNotOrganizationKeywordTags
  }

  // Company name search
  if (params.qOrganizationName) {
    apolloParams.q_organization_name = params.qOrganizationName
  }

  // Person Department or Subdepartments - use person_department_or_subdepartments (without brackets)
  if (params.personDepartmentOrSubdepartments && params.personDepartmentOrSubdepartments.length > 0) {
    apolloParams.person_department_or_subdepartments = params.personDepartmentOrSubdepartments
  }

  // Technology filters (premium feature)
  if (params.organizationTechnologySlugs && params.organizationTechnologySlugs.length > 0) {
    apolloParams.organization_technology_slugs = params.organizationTechnologySlugs
  }

  // Revenue filters (premium feature)
  if (params.organizationRevenueRanges && params.organizationRevenueRanges.length > 0) {
    apolloParams.organization_revenue_ranges = params.organizationRevenueRanges
  }

  // Keywords search for general text search
  if (params.qKeywords) {
    apolloParams.q_keywords = params.qKeywords
  }

  return apolloParams
} 