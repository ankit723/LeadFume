import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.error("STRIPE_WEBHOOK_SECRET is not set. Webhook will not function.");
  // Optionally, you could throw an error here at startup if this is critical
}

export async function GET() {
  return NextResponse.json({ message: "Webhook is working" }, { status: 200 });
}

export async function POST(request: NextRequest) {
    console.log("Webhook is working");
    if (!webhookSecret) {
        // This check is repeated here in case the server starts despite the above log
        console.error("STRIPE_WEBHOOK_SECRET is not set. Cannot process webhook.");
        return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
    }

    const body = await request.text(); // Use request.text() for raw body for stripe.webhooks.constructEvent
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;

            // Retrieve the session with line items and customer details
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ['line_items', 'customer'] }
            );
            
            const customerId = sessionWithLineItems.customer ? (typeof sessionWithLineItems.customer === 'string' ? sessionWithLineItems.customer : sessionWithLineItems.customer.id) : null;
            let customerEmail = sessionWithLineItems.customer_details?.email;
            console.log("customerEmail", customerEmail);

            if (!customerEmail && sessionWithLineItems.customer && typeof sessionWithLineItems.customer !== 'string' && !sessionWithLineItems.customer.deleted) {
            customerEmail = sessionWithLineItems.customer.email;
            }
            
            if (!customerEmail) {
            console.error('Checkout session completed with no customer email. Session ID:', session.id);
            return NextResponse.json({ error: 'Customer email not found in session.' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
            where: { email: customerEmail }
            });

            if (!user) {
            console.error(`User not found for email: ${customerEmail}. Session ID: ${session.id}`);
            return NextResponse.json({ error: `User not found for email: ${customerEmail}` }, { status: 404 });
            }

            if (!user.customerId && customerId) {
            try {
                await prisma.user.update({
                where: { id: user.id },
                data: { customerId: customerId }
                });
                console.log(`Updated Stripe Customer ID for user ${user.email} to ${customerId}`);
            } catch (updateError: any) {
                console.error(`Failed to update Stripe Customer ID for user ${user.email}:`, updateError.message);
            }
            }

            const lineItems = sessionWithLineItems.line_items?.data;
            if (!lineItems || lineItems.length === 0) {
            console.error('No line items found in checkout session. Session ID:', session.id);
            return NextResponse.json({ error: 'No line items found.' }, { status: 400 });
            }

            // Assuming the relevant subscription information is in the first recurring line item
            // and metadata is set at the session level for the primary subscription plan.
            const recurringItem = lineItems.find(item => item.price?.type === 'recurring');

            if (!recurringItem || !recurringItem.price) {
                console.error('No recurring line item found or price missing in checkout session. Session ID:', session.id);
                return NextResponse.json({ error: 'Recurring item or price not found.' }, { status: 400 });
            }

            const unitAmount = recurringItem.price.unit_amount; // in cents
            const interval = recurringItem.price.recurring?.interval; // 'month' or 'year'

            if (unitAmount === null || unitAmount === undefined) {
                console.error('Unit amount is missing for a recurring item. Session ID:', session.id);
                return NextResponse.json({ error: 'Unit amount is missing.' }, { status: 400 });
            }

            // 1. Get subscriptionTypeId and isAnnual from session metadata
            const subscriptionTypeIdFromMetadata = session.metadata?.subscriptionTypeID;
            const isAnnualFromMetadataString = session.metadata?.isAnnual; // Expect 'true' or 'false'

            if (!subscriptionTypeIdFromMetadata) {
                console.error('SubscriptionType ID not found in session metadata. Session ID:', session.id);
                return NextResponse.json({ error: 'SubscriptionType ID missing in metadata.' }, { status: 400 });
            }

            // 2. Fetch the subscription type from DB using metadata ID
            const targetSubscriptionType = await prisma.subscriptionType.findUnique({
                where: { id: subscriptionTypeIdFromMetadata }
            });

            if (!targetSubscriptionType) {
                console.error(`SubscriptionType not found in DB for ID: ${subscriptionTypeIdFromMetadata}. Session ID: ${session.id}`);
                return NextResponse.json({ error: 'Invalid SubscriptionType ID provided in metadata.' }, { status: 404 });
            }

            // 3. Calculate price and determine billing cycle for credit allocation
            const priceInDollars = unitAmount / 100;
            const isAnnualBilling = isAnnualFromMetadataString === 'true';

            const subscriptionRenewalDate = new Date();
            if (interval === 'year') {
                subscriptionRenewalDate.setFullYear(subscriptionRenewalDate.getFullYear() + 1);
            } else if (interval === 'month') {
                subscriptionRenewalDate.setMonth(subscriptionRenewalDate.getMonth() + 1);
            } else {
                console.warn(`Unknown subscription interval: ${interval} for Stripe Price ID: ${recurringItem.price.id}. Defaulting renewal to 1 month. Session ID: ${session.id}`);
                subscriptionRenewalDate.setMonth(subscriptionRenewalDate.getMonth() + 1);
            }
            
            // Calculate credits to allocate based on the subscription type and billing cycle
            const creditsToAllocate = isAnnualBilling ? targetSubscriptionType.credits * 12 : targetSubscriptionType.credits;

            try {
                await prisma.subscriptions.upsert({
                    where: { userId: user.id }, 
                    update: {
                        subscriptionTypeId: targetSubscriptionType.id,
                        price: priceInDollars, 
                        subscriptionRenewalDate: subscriptionRenewalDate,
                    },
                    create: {
                        userId: user.id,
                        subscriptionTypeId: targetSubscriptionType.id,
                        price: priceInDollars,
                        subscriptionStartDate: new Date(),
                        subscriptionRenewalDate: subscriptionRenewalDate,
                    },
                });

                // Update user's available credits
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        creditsAvailable: creditsToAllocate // Set credits based on the new/renewed subscription period
                    }
                });

                console.log(`Successfully processed subscription for user ${user.email} (ID: ${user.id}). Plan: ${targetSubscriptionType.name}, Stripe Price ID: ${recurringItem.price.id}. Credits allocated: ${creditsToAllocate}. Session ID: ${session.id}`);
            } catch (dbError: any) {
                console.error(`Database error during subscription upsert or user credit update for user ${user.email}:`, dbError.message, 'Session ID:', session.id);
                return NextResponse.json({ error: 'Database error processing subscription.' }, { status: 500 });
            }
            
            break;
        
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                const custId = subscription.customer;
                const subscriptionId = subscription.id;

                const subsUser = await prisma.user.findUnique({
                    where: { customerId: custId as string }
                });

                if (!subsUser) {
                    console.error(`User not found for customer ID: ${custId}. Subscription ID: ${subscriptionId}`);
                    return NextResponse.json({ error: 'User not found for customer ID.' }, { status: 404 });
                }

                await prisma.subscriptions.delete({
                    where: { userId: subsUser.id }
                });

                await prisma.user.update({
                    where: { id: subsUser.id },
                    data: { creditsAvailable: 0 }
                });

                console.log(`Successfully deleted subscription for user ${subsUser.email} (ID: ${subsUser.id}). Subscription ID: ${subscriptionId}`);
                break;
            
            case 'customer.subscription.updated':
                const subs = event.data.object as Stripe.Subscription;
                const customId = subs.customer;
                const subsId = subs.id;

                const subscriptionUser = await prisma.user.findUnique({
                    where: { customerId: customId as string }
                });

                if (!subscriptionUser) {
                    console.error(`User not found for customer ID: ${customId}. Subscription ID: ${subsId}`);
                    return NextResponse.json({ error: 'User not found for customer ID.' }, { status: 404 });
                }
                
                // logic to handle the subscription update
                
                break;
        // TODO: Handle other relevant Stripe events for robust subscription management:
        case 'invoice.payment_succeeded':
            const invoice = event.data.object as Stripe.Invoice;
            const cusId = invoice.customer as string;
            
            // Need to access the subscription ID from the invoice
            // The subscription property might not be defined in the TypeScript types
            // but it exists in the actual API response
            const subId = (invoice as any).subscription as string;
            
            if (!subId) {
                console.error(`No subscription ID found in invoice. Invoice ID: ${invoice.id}`);
                return NextResponse.json({ error: 'Subscription ID not found in invoice.' }, { status: 400 });
            }

            const invoiceUser = await prisma.user.findUnique({
                where: { customerId: cusId }
            });

            if (!invoiceUser) {
                console.error(`User not found for customer ID: ${cusId}. Invoice ID: ${invoice.id}`);
                return NextResponse.json({ error: 'User not found for customer ID.' }, { status: 404 });
            }
            
            const currentSubscription = await prisma.subscriptions.findUnique({
                where: { userId: invoiceUser.id },
                include: {
                    subscriptionType: true
                }
            });

            if (!currentSubscription) {
                console.error(`Subscription not found for user ${invoiceUser.email} (ID: ${invoiceUser.id}). Invoice ID: ${invoice.id}`);
                return NextResponse.json({ error: 'Subscription not found.' }, { status: 404 });
            }

            const stripeSubscription = await stripe.subscriptions.retrieve(subId);
            const isAnnual = stripeSubscription.items.data[0].plan.interval === 'year';

            const newRenewalDate = new Date();
            if (isAnnual) {
                newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
            } else {
                newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
            }

            const creditsLeft = invoiceUser.creditsAvailable
            const creditsToAlloc = isAnnual ? currentSubscription.subscriptionType.credits * 12 : currentSubscription.subscriptionType.credits;
            const totalCredits = creditsLeft + creditsToAlloc;

            await prisma.subscriptions.update({
                where: { id: currentSubscription.id },
                data: { subscriptionRenewalDate: newRenewalDate }
            });

            await prisma.user.update({
                where: { id: invoiceUser.id },
                data: { creditsAvailable: totalCredits }
            });

            console.log(`Successfully updated subscription renewal date for user ${invoiceUser.email} (ID: ${invoiceUser.id}). New renewal date: ${newRenewalDate}`);
            
          // For recurring payments. Update subscriptionRenewalDate.
          // You'll need to identify the subscription, possibly via Stripe Subscription ID (recommended to store) or customer ID.
          break;
        case 'invoice.payment_failed':
            const invoiceFailed = event.data.object as Stripe.Invoice;
            const cusIdFailed = invoiceFailed.customer as string;
            
            // Similar to above, use type assertion to access subscription ID
            const invoiceId = invoiceFailed.id;

            const invoiceUserFailed = await prisma.user.findUnique({
                where: { customerId: cusIdFailed }
            });

            if (!invoiceUserFailed) {
                console.error(`User not found for customer ID: ${cusIdFailed}. Invoice ID: ${invoiceId}`);
                return NextResponse.json({ error: 'User not found for customer ID.' }, { status: 404 });
            }

            const currentSubscriptionFailed = await prisma.subscriptions.findUnique({
                where: { userId: invoiceUserFailed.id }
            });

            if (!currentSubscriptionFailed) {
                console.error(`Subscription not found for user ${invoiceUserFailed.email} (ID: ${invoiceUserFailed.id}). Invoice ID: ${invoiceId}`);
                return NextResponse.json({ error: 'Subscription not found.' }, { status: 404 });
            }

            await prisma.subscriptions.update({
                where: { id: currentSubscriptionFailed.id },
                data: { status: SubscriptionStatus.INACTIVE }
            });
          // Handle failed payments, notify user, update subscription status (e.g., 'past_due').
          break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error('Webhook processing error:', error.message, error.stack);
        return NextResponse.json({ error: 'Internal server error during webhook processing.' }, { status: 500 });
    }
}