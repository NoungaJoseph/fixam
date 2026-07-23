import ContentLayout, { type Section } from '../components/ContentLayout';

export default function PrivacyPolicyPage() {
  const sections: Section[] = [
    {
      id: "information-collection",
      title: "Information Collection",
      content: (
        <>
          <p>
            At Fixam Pathways, we collect information that you provide directly to us when you create an account, update your profile, or interact with our learning modules. 
            This includes your name, email address, phone number, and any professional background details you choose to share.
          </p>
          <p>
            We also automatically collect certain information about your device and how you interact with our platform, such as your IP address, browser type, and completion rates of educational modules.
          </p>
        </>
      )
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: (
        <>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>Provide, maintain, and improve the Fixam Pathways platform.</li>
            <li>Track your progress and issue verified certificates upon course completion.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Match you with potential clients on the main Fixam platform based on your newly acquired skills (with your explicit consent).</li>
            <li>Analyze trends, usage, and activities to personalize your educational experience.</li>
          </ul>
        </>
      )
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: (
        <>
          <p>
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>With your consent:</strong> We may share your verified credentials with potential clients on the Fixam marketplace if you opt-in.</li>
            <li><strong>With service providers:</strong> We may share information with vendors who need access to such information to carry out work on our behalf.</li>
            <li><strong>For legal reasons:</strong> We may disclose information if we believe it is required by applicable law, regulation, or legal process.</li>
          </ul>
        </>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      content: (
        <>
          <p>
            We implement appropriate technical and organizational measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.
          </p>
          <p>
            However, no security system is impenetrable, and we cannot guarantee the absolute security of our systems or your information.
          </p>
        </>
      )
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p>
            Depending on your location, you may have the right to access, correct, or delete the personal information we hold about you. 
            You can update your account information at any time through your Profile Settings.
          </p>
          <p>
            To request deletion of your account or exercise other data rights, please contact our privacy team at <a href="mailto:privacy@fixam.net" className="text-primary hover:underline">privacy@fixam.net</a>.
          </p>
        </>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Privacy Policy"
      effectiveDate="Effective Date: October 24, 2026"
      brandText="Legal"
      downloadLabel="Download PDF"
      sections={sections}
    />
  );
}
