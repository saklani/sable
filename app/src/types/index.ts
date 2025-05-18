export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export interface AudioItem {
  id: string;
  title: string;
  type: 'file' | 'text';
  createdAt: string;
  duration?: number;
  fileUrl?: string;
  text?: string;
  tags?: string[];
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  previewUrl?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: string;
} 