'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  Building2, 
  Users, 
  Database, 
  HardDrive, 
  Globe, 
  Shield, 
  Clock, 
  MessageSquare,
  ArrowRight,
  Star,
  AlertCircle,
  Info,
  Brain,
  BarChart3,
  GitBranch,
  Calendar
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AnimatedAIChip from '@/components/AnimatedBackground/AnimatedAIChip';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Stripe price IDs (replace these placeholders with your real Stripe price IDs later)
const STRIPE_PRICE_IDS = {
  'Sigma-monthly': 'price_1RgwzCCz4PvI8Ojfeym855QG',
  'Sigma-yearly': 'price_1RgwzpCz4PvI8OjfcMX50wF2',
  'Pro-monthly': 'price_1Rdi05Cz4PvI8OjfsmEO62yD',
  'Pro-yearly': 'price_1RdiNHCz4PvI8Ojf7HDL9pf5',
  'Team-monthly': 'price_1Rdi8hCz4PvI8OjfFVPUiXKI',
  'Team-yearly': 'price_1RgxD0Cz4PvI8OjfujcT5msa',
};

const plans = [
  {
    name: 'Sigma',
    price: '$8',
    period: 'per user/month',
    description: 'For solo creators, freelancers, and loners who want AI-powered productivity',
    features: [
      { text: 'AI-powered task generation (unlimited for 1 user)', included: true },
      { text: 'Personal Kanban boards', included: true },
      { text: 'Solo project templates', included: true },
      { text: 'Basic analytics', included: true },
      { text: '1GB file storage', included: true },
      { text: 'Email support', included: true },
    ],
    popular: false,
    icon: Zap,
  },
  {
    name: 'Pro',
    price: '$25',
    period: 'per month',
    description: 'For community builders, families, and friends who want to collaborate and share',
    features: [
      { text: 'Everything in Sigma', included: true },
      { text: 'Up to 5 users included', included: true },
      { text: 'Share tasks with family & friends', included: true },
      { text: 'Community project boards', included: true },
      { text: 'Task sharing & assignment', included: true },
      { text: 'Invite-only collaboration', included: true },
      { text: 'Community chat', included: true },
      { text: '5GB file storage', included: true },
      { text: 'Priority support', included: true },
    ],
    popular: true,
    icon: Crown,
    overages: [
      { text: 'Additional users', price: '$4 per user' },
      { text: 'Extra storage', price: '$0.10 per GB' }
    ]
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For startups and teams who need advanced collaboration and analytics',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Advanced team analytics & insights', included: true },
      { text: 'Custom team workflows & automations', included: true },
      { text: 'Team performance dashboards', included: true },
      { text: 'Cross-project resource allocation', included: true },
      { text: 'Advanced reporting & exports', included: true },
      { text: 'Team communication integrations', included: true },
      { text: 'Custom branding & white-labeling', included: true },
      { text: 'Sprint planning & retrospectives', included: true },
      { text: 'Team velocity tracking', included: true },
      { text: 'Risk assessment & mitigation', included: true },
      { text: '50GB file storage', included: true },
      { text: 'Dedicated onboarding', included: true },
    ],
    popular: false,
    icon: Building2
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per month',
    description: 'For Businesses with custom compliance needs',
    features: [
      { text: 'Everything in Team', included: true },
      { text: 'Unlimited everything', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: 'Custom integrations & API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Advanced compliance & audit logs', included: true },
      { text: 'Custom AI model training', included: true },
      { text: 'On-premise deployment options', included: true },
      { text: 'Advanced analytics & BI tools', included: true },
      { text: 'Custom workflow automation', included: true },
      { text: 'Enterprise-grade SLA guarantees', included: true }
    ],
    popular: false,
    icon: Shield,
    custom: true
  }
];

// Separate component that uses useSearchParams
function PaymentsPageContent() {
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeTab, setActiveTab] = useState('plans');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ensure plans array is available
  const availablePlans = plans || [];

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Get plan from URL params
    const planParam = searchParams.get('plan');
    if (planParam) {
      // Find a plan with a matching name (case-insensitive)
      const match = availablePlans.find(p => p.name.toLowerCase() === planParam.toLowerCase());
      if (match) setSelectedPlan(match.name);
    }
  }, [searchParams, availablePlans, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    // Check for success/canceled payment status
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success) {
      toast.success('Payment successful! Your subscription is now active.');
      router.replace('/dashboard/payments'); // Remove query params
    }
    
    if (canceled) {
      toast.error('Payment canceled. Please try again.');
      router.replace('/dashboard/payments'); // Remove query params
    }
  }, [searchParams, router, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    // Fetch current subscription status
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/stripe/subscription');
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };
    
    fetchSubscription();
  }, [isClient]);

  // Don't render anything until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-['Inter'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (planName) => {
    try {
      setLoadingPlanId(planName);
      const priceId = STRIPE_PRICE_IDS[`${planName}-${billingCycle}`];
      if (!priceId || priceId.includes('PLACEHOLDER')) {
        toast.error('This plan is not yet available for checkout. Please contact support or try another plan.');
        setLoadingPlanId(null);
        return;
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planId: `${planName}-${billingCycle}`,
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { sessionId } = data;
      
      if (!sessionId) {
        throw new Error('No session ID received from server');
      }

      const stripe = await stripePromise;
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoadingPlanId('manage');
      
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const { url } = await response.json();
      
      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const getYearlyPrice = (plan) => {
    if (plan.name === 'Sigma') return '$80';
    if (plan.name === 'Pro') return '$250';
    if (plan.name === 'Team') return '$990';
    return 'Custom';
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">
          <span className="inline-flex items-center space-x-3 justify-center">
            <AnimatedAIChip size={56} />
            <span>AI-Powered</span>
          </span>
          <br />
          <span>Project Management</span>
        </h1>
        <p className="text-lg text-gray-600">From freelancers to enterprises - the only project management tool that thinks with you, not against you</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Current Plan</h2>
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-medium text-gray-800">
                {subscription?.plan_id?.split('-')[0] || 'Free'} Plan
              </span>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                subscription?.status === 'active' 
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-yellow-500/20 text-yellow-600'
              }`}>
                {subscription?.status === 'active' ? 'Active' : 'Free'}
              </span>
            </div>
            <p className="text-gray-600">
              {subscription?.status === 'active' 
                ? `$${subscription.amount}/month • Next billing: ${new Date(subscription.current_period_end).toLocaleDateString()}`
                : 'No active subscription'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setActiveTab('billing')}
            >
              View Usage
            </button>
            {subscription?.status === 'active' ? (
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                onClick={handleManageSubscription}
                disabled={loadingPlanId === 'manage'}
              >
                {loadingPlanId === 'manage' ? 'Loading...' : 'Manage Plan'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'plans', label: 'Plans & Pricing' },
            { id: 'billing', label: 'Billing & Usage' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-8">
          {/* Enhanced Billing Toggle */}
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">Choose Your Billing Cycle</h3>
              <p className="text-gray-600">Flexible options to match your workflow</p>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <div className={`text-center transition-all duration-300 ${billingCycle === 'monthly' ? 'scale-110' : 'scale-100'}`}>
                <span className={`text-lg font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-gray-800' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <p className="text-sm text-gray-500 mt-1">Pay as you go</p>
              </div>
              
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-12 w-24 items-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <span
                  className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md ${
                    billingCycle === 'yearly' ? 'translate-x-14' : 'translate-x-1'
                  }`}
                />
              </button>
              
              <div className={`text-center transition-all duration-300 ${billingCycle === 'yearly' ? 'scale-110' : 'scale-100'}`}>
                <span className={`text-lg font-semibold transition-colors ${billingCycle === 'yearly' ? 'text-gray-800' : 'text-gray-500'}`}>
                  Yearly
                </span>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <span className="text-sm bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                    Save 20%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Best value</p>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-xl border ${
                  plan.popular
                    ? 'border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <plan.icon className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {billingCycle === 'monthly' ? plan.price : getYearlyPrice(plan)}
                    </div>
                    <div className="text-sm text-gray-500">{plan.period}</div>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      plan.name === 'Sigma'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : plan.name === 'Enterprise'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        window.location.href = 'mailto:enterprise@flow.com';
                      } else {
                        handleSubscribe(plan.name);
                      }
                    }}
                    disabled={loadingPlanId === plan.name || (subscription?.status === 'active' && subscription?.plan_id?.startsWith(plan.name))}
                  >
                    {loadingPlanId === plan.name
                      ? 'Loading...'
                      : subscription?.status === 'active' && subscription?.plan_id?.startsWith(plan.name)
                      ? 'Current Plan'
                      : plan.name === 'Enterprise'
                      ? 'Contact Sales'
                      : plan.name === 'Sigma'
                      ? 'Subscribe'
                      : 'Subscribe'}
                  </button>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Features included:</div>
                    <ul className="space-y-2">
                      {(plan.features || []).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          {feature.included ? (
                            <div className="flex-shrink-0">
                              <Check className="w-6 h-6 text-green-600 bg-green-100 rounded-full p-0.5 shadow-sm" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-gray-800' : 'text-gray-500'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.overages && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Usage Based Pricing:</div>
                      <ul className="space-y-1">
                        {(plan.overages || []).map((overage, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-500">
                            <Info className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {overage.text}: {overage.price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Billing & Usage</h2>
          <p className="text-gray-600">This section will show billing history and usage statistics.</p>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentsPage() {
  try {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-['Inter'] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment information...</p>
          </div>
        </div>
      }>
        <PaymentsPageContent />
      </Suspense>
    );
  } catch (error) {
    console.error('Error rendering PaymentsPage:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-['Inter'] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load payment information. Please try again later.</p>
        </div>
      </div>
    );
  }
}