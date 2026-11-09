import React from 'react';

export const WinterSnowfall: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
    {[
      ['8%', '18%', '0.7rem', '0.34'],
      ['20%', '72%', '0.45rem', '0.22'],
      ['34%', '12%', '0.52rem', '0.25'],
      ['48%', '82%', '0.72rem', '0.22'],
      ['62%', '24%', '0.44rem', '0.3'],
      ['76%', '65%', '0.62rem', '0.25'],
      ['88%', '15%', '0.5rem', '0.32'],
      ['94%', '78%', '0.78rem', '0.2']
    ].map(([left, top, size, opacity], index) => (
      <span
        key={`${left}-${top}`}
        className="absolute text-sky-100"
        style={{ left, top, fontSize: size, opacity: Number(opacity), transform: `rotate(${index * 19}deg)` }}
      >
        ❄
      </span>
    ))}
  </div>
);

export const WinterCampIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 300 150" className={className} role="img" aria-label="눈사람과 썰매가 있는 겨울 일러스트">
    <defs>
      <linearGradient id="winter-snow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F8FCFF" />
        <stop offset="1" stopColor="#DFF3FF" />
      </linearGradient>
      <linearGradient id="winter-sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#DDF3FF" stopOpacity="0.8" />
        <stop offset="1" stopColor="#A8DDF5" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <path d="M10 125C55 105 90 121 132 113C180 103 217 110 290 94V150H10Z" fill="url(#winter-sky)" />
    <path d="M4 137C57 119 109 135 156 123C206 110 245 117 296 105" fill="none" stroke="#EAF8FF" strokeWidth="6" strokeLinecap="round" />
    <g transform="translate(42 28)">
      <circle cx="45" cy="66" r="31" fill="url(#winter-snow)" stroke="#B9E1F2" strokeWidth="2" />
      <circle cx="45" cy="25" r="22" fill="url(#winter-snow)" stroke="#B9E1F2" strokeWidth="2" />
      <path d="M24 12H66L60 1H32Z" fill="#111114" />
      <rect x="20" y="11" width="50" height="7" rx="3.5" fill="#111114" />
      <circle cx="38" cy="22" r="2.3" fill="#111114" />
      <circle cx="52" cy="22" r="2.3" fill="#111114" />
      <path d="M46 26L60 30L46 33Z" fill="#FFD600" />
      <path d="M36 37C42 41 49 41 55 37" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 47C38 53 53 53 67 47" fill="none" stroke="#FFD600" strokeWidth="7" strokeLinecap="round" />
      <path d="M28 51L20 72" fill="none" stroke="#FFD600" strokeWidth="6" strokeLinecap="round" />
      <circle cx="45" cy="60" r="2.6" fill="#64748B" />
      <circle cx="45" cy="73" r="2.6" fill="#64748B" />
      <path d="M19 57L2 44M70 57L88 43" fill="none" stroke="#7C5B3B" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g transform="translate(167 68)">
      <path d="M8 49C21 58 83 59 108 48" fill="none" stroke="#9ACFE6" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 45L15 7M91 45L99 10" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 9C41 18 72 18 99 10L91 42C68 48 44 48 22 43Z" fill="#FFD600" stroke="#111114" strokeWidth="3" strokeLinejoin="round" />
      <path d="M28 18C48 24 69 24 88 18" fill="none" stroke="#FFF2A3" strokeWidth="3" strokeLinecap="round" />
      <path d="M104 9C115 3 122 7 123 16" fill="none" stroke="#111114" strokeWidth="4" strokeLinecap="round" />
    </g>
    <g fill="#DFF3FF" opacity="0.9">
      <circle cx="25" cy="26" r="3" />
      <circle cx="145" cy="24" r="2.5" />
      <circle cx="266" cy="34" r="3.5" />
      <circle cx="232" cy="17" r="2" />
      <circle cx="128" cy="54" r="2" />
    </g>
  </svg>
);
