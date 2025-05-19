import { ChevronRight, CreditCard, Package, BarChart3, Calendar, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubscriptionsHelpPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscriptions & Credits</h1>
        <p className="text-gray-600">
          Learn how LeadFume's subscription plans and credit system work to get the most value for your lead generation efforts.
        </p>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-2">
          <Link href="/help" className="hover:text-primary">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Subscriptions & Credits</span>
        </div>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Subscription Plans</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            LeadFume offers flexible subscription plans designed to meet the needs of businesses of all sizes. Each plan provides a set number of credits per month that you can use to export verified leads.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold mb-2">Starter Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Perfect for small businesses and individual sales professionals</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">1,000 credits monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Real-time data collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Basic filtering options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6 border-primary/20 bg-primary/5 relative">
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Popular</div>
              <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Ideal for growing teams and mid-sized businesses</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">5,000 credits monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Advanced filtering options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">CRM integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Priority email & chat support</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold mb-2">Enterprise Plan</h3>
              <p className="text-sm text-gray-600 mb-4">For larger organizations with extensive lead generation needs</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">20,000+ credits monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Custom search parameters</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Billing Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-6 bg-white">
              <h4 className="font-medium mb-2">Monthly Billing</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Flexible month-to-month subscription</li>
                <li>Cancel anytime without long-term commitment</li>
                <li>Credits reset at the beginning of each billing cycle</li>
                <li>Ideal for testing different plan levels</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6 border-primary/20 bg-primary/5">
              <h4 className="font-medium mb-2">Annual Billing <span className="text-green-600 text-sm">(Save up to 20%)</span></h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Discounted rates when paying for a full year</li>
                <li>All credits for the year provided upfront</li>
                <li>Better value for consistent users</li>
                <li>Priority support queue placement</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Credits System</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            LeadFume operates on a credit-based system, giving you flexibility and control over your lead generation budget. 
            Each credit allows you to export one verified lead with complete contact information.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How Credits Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Credit Allocation</h4>
                  <p className="text-sm text-gray-600">
                    Credits are allocated based on your subscription plan. Monthly subscribers receive credits at the start of each billing cycle, while annual subscribers receive all credits upfront.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-medium mb-2">Using Credits</h4>
                  <p className="text-sm text-gray-600">
                    Each time you export a lead, one credit is deducted from your account. You can export individual leads or use bulk export for multiple leads at once (using the corresponding number of credits).
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Credit Renewal</h4>
                  <p className="text-sm text-gray-600">
                    For monthly plans, credits reset on your billing date. For annual plans, your next credit allocation will be available when your annual subscription renews.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Credit Usage Scenarios</h3>
              <div className="border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Monthly Plan Example</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      A Professional Plan subscriber with 5,000 monthly credits:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Can export up to 5,000 leads each month</li>
                      <li>Unused credits expire when the next month begins</li>
                      <li>New allocation of 5,000 credits on billing date</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Annual Plan Example</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      A Professional Plan annual subscriber:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Receives 60,000 credits upfront (5,000 × 12 months)</li>
                      <li>Can use credits at any pace throughout the year</li>
                      <li>All credits remain available until the renewal date</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Monitoring Your Credits</h3>
              <p className="text-gray-600 mb-4">
                You can easily track your credit usage in the Subscription Management section of your account dashboard.
              </p>
              
              <div className="border rounded-lg p-6">
                <h4 className="font-medium mb-4">Your dashboard shows:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Available Credits</p>
                        <p className="text-sm text-gray-600">The number of credits you have remaining in your current billing cycle</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Used Credits</p>
                        <p className="text-sm text-gray-600">The number of credits you've used in the current billing cycle</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Next Renewal Date</p>
                        <p className="text-sm text-gray-600">When your credits will be replenished</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Usage History</p>
                        <p className="text-sm text-gray-600">Historical data on your credit usage patterns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div className="border-l-4 border-amber-500 pl-4 py-2 space-y-2">
            <h3 className="font-medium">Need Additional Credits?</h3>
            <p className="text-sm text-gray-600">
              If you need more credits before your next renewal, you can:
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>Upgrade to a higher tier plan</li>
              <li>Switch from monthly to annual billing to receive more credits at once</li>
              <li>Contact our sales team for custom enterprise solutions</li>
            </ol>
          </div>
        </section>
        
        <Alert>
          <AlertDescription className="text-sm">
            For any questions about subscriptions or credits, please contact our support team at <span className="text-primary">support@leadfume.com</span> or visit the <Link href="/help/contact" className="text-primary hover:underline">Contact Support</Link> page.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
} 