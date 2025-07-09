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
      return NextResponse.json({ error: 'Stripe is not configured. Please contact support.' }, { status: 503 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, planId } = await req.json();

    // Create a checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        planId: planId
      }
    });

    console.log('Stripe session created:', { sessionId: stripeSession.id, url: stripeSession.url });
    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message || 'Error creating checkout session' }, { status: 500 });
  }
} 