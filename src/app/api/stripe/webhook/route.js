import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Check if Stripe is properly configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here';
const stripe = isStripeConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req) {
  // If Stripe is not configured, return a placeholder response
  if (!isStripeConfigured) {
    console.warn('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
    return new NextResponse('Stripe is not configured', { status: 503 });
  }

  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      
      // Update user's subscription status in your database
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: subscription.metadata.userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          plan_id: subscription.metadata.planId,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
          cancel_at_period_end: subscription.cancel_at_period_end
        });
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      
      // Update subscription status to canceled
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date()
        })
        .match({ stripe_subscription_id: deletedSubscription.id });
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      
      // Record successful payment
      await supabase
        .from('payments')
        .insert({
          user_id: invoice.metadata.userId,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_paid,
          status: 'succeeded',
          payment_date: new Date(invoice.created * 1000)
        });
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      
      // Record failed payment
      await supabase
        .from('payments')
        .insert({
          user_id: failedInvoice.metadata.userId,
          stripe_invoice_id: failedInvoice.id,
          amount: failedInvoice.amount_due,
          status: 'failed',
          payment_date: new Date(failedInvoice.created * 1000)
        });
      break;
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
} 