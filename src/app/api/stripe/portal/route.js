import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Check if Stripe is properly configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here';
const stripe = isStripeConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req) {
  try {
    // If Stripe is not configured, return a placeholder response
    if (!isStripeConfigured) {
      console.warn('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
      return new NextResponse('Stripe is not configured. Please contact support.', { status: 503 });
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

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return new NextResponse('No subscription found', { status: 404 });
    }

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new NextResponse('Error creating portal session', { status: 500 });
  }
} 