import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to the most common questions about LeadFume's platform and services.
        </p>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-2">
          <Link href="/help" className="hover:text-primary">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span>FAQ</span>
        </div>
      </div>

      <div className="space-y-8">
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Platform & Features</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does LeadFume collect data in real-time?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  LeadFume uses AI-powered web crawling technology to scan over 1 million web pages per second, gathering and processing the most recent and relevant lead data tailored to your needs. Our advanced algorithms identify, extract, and verify business contact information from publicly available sources across the web.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>What makes LeadFume different from traditional lead generation tools?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Unlike traditional tools that rely on outdated databases, LeadFume dynamically fetches fresh leads in real-time, ensuring accuracy and relevance without storing old data. Our platform uses AI to verify contact information, provides highly customizable search filters, and delivers leads with 95% accuracy. We also offer instant exports and a credit-based system that gives you more control over your lead generation budget.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How does LeadFume verify data accuracy?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  We use multi-stage AI-powered verification processes to ensure 95% accuracy. Our system checks email addresses through pattern recognition and validation techniques, verifies phone numbers against current telecommunications databases, cross-references information across multiple sources, and applies intelligent algorithms to detect and remove false or outdated information. Any faulty records are replaced within 24 hours of being reported.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I customize my lead searches with LeadFume?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Yes, LeadFume offers 100% customizable searches based on multiple parameters. You can filter by industry, location, job title, company size, revenue brackets, and keywords. Our advanced filtering options allow you to target specific departments, seniority levels, technologies used, and more. You can save your favorite search parameters for future use and create multiple search profiles for different campaigns.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How fast does LeadFume deliver leads?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  LeadFume crawls over 1 million pages per second, providing ultra-fast lead retrieval. For most searches, initial results appear within seconds, while more complex searches with multiple filters may take a few minutes as our AI processes data in real-time. Once leads are identified, you can instantly export them to start your outreach campaigns without delay.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Subscriptions & Billing</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-6">
              <AccordionTrigger>How do credits work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Each credit allows you to export one verified lead with complete contact information. Credits are allocated monthly based on your subscription plan and reset on your renewal date. If you have an annual plan, all credits for the year are provided upfront (12 times your monthly credit allocation). You can view your remaining credits in your account dashboard along with usage history.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover. We also support PayPal for added convenience. For enterprise-level purchases, we can accommodate wire transfers. All transactions are processed securely through our payment gateway with industry-standard encryption and security measures.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your subscription plan at any time through your account settings. If you upgrade, your additional credits will be available immediately. When downgrading, your new plan will take effect at the next billing cycle. For annual subscriptions, plan changes may require prorated adjustments which our system handles automatically.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger>What happens if I don't use all my credits?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  For monthly plans, unused credits expire at the end of the billing cycle when your plan renews. For annual plans, credits remain available throughout the year until your renewal date. We don't currently offer credit rollovers beyond the billing cycle, but you can always contact our support team if you need special arrangements for large credit balances.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Yes, all new accounts come with 5 free credits that allow you to export leads at no cost. This gives you the opportunity to test our platform and experience the quality of our data before committing to a paid subscription. The free trial provides full access to all platform features, including advanced filtering and real-time searches.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-11">
              <AccordionTrigger>Is my data safe with LeadFume?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Absolutely! We comply with GDPR and global data privacy laws. Your account information and search history are protected with industry-leading security measures, including encryption at rest and in transit. We never share your data with third parties without your explicit consent, and we implement strict access controls within our organization. For more information, please review our <Link href="/policies/data-policy" className="text-primary hover:underline">Data Policy</Link>.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-12">
              <AccordionTrigger>What types of data does LeadFume collect?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  LeadFume processes only business-related data from publicly available sources, company websites, professional directories, and opt-in databases. We collect business email addresses, job titles and company roles, business phone numbers, company details (industry, size, location, etc.), and professional social media profiles. We do not collect sensitive personal data such as health records, political opinions, or religious beliefs.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-13">
              <AccordionTrigger>Is LeadFume GDPR compliant?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Yes, LeadFume is fully GDPR compliant. We have adopted GDPR standards across our entire platform and enforce them globally. We respect privacy rights and allow users and data subjects to exercise their rights under GDPR, including the right to access, rectify, erase, restrict processing, data portability, and object to processing. For more details, please review our <Link href="/policies/gdpr-compliance" className="text-primary hover:underline">GDPR Compliance Policy</Link>.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-14">
              <AccordionTrigger>How do I use the exported leads in compliance with regulations?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  When using exported leads for outreach, ensure you comply with all applicable laws and regulations, including CAN-SPAM, GDPR, and CCPA. Best practices include identifying yourself and your company clearly in communications, providing a valid physical address, offering easy opt-out options, honoring opt-out requests promptly, and using clear, non-deceptive subject lines. While LeadFume provides compliant data, proper usage remains the responsibility of the user.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Support</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-15">
              <AccordionTrigger>How can I get technical support?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Our support team is available through multiple channels:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Email: support@leadfume.com</li>
                  <li>Live chat: Available on the platform during business hours</li>
                  <li>Help Center: Browse our documentation and guides</li>
                  <li>Phone support: Available for Enterprise plan customers</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  We aim to respond to all support requests within 24 hours, with faster response times for priority issues.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-16">
              <AccordionTrigger>Do you offer training or onboarding assistance?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Yes, we provide several resources to help you get started:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Detailed documentation and help articles</li>
                  <li>Video tutorials for common tasks</li>
                  <li>Webinars for new users (scheduled bi-weekly)</li>
                  <li>Personalized onboarding calls for Business and Enterprise plans</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  You can access these resources through our Help Center or by contacting our support team.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-17">
              <AccordionTrigger>How do I access the entire 250 million contact database?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  For bulk data acquisition and access to our complete database of 250 million contacts, please contact our sales team at info@leadfume.com. We offer custom enterprise solutions with special pricing for large-scale data needs. Our team will work with you to understand your requirements and provide a tailored solution that meets your specific business needs.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <div className="p-6 bg-primary/5 rounded-lg mt-10">
          <h3 className="text-lg font-medium mb-2">Can't find an answer?</h3>
          <p className="text-gray-600 mb-4">
            If you couldn't find the information you're looking for, please don't hesitate to reach out to our support team.
          </p>
          <Link 
            href="/help/contact" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
} 