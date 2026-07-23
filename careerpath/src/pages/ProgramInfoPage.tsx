import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardNav from '../components/dashboard/DashboardNav';
import { 
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush, 
  Wrench, Leaf, Shirt, Utensils, GraduationCap, Construction,
  CheckCircle2, ArrowRight
} from 'lucide-react';

export default function ProgramInfoPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const getIcon = () => {
    switch(categoryKey) {
      case 'electrical': return Zap;
      case 'plumbing': return Droplets;
      case 'carpentry': return Hammer;
      case 'cleaning': return Sparkles;
      case 'beauty': return Scissors;
      case 'painting': return Paintbrush;
      case 'appliance': return Wrench;
      case 'gardening': return Leaf;
      case 'tailoring': return Shirt;
      case 'catering': return Utensils;
      case 'tutoring': return GraduationCap;
      case 'handyman': return Construction;
      default: return Zap;
    }
  };

  const Icon = getIcon();
  const title = t(`trades.${categoryKey || 'electrical'}`);
  const image = `/images/${categoryKey || 'electrical'}.jpg`;

  const handleStart = () => {
    if (isLoggedIn) {
      navigate(`/career-paths/${categoryKey}`);
    } else {
      navigate(`/login?redirect=/career-paths/${categoryKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
      {isLoggedIn ? <DashboardNav /> : <Navbar />}

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase">
                <Icon className="w-4 h-4" />
                {t('featured.title', 'Fixam Skill Category')}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {title} <br className="hidden sm:block"/> Certification Path
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Get certified in specific skills that clients worldwide are looking for right now. 
                Our {title} path will teach you the professional standards, safety protocols, 
                and practical techniques required to succeed in this industry.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStart}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30"
                >
                  Start Program Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-gray-200">
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-orange-100 rounded-2xl z-0 border border-orange-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Details Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What you'll gain from this program</h2>
          <p className="text-gray-600">Everything you need to start booking high-paying jobs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Industry-Standard Techniques',
              desc: `Master the step-by-step diagnostic workflow and best practices for ${title} services.`
            },
            {
              title: 'Safety & Compliance',
              desc: 'Learn the critical safety guidelines and materials configuration required on residential and commercial sites.'
            },
            {
              title: 'Verified Certification',
              desc: 'Complete the path to earn a Fixam Verified badge, unlocking higher paying jobs and better client trust.'
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
