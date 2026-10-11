import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-6">
      <Image
        src="/images/logo-tasktify.svg"
        alt="Tasktify"
        width={100}
        height={100}
        className="opacity-80"
      />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">404</h1>
        <p className="text-base font-semibold text-gray-700">Halaman tidak ditemukan</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-[#1B8FDF] text-white text-sm font-semibold rounded-2xl shadow-md active:scale-95 transition-transform"
      >
        Kembali ke Home
      </Link>
    </div>
  );
}
