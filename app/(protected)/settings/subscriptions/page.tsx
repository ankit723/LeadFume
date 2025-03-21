import React from 'react'
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Subscription Settings | Leadfume",
  description: "Manage your Leadfume subscription plan and billing details.",
};

const SubscriptionPage = () => {
  // Mock current plan data
  const currentPlan = {
    name: "Pro Plan",
    price: "$49.99",
    billingCycle: "monthly",
    nextBillingDate: "January 15, 2024",
    status: "Active"
  };

  // Mock available plans
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$19.99",
      description: "Perfect for individuals and small teams",
      features: ["100 leads per month", "Basic analytics", "Email support"],
      recommended: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "$49.99",
      description: "For growing businesses with advanced needs",
      features: ["1,000 leads per month", "Advanced analytics", "Priority support", "CSV exports"],
      recommended: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99.99",
      description: "For large organizations with custom requirements",
      features: ["Unlimited leads", "Custom analytics", "Dedicated support", "API access", "Team collaboration"],
      recommended: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing details.
        </p>
      </div>
      <Separator />
      
      {/* Current Plan Summary */}
      <div className="space-y-4">
        <h4 className="font-medium">Current Plan</h4>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">{currentPlan.name}</CardTitle>
              <CardDescription>
                Billing {currentPlan.billingCycle} · Next charge on {currentPlan.nextBillingDate}
              </CardDescription>
            </div>
            <Badge>{currentPlan.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentPlan.price}<span className="text-sm font-normal text-muted-foreground"> / month</span></div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel Subscription</Button>
            <Button className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Update Billing Info
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Separator />
      
      {/* Available Plans */}
      <div className="space-y-4">
        <h4 className="font-medium">Available Plans</h4>
        <p className="text-sm text-muted-foreground">
          Compare plans to find the right one for your needs.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.recommended ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-2xl font-bold mb-4">
                  {plan.price}<span className="text-sm font-normal text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.recommended ? "default" : "outline"}>
                  {currentPlan.name === plan.name ? "Current Plan" : "Switch Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Billing History */}
      <div className="space-y-4">
        <h4 className="font-medium">Billing History</h4>
        <p className="text-sm text-muted-foreground">
          View your past invoices and download receipts.
        </p>
        <Button variant="outline">View Billing History</Button>
      </div>
    </div>
  );
};

export default SubscriptionPage; 