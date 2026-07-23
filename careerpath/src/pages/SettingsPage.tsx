
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import { Settings } from 'lucide-react';

export default function SettingsPage() {


  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
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
