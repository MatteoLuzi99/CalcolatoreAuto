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
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const titleSize = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-extrabold',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Monogram */}
      <div
        className={`${iconSize} rounded bg-slate-950 text-white flex items-center justify-center shrink-0 font-bold tracking-tighter text-xs`}
        aria-hidden="true"
      >
        <span className="font-bold text-white text-xs tracking-tight">AF</span>
      </div>

      {/* Brand Wordmark */}
      <div className="leading-tight">
        <div className={`${titleSize} tracking-tight text-slate-950 flex items-center gap-1.5`}>
          <span>AutoFin</span>
          <span className="text-slate-400 font-light">/</span>
          <span className="text-slate-900 font-semibold">BTP</span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 font-normal tracking-tight block mt-0.5">
            Calcolo Matematico Costo Reale Auto
          </span>
        )}
      </div>
    </div>
  );
};
