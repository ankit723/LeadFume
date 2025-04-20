'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubscriptionTypes } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTypes, setSubscriptionTypes] = useState<any[]>([]);
  const router = useRouter();

  // Load subscription types from the database
  useEffect(() => {
    const loadSubscriptionTypes = async () => {
      setIsLoading(true);
      try {
        const result = await getSubscriptionTypes();
        if (result.success && result.data) {
          // Only show active subscription types
          const activeTypes = result.data.filter((type: any) => type.isActive);
          setSubscriptionTypes(activeTypes);
        } else {
          console.error('Failed to load subscription types:', result.error);
          // Fall back to hard-coded plans if API fails
          setSubscriptionTypes([]);
        }
      } catch (error) {
        console.error('Error loading subscription types:', error);
        setSubscriptionTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionTypes();
  }, []);

  // Hard-coded pricing tiers as fallback if no subscription types are defined
  const pricingTiers = [
    {
      name: 'Basic',
      monthlyCredits: 10000,
      annualCredits: 120000,
      monthlyPriceUSD: 49,
      annualPriceUSD: 529, 
      discount: '10%',
      isPopular: false,
    },
    {
      name: 'Starter',
      monthlyCredits: 20000,
      annualCredits: 240000,
      monthlyPriceUSD: 99,
      annualPriceUSD: 1010,
      discount: '15%',
      isPopular: true,
    },
    {
      name: 'Growth',
      monthlyCredits: 50000,
      annualCredits: 600000,
      monthlyPriceUSD: 199,
      annualPriceUSD: 1910,
      discount: '20%',
      isPopular: false,
    },
    {
      name: 'Scale',
      monthlyCredits: 100000,
      annualCredits: 1200000,
      monthlyPriceUSD: 299,
      annualPriceUSD: 2691,
      discount: '25%',
      isPopular: false,
    },
  ];

  // Use database subscription types or fall back to hard-coded ones
  const tiersToDisplay = subscriptionTypes.length > 0 
    ? subscriptionTypes.map((type: any) => ({
        id: type.id,
        name: type.name || 'Monthly Plan',
        description: type.description || '',
        features: type.description ? type.description.split('\n').filter((line: string) => line.trim()) : [],
        monthlyCredits: type.credits,
        annualCredits: type.credits * 12,
        monthlyPriceUSD: type.price,
        annualPriceUSD: Math.round(type.price * 12 * (1 - type.annualDiscount / 100)),
        discount: `${type.annualDiscount}%`, 
        isPopular: type.isPopular || false,
      }))
    : pricingTiers.map(tier => ({
        ...tier,
        features: [
          '+ Access to lead database',
          '+ Basic filtering options',
          '+ CSV exports',
          tier.name !== 'Basic' ? '+ Advanced filters' : '- Advanced filters',
          tier.name === 'Growth' || tier.name === 'Scale' ? '+ API access' : '- API access',
          tier.name === 'Scale' ? '+ Dedicated support' : '- Dedicated support',
        ]
      }));

  const handleSubscribe = (plan: any) => {
    // If this is a database plan, redirect to checkout with the plan ID
    if (plan.id) {
      router.push(`/subscriptions/checkout?plan=${plan.id}`);
    } else {
      // For hard-coded plans, just redirect to checkout
      router.push('/subscriptions/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading pricing information...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-150px)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground w-full mx-auto">
          Choose the plan that best fits your needs. All plans include access to our 250 million contact database.
        </p>
        <p className="text-muted-foreground max-w-6xl mx-auto mt-2">
          All plans allow filtering up to 100,000 leads at once per search criteria. Need more contacts export at once, or access to the entire 250 million contact database, contact us for a customized solution.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 bg-muted p-2 rounded-lg">
          <span className={!isAnnual ? "font-medium" : "text-muted-foreground"}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAnnual ? "bg-primary" : "bg-muted-foreground"
            }`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                isAnnual ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={isAnnual ? "font-medium" : "text-muted-foreground"}>Annual</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        {tiersToDisplay.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-xl shadow-md p-8 flex flex-col relative ${
              tier.isPopular ? 'border-2 border-primary' : ''
            }`}
          >
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                Best Value
              </div>
            )}
            <h3 className="text-xl font-semibold mb-4">{tier.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-yellow-400 text-2xl font-bold">$</span>
              <span className="text-4xl font-bold">
                {isAnnual ? (tier.annualPriceUSD / 12).toFixed(0) : tier.monthlyPriceUSD}
              </span>
            </div>
            <p className="text-gray-600 mb-6">Monthly Charge</p>
            
            <div className="space-y-4 flex-grow">
              {tier.features && tier.features.length > 0 ? (
                <ul className="space-y-2">
                  {tier.features.map((feature: string, idx: number) => {
                    if (feature.trim().startsWith('+')) {
                      const featureText = feature.trim().substring(1).trim();
                      return (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{featureText}</span>
                        </li>
                      );
                    } else if (feature.trim().startsWith('-')) {
                      const featureText = feature.trim().substring(1).trim();
                      return (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-500">{featureText}</span>
                        </li>
                      );
                    } else if (feature.trim()) {
                      return (
                        <li key={idx} className="flex items-start ml-6">
                          <span>{feature.trim()}</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              ) : (
                <>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>Credits: {isAnnual ? tier.annualCredits.toLocaleString() : tier.monthlyCredits.toLocaleString()}</p>
                  </div>
                </>
              )}
              {isAnnual && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    <span className="line-through text-gray-500">${tier.monthlyPriceUSD * 12}/year</span>
                    <span className="ml-2 text-green-500">${Math.round(tier.annualPriceUSD)}/year ({tier.discount} off)</span>
                  </p>
                </div>
              )}
            </div>
                                   
            <div className="mt-8 space-y-4">
              <button
                onClick={() => handleSubscribe(tier)}
                className={`w-full py-3 px-4 rounded-full font-medium transition-all duration-200 hover:transform hover:scale-105 ${
                  tier.isPopular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border-2 border-yellow-400 text-black hover:bg-yellow-50'
                }`}
              >
                Get Started
              </button>
              <p className="text-sm text-center text-gray-600 hover:text-primary cursor-pointer" onClick={() => router.push('/subscriptions/checkout')}>
                Start Your 30 Day Free Trial
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Export Timelines */}
      <div className=" mx-auto mb-8 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Data Export Timelines</h2>
        <p className="text-muted-foreground mb-4">
          We prioritize speed and accuracy in data delivery. Depending on the number of contacts requested per search criteria, here&apos;s the expected timeline:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Up to 100,000 contacts per search criteria at once → Leads will be export-ready within 12 hours.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>100,000 to 1 million contacts per search criteria at once → Leads will be export-ready within 48 hours.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>More than 1 million contacts per search criteria at once or complete 250 million records → Contact us for a custom solution.</span>
          </li>
        </ul>
      </div>


    </div>
  );
}

export default PricingPage;
