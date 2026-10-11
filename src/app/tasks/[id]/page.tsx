'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import ProviderAvatar from '@/components/ProviderAvatar';
import { useAuth } from '@/context/AuthContext';
import type { Task } from '@/types';

const FALLBACK_TASK: Task = {
  _id: '1',
  user_id: 'u1',
  provider_id: 'p1',
  title: 'Garansi kerusakan',
  category: 'Listrik',
  location: 'Makassar, Sulawesi Selatan',
  budget: 250000,
  schedule: '2025-02-01',
  note: 'Perbaikan instalasi listrik rumah bagian dapur dan ruang tamu. Pastikan semua kabel dan stop kontak berfungsi dengan baik.',
  status: 'ongoing',
  origin: 'direct',
  created_at: new Date().toISOString(),
};

function TaskDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'house' | 'corporate'>('house');
  const [taking, setTaking] = useState(false);
  const [takeError, setTakeError] = useState<string | null>(null);
  const [takeSuccess, setTakeSuccess] = useState(false);

  async function handleTakeTask() {
    setTaking(true);
    setTakeError(null);
    try {
      const res = await fetch(`/api/tasks/${id}/take`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { setTakeError(data.error ?? 'Gagal mengambil task'); return; }
      setTakeSuccess(true);
      setTask(data);
    } catch {
      setTakeError('Terjadi kesalahan jaringan');
    } finally {
      setTaking(false);
    }
  }

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (!res.ok) throw new Error('Task not found');
        const data: Task = await res.json();
        setTask(data);
      } catch {
        setTask(FALLBACK_TASK);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-[#0A2647] pb-20">
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
          <div className="w-28 h-5 bg-white/20 rounded animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        </div>
        <div className="px-4 pt-4 space-y-3">
          <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="mx-4 mt-6 bg-white rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-white flex flex-col items-center justify-center gap-4 pb-20">
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#1B8FDF] text-white rounded-lg text-sm"
        >
          Go Back
        </button>
        <BottomNav />
      </div>
    );
  }

  const t = task!;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#0A2647] pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-white font-semibold text-base">Task Details</h1>
        <button aria-label="Share" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div className="relative px-4 pt-4 pb-8 overflow-hidden">
        <div className="pr-24">
          <h2 className="text-white text-2xl font-bold leading-tight">{t.title}</h2>
          <p className="text-white/70 text-xs mt-2 leading-relaxed">
            Dapatkan voucher hingga 50rb untuk garansi kerusakan pekerjaan
          </p>
          <p className="text-white/60 text-xs mt-3">Keep it up, Cristiko!</p>
          <span className="inline-block mt-2 bg-[#1B8FDF]/80 text-white text-[10px] font-medium px-3 py-1 rounded-full">
            Your issue is currently being resolved
          </span>
        </div>
        <div className="absolute right-4 top-0 bottom-0 flex items-center">
          <Image
            src="/images/icon-tasktify.svg"
            alt="Tasktify mascot"
            width={90}
            height={90}
            className="opacity-90"
          />
        </div>
      </div>

      {/* White content area */}
      <div className="bg-[#F0F7FF] rounded-t-3xl px-4 pt-5 space-y-4">
        {/* Provider card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ProviderAvatar name="Ari Staprans" initials="AS" size="md" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Ari Staprans</p>
              <p className="text-xs text-gray-500">Senior Electrical Technician</p>
            </div>
            <Link
              href={`/providers/${t.provider_id ?? 'p1'}`}
              className="text-[#1B8FDF] text-xs font-medium"
            >
              View
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('house')}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'house'
                  ? 'bg-[#1B8FDF] text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              House Electrician
            </button>
            <button
              onClick={() => setActiveTab('corporate')}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'corporate'
                  ? 'bg-[#1B8FDF] text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              Corporate job
            </button>
          </div>
        </div>

        {/* Portfolio images */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { src: '/images/AddTask.svg', label: 'Electrical Wiring' },
              { src: '/images/DoTask.svg', label: 'Panel Installation' },
            ].map(({ src, label }) => (
              <div key={label} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-28 flex items-center justify-center bg-[#E8F4FD] p-3">
                  <Image src={src} alt={label} width={80} height={80} className="object-contain" />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center py-2">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Task description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Task Description</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{t.note || 'No description provided.'}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>{t.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <span>{new Date(t.schedule).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Action button — contextual based on task status and user role */}
        {takeSuccess ? (
          <div className="w-full py-3 bg-green-500 text-white font-semibold rounded-2xl text-sm text-center">
            ✓ Task berhasil diambil! Status: Scheduled
          </div>
        ) : t.status === 'waiting' && user?._id !== t.user_id ? (
          <div className="space-y-2">
            {takeError && (
              <p className="text-xs text-red-500 text-center">{takeError}</p>
            )}
            <button
              onClick={handleTakeTask}
              disabled={taking}
              className="w-full py-3 bg-[#1B8FDF] text-white font-semibold rounded-2xl text-sm shadow-md active:scale-95 transition-transform disabled:opacity-60"
            >
              {taking ? 'Memproses…' : '🙋 Ambil Task Ini'}
            </button>
          </div>
        ) : t.status === 'history' ? (
          <button className="w-full py-3 bg-[#1B8FDF] text-white font-semibold rounded-2xl text-sm shadow-md active:scale-95 transition-transform">
            ★ Rate &amp; Review
          </button>
        ) : (
          <div className="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-2xl text-sm text-center capitalize">
            Status: {t.status}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function TaskDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[430px] mx-auto min-h-screen bg-[#0A2647] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        </div>
      }
    >
      <TaskDetailContent />
    </Suspense>
  );
}
