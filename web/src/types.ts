export interface Provider {
  id: string;
  name: string;
  skill: string;
  rating: number;
  distance: string;
  image: string;
  availability: 'Online' | 'Offline';
  bio: string;
  skills: string[];
  tags: string[];
  reviews: Review[];
  userId?: string;
  rate?: number;
  serviceArea?: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  timeAgo?: string;
  comment: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  scheduledTime?: string;
  cost?: string;
  status: string;
  createdAt: string;
  client?: string;
  distance?: string;
  provider?: { name: string; rating: number; reviews: number; image: string };
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  type: 'text' | 'booking';
  delivered?: boolean;
  title?: string;
  price?: string;
  time?: string;
  status?: string;
}

export interface User {
  id: string;
  phoneNumber?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: 'client' | 'provider' | 'CLIENT' | 'PROVIDER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  referral?: string;
  avatar?: string;
  isOnline?: boolean;
  providerProfile?: {
    serviceArea?: string;
    rate?: string;
    bio?: string;
    skills?: string[];
    rating?: number;
  };
}
