import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Shield, 
  Clock, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Award,
  Lock,
  Heart,
  Briefcase,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const DEFAULT_PROVIDER = {
  id: 'p1',
  userId: '',
  name: 'Jean-Pierre Boucher',
  skill: 'Master Plumber & HVAC Specialist',
  rating: 4.9, 
  reviews: 124, 
  distance: 'Greater Douala Region',
  image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800&auto=format&fit=crop',
  bio: 'With over 15 years of experience serving the metropolitan area, I specialize in high-efficiency plumbing systems and complex HVAC installations. My commitment is to provide lasting solutions with transparent pricing and exceptional reliability. I believe in getting it right the first time, ensuring your home remains comfortable and safe.',
  price: 8500, 
  nextAvailable: 'Tomorrow, 9:00 AM',
  tags: ['Licensed Prof.', '15+ Years Exp.', 'Insured'],
  specialties: ['Emergency Leak Repair', 'Fixture Installation', 'HVAC Maintenance', 'Pipe Modernization'],
  portfolio: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  ],
  clientReviews: [
    { id: 'r1', name: 'Sarah Mitchell', timeAgo: '2 weeks ago', rating: 5, img: 'https://i.pravatar.cc/150?u=sarah', comment: '"Jean-Pierre fixed our emergency leak in record time. Professional, clean, and explained everything. Highly recommended for any complex plumbing work!"' },
    { id: 'r2', name: 'Emmanuel Eto', timeAgo: '1 month ago', rating: 5, img: 'https://i.pravatar.cc/150?u=eto', comment: '"Excellent service. Showed up on time and the pricing was exactly as quoted. Best technician in Douala."' },
  ],
};

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: routeUserId } = useParams<{ userId?: string }>();
  const { user: me } = useAuth();
  const [provider, setProvider] = useState<any>(() => (location.state as { provider?: typeof DEFAULT_PROVIDER })?.provider || DEFAULT_PROVIDER);

  useEffect(() => {
    const fromNav = (location.state as { provider?: typeof DEFAULT_PROVIDER })?.provider;
    if (fromNav) {
      setProvider(fromNav);
      return;
    }
    if (!routeUserId) return;

    api.get('/providers')
      .then((res) => {
        const rows = res.data.data || [];
        const row = rows.find((x: any) => (x.user?.id === routeUserId || x.id === routeUserId));
        if (row) {
          setProvider({
            ...DEFAULT_PROVIDER,
            id: row.id,
            userId: row.user?.id,
            name: row.user?.fullName,
            image: row.user?.avatar,
            skill: row.skills?.[0] || 'Professional Specialist',
            rating: row.rating || 4.8,
            reviews: row.reviewCount || 12,
            bio: row.bio || DEFAULT_PROVIDER.bio,
            price: row.rate || 5000,
            distance: row.serviceArea || 'Nearby Region',
            specialties: row.skills || DEFAULT_PROVIDER.specialties,
          });
        }
      })
      .catch(() => {});
  }, [routeUserId, location.state]);

  const startMessage = () => {
    const uid = provider.userId || routeUserId;
    if (!uid) return;
    if (!me) {
      navigate('/login');
      return;
    }
    navigate('/messages', { state: { receiverId: uid, userName: provider.name } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12 font-black uppercase tracking-widest">
            <Link to="/providers" className="hover:text-[#2563eb]">Marketplace</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy">{provider.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
            
            {/* Left Content */}
            <div className="space-y-12">
              
              {/* Profile Header Card */}
              <div className="bg-white rounded-[60px] p-10 lg:p-16 border border-gray-100 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-[200px] -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
                
                <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-[48px] overflow-hidden border-8 border-white shadow-2xl">
                      <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#2563eb] rounded-[24px] flex items-center justify-center border-8 border-white shadow-2xl">
                      <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h1 className="text-5xl font-black text-navy mb-3 leading-none">{provider.name}</h1>
                        <p className="text-2xl font-black text-[#2563eb] mb-6">{provider.skill}</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-4 bg-gray-50 rounded-3xl text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 transition-all">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="p-4 bg-gray-50 rounded-3xl text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 transition-all">
                          <Share2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-8 items-center mb-10">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-black text-navy">{provider.rating}</span>
                        <span className="text-gray-400 font-bold">( {provider.reviews} Client Reviews )</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-bold">
                        <MapPin className="w-6 h-6" />
                        {provider.distance}
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-6 py-2.5 rounded-full">
                        Identity Verified
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {provider.tags.map((tag: string) => (
                        <span key={tag} className="px-6 py-3 bg-gray-50 text-gray-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-white rounded-[60px] p-10 lg:p-16 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563eb]">
                      <Briefcase className="w-6 h-6" />
                   </div>
                   <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Professional Bio</h2>
                </div>
                <p className="text-gray-500 text-xl leading-relaxed whitespace-pre-line font-medium italic">
                  "{provider.bio}"
                </p>
              </div>

              {/* Portfolio Grid */}
              <div className="bg-white rounded-[60px] p-10 lg:p-16 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Project Portfolio</h2>
                  <button className="text-[#2563eb] font-black text-lg hover:underline underline-offset-8">View Archive</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {provider.portfolio.map((img: string, i: number) => (
                    <div key={i} className="group relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
                      <img src={img} alt={`Work ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                         <p className="text-white font-black uppercase tracking-widest text-xs">Recent Project Excellence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-[60px] p-10 lg:p-16 border border-gray-100 shadow-sm">
                <h2 className="text-3xl font-black text-navy mb-12 uppercase tracking-tighter">Verified Client Feedback</h2>
                <div className="space-y-16">
                  {provider.clientReviews.map((review: any) => (
                    <div key={review.id} className="flex flex-col md:flex-row gap-8">
                      <img src={review.img} alt={review.name} className="w-20 h-20 rounded-[32px] object-cover shrink-0 shadow-lg" />
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-black text-navy text-2xl mb-1">{review.name}</h4>
                            <p className="text-gray-400 text-sm font-black uppercase tracking-widest">{review.timeAgo}</p>
                          </div>
                          <div className="flex gap-1 bg-blue-50 px-4 py-2 rounded-2xl">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-[#2563eb] text-[#2563eb]' : 'text-gray-200'}`} />)}
                          </div>
                        </div>
                        <p className="text-gray-500 text-xl italic font-medium leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="space-y-8 lg:sticky lg:top-32">
              <div className="bg-navy text-white rounded-[60px] p-10 lg:p-14 shadow-[0_50px_100px_rgba(15,23,42,0.3)] overflow-hidden relative group">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#2563eb] rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" />
                
                <div className="relative z-10">
                  <p className="text-gray-500 font-black text-xs uppercase tracking-[0.3em] mb-6">Engagement Rate</p>
                  <div className="flex items-baseline gap-3 mb-10">
                    <span className="text-6xl font-black">{Number(provider.price || 0).toLocaleString()}</span>
                    <span className="text-xl text-gray-500 font-black uppercase tracking-widest">XAF / Hr</span>
                  </div>

                  <div className="space-y-8 mb-12 border-t border-white/5 pt-10">
                    <div className="flex items-center gap-5 text-gray-300 font-bold">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#2563eb]">
                         <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-lg">Available: {provider.nextAvailable}</span>
                    </div>
                    <div className="flex items-center gap-5 text-gray-300 font-bold">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#2563eb]">
                         <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-lg">Secure Payment Handling</span>
                    </div>
                    <div className="flex items-center gap-5 text-gray-300 font-bold">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#2563eb]">
                         <Award className="w-5 h-5" />
                      </div>
                      <span className="text-lg">Service Quality Guarantee</span>
                    </div>
                  </div>

                  <button 
                    onClick={startMessage}
                    className="w-full bg-[#2563eb] text-white py-6 rounded-[32px] font-black text-2xl hover:bg-[#1d4ed8] transition-all mb-6 shadow-2xl shadow-blue-900/40"
                  >
                    Start Booking
                  </button>
                  <p className="text-center text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                    Satisfaction Secured by Fixam
                  </p>
                </div>
              </div>

              {/* Direct Contact Options */}
              <div className="bg-white rounded-[60px] p-10 border border-gray-100 shadow-sm space-y-6">
                 <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-4">Verification Check</h3>
                 <div className="space-y-4">
                    {[
                      { icon: <Lock className="w-4 h-4" />, label: 'ID Verification', status: true },
                      { icon: <Calendar className="w-4 h-4" />, label: 'Registry Check', status: true },
                      { icon: <Briefcase className="w-4 h-4" />, label: 'Trade License', status: true }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl group hover:bg-blue-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="text-gray-300 group-hover:text-[#2563eb] transition-all">{item.icon}</div>
                          <span className="text-sm font-black text-gray-600 group-hover:text-navy uppercase tracking-widest">{item.label}</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-[#2563eb]" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 text-center">
                 <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Trusted Marketplace Integrity</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
