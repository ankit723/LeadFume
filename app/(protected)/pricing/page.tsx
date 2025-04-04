'use client';

import { useState } from 'react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers = [
    {
      name: 'Basic',
      monthlyCredits: 10000,
      annualCredits: 120000,
      monthlyPriceUSD: 49,
      annualPriceUSD: 588,
      discount: '10%',
    },
    {
      name: 'Starter',
      monthlyCredits: 20000,
      annualCredits: 240000,
      monthlyPriceUSD: 99,
      annualPriceUSD: 1188,
      discount: '15%',
    },
    {
      name: 'Growth',
      monthlyCredits: 50000,
      annualCredits: 600000,
      monthlyPriceUSD: 199,
      annualPriceUSD: 2388,
      discount: '20%',
    },
    {
      name: 'Scale',
      monthlyCredits: 100000,
      annualCredits: 1200000,
      monthlyPriceUSD: 299,
      annualPriceUSD: 3588,
      discount: '25%',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-150px)]">
      {/* Billing Toggle */}
      <div className="mb-8 flex items-center gap-4">
        <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            className={`${
              isAnnual ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-white'
            } inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out shadow-lg`}
          />
        </button>
        <span className={`text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          Annually
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
        {pricingTiers.map((tier, index) => (
          <div
            key={tier.name}
            className={`bg-white rounded-xl shadow-md p-8 flex flex-col relative ${
              index === 1 ? 'border-2 border-primary' : ''
            }`}
          >
            {index === 1 && (
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
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500"
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
              {isAnnual && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500"
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
                    <span className="line-through text-gray-500">${tier.monthlyPriceUSD}/mo</span>
                    <span className="ml-2 text-green-500">Save {tier.discount}</span>
                  </p>
                </div>
              )}
            </div>
                                   
            <div className="mt-8 space-y-4">
              <button
                className={`w-full py-3 px-4 rounded-full font-medium transition-all duration-200 hover:transform hover:scale-105 ${
                  index === 1
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border-2 border-yellow-400 text-black hover:bg-yellow-50'
                }`}
              >
                Get Started
              </button>
              <p className="text-sm text-center text-gray-600 hover:text-primary cursor-pointer">
                Start Your 30 Day Free Trial
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
