
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import { Gift, Copy } from 'lucide-react';

export default function ReferralPage() {


  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Gift className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Refer a Friend</h1>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invite your friends, earn rewards</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Share your unique referral code with friends. When they sign up and complete a path, you both earn points!</p>
          
          <div className="max-w-xs mx-auto">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Your Referral Code</label>
            <div className="flex">
              <input type="text" className="w-full border border-gray-200 border-r-0 rounded-l-lg px-4 py-3 text-center font-mono font-bold text-gray-800 bg-gray-50" value="FIXAM-NOUNGA23" readOnly />
              <button className="bg-primary hover:bg-primary-hover text-white px-4 rounded-r-lg flex items-center justify-center transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
