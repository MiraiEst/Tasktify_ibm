'use client';

import { useState, useEffect, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import TaskBoardCard from '@/components/TaskBoardCard';
import { Task } from '@/types';
import Link from 'next/link';

const CATEGORIES = ['Semua', 'Listrik', 'Plumbing', 'Cleaning', 'Delivery', 'Lainnya'];

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'Semua') params.set('category', activeCategory);
      const res = await fetch(`/api/tasks/board?${params}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side search filter
  const filtered = tasks.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.note?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-[430px] mx-auto pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Task Board</h1>
            <p className="text-xs text-gray-400 mt-0.5">Temukan task yang ingin Anda kerjakan</p>
          </div>
          <Link
            href="/add-task"
            className="bg-[#1B8FDF] text-white text-xs font-semibold px-3 py-2 rounded-xl"
          >
            + Post Task
          </Link>
        </div>

        {/* Search bar */}
        <SearchBar
          placeholder="Cari task berdasarkan judul, lokasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1B8FDF] text-white border-[#1B8FDF]'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Stats bar */}
        {!loading && !error && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-700">{filtered.length}</span> task tersedia
            </p>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-1.5 text-xs text-[#1B8FDF] font-medium"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded-full w-20" />
                  <div className="h-3 bg-gray-100 rounded w-16" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-7 bg-gray-200 rounded-xl w-20" />
                </div>
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
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-[#EBF5FF] flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">
                {search ? `Tidak ada task untuk "${search}"` : 'Belum ada task tersedia'}
              </p>
              <p className="text-gray-400 text-xs">
                {search ? 'Coba kata kunci lain' : 'Jadilah yang pertama memposting task!'}
              </p>
            </div>
            {!search && (
              <Link
                href="/add-task"
                className="bg-[#1B8FDF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
              >
                + Post Task Sekarang
              </Link>
            )}
          </div>
        )}

        {/* Task list */}
        {!loading && !error && filtered.length > 0 &&
          filtered.map((task) => (
            <TaskBoardCard key={task._id} task={task} />
          ))
        }
      </div>

      <BottomNav />
    </div>
  );
}
