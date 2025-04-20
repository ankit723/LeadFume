'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createSubscriptionType } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

// Form schema validation - make sure it matches our prisma schema
const subscriptionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Subscription name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Subscription description must be at least 10 characters.",
  }),
  annualDiscount: z.coerce.number().min(0, {
    message: "Annual discount must be at least 0%."
  }).max(100, {
    message: "Annual discount cannot exceed 100%."
  }).default(10),
  credits: z.coerce.number().min(1000, {
    message: "Credits must be at least 1,000.",
  }),
  price: z.coerce.number().min(1, {
    message: "Price must be at least $1.",
  }),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const defaultValues: Partial<SubscriptionFormValues> = {
  name: "",
  description: "",
  annualDiscount: 10,
  credits: 10000,
  price: 49,
  isPopular: false,
  isActive: true,
};

const SubscriptionCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      setIsLoading(true);
      
      // Call server action with fields that match our schema
      const result = await createSubscriptionType({
        name: data.name,
        description: data.description || "",
        price: data.price,
        credits: data.credits,
        annualDiscount: data.annualDiscount,
        isPopular: data.isPopular,
        isActive: data.isActive,
      });
      
      if (result.success) {
        toast.success(`Successfully created the ${data.name} subscription tier.`);
        // Refresh data
        router.refresh();
        // Reset form after successful submission
        form.reset(defaultValues);
      } else {
        toast.error(result.error || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("There was an error creating the subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  const watchedValues = form.watch();
  
  // For preview
  const yearlyPrice = isAnnual 
    ? watchedValues.price * 12 * (1 - watchedValues.annualDiscount / 100) // Apply annual discount
    : watchedValues.price;

  const yearlyCredits = isAnnual
    ? watchedValues.credits * 12
    : watchedValues.credits;

  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Subscription Type Creator</h1>
        <Button onClick={() => router.push('/admin/subscriptions')} variant="outline">
          Manage Subscriptions
        </Button>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="form">Subscription Details</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set the details for this subscription plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscription Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Basic, Pro, Enterprise, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            A short name for this subscription tier.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Features List)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter features separated by new lines. Use + for included features and - for excluded features. Example: + 10 Users\n- Advanced Analytics" {...field} rows={5} />
                          </FormControl>
                          <FormDescription>
                            Enter each feature on a new line. Start with + for included features (✓) and - for excluded features (✗).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                    <FormField
                      control={form.control}
                      name="annualDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Discount (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" step="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Discount percentage for annual billing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credits</FormLabel>
                            <FormControl>
                              <Input type="number" min="1000" step="1000" {...field} />
                            </FormControl>
                            <FormDescription>
                              Credits allocated for this subscription
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (USD)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <Input type="number" min="1" step="1" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Price for the subscription
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="isPopular"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Mark as &quot;Most Popular&quot;</FormLabel>
                              <FormDescription>
                                Highlight this plan on the pricing page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Active</FormLabel>
                              <FormDescription>
                                Make this subscription available to users
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Subscription Type'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  This is how your subscription will look on the pricing page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-4 bg-muted p-2 rounded-lg">
                    <span className={!isAnnual ? "font-medium" : "text-muted-foreground"}>Single Period</span>
                    <button
                      type="button"
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
                    <span className={isAnnual ? "font-medium" : "text-muted-foreground"}>Annual View</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8 flex flex-col relative">
                  {watchedValues.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                      Best Value
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-4">
                    {watchedValues.name || "Subscription Name"}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-yellow-400 text-2xl font-bold">$</span>
                    <span className="text-4xl font-bold">
                      {isAnnual ? Math.round(yearlyPrice / 12) : watchedValues.price}
                    </span>
                    {isAnnual && <span className="text-sm text-gray-500 ml-1">/mo</span>}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {isAnnual ? 'Billed annually' : 'Billed monthly'}
                  </p>
                  
                  <div className="space-y-4 flex-grow">
                    {watchedValues.description ? (
                      <ul className="space-y-2">
                        {watchedValues.description.split('\n').map((line, idx) => {
                          if (line.trim().startsWith('+')) {
                            const featureText = line.trim().substring(1).trim();
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
                          } else if (line.trim().startsWith('-')) {
                            const featureText = line.trim().substring(1).trim();
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
                          } else if (line.trim()) {
                            return (
                              <li key={idx} className="flex items-start ml-6">
                                <span>{line.trim()}</span>
                              </li>
                            );
                          }
                          return null;
                        }).filter(Boolean)}
                      </ul>
                    ) : null}
                    
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
                      <p>Credits: {isAnnual ? yearlyCredits.toLocaleString() : watchedValues.credits.toLocaleString()}</p>
                    </div>
                    
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
                          <span className="line-through text-gray-500">${watchedValues.price * 12}/year</span>
                          <span className="ml-2 text-green-500">${Math.round(yearlyPrice)}/year ({watchedValues.annualDiscount}% off)</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <button
                      type="button"
                      className={`w-full py-3 px-4 rounded-full font-medium transition-all duration-200 hover:transform hover:scale-105 ${
                        watchedValues.isPopular
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="flex justify-center my-8">
            <div className="flex items-center gap-4 bg-muted p-2 rounded-lg">
              <span className={!isAnnual ? "font-medium" : "text-muted-foreground"}>Single Period</span>
              <button
                type="button"
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
              <span className={isAnnual ? "font-medium" : "text-muted-foreground"}>Annual View</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col relative">
              {watchedValues.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Best Value
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4">
                {watchedValues.name || "Subscription Plan"}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-yellow-400 text-2xl font-bold">$</span>
                <span className="text-4xl font-bold">
                  {isAnnual ? Math.round(yearlyPrice / 12) : watchedValues.price}
                </span>
                {isAnnual && <span className="text-sm text-gray-500 ml-1">/mo</span>}
              </div>
              <p className="text-gray-600 mb-6">
                {isAnnual ? 'Billed annually' : 'Billed monthly'}
              </p>
              
              <div className="space-y-4 flex-grow">
                {watchedValues.description ? (
                  <ul className="space-y-2">
                    {watchedValues.description.split('\n').map((line, idx) => {
                      if (line.trim().startsWith('+')) {
                        const featureText = line.trim().substring(1).trim();
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
                      } else if (line.trim().startsWith('-')) {
                        const featureText = line.trim().substring(1).trim();
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
                      } else if (line.trim()) {
                        return (
                          <li key={idx} className="flex items-start ml-6">
                            <span>{line.trim()}</span>
                          </li>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </ul>
                ) : null}
                
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
                  <p>Credits: {isAnnual ? yearlyCredits.toLocaleString() : watchedValues.credits.toLocaleString()}</p>
                </div>
                
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
                      <span className="line-through text-gray-500">${watchedValues.price * 12}/year</span>
                      <span className="ml-2 text-green-500">${Math.round(yearlyPrice)}/year ({watchedValues.annualDiscount}% off)</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-full font-medium transition-all duration-200 hover:transform hover:scale-105 ${
                    watchedValues.isPopular
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SubscriptionCreator;