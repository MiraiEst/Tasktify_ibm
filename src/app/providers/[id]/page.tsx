'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProviderAvatar from '@/components/ProviderAvatar';
import type { Provider } from '@/types';

const FALLBACK_PROVIDER: Provider = {
  _id: 'p1',
  user_id: 'u1',
  name: 'Ari Staprans',
  title: 'Senior Electrical Technician',
  category: 'Listrik',
  location: 'Makassar, Sulawesi Selatan',
  rating: 4.9,
  jobs: 128,
  verified: true,
  price_from: 150000,
  initials: 'AS',
  bio: 'Teknisi listrik rumah dan kantor berpengalaman lebih dari 10 tahun. Melayani instalasi baru, perbaikan korsleting, pemasangan panel listrik, dan perawatan berkala. Bersertifikat dan bergaransi.',
  created_at: new Date().toISOString(),
};

const PORTFOLIO_ITEMS = [
  { src: '/images/AddTask.svg', label: 'Electrical Wiring' },
  { src: '/images/DoTask.svg', label: 'Panel Installation' },
];

function ProviderProfileContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch(`/api/providers/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data: Provider = await res.json();
        setProvider(data);
      } catch {
        setProvider(FALLBACK_PROVIDER);
      } finally {
        setLoading(false);
      }
    }
    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-white pb-20">
        <div className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-gray-100">
          <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="flex flex-col items-center pt-8 px-4 space-y-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-36 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-48 h-4 bg-gray-100 rounded animate-pulse" />
          <div className="w-40 h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const p = provider!;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-gray-900 font-semibold text-base">Freelancer Profile</h1>
        </div>
        <Image src="/images/icon-tasktify.svg" alt="Tasktify" width={32} height={32} />
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center px-4 pt-8 pb-6">
        <div className="relative mb-3">
          <ProviderAvatar name={p.name} initials={p.initials} size="lg" />
          {p.verified && (
            <span className="absolute -bottom-1 -right-1 bg-[#1B8FDF] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
              ✓
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
        <p className="text-sm text-[#1B8FDF] font-medium mt-0.5">{p.title}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <span>{p.location}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-900">⭐ {p.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Rating</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-900">{p.jobs}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Jobs</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-900">{p.category}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Kategori</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/chat/conv-${p._id}`}
          className="mt-5 w-full max-w-xs bg-[#1B8FDF] text-white text-sm font-semibold rounded-2xl py-3 text-center shadow-md active:scale-95 transition-transform block"
        >
          Contact Provider
        </Link>
      </div>

      <div className="h-2 bg-[#F0F7FF]" />

      {/* About section */}
      <div className="px-4 py-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{p.bio}</p>
        <div className="mt-3 bg-[#F0F7FF] rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs text-gray-600">Starting price</span>
          <span className="text-sm font-bold text-[#1B8FDF]">
            Rp {p.price_from.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="h-2 bg-[#F0F7FF]" />

      {/* Portfolio section */}
      <div className="px-4 py-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Portofolio</h3>
        <div className="grid grid-cols-2 gap-3">
          {PORTFOLIO_ITEMS.map(({ src, label }) => (
            <div key={label} className="bg-[#F0F7FF] rounded-xl overflow-hidden">
              <div className="h-28 flex items-center justify-center p-4">
                <Image src={src} alt={label} width={80} height={80} className="object-contain" />
              </div>
              <p className="text-xs font-medium text-gray-700 text-center pb-3">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProviderProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[430px] mx-auto min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#1B8FDF] animate-spin" />
        </div>
      }
    >
      <ProviderProfileContent />
    </Suspense>
  );
}
