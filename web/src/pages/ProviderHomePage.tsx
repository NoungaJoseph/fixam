import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Check, X, LayoutGrid, Map, TrendingUp, Award, Clock, DollarSign, ChevronRight, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const BARS = [62, 45, 88, 50, 70, 95];

const REQUESTS = [
  { id: 'r1', title: 'Kitchen Sink Leaking', dist: '2.4 km away', price: '8,500 XAF', badge: 'URGENT', badgeBg: 'bg-red-50', badgeText: 'text-red-700' },
  { id: 'r2', title: 'Electrical Rewiring', dist: '5.1 km away', price: '120,000 XAF', badge: 'NEW', badgeBg: 'bg-blue-50', badgeText: 'text-[#2563eb]' },
];

export default function ProviderHomePage() {
  const { isProviderOnline, updateProviderStatus } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  return (
    <AppLayout title="Provider Dashboard" subtitle="Manage your professional presence, earnings, and client leads.">
      
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Main Console */}
        <div className="space-y-8">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4 ml-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isProviderOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                <p className="text-sm font-black text-navy uppercase tracking-widest">
                   {isProviderOnline ? 'You are visible to clients' : 'You are currently offline'}
                </p>
             </div>
             <div className="inline-flex p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => updateProviderStatus(true)}
                  className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isProviderOnline ? 'bg-[#2563eb] text-white shadow-xl' : 'text-gray-400 hover:text-navy'}`}
                >
                   Online
                </button>
                <button 
                  onClick={() => updateProviderStatus(false)}
                  className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!isProviderOnline ? 'bg-gray-800 text-white shadow-xl' : 'text-gray-400 hover:text-navy'}`}
                >
                   Offline
                </button>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Revenue', val: '1,248,000', unit: 'XAF', sub: '+12% growth', color: 'text-[#2563eb]', icon: <TrendingUp className="w-5 h-5" /> },
              { label: 'Success Rate', val: '98', unit: '%', sub: 'Elite Status', color: 'text-navy', icon: <Award className="w-5 h-5" /> },
              { label: 'Job Rating', val: '4.9', unit: '/ 5.0', sub: 'Top Rated', color: 'text-yellow-500', icon: <Star className="w-5 h-5" /> },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl">{s.icon}</div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                 </div>
                 <div className="flex items-baseline gap-1 mb-2">
                    <p className="text-4xl font-black text-navy">{s.val}</p>
                    <p className="text-xs font-black text-gray-400 uppercase">{s.unit}</p>
                 </div>
                 <p className={`text-xs font-black uppercase tracking-widest ${s.color}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Analytics Chart - Premium Look */}
          <div className="bg-navy rounded-[50px] p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563eb] rounded-full blur-[100px] opacity-10" />
             <div className="flex justify-between items-center mb-12 relative z-10">
                <h3 className="text-2xl font-black italic">Earnings Performance</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Past 6 Months</span>
             </div>
             <div className="flex items-flex-end gap-10 h-40 relative z-10">
                {MONTHS.map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-6 group">
                     <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                          className={`w-full max-w-[20px] rounded-full transition-all duration-1000 ${i === 5 ? 'bg-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/10 group-hover:bg-white/20'}`} 
                          style={{ height: `${BARS[i]}%` }} 
                        />
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Leads Marketplace */}
          <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-navy">Leads Marketplace</h3>
                <div className="flex gap-2">
                   <button onClick={() => setViewMode('grid')} className={`p-3 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-[#2563eb] text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}><LayoutGrid className="w-5 h-5" /></button>
                   <button onClick={() => setViewMode('map')} className={`p-3 rounded-2xl transition-all ${viewMode === 'map' ? 'bg-[#2563eb] text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}><Map className="w-5 h-5" /></button>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Map Context */}
                <div className="rounded-[40px] bg-gray-900 overflow-hidden relative aspect-square md:aspect-auto border-8 border-white shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-40 grayscale" />
                   <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
                   <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white">
                      <div className="flex items-center gap-3">
                         <Zap className="w-5 h-5 text-[#2563eb]" />
                         <div>
                            <p className="text-lg font-black text-navy leading-none">3 Local Leads</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Within 5km radius</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Lead Cards */}
                <div className="space-y-6">
                   {REQUESTS.map(req => (
                     <div key={req.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:border-[#2563eb] transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${req.badgeBg} ${req.badgeText}`}>
                              {req.badge}
                           </span>
                           <p className="text-2xl font-black text-navy">{req.price}</p>
                        </div>
                        <h4 className="text-xl font-black text-navy group-hover:text-[#2563eb] transition-all mb-2">{req.title}</h4>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-10">
                           <MapPin className="w-4 h-4" />
                           {req.dist}
                        </div>
                        <div className="flex gap-4">
                           <button onClick={() => navigate('/messages')} className="flex-1 bg-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Accept Job</button>
                           <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><X /></button>
                        </div>
                     </div>
                   ))}
                   <button className="w-full py-5 border-2 border-dashed border-gray-100 rounded-[40px] text-gray-400 font-black text-sm uppercase tracking-widest hover:border-[#2563eb] hover:text-[#2563eb] transition-all">
                      Load More Requests
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
           <div className="bg-white rounded-[50px] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-8">Recent Reviews</h3>
              <div className="bg-gray-50 rounded-[32px] p-8 relative">
                 <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                 </div>
                 <p className="text-gray-500 font-bold italic text-lg leading-relaxed mb-6">
                    "Jean-Pierre was incredibly professional. Fixed the leak and cleaned up afterwards. 10/10!"
                 </p>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2563eb] font-black italic">S</div>
                    <div>
                       <p className="font-black text-navy uppercase tracking-widest text-[10px]">Sarah Mitchell</p>
                       <p className="text-[10px] text-gray-400 font-bold">2 days ago</p>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-10 text-[#2563eb] font-black text-sm hover:underline underline-offset-8">View All Reviews</button>
           </div>

           <div className="bg-white rounded-[50px] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-8">Performance Tips</h3>
              <div className="space-y-6">
                 {[
                   { icon: <Clock />, text: 'Response time is under 15m. Keep it up!' },
                   { icon: <Check />, text: 'Profile completeness is at 95%.' },
                   { icon: <DollarSign />, text: 'Top 5% earner in Douala this month.' }
                 ].map((tip, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className="p-3 rounded-2xl bg-blue-50 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-all">{tip.icon}</div>
                      <p className="text-sm font-bold text-gray-500 leading-relaxed">{tip.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </aside>

      </div>

    </AppLayout>
  );
}
