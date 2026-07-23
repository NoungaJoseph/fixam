import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush,
  Wrench, Leaf, Shirt, Utensils, GraduationCap, Construction,
  ChevronLeft, ChevronRight, Clock,
} from 'lucide-react';

type TradeCategory = {
  key: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate';
  hours: number;
  image: string;
};

export default function CategoryCarousel() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const categories: TradeCategory[] = [
    { key: 'electrical', icon: Zap, difficulty: 'intermediate', hours: 6, image: '/images/electrical.jpg' },
    { key: 'plumbing', icon: Droplets, difficulty: 'intermediate', hours: 5, image: '/images/plumbing.jpg' },
    { key: 'carpentry', icon: Hammer, difficulty: 'intermediate', hours: 7, image: '/images/carpentry.jpg' },
    { key: 'cleaning', icon: Sparkles, difficulty: 'beginner', hours: 3, image: '/images/cleaning.jpg' },
    { key: 'beauty', icon: Scissors, difficulty: 'beginner', hours: 4, image: '/images/beauty.jpg' },
    { key: 'painting', icon: Paintbrush, difficulty: 'beginner', hours: 4, image: '/images/painting.jpg' },
    { key: 'appliance', icon: Wrench, difficulty: 'intermediate', hours: 6, image: '/images/appliance.jpg' },
    { key: 'gardening', icon: Leaf, difficulty: 'beginner', hours: 3, image: '/images/gardening.jpg' },
    { key: 'tailoring', icon: Shirt, difficulty: 'intermediate', hours: 8, image: '/images/tailoring.jpg' },
    { key: 'catering', icon: Utensils, difficulty: 'intermediate', hours: 5, image: '/images/catering.jpg' },
    { key: 'tutoring', icon: GraduationCap, difficulty: 'beginner', hours: 3, image: '/images/tutoring.jpg' },
    { key: 'handyman', icon: Construction, difficulty: 'beginner', hours: 4, image: '/images/handyman.jpg' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const difficultyDots = (level: 'beginner' | 'intermediate') => {
    if (level === 'beginner') {
      return (
        <span className="text-xs text-gray-500 flex items-center gap-0.5">
          <span className="text-primary">●</span>
          <span className="text-gray-300">●</span>
          <span className="text-gray-300">●</span>
          <span className="ml-1">{t('carousel.difficulty.beginner')}</span>
        </span>
      );
    }
    return (
      <span className="text-xs text-gray-500 flex items-center gap-0.5">
        <span className="text-primary">●</span>
        <span className="text-primary">●</span>
        <span className="text-gray-300">●</span>
        <span className="ml-1">{t('carousel.difficulty.intermediate')}</span>
      </span>
    );
  };

  return (
    <section id="career-paths" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {t('carousel.title')}
          </h2>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  to={`/info/${cat.key}`}
                  className="w-[260px] sm:w-[280px] bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 snap-start flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer text-left"
                >
                  {/* Card image */}
                  <div className="w-full h-36 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={t(`trades.${cat.key}`)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    {/* Category tag */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t(`trades.${cat.key}`)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-800 mb-3">
                      {t(`trades.${cat.key}`)}
                    </h3>

                    {/* Meta row: difficulty dots + duration */}
                    <div className="flex items-center justify-between mb-4">
                      {difficultyDots(cat.difficulty)}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('carousel.duration', { count: cat.hours })}
                      </span>
                    </div>

                    <div className="border-t border-gray-150 pt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // prevent the Link from navigating
                          if (isLoggedIn) {
                            navigate(`/career-paths/${cat.key}`);
                          } else {
                            navigate(`/login?redirect=/career-paths/${cat.key}`);
                          }
                        }}
                        className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                      >
                        {t('carousel.viewPath', 'Start Path')}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
