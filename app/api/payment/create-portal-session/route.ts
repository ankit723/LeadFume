import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
    const {customerId} = await request.json();
    console.log(customerId);

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
        });

        return NextResponse.json({sessionUrl: session.url});
    } catch (error) {
        console.error('Error creating billing portal session:', error);
        return NextResponse.json({error: 'Failed to create billing portal session'}, {status: 500});
    }

    
}