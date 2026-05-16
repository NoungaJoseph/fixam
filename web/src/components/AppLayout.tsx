import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Wallet, MessageCircle, User, Settings, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const clientNav = [
  { label: 'Overview', icon: LayoutDashboard, path: '/home' },
  { label: 'Tasks', icon: ClipboardList, path: '/post-task' },
  { label: 'Wallet', icon: Wallet, path: '/wallet' },
  { label: 'Messages', icon: MessageCircle, path: '/messages' },
  { label: 'Profile', icon: User, path: '/settings' },
];

const providerNav = [
  { label: 'Overview', icon: LayoutDashboard, path: '/provider-home' },
  { label: 'Wallet', icon: Wallet, path: '/wallet' },
  { label: 'Messages', icon: MessageCircle, path: '/messages' },
  { label: 'Profile', icon: User, path: '/settings' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

function SidebarBody({
  nav,
  user,
  navigate,
  onNavigate,
}: {
  nav: typeof clientNav;
  user: ReturnType<typeof useAuth>['user'];
  navigate: ReturnType<typeof useNavigate>;
  onNavigate?: () => void;
}) {
  const isProvider = user?.role?.toUpperCase() === 'PROVIDER';

  return (
    <>
      <div className="px-6 py-8 border-b border-[var(--border)]">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-[var(--navy)]">
          Fixam
        </Link>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] mt-3 font-semibold">Marketplace</p>
      </div>

      <div className="px-6 py-6 border-b border-[var(--border)] flex gap-3">
        <div className="w-11 h-11 bg-[var(--surface-alt)] border border-[var(--border)] shrink-0 overflow-hidden rounded-none">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[var(--accent)]">
              {user?.fullName?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">Signed in</p>
          <p className="font-semibold text-[var(--navy)] text-sm truncate">{user?.fullName || 'Member'}</p>
          <p className="text-xs text-[var(--muted)] truncate">{isProvider ? 'Professional' : 'Client'}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {nav.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path + label}
            to={path}
            end={path === '/home' || path === '/provider-home'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 text-sm font-semibold border-l-2 transition-colors rounded-none ` +
              (isActive
                ? 'border-[var(--accent)] bg-[var(--surface-alt)] text-[var(--navy)]'
                : 'border-transparent text-[var(--muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--navy)]')
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border)] space-y-2">
        <button
          type="button"
          onClick={() => {
            navigate(isProvider ? '/provider-home' : '/post-task');
            onNavigate?.();
          }}
          className="w-full bg-[var(--navy)] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-none border border-[var(--navy)] hover:bg-[var(--navy-soft)] transition-colors"
        >
          {isProvider ? 'Browse tasks' : 'Post a task'}
        </button>
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--navy)] rounded-none"
        >
          <Settings size={16} /> Preferences
        </NavLink>
      </div>
    </>
  );
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadMessagesCount, unreadNotificationsCount } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = user?.role?.toUpperCase() === 'PROVIDER' ? providerNav : clientNav;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--surface)]">
      <aside className="hidden lg:flex flex-col w-[248px] shrink-0 bg-[var(--white)] border-r border-[var(--border)]">
        <SidebarBody nav={nav} user={user} navigate={navigate} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[260px] max-w-[85vw] bg-[var(--white)] border-r border-[var(--border)] flex flex-col h-full shadow-xl">
            <SidebarBody nav={nav} user={user} navigate={navigate} onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            className="absolute top-4 left-[268px] z-20 w-9 h-9 bg-[var(--white)] border border-[var(--border)] flex items-center justify-center rounded-none"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {title ? (
          <header className="shrink-0 bg-[var(--surface)] border-b border-[var(--border)] px-4 lg:px-10 py-6">
            <div className="flex justify-between gap-6 items-start">
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  className="lg:hidden mt-1 w-10 h-10 border border-[var(--border)] bg-[var(--white)] flex items-center justify-center rounded-none shrink-0"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h1 className="font-display text-2xl lg:text-[26px] font-bold text-[var(--navy)] tracking-tight">{title}</h1>
                  {subtitle && <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/notifications')}
                  className="relative w-10 h-10 border border-[var(--border)] bg-[var(--white)] flex items-center justify-center rounded-none hover:border-[var(--navy)] transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center rounded-none border border-[var(--white)]">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
                {unreadMessagesCount > 0 && (
                  <span className="hidden sm:inline text-xs font-bold text-[var(--muted)] uppercase tracking-wide px-2">
                    {unreadMessagesCount} unread chats
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-[var(--border)] bg-[var(--white)] rounded-none hover:border-[var(--navy)]"
                >
                  Log out
                </button>
              </div>
            </div>
          </header>
        ) : (
          <div className="lg:hidden shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <button
              type="button"
              className="w-10 h-10 border border-[var(--border)] bg-[var(--white)] flex items-center justify-center rounded-none"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <Link to="/messages" className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              Messages
            </Link>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto ${title ? 'px-4 lg:px-10 py-6' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
