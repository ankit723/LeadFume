'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSubscriptionTypes, getUserSubscription, getUser } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, ArrowLeft, CreditCard, Package } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SubscriptionType as PrismaSubscriptionType } from '@prisma/client';


// Define a more specific type for our processed subscription types
interface ProcessedSubscriptionType extends Omit<PrismaSubscriptionType, 'priceId'> {
  priceId: {
    monthly: string;
    yearly: string;
  };
}

function CheckoutContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState<ProcessedSubscriptionType[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [priceId, setPriceId] = useState<string | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    }
    loadUser();
  }, [])
  
  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId) {
      setSelectedPlan(planId);
    }
    
    const billingCycle = searchParams.get('billing');
    if (billingCycle === 'annual') {
      setIsAnnual(true);
    }
  }, [searchParams]);
  
  // Load subscription types and user's current subscription
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all subscription types
        const typesResult = await getSubscriptionTypes();
        if (typesResult.success && typesResult.data) {
          // Make sure to handle potentially missing data and properties
          const activeTypes = typesResult.data
            .filter((type: any) => type && type.isActive === true)
            .map((type: any) => {
              let monthlyLink = '';
              let yearlyLink = '';
              // Safely parse paymentLink which is a JSON field
              if (type.priceId && typeof type.priceId === 'object' && type.priceId !== null) {
                const pl = type.priceId as { monthly?: string, yearly?: string };
                monthlyLink = pl.monthly || '';
                yearlyLink = pl.yearly || '';
              }
              return {
                id: type.id || '',
                priceId: { // Ensure this structure is consistent
                  monthly: monthlyLink,
                  yearly: yearlyLink,
                },
                name: type.name || '',
                description: type.description || '',
                price: type.price || 0,
                credits: type.credits || 0,
                annualDiscount: type.annualDiscount || 0,
                isPopular: !!type.isPopular,
                isActive: !!type.isActive,
                createdAt: type.createdAt?.toString() || new Date().toString(),
                updatedAt: type.updatedAt?.toString() || new Date().toString(),
              };
            });
          
          setSubscriptionTypes(activeTypes);
          
          // If no plan is selected from URL and we have plans, select the first one
          if (!selectedPlan && activeTypes.length > 0) {
            setSelectedPlan(activeTypes[0].id);
          }
        }
        
        // Load user's current subscription
        const userSubResult = await getUserSubscription();
        if (userSubResult.success && userSubResult.data && userSubResult.data.subscription) {
          setCurrentSubscription(userSubResult.data.subscription);
          // The paymentLink state will be set by a dedicated useEffect below,
          // based on selectedPlan and isAnnual, not directly from currentSubscription here.
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load subscription information.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedPlan]);
  
  useEffect(() => {
    if (selectedPlan && subscriptionTypes.length > 0) {
      const planDetails = subscriptionTypes.find(p => p.id === selectedPlan);
      if (planDetails && planDetails.priceId) { // Added null check for planDetails.paymentLink for safety, though it should always exist by construction
        const link = isAnnual ? planDetails.priceId.yearly : planDetails.priceId.monthly;
        setPriceId(link || null); // Set to null if link is an empty string
      } else {
        setPriceId(null); // Plan not found
      }
    } else {
      setPriceId(null); // No plan selected, or types not loaded
    }
  }, [selectedPlan, isAnnual, subscriptionTypes]);
  
  const selectedSubscriptionType = subscriptionTypes.find(type => type.id === selectedPlan);
  const selectedTypeCredits = selectedSubscriptionType?.credits || 0;
  const currentTypeCredits = currentSubscription?.subscriptionType?.credits || 0;
  
  const isUpgrade = currentSubscription && selectedTypeCredits > currentTypeCredits;
  const isDowngrade = currentSubscription && selectedTypeCredits < currentTypeCredits;

  // Calculate annual price with discount
  const getAnnualPrice = (plan: ProcessedSubscriptionType) => {
    const monthlyPrice = plan.price;
    const annualDiscount = plan.annualDiscount || 0;
    const annualPrice = monthlyPrice * 12 * (1 - annualDiscount / 100);
    return annualPrice.toFixed(2);
  };

  // Calculate monthly equivalent for annual plans
  const getMonthlyEquivalent = (plan: ProcessedSubscriptionType) => {
    const annualPrice = parseFloat(getAnnualPrice(plan));
    return (annualPrice / 12).toFixed(2);
  };

  // Get savings amount for annual plans
  const getAnnualSavings = (plan: ProcessedSubscriptionType) => {
    const monthlyTotal = plan.price * 12;
    const annualPrice = parseFloat(getAnnualPrice(plan));
    return (monthlyTotal - annualPrice).toFixed(2);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading subscription details...</span>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan.');
      return;
    }

    if (!priceId) {
      toast.error('Price ID not found.');
      return;
    }

    const payment = await fetch('/api/payment/subscription', {
      method: 'POST',
      body: JSON.stringify({
        subscriptionTypeID: selectedPlan,
        priceId: priceId,
        isAnnual: isAnnual,
        user: user
      }),
    });
    
    if (payment.ok) {
      toast.success('Purchase successful. Redirecting to payment page...');
      const data = await payment.json();
      router.push(data.url);
    } else {
      toast.error('Purchase failed. Please try again.');
    }
  }

    // if in production, show a message that the checkout is in beta and that it is not yet available`
    if (process.env.NODE_ENV === 'production') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Checkout is in beta</h1>
            <p className="text-muted-foreground">
              The checkout is in beta and is not yet available.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => router.push('/pricing')} 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Subscription Checkout
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 ml-9">Choose your perfect plan and complete your purchase</p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-muted/30 p-2 rounded-lg inline-flex items-center gap-6">
            <Label htmlFor="billing-toggle" className={`text-sm font-medium ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Monthly
            </Label>
            <div className="flex items-center gap-2">
              <Switch 
                id="billing-toggle" 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual}
              />
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Save up to 25%
              </span>
            </div>
            <Label htmlFor="billing-toggle" className={`text-sm font-medium ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Annual
            </Label>
          </div>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Available Plans</span>
                </CardTitle>
                <CardDescription>
                  Choose the plan that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {subscriptionTypes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      No subscription plans are currently available.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {subscriptionTypes.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                          selectedPlan === plan.id 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">{plan.name || 'Monthly Plan'}</h3>
                              {plan.isPopular && (
                                <Badge className="bg-primary hover:bg-primary">Popular</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">
                              {plan.description || `${plan.credits.toLocaleString()} credits, renews ${isAnnual ? 'yearly' : 'monthly'}`}
                            </p>
                          </div>
                          <div className="text-right">
                            {isAnnual ? (
                              <>
                                <div className="text-2xl font-bold text-primary">${getAnnualPrice(plan)}</div>
                                <div className="text-sm text-muted-foreground">
                                  per year (${getMonthlyEquivalent(plan)}/mo)
                                </div>
                                {plan.annualDiscount > 0 && (
                                  <div className="text-xs text-green-600 font-medium mt-1">
                                    Save ${getAnnualSavings(plan)}/year
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="text-2xl font-bold text-primary">${plan.price}</div>
                                <div className="text-sm text-muted-foreground">
                                  per month
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{plan.credits.toLocaleString()} credits</span>
                            {isAnnual && (
                              <span className="text-xs text-muted-foreground">per month</span>
                            )}
                          </div>
                          {plan.annualDiscount > 0 && !isAnnual && (
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>Save {plan.annualDiscount}% with annual billing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-2 shadow-lg sticky top-6">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedSubscriptionType ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <span>{selectedSubscriptionType.name || 'Monthly Plan'}</span>
                          {selectedSubscriptionType.isPopular && (
                            <Badge className="bg-primary hover:bg-primary">Popular</Badge>
                          )}
                        </h3>
                        <div className="flex items-center mt-2 gap-2 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>
                            {selectedSubscriptionType.credits.toLocaleString()} credits
                            {isAnnual ? ' per month (12 months)' : ' per month'}
                          </span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {isAnnual ? 'Annual Billing' : 'Monthly Billing'}
                        </Badge>
                      </div>
                      
                      {currentSubscription && (
                        <>
                          <div className="py-3">
                            <Separator />
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="text-sm font-medium">Current Plan</h4>
                            <p className="text-sm text-muted-foreground">
                              {currentSubscription.subscriptionType?.name || 'Basic Subscription'}
                            </p>
                            
                            {isUpgrade && (
                              <Badge className="mt-2 bg-green-500 hover:bg-green-600">Upgrade</Badge>
                            )}
                            {isDowngrade && (
                              <Badge className="mt-2 bg-orange-500 hover:bg-orange-600">Downgrade</Badge>
                            )}
                          </div>
                        </>
                      )}
                      
                      <div className="py-3">
                        <Separator />
                      </div>
                      
                      <div className="flex justify-between items-center font-medium text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          ${isAnnual ? getAnnualPrice(selectedSubscriptionType) : selectedSubscriptionType.price}
                        </span>
                      </div>
                      <div className="text-sm text-right text-muted-foreground">
                        {isAnnual 
                          ? `Billed annually ($${getMonthlyEquivalent(selectedSubscriptionType)}/mo equivalent)` 
                          : 'Billed monthly'
                        }
                      </div>
                      
                      {isAnnual && selectedSubscriptionType.annualDiscount > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
                          <div className="font-medium">You save ${getAnnualSavings(selectedSubscriptionType)}</div>
                          <div className="text-xs opacity-80">Compared to paying monthly for 12 months</div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        By subscribing, you agree to the terms and conditions. Your subscription will renew automatically 
                        unless cancelled before the next billing cycle.
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Please select a subscription plan.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className="w-full py-6 text-base font-semibold" 
                  disabled={!selectedPlan}
                  onClick={handlePurchase}
                >
                  {selectedPlan ? `Purchase ${isAnnual ? 'Annual' : 'Monthly'} Subscription` : 'Select a Plan'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap component with Suspense boundary to fix useSearchParams warning
const SubscriptionCheckout = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading subscription details...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
};

export default SubscriptionCheckout; 