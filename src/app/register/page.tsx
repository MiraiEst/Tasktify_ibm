'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) { setError('Password tidak cocok.'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    setLoading(true);
    const err = await register({
      full_name: form.full_name,
      username: form.username,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.password,
    });
    setLoading(false);
    if (err) { setError(err); return; }
    router.push('/');
  }

  const inputClass = 'w-full bg-[#F0F7FF] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B8FDF] focus:ring-1 focus:ring-[#1B8FDF] transition';

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1B8FDF] to-[#35ADFF] px-6 pt-14 pb-10 flex flex-col items-center">
        <Image src="/images/icon-tasktify.svg" alt="Tasktify" width={72} height={72} className="rounded-2xl mb-4" />
        <h1 className="text-2xl font-bold text-white">Buat Akun Baru</h1>
        <p className="text-white/80 text-sm mt-1">Bergabung dengan Tasktify hari ini</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username</label>
            <input name="username" value={form.username} onChange={handleChange} required placeholder="johndoe" className={inputClass} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="contoh@email.com" className={inputClass} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">No. HP <span className="text-gray-400 font-normal">(opsional)</span></label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08123456789" className={inputClass} />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alamat <span className="text-gray-400 font-normal">(opsional)</span></label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Makassar" className={inputClass} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 karakter"
                className={`${inputClass} pr-11`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPass
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Konfirmasi Password</label>
            <input
              name="confirm"
              type={showPass ? 'text' : 'password'}
              value={form.confirm}
              onChange={handleChange}
              required
              placeholder="Ulangi password"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B8FDF] text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-60 transition-opacity mt-2"
          >
            {loading ? 'Mendaftarkan…' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#1B8FDF] font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
