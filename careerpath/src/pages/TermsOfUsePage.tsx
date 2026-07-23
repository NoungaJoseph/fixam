import ContentLayout, { type Section } from '../components/ContentLayout';

export default function TermsOfUsePage() {
  const sections: Section[] = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: (
        <>
          <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-lg mb-6">
            <strong>Important:</strong> By accessing or using Fixam Pathways, you agree to be bound by these Terms of Use. Please read them carefully.
          </div>
          <p>
            These Terms of Use govern your access to and use of the Fixam Pathways platform, including any content, functionality, and services offered on or through the platform. 
            By registering for an account or participating in any educational modules, you accept and agree to these terms.
          </p>
        </>
      )
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      content: (
        <>
          <p>To access most features of Fixam Pathways, you must register for an account. You agree to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Maintain the security and confidentiality of your login credentials.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
          <p className="mt-4">
            We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.
          </p>
        </>
      )
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      content: (
        <>
          <p>
            The Fixam Pathways platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) 
            are owned by Fixam, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access and use the educational content for your personal, non-commercial learning purposes only.
          </p>
        </>
      )
    },
    {
      id: "user-conduct",
      title: "User Conduct",
      content: (
        <>
          <p>You agree not to use the platform to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>Violate any applicable national, regional, or international law or regulation.</li>
            <li>Exploit, harm, or attempt to exploit or harm others.</li>
            <li>Transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, or otherwise objectionable.</li>
            <li>Impersonate Fixam, a Fixam employee, another user, or any other person or entity.</li>
            <li>Engage in any automated use of the system, such as using scripts to complete modules or extract data.</li>
          </ul>
        </>
      )
    },
    {
      id: "certificates",
      title: "Certificates and Verification",
      content: (
        <>
          <p>
            Fixam Pathways issues certificates of completion based on your successful participation in simulated job tasks. 
            These certificates represent your demonstrated knowledge within our platform's controlled environment. 
          </p>
          <p>
            While Fixam Verification aims to improve your standing on the Fixam marketplace, we do not guarantee employment, client acquisition, or specific financial outcomes as a result of completing our pathways.
          </p>
        </>
      )
    },
    {
      id: "limitations",
      title: "Limitations of Liability",
      content: (
        <>
          <p>
            IN NO EVENT WILL FIXAM, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, 
            UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE PLATFORM.
          </p>
          <p>
            The educational content is provided for informational and training purposes only. Practical application of physical trades (such as electrical or plumbing work) in real-world scenarios carries inherent risks. 
            You are solely responsible for ensuring you comply with all local safety regulations and licensing requirements before performing paid services.
          </p>
        </>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Terms of Use"
      effectiveDate="Effective Date: October 24, 2026"
      brandText="Legal"
      downloadLabel="Download PDF"
      sections={sections}
    />
  );
}
