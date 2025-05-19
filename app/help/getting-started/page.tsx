import { Separator } from "@/components/ui/separator";
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started with LeadFume</h1>
        <p className="text-gray-600">
          Welcome to LeadFume! This guide will help you set up your account and start generating high-quality leads in minutes.
        </p>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-2">
          <Link href="/help" className="hover:text-primary">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Getting Started</span>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg flex flex-col bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <h3 className="font-medium">Create Your Account</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Sign up using your email or Google account to access your free trial.</p>
              <ul className="text-sm space-y-2 text-gray-600 list-inside">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>5 free credits to start</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No credit card required</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Full platform access</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg flex flex-col bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <h3 className="font-medium">Define Your Search</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Set up filtering criteria to find your ideal prospects.</p>
              <ul className="text-sm space-y-2 text-gray-600 list-inside">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Filter by industry, role, location</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time data collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI-powered lead verification</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg flex flex-col bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <h3 className="font-medium">Export & Use</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Download verified leads or connect with your CRM system.</p>
              <ul className="text-sm space-y-2 text-gray-600 list-inside">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>CSV and Excel formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>CRM-ready data structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>95% data accuracy guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Detailed Setup Process</h2>
          
          <div className="space-y-8">
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">1</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Account Setup</h3>
                <p className="text-gray-600">Creating your LeadFume account takes less than a minute.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">a</div>
                    <div>
                      <p className="font-medium">Go to the Sign Up page</p>
                      <p className="text-sm text-gray-600">Click the "Sign Up" button in the top-right corner of the homepage or visit <span className="text-primary">leadfume.com/sign-up</span>.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">b</div>
                    <div>
                      <p className="font-medium">Choose your registration method</p>
                      <p className="text-sm text-gray-600">Register with your business email or use Google Single Sign-On for quicker access.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">c</div>
                    <div>
                      <p className="font-medium">Verify your email</p>
                      <p className="text-sm text-gray-600">Click the verification link sent to your email address to activate your account.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">d</div>
                    <div>
                      <p className="font-medium">Complete your profile</p>
                      <p className="text-sm text-gray-600">Add your company information and preferences to help us personalize your experience.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">2</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Creating Your First Lead Search</h3>
                <p className="text-gray-600">Define your target audience to find the most relevant leads for your business.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">a</div>
                    <div>
                      <p className="font-medium">Navigate to the dashboard</p>
                      <p className="text-sm text-gray-600">Once logged in, you'll be directed to your dashboard. Click on "New Search" to begin.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">b</div>
                    <div>
                      <p className="font-medium">Set your primary filters</p>
                      <p className="text-sm text-gray-600">Start with industry, location, and company size to narrow down your target market.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">c</div>
                    <div>
                      <p className="font-medium">Refine with advanced filters</p>
                      <p className="text-sm text-gray-600">Add job titles, departments, or other specific criteria to find decision-makers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">d</div>
                    <div>
                      <p className="font-medium">Run your search</p>
                      <p className="text-sm text-gray-600">Click "Search" to have our AI crawl the web in real-time for matching leads.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">3</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Exporting and Using Your Leads</h3>
                <p className="text-gray-600">Convert your search results into actionable leads for your sales and marketing efforts.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">a</div>
                    <div>
                      <p className="font-medium">Review your results</p>
                      <p className="text-sm text-gray-600">Browse through the leads and select the ones that best match your ideal customer profile.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">b</div>
                    <div>
                      <p className="font-medium">Export your leads</p>
                      <p className="text-sm text-gray-600">Choose your preferred format (CSV or Excel) and select the leads to export.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">c</div>
                    <div>
                      <p className="font-medium">Import to your CRM</p>
                      <p className="text-sm text-gray-600">Use our formatted exports to easily import the data into your CRM system.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">d</div>
                    <div>
                      <p className="font-medium">Start your outreach</p>
                      <p className="text-sm text-gray-600">Begin contacting your new leads through email, calls, or social media.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">4</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Upgrading Your Account</h3>
                <p className="text-gray-600">Choose a subscription plan that fits your lead generation needs.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">a</div>
                    <div>
                      <p className="font-medium">Review available plans</p>
                      <p className="text-sm text-gray-600">Visit the Pricing page to compare different subscription options and features.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">b</div>
                    <div>
                      <p className="font-medium">Select billing cycle</p>
                      <p className="text-sm text-gray-600">Choose between monthly or annual billing (annual plans offer significant discounts).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">c</div>
                    <div>
                      <p className="font-medium">Complete payment</p>
                      <p className="text-sm text-gray-600">Enter your payment details to activate your subscription immediately.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-muted w-6 h-6 rounded-full text-center text-sm pt-0.5 flex-shrink-0">d</div>
                    <div>
                      <p className="font-medium">Start using your credits</p>
                      <p className="text-sm text-gray-600">Your account will be instantly credited with the appropriate number of credits based on your plan.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <div className="p-6 bg-primary/5 rounded-lg mt-10">
          <h3 className="text-lg font-medium mb-2">Need More Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance getting started with LeadFume, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/help/faq" className="text-primary hover:text-primary/80 font-medium">
              Check our FAQ
            </Link>
            <Link href="/help/documentation" className="text-primary hover:text-primary/80 font-medium">
              Browse documentation
            </Link>
            <Link href="/help/contact" className="text-primary hover:text-primary/80 font-medium">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 