import React from 'react';
import { Award, Scale, Info } from 'lucide-react';
import { FullCalculationOutput } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';

export interface VerdictBannerProps {
  calc: FullCalculationOutput;
  onToggleOpportunityCost: () => void;
  isSimpleMode?: boolean;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  calc,
  onToggleOpportunityCost,
  isSimpleMode = true,
}) => {
  const { verdict, inputs, horizonMonths } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  return (
    <section
      aria-label="Verdetto di convenienza economica"
      className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left column: Direct Winner Statement */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold tracking-wide uppercase text-[10px]">
              Verdetto Matematico
            </span>
            <span>Orizzonte di analisi: {horizonMonths} mesi</span>

            {!isSimpleMode && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={onToggleOpportunityCost}
                  className="text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
                >
                  {inputs.includeOpportunityCost
                    ? `Costo Opportunità ${instrumentName}: Attivo`
                    : `Costo Opportunità: Disattivato`}
                </button>
              </>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Scelta più conveniente:{' '}
              <span className="text-emerald-700 font-extrabold">
                {verdict.winnerLabel}
              </span>
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {verdict.explanation}
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600">
            <span>
              Vantaggio su {verdict.runnerUpLabel}:{' '}
              <strong className="font-bold text-emerald-700 tabular-nums">
                +{formatEuro(verdict.savingsVsRunnerUp)}
              </strong>
            </span>
            <span>
              Risparmio su opzione più onerosa:{' '}
              <strong className="font-semibold text-slate-800 tabular-nums">
                +{formatEuro(verdict.savingsVsWorst)}
              </strong>
            </span>
          </div>
        </div>

        {/* Right column: 2 Key Financial Metrics */}
        <div className={`grid grid-cols-1 ${isSimpleMode ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} lg:w-[360px] shrink-0 gap-3`}>
          {/* Risparmio Netto Box */}
          <div className="rounded-lg border border-emerald-300 bg-emerald-50/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-900">
              <span>Risparmio Netto</span>
              <Award className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
                +{formatEuro(verdict.savingsVsRunnerUp)}
              </div>
              <div className="text-xs text-emerald-900 mt-0.5 tabular-nums font-medium">
                fino a +{formatEuro(verdict.savingsVsWorst)} sul caso peggiore
              </div>
            </div>
            <div className="text-[11px] text-emerald-800 leading-tight">
              Differenziale su {verdict.runnerUpLabel}
            </div>
          </div>

          {/* Break-even TAEG Box (Avanzato) */}
          {!isSimpleMode && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>TAEG di Pareggio</span>
                <Scale className="w-4 h-4 text-slate-500" />
              </div>
              <div className="my-1.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  {formatPercent(verdict.breakEvenTaeg)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  Soglia Break-Even
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-tight">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Sotto questo tasso il finanziamento batte i contanti.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
