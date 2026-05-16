import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, User, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'provider' ? 'provider' : 'client';
  const [role, setRole] = useState<'client' | 'provider'>(defaultRole);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: role.toUpperCase(),
        providerProfile: role === 'provider' ? { skills: [], bio: '', rate: 0 } : undefined,
      });
      navigate(role === 'provider' ? '/provider-home' : '/home');
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '2rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.05em' }}>
          FIXAM.
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="register-container">
          
          {/* Visual Side */}
          <div className="visual-side">
             <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
             
             <Link to="/login" style={{ position: 'relative', zIndex: 10, color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Already have an account?
             </Link>

             <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
                   Start your <br/> professional journey.
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {[
                     'Secure payment protection',
                     'Access to top talent/projects',
                     '24/7 Priority support'
                   ].map(text => (
                     <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <CheckCircle2 size={24} style={{ color: 'var(--navy)' }} />
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, opacity: 0.9 }}>{text}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div style={{ position: 'relative', zIndex: 10, paddingTop: '2rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontStyle: 'italic', fontSize: '1.125rem' }}>
                   "Joining Fixam was the best decision for my freelance career. The trust built here is unmatched."
                </p>
             </div>
          </div>

          {/* Form Side */}
          <div className="form-side">
             <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '0.5rem' }}>Create Account</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em' }}>Join our growing marketplace</p>

                {/* Role Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                   <button 
                     type="button"
                     onClick={() => setRole('client')}
                     style={{ 
                       padding: '1.5rem', 
                       borderRadius: '1.5rem', 
                       border: `2px solid ${role === 'client' ? 'var(--primary)' : '#f1f5f9'}`,
                       background: role === 'client' ? '#eff6ff' : 'white',
                       cursor: 'pointer',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       transition: 'all 0.2s'
                     }}
                   >
                      <User size={32} style={{ color: role === 'client' ? 'var(--primary)' : '#cbd5e1', marginBottom: '0.5rem' }} />
                      <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: role === 'client' ? 'var(--navy)' : '#94a3b8' }}>I'm a Client</span>
                   </button>
                   <button 
                     type="button"
                     onClick={() => setRole('provider')}
                     style={{ 
                       padding: '1.5rem', 
                       borderRadius: '1.5rem', 
                       border: `2px solid ${role === 'provider' ? 'var(--primary)' : '#f1f5f9'}`,
                       background: role === 'provider' ? '#eff6ff' : 'white',
                       cursor: 'pointer',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       transition: 'all 0.2s'
                     }}
                   >
                      <Briefcase size={32} style={{ color: role === 'provider' ? 'var(--primary)' : '#cbd5e1', marginBottom: '0.5rem' }} />
                      <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: role === 'provider' ? 'var(--navy)' : '#94a3b8' }}>I'm a Provider</span>
                   </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                         <label className="label-mini">First Name</label>
                         <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" className="input-field" required />
                      </div>
                      <div>
                         <label className="label-mini">Last Name</label>
                         <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" className="input-field" required />
                      </div>
                   </div>

                   <div>
                      <label className="label-mini">Email Address</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" className="input-field" required />
                   </div>

                   <div>
                      <label className="label-mini">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="6XX XXX XXX" className="input-field" />
                   </div>

                   <div>
                      <label className="label-mini">Secure Password</label>
                      <div style={{ position: 'relative' }}>
                         <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" className="input-field" required />
                         <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="btn-navy"
                     style={{ padding: '1.25rem', fontSize: '1.125rem', marginTop: '1rem' }}
                   >
                      {loading ? 'Creating Account...' : 'Create My Account'}
                   </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '2rem', fontWeight: 700 }}>
                   By creating an account, you agree to Fixam's <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms</span> and <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Privacy Policy</span>.
                </p>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
