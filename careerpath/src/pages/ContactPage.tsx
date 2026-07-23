import ContentLayout, { type Section } from '../components/ContentLayout';

export default function ContactPage() {
  const sections: Section[] = [
    {
      id: "get-in-touch",
      title: "Get in Touch",
      content: (
        <>
          <p>
            Have a question, feedback, or partnership inquiry? We'd love to hear from you. 
            Reach out to the appropriate team below, and we'll get back to you as soon as possible.
          </p>
        </>
      )
    },
    {
      id: "support",
      title: "Customer Support",
      content: (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h3 className="font-bold text-gray-900 mb-2">Need help with your account?</h3>
          <p className="text-gray-600 mb-4">Our support team is available Monday through Friday, 8am to 6pm WAT.</p>
          <a href="mailto:support@fixam.net" className="font-bold text-primary hover:underline">support@fixam.net</a>
        </div>
      )
    },
    {
      id: "partnerships",
      title: "Partnerships & Press",
      content: (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h3 className="font-bold text-gray-900 mb-2">Media & Business Inquiries</h3>
          <p className="text-gray-600 mb-4">Interested in partnering with Fixam or writing about our mission? Contact our communications team.</p>
          <a href="mailto:partnerships@fixam.net" className="font-bold text-primary hover:underline">partnerships@fixam.net</a>
        </div>
      )
    },
    {
      id: "headquarters",
      title: "Headquarters",
      content: (
        <address className="not-italic text-gray-600">
          <strong>Fixam Inc.</strong><br />
          123 Innovation Drive<br />
          Bastos, Yaoundé<br />
          Cameroon
        </address>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Contact Us"
      effectiveDate="We're here to help."
      brandText="Corporate"
      sections={sections}
    />
  );
}
