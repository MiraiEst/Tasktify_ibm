'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import ProviderAvatar from '@/components/ProviderAvatar';

interface ConversationItem {
  name: string;
  subtitle: string;
  time: string;
  unread: boolean;
}

const CONVERSATIONS: ConversationItem[] = [
  { name: '+6297412475123', subtitle: 'Electrical Engineer', time: '8min/8hours', unread: true },
  { name: 'Keisha Mahira', subtitle: 'Electrical Engineer', time: '02/01/2025', unread: false },
  { name: 'Faizah Khairunnisa', subtitle: 'Neuronsurgern', time: 'Today', unread: false },
];

export default function ChatPage() {
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-[430px] mx-auto pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chat</h1>
            <p className="text-xs text-[#6B7280]">Your conversations</p>
          </div>
          {/* Compose button */}
          <button
            aria-label="New conversation"
            className="w-9 h-9 rounded-full bg-[#1B8FDF] flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Search */}
        <SearchBar
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Conversation list */}
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {filtered.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <ProviderAvatar name={item.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-[#6B7280] truncate">{item.subtitle}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-[#6B7280]">{item.time}</span>
                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#1B8FDF]" />
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8 px-4">No conversations found.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
