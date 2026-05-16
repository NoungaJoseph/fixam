import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  UserCheck, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  Clock, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const FAQS = [
  { q: 'How do I pay my professional?', a: 'All payments are handled securely through the Fixam app using credit card or bank transfer. Cash payments are strictly prohibited for your security.' },
  { q: "What if I'm not happy with the service?", a: 'Our "Fixam Guarantee" ensures that if the work doesn\'t meet the described standards, we will investigate and provide a full or partial refund.' },
  { q: 'How do you verify professionals?', a: 'We conduct identity verification, criminal background checks, and verify trade certifications where applicable for all pros before they can bid on jobs.' },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ paddingTop: '12rem', paddingBottom: '6rem', background: 'var(--navy)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="page-title" style={{ color: 'white', fontSize: '4rem', marginBottom: '1.5rem' }}>
             Work happens <span style={{ color: 'var(--primary)' }}>better</span> here.
          </h1>
          <p className="page-subtitle" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 3rem' }}>
             Discover how Fixam connects homeowners with top-tier professional talent in a secure, transparent environment.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
             <Link to="/register" className="btn-primary" style={{ padding: '1rem 3rem' }}>Get Started</Link>
             <Link to="/register?role=provider" className="btn-navy" style={{ background: 'white', color: 'var(--navy)', padding: '1rem 3rem' }}>Become a Partner</Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container" style={{ padding: '8rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center', marginBottom: '10rem' }}>
           <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '3rem' }}>How to hire professionals</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 {[
                   { icon: <Search />, title: 'Post a job for free', desc: 'Tell us about your project. Fixam connects you with top talent around your location.' },
                   { icon: <UserCheck />, title: 'Pros come to you', desc: 'Get qualified proposals within 24 hours. Compare bids, reviews, and prior work.' },
                   { icon: <CreditCard />, title: 'Collaborate and pay', desc: 'Use our workspace to message, share files, and pay securely from your desktop or phone.' }
                 ].map((step, i) => (
                   <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'var(--surface-alt)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         {step.icon}
                      </div>
                      <div>
                         <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '0.5rem' }}>{step.title}</h3>
                         <p style={{ color: 'var(--text-muted)', fontWeight: 700, lineHeight: '1.6' }}>{step.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4rem', color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>
                 Start hiring now <ArrowRight size={20} />
              </Link>
           </div>
           <div style={{ background: 'var(--surface-alt)', borderRadius: '3rem', padding: '3rem', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800&auto=format&fit=crop" alt="" style={{ width: '100%', borderRadius: '2rem', boxShadow: 'var(--shadow-premium)' }} />
           </div>
        </div>

        {/* For Providers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
           <div style={{ background: 'var(--navy)', borderRadius: '3rem', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop" alt="" style={{ width: '100%', borderRadius: '2rem', boxShadow: 'var(--shadow-premium)', filter: 'grayscale(1)' }} />
           </div>
           <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '3rem' }}>Find rewarding work</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 {[
                   { icon: <Zap />, title: 'Create your profile', desc: 'Highlight your skills, experience, and certifications to stand out to clients.' },
                   { icon: <Briefcase />, title: 'Search for jobs', desc: 'Find opportunities that match your expertise. Submit proposals and set your rates.' },
                   { icon: <Clock />, title: 'Get paid weekly', desc: 'Invoices are handled automatically. Payments are deposited directly to your wallet.' }
                 ].map((step, i) => (
                   <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'var(--surface-alt)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         {step.icon}
                      </div>
                      <div>
                         <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '0.5rem' }}>{step.title}</h3>
                         <p style={{ color: 'var(--text-muted)', fontWeight: 700, lineHeight: '1.6' }}>{step.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Link to="/register?role=provider" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4rem', color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>
                 Find work today <ArrowRight size={20} />
              </Link>
           </div>
        </div>
      </section>

      {/* Trust & FAQ Section */}
      <section style={{ padding: '8rem 1rem', background: 'var(--surface-alt)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
             <p className="label-mini">Got questions? We have answers.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {FAQS.map((faq, i) => (
               <div key={i} style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '1.5rem 2rem', textAlign: 'left', border: 'none', background: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                     <span style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--navy)' }}>{faq.q}</span>
                     {openFaq === i ? <ChevronUp color="var(--primary)" /> : <ChevronDown color="#cbd5e1" />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 2rem 2rem', color: 'var(--text-muted)', fontWeight: 700, lineHeight: '1.6' }}>
                       {faq.a}
                    </div>
                  )}
               </div>
             ))}
          </div>

          {/* Trust Banner */}
          <div className="cta-banner" style={{ marginTop: '8rem' }}>
             <ShieldCheck size={60} style={{ color: 'white', marginBottom: '2rem' }} />
             <h2 className="cta-title" style={{ fontSize: '2.5rem' }}>Safe and Secure Payments</h2>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
                Your payments are held in escrow and only released once the job is confirmed complete by you.
             </p>
             <Link to="/register" className="btn-navy" style={{ background: 'white', color: 'var(--navy)', padding: '1rem 3rem' }}>
                Create Secure Account
             </Link>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
         <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.875rem' }}>© {new Date().getFullYear()} Fixam Cameroon. High-trust professional services.</p>
      </footer>
    </div>
  );
}
