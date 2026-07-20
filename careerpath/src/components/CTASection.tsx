import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="bg-primary-soft py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content — LEFT aligned */}
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
              {t('mission.title')}
            </h2>
            <p className="mt-5 text-base text-gray-500 leading-relaxed max-w-lg">
              {t('mission.subtitle')}
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-block text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-full transition-colors duration-200"
              >
                {t('mission.cta')}
              </Link>
            </div>
          </div>

          {/* Right: Abstract brand graphic */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-72 h-72">
              {/* Simple abstract teal/orange shapes */}
              <div className="absolute top-4 left-4 w-40 h-40 rounded-full bg-primary/20" />
              <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-accent/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
