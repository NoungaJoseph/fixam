import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function StatsBar() {
  const { t } = useTranslation();

  const stats = [
    { num: t('stats.stat1Num'), label: t('stats.stat1Label') },
    { num: t('stats.stat2Num'), label: t('stats.stat2Label') },
    { num: t('stats.stat3Num'), label: t('stats.stat3Label') },
  ];

  return (
    <section className="bg-gray-800 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Stats + CTA */}
          <div className="space-y-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                  {stat.num}
                </div>
                <p className="mt-1 text-sm sm:text-base text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
            <div className="pt-4">
              <Link
                to="/signup"
                className="inline-block text-sm font-semibold text-primary border border-primary px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {t('stats.cta')}
              </Link>
            </div>
          </div>

          {/* Right: Person photo */}
          <div className="hidden lg:block">
            <img
              src="/images/stats-person.png"
              alt="Fixam professional"
              className="w-full max-w-md ml-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
