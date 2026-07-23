import ContentLayout, { type Section } from '../components/ContentLayout';

export default function AboutUsPage() {
  const sections: Section[] = [
    {
      id: "our-mission",
      title: "Our Mission",
      content: (
        <>
          <p>
            At Fixam, our mission is to empower trade professionals by providing them with the tools, skills, and opportunities they need to thrive. 
            We believe that skilled work deserves real recognition, and we are dedicated to bridging the gap between talent and opportunity.
          </p>
        </>
      )
    },
    {
      id: "our-story",
      title: "Our Story",
      content: (
        <>
          <p>
            Founded in Cameroon, Fixam started with a simple observation: finding reliable, qualified local service providers was too difficult, 
            and talented professionals were struggling to find consistent work. We set out to change that.
          </p>
          <p>
            Today, Fixam is more than just a marketplace. With Fixam Pathways, we are building the future of trade education, 
            offering free, accessible, and high-quality simulated training to anyone willing to learn.
          </p>
        </>
      )
    },
    {
      id: "our-values",
      title: "Our Values",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Excellence:</strong> We strive for the highest standards in everything we do, from our platform's technology to the educational content we provide.</li>
          <li><strong>Empowerment:</strong> We believe in giving people the power to control their own careers and financial futures.</li>
          <li><strong>Community:</strong> We are building a network of trust, respect, and mutual support between clients and service providers.</li>
          <li><strong>Innovation:</strong> We continuously seek new and better ways to solve problems and deliver value to our users.</li>
        </ul>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="About Fixam"
      effectiveDate="Learn more about our vision"
      brandText="Corporate"
      sections={sections}
    />
  );
}
