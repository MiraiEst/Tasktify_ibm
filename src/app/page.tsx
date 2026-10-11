'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import ProviderAvatar from '@/components/ProviderAvatar';
import { useAuth } from '@/context/AuthContext';

const recommendedServices = [
  {
    title: 'Jasa Antar Barang',
    provider: 'Provider A',
    rating: 4.5,
    priceFrom: 4000,
    priceTo: 45000,
    category: 'Delivery',
    imageUrl: '/images/MarketPlace.svg',
  },
  {
    title: 'Jasa Antar Barang',
    provider: 'Provider B',
    rating: 4.3,
    priceFrom: 4000,
    priceTo: 45000,
    category: 'Delivery',
    imageUrl: '/images/MarketPlace.svg',
  },
];

const shortcuts = [
  {
    label: 'Marketplace',
    href: '/market',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18l-1.5 9H4.5L3 6z" />
        <path d="M3 6l-.75-3H1" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </svg>
    ),
  },
  {
    label: 'Add Task',
    href: '/add-task',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: 'My Task',
    href: '/activity',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const displayName = user?.full_name ?? 'Pengguna';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-[#1B8FDF] px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          {/* User info */}
          <div className="flex items-center gap-3">
            <ProviderAvatar name={displayName} initials={initials} size="md" />
            <div>
              <p className="text-white/80 text-xs">Welcome back 👋</p>
              <h1 className="text-white font-semibold text-base leading-tight">
                {displayName}
              </h1>
              <p className="text-white/70 text-[11px] mt-0.5">
                @{user?.username ?? ''}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button
              onClick={() => logout()}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
              aria-label="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-5">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for tasks or services..."
          />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-5 pt-6 space-y-6">
        {/* Shortcuts */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 py-4 hover:bg-[#F0F7FF] transition-colors"
              >
                {s.icon}
                <span className="text-xs font-medium text-gray-700">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended Services */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Recommended Services</h2>
            <Link href="/market" className="text-xs text-[#1B8FDF] font-medium">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedServices.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </section>

        {/* Mascot / tagline */}
        <section className="flex flex-col items-center py-4 gap-3">
          <Image
            src="/images/logo-tasktify.svg"
            alt="Tasktify mascot"
            width={80}
            height={80}
            className="opacity-90"
          />
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            Your daily tasks, simplified.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
