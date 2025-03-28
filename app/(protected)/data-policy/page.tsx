import React from 'react';

const DataPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">LeadFume Data Policy</h1>
          <p className="text-gray-600 mb-4">Last Modified: March 18, 2025</p>

          <p className="text-gray-600 mb-8">
            At LeadFume, we take data privacy and security seriously. Our Data Policy outlines how we collect, use, store, and protect personal data in compliance with GDPR and other relevant data protection regulations. This document provides complete transparency about our data handling practices to ensure users understand their rights and how we safeguard their information.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Data Collection</h2>
            <p className="text-gray-600 mb-2">
              We collect and process personal data strictly for the purposes of providing and improving our services. The data we collect includes but is not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Personal Identifiable Information (PII): Name, email address, phone number, and business-related details.</li>
              <li>Usage Data: IP addresses, browser type, device information, and log data.</li>
              <li>Customer Communications: Any messages, requests, or inquiries sent to our support team.</li>
              <li>Marketing and Analytics Data: Information gathered through cookies and tracking technologies to improve user experience.</li>
              <li>Publicly Available Data: Information collected from public sources, such as company websites and social media.</li>
            </ul>
            <p className="text-gray-600">
              We collect data through various means, including website interactions, account registration, third-party integrations, and user-provided input.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Purpose of Data Processing</h2>
            <p className="text-gray-600 mb-2">
              We process user data for the following legitimate purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>To provide our lead generation services efficiently.</li>
              <li>To improve and personalize user experience.</li>
              <li>To ensure legal compliance and fulfill regulatory obligations.</li>
              <li>To communicate important updates and support-related information.</li>
              <li>To enhance security, prevent fraud, and protect our users.</li>
              <li>To conduct analytics and optimize marketing strategies.</li>
              <li>To facilitate transactions and business communications between users.</li>
              <li>To develop new features and improve our platform.</li>
              <li>To conduct research and analysis to enhance data accuracy and quality.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security Measures</h2>
            <p className="text-gray-600 mb-2">
              LeadFume implements industry-standard security measures to protect personal data from unauthorized access, misuse, and breaches. Our security protocols include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Encryption: We encrypt sensitive data during transmission and storage.</li>
              <li>Access Control: Restricted access to personal data based on a need-to-know basis.</li>
              <li>Data Anonymization: We anonymize and pseudonymize data when applicable.</li>
              <li>Secure Servers: Data is stored in highly secure cloud-based environments with regular security audits.</li>
              <li>Regular Monitoring: We continuously monitor for suspicious activities and vulnerabilities.</li>
              <li>Multi-Factor Authentication (MFA): Implemented for added security of user accounts.</li>
              <li>Routine Security Audits: Regular assessments to identify and resolve security vulnerabilities.</li>
              <li>Incident Response Plan: A structured process to address data breaches and cyber threats.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Retention Policy</h2>
            <p className="text-gray-600 mb-2">
              We retain personal data only for as long as necessary for legitimate business purposes. Retention periods are as follows:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Account Information: Retained as long as the user account is active.</li>
              <li>Transaction Data: Stored for a minimum of 7 years to comply with legal obligations.</li>
              <li>Marketing Data: Retained until users opt out.</li>
              <li>Usage Data: Retained for analytics and security purposes, deleted periodically.</li>
              <li>Support Queries: Retained for a maximum of 2 years after resolution.</li>
              <li>Deleted Accounts: Upon request, we erase data unless retention is required by law.</li>
            </ul>
            <p className="text-gray-600">
              Users can request data deletion at any time by contacting info@leadfume.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Sharing & Third-Party Disclosure</h2>
            <p className="text-gray-600 mb-2">
              LeadFume does not sell, trade, or rent personal data. We may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Service Providers: Cloud hosting, payment processors, analytics tools, and customer support services.</li>
              <li>Legal Authorities: When required by law, court orders, or government requests.</li>
              <li>Business Transfers: In case of mergers, acquisitions, or asset sales.</li>
              <li>Trusted Partners: When facilitating business interactions between users.</li>
              <li>Third-Party Integrations: If users opt to integrate with external tools and services.</li>
            </ul>
            <p className="text-gray-600">
              All third parties handling LeadFume data must comply with our data protection standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. User Rights & GDPR Compliance</h2>
            <p className="text-gray-600 mb-2">
              As part of GDPR compliance, LeadFume ensures users have full control over their data. Users have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Right to Access: Users can request a copy of their data.</li>
              <li>Right to Rectification: Users can request corrections to inaccurate or incomplete data.</li>
              <li>Right to Erasure: Users can request deletion of personal data.</li>
              <li>Right to Restrict Processing: Users can request limitations on data processing.</li>
              <li>Right to Data Portability: Users can request data in a structured, machine-readable format.</li>
              <li>Right to Object: Users can opt out of certain data processing activities.</li>
              <li>Right to Withdraw Consent: Users can revoke permissions for marketing or data collection at any time.</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, users can email info@leadfume.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies & Tracking Technologies</h2>
            <p className="text-gray-600 mb-2">
              LeadFume uses cookies and similar tracking technologies to improve user experience. Cookies help us:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Remember user preferences.</li>
              <li>Analyze site traffic and improve functionality.</li>
              <li>Deliver relevant advertisements.</li>
              <li>Prevent fraudulent activities and ensure security.</li>
            </ul>
            <p className="text-gray-600">
              Users can manage cookie preferences through their browser settings or opt out of certain tracking technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-600 mb-2">
              LeadFume operates globally, and data may be transferred outside the European Economic Area (EEA). When transferring data internationally, we implement:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Standard Contractual Clauses (SCCs).</li>
              <li>Data Protection Agreements with third-party vendors.</li>
              <li>Robust security measures to ensure compliance.</li>
              <li>Legal safeguards as per applicable privacy laws.</li>
            </ul>
            <p className="text-gray-600">
              Users will be notified in case of significant changes to cross-border data transfer policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update our Data Policy periodically. Users will be notified of significant changes through email or platform notifications. We encourage users to review our policy regularly to stay informed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Free Trial and Lead Processing</h2>
            <p className="text-gray-600">
              During your free trial, you can instantly export 5 leads from any search criteria at no cost. Our AI-powered system efficiently collects, processes, and verifies data while also sending real-time emails to these contacts, ensuring compliance with GDPR by allowing them to opt out if they do not wish to share their information. This extra step takes time but ensures high accuracy, legal compliance, and prevents blacklisting or abuse.
              For the free trial leads (up to 5 contacts), the export is instant, as fewer resources are required, and we do not send real-time emails for opt-out verification in this case.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
            <p className="text-gray-600">
              For any questions regarding this Data Policy, please contact us at:
             <br/> Email: info@leadfume.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataPolicyPage;