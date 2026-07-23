import ContentLayout, { type Section } from '../components/ContentLayout';

export default function FAQPage() {
  const sections: Section[] = [
    {
      id: "general",
      title: "General Questions",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900">What is Fixam Pathways?</h3>
            <p className="mt-1">Fixam Pathways is a free, interactive learning platform designed to help you build real-world skills through simulated job training across various trades.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Are the career paths really free?</h3>
            <p className="mt-1">Yes, all of our career paths are 100% free. Our mission is to make high-quality trade education accessible to everyone.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Do I need any prior experience?</h3>
            <p className="mt-1">No prior experience is required. We offer paths for all skill levels, from beginners looking to start a new career to experienced professionals wanting to upskill.</p>
          </div>
        </div>
      )
    },
    {
      id: "certificates",
      title: "Certificates & Verification",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900">Will I receive a certificate?</h3>
            <p className="mt-1">Yes, upon completing all tasks in a career path, you will earn a verified Fixam Certificate.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">How does the certificate help me?</h3>
            <p className="mt-1">The certificate demonstrates your competence to potential clients on the Fixam platform, helping you stand out, build trust, and secure higher-paying jobs.</p>
          </div>
        </div>
      )
    },
    {
      id: "technical",
      title: "Technical Support",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900">I'm having trouble logging in. What should I do?</h3>
            <p className="mt-1">Please ensure you are using the correct email address and password. If you've forgotten your password, use the "Forgot Password" link on the login page to reset it.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Who do I contact if I find a bug?</h3>
            <p className="mt-1">If you encounter any issues while using the platform, please contact our support team through the Help Center or by emailing support@fixam.net.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Frequently Asked Questions"
      effectiveDate="Last updated: October 2026"
      brandText="Fixam Support"
      sections={sections}
    />
  );
}
