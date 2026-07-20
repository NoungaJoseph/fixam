import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import LogoStrip from '../components/LogoStrip';
import CategoryCarousel from '../components/CategoryCarousel';
import HowItWorks from '../components/HowItWorks';
import FeaturedGrid from '../components/FeaturedGrid';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <LogoStrip />
      <CategoryCarousel />
      <HowItWorks />
      <FeaturedGrid />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}
