'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';

const SERVICES = [
  { title: 'Plumbing service', provider: 'Provider A', rating: 4.5, priceFrom: 50000, priceTo: 150000, category: 'Plumbing' },
  { title: 'Plumbing service', provider: 'Provider B', rating: 4.3, priceFrom: 60000, priceTo: 200000, category: 'Plumbing' },
  { title: 'Plumbing service', provider: 'Provider C', rating: 4.7, priceFrom: 75000, priceTo: 180000, category: 'Plumbing' },
  { title: 'Plumbing service', provider: 'Provider D', rating: 4.1, priceFrom: 45000, priceTo: 120000, category: 'Plumbing' },
];

const FILTER_TABS = ['All', 'Terdekat ▼', 'Filter ↑↓'] as const;

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');

  const filtered = SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.provider.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-[430px] mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Market</h1>
        <Link
          href="/add-task"
          className="bg-[#1B8FDF] text-white text-sm font-semibold px-4 py-2 rounded-full"
        >
          Post Task
        </Link>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Search */}
        <SearchBar
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? 'bg-[#1B8FDF] text-white border-[#1B8FDF]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((service, i) => (
            <div key={i} className="relative">
              <ServiceCard {...service} />
              {/* Nearby badge */}
              <span className="absolute bottom-[52px] right-2 text-[10px] font-semibold bg-[#35ADFF] text-white px-2 py-0.5 rounded-full">
                Nearby
              </span>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No services found.</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
