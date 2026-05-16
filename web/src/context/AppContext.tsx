import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Job, Provider } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

export interface ConversationRow {
  id: string;
  participants: Array<{ id: string; fullName?: string; avatar?: string; isOnline?: boolean }>;
  lastMessage?: { content: string; createdAt: string; type?: string } | null;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  isRead?: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

interface AppContextType {
  providers: Provider[];
  jobs: Job[];
  conversations: ConversationRow[];
  notifications: AppNotification[];
  walletBalance: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  isProviderOnline: boolean;
  isLoading: boolean;
  fetchAppData: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  postJob: (job: Partial<Job>) => Promise<void>;
  updateProviderStatus: (status: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

/** Maps backend provider profile + user into list card shape */
function mapProvider(p: Record<string, unknown>): Provider {
  const user = (p.user as Record<string, unknown>) || {};
  const skills = (p.skills as string[]) || [];
  const name = (user.fullName as string) || 'Professional';
  return {
    id: (p.id as string) || '',
    name,
    skill: skills[0] || 'Services',
    rating: Number(p.rating || 0),
    distance: '',
    image: (user.avatar as string) || '',
    availability: user.isOnline ? 'Online' : 'Offline',
    bio: (p.bio as string) || '',
    skills,
    tags: skills.slice(0, 4),
    reviews: [],
    userId: user.id as string,
    rate: p.rate as number | undefined,
    serviceArea: p.serviceArea as string | undefined,
  } as Provider & { userId?: string; rate?: number; serviceArea?: string };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProviderOnline, setIsProviderOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const fetchAppData = useCallback(async () => {
    if (!token || !user) return;
    setIsLoading(true);
    try {
      const jobsEndpoint =
        user.role?.toUpperCase() === 'PROVIDER' ? '/jobs/my-jobs' : '/jobs/client';

      const [providersRes, jobsRes, walletRes] = await Promise.all([
        api.get('/providers').catch(() => ({ data: { data: [] } })),
        api.get(jobsEndpoint).catch(() => ({ data: { data: [] } })),
        api.get('/wallet/balance').catch(() => ({ data: { data: { balance: 0 } } })),
      ]);

      const rawProviders = providersRes.data.data || [];
      setProviders(rawProviders.map((x: Record<string, unknown>) => mapProvider(x)));

      const jobRows = jobsRes.data.data || [];
      setJobs(
        jobRows.map((j: Record<string, unknown>) => ({
          id: j.id as string,
          title: (j.title as string) || '',
          description: (j.description as string) || '',
          category: (j.category as string) || '',
          location: (j.location as string) || '',
          budget: String(j.budget ?? ''),
          scheduledTime: j.scheduledTime as string | undefined,
          status: String(j.status || ''),
          createdAt: (j.createdAt as string) || '',
        }))
      );

      const wallet = walletRes.data.data;
      setWalletBalance(Number(wallet?.balance ?? wallet ?? 0));

      await Promise.all([fetchConversations(), fetchNotifications()]);
    } catch (error) {
      console.error('fetchAppData', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, user, fetchConversations, fetchNotifications]);

  useEffect(() => {
    if (token && user) {
      fetchAppData();
    } else {
      setJobs([]);
      setConversations([]);
      setNotifications([]);
      setWalletBalance(0);
      api.get('/providers').then((res) => {
        const raw = res.data.data || [];
        setProviders(raw.map((x: Record<string, unknown>) => mapProvider(x)));
      }).catch(() => setProviders([]));
    }
  }, [token, user?.id, user?.role, fetchAppData]);

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'PROVIDER') {
      setIsProviderOnline(Boolean(user.isOnline));
    }
  }, [user?.isOnline, user?.role]);

  const postJob = async (newJob: Partial<Job>) => {
    const res = await api.post('/jobs', newJob);
    setJobs((prev) => [...prev, res.data.data]);
  };

  const updateProviderStatus = (status: boolean) => {
    setIsProviderOnline(status);
    api.put('/providers/status', { isOnline: status }).catch(console.error);
  };

  const unreadMessagesCount = useMemo(
    () => conversations.reduce((acc, c) => acc + (c.unreadCount > 0 ? 1 : 0), 0),
    [conversations]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <AppContext.Provider
      value={{
        providers,
        jobs,
        conversations,
        notifications,
        walletBalance,
        unreadMessagesCount,
        unreadNotificationsCount,
        isProviderOnline,
        isLoading,
        fetchAppData,
        fetchConversations,
        fetchNotifications,
        postJob,
        updateProviderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
