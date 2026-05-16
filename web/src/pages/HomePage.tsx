import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Wallet, Star, ChevronRight, Search, Zap } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { jobs, walletBalance, providers, fetchAppData } = useAppContext();

  React.useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

  const recommended = useMemo(() => providers.slice(0, 4), [providers]);

  return (
    <AppLayout
      title="Client Dashboard"
      subtitle="Your centralized workspace for hiring and managing professional talent."
    >
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 400px' : '1fr', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.1 }}>Your active jobs</h2>
              <p className="label-mini" style={{ marginTop: '0.5rem' }}>Manage your ongoing service requests</p>
            </div>
            <button onClick={() => navigate('/post-task')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>View All Tasks</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {jobs.length === 0 ? (
              <div className="card-premium" style={{ padding: '5rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--surface-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                   <Plus size={40} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '1rem' }}>No tasks published yet</h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '2.5rem', maxWidth: '350px', margin: '0 auto 2.5rem' }}>Start by describing your needs and connect with the best pros in Douala.</p>
                <button
                  onClick={() => navigate('/post-task')}
                  className="btn-primary"
                  style={{ padding: '1rem 3rem' }}
                >
                  Post Your First Task
                </button>
              </div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="card-premium" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)' }}>{job.title}</h3>
                      <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>{job.category || 'General Service'}</p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 900, padding: '0.4rem 1rem', borderRadius: '0.5rem', background: 'var(--surface-alt)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {job.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>"{job.description}"</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Zap size={14} color="var(--primary)" />
                       {job.location}
                    </div>
                    <div>Budget: {Number(job.budget || 0).toLocaleString()} XAF</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Action Card */}
          <div style={{ background: 'var(--navy)', borderRadius: '3rem', padding: '2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
             <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--primary)', fontStyle: 'italic' }}>Ready to build?</h3>
             <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '2.5rem', fontSize: '1.125rem', lineHeight: '1.5' }}>Hire specialized talent for your property maintenance and projects.</p>
             <button onClick={() => navigate('/post-task')} className="btn-primary" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <Plus size={24} /> Post New Task
             </button>
          </div>

          {/* Wallet Card */}
          <div className="card-premium" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <div style={{ width: '48px', height: '48px', background: 'var(--surface-alt)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Wallet size={24} />
               </div>
               <p className="label-mini">Available Balance</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2.5rem' }}>
               <p style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--navy)', lineHeight: 1 }}>{walletBalance.toLocaleString()}</p>
               <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>XAF</p>
            </div>
            <button onClick={() => navigate('/wallet')} style={{ width: '100%', padding: '1rem', background: 'var(--surface-alt)', color: 'var(--navy)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', borderRadius: '1.5rem', cursor: 'pointer' }}>
              Manage Funds
            </button>
          </div>

          {/* Suggested Talent */}
          <div className="card-premium" style={{ padding: '2.5rem' }}>
            <h4 className="label-mini" style={{ marginBottom: '2.5rem' }}>Suggested Pros</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {recommended.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/profile/${p.userId || p.id}`)}
                  style={{ width: '100%', border: 'none', background: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                >
                  <div style={{ width: '64px', height: '64px', background: 'var(--surface-alt)', borderRadius: '1.25rem', overflow: 'hidden', flexShrink: 0 }}>
                    {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '0.25rem' }}>{p.name}</p>
                    <p className="label-mini" style={{ fontSize: '10px' }}>{p.skill}</p>
                  </div>
                  <ChevronRight size={18} color="#cbd5e1" />
                </button>
              ))}
              {recommended.length === 0 && (
                <p style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.875rem' }}>Searching for matches...</p>
              )}
            </div>
            <button onClick={() => navigate('/providers')} className="btn-navy" style={{ width: '100%', marginTop: '3rem', background: 'white', color: 'var(--navy)', border: '1px solid var(--border)', padding: '0.75rem' }}>
               Browse All Talent
            </button>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
