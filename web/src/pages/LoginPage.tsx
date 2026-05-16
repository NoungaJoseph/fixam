import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = contact.includes('@');
      const data = await login(isEmail ? contact : '', !isEmail ? contact : '', password);
      navigate(data.user?.role?.toUpperCase() === 'PROVIDER' ? '/provider-home' : '/home');
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-alt)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '2rem 3rem' }}>
        <Link to="/" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          FIXAM<span style={{ color: 'var(--navy)' }}>.</span>
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '1000px', width: '100%', background: 'white', borderRadius: '3rem', boxShadow: 'var(--shadow-premium)', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
          
          {/* Visual Side */}
          <div style={{ background: 'var(--navy)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', position: 'relative' }}>
             <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
                <img 
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop" 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }}
                />
             </div>
             
             <Link to="/" style={{ position: 'relative', zIndex: 10, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, textDecoration: 'none' }}>
                <ArrowLeft size={20} /> Back to marketplace
             </Link>

             <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                   <ShieldCheck size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: '1.1' }}>
                   Secure access to <br/> your workspace.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem', fontWeight: 700, lineHeight: '1.6', maxWidth: '400px' }}>
                   Join thousands of professionals and homeowners who rely on Fixam for high-quality service interactions.
                </p>
             </div>
          </div>

          {/* Form Side */}
          <div style={{ padding: '5rem' }}>
             <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p className="label-mini" style={{ marginBottom: '3rem' }}>Enter your details to continue</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div>
                      <label className="label-mini" style={{ marginBottom: '0.75rem', display: 'block' }}>Email or Phone</label>
                      <input 
                        type="text" 
                        placeholder="john@example.com" 
                        className="input-field"
                        style={{ padding: '1rem 1.5rem' }}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                      />
                   </div>

                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                         <label className="label-mini">Password</label>
                         <button type="button" style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>Forgot password?</button>
                      </div>
                      <div style={{ position: 'relative' }}>
                         <input 
                           type={showPw ? 'text' : 'password'} 
                           placeholder="••••••••" 
                           className="input-field"
                           style={{ padding: '1rem 1.5rem' }}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                         />
                         <button 
                           type="button" 
                           onClick={() => setShowPw(!showPw)}
                           style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer' }}
                         >
                            {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="btn-primary"
                     style={{ padding: '1.25rem', fontSize: '1.125rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                   >
                      {loading && <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />}
                      {loading ? 'Verifying...' : 'Sign In'}
                   </button>
                </form>

                <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                   <p style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '1rem' }}>New to Fixam?</p>
                   <Link 
                     to="/register" 
                     style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.125rem', textDecoration: 'none' }}
                   >
                      Create an account today
                   </Link>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
