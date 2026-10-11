'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';

const TABS = ['Semua', 'Ongoing', 'Waiting', 'Scheduled', 'History', 'Rejected'] as const;
type Tab = (typeof TABS)[number];

const TAB_STATUS: Record<Tab, string | null> = {
  'Semua':     null,
  'Ongoing':   'ongoing',
  'Waiting':   'waiting',
  'Scheduled': 'scheduled',
  'History':   'history',
  'Rejected':  'rejected',
};

export default function ActivityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Semua');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = user?._id ?? 'guest';
      const status = TAB_STATUS[activeTab];
      const params = new URLSearchParams({ user_id: userId });
      if (status) params.set('status', status);
      const res = await fetch(`/api/tasks?${params}`);
      if (!res.ok) throw new Error('Gagal mengambil data task');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-[430px] mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Activity</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTasks}
            aria-label="Refresh"
            className="w-9 h-9 rounded-full bg-[#EBF5FF] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button aria-label="Notifications">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tab filter */}
      <div className="flex bg-white border-b border-gray-100 px-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-3 py-3 text-xs font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-[#1B8FDF] border-[#1B8FDF]'
                : 'text-gray-400 border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 text-center">
            {error}
            <button onClick={fetchTasks} className="block mx-auto mt-2 text-[#1B8FDF] font-semibold underline text-xs">
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-[#EBF5FF] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Belum ada task untuk tab ini</p>
              <p className="text-gray-400 text-xs">Buat task baru untuk memulai</p>
            </div>
            <Link
              href="/add-task"
              className="flex items-center gap-2 bg-[#1B8FDF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              <span className="text-lg leading-none">+</span>
              <span>Tambah Task Baru</span>
            </Link>
          </div>
        )}

        {/* Task list */}
        {!loading && !error && tasks.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium">
              {tasks.length} task ditemukan
            </p>
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
            <Link
              href="/add-task"
              className="flex items-center justify-center gap-2 border-2 border-dashed border-[#1B8FDF]/30 text-[#1B8FDF] text-sm font-semibold py-3.5 rounded-2xl mt-2"
            >
              <span className="text-lg leading-none">+</span>
              <span>Tambah Task Baru</span>
            </Link>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
