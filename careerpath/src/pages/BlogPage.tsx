import ContentLayout, { type Section } from '../components/ContentLayout';

export default function BlogPage() {
  const sections: Section[] = [
    {
      id: "latest",
      title: "Latest Articles",
      content: (
        <div className="space-y-8">
          <article className="border-b border-gray-200 pb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Platform Update</span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Introducing Fixam Pathways: Learn by Doing</h3>
            <p className="text-sm text-gray-500 mb-3">By Fixam Team • October 24, 2026</p>
            <p className="text-gray-600 mb-4">We're thrilled to announce the launch of Fixam Pathways, our new interactive learning platform designed to help independent professionals build real-world skills through simulated jobs.</p>
            <button className="text-sm font-semibold text-primary hover:underline">Read full article →</button>
          </article>
          
          <article className="border-b border-gray-200 pb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Success Story</span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">How Jean-Pierre doubled his income with verified skills</h3>
            <p className="text-sm text-gray-500 mb-3">By Community Team • September 12, 2026</p>
            <p className="text-gray-600 mb-4">Read about how one electrician from Douala used the Fixam platform to build a verified reputation, attract better clients, and completely transform his business.</p>
            <button className="text-sm font-semibold text-primary hover:underline">Read full article →</button>
          </article>

          <article>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Industry Insights</span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">The future of local services in West Africa</h3>
            <p className="text-sm text-gray-500 mb-3">By Product Team • August 05, 2026</p>
            <p className="text-gray-600 mb-4">An in-depth look at how digital marketplaces and verifiable credentials are standardizing quality and trust in the informal sector.</p>
            <button className="text-sm font-semibold text-primary hover:underline">Read full article →</button>
          </article>
        </div>
      )
    },
    {
      id: "categories",
      title: "Categories",
      content: (
        <div className="flex flex-wrap gap-2">
          {['Platform Updates', 'Success Stories', 'Industry Insights', 'Provider Tips', 'Engineering', 'Company News'].map((cat) => (
            <span key={cat} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full cursor-pointer transition-colors">
              {cat}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <ContentLayout
      pageTitle="Fixam Blog"
      effectiveDate="News, insights, and stories from the Fixam community."
      brandText="Community"
      sections={sections}
    />
  );
}
