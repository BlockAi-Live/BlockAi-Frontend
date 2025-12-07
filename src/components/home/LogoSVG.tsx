interface LogoSVGProps {
  className?: string;
}

export default function LogoSVG({ className = "w-8 h-8" }: LogoSVGProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#00E3A5" />
          <stop offset="1" stopColor="#6A5BFF" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="#0e1720" />
      <g transform="translate(6,6)">
        <path d="M6 0 L18 6 L18 18 L6 24 L-6 18 L-6 6 Z" transform="translate(12,0)" fill="url(#g1)" opacity="0.95" />
      </g>
    </svg>
  );
}
