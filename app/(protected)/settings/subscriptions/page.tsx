"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

const SubscriptionPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Mock current plan data
  const currentPlan = {
    name: "Starter",
    monthlyPriceUSD: 99,
    annualPriceUSD: 1188,
    billingCycle: "monthly",
    nextBillingDate: "January 15, 2024",
    status: "Active",
    monthlyCredits: 20000,
    annualCredits: 240000,
    discount: "15%"
  };

  // Available plans matching pricing page exactly
  const plans = [
    {
      id: "basic",
      name: "Basic",
      monthlyCredits: 10000,
      annualCredits: 120000,
      monthlyPriceUSD: 49,
      annualPriceUSD: 588,
      discount: "10%",
      features: ["10,000 monthly credits"],
      recommended: false
    },
    {
      id: "starter",
      name: "Starter",
      monthlyCredits: 20000,
      annualCredits: 240000,
      monthlyPriceUSD: 99,
      annualPriceUSD: 1188,
      discount: "15%",
      features: ["20,000 monthly credits"],
      recommended: true
    },
    {
      id: "growth",
      name: "Growth",
      monthlyCredits: 50000,
      annualCredits: 600000,
      monthlyPriceUSD: 199,
      annualPriceUSD: 2388,
      discount: "20%",
      features: ["50,000 monthly credits"],
      recommended: false
    },
    {
      id: "scale",
      name: "Scale",
      monthlyCredits: 100000,
      annualCredits: 1200000,
      monthlyPriceUSD: 299,
      annualPriceUSD: 3588,
      discount: "25%",
      features: ["100,000 monthly credits"],
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
            <div className="text-3xl font-bold">
              ${isAnnual ? (currentPlan.annualPriceUSD / 12).toFixed(0) : currentPlan.monthlyPriceUSD}
              <span className="text-sm font-normal text-muted-foreground"> / month</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {isAnnual ? currentPlan.annualCredits.toLocaleString() : currentPlan.monthlyCredits.toLocaleString()} credits per month
            </div>
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
      
      {/* Billing Toggle */}
      <div className="flex justify-center">
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

      {/* Available Plans */}
      <div className="space-y-4">
        <h4 className="font-medium">Available Plans</h4>
        <p className="text-sm text-muted-foreground">
          Compare plans to find the right one for your needs.
        </p>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <Card key={plan.id} className={`flex flex-col ${index === 1 ? 'border-primary' : ''}`}>
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Best Value
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {isAnnual ? plan.annualCredits.toLocaleString() : plan.monthlyCredits.toLocaleString()} credits per month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-2xl font-bold mb-4">
                  ${isAnnual ? (plan.annualPriceUSD / 12).toFixed(0) : plan.monthlyPriceUSD}
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </div>
                {isAnnual && (
                  <div className="text-xs text-muted-foreground mb-4">
                    <span className="line-through">${plan.monthlyPriceUSD}/mo</span>
                    <span className="ml-2 text-sm text-green-500">
                      ${(plan.monthlyPriceUSD - (plan.monthlyPriceUSD * parseInt(plan.discount) / 100))}/mo
                    </span>
                  </div>
                )}
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
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