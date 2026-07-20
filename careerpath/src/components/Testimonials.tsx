import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type TestimonialItem = {
  key: string;
  image: string;
};

export default function Testimonials() {
  const { t } = useTranslation();

  const items: TestimonialItem[] = [
    { key: 'provider1', image: '/images/testimonial-1.jpg' },
    { key: 'provider2', image: '/images/testimonial-2.jpg' },
    { key: 'provider3', image: '/images/testimonial-3.jpg' },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.key} className="flex flex-col">
              {/* Image */}
              <div className="w-full aspect-square overflow-hidden rounded-lg mb-5">
                <img
                  src={item.image}
                  alt={t(`testimonials.${item.key}.name`)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {t(`testimonials.${item.key}.quote`)}
              </p>

              {/* Name */}
              <h4 className="text-sm font-bold text-primary">
                {t(`testimonials.${item.key}.name`)}
              </h4>

              {/* Role */}
              <p className="text-xs text-gray-400 mt-0.5">
                {t(`testimonials.${item.key}.role`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/signup"
            className="inline-block text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-full transition-colors duration-200"
          >
            {t('testimonials.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
