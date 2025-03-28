
const PricingPage = () => {
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
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
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
              <span className="text-4xl font-bold">{tier.monthlyPriceUSD}</span>
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
                    <p>Monthly Credits: {tier.monthlyCredits.toLocaleString()}</p>
              </div>
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
                    <p>Annual Credits: {tier.annualCredits.toLocaleString()}</p>
              </div>
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
                    <p>Annual Price (Before Discount): ${tier.annualPriceUSD}</p>
              </div>
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
                    <p>Discount: {tier.discount}</p>
                    </div>
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
