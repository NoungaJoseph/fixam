import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Droplets, RefreshCw } from 'lucide-react';

export default function RecommendedCards() {
  const { t } = useTranslation();

  const cards = [
    {
      key: 'card1',
      categoryKey: 'electrical',
      icon: Zap,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      cardBg: 'bg-orange-50/50',
    },
    {
      key: 'card2',
      categoryKey: 'plumbing',
      icon: Droplets,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      cardBg: 'bg-teal-50/50',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`${card.cardBg} border border-gray-200 rounded-lg p-5 relative`}
          >
            {/* Refresh icon top-right */}
            <button className="absolute top-4 right-4 w-7 h-7 rounded-full border border-gray-250 bg-white flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Label */}
            <p className="text-xs font-medium text-gray-400 mb-3">
              {t('dashboard.recommended.label')}
            </p>

            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-md ${card.iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-sm font-bold text-gray-800">
                {t(`dashboard.recommended.${card.key}.category`)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              {t(`dashboard.recommended.${card.key}.title`)}
            </h3>

            {/* Divider + actions */}
            <div className="border-t border-gray-250 pt-3 flex items-center justify-between">
              <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                {t('dashboard.recommended.dismiss')}
              </button>
              <Link
                to={`/career-paths/${card.categoryKey}`}
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                {t('dashboard.recommended.startPath')}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
