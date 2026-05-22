import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  Loader, 
  Zap, 
  X, 
  CreditCard, 
  ShieldCheck, 
  Briefcase, 
  Tag, 
  Info,
  DollarSign
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

const CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: '🔧', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' },
  { id: '2', name: 'Electrical', icon: '⚡', color: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
  { id: '3', name: 'Cleaning', icon: '🧹', color: 'bg-sky-500/10 text-sky-500 border-sky-500/25' },
  { id: '4', name: 'Carpentry', icon: '🪚', color: 'bg-orange-500/10 text-orange-500 border-orange-500/25' },
  { id: '5', name: 'Painting', icon: '🖌️', color: 'bg-violet-500/10 text-violet-500 border-violet-500/25' },
  { id: '6', name: 'Other', icon: '•••', color: 'bg-gray-500/10 text-gray-500 border-gray-50/25' },
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
  const { jobs, postJob, fetchAppData } = useAppContext();
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

  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

  const set = (k: keyof TaskForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set('location', `Douala, Cameroon (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
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
        title: form.title,
        description: form.description,
        category: selectedCat,
        location: form.location,
        budget: form.budget,
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
      console.error(error);
      alert('Failed to publish task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout 
      title="My Tasks" 
      subtitle="Track your projects, post new jobs, and coordinate with local professional talent."
    >
      <div className="max-w-[1200px] mx-auto pb-16">
        
        {/* Tab Switcher - Premium Floating Bar */}
        <div className="inline-flex p-1 bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl mb-10 shadow-sm">
          <button
            onClick={() => { setTab('tasks'); setStep('details'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
              tab === 'tasks' 
                ? 'bg-white text-[var(--navy)] shadow-md font-extrabold border border-[var(--border)]' 
                : 'text-[var(--muted)] hover:text-[var(--navy)]'
            }`}
          >
            <Briefcase size={14} />
            Manage Dashboard
          </button>
          <button
            onClick={() => { setTab('post'); setStep('details'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
              tab === 'post' 
                ? 'bg-white text-[var(--navy)] shadow-md font-extrabold border border-[var(--border)]' 
                : 'text-[var(--muted)] hover:text-[var(--navy)]'
            }`}
          >
            <Plus size={14} />
            Post New Job
          </button>
        </div>

        {tab === 'tasks' ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            
            {/* Left Hand: Task List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--navy)] tracking-tight">Active Requests</h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Real-time status of your service jobs</p>
                </div>
                <button 
                  onClick={() => setTab('post')} 
                  className="btn-primary flex items-center gap-1.5 py-2 px-4 text-xs tracking-wider"
                >
                  <Plus size={14} /> Post Job
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[var(--border)] p-12 text-center rounded-[32px]">
                  <div className="w-16 h-16 bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[var(--accent)]">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--navy)] mb-1">No tasks active</h3>
                  <p className="text-sm text-[var(--muted)] max-w-sm mx-auto mb-6">
                    Describe what you need done and get quotes from vetted service professionals in Douala.
                  </p>
                  <button
                    onClick={() => setTab('post')}
                    className="btn-primary py-3 px-6 text-xs uppercase tracking-wider"
                  >
                    Post your first task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white border border-[var(--border)] p-6 rounded-[24px] shadow-sm hover:border-[var(--accent)] transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="text-base font-extrabold text-[var(--navy)] hover:text-[var(--accent)] transition-colors">
                            {job.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider mt-1 bg-[var(--surface-alt)] px-2.5 py-1 border border-[var(--border)] rounded-md">
                            {job.category || 'General'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          job.status?.toUpperCase() === 'COMPLETED' 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : job.status?.toUpperCase() === 'IN_PROGRESS' || job.status?.toUpperCase() === 'IN PROGRESS'
                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {job.status || 'Pending'}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--muted)] mb-5 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-[var(--accent)]" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(job.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="font-extrabold text-[var(--navy)] text-sm">
                          {Number(job.budget || 0).toLocaleString()} XAF
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Hand Sidebar Console */}
            <div className="space-y-6">
              <div className="bg-[var(--navy)] rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--primary)] rounded-full blur-2xl opacity-20" />
                <h3 className="text-lg font-bold mb-2">Need Expert Help?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Post a custom job request, receive quotes, and secure payment via the Fixam Escrow wallet.
                </p>
                <button 
                  onClick={() => setTab('post')} 
                  className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-[var(--primary)]"
                >
                  Create Job Post
                </button>
              </div>

              <div className="bg-white border border-[var(--border)] rounded-[32px] p-6 shadow-sm">
                <h4 className="text-xs font-extrabold text-[var(--navy)] uppercase tracking-wider mb-4">Job Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <span className="text-xs text-[var(--muted)]">Total Published</span>
                    <span className="text-sm font-extrabold text-[var(--navy)]">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <span className="text-xs text-[var(--muted)]">In Progress</span>
                    <span className="text-sm font-extrabold text-blue-600">
                      {jobs.filter(j => j.status?.toUpperCase() === 'IN_PROGRESS' || j.status?.toUpperCase() === 'IN PROGRESS').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <span className="text-xs text-[var(--muted)]">Completed</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {jobs.filter(j => j.status?.toUpperCase() === 'COMPLETED').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* --- POST FLOW WIZARD --- */
          <div className="max-w-[760px] bg-white border border-[var(--border)] rounded-[32px] p-8 lg:p-12 shadow-sm">
            
            {/* Steps Header indicator */}
            <div className="flex items-center gap-4 mb-8">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                step === 'details' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                Step {step === 'details' ? '1 of 2' : '2 of 2'}
              </span>
              <div className="h-[2px] flex-1 bg-[var(--border)] rounded-full">
                <div className={`h-full rounded-full transition-all duration-300 ${
                  step === 'details' ? 'w-[50%] bg-blue-500' : 'w-full bg-emerald-500'
                }`} />
              </div>
            </div>

            {step === 'details' && (
              <div className="space-y-8 animate-up">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--navy)] tracking-tight">Describe Your Service Task</h2>
                  <p className="text-xs text-[var(--muted)] mt-1">Provide clear specifications to find the perfect professional.</p>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-3">Service Category</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCat(cat.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                          selectedCat === cat.name 
                            ? 'border-[var(--accent)] bg-blue-500/5 text-[var(--navy)]' 
                            : 'border-[var(--border)] hover:border-gray-300 bg-transparent text-[var(--muted)]'
                        }`}
                      >
                        <span className="text-2xl mb-1">{cat.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate w-full text-center">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Job Title</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={e => set('title', e.target.value)} 
                    placeholder="e.g., Fix leaked copper pipe in kitchen" 
                    className="input-field py-4" 
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Detailed Context & Requirements</label>
                  <textarea 
                    rows={4} 
                    value={form.description} 
                    onChange={e => set('description', e.target.value)} 
                    placeholder="Provide details about the issue, urgency, required materials, and what needs fixing..." 
                    className="input-field py-4 resize-none" 
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Service Location (Neighborhood)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] w-5 h-5" />
                    <input 
                      type="text" 
                      value={form.location} 
                      onChange={e => set('location', e.target.value)} 
                      placeholder="e.g., Bonapriso, Douala" 
                      className="input-field pl-12 pr-28 py-4" 
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[var(--accent)] bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-[var(--border)] transition-colors"
                    >
                      Use GPS
                    </button>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Max Budget (XAF)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] w-5 h-5" />
                    <input 
                      type="number" 
                      value={form.budget} 
                      onChange={e => set('budget', e.target.value)} 
                      className="input-field pl-12 py-4 font-extrabold" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[var(--muted)] tracking-wider">
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Scheduled Date</label>
                    <input 
                      type="date" 
                      value={form.scheduledDate} 
                      onChange={e => set('scheduledDate', e.target.value)} 
                      className="input-field py-4" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider mb-2">Preferred Time</label>
                    <input 
                      type="time" 
                      value={form.scheduledTime} 
                      onChange={e => set('scheduledTime', e.target.value)} 
                      className="input-field py-4" 
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4">
                  <button 
                    type="button"
                    onClick={handleNext} 
                    className="w-full bg-[var(--navy)] text-white hover:bg-[var(--navy-soft)] py-4 rounded-none font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    Review Proposal <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-8 animate-up">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--navy)] tracking-tight">Confirm & Publish Job</h2>
                  <p className="text-xs text-[var(--muted)] mt-1">Verify details before pushing to the service network.</p>
                </div>

                <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-[24px] p-6 space-y-6">
                  <div className="pb-4 border-b border-[var(--border)]">
                    <span className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
                      {selectedCat}
                    </span>
                    <h3 className="text-lg font-extrabold text-[var(--navy)] mt-1">
                      {form.title}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider">Description</h4>
                    <p className="text-sm text-[var(--navy)] font-medium leading-relaxed italic bg-white p-4 border border-[var(--border)] rounded-xl">
                      "{form.description}"
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white border border-[var(--border)] p-4 rounded-xl flex items-center gap-3">
                      <MapPin size={20} className="text-[var(--accent)]" />
                      <div>
                        <p className="text-[9px] font-extrabold text-[var(--muted)] uppercase tracking-wider">Location</p>
                        <p className="text-xs font-bold text-[var(--navy)]">{form.location}</p>
                      </div>
                    </div>
                    <div className="bg-white border border-[var(--border)] p-4 rounded-xl flex items-center gap-3">
                      <CreditCard size={20} className="text-[var(--accent)]" />
                      <div>
                        <p className="text-[9px] font-extrabold text-[var(--muted)] uppercase tracking-wider">Budget Amount</p>
                        <p className="text-xs font-extrabold text-[var(--navy)]">{Number(form.budget).toLocaleString()} XAF</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[var(--border)] p-4 rounded-xl flex items-center gap-3">
                    <Calendar size={20} className="text-[var(--accent)]" />
                    <div>
                      <p className="text-[9px] font-extrabold text-[var(--muted)] uppercase tracking-wider">Date & Time Target</p>
                      <p className="text-xs font-bold text-[var(--navy)]">
                        {form.scheduledDate} at {form.scheduledTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setStep('details')}
                    className="flex-1 py-4 border border-[var(--border)] text-[var(--navy)] font-bold text-xs uppercase tracking-wider hover:bg-[var(--surface-alt)] transition-colors rounded-none"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-[2] bg-emerald-500 text-white hover:bg-emerald-600 py-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all rounded-none border border-emerald-500 disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm & Publish'}
                    <ShieldCheck size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-12 text-center animate-up space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={36} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-[var(--navy)] tracking-tight">Job Published!</h2>
                  <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
                    Your service post is now active on the network. Nearby professionals are being notified immediately.
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
                    <Loader size={12} className="animate-spin" />
                    Returning to dashboard...
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </AppLayout>
  );
}
