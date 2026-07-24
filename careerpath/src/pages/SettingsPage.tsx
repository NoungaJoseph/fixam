import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import { Settings, User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Profile Information
          </h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" defaultValue={user?.firstName || ''} className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" defaultValue={user?.lastName || ''} className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input type="email" defaultValue={user?.email || ''} disabled className="pl-10 block w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg py-2.5 text-sm cursor-not-allowed" />
              </div>
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1"><Shield className="w-3 h-3" /> Managed securely by Fixam main account</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input type="tel" defaultValue="" placeholder="e.g., +237 600 000 000" className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-primary-dark transition shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <span className="text-gray-700 text-sm">Email me about new career paths and opportunities</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <span className="text-gray-700 text-sm">Send me task reminders</span>
            </label>
          </div>
          
          <hr className="my-8 border-gray-200" />
          
          <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
          <button type="button" className="text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
