import React from 'react';
import { Award, Scale } from 'lucide-react';
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
      className="bg-white rounded-lg border border-slate-200 px-5 py-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Direct Winner Statement */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900 text-xs">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              Verdetto analitico ({horizonMonths} mesi)
            </span>
            <span>•</span>
            <span>{verdict.explanation}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-sm text-slate-500 font-medium">Scelta più conveniente:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              {verdict.winnerLabel}
            </span>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
              +{formatEuro(verdict.savingsVsRunnerUp)} rispetto a {verdict.runnerUpLabel}
            </span>
          </div>
        </div>

        {/* Right: Key Delta Figures */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-5 shrink-0">
          <div>
            <div className="text-[11px] text-slate-500 font-normal">Risparmio sul caso peggiore</div>
            <div className="text-base font-bold text-slate-900 tabular-nums">
              +{formatEuro(verdict.savingsVsWorst)}
            </div>
          </div>

          {!isSimpleMode && (
            <div>
              <div className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
                <span>Break-Even TAEG</span>
                <Scale className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-base font-bold text-slate-900 tabular-nums">
                {formatPercent(verdict.breakEvenTaeg)}
              </div>
            </div>
          )}

          {!isSimpleMode && (
            <button
              type="button"
              onClick={onToggleOpportunityCost}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer transition-colors"
            >
              {inputs.includeOpportunityCost ? `Costo Opp. ${instrumentName}: Attivo` : 'Costo Opp.: Inattivo'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
