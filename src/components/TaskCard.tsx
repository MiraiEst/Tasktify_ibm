'use client';

import Link from 'next/link';
import { Task } from '@/types';

const STATUS_STYLES: Record<Task['status'], { bg: string; text: string; label: string }> = {
  waiting:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Menunggu' },
  scheduled: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Dijadwalkan' },
  ongoing:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Berlangsung' },
  history:   { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Selesai' },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Dibatalkan' },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Ditolak' },
};

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const style = STATUS_STYLES[task.status] ?? STATUS_STYLES.waiting;
  const date = task.schedule
    ? new Date(task.schedule).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '-';

  return (
    <Link href={`/tasks/${task._id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-gray-900 flex-1 leading-snug">{task.title}</p>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
            {style.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          {/* Category badge */}
          <span className="bg-[#EBF5FF] text-[#1B8FDF] px-2 py-0.5 rounded-full font-medium">
            {task.category}
          </span>
          {/* Location */}
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {task.location}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{date}</span>
          <span className="text-sm font-bold text-[#1B8FDF]">
            Rp {task.budget?.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </Link>
  );
}
