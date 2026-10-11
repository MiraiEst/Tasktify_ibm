import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  provider: string;
  rating: number;
  priceFrom: number;
  priceTo: number;
  category: string;
  imageUrl?: string;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f-${i}`} width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {half && (
        <svg width="12" height="12" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e-${i}`} width="12" height="12" viewBox="0 0 24 24" fill="#D1D5DB">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ServiceCard({
  title,
  provider,
  rating,
  priceFrom,
  priceTo,
  category,
  imageUrl,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-36 bg-[#EBF5FF]">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EBF5FF]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B8FDF" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Category badge */}
        <span className="absolute top-2 left-2 text-[10px] font-semibold bg-[#1B8FDF] text-white px-2 py-0.5 rounded-full">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{provider}</p>
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={rating} />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-[#1B8FDF]">{formatPrice(priceFrom)}</span>
            {' – '}
            {formatPrice(priceTo)}
          </p>
        </div>
      </div>
    </div>
  );
}
