import Link from 'next/link';

export default function PoliciesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Legal Documents</h1>
      <p className="text-gray-600">Please review our legal documents and policies below.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/policies/terms-of-service"
          className="p-6 border rounded-lg  transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-800">Terms of Service</h2>
          <p className="mt-2 text-gray-600">Our terms and conditions for using our services.</p>
        </Link>

        <Link 
          href="/policies/gdpr-compliance"
          className="p-6 border rounded-lg  transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-800">GDPR Compliance</h2>
          <p className="mt-2 text-gray-600">Our commitment to GDPR and data protection regulations.</p>
        </Link>

        <Link 
          href="/policies/data-policy"
          className="p-6 border rounded-lg  transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-800">Data Policy</h2>
          <p className="mt-2 text-gray-600">How we handle and protect your data.</p>
        </Link>
      </div>
    </div>
  );
}
