export interface Profile {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  _id: string;
  user_id: string;
  name: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  jobs: number;
  verified: boolean;
  price_from: number;
  initials: string;
  bio: string;
  created_at: string;
}

export interface Task {
  _id: string;
  user_id: string;
  provider_id?: string;
  title: string;
  category: string;
  location: string;
  budget: number;
  schedule: string;
  note: string;
  status: 'waiting' | 'scheduled' | 'ongoing' | 'history' | 'cancelled' | 'rejected';
  origin: 'direct' | 'marketplace';
  $vector?: number[];
  created_at: string;
}

export interface Rating {
  _id: string;
  task_id: string;
  user_id: string;
  provider_id: string;
  score: number;
  review: string;
  client_name: string;
  task_title: string;
  created_at: string;
}

export interface Conversation {
  _id: string;
  task_id: string;
  user_id: string;
  provider_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
}

export interface Message {
  _id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'provider';
  text: string;
  created_at: string;
}

export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Payment {
  _id: string;
  task_id: string;
  user_id: string;
  provider_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  midtrans_order_id: string;
  snap_token?: string;
  created_at: string;
}
