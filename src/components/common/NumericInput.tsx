import React, { useEffect, useState } from 'react';

export interface NumericInputProps {
  id?: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
}

/**
 * Campo di input numerico fluido per l'inserimento manuale da tastiera.
 * - Architettura Flex side-by-side: il suffisso (unità di misura) e il testo non possono mai sovrapporsi.
 * - Permette di cancellare tutto il testo e digitare liberamente senza blocchi o auto-clamp durante la digitazione.
 * - Supporta sia il punto (.) sia la virgola (,) per i decimali.
 * - Applica il clamp [min, max] solo quando si esce dal campo (onBlur) o si preme Invio.
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 1000000,
  step = 1,
  decimals,
  suffix,
  prefix,
  placeholder,
  ariaLabel,
  className = '',
  inputClassName = '',
}) => {
  const formatVal = (v: number): string => {
    if (!Number.isFinite(v)) return '0';
    if (decimals !== undefined) {
      return Number(v.toFixed(decimals)).toString();
    }
    return Number(v.toFixed(2)).toString();
  };

  const [draft, setDraft] = useState<string>(() => formatVal(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraft(formatVal(value));
    }
  }, [value, isFocused, decimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft(raw);

    const normalized = raw.replace(',', '.').trim();
    if (normalized === '' || normalized === '-' || normalized.endsWith('.')) {
      return;
    }

    const parsed = Number(normalized);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      // Aggiorna subito il calcolo live ma senza forzare il clamp di min durante la digitazione
      const softClamped = Math.min(max, Math.max(0, parsed));
      onChange(softClamped);
    }
  };

  const commitValue = () => {
    setIsFocused(false);
    const normalized = draft.replace(',', '.').trim();
    const parsed = Number(normalized);
    if (normalized === '' || Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      const fallback = Math.min(max, Math.max(min, value));
      onChange(fallback);
      setDraft(formatVal(fallback));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
    setDraft(formatVal(clamped));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-300 hover:border-slate-400 bg-white shadow-2xs transition-all focus-within:ring-2 focus-within:ring-blue-500/25 focus-within:border-blue-600 ${className} ${inputClassName}`}
    >
      {prefix && (
        <span className="pointer-events-none pl-2 text-xs font-bold text-slate-400 select-none shrink-0">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        aria-label={ariaLabel}
        step={step}
        value={draft}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.select();
        }}
        onChange={handleChange}
        onBlur={commitValue}
        onKeyDown={handleKeyDown}
        className="w-full min-w-0 bg-transparent px-2 py-1 text-right font-extrabold text-slate-900 tabular-nums focus:outline-none"
      />
      {suffix && (
        <span className="pointer-events-none pr-2 pl-0.5 text-xs font-bold text-slate-500 select-none shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
};
