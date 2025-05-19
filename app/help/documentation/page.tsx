import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Database, Filter, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">LeadFume Documentation</h1>
        <p className="text-gray-600">
          Comprehensive guide to all features and functionalities of the LeadFume platform.
        </p>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-2">
          <Link href="/help" className="hover:text-primary">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Documentation</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Collection</TabsTrigger>
          <TabsTrigger value="filters">Filters & Search</TabsTrigger>
          <TabsTrigger value="credits">Credits System</TabsTrigger>
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          <TabsTrigger value="export">Export & Use</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Platform Overview</h2>
          <p className="text-gray-600">
            LeadFume is an AI-powered lead generation platform that provides real-time, verified business contact information to help companies streamline their sales and marketing efforts.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <Database className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Real-Time Data Collection</span>
                  <p className="text-sm text-gray-500">LeadFume crawls over 1 million web pages per second to deliver the most recent and relevant leads, ensuring you never work with outdated data.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Filter className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">AI-Powered Smart Filtering</span>
                  <p className="text-sm text-gray-500">Our AI categorizes and filters leads based on your specific criteria, delivering only the most relevant prospects for your business.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Ultra-Fast Lead Retrieval</span>
                  <p className="text-sm text-gray-500">With over 1 million pages crawled per second, LeadFume provides instant access to high-quality leads, saving you time and effort.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Targeted B2B Leads</span>
                  <p className="text-sm text-gray-500">Access decision-makers and industry professionals with verified contact details, perfect for B2B sales and outreach.</p>
                </div>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Data Collection</h2>
          <p className="text-gray-600">
            LeadFume uses advanced AI technology to collect business contact information in real-time from various public sources.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">How We Collect Data</h3>
            <p className="text-gray-600">
              Our platform employs AI-powered web crawling technology to scan millions of web pages per second. This allows us to gather the most recent and relevant lead data tailored to your specific needs.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Data Accuracy</h3>
            <p className="text-gray-600">
              LeadFume guarantees 95% data accuracy through our advanced AI engines that verify and validate each contact. Any faulty records are replaced within 24 hours.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Data Types Collected</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Business email addresses</li>
              <li>Job titles and company roles</li>
              <li>Business phone numbers</li>
              <li>Company details (industry, size, location, etc.)</li>
              <li>Professional social media profiles</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Data Privacy & Compliance</h3>
            <p className="text-gray-600">
              LeadFume adheres to GDPR and global data privacy regulations. We only collect business-related data from publicly available sources and do not collect sensitive personal data. For more information, please review our <Link href="/policies/data-policy" className="text-primary hover:underline">Data Policy</Link>.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="filters" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Filters & Search</h2>
          <p className="text-gray-600">
            LeadFume offers powerful filtering capabilities to help you find the exact leads you need for your business.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">Available Filters</h3>
            <p className="text-gray-600 mb-4">
              Our platform provides 100% customizable searches based on multiple parameters, including:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Company Filters</h4>
                <ul className="space-y-1 text-sm">
                  <li>Industry/Sector</li>
                  <li>Company Size (employees)</li>
                  <li>Revenue Range</li>
                  <li>Geographic Location</li>
                  <li>Founded Year</li>
                  <li>Technologies Used</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Contact Filters</h4>
                <ul className="space-y-1 text-sm">
                  <li>Job Title/Role</li>
                  <li>Seniority Level</li>
                  <li>Department</li>
                  <li>Professional Experience</li>
                  <li>Education</li>
                  <li>Skills</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Search Techniques</h3>
            <p className="text-gray-600">
              For best results when using our search functionality:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Start with broader filters and then narrow down</li>
              <li>Combine multiple filters for more targeted results</li>
              <li>Use keyword search for specific industries or specialties</li>
              <li>Save your favorite search parameters for future use</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="credits" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Credits System</h2>
          <p className="text-gray-600">
            LeadFume operates on a credit-based system that allows you to access and export leads based on your subscription plan.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">How Credits Work</h3>
            <p className="text-gray-600">
              Each credit allows you to export one verified lead with complete contact information. Credits are allocated monthly based on your subscription plan and reset on your renewal date.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Credit Allocation</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Monthly plans: Credits are allocated at the start of each billing cycle</li>
              <li>Annual plans: All credits for the year are provided upfront (12× monthly credits)</li>
              <li>Free trial: 5 credits to export leads at no cost</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Credit Usage</h3>
            <p className="text-gray-600">
              Credits are used in the following scenarios:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Exporting individual leads (1 credit per lead)</li>
              <li>Bulk export of multiple leads (1 credit per lead)</li>
              <li>Viewing detailed contact information</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Monitoring Credits</h3>
            <p className="text-gray-600">
              You can track your credit usage in the Subscription Management section of your account. This dashboard displays:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Available credits</li>
              <li>Used credits</li>
              <li>When credits will be replenished</li>
              <li>Credit usage history</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Subscriptions</h2>
          <p className="text-gray-600">
            LeadFume offers flexible subscription plans to meet the needs of businesses of all sizes.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">Subscription Plans</h3>
            <p className="text-gray-600">
              Our subscription plans vary by price, included credits, and features. All plans provide access to our AI-powered lead generation platform with varying levels of usage capacity.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Billing Options</h3>
            <p className="text-gray-600 mb-4">
              LeadFume offers two billing cycles for all subscription plans:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Monthly billing: Pay month-to-month with the flexibility to cancel anytime</li>
              <li>Annual billing: Save with our annual discount (varies by plan) when paying for a full year</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Managing Your Subscription</h3>
            <p className="text-gray-600">
              You can manage your subscription through the Subscription Management page in your account settings. Options include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Upgrading or downgrading your plan</li>
              <li>Switching between monthly and annual billing</li>
              <li>Updating payment information</li>
              <li>Viewing billing history</li>
              <li>Cancelling your subscription</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Enterprise Solutions</h3>
            <p className="text-gray-600">
              For businesses with larger lead generation needs, we offer custom enterprise solutions with bulk data acquisition options. Contact us at info@leadfume.com for custom pricing and solutions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Export & Use</h2>
          <p className="text-gray-600">
            LeadFume makes it easy to export and use the leads you generate through our platform.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium text-gray-700">Export Options</h3>
            <p className="text-gray-600 mb-4">
              Once you&apos;ve found the leads you need, you can export them in several formats:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>CSV file (compatible with most CRM systems)</li>
              <li>Excel spreadsheet (.xlsx)</li>
              <li>Direct integration with popular CRM platforms</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Lead Information</h3>
            <p className="text-gray-600">
              Exported leads include comprehensive information (subject to availability):
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Full name and professional title</li>
              <li>Verified business email address</li>
              <li>Company name and details</li>
              <li>Business phone number</li>
              <li>Location information</li>
              <li>Social media profiles</li>
              <li>Additional business contact details</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mt-6">Best Practices</h3>
            <p className="text-gray-600">
              For the most effective use of your LeadFume exports:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Import leads directly to your CRM system</li>
              <li>Segment exported leads based on campaign targets</li>
              <li>Create personalized outreach sequences</li>
              <li>Monitor response rates to optimize future lead generation</li>
              <li>Follow all applicable regulations when contacting leads</li>
            </ul>
            
            <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded mt-6">
              <h4 className="font-medium mb-1">Compliance Note</h4>
              <p className="text-sm text-gray-600">
                When using exported leads for outreach, ensure you comply with all applicable laws and regulations, including CAN-SPAM, GDPR, and CCPA. LeadFume provides compliant data, but proper usage remains the responsibility of the user.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 