import { useTranslation } from 'react-i18next';
import {
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush,
  Wrench, Leaf, Shirt, Utensils, GraduationCap, Construction,
} from 'lucide-react';

type Category = {
  key: string;
  icon: any;
};

export default function FeaturedGrid() {
  const { t } = useTranslation();

  const categories: Category[] = [
    { key: 'electrical', icon: Zap },
    { key: 'plumbing', icon: Droplets },
    { key: 'carpentry', icon: Hammer },
    { key: 'cleaning', icon: Sparkles },
    { key: 'beauty', icon: Scissors },
    { key: 'painting', icon: Paintbrush },
    { key: 'appliance', icon: Wrench },
    { key: 'gardening', icon: Leaf },
    { key: 'tailoring', icon: Shirt },
    { key: 'catering', icon: Utensils },
    { key: 'tutoring', icon: GraduationCap },
    { key: 'handyman', icon: Construction },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {t('featured.title')}
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            {t('featured.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center transition-colors duration-200 hover:border-primary"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t(`trades.${cat.key}`)}
                </h3>
                <a
                  href="#"
                  className="text-xs font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  {t('featured.viewPath')}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
