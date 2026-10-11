import Image from 'next/image';

type AvatarSize = 'sm' | 'md' | 'lg';

interface ProviderAvatarProps {
  name: string;
  initials?: string;
  imageUrl?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, { px: number; className: string; text: string }> = {
  sm: { px: 32, className: 'w-8 h-8', text: 'text-xs' },
  md: { px: 44, className: 'w-11 h-11', text: 'text-sm' },
  lg: { px: 60, className: 'w-15 h-15', text: 'text-lg' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ProviderAvatar({
  name,
  initials,
  imageUrl,
  size = 'md',
}: ProviderAvatarProps) {
  const { px, className, text } = sizeMap[size];
  const displayInitials = initials ?? getInitials(name);

  if (imageUrl) {
    return (
      <div className={`${className} rounded-full overflow-hidden shrink-0 relative`}>
        <Image
          src={imageUrl}
          alt={name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-[#1B8FDF] flex items-center justify-center shrink-0`}
      aria-label={name}
    >
      <span className={`${text} font-semibold text-white leading-none`}>
        {displayInitials}
      </span>
    </div>
  );
}
