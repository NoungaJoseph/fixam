import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

export default function Opportunities() {
  const { t } = useTranslation();

  const jobs = [
    { key: 'job1' },
    { key: 'job2' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💼</span>
        <h2 className="text-lg font-bold text-gray-800">
          {t('dashboard.opportunities.title')}
        </h2>
      </div>

      {/* Cards */}
      <div className="bg-orange-50/50 border border-gray-200 rounded-lg p-5 space-y-4">
        {jobs.map((job) => (
          <div key={job.key} className="bg-white border border-gray-200 rounded-lg p-4">
            {/* Title */}
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              {t(`dashboard.opportunities.${job.key}.title`)}
            </h3>
            {/* Description */}
            <p className="text-xs text-gray-500 mb-2">
              {t(`dashboard.opportunities.${job.key}.description`)}
            </p>
            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <Clock className="w-3 h-3" />
              <span>{t(`dashboard.opportunities.${job.key}.date`)}</span>
            </div>
            {/* Divider + actions */}
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                {t('dashboard.opportunities.notInterested')}
              </button>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                {t('dashboard.opportunities.viewDetails')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
