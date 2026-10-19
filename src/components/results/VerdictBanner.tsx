import React from 'react';
import { Award, Scale, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { FullCalculationOutput } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';

export interface VerdictBannerProps {
  calc: FullCalculationOutput;
  onToggleOpportunityCost: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  calc,
  onToggleOpportunityCost,
}) => {
  const { verdict, inputs, horizonMonths, netAnnualBtpYield } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  const badgeStyleByWinner = {
    cash: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    standard: 'bg-blue-50 text-blue-800 border-blue-200',
    maxirata: 'bg-amber-50 text-amber-800 border-amber-200',
    maxirata_no_btp: 'bg-purple-50 text-purple-800 border-purple-200',
  }[verdict.winner] || 'bg-slate-50 text-slate-800 border-slate-200';

  return (
    <section
      aria-label="Verdetto di convenienza finanziaria"
      className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left column: Winner & Explanation */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              <Award className="w-3.5 h-3.5" />
              Verdetto Matematico
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeStyleByWinner}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Orizzonte {horizonMonths} mesi • Rendimento netto {instrumentName} {formatPercent(netAnnualBtpYield)}
            </span>

            <button
              type="button"
              onClick={onToggleOpportunityCost}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                inputs.includeOpportunityCost
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title={`Attiva o disattiva il rendimento ${instrumentName} sulla liquidità non spesa subito`}
            >
              <Sparkles className="w-3 h-3" />
              {inputs.includeOpportunityCost
                ? `Costo Opportunità ${instrumentName}: Incluso`
                : `Costo Opportunità ${instrumentName}: Escluso (Solo Esborso Vivo)`}
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              La scelta più conveniente è:{' '}
              <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-4">
                {verdict.winnerLabel}
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {verdict.explanation}
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>
              Vantaggio su 2ª classificata ({verdict.runnerUpLabel}):{' '}
              <strong className="font-semibold text-slate-700 tabular-nums">
                +{formatEuro(verdict.savingsVsRunnerUp)}
              </strong>
            </span>
            <span>
              Vantaggio sull&apos;opzione più costosa:{' '}
              <strong className="font-semibold text-slate-700 tabular-nums">
                +{formatEuro(verdict.savingsVsWorst)}
              </strong>
            </span>
          </div>
        </div>

        {/* Right column: 2 Key KPI Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-[420px] shrink-0 gap-3.5">
          {/* KPI 1: Risparmio Netto */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span>Risparmio Netto</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums tracking-tight">
                + {formatEuro(verdict.savingsVsRunnerUp)}
              </div>
              <div className="text-xs text-emerald-700/90 mt-0.5 tabular-nums">
                fino a +{formatEuro(verdict.savingsVsWorst)} vs peggiore
              </div>
            </div>
            <div className="text-[11px] text-emerald-800/80 leading-tight">
              Rispetto a {verdict.runnerUpLabel}
            </div>
          </div>

          {/* KPI 2: TAEG Max di Pareggio */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
              <span>TAEG Max Pareggio</span>
              <Scale className="w-4 h-4 text-blue-600" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                {formatPercent(verdict.breakEvenTaeg)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Soglia matematica Break-Even
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-tight">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Sotto questo TAEG il finanziamento batte i contanti grazie a sconto promo e {instrumentName}.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
