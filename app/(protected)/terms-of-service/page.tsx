import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Updated: 18 March 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Welcome to LeadFume! These Terms of Service (&quot;Terms&quot;) govern your access to and use of our platform, services, and website. By using LeadFume, you agree to comply with these Terms. If you do not agree, please do not use our services.
              These Terms apply to all users, including but not limited to businesses, marketers, and sales professionals who rely on LeadFume for B2B lead generation. LeadFume reserves the right to modify these Terms at any time, and continued use of our platform constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Services</h2>
            <p className="text-gray-600">
              LeadFume provides comprehensive B2B lead generation services, and business contact information. Our platform guarantees high-accuracy data and offers targeted business information for marketing and sales purposes.
            </p>
            <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">2.1 Features of LeadFume</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Lead Database Access: Users can access a vast database of business contacts, including company names, email addresses, phone numbers, and industry details.</li>
              <li>Data Scraping: Collects public business information and uses AI to capture and validate leads to enhance lead quality.</li>
              <li>Customizable Filters: Users can segment data by industry, company size, location, and job titles and more.</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">2.2 Free Trial & Lead Processing</h3>
            <p className="text-gray-600">
              During your free trial, you can instantly export 5 leads from any search criteria at no cost. Our AI-powered system efficiently collects, processes, and verifies data while performing real-time email and phone verification for each search. This process ensures high accuracy, and for larger datasets, it may take some time to complete.
              Once you subscribe, larger lead requests undergo a rigorous validation process to maintain our 95% accuracy standard while still offering the best pricing in the market. We prioritize quality and efficiency to ensure that your data is accurate, fresh, and reliable. Our advanced AI engines systematically collect, process, and verify leads from publicly available sources, optimizing the time required based on the volume of data requested:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 mb-4">
              <li>Up to 100,000 contacts per search → Ready for export within 12 hours, ensuring you get actionable leads without unnecessary delays.</li>
              <li>100,000 to 1 Million contacts per search → Ready for export within 24 to 48 hours, allowing thorough validation for the best possible accuracy.</li>
            </ul>
            <p className="text-gray-600">
              If you need access to an even larger dataset, including our entire 250 million contact database, contact us at info@leadfume.com for bulk acquisition options.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600">
              Users of LeadFume must comply with the following responsibilities:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 mb-4">
              <li>You must be at least 18 years old to use LeadFume.</li>
              <li>You agree to use our services only for lawful purposes.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You must not use LeadFume to send spam, engage in unauthorized marketing, or violate data protection laws.</li>
              <li>Users must comply with GDPR, CCPA, and other applicable data protection laws when using our platform.</li>
              <li>You are solely responsible for how you use the data obtained from LeadFume.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Usage</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>LeadFume provides access to publicly available data and verified business contact information.</li>
              <li>Users are responsible for ensuring compliance with applicable privacy laws when using the data.</li>
              <li>We do not provide consumer or personal data.</li>
              <li>Any misuse of the data may result in account suspension or legal action.</li>
              <li>LeadFume does not guarantee the accuracy of every data entry due to changes in business records.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payment & Subscription</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>LeadFume offers both free and paid subscription plans.</li>
              <li>Subscription payments are non-refundable unless explicitly stated.</li>
              <li>Users may be required to pay additional fees for premium services.</li>
              <li>Failure to pay for subscription services may result in suspension or termination of access.</li>
              <li>LeadFume reserves the right to modify pricing plans and will notify users in advance of any changes.</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">5.1 Cancellation & Refunds</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Users may cancel their subscription at any time through their account settings.</li>
              <li>Refunds are granted only in cases where a system error prevents service delivery.</li>
              <li>Unused data credits do not qualify for refunds.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>LeadFume is not responsible for any loss, damage, or legal issues arising from the misuse of our data or platform.</li>
              <li>We do not guarantee the accuracy or completeness of the data provided.</li>
              <li>LeadFume shall not be held liable for indirect, incidental, or consequential damages resulting from the use of our services.</li>
              <li>Users assume full responsibility for any regulatory compliance associated with their marketing campaigns.</li>
              <li>In rare cases where certain features may not function as expected, we are committed to resolving the issue as quickly as possible. However, some situations may require additional time to fix, depending on the complexity.</li>
              <li>As technology can occasionally have unforeseen challenges, the client will need to bear with the process.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Termination</h2>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate your access to LeadFume if we determine that you have violated these Terms.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>LeadFume may terminate services if a user engages in prohibited activities such as data abuse, spamming, or illegal marketing.</li>
              <li>Termination may occur without prior notice in cases of severe violations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600">
              LeadFume may update these Terms from time to time. Continued use of our services constitutes acceptance of the revised Terms.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Your privacy is important to us. This Privacy Policy explains how LeadFume collects, uses, and protects your information. By using our platform, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Account Information: Name, email, phone number, and payment details when you register.</li>
              <li>Usage Data: We collect data about how you use our platform to improve our services.</li>
              <li>Lead Data: We provide business contact information collected from publicly available sources.</li>
              <li>IP Address & Device Information: We collect IP addresses and device types for security purposes.</li>
              <li>Communication Data: We may store messages sent to our support team for service improvement.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To provide and improve our services.</li>
              <li>To process transactions and manage subscriptions.</li>
              <li>To communicate with users regarding updates, support, and offers.</li>
              <li>To comply with legal obligations.</li>
              <li>To analyze usage trends and enhance platform performance.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Sharing & Protection</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>We do not sell or share your personal information with third parties for marketing purposes.</li>
              <li>We use industry-standard security measures to protect your data.</li>
              <li>Users are responsible for handling data obtained from LeadFume in compliance with applicable laws.</li>
              <li>LeadFume may share data with trusted partners for service improvements, but never for third-party advertising.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookies & Tracking</h2>
            <p className="text-gray-600">
              LeadFume uses cookies to enhance user experience and track usage patterns. Users can disable cookies through browser settings.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Cookies help personalize user experiences and improve platform performance.</li>
              <li>Third-party analytics tools may use cookies to analyze traffic and improve services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. User Rights</h2>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Access, update, or delete your personal information.</li>
              <li>Request data portability.</li>
              <li>Opt out of marketing communications.</li>
              <li>Withdraw consent for data collection at any time.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-600">
              LeadFume may integrate with third-party services for payment processing and analytics. We are not responsible for their privacy practices.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Users interacting with third-party integrations should review their privacy policies separately.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Compliance with Data Protection Laws</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>LeadFume complies with GDPR and CCPA regulations.</li>
              <li>Users are responsible for ensuring that they use LeadFume&apos;s data in accordance with applicable laws.</li>
              <li>Users must obtain consent when required before contacting leads obtained from our database.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Data Retention & Deletion</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>We retain user data only as long as necessary for service delivery.</li>
              <li>Users may request data deletion by contacting support.</li>
              <li>Certain transactional data may be retained for compliance with legal obligations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Security Measures</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>LeadFume implements advanced encryption to protect user data.</li>
              <li>Access controls prevent unauthorized data breaches.</li>
              <li>Regular security audits ensure compliance with industry standards.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy periodically. Continued use of our services constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
            <p className="text-gray-600">
              For any questions regarding these Terms or Privacy Policy, contact us at info@leadfume.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;