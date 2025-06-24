import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try{

        const { subscriptionTypeID, priceId, isAnnual, user } = await request.json();
        
        console.log("subscriptionTypeID", subscriptionTypeID);
        console.log("priceId", priceId);
        console.log("isAnnual", isAnnual);
        console.log("user", user);
        
        if(user?.customerId) {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
                customer: user?.customerId,
                metadata: {
                    subscriptionTypeID,
                    isAnnual,
                },
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/subscriptions`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/checkout`,
            });

            return NextResponse.json({ url: session.url }, { status: 200 });
        }
        
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            customer_email: user?.email,
            metadata: {
                subscriptionTypeID,
                isAnnual,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/subscriptions`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/checkout`,
        })
        
        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}