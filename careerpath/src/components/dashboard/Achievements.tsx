import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Award, Wrench } from 'lucide-react';

export default function Achievements() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const cards = [
    {
      icon: Award,
      iconBg: 'bg-teal-50',
      iconColor: 'text-primary',
      count: t('dashboard.achievements.certificatesCount', { count: user?.certificatesCount ?? 0 }),
      caption: t('dashboard.achievements.certificatesCaption'),
    },
    {
      icon: Wrench,
      iconBg: 'bg-orange-50',
      iconColor: 'text-accent',
      count: t('dashboard.achievements.skillsCount', { count: user?.skillsCount ?? 0 }),
      caption: t('dashboard.achievements.skillsCaption'),
    },
  ];

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏆</span>
        <h2 className="text-lg font-bold text-gray-800">
          {t('dashboard.achievements.title')}
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.count}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.caption}</p>
            </div>
          );
        })}
      </div>

      {/* Link */}
      <div className="mt-4 text-right">
        <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
          {t('dashboard.achievements.goToCompleted')}
        </a>
      </div>
    </div>
  );
}
