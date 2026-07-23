import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Shield, TrendingUp } from 'lucide-react';

export default function ForProvidersPage() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Shield,
      title: t('providersPage.benefit1Title'),
      desc: t('providersPage.benefit1Desc'),
      colorClass: 'text-primary bg-teal-50',
    },
    {
      icon: TrendingUp,
      title: t('providersPage.benefit2Title'),
      desc: t('providersPage.benefit2Desc'),
      colorClass: 'text-orange-500 bg-orange-50',
    },
    {
      icon: Award,
      title: t('providersPage.benefit3Title'),
      desc: t('providersPage.benefit3Desc'),
      colorClass: 'text-blue-500 bg-blue-50',
    },
  ];

  const steps = [
    {
      num: '1',
      title: t('providersPage.step1Title'),
      desc: t('providersPage.step1Desc'),
    },
    {
      num: '2',
      title: t('providersPage.step2Title'),
      desc: t('providersPage.step2Desc'),
    },
    {
      num: '3',
      title: t('providersPage.step3Title'),
      desc: t('providersPage.step3Desc'),
    },
    {
      num: '4',
      title: t('providersPage.step4Title'),
      desc: t('providersPage.step4Desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <Navbar />

      {/* Hero Banner Area */}
      <section className="bg-primary-soft py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800 leading-tight">
              {t('providersPage.heroTitle')}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('providersPage.heroSubtitle')}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-hover text-white text-base font-semibold py-3.5 px-8 rounded-full transition-all text-center"
              >
                {t('providersPage.heroCta')}
              </Link>
              <a
                href="#how-it-works"
                className="border border-gray-300 hover:border-primary text-gray-600 hover:text-primary text-base font-semibold py-3.5 px-8 rounded-full transition-all text-center"
              >
                See How It Works
              </a>
            </div>
          </div>
          {/* Right illustration / Image */}
          <div className="hidden lg:flex justify-end">
            <img 
              src="/images/electrical.jpg" 
              alt="Trade Professional" 
              className="w-full max-w-lg rounded-2xl object-cover shadow-2xl h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('providersPage.whyTitle')}
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              {t('providersPage.whySubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-2xl p-8 space-y-4 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${benefit.colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works for providers */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('providersPage.stepsTitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="space-y-4 relative">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="bg-primary py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            {t('providersPage.ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg text-teal-50 max-w-2xl mx-auto leading-relaxed">
            Join thousands of trade experts who are using Fixam Career Pathways to grow their businesses and earnings.
          </p>
          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-block bg-white hover:bg-slate-50 text-primary font-bold text-sm py-3.5 px-10 rounded-full transition-all shadow-md"
            >
              Register as a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
