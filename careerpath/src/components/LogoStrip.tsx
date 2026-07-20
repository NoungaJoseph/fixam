import { useTranslation } from 'react-i18next';
import { Zap, Droplets, Hammer, Scissors, Shirt } from 'lucide-react';

export default function LogoStrip() {
  const { t } = useTranslation();

  const skills = [
    { name: t('trades.electrical'), icon: Zap },
    { name: t('trades.plumbing'), icon: Droplets },
    { name: t('trades.carpentry'), icon: Hammer },
    { name: t('trades.beauty'), icon: Scissors },
    { name: t('trades.tailoring'), icon: Shirt },
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-400 mb-8">
          {t('logoStrip.title')}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-16">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-500 font-bold text-lg md:text-xl transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span>{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
