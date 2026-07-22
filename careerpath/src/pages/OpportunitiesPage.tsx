import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import {
  Zap, Droplets, Hammer, Scissors, Paintbrush,
  Clock, MapPin, CheckCircle, ExternalLink, Award, FileText, Check
} from 'lucide-react';

type Opportunity = {
  id: string;
  client: string;
  title: string;
  description: string;
  location: string;
  date: string;
  requirements: string;
  isOpportunity: boolean; // true = OPPORTUNITY badge (teal), false = EVENT badge (purple)
  isUpcoming?: boolean; // true = show UPCOMING badge (orange) next to EVENT
  bannerBg: string;
  icon: any;
  details: string;
  relatedPaths: { title: string; category: string; difficulty: string; hours: number; image: string }[];
};

export default function OpportunitiesPage() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Filters State
  const [quickFilter, setQuickFilter] = useState<'all' | 'recommended' | 'saved' | 'applied'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected Opportunity (for split screen details)
  const [selectedId, setSelectedId] = useState<string>('1');

  // Mobile detail view toggle
  const [showMobileDetail, setShowMobileDetail] = useState<boolean>(false);

  // Expandable description state
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [quickFilter, selectedType, selectedRegion, selectedCategory, selectedLevel]);

  // Mock Opportunities list
  const opportunities: Opportunity[] = [
    {
      id: '1',
      client: 'Maisonette Electrical Repair',
      title: 'Residential Wiring & Safety Check',
      description: 'A local homeowner needs a certified electrician to troubleshoot circuit breakers and update kitchen wiring.',
      location: 'Central Area',
      date: 'Apply by Jul 30, 2026',
      requirements: 'Must be a verified Fixam provider with Electrical Certification',
      isOpportunity: true,
      bannerBg: 'bg-gradient-to-r from-teal-500 to-emerald-600',
      icon: Zap,
      details: 'A residential homeowner is seeking a professional, certified electrician to conduct a full safety inspection and perform kitchen wiring upgrades. The job involves checking ground connections, replacing outdated circuit breakers, and ensuring compliance with local safety regulations. Work will take approximately 4-6 hours and payout will be made instantly upon client sign-off on the Fixam app.',
      relatedPaths: [
        {
          title: 'Residential Wiring Basics',
          category: 'Electrical Work',
          difficulty: 'Intermediate',
          hours: 6,
          image: '/images/electrical.jpg'
        }
      ]
    },
    {
      id: '2',
      client: 'Fixam Community',
      title: 'Fixam Professional Tools & Safety Workshop',
      description: 'Join our masterclass on professional tool management, client communications, and on-site safety standards.',
      location: 'Virtual (Zoom) / Community Center',
      date: 'Starts Jul 28, 2026',
      requirements: 'Open to all registered providers',
      isOpportunity: false,
      isUpcoming: true,
      bannerBg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      icon: Hammer,
      details: 'Learn from top trade professionals. This community workshop covers how to organize your toolbox for maximum efficiency, how to communicate professionally with clients to earn 5-star ratings, and critical workplace safety protocols. Attendance is free but registration is required to access the webinar link or attend in person.',
      relatedPaths: [
        {
          title: 'General Handyman',
          category: 'General Handyman',
          difficulty: 'Beginner-friendly',
          hours: 4,
          image: '/images/handyman.jpg'
        }
      ]
    },
    {
      id: '3',
      client: 'Commercial Plumbing Project',
      title: 'Office Bathrooms Water Leak Repair',
      description: 'Commercial property owner needs pipe sealing and toilet valve replacements in a 3-story office building.',
      location: 'North Area',
      date: 'Apply by Aug 5, 2026',
      requirements: 'Must be a verified Fixam provider with Plumbing Certification',
      isOpportunity: true,
      bannerBg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      icon: Droplets,
      details: 'Professional plumber needed for a commercial office leak issue. The scope of work includes diagnosing leaks across three restrooms, replacing faulty flush valves, and resealing pipe joints. Materials will be provided by the building manager. Payout is competitive and verified completion will boost your Fixam profile search ranking.',
      relatedPaths: [
        {
          title: 'Pipe Fitting & Water Systems',
          category: 'Plumbing',
          difficulty: 'Intermediate',
          hours: 5,
          image: '/images/plumbing.jpg'
        }
      ]
    },
    {
      id: '4',
      client: 'Fixam Wellness',
      title: 'Beauty & Spa Sanitization Masterclass',
      description: 'A comprehensive training session on advanced home spa sanitization and customer safety regulations.',
      location: 'West Area',
      date: 'Jul 25, 2026',
      requirements: 'Open to Beauty & Wellness providers',
      isOpportunity: false,
      bannerBg: 'bg-gradient-to-r from-pink-500 to-rose-600',
      icon: Scissors,
      details: 'Boost your ratings and protect your clients. This practical masterclass will teach you the highest standards of sterilization, workstation layout, and client comfort. Learn how to transform home beauty services into premium spa experiences. Attendees will receive a digital "Wellness Certified" badge on their profiles.',
      relatedPaths: [
        {
          title: 'Beauty & Grooming',
          category: 'Beauty & Grooming',
          difficulty: 'Beginner-friendly',
          hours: 4,
          image: '/images/beauty.jpg'
        }
      ]
    },
    {
      id: '5',
      client: 'Residential Painting Job',
      title: '3-Bedroom Apartment Interior Paint',
      description: 'Full interior paint job including walls, ceilings, and baseboard trims. Quality matte finish paint provided.',
      location: 'East Area',
      date: 'Apply by Aug 2, 2026',
      requirements: 'Must be a verified Fixam Painting provider',
      isOpportunity: true,
      bannerBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      icon: Paintbrush,
      details: 'A tenant is moving out and requires a high-quality repaint of a 3-bedroom apartment. Work includes surface preparation, wall sanding, tape masking, and applying two coats of matte paint. Work must be completed over a 3-day window. Clear communication and tidy cleanup are strict requirements.',
      relatedPaths: [
        {
          title: 'Interior Wall Painting',
          category: 'Painting',
          difficulty: 'Beginner-friendly',
          hours: 4,
          image: '/images/painting.jpg'
        }
      ]
    }
  ];

  // Filtering Logic
  const filtered = opportunities.filter((op) => {
    // 1. Quick filter
    if (quickFilter === 'recommended' && !op.isOpportunity) return false;
    // Mock saved/applied state as all for now

    // 2. Opportunity Type dropdown
    if (selectedType !== 'all') {
      if (selectedType === 'opportunity' && !op.isOpportunity) return false;
      if (selectedType === 'event' && op.isOpportunity) return false;
    }

    // 3. Region dropdown
    if (selectedRegion !== 'all' && !op.location.toLowerCase().includes(selectedRegion.toLowerCase())) return false;

    // 4. Category dropdown
    if (selectedCategory !== 'all' && !op.client.toLowerCase().includes(selectedCategory.toLowerCase()) && !op.title.toLowerCase().includes(selectedCategory.toLowerCase())) return false;

    // 5. Skill Level dropdown
    if (selectedLevel !== 'all') {
      const match = op.relatedPaths.some(path => path.difficulty.toLowerCase() === selectedLevel.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOpportunities = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedOp = opportunities.find((op) => op.id === selectedId) || opportunities[0];

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    setIsDescExpanded(false);
    setShowMobileDetail(true);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-850 tracking-tight">
            {t('opportunities.title')}
          </h1>
          <p className="mt-2 text-base text-gray-500 max-w-3xl leading-relaxed">
            {t('opportunities.subtitle')}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              {t('opportunities.quickFilters')}
            </span>
            <div className="flex flex-wrap gap-2">
              {(['all', 'recommended', 'saved', 'applied'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setQuickFilter(filter)}
                  className={`text-xs font-semibold py-2 px-4 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                    quickFilter === filter
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span>{t(`opportunities.filters.${filter}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Second Row select dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 text-xs font-semibold text-gray-755 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('opportunities.dropdowns.opportunityType')}: {t('opportunities.dropdowns.all')}</option>
              <option value="opportunity">{t('opportunities.badges.opportunity')}</option>
              <option value="event">{t('opportunities.badges.event')}</option>
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 text-xs font-semibold text-gray-755 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('opportunities.dropdowns.region')}: {t('opportunities.dropdowns.all')}</option>
              <option value="central">Central Area</option>
              <option value="north">North Area</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 text-xs font-semibold text-gray-755 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('opportunities.dropdowns.category')}: {t('opportunities.dropdowns.all')}</option>
              <option value="electrical">{t('trades.electrical')}</option>
              <option value="plumbing">{t('trades.plumbing')}</option>
              <option value="beauty">{t('trades.beauty')}</option>
              <option value="painting">{t('trades.painting')}</option>
              <option value="handyman">{t('trades.handyman')}</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 text-xs font-semibold text-gray-755 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('opportunities.dropdowns.skillLevel')}: {t('opportunities.dropdowns.all')}</option>
              <option value="beginner-friendly">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
        </div>

        {/* Displaying count line */}
        <div className="mb-6 text-sm text-gray-500 font-medium">
          {t('opportunities.displaying', {
            start: filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0,
            end: Math.min(currentPage * itemsPerPage, filtered.length),
            total: filtered.length
          })}
        </div>

        {/* Main Grid content split view */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Scrollable list of cards */}
          <div className={`lg:col-span-7 space-y-4 ${showMobileDetail ? 'hidden lg:block' : 'block'}`}>
            {paginatedOpportunities.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedOpportunities.map((op) => (
                    <div
                      key={op.id}
                      onClick={() => handleCardClick(op.id)}
                      className={`bg-white border p-5 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedId === op.id
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-gray-250 hover:border-gray-350'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {op.client}
                        </span>
                        {/* Badges */}
                        <div className="flex items-center gap-1.5">
                          {op.isOpportunity ? (
                            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              {t('opportunities.badges.opportunity')}
                            </span>
                          ) : (
                            <>
                              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                {t('opportunities.badges.event')}
                              </span>
                              {op.isUpcoming && (
                                <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  {t('opportunities.badges.upcoming')}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-gray-800 leading-snug mb-2">
                        {op.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                        {op.description}
                      </p>

                      <div className="flex items-center gap-5 text-xs text-gray-400 font-medium border-t border-gray-100 pt-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {op.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {op.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:pointer-events-none hover:border-gray-300 transition-all text-sm"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                            currentPage === page
                              ? 'bg-primary text-white font-bold'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:pointer-events-none hover:border-gray-300 transition-all text-sm"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium">{t('opportunities.empty')}</p>
                <button
                  onClick={() => {
                    setQuickFilter('all');
                    setSelectedType('all');
                    setSelectedRegion('all');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                  }}
                  className="mt-4 text-xs font-semibold text-primary underline underline-offset-2"
                >
                  {t('opportunities.clearFilters')}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Selected Detail Panel + Promo Banner */}
          <div className={`lg:col-span-5 space-y-6 lg:sticky lg:top-20 ${showMobileDetail ? 'block' : 'hidden lg:block'}`}>
            
            {/* Mobile Back Button */}
            {showMobileDetail && (
              <button
                onClick={() => setShowMobileDetail(false)}
                className="lg:hidden text-sm font-semibold text-primary mb-2 flex items-center gap-1 hover:underline"
              >
                {t('opportunities.mobileBack')}
              </button>
            )}

            {/* Selected item details card panel */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header image banner block */}
              <div className={`w-full h-32 ${selectedOp.bannerBg} relative`}>
                {/* Overlay tiny category card logo */}
                <div className="absolute -bottom-5 left-6 bg-white w-12 h-12 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-primary">
                  {selectedOp.isOpportunity ? (
                    <Zap className="w-6 h-6" />
                  ) : (
                    <Hammer className="w-6 h-6" />
                  )}
                </div>
              </div>

              {/* Detail body */}
              <div className="p-6 pt-9 space-y-5">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {selectedOp.client}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-850 leading-tight">
                    {selectedOp.title}
                  </h2>
                </div>

                {/* Badges / date row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedOp.isOpportunity ? (
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {t('opportunities.badges.opportunity')}
                    </span>
                  ) : (
                    <>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {t('opportunities.badges.event')}
                      </span>
                      {selectedOp.isUpcoming && (
                        <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {t('opportunities.badges.upcoming')}
                        </span>
                      )}
                    </>
                  )}
                  <span className="text-xs text-gray-400 font-semibold">{selectedOp.date}</span>
                </div>

                {/* Meta details list */}
                <div className="border-t border-b border-gray-150 py-4 space-y-3">
                  <div className="grid grid-cols-3 text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wider">
                      {t('opportunities.details.location')}
                    </span>
                    <span className="col-span-2 text-gray-700 font-semibold">
                      {selectedOp.location}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wider">
                      {t('opportunities.details.requirements')}
                    </span>
                    <span className="col-span-2 text-gray-700 font-semibold">
                      {selectedOp.requirements}
                    </span>
                  </div>
                </div>

                {/* Main Action buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                    <span>{t('opportunities.details.register')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button className="flex-1 bg-white border border-gray-250 hover:border-gray-350 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors">
                    {t('opportunities.details.registered')}
                  </button>
                </div>

                {/* Description text */}
                <div className="text-sm text-gray-550 leading-relaxed">
                  <p className={isDescExpanded ? 'line-clamp-none' : 'line-clamp-4'}>
                    {selectedOp.details}
                  </p>
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs font-bold text-primary mt-2 block hover:underline"
                  >
                    {isDescExpanded ? t('opportunities.details.viewLess') : t('opportunities.details.viewMore')}
                  </button>
                </div>

                {/* Connected related career path section */}
                <div className="border-t border-gray-150 pt-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {t('opportunities.details.relatedPaths')}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {t('opportunities.details.relatedPathsSub')}
                    </p>
                  </div>
                  
                  {selectedOp.relatedPaths.map((path, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex gap-3 items-center">
                      <img src={path.image} alt={path.title} className="w-14 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <h5 className="text-xs font-bold text-gray-800 mb-1">{path.title}</h5>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                          <span>{path.category}</span>
                          <span>•</span>
                          <span>{path.hours}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Available achievements section */}
                <div className="border-t border-gray-150 pt-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {t('opportunities.details.achievements')}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {t('opportunities.details.achievementsSub')}
                    </p>
                  </div>

                  {/* 2x2 achievements grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: FileText, label: t('opportunities.details.achievementItems.resume') },
                      { icon: Award, label: t('opportunities.details.achievementItems.interview') },
                      { icon: CheckCircle, label: t('opportunities.details.achievementItems.certificate') },
                      { icon: Zap, label: t('opportunities.details.achievementItems.skills') }
                    ].map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center gap-2 bg-gray-50/20">
                          <ItemIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-[11px] font-bold text-gray-700 leading-snug">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar Promo Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-gray-850 mb-4 flex items-center gap-2">
                <span className="text-primary text-base">📈</span>
                {t('opportunities.promo.title')}
              </h3>
              <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                {[1, 2, 3].map((num) => (
                  <li key={num} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="leading-relaxed">
                      {t(`opportunities.promo.bullet${num}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
