import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-primary-soft py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight leading-tight">
          {t('hero.title')}
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>

        <div className="mt-10">
          <Link
            to="/login?redirect=catalog"
            className="inline-block font-semibold bg-primary hover:bg-primary-hover text-white text-base px-8 py-3.5 rounded-full transition-colors duration-200"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
