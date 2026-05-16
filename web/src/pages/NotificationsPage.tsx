import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

export default function NotificationsPage() {
  const { notifications, fetchNotifications } = useAppContext();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout title="Notifications" subtitle="Updates on tasks, wallet, and messages.">
      <div className="max-w-3xl border border-[var(--border)] bg-[var(--white)] mx-4 lg:mx-8 rounded-none">
        <div className="divide-y divide-[var(--border)]">
          {notifications.length === 0 ? (
            <p className="p-8 text-sm text-[var(--muted)]">You&apos;re all caught up.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.isRead && markRead(n.id)}
                className={`w-full text-left px-6 py-5 hover:bg-[var(--surface-alt)] transition-colors ${!n.isRead ? 'border-l-2 border-l-[var(--accent)]' : ''}`}
              >
                <p className="font-semibold text-[var(--navy)] text-sm">{n.title || 'Notification'}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{n.body || n.message || ''}</p>
                <p className="text-[11px] text-[var(--muted)] mt-2 uppercase tracking-wide">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
