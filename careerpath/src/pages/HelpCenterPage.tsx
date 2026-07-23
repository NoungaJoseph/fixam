import ContentLayout, { type Section } from '../components/ContentLayout';

export default function HelpCenterPage() {
  const sections: Section[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-4">
          <a href="/how-it-works" className="block p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
            <h3 className="font-bold text-gray-900 mb-1">How Fixam Pathways Works</h3>
            <p className="text-sm text-gray-500">Learn the basics of our interactive training platform.</p>
          </a>
          <a href="/signup" className="block p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
            <h3 className="font-bold text-gray-900 mb-1">Creating an Account</h3>
            <p className="text-sm text-gray-500">Step-by-step guide to setting up your free learner profile.</p>
          </a>
        </div>
      )
    },
    {
      id: "account-settings",
      title: "Account & Settings",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li><a href="#" className="hover:text-primary hover:underline">How to reset your password</a></li>
          <li><a href="#" className="hover:text-primary hover:underline">Updating your profile information</a></li>
          <li><a href="#" className="hover:text-primary hover:underline">Managing email notifications</a></li>
          <li><a href="#" className="hover:text-primary hover:underline">Deleting your account</a></li>
        </ul>
      )
    },
    {
      id: "certifications",
      title: "Certifications & Rewards",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li><a href="#" className="hover:text-primary hover:underline">How to download your certificate</a></li>
          <li><a href="#" className="hover:text-primary hover:underline">Adding certificates to your resume</a></li>
          <li><a href="#" className="hover:text-primary hover:underline">How the Fixam Verified badge works</a></li>
        </ul>
      )
    },
    {
      id: "contact-support",
      title: "Still need help?",
      content: (
        <>
          <p>
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <a href="/contact" className="inline-block mt-4 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-hover transition-colors">
            Contact Support
          </a>
        </>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Help Center"
      effectiveDate="Find answers to your questions."
      brandText="Support"
      sections={sections}
    />
  );
}
