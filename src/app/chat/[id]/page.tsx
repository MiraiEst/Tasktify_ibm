'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProviderAvatar from '@/components/ProviderAvatar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  time: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'provider',
    text: 'Halo! Saya Ari, teknisi listrik Anda. Ada yang bisa saya bantu?',
    time: '09:00',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Halo Pak Ari! Saya ingin tanya soal perbaikan instalasi listrik di rumah saya.',
    time: '09:02',
  },
  {
    id: '3',
    sender: 'provider',
    text: 'Tentu, bisa ceritakan lebih detail masalah yang Anda alami? Apakah ada korsleting atau mati lampu?',
    time: '09:03',
  },
  {
    id: '4',
    sender: 'user',
    text: 'Ada beberapa stop kontak yang tidak berfungsi di dapur dan ruang tamu. Kapan Bapak bisa datang?',
    time: '09:05',
  },
];

function ChatRoomContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suppress unused variable warning — id is available for future API use
  void id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="max-w-[430px] mx-auto h-screen flex flex-col bg-[#F0F7FF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <ProviderAvatar name="Ari Staprans" initials="AS" size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">Ari Staprans</p>
          <p className="text-[10px] text-green-500 font-medium">● Online</p>
        </div>
        <button aria-label="More options" className="w-8 h-8 flex items-center justify-center text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.sender === 'provider' && (
              <ProviderAvatar name="Ari Staprans" initials="AS" size="sm" />
            )}
            <div className={`flex flex-col max-w-[72%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#1B8FDF] text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-[#F0F7FF] rounded-full px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#1B8FDF]/30"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          aria-label="Send message"
          className="w-10 h-10 rounded-full bg-[#1B8FDF] flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ChatRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[430px] mx-auto h-screen bg-[#F0F7FF] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-[#1B8FDF] animate-spin" />
        </div>
      }
    >
      <ChatRoomContent />
    </Suspense>
  );
}
