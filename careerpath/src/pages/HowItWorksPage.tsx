import ContentLayout, { type Section } from '../components/ContentLayout';

export default function HowItWorksPage() {
  const sections: Section[] = [
    {
      id: "introduction",
      title: "Welcome to Fixam Pathways",
      content: (
        <>
          <p className="text-lg leading-relaxed">
            Fixam Pathways is a revolutionary, free-to-use educational platform designed specifically for the skilled trades. 
            Unlike traditional online courses that rely heavily on video lectures and multiple-choice quizzes, our platform focuses on <strong>simulated, scenario-based learning</strong>.
          </p>
          <p className="mt-4">
            Whether you are a complete beginner looking to break into a new industry, or an experienced professional wanting to validate your skills and attract higher-paying clients on the Fixam marketplace, Pathways provides the structured, hands-on experience you need.
          </p>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mt-6 rounded-r-lg">
            <h4 className="font-bold text-teal-800">Our Core Philosophy</h4>
            <p className="text-teal-700 mt-1">We believe that the best way to learn a trade is by doing it. Our platform bridges the gap between theoretical knowledge and practical execution.</p>
          </div>
        </>
      )
    },
    {
      id: "step-1-discovery",
      title: "Step 1: Explore and Enroll",
      content: (
        <>
          <p>
            Your journey begins in our <strong>Career Catalog</strong>. We offer comprehensive pathways across multiple high-demand categories, including:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4">
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Electrical Work</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Plumbing</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Carpentry</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Appliance Repair</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Beauty & Grooming</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Cleaning & Maintenance</li>
          </ul>
          <p>
            Each pathway is carefully structured from beginner to advanced levels. When you find a path that interests you, simply click "Start Path". If you don't have an account yet, you'll be prompted to create one for free. We do not require any payment information.
          </p>
        </>
      )
    },
    {
      id: "step-2-intake",
      title: "Step 2: The Intake Survey",
      content: (
        <>
          <p>
            Before you start learning, we want to know a little bit about your background. You will be asked to complete a brief Intake Survey.
          </p>
          <p className="mt-4">
            This survey helps us understand your current skill level (Beginner, Intermediate, or Expert) and your primary goals (e.g., learning a new skill, finding jobs, or starting a business). Based on your answers, our system personalizes your dashboard and recommends the most relevant modules for you to tackle first.
          </p>
        </>
      )
    },
    {
      id: "step-3-simulations",
      title: "Step 3: Interactive Job Simulations",
      content: (
        <>
          <p>
            This is where the real learning happens. Instead of just reading about how to fix a leaky faucet, you will be presented with a <strong>Simulated Job Card</strong>.
          </p>
          <h4 className="font-bold text-gray-800 mt-6 mb-2">How a Simulation Works:</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1 block">Phase A: Client Brief</span>
              <p className="text-gray-600">You receive a description of the problem exactly as a client would submit it on the Fixam app (e.g., "My AC is making a loud grinding noise and blowing warm air").</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1 block">Phase B: Diagnosis & Planning</span>
              <p className="text-gray-600">You must select the correct tools needed for the job, identify potential safety hazards, and write out your step-by-step diagnostic plan.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1 block">Phase C: Execution</span>
              <p className="text-gray-600">You answer scenario-based questions on how to execute the repair, including what to do if unexpected complications arise.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: "step-4-feedback",
      title: "Step 4: Compare with Model Answers",
      content: (
        <>
          <p>
            After you submit your solution to a simulated task, you aren't just given a pass/fail grade. Instead, you are immediately shown the <strong>Model Answer</strong> created by a master tradesperson.
          </p>
          <p className="mt-4">
            You will review the expert's thought process, the exact tools they would have used, and the safety precautions they highlighted. This self-reflection phase is crucial—it allows you to identify gaps in your knowledge and learn the industry-standard way to handle complex situations.
          </p>
        </>
      )
    },
    {
      id: "step-5-certification",
      title: "Step 5: Certification & Verification",
      content: (
        <>
          <p>
            As you complete tasks, your progress is tracked on your personal Dashboard. Once you successfully complete all the required modules within a specific career path, you will be awarded a <strong>Fixam Verified Certificate</strong>.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Digital Badge:</strong> Display your certificate on your public Fixam profile.</li>
            <li><strong>Higher Trust:</strong> Clients are significantly more likely to hire professionals who carry a Fixam Verified badge.</li>
            <li><strong>Better Opportunities:</strong> The Fixam marketplace algorithm prioritizes verified professionals for premium, higher-paying jobs in your local area.</li>
          </ul>
        </>
      )
    },
    {
      id: "get-started",
      title: "Ready to start?",
      content: (
        <>
          <p className="mb-6">
            Join thousands of professionals who are upgrading their skills and building successful businesses through Fixam Pathways.
          </p>
          <a href="/catalog" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            Explore Career Paths
          </a>
        </>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="How Fixam Pathways Works"
      effectiveDate="The complete guide to your learning journey"
      brandText="Guide"
      sections={sections}
    />
  );
}
