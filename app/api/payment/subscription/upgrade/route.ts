//route for upgrading a subscription
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    const { priceId, user } = await request.json();

    const customer = await stripe.customers.retrieve(user.customerId);
    if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const subscription = await stripe.subscriptions.list({customer: customer.id});
    if (!subscription) {
        return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const currentSubscription = subscription.data[0];

    const updatedSubscription = await stripe.subscriptions.update(currentSubscription.id, {
        items:[{
            id: currentSubscription.items.data[0].id,
            price: priceId,
        }],
        proration_behavior: 'create_prorations',
    });

    if (!updatedSubscription) {
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }
    
    return NextResponse.json({ 
        success: true,
        subscriptionId: updatedSubscription.id
    });
}