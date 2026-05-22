import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Briefcase,
  Wallet,
  Star,
  ChevronRight,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Home,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import PremiumNavbar from '../components/PremiumNavbar';

const SIDEBAR_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/home', badge: 0 },
  { icon: Briefcase, label: 'My Tasks', href: '/post-task', badge: 0 },
  { icon: MessageSquare, label: 'Messages', href: '/messages', badge: 0 },
  { icon: Star, label: 'Saved Professionals', href: '#', badge: 0 },
  { icon: Wallet, label: 'Wallet', href: '/wallet', badge: 0 },
  { icon: TrendingUp, label: 'Payments', href: '#', badge: 0 },
  { icon: Shield, label: 'Reviews', href: '#', badge: 0 },
  { icon: Settings, label: 'Profile Settings', href: '/settings', badge: 0 },
];

const QUICK_ACTIONS = [
  { icon: Plus, label: 'Create a Task', href: '/post-task', color: 'from-teal-500 to-teal-600' },
  { icon: MessageSquare, label: 'Find Professional', href: '/providers', color: 'from-blue-500 to-blue-600' },
  { icon: MessageSquare, label: 'Messages', href: '/messages', color: 'from-purple-500 to-purple-600' },
  { icon: Wallet, label: 'View Wallet', href: '/wallet', color: 'from-orange-500 to-orange-600' },
];

const DUMMY_TASKS = [
  {
    id: 1,
    title: 'Fix leaking pipe in kitchen',
    category: 'PLUMBING',
    status: 'PENDING',
    amount: '25,000 XAF',
    location: 'Douala, Cameroon',
    date: '2 days ago',
  },
  {
    id: 2,
    title: 'Install new light fixtures',
    category: 'ELECTRICAL',
    status: 'IN PROGRESS',
    amount: '15,000 XAF',
    location: 'Douala, Cameroon',
    date: '5 days ago',
  },
  {
    id: 3,
    title: 'Deep house cleaning',
    category: 'CLEANING',
    status: 'COMPLETED',
    amount: '30,000 XAF',
    location: 'Douala, Cameroon',
    date: '1 week ago',
  },
];

const ACTIVITY_ITEMS = [
  { icon: CheckCircle, text: 'Task Completed', detail: 'House deep cleaning', time: '2 hours ago', color: 'text-green-600' },
  { icon: MessageSquare, text: 'New Proposal Received', detail: 'Fix leaking pipe in kitchen', time: '5 hours ago', color: 'text-blue-600' },
  { icon: Wallet, text: 'Payment Successful', detail: 'Paid 25,000 XAF', time: '2 days ago', color: 'text-purple-600' },
  { icon: Star, text: 'Review Posted', detail: '5 star rating from Samuel Bright', time: '3 days ago', color: 'text-yellow-600' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { walletBalance } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.fullName || user?.name || 'User';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PremiumNavbar />

      <div className="flex gap-0 lg:gap-6 lg:p-6">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`fixed lg:relative z-40 w-64 h-[calc(100vh-80px)] bg-white dark:bg-slate-900 shadow-lg lg:shadow-none overflow-y-auto lg:rounded-2xl ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-300`}
        >
          <div className="p-6 space-y-8">
            {/* Sidebar Navigation */}
            <nav className="space-y-2">
              {SIDEBAR_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.href;
                return (
                  <motion.a
                    key={i}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                );
              })}
            </nav>

            {/* Sidebar CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => navigate('/post-task')}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Post a Task
              </button>
            </div>

            {/* Logout */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="w-full py-3 px-4 text-slate-600 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <LogOut size={20} /> Log Out
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Close sidebar on overlay click */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full px-4 md:px-6 py-6 lg:p-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back, {firstName}! 👋
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">What would you like to do today?</p>
                </div>
                <div className="hidden md:flex w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
              </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {QUICK_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.a
                    key={i}
                    href={action.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(action.href);
                    }}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-2xl text-white font-semibold shadow-sm hover:shadow-md transition-all bg-gradient-to-br ${action.color}`}
                  >
                    <Icon size={28} className="mb-3" />
                    <p className="text-sm">{action.label}</p>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Wallet & Stats Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
              {/* Wallet Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-semibold">Wallet Balance</h3>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Wallet size={24} />
                  </div>
                </div>
                <div className="mb-8">
                  <p className="text-white/80 text-sm mb-2">Available Balance</p>
                  <h2 className="text-4xl font-bold">{walletBalance || '48'} Coins</h2>
                  <p className="text-white/80 text-sm mt-2">≈ 960 FCFA</p>
                </div>
                <button className="w-full py-3 px-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-slate-100 transition-all">
                  Top Up Wallet
                </button>
              </div>

              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
                {[
                  { label: 'Total Tasks', value: '12', icon: Briefcase, color: 'text-teal-600 dark:text-teal-400' },
                  { label: 'In Progress', value: '5', icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Completed', value: '6', icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
                  { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-yellow-600 dark:text-yellow-400' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className={`${stat.color}`} size={20} />
                        <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tasks Table */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">My Tasks</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View and manage your active tasks</p>
                  </div>
                  <Link to="/post-task" className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Task</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Location</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_TASKS.map((task) => (
                      <motion.tr
                        key={task.id}
                        whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.03)' }}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded">
                              {task.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              task.status === 'PENDING'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : task.status === 'IN PROGRESS'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{task.amount}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{task.location}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{task.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Activity Feed & Professionals */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {ACTIVITY_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700 ${item.color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{item.text}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">{item.time}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Top Professionals */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Professionals</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Jeff Thomson', role: 'Plumber', rating: 4.9 },
                    { name: 'Samuel Bright', role: 'Electrician', rating: 4.7 },
                    { name: 'Mary Clean', role: 'Cleaner', rating: 4.8 },
                  ].map((pro, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{pro.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{pro.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        <span className="font-semibold">{pro.rating}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Security Banner */}
            <motion.div
              variants={itemVariants}
              className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 flex items-start gap-4"
            >
              <Shield className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-teal-900 dark:text-teal-300 mb-1">
                  ✓ All professionals are verified and trusted
                </p>
                <p className="text-sm text-teal-800 dark:text-teal-400">
                  Your safety and satisfaction are our priority. All our professionals go through rigorous verification.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
