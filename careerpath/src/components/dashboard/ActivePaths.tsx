import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';

type ActivePathsProps = {
  activePaths: any[];
};

export default function ActivePaths({ activePaths }: ActivePathsProps) {
  const { t } = useTranslation();

  // For the purpose of moving from mock data, we will map backend data to the required format
  // or just use the passed in activePaths directly if it matches.
  // Assuming activePaths is an array of CareerpathEnrollment objects from prisma.
  // We'll map them to the UI structure.
  
  const paths = activePaths.map(enroll => ({
    id: enroll.id,
    categoryKey: enroll.categoryKey,
    title: t(`trades.${enroll.categoryKey}`),
    difficulty: 'intermediate', // Example default
    hours: 10, // Example default
    image: `/images/${enroll.categoryKey}.jpg`,
  }));

  return (
    <div className="mb-6">
      <div className="bg-teal-50/60 border border-gray-200 rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <h2 className="text-lg font-bold text-gray-800">
              {t('dashboard.activePaths.title')}
            </h2>
          </div>
        </div>

        {paths.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
            {/* Simple line illustration — person with tools in Fixam teal */}
            <div className="flex-shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="56" stroke="#14B8A6" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                <circle cx="60" cy="40" r="14" stroke="#14B8A6" strokeWidth="2.5" fill="none" />
                <path d="M36 90c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="72" y="55" width="18" height="6" rx="3" stroke="#F97316" strokeWidth="2" fill="none" />
                <line x1="81" y1="61" x2="81" y2="72" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                {t('dashboard.activePaths.emptyTitle')}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                {t('dashboard.activePaths.emptyText')}
              </p>
              <Link to="/catalog" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                {t('dashboard.activePaths.explorePaths')}
              </Link>
            </div>
          </div>
        ) : (
          /* Populated state */
          <div className="space-y-4">
            {paths.map((path) => (
              <div key={path.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-40 h-28 sm:h-auto flex-shrink-0">
                    <img src={path.image} alt={path.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-4">
                    {/* Category tag row */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Zap className="w-3 h-3" />
                        <span>{t(`trades.${path.categoryKey}`)}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <span className="text-primary">●</span>
                        <span className="text-primary">●</span>
                        <span className="text-gray-300">●</span>
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {path.hours}h
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">{path.title}</h3>
                  </div>
                </div>
                {/* Actions */}
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                  <button className="text-xs font-medium text-gray-400 hover:text-gray-600">
                    {t('dashboard.activePaths.dismiss')}
                  </button>
                  <Link to={`/career-paths/${path.categoryKey}`} className="text-xs font-semibold text-primary hover:text-primary-hover">
                    {t('dashboard.activePaths.viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View all link */}
      <div className="mt-4">
        <Link to="/catalog" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
          {t('dashboard.activePaths.viewAll')}
        </Link>
      </div>
    </div>
  );
}
