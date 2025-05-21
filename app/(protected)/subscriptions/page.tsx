'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSubscription } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, AlertCircle, CreditCard, Package, CalendarClock, ArrowUpRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define proper types for our data
type SubscriptionType = {
  id: string;
  name?: string | undefined;
  credits: number;
  price: number;
  annualDiscount: number;
};

type Subscription = {
  id: string;
  price: number;
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  subscriptionRenewalDate: string;
  subscriptionType?: SubscriptionType;
  isAnnual?: boolean;
};

type User = {
  id: string;
  creditsAvailable: number;
  customerId: string;
  // Other user properties can be added as needed
};

type UserSubscriptionData = {
  user: User;
  subscription: Subscription | null;
  subscriptionType: SubscriptionType | null;
};

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserSubscriptionData | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const loadSubscription = async () => {
      setIsLoading(true);
      try {
        const result = await getUserSubscription();
        if (result.success && result.data) {
          // Format the data to match our type expectations
          const formattedData: UserSubscriptionData = {
            user: {
              id: result.data.user?.id || '',
              customerId: result.data.user?.customerId || '',
              creditsAvailable: result.data.user?.creditsAvailable || 0,
            },
            subscription: result.data.subscription ? {
              id: result.data.subscription.id || '',
              price: result.data.subscription.price || 0,
              subscriptionTypeId: result.data.subscription.subscriptionTypeId || '',
              subscriptionStartDate: result.data.subscription.subscriptionStartDate?.toString() || '',
              subscriptionRenewalDate: result.data.subscription.subscriptionRenewalDate?.toString() || '',
              isAnnual: isAnnual(
                result.data.subscription.subscriptionStartDate?.toString(),
                result.data.subscription.subscriptionRenewalDate?.toString()
              ),
              subscriptionType: result.data.subscription.subscriptionType ? {
                id: result.data.subscription.subscriptionType.id || '',
                name: result.data.subscription.subscriptionType.name,
                credits: result.data.subscription.subscriptionType.credits || 0,
                price: result.data.subscription.subscriptionType.price || 0,
                annualDiscount: result.data.subscription.subscriptionType.annualDiscount || 0,
              } : undefined
            } : null,
            subscriptionType: result.data.subscriptionType ? {
              id: result.data.subscriptionType.id || '',
              name: result.data.subscriptionType.name,
              credits: result.data.subscriptionType.credits || 0,
              price: result.data.subscriptionType.price || 0,
              annualDiscount: result.data.subscriptionType.annualDiscount || 0,
            } : null
          };
          
          setUserData(formattedData);
        } else {
          toast.error(result.error || 'Failed to load subscription information.');
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        toast.error('Failed to load subscription information.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscription();
  }, []);

  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return 0;
    
    const renewalDate = new Date(dateString);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Calculate if subscription is annual based on renewal date
  const isAnnual = (startDate?: string, renewalDate?: string): boolean => {
    if (!startDate || !renewalDate) return false;
    
    const start = new Date(startDate);
    const renewal = new Date(renewalDate);
    
    // If renewal date is more than 6 months ahead, consider it annual
    const diffMonths = (renewal.getFullYear() - start.getFullYear()) * 12 + 
                       (renewal.getMonth() - start.getMonth());
    
    return diffMonths >= 6;
  };

  const handleManageSubscription = async () => {
    const manageSubscriptionUrl = await fetch('/api/payment/create-portal-session', {
      method: 'POST',
      body: JSON.stringify({customerId: userData?.user.customerId}),
    });

    const data = await manageSubscriptionUrl.json();
    
    if (data.sessionUrl) {
      window.location.href = data.sessionUrl;
    } else {
      console.error('No session URL returned from Stripe');
      toast.error('Failed to create billing portal session');
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading subscription details...</span>
      </div>
    );
  }
  
  const hasSubscription = userData?.subscription != null;
  const subscription = userData?.subscription;
  const subscriptionType = userData?.subscriptionType || subscription?.subscriptionType;
  const creditsAvailable = userData?.user?.creditsAvailable || 0;
  const totalCredits = subscriptionType?.credits || 0;
  const creditsUsed = totalCredits - creditsAvailable;
  const creditsPercentage = totalCredits > 0 ? Math.min(100, Math.round((creditsUsed / totalCredits) * 100)) : 0;
  const daysRemaining = getDaysRemaining(subscription?.subscriptionRenewalDate);
  
  // Get annual plan information to display correctly
  const isSubscriptionAnnual = subscription?.isAnnual || false;
  const monthlyCredits = subscriptionType?.credits || 0;
  const totalAnnualCredits = isSubscriptionAnnual ? monthlyCredits * 12 : monthlyCredits;
  
  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              My Subscription
            </h1>
            <p className="text-muted-foreground mt-1">Manage your subscription and credits</p>
          </div>
          <Button 
            onClick={() => router.push('/subscriptions/checkout')}
            variant={hasSubscription ? "outline" : "default"}
            className="group"
          >
            {hasSubscription ? 'Change Plan' : 'Get Subscription'}
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </div>
        
        {!hasSubscription ? (
          <Card className="border-2 shadow-xl">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>No Active Subscription</span>
              </CardTitle>
              <CardDescription>
                You don&apos;t have an active subscription at the moment.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">Unlock Premium Features</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Subscribe to a plan to get access to more credits and premium features to take your experience to the next level.
                </p>
                <Button 
                  onClick={() => router.push('/subscriptions/checkout')}
                  className="px-8 py-6 text-base font-medium"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  View Available Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span>Subscription Details</span>
                    </CardTitle>
                    <CardDescription>
                      Your current subscription information
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Plan</p>
                      <div className="flex items-center mt-2 gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>
                          {subscriptionType?.name || 'Monthly Plan'}
                          {subscription?.isAnnual && (
                            <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                      <p className="text-lg font-semibold text-primary">
                        ${subscription?.price || 0}
                        <span className="text-sm text-muted-foreground font-normal">
                          {subscription?.isAnnual ? ' /year' : ' /month'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col border rounded-lg overflow-hidden">
                    <div className="p-4 flex items-center gap-3 border-b">
                      <div className="p-2 bg-muted/50 rounded-full">
                        <CalendarClock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Subscription Timeline</p>
                        <p className="text-xs text-muted-foreground">
                          Active since {formatDate(subscription?.subscriptionStartDate)}
                          {subscription?.isAnnual && (
                            <span className="ml-1">(Annual Plan)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/10">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm font-medium">Next Renewal</span>
                        <span className="text-sm font-medium">{formatDate(subscription?.subscriptionRenewalDate)}</span>
                      </div>

                      <div className="w-full bg-muted/30 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${100 - (daysRemaining / 30) * 100}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-xs text-right text-muted-foreground">
                        {daysRemaining} days remaining
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium mb-3">Credits Usage</p>
                    <Progress value={creditsPercentage} className="h-2.5 mb-2" />
                    <div className="flex justify-between mt-1 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-xs">{creditsUsed.toLocaleString()} used</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-muted/50 rounded-full"></div>
                        <span className="text-xs font-medium">{creditsAvailable.toLocaleString()} remaining</span>
                      </div>
                    </div>
                    {isSubscriptionAnnual && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">{monthlyCredits.toLocaleString()} credits per month</span> × 12 months = {totalAnnualCredits.toLocaleString()} total credits
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="w-full flex justify-center items-center">
                <Button onClick={()=>handleManageSubscription()}>Manage Subscription</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Credits Management</span>
                </CardTitle>
                <CardDescription>
                  Monitor and manage your available credits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center py-4">
                  <div className="relative mb-6">
                    <div className="w-36 h-36 rounded-full border-8 border-primary/20 flex items-center justify-center mb-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {creditsAvailable.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">of {isSubscriptionAnnual ? totalAnnualCredits.toLocaleString() : totalCredits.toLocaleString()}</p>
                      </div>
                    </div>
                    <svg className="absolute top-0 left-0" width="144" height="144" viewBox="0 0 144 144">
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="68" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8"
                        strokeDasharray={Math.PI * 136} 
                        strokeDashoffset={(Math.PI * 136) * (1 - (creditsAvailable / (isSubscriptionAnnual ? totalAnnualCredits : totalCredits)))} 
                        className="text-primary" 
                        transform="rotate(-90, 72, 72)"
                      />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">Credits Available</h3>
                  {isSubscriptionAnnual ? (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">
                        Annual plan with {monthlyCredits.toLocaleString()} credits per month
                      </p>
                      <p className="text-sm font-medium text-primary mb-6">
                        {totalAnnualCredits.toLocaleString()} total credits for the year
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-6">
                      Your credits will be replenished on {formatDate(subscription?.subscriptionRenewalDate)}
                    </p>
                  )}
                  
                  <div className="w-full p-4 rounded-lg bg-muted/30 flex items-center gap-3 mb-6">
                    <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-500" />
                    <p className="text-sm text-left">
                      {isSubscriptionAnnual ? (
                        <>Your annual subscription includes {monthlyCredits.toLocaleString()} credits per month, for a total of {totalAnnualCredits.toLocaleString()} credits.</>
                      ) : (
                        <>Your subscription includes {totalCredits.toLocaleString()} credits per month. Credits are automatically replenished on your renewal date.</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage; 