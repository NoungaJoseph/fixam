import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import DashboardNav from './dashboard/DashboardNav';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface ContentLayoutProps {
  pageTitle: string;
  effectiveDate?: string;
  sections: Section[];
  brandText: string;
  downloadLabel?: string;
}

export default function ContentLayout({ 
  pageTitle, 
  effectiveDate, 
  sections, 
  brandText,
  downloadLabel
}: ContentLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      {isLoggedIn ? <DashboardNav /> : <Navbar />}

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 gap-12">
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">{brandText}</div>
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`text-sm text-left px-3 py-2 rounded-lg transition-colors border-l-4 ${
                  activeSection === section.id 
                    ? 'bg-teal-50 text-teal-700 border-teal-500 font-medium' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-800'
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm" id="legal-content">
            <div className="legal-doc-header flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h1 className="legal-doc-title text-3xl font-extrabold text-gray-900 mb-2">{pageTitle}</h1>
                {effectiveDate && <div className="legal-doc-date text-sm text-gray-500 font-medium">{effectiveDate}</div>}
              </div>
              {downloadLabel && (
                <button 
                  className="legal-download-btn bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex-shrink-0" 
                  onClick={handleDownload}
                  id="download-btn"
                >
                  {downloadLabel}
                </button>
              )}
            </div>
            
            <hr className="legal-divider border-gray-200 mb-8" />

            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <div className="text-gray-600 leading-relaxed space-y-4 text-base sm:text-lg">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
