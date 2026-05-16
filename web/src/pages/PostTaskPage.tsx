import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, CheckCircle, Clock, AlertCircle, Plus, ChevronRight, Loader, Zap, X, CreditCard, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

const CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: '🔧' },
  { id: '2', name: 'Electrical', icon: '⚡' },
  { id: '3', name: 'Cleaning', icon: '🧹' },
  { id: '4', name: 'Carpentry', icon: '🪚' },
  { id: '5', name: 'Painting', icon: '🖌️' },
  { id: '6', name: 'Other', icon: '•••' },
];

const MY_TASKS = [
  {
    id: 't1', icon: '🔧', title: 'Kitchen Sink Repair', category: 'Plumbing',
    status: 'IN PROGRESS', statusBg: 'bg-blue-50', statusText: 'text-blue-700',
    pro: 'Marcus Chen', proImg: 'https://i.pravatar.cc/150?u=marcus',
    date: 'Tomorrow, 10:00 AM', price: '85,000 XAF', progress: 65,
  },
  {
    id: 't2', icon: '⚡', title: 'Living Room Rewiring', category: 'Electrical',
    status: 'PENDING APPROVAL', statusBg: 'bg-gray-100', statusText: 'text-gray-600',
    pro: 'Awaiting admin approval', proImg: null,
    date: 'Awaiting selection', price: '120,000–180,000 XAF', progress: null,
  },
  {
    id: 't3', icon: '🖌️', title: 'Main Bedroom Painting', category: 'Painting',
    status: 'COMPLETED', statusBg: 'bg-green-50', statusText: 'text-green-700',
    pro: 'David Wilson', proImg: 'https://i.pravatar.cc/150?u=david',
    date: 'Finished 2 days ago', price: '450,000 XAF', progress: 100,
  },
];

type TabId = 'tasks' | 'post';
type FormStep = 'details' | 'review' | 'success';

interface TaskForm {
  title: string;
  description: string;
  location: string;
  budget: string;
  scheduledDate: string;
  scheduledTime: string;
  category: string;
}

export default function PostTaskPage() {
  const navigate = useNavigate();
  const { postJob } = useAppContext();
  const [tab, setTab] = useState<TabId>('tasks');
  const [step, setStep] = useState<FormStep>('details');
  const [selectedCat, setSelectedCat] = useState('Plumbing');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    location: '',
    budget: '50000',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    category: 'Plumbing'
  });

  const set = (k: keyof TaskForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => alert('Unable to get location: ' + error.message)
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleNext = () => {
    if (!form.title.trim()) { alert('Task title is required'); return; }
    if (!form.description.trim()) { alert('Description is required'); return; }
    if (!form.location.trim()) { alert('Location is required'); return; }
    setForm(p => ({ ...p, category: selectedCat }));
    setStep('review');
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await postJob({
        ...form,
        category: selectedCat,
        scheduledTime: `${form.scheduledDate}T${form.scheduledTime}`
      });
      setStep('success');
      setTimeout(() => {
        setTab('tasks');
        setStep('details');
        setForm({
          title: '', description: '', location: '', budget: '50000',
          scheduledDate: new Date().toISOString().split('T')[0],
          scheduledTime: '09:00', category: 'Plumbing'
        });
      }, 3000);
    } catch (error) {
      alert('Failed to publish task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="My Tasks" subtitle="Track your projects and manage hires.">
      
      {/* Tab Switcher - Premium Style */}
      <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl mb-12 shadow-inner">
        {[
          { id: 'tasks', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'post', label: 'Post New Job', icon: <Plus className="w-4 h-4" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id as TabId); setStep('details'); }}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all duration-300 ${tab === t.id ? 'bg-white text-navy shadow-xl' : 'text-gray-400 hover:text-navy'}`}
          >
            {t.icon} {t.label}
          </button>
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1rem' }}>
        
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '3rem' }}>
          <button 
            onClick={() => setTab('tasks')}
            style={{ 
              padding: '1rem 0', 
              fontSize: '1rem', 
              fontWeight: 900, 
              border: 'none', 
              background: 'none', 
              color: tab === 'tasks' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === 'tasks' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Manage Tasks
          </button>
          <button 
            onClick={() => setTab('post')}
            style={{ 
              padding: '1rem 0', 
              fontSize: '1rem', 
              fontWeight: 900, 
              border: 'none', 
              background: 'none', 
              color: tab === 'post' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === 'post' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Post a New Task
          </button>
        </div>

        {tab === 'tasks' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--navy)' }}>Active Tasks</h2>
              <button onClick={() => setTab('post')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
                + Post Job
              </button>
            </div>

            {MY_TASKS.map(task => (
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20" />
               <h3 className="text-3xl font-black mb-4 leading-tight">Need expert help?</h3>
               <p className="text-gray-400 font-bold mb-10 text-lg">Describe your task and get quotes from vetted local pros in minutes.</p>
               <button onClick={() => setTab('post')} className="w-full bg-[#2563eb] text-white py-5 rounded-3xl font-black text-xl hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-3">
                 <Plus className="w-6 h-6" /> Post Task
               </button>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Service Summary</h4>
               <div className="space-y-6">
                 {[
                   { label: 'Ongoing', val: '1', color: 'text-[#2563eb]' },
                   { label: 'Pending', val: '1', color: 'text-navy' },
                   { label: 'Archived', val: '1', color: 'text-gray-300' }
                 ].map(s => (
                   <div key={s.label} className="flex justify-between items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                     <span className="text-lg font-bold text-gray-400">{s.label}</span>
                     <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      )}

      {/* --- POST FLOW --- */}
      {tab === 'post' && step === 'details' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[60px] p-12 lg:p-20 border border-gray-100 shadow-sm">
            <h2 className="text-5xl font-black text-navy mb-4 leading-none">Describe your task</h2>
            <p className="text-xl text-gray-400 font-bold mb-16 uppercase tracking-widest text-xs">Phase 01: Requirements</p>

            <div className="space-y-12">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Service Category</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.name)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${selectedCat === cat.name ? 'border-[#2563eb] bg-blue-50' : 'border-gray-50 hover:border-gray-100'}`}
                    >
                      <span className="text-3xl">{cat.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCat === cat.name ? 'text-navy' : 'text-gray-400'}`}>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Job Title</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder='e.g. Repair leaked master bathroom sink' className="w-full bg-gray-50 border-2 border-gray-50 rounded-[32px] px-10 py-6 text-xl font-bold outline-none focus:border-[#2563eb] focus:bg-white transition-all" />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Detailed Description</label>
                  <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Provide context, urgency, and any specific requirements..." className="w-full bg-gray-50 border-2 border-gray-50 rounded-[32px] px-10 py-8 text-xl font-bold outline-none focus:border-[#2563eb] focus:bg-white transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Service Location</label>
                  <div className="relative">
                     <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-[#2563eb]" />
                     <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Address or Neighborhood" className="w-full bg-gray-50 border-2 border-gray-50 rounded-full pl-16 pr-10 py-6 text-lg font-bold outline-none focus:border-[#2563eb] focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Max Budget (XAF)</label>
                  <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} className="w-full bg-gray-50 border-2 border-gray-50 rounded-full px-10 py-6 text-lg font-black outline-none focus:border-[#2563eb] focus:bg-white transition-all" />
                </div>
              </div>

              <div className="pt-8">
                 <button onClick={handleNext} className="w-full bg-[#2563eb] text-white py-6 rounded-full font-black text-2xl hover:bg-[#1d4ed8] transition-all shadow-2xl shadow-blue-900/10 flex items-center justify-center gap-4">
                   Review and Post <ArrowRight className="w-6 h-6" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- REVIEW VIEW --- */}
      {tab === 'post' && step === 'review' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[60px] p-12 lg:p-20 border border-gray-100 shadow-sm">
             <h2 className="text-5xl font-black text-navy mb-4 leading-none">Review Final</h2>
             <p className="text-xl text-gray-400 font-bold mb-16 uppercase tracking-widest text-xs">Phase 02: Verification</p>

             <div className="bg-gray-50 rounded-[40px] p-12 border border-gray-100 space-y-10 mb-12">
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em]">{selectedCat}</span>
                      <h3 className="text-4xl font-black text-navy mt-2 leading-none">{form.title}</h3>
                   </div>
                   <button onClick={() => setStep('details')} className="px-6 py-2 bg-white rounded-full text-[#2563eb] font-black text-xs uppercase tracking-widest border border-gray-100">Edit</button>
                </div>
                
                <p className="text-gray-500 text-2xl font-bold italic leading-relaxed">"{form.description}"</p>

                <div className="grid grid-cols-2 gap-8">
                   <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100">
                      <MapPin className="text-[#2563eb] w-8 h-8" />
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                         <p className="text-lg font-black text-navy">{form.location}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100">
                      <CreditCard className="text-[#2563eb] w-8 h-8" />
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                         <p className="text-lg font-black text-navy">{parseInt(form.budget).toLocaleString()} XAF</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setStep('details')} className="flex-1 py-6 rounded-full font-black text-xl border-2 border-gray-100 text-gray-400 hover:text-navy transition-all">Back</button>
                <button onClick={handlePublish} disabled={loading} className="flex-[2] bg-[#2563eb] text-white py-6 rounded-full font-black text-2xl hover:bg-[#1d4ed8] transition-all shadow-2xl flex items-center justify-center gap-4">
                  {loading ? <Loader className="w-8 h-8 animate-spin" /> : 'Confirm & Publish'} <ShieldCheck className="w-8 h-8" />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS VIEW --- */}
      {tab === 'post' && step === 'success' && (
        <div className="max-w-4xl mx-auto py-20 text-center">
           <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-inner">
              <CheckCircle className="w-16 h-16 text-[#2563eb]" />
           </div>
           <h2 className="text-6xl font-black text-navy mb-6">Task Live!</h2>
           <p className="text-2xl text-gray-400 font-bold max-w-xl mx-auto mb-16 leading-relaxed">Your task is being vetted by our administrators. You'll receive a notification as soon as it's approved.</p>
           <button onClick={() => { setTab('tasks'); setStep('details'); }} className="bg-navy text-white px-16 py-6 rounded-full font-black text-2xl hover:bg-black transition-all shadow-2xl">
             My Dashboard
           </button>
        </div>
      )}

    </AppLayout>
  );
}
