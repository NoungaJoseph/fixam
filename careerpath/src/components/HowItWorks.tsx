import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { num: 1, text: t('howWorks.step1') },
    { num: 2, text: t('howWorks.step2') },
    { num: 3, text: t('howWorks.step3') },
    { num: 4, text: t('howWorks.step4') },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {t('howWorks.title')}
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            {t('howWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line (desktop) */}
          <div className="absolute top-6 left-[12%] right-[12%] h-px bg-gray-200 z-0 hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-5">
                  {step.num}
                </div>
                {/* Step text */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/signup"
            className="inline-block text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-full transition-colors duration-200"
          >
            {t('howWorks.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
