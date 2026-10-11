'use client';

import Link from 'next/link';
import { Task } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Listrik:  'bg-yellow-100 text-yellow-700',
  Plumbing: 'bg-blue-100 text-blue-700',
  Cleaning: 'bg-green-100 text-green-700',
  Delivery: 'bg-orange-100 text-orange-700',
  Lainnya:  'bg-gray-100 text-gray-600',
};

interface TaskBoardCardProps {
  task: Task;
}

export default function TaskBoardCard({ task }: TaskBoardCardProps) {
  const catStyle = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS['Lainnya'];
  const scheduleDate = task.schedule
    ? new Date(task.schedule).toLocaleDateString('id-ID', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : '-';
  const postedDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : '';

  return (
    <Link href={`/tasks/${task._id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
        {/* Top row: category + posted date */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${catStyle}`}>
            {task.category}
          </span>
          <span className="text-[11px] text-gray-400">Dipost {postedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
          {task.title}
        </h3>

        {/* Note preview */}
        {task.note && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.note}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
          {/* Location */}
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {task.location}
          </span>
          {/* Schedule */}
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {scheduleDate}
          </span>
        </div>

        {/* Bottom: budget + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400">Budget</p>
            <p className="text-sm font-bold text-[#1B8FDF]">
              Rp {task.budget?.toLocaleString('id-ID')}
            </p>
          </div>
          <span className="bg-[#1B8FDF] text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
