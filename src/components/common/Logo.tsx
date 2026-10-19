import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const titleSize = {
    sm: 'text-sm font-extrabold',
    md: 'text-lg sm:text-xl font-extrabold',
    lg: 'text-2xl font-black',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic SVG Icon Badge */}
      <div
        className={`${iconDimensions} rounded-xl bg-slate-900 flex items-center justify-center p-2 shadow-sm shrink-0 border border-slate-800`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Green Growth Trend */}
          <path
            d="M14 44L26 34L36 40L50 22"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42 22H50V30"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Blue Car Body */}
          <path
            d="M12 46C12 43.8 13.8 42 16 42H48C50.2 42 52 43.8 52 46V49H12V46Z"
            fill="#3B82F6"
          />
          <path d="M19 42L24.5 32H39.5L45 42H19Z" fill="#60A5FA" />
          <circle cx="21" cy="50" r="4.5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="43" cy="50" r="4.5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="21" cy="50" r="1.5" fill="#60A5FA" />
          <circle cx="43" cy="50" r="1.5" fill="#60A5FA" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="leading-tight">
        <div className={`${titleSize} tracking-tight text-slate-900 flex items-center gap-1.5`}>
          <span>AutoFin</span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
            BTP
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 font-medium tracking-normal block mt-0.5">
            Calcolatore Costo Reale Auto
          </span>
        )}
      </div>
    </div>
  );
};

