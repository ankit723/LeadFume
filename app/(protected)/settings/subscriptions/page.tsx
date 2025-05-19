"use client";

import React, { useState, useEffect } from 'react'
import {getUserSubscription, cancelSubscription } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, PackageCheck, CalendarClock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Define proper types for our data
type SubscriptionType = {
  id: string;
  name?: string | undefined;
  description?: string;
  credits: number;
  price: number;
  annualDiscount: number;
  isPopular?: boolean;
  isActive?: boolean;
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
};

type UserSubscriptionData = {
  user: User;
  subscription: Subscription | null;
  subscriptionType: SubscriptionType | null;
};

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [userData, setUserData] = useState<UserSubscriptionData | null>(null);

  // Helper functions
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
  const checkIsAnnual = (startDate?: string, renewalDate?: string): boolean => {
    if (!startDate || !renewalDate) return false;
    
    const start = new Date(startDate);
    const renewal = new Date(renewalDate);
    
    // If renewal date is more than 6 months ahead, consider it annual
    const diffMonths = (renewal.getFullYear() - start.getFullYear()) * 12 + 
                       (renewal.getMonth() - start.getMonth());
    
    return diffMonths >= 6;
  };

  // Load subscription data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load user's current subscription
        const userSubResult = await getUserSubscription();
        if (userSubResult.success && userSubResult.data) {
          // Format the data
          const formattedData: UserSubscriptionData = {
            user: {
              id: userSubResult.data.user?.id || '',
              creditsAvailable: userSubResult.data.user?.creditsAvailable || 0,
            },
            subscription: userSubResult.data.subscription ? {
              id: userSubResult.data.subscription.id || '',
              price: userSubResult.data.subscription.price || 0,
              subscriptionTypeId: userSubResult.data.subscription.subscriptionTypeId || '',
              subscriptionStartDate: userSubResult.data.subscription.subscriptionStartDate?.toString() || '',
              subscriptionRenewalDate: userSubResult.data.subscription.subscriptionRenewalDate?.toString() || '',
              isAnnual: checkIsAnnual(
                userSubResult.data.subscription.subscriptionStartDate?.toString(),
                userSubResult.data.subscription.subscriptionRenewalDate?.toString()
              ),
              subscriptionType: userSubResult.data.subscription.subscriptionType ? {
                id: userSubResult.data.subscription.subscriptionType.id || '',
                name: userSubResult.data.subscription.subscriptionType.name,
                description: userSubResult.data.subscription.subscriptionType.description,
                credits: userSubResult.data.subscription.subscriptionType.credits || 0,
                price: userSubResult.data.subscription.subscriptionType.price || 0,
                annualDiscount: userSubResult.data.subscription.subscriptionType.annualDiscount || 0,
                isPopular: userSubResult.data.subscription.subscriptionType.isPopular,
                isActive: userSubResult.data.subscription.subscriptionType.isActive
              } : undefined
            } : null,
            subscriptionType: userSubResult.data.subscriptionType ? {
              id: userSubResult.data.subscriptionType.id || '',
              name: userSubResult.data.subscriptionType.name,
              description: userSubResult.data.subscriptionType.description,
              credits: userSubResult.data.subscriptionType.credits || 0,
              price: userSubResult.data.subscriptionType.price || 0,
              annualDiscount: userSubResult.data.subscriptionType.annualDiscount || 0,
              isPopular: userSubResult.data.subscriptionType.isPopular,
              isActive: userSubResult.data.subscriptionType.isActive
            } : null
          };
          
          setUserData(formattedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load subscription information.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelSubscription();
      if (result.success) {
        toast.success('Subscription cancelled successfully.');
        // Reload the page to reflect changes
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to cancel subscription.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Data variables for rendering
  const hasSubscription = userData?.subscription != null;
  const subscription = userData?.subscription;
  const subscriptionType = userData?.subscriptionType || subscription?.subscriptionType;
  const creditsAvailable = userData?.user?.creditsAvailable || 0;
  const totalCredits = subscriptionType?.credits || 0;
  
  // Get annual plan information to display correctly
  const isSubscriptionAnnual = subscription?.isAnnual || false;
  const monthlyCredits = subscriptionType?.credits || 0;
  const totalAnnualCredits = isSubscriptionAnnual ? monthlyCredits * 12 : monthlyCredits;
  const daysRemaining = getDaysRemaining(subscription?.subscriptionRenewalDate);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading subscription details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Subscription Management
        </h3>
        <p className="text-muted-foreground mt-1">
          Manage your subscription plan, credits, and billing details.
        </p>
      </div>
      <Separator />
      
      {/* Current Plan Summary */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Current Plan</span>
        </h4>
        
        {!hasSubscription ? (
          <Card className="shadow-none">
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
                  <PackageCheck className="h-12 w-12 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">Unlock Premium Features</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Subscribe to a plan to get access to more credits and premium features to take your experience to the next level.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-none">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{subscriptionType?.name || 'Basic Plan'}</CardTitle>
                  <CardDescription>
                    Renewal on {formatDate(subscription?.subscriptionRenewalDate)}
                    {isSubscriptionAnnual && <span className="ml-1">(Annual Plan)</span>}
                  </CardDescription>
                </div>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Plan</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {subscriptionType?.name || 'Basic Plan'}
                      </span>
                      {isSubscriptionAnnual && (
                        <Badge variant="outline" className="text-xs">Annual</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                    <p className="text-lg font-semibold text-primary">
                      ${subscription?.price || 0}
                      <span className="text-sm text-muted-foreground font-normal">
                        {isSubscriptionAnnual ? ' /year' : ' /month'}
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
                        style={{ width: `${100 - (daysRemaining / (isSubscriptionAnnual ? 365 : 30)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-right text-muted-foreground">
                      {daysRemaining} days remaining
                    </p>
                  </div>
                </div>
                
                {hasSubscription && (
                  <div className="space-y-4 mb-8">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <PackageCheck className="h-5 w-5 text-primary" />
                      <span>Credits Management</span>
                    </h4>
                    
                    <div className="pt-6">
                        <div className="flex flex-col items-center text-center py-4">
                          <div className="relative mb-6">
                            <div className="w-36 h-36 rounded-full border-8 border-primary/20 flex items-center justify-center mb-3">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-primary">
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
                      </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4  bg-muted/10 p-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isCancelling} className="flex-1">
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : 'Cancel Subscription'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your subscription. You will maintain access until the end of your current billing period
                      on {formatDate(subscription?.subscriptionRenewalDate)}, but your subscription will not auto-renew.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-start gap-4">
                    <AlertDialogCancel>No, keep my subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription} className='bg-destructive hover:bg-destructive/80 text-white'>
                      Yes, cancel my subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        )}
      </div>
      
      {/* Billing History */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Billing History</span>
        </h4>
        <p className="text-sm text-muted-foreground">
          View your past transactions and download receipts
        </p>
        
        <Card className="border-2 shadow-lg">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Transactions</span>
            </CardTitle>
            <CardDescription>
              Your billing history and past payments
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/30 p-3 text-sm font-medium grid grid-cols-4 gap-4">
                <div>Date</div>
                <div>Description</div>
                <div>Amount</div>
                <div className="text-right">Status</div>
              </div>
              <div className="divide-y">
                {hasSubscription ? (
                  <div className="p-3 text-sm grid grid-cols-4 gap-4">
                    <div>{formatDate(subscription?.subscriptionStartDate)}</div>
                    <div>Subscription - {subscriptionType?.name}</div>
                    <div>${subscription?.price}</div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Your billing history will appear here once you subscribe to a plan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage; 