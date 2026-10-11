'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Listrik', 'Plumbing', 'Cleaning', 'Delivery', 'Lainnya'] as const;

interface FormState {
  title: string;
  category: string;
  location: string;
  budget: string;
  schedule: string;
  note: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  category: '',
  location: '',
  budget: '',
  schedule: '',
  note: '',
};

export default function AddTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          location: form.location,
          budget: Number(form.budget),
          schedule: form.schedule,
          note: form.note,
          user_id: user?._id ?? 'guest',
          origin: 'direct',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      if (data.task?.status === 'rejected') {
        setError(
          data.moderation?.reason ??
            'Your task was rejected due to policy violations. Please revise and try again.',
        );
        return;
      }

      router.push('/activity');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B8FDF] focus:ring-1 focus:ring-[#1B8FDF] transition';

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-[430px] mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="w-9 h-9 rounded-full bg-[#EBF5FF] flex items-center justify-center shrink-0"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1B8FDF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Add New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Fix kitchen sink leak"
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={`${inputClass} appearance-none`}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="Enter your address"
            className={inputClass}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium pointer-events-none">
              Rp
            </span>
            <input
              name="budget"
              type="number"
              min="0"
              value={form.budget}
              onChange={handleChange}
              required
              placeholder="0"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Schedule</label>
          <input
            name="schedule"
            type="datetime-local"
            value={form.schedule}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Note / Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Note / Description
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your task in detail..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B8FDF] text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-60 transition-opacity"
        >
          {loading ? 'Posting…' : 'Post Task'}
        </button>
      </form>
    </div>
  );
}
