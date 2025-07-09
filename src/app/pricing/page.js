// PUBLIC PRICING PAGE ONLY
// Do not show account/payment info, user-specific banners, or current plan here.
// If you need to show user/account info, do it in /payments or /account/billing only.

'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Building2, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  ArrowRight,
  Brain,
  Users,
  BarChart3,
  GitBranch,
  MessageSquare,
  Calendar,
  Shield,
  Zap as Lightning
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import flowLogo from '@/assets/images/flow-logo.png';
import Image from 'next/image';
import './PricingPage.css';
import AnimatedAIChip from '@/components/AnimatedBackground/AnimatedAIChip';
import { createClient } from '@/utils/supabase/client';

const plans = [
  {
    name: 'Sigma',
    price: '$8',
    period: 'per user/month',
    description: 'For solo creators, freelancers, and loners who want AI-powered productivity',
    features: [
      'AI-powered task generation (unlimited for 1 user)',
      'Personal Kanban boards',
      'Solo project templates',
      'Basic analytics',
      '1GB file storage',
      'Email support',
      'No team collaboration',
      'No sharing features',
    ],
    popular: false,
    icon: Zap,
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500'
  },
  {
    name: 'Pro',
    price: '$25',
    period: 'per month',
    description: 'For community builders, families, and friends who want to collaborate and share',
    features: [
      'Everything in Sigma',
      'Up to 5 users included',
      'Share tasks with family & friends',
      'Community project boards',
      'Task sharing & assignment',
      'Invite-only collaboration',
      'Community chat',
      '5GB file storage',
      'Priority support',
    ],
    popular: true,
    icon: Crown,
    overages: [
      { text: 'Additional users', price: '$4 per user' },
      { text: 'Extra storage', price: '$0.10 per GB' }
    ],
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500'
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For startups and teams who need advanced collaboration and analytics',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced team analytics & insights',
      'Custom team workflows & automations',
      'Team performance dashboards',
      'Cross-project resource allocation',
      'Advanced reporting & exports',
      'Team communication integrations',
      'Custom branding & white-labeling',
      'Sprint planning & retrospectives',
      'Team velocity tracking',
      'Risk assessment & mitigation',
      '50GB file storage',
      'Dedicated onboarding',
    ],
    popular: false,
    icon: Building2,
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per month',
    description: 'For Businesses with custom compliance needs',
    features: [
      'Everything in Team',
      'Unlimited everything',
      'SSO & advanced security',
      'Custom integrations & API access',
      'Dedicated account manager',
      '24/7 priority support',
      'Advanced compliance & audit logs',
      'Custom AI model training',
      'On-premise deployment options',
      'Advanced analytics & BI tools',
      'Custom workflow automation',
      'Enterprise-grade SLA guarantees'
    ],
    popular: false,
    icon: Shield,
    custom: true,
    color: 'from-gray-500/20 to-gray-600/20',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-500'
  }
];

const competitors = [
  {
    name: 'Jira',
    logo: '🔴',
    pros: ['Comprehensive features', 'Enterprise-grade'],
    cons: ['Complex setup', 'Expensive', 'Overkill for small teams', 'Steep learning curve'],
    pricing: '$7.50/user/month'
  },
  {
    name: 'Linear',
    logo: '🟣',
    pros: ['Fast & modern', 'Developer-focused'],
    cons: ['Limited AI features', 'No advanced analytics', 'Basic team collaboration', 'No custom workflows'],
    pricing: '$8/user/month'
  },
  {
    name: 'Notion',
    logo: '⚫',
    pros: ['Flexible workspace', 'Good documentation'],
    cons: ['Not purpose-built for PM', 'No AI project management', 'Complex for simple tasks', 'Limited automation'],
    pricing: '$8/user/month'
  },
  {
    name: 'Flow',
    logo: '🟦',
    pros: ['AI-powered project management', 'Intuitive interface', 'Perfect for freelancers to enterprises', 'Built-in team collaboration', 'Advanced analytics'],
    cons: ['Newer platform', 'Fewer integrations (growing)'],
    pricing: '$25/month (unlimited users)',
    highlight: true
  }
];

// Separate component that uses useSearchParams
function PricingPageContent() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Free Trial');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for Stripe checkout success/canceled states
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    if (canceled === 'true') {
      setShowCanceled(true);
      setTimeout(() => setShowCanceled(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check if user is logged in (client-side)
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setIsLoggedIn(!!data?.user);
      if (data?.user) {
        // Fetch subscription info from API
        try {
          const res = await fetch('/api/stripe/subscription');
          if (res.ok) {
            const { subscription } = await res.json();
            if (subscription?.plan_id) {
              setCurrentPlan(subscription.plan_id.split('-')[0]);
            } else {
              setCurrentPlan('Free Trial');
            }
          } else {
            setCurrentPlan('Free Trial');
          }
        } catch {
          setCurrentPlan('Free Trial');
        }
      } else {
        setCurrentPlan('Free Trial');
      }
    });
  }, []);

  const getYearlyPrice = (plan) => {
    if (plan.name === 'Sigma') return '$80';
    if (plan.name === 'Pro') return '$250';
    if (plan.name === 'Team') return '$990';
    return 'Custom';
  };

  const handleCTAClick = (planName) => {
    if (isLoggedIn) {
      window.location.href = `/payments?plan=${encodeURIComponent(planName)}`;
    } else {
      window.location.href = '/login';
    }
  };

  // Only show the Free Trial banner if this is the account pricing page (not public landing)
  // For the public pricing page, always hide the trial/current plan banner
  const showTrialBanner = false; // Always false for public pricing

  return (
    <div className="min-h-screen bg-white font-['Inter'] relative overflow-hidden">
      {/* Background Animation */}
      <div className="pricing-background">
        <div className="background-circles">
          <div className="circle-container">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>
            <div className="circle circle7"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="h-[70px] bg-white/40 backdrop-blur-md border-b border-white/20 shadow-lg shadow-purple-500/20 rounded-b-2xl relative z-10">
        {/* PUBLIC PAGE: Do not add account links or user info here. Update navigation in /payments for logged-in/account context. */}
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src={flowLogo} alt="Flow Logo" width={40} height={40} />
            <span className="text-2xl font-semibold text-gray-800">Flow.</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              Home
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Success/Canceled Messages */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 notification">
          <CheckCircle className="w-5 h-5" />
          <span>Payment successful! Welcome to Flow Pro!</span>
          <button onClick={() => setShowSuccess(false)} className="ml-2">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {showCanceled && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 notification">
          <AlertCircle className="w-5 h-5" />
          <span>Payment was canceled. You can try again anytime.</span>
          <button onClick={() => setShowCanceled(false)} className="ml-2">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-800 mb-6 hero-title">
            <span className="inline-flex items-center space-x-3 justify-center">
              <AnimatedAIChip size={56} />
              <span>AI-Powered</span>
            </span>
            <br />
            <span>Project Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto hero-description">
            From freelancers to enterprises - the only project management tool that thinks with you, not against you
          </p>

          {/* Enhanced Billing Toggle */}
          <div className="flex flex-col items-center space-y-6 mb-16 billing-toggle">
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
                className="relative inline-flex h-12 w-24 items-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 toggle-switch"
              >
                <span
                  className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md toggle-handle ${
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
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-8 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative flex flex-col h-full p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 plan-card ${
                  plan.popular
                    ? 'border-purple-300 shadow-lg shadow-purple-500/20 bg-gradient-to-br from-purple-50 to-white'
                    : `border-gray-200 bg-white hover:border-gray-300`
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-lg popular-badge">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6 flex-1 flex flex-col">
                  {/* Plan Header */}
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} mb-4 plan-icon`}>
                      <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-gray-800 price-display">
                        {billingCycle === 'monthly' ? plan.price : getYearlyPrice(plan)}
                      </div>
                      <div className="text-sm text-gray-500">{plan.period}</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{plan.description}</p>
                  </div>

                  {/* CTA Button - now above features */}
                  <div className="mt-6 mb-2">
                    <button
                      onClick={() => handleCTAClick(plan.name)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 inline-block text-center cta-button ${
                        plan.name === 'Free'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : plan.name === 'Enterprise'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'
                      }`}
                    >
                      {isLoggedIn
                        ? plan.name === 'Enterprise'
                          ? 'Contact Sales'
                          : 'Choose Plan'
                        : plan.name === 'Enterprise'
                        ? 'Contact Sales'
                        : 'Get Started'}
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1">
                    <div className="text-sm font-semibold text-gray-700">Features included:</div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3 text-sm feature-item">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="w-6 h-6 text-green-500 bg-green-100 rounded-full p-0.5 shadow-sm" />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations && (
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="text-sm font-semibold text-gray-500">Limitations:</div>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start space-x-3 text-sm text-gray-500 feature-item">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Overages */}
                  {plan.overages && (
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="text-sm font-semibold text-gray-500">Usage Based Pricing:</div>
                      <ul className="space-y-2">
                        {plan.overages.map((overage, index) => (
                          <li key={index} className="flex items-start space-x-3 text-sm text-gray-500 feature-item">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                              {overage.text}: <span className="font-medium">{overage.price}</span>
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
      </section>

      {/* Competitive Comparison */}
      <section className="py-20 px-8 relative z-10 section-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Flow Stands Out
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how Flow compares to other project management tools in the market
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Features</th>
                    {competitors.map((competitor) => (
                      <th key={competitor.name} className={`px-6 py-4 text-center text-sm font-semibold ${
                        competitor.highlight ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                      }`}>
                        <div className="flex flex-col items-center space-y-2">
                          <span className="text-2xl">{competitor.logo}</span>
                          <span className="font-bold">{competitor.name}</span>
                          <span className="text-xs text-gray-500">{competitor.pricing}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">AI-Powered Task Generation</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Intuitive Interface</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' || competitor.name === 'Linear' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Advanced Analytics</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' || competitor.name === 'Jira' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Team Collaboration</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Custom Workflows</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' || competitor.name === 'Jira' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Freelancer-Friendly</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Enterprise Ready</td>
                    {competitors.map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        {competitor.name === 'Flow' || competitor.name === 'Jira' ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-First Approach</h3>
              <p className="text-gray-600 text-sm">Built from the ground up with AI to enhance productivity, not just add features</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Scalable for All Teams</h3>
              <p className="text-gray-600 text-sm">From solo freelancers to enterprise teams - one platform that grows with you</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Actionable Insights</h3>
              <p className="text-gray-600 text-sm">Advanced analytics that help you make better decisions, not just track metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-gray-50 relative z-10 section-fade-in">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="faq-item p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How does AI task generation work?</h3>
                <p className="text-gray-600">Our AI analyzes your project context and automatically generates relevant tasks, estimates, and dependencies to keep your projects moving forward.</p>
              </div>
              <div className="faq-item p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="faq-item p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div className="faq-item p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What integrations are available?</h3>
                <p className="text-gray-600">We integrate with GitHub, Slack, Google Calendar, and more. New integrations are added regularly based on user feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 relative z-10 section-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to experience AI-powered project management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams already using Flow to streamline their workflow and boost productivity.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 cta-button"
          >
            <span>Start Building Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense boundary
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white font-['Inter'] relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    }>
      <PricingPageContent />
    </Suspense>
  );
} 