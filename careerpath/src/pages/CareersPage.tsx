import ContentLayout, { type Section } from '../components/ContentLayout';


export default function CareersPage() {
  const sections: Section[] = [
    {
      id: "working-at-fixam",
      title: "Working at Fixam",
      content: (
        <>
          <p>
            Join a fast-growing, mission-driven team dedicated to revolutionizing the local service industry in Africa and beyond. 
            At Fixam, we value creativity, ownership, and a deep commitment to our users.
          </p>
          <p>
            We offer competitive compensation, flexible work arrangements, and the opportunity to make a tangible impact on the lives of thousands of independent professionals.
          </p>
        </>
      )
    },
    {
      id: "open-positions",
      title: "Open Positions",
      content: (
        <div className="space-y-4 mt-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900">Senior Frontend Engineer</h3>
            <p className="text-sm text-gray-500 mb-3">Remote / Yaoundé, Cameroon • Full-time</p>
            <p className="text-gray-600 text-sm">Help us build the next generation of the Fixam platform using React, TypeScript, and Tailwind CSS.</p>
            <button className="mt-3 text-sm font-semibold text-primary hover:underline">Apply Now →</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900">Product Designer</h3>
            <p className="text-sm text-gray-500 mb-3">Remote • Full-time</p>
            <p className="text-gray-600 text-sm">Design intuitive and accessible experiences for both our service providers and clients.</p>
            <button className="mt-3 text-sm font-semibold text-primary hover:underline">Apply Now →</button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900">Curriculum Developer (Trades)</h3>
            <p className="text-sm text-gray-500 mb-3">Remote • Contract</p>
            <p className="text-gray-600 text-sm">Work with industry experts to develop educational content and simulated tasks for Fixam Pathways.</p>
            <button className="mt-3 text-sm font-semibold text-primary hover:underline">Apply Now →</button>
          </div>
        </div>
      )
    },
    {
      id: "general-application",
      title: "General Application",
      content: (
        <>
          <p>
            Don't see a role that fits your profile? We're always looking for exceptional talent. 
            Send your resume and a brief introduction to <a href="mailto:careers@fixam.net" className="text-primary hover:underline">careers@fixam.net</a>.
          </p>
        </>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Careers at Fixam"
      effectiveDate="Join our mission"
      brandText="Corporate"
      sections={sections}
    />
  );
}
