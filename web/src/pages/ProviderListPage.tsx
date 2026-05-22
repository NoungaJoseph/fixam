import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';

export default function ProviderListPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialSearch = params.get('search') || '';
  const initialCat = params.get('category') || '';
  const { providers, fetchAppData } = useAppContext();
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const filtered = useMemo(() => {
    const cat = initialCat.toLowerCase();
    const q = search.trim().toLowerCase();
    return providers.filter((p) => {
      const hay = `${p.name} ${p.skill} ${p.skills?.join(' ')}`.toLowerCase();
      if (cat && !p.skills?.some((s: string) => s.toLowerCase().includes(cat))) return false;
      if (!q) return true;
      return hay.includes(q);
    });
  }, [providers, search, initialCat]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-alt)' }}>
      <Navbar />

      <main style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '4rem' }}>
            <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {initialCat ? `${initialCat} Professionals` : 'Find the best professionals'}
            </h1>
            <p className="page-subtitle">Browse through our network of verified home service experts.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '300px 1fr' : '1fr', gap: '3rem', alignItems: 'flex-start' }}>
            
            {/* Sidebar Filters */}
            <aside className="card-premium" style={{ padding: '2rem', position: 'sticky', top: '10rem', display: window.innerWidth > 1024 ? 'block' : 'none' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Filter size={20} style={{ color: 'var(--primary)' }} /> Filter Marketplace
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <label className="label-mini">Discipline</label>
                    <select className="input-field">
                      <option>All Disciplines</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Cleaning</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label-mini">Talent Tier</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {['Entry Level', 'Intermediate', 'Expert'].map(level => (
                        <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy-soft)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '0.5rem' }} />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: '1.5rem' }}>Location</h3>
                <div style={{ position: 'relative' }}>
                  <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                  <input 
                    type="text" 
                    placeholder="Douala, Cameroon" 
                    className="input-field"
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {filtered.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {filtered.map((p) => (
                    <article key={p.id} className="card-premium" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '2rem', overflow: 'hidden', background: 'var(--surface-alt)', border: '1px solid var(--border)' }}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', fontSize: '2rem' }}>
                            {p.name?.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{p.name}</h3>
                          <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.skill || 'Expert'}</p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 700 }}>
                           <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <Star size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} /> {p.rating || '5.0'}
                           </span>
                           <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <MapPin size={16} /> {p.serviceArea || p.distance || 'Douala, CM'}
                           </span>
                           <span style={{ background: 'var(--surface-alt)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '11px', color: 'var(--navy)' }}>
                             XAF {Number(p.rate || 0).toLocaleString()} / hr
                           </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button 
                          className="btn-primary"
                          onClick={() => navigate(`/profile/${p.userId || p.id}`)}
                          style={{ width: '160px' }}
                        >
                          View Profile
                        </button>
                        <button className="btn-navy" style={{ background: 'white', color: 'var(--navy)', border: '1px solid var(--border)', padding: '0.5rem' }}>
                          Save
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="card-premium" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                  <Search size={48} style={{ color: '#cbd5e1', marginBottom: '2rem' }} />
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>No talent found</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 700, maxWidth: '400px', margin: '0 auto 2rem' }}>Try adjusting your filters or search keywords to find the right pro.</p>
                  <button onClick={() => navigate('/providers')} className="btn-primary">Clear all filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
