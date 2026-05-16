import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Star, 
  Menu, 
  X, 
  Zap, 
  ShieldCheck, 
  Trophy,
  Briefcase,
  Globe,
  Paintbrush,
  Hammer,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: <Zap className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'plumbing', name: 'Plumbing', icon: <Briefcase className="w-6 h-6" />, color: 'bg-blue-600' },
  { id: 'cleaning', name: 'Cleaning', icon: <Zap className="w-6 h-6" />, color: 'bg-blue-400' },
  { id: 'carpentry', name: 'Carpentry', icon: <Hammer className="w-6 h-6" />, color: 'bg-blue-700' },
  { id: 'painting', name: 'Painting', icon: <Paintbrush className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'landscaping', name: 'Landscaping', icon: <Globe className="w-6 h-6" />, color: 'bg-blue-600' },
];

const POPULAR_SERVICES = [
  { title: 'Emergency Repair', description: 'Fast electrical & plumbing fix', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop' },
  { title: 'Deep Cleaning', description: 'Make your home sparkle', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop' },
  { title: 'Home Renovation', description: 'Expert carpentry & design', image: 'https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=800&auto=format&fit=crop' },
  { title: 'Garden Care', description: 'Professional landscaping', image: 'https://images.unsplash.com/photo-1558905619-159c99731671?q=80&w=800&auto=format&fit=crop' },
];

export default function LandingPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/providers?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="flex-1">
      <Navbar />

      {/* Hero Section */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="animate-up">
              <h1 className="page-title" style={{ marginBottom: '2rem' }}>
                Find the right <span style={{ color: 'var(--primary)' }}>pro</span> for your home.
              </h1>
              <p className="page-subtitle" style={{ marginBottom: '3rem', maxWidth: '500px' }}>
                The world's work marketplace for property services. Connect with verified talent from your community.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2" style={{ background: 'white', padding: '0.5rem', borderRadius: '2rem', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
                <input 
                  type="text" 
                  placeholder='Try "electrician" or "cleaning"' 
                  style={{ flex: 1, border: 'none', padding: '1rem 1.5rem', outline: 'none', fontWeight: 600 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn-primary" style={{ padding: '0.75rem 2.5rem' }}>Search</button>
              </form>
            </div>

            <div style={{ position: 'relative' }}>
               <img 
                 src="https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=1200&auto=format&fit=crop" 
                 alt="Professional" 
                 style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-premium)' }}
               />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ margin: '8rem auto' }}>
        <div className="cta-banner">
          <h2 className="cta-title">Ready to get started?</h2>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="btn-navy" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }}>Post a Job</Link>
            <Link to="/register?role=provider" className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', background: 'white', color: 'var(--primary)' }}>Find Work</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem', display: 'block' }}>FIXAM.</Link>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Empowering local pros and making maintenance effortless.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>For Clients</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><Link to="/providers" className="nav-link">Marketplace</Link></li>
                <li><Link to="/post-task" className="nav-link">Post a task</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>For Providers</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><Link to="/register?role=provider" className="nav-link">Find work</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>© {new Date().getFullYear()} Fixam Cameroon</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
