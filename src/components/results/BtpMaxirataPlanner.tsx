import React from 'react';
import {
  PiggyBank,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Coins,
  ArrowRight,
} from 'lucide-react';
import {
  CalculatorInputs,
  FullCalculationOutput,
  TaxRegime,
} from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';
import { NumericInput } from '../common/NumericInput';

export interface BtpMaxirataPlannerProps {
  calc: FullCalculationOutput;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
}

const TAX_REGIME_OPTIONS: { value: TaxRegime; label: string; shortTag: string }[] = [
  {
    value: 'btp_12_5',
    label: 'BTP / Titoli di Stato (Tassazione 12,5%)',
    shortTag: 'Tassazione agevolata 12,5%',
  },
  {
    value: 'deposito_26',
    label: 'Conto Deposito / Obblig. Corp. (26%)',
    shortTag: 'Ritenuta standard 26%',
  },
  {
    value: 'net_0',
    label: 'Tasso già Netto (0%)',
    shortTag: 'Rendimento netto diretto',
  },
];

export const BtpMaxirataPlanner: React.FC<BtpMaxirataPlannerProps> = ({
  calc,
  onUpdateInputs,
}) => {
  const { inputs, maxirata, netAnnualBtpYield } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';
  const { btpAccumulator, refinanceScenario } = maxirata;

  const principalSharePercent = Math.max(
    0,
    Math.min(100, 100 - btpAccumulator.interestCoveragePercent)
  );
  const interestSharePercent = Math.max(
    0,
    Math.min(100, btpAccumulator.interestCoveragePercent)
  );

  const monthlySavingThanksToBtp = Math.max(
    0,
    btpAccumulator.monthlySavingsZeroYield - btpAccumulator.monthlySavingsRequired
  );

  const maxInitialSlider = Math.max(1000, Math.round(maxirata.maxirataAmount));

  return (
    <section
      aria-label={`Pianificatore Salvadanaio ${instrumentName} per la Maxirata`}
      className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-6 space-y-6"
    >
      {/* Top Header & Tax Regime Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Strategia Anti-Stangata VFG
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Obiettivo: {formatEuro(maxirata.maxirataAmount)} al mese {maxirata.months}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Pianificatore Salvadanaio {instrumentName} per la Maxirata
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Accantona ogni mese la quota necessaria in {instrumentName} per arrivare al{' '}
              <strong>mese {maxirata.months}</strong> con i{' '}
              <strong className="text-slate-900 tabular-nums">
                {formatEuro(maxirata.maxirataAmount)}
              </strong>{' '}
              pronti sul conto e farti pagare parte del riscatto dagli interessi.
            </p>
          </div>
        </div>

        {/* Tax Regime Selector */}
        <div className="flex flex-col sm:items-end shrink-0">
          <label
            htmlFor="btp-tax-regime-select"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
          >
            Strumento &amp; Tassazione Rendimento
          </label>
          <select
            id="btp-tax-regime-select"
            value={inputs.taxRegime}
            onChange={(e) =>
              onUpdateInputs({ taxRegime: e.target.value as TaxRegime })
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {TAX_REGIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EDUCATIONAL CALLOUT: Rata Concessionaria vs Quota BTP A Parte */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-300/80 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            💡
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            Spiegazione Chiara: Quanti soldi paghi al concessionario vs Quanti ne investi A PARTE?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/90 rounded-xl p-3.5 border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider mb-1">
                A) Rata Pagata alla Finanziaria
              </span>
              <div className="text-xl font-extrabold text-amber-800 tabular-nums">
                {formatEuro(maxirata.monthlyFinancingPaymentWithFees, 2)}
                <span className="text-xs font-normal text-slate-600">/mese</span>
              </div>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              &Egrave; l&apos;addebito RID mensile della concessionaria (rata da preventivo + spese incasso).
              Serve a pagare l&apos;uso dell&apos;auto e gli interessi sul capitale.
            </p>
          </div>

          <div className="bg-white/90 rounded-xl p-3.5 border border-emerald-300 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-emerald-900 block text-xs uppercase tracking-wider mb-1">
                B) Quota da Investire TU A PARTE
              </span>
              <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
                {formatEuro(btpAccumulator.monthlySavingsRequired, 2)}
                <span className="text-xs font-normal text-slate-600">/mese</span>
              </div>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              <strong>NON va alla concessionaria!</strong> Resta sul TUO conto personale.
              Acquisti {instrumentName} con rendimento del{' '}
              <strong className="text-emerald-800">{formatPercent(netAnnualBtpYield, 2)} netto</strong>.
            </p>
          </div>

          <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">
                C) Il Tuo Obiettivo al Mese {maxirata.months}
              </span>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                {formatEuro(maxirata.maxirataAmount, 2)}
              </div>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              A scadenza, il salvadanaio avr&agrave; accumulato l&apos;intera Maxirata di cui ben{' '}
              <strong className="text-emerald-700">+{formatEuro(btpAccumulator.totalNetInterestEarned, 2)}</strong>{' '}
              generati dagli interessi dello strumento! Liquidando la maxirata in contanti eviti la stangata del rifinanziamento.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Row: Gross Yield & Initial Capital */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 rounded-2xl border border-slate-200/70 p-5">
        {/* Control 1: Rendimento Annuo Lordo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <label
                htmlFor="planner-btp-yield-input"
                className="text-xs font-bold text-slate-800 block"
              >
                Rendimento Annuo Lordo {instrumentName}
              </label>
              <span className="text-[11px] text-slate-500">
                Netto effettivo:{' '}
                <strong className="text-emerald-700 tabular-nums">
                  {formatPercent(netAnnualBtpYield)} annuo
                </strong>
              </span>
            </div>
            <NumericInput
              id="planner-btp-yield-input"
              value={inputs.btpGrossYield}
              min={0}
              max={20}
              step={0.05}
              decimals={2}
              suffix="%"
              onChange={(val) => onUpdateInputs({ btpGrossYield: val })}
              className="w-28"
              inputClassName="text-xs text-emerald-800 border-emerald-300 bg-white"
            />
          </div>
          <input
            id="planner-btp-yield"
            type="range"
            min={0}
            max={7}
            step={0.1}
            value={Math.min(7, Math.max(0, inputs.btpGrossYield))}
            onChange={(e) =>
              onUpdateInputs({ btpGrossYield: parseFloat(e.target.value) })
            }
            className="w-full fintech-slider slider-emerald"
          />
          <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
            <span>0,0% (Infruttifero)</span>
            <span>{instrumentName}</span>
            <span>7,0%</span>
          </div>
        </div>

        {/* Control 2: Capitale Iniziale già nel Salvadanaio al Mese 0 */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label
                htmlFor="planner-btp-initial-input"
                className="text-xs font-bold text-slate-800 block"
              >
                Capitale già nel Salvadanaio {instrumentName} al Mese 0
              </label>
              <span className="text-[11px] text-slate-500">
                Diventa{' '}
                <strong className="text-emerald-700 tabular-nums">
                  {formatEuro(btpAccumulator.initialCapitalFutureValue)}
                </strong>{' '}
                a scadenza
              </span>
            </div>
            <NumericInput
              id="planner-btp-initial-input"
              value={inputs.btpInitialCapital}
              min={0}
              max={maxInitialSlider}
              step={100}
              decimals={0}
              suffix="€"
              onChange={(val) => onUpdateInputs({ btpInitialCapital: val })}
              className="w-full sm:w-32"
              inputClassName="text-xs bg-white"
            />
          </div>
          <input
            id="planner-btp-initial"
            type="range"
            min={0}
            max={maxInitialSlider}
            step={500}
            value={Math.min(maxInitialSlider, inputs.btpInitialCapital)}
            onChange={(e) =>
              onUpdateInputs({ btpInitialCapital: parseInt(e.target.value, 10) })
            }
            className="w-full fintech-slider slider-emerald"
          />
          <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
            <span>0 € (Partenza da zero)</span>
            <span className="hidden sm:inline">{formatEuro(Math.round(maxInitialSlider / 2))}</span>
            <span>{formatEuro(maxInitialSlider)} (100% coperto)</span>
          </div>
        </div>
      </div>

      {/* 3 Internal KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* KPI 1: Quota Mensile da Investire */}
        <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span>1. Quota Mensile PAC {instrumentName}</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
                {formatEuro(btpAccumulator.monthlySavingsRequired, 2)}
              </span>
              <span className="text-xs font-semibold text-emerald-800">/mese</span>
            </div>

            <div className="mt-2 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between tabular-nums">
                <span>Quota a tasso 0% (materasso):</span>
                <span className="line-through text-slate-400">
                  {formatEuro(btpAccumulator.monthlySavingsZeroYield, 2)}/m
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold tabular-nums">
                <span>Risparmio mensile grazie a {instrumentName}:</span>
                <span>- {formatEuro(monthlySavingThanksToBtp, 2)}/mese</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/70">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Impegno Mensile Totale Reale
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-slate-900 tabular-nums">
              <span>
                {formatEuro(maxirata.monthlyInstallmentTotal, 0)} (Rata) +{' '}
                {formatEuro(btpAccumulator.monthlySavingsRequired, 0)} ({instrumentName})
              </span>
              <span className="text-sm text-amber-700 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" />
                {formatEuro(maxirata.realMonthlyCommitmentWithBtp, 0)}/m
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Capitale Versato vs Guadagno Netto */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>2. Capitale vs Interessi {instrumentName}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
                <div className="text-[11px] text-slate-500">Versato di tasca</div>
                <div className="text-base font-extrabold text-slate-900 tabular-nums mt-0.5">
                  {formatEuro(btpAccumulator.totalPrincipalDeposited)}
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 border border-emerald-200/70">
                <div className="text-[11px] text-emerald-800">Regalato da {instrumentName}</div>
                <div className="text-base font-extrabold text-emerald-600 tabular-nums mt-0.5">
                  + {formatEuro(btpAccumulator.totalNetInterestEarned)}
                </div>
              </div>
            </div>

            {/* Two-color progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold tabular-nums">
                <span className="text-slate-600">
                  Tuo Capitale: {formatPercent(principalSharePercent, 1)}
                </span>
                <span className="text-emerald-600">
                  Pagato da {instrumentName}: {formatPercent(interestSharePercent, 1)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/60">
                <div
                  style={{ width: `${principalSharePercent}%` }}
                  className="bg-slate-700 h-full transition-all duration-300"
                  title="Capitale versato"
                />
                <div
                  style={{ width: `${interestSharePercent}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Interessi netti ${instrumentName}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Totale pronto al mese {maxirata.months}:</span>
            <span className="font-extrabold text-slate-900 tabular-nums">
              {formatEuro(maxirata.maxirataAmount)} (100%)
            </span>
          </div>
        </div>

        {/* KPI 3: Confronto con la "Trappola del Rifinanziamento" */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-800">
              <span>3. Trappola Rifinanziamento</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>

            <p className="mt-1.5 text-[11px] text-rose-900/80 leading-snug">
              Se NON usi il Salvadanaio {instrumentName} e a scadenza rifinanzi i{' '}
              <strong className="tabular-nums">{formatEuro(maxirata.maxirataAmount)}</strong>:
            </p>

            {/* Mini-sliders + NumericInputs for Refinancing */}
            <div className="mt-3 space-y-2.5 bg-white/90 rounded-lg p-3 border border-rose-200/70">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] gap-2">
                  <label
                    htmlFor="refi-months-input"
                    className="font-semibold text-slate-700"
                  >
                    Durata 2° Prestito:
                  </label>
                  <NumericInput
                    id="refi-months-input"
                    value={inputs.refinanceMonths}
                    min={6}
                    max={96}
                    step={1}
                    decimals={0}
                    suffix="m"
                    onChange={(val) =>
                      onUpdateInputs({ refinanceMonths: Math.max(1, Math.round(val)) })
                    }
                    className="w-20"
                    inputClassName="text-xs text-rose-700 border-rose-200"
                  />
                </div>
                <input
                  type="range"
                  min={12}
                  max={60}
                  step={6}
                  value={Math.min(60, Math.max(12, inputs.refinanceMonths))}
                  onChange={(e) =>
                    onUpdateInputs({ refinanceMonths: parseInt(e.target.value, 10) })
                  }
                  className="w-full fintech-slider"
                  aria-label="Durata rifinanziamento maxirata in mesi"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] gap-2">
                  <label
                    htmlFor="refi-taeg-input"
                    className="font-semibold text-slate-700"
                  >
                    TAEG Rifinanziamento:
                  </label>
                  <NumericInput
                    id="refi-taeg-input"
                    value={inputs.refinanceTaeg}
                    min={0}
                    max={30}
                    step={0.1}
                    decimals={2}
                    suffix="%"
                    onChange={(val) => onUpdateInputs({ refinanceTaeg: val })}
                    className="w-20"
                    inputClassName="text-xs text-rose-700 border-rose-200"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.25}
                  value={Math.min(15, Math.max(0, inputs.refinanceTaeg))}
                  onChange={(e) =>
                    onUpdateInputs({ refinanceTaeg: parseFloat(e.target.value) })
                  }
                  className="w-full fintech-slider"
                  aria-label="TAEG rifinanziamento maxirata"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-200/80 space-y-1 text-xs tabular-nums">
            <div className="flex justify-between text-slate-700">
              <span>Nuova rata 2° periodo ({inputs.refinanceMonths}m):</span>
              <span className="font-bold text-slate-900">
                {formatEuro(refinanceScenario.monthlyInstallment2ndPeriod, 2)}/mese
              </span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Ulteriori interessi 2° prestito:</span>
              <span className="font-semibold">
                + {formatEuro(refinanceScenario.extraInterest2ndPeriod)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-rose-800 font-extrabold">
              <span>Perdita vs Salvadanaio {instrumentName}:</span>
              <span className="text-sm px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                + {formatEuro(refinanceScenario.extraCostVsBtpAccumulator)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
