import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Briefcase, 
  Paintbrush, 
  Hammer, 
  Globe, 
  Search,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: <Zap className="w-10 h-10" />, desc: 'Certified electricians for repairs and installations.', color: 'bg-blue-500' },
  { id: 'plumbing', name: 'Plumbing', icon: <Briefcase className="w-10 h-10" />, desc: 'Expert plumbers for leaks, pipes, and fixtures.', color: 'bg-blue-600' },
  { id: 'cleaning', name: 'Cleaning', icon: <Zap className="w-10 h-10" />, desc: 'Deep cleaning and maintenance for homes and offices.', color: 'bg-blue-400' },
  { id: 'carpentry', name: 'Carpentry', icon: <Hammer className="w-10 h-10" />, desc: 'Custom furniture and structural woodwork.', color: 'bg-blue-700' },
  { id: 'painting', name: 'Painting', icon: <Paintbrush className="w-10 h-10" />, desc: 'Interior and exterior painting with premium finish.', color: 'bg-blue-500' },
  { id: 'landscaping', name: 'Landscaping', icon: <Globe className="w-10 h-10" />, desc: 'Garden design, maintenance, and outdoor care.', color: 'bg-blue-600' },
];

export default function CategoryHubPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-alt)' }}>
      <Navbar />

      <main style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="container">
          
          <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
             <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                Explore by <span style={{ color: 'var(--primary)' }}>Category</span>
             </h1>
             <p className="label-mini" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Find the specialized expertise you need for your specific property project
             </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/providers?category=${cat.name}`}
                className="card-premium"
                style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '1.5rem', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2.5rem' }}>
                   {cat.icon}
                </div>
                
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--navy)' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{cat.desc}"
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                   Browse Talent <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Hub */}
          <div className="cta-banner" style={{ marginTop: '8rem' }}>
             <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <ShieldCheck size={80} style={{ color: 'white', opacity: 0.8, marginBottom: '2.5rem' }} />
                <h2 className="cta-title">Can't find what you're looking for?</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '3rem' }}>
                  Our specialists cover over 50+ property service categories across all regions of Cameroon.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                   <Link to="/post-task" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', padding: '1.25rem 3rem' }}>
                      Describe Your Job
                   </Link>
                   <Link to="/providers" className="btn-navy" style={{ padding: '1.25rem 3rem' }}>
                      Search All Talent
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
