
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <UserCircle className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <p className="text-gray-500 mb-6">Update your personal information and preferences here.</p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5" defaultValue={user?.firstName || ''} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5" defaultValue={user?.lastName || ''} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500" defaultValue={user?.email || ''} disabled />
            </div>
            <button type="button" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
              Save Changes
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
