import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, records } = await request.json()
    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return NextResponse.json({ error: 'Apollo API key not configured' }, { status: 500 })
    }
    if (!type || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 })
    }
    if (records.length > 10) {
      return NextResponse.json({ error: 'You can only enrich up to 10 records at a time' }, { status: 400 })
    }

    let apolloUrl = ''
    let body: any = {}
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Api-Key': apolloApiKey,
    }

    if (type === 'people') {
      apolloUrl = 'https://api.apollo.io/api/v1/people/bulk_match'
      body = {
        details: records,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }
    } else if (type === 'companies') {
      apolloUrl = 'https://api.apollo.io/api/v1/organizations/bulk_enrich'
      body = {
        domains: records.map((c: any) => c.primary_domain || c.domain || c.website_url || c.name).filter(Boolean),
      }
    } else {
      return NextResponse.json({ error: 'Invalid enrichment type' }, { status: 400 })
    }

    const apolloRes = await fetch(apolloUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    const data = await apolloRes.json()
    if (!apolloRes.ok) {
      return NextResponse.json({ error: data.error_message || 'Apollo enrichment failed', details: data }, { status: apolloRes.status })
    }
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : error }, { status: 500 })
  }
} 