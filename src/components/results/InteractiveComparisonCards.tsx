import React, { useState } from 'react';
import {
  Banknote,
  Landmark,
  PiggyBank,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Car,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  CalculatorInputs,
  FullCalculationOutput,
  WinnerOptionId,
} from '../../types/calculator';
import { formatEuro } from '../../lib/storage';
import { NumericInput } from '../common/NumericInput';

export interface InteractiveComparisonCardsProps {
  calc: FullCalculationOutput;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  isSimpleMode?: boolean;
}

const STANDARD_MONTH_PRESETS = [36, 48, 60, 72, 84];
const REFINANCE_MONTH_PRESETS = [24, 36, 48, 60];
const MAXIRATA_1ST_PERIOD_PRESETS = [24, 36, 48, 60];
const MAXIRATA_PERCENT_PRESETS = [40, 50, 55, 60];
const MAXIRATA_TAN_PRESETS = [0.0, 3.99, 5.99, 7.99];

export const InteractiveComparisonCards: React.FC<InteractiveComparisonCardsProps> = ({
  calc,
  onUpdateInputs,
  isSimpleMode = false,
}) => {
  const { inputs, cash, standard, maxirataNoBtp, maxirata, verdict } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  const [mobileActiveTab, setMobileActiveTab] = useState<WinnerOptionId>('maxirata');
  const [mobileShowAll, setMobileShowAll] = useState(false);

  const [openDetails, setOpenDetails] = useState<Record<WinnerOptionId, boolean>>({
    cash: false,
    standard: false,
    maxirata_no_btp: false,
    maxirata: false,
  });

  const toggleDetails = (id: WinnerOptionId) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCardStyle = (id: WinnerOptionId) => {
    const isWinner = verdict.winner === id;
    const isVisible = mobileShowAll || mobileActiveTab === id;
    return `rounded-xl bg-white p-5 sm:p-6 flex-col justify-between transition-colors ${
      isVisible ? 'flex' : 'hidden xl:flex'
    } ${
      isWinner
        ? 'border-2 border-emerald-600 ring-1 ring-emerald-600'
        : 'border border-slate-200'
    }`;
  };

  return (
    <section aria-label="Confronto interattivo delle 4 opzioni di acquisto">
      {/* Mobile / Tablet Segmented Switcher */}
      <div className="xl:hidden mb-4 bg-slate-100 p-1 rounded-xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'cash' as WinnerOptionId, label: 'Contanti' },
          { id: 'standard' as WinnerOptionId, label: 'Standard' },
          { id: 'maxirata_no_btp' as WinnerOptionId, label: 'Maxirata Sola' },
          { id: 'maxirata' as WinnerOptionId, label: `Maxirata + ${instrumentName}` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setMobileActiveTab(tab.id);
              setMobileShowAll(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex-1 text-center ${
              !mobileShowAll && mobileActiveTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {verdict.winner === tab.id && ' (Consigliata)'}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMobileShowAll((prev) => !prev)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            mobileShowAll ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {mobileShowAll ? 'Singola' : 'Tutte'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {/* ================================================================= */}
        {/* CARD 1: ACQUISTO IN CONTANTI                                      */}
        {/* ================================================================= */}
        <article className={getCardStyle('cash')}>
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Opzione 1 • Zero Debiti
                  </span>
                  {verdict.winner === 'cash' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Vincente
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Acquisto in Contanti
                </h3>
              </div>
              <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
            </div>

            {/* Hero Number */}
            <div className="py-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Esborso Immediato
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  {formatEuro(cash.upfrontPayment)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {cash.tradeInValue > 0 && (
                  <span className="text-slate-500 tabular-nums">
                    Permuta: {formatEuro(cash.tradeInValue)}
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                  0 €/mese • Zero interessi
                </span>
              </div>
            </div>

            {/* Valore Residuo & Proprietà Veicolo */}
            <div className="py-3.5 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stato Proprietà &amp; Valore Veicolo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex justify-between">
                  <span>Proprietà auto:</span>
                  <span className="font-bold text-emerald-800">100% Subito Tua</span>
                </div>
                <div className="flex justify-between">
                  <span>Debito residuo a fine periodo:</span>
                  <span className="font-bold text-emerald-800">0 €</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-900">
                  <span>Valore residuo di mercato stimato:</span>
                  <span className="font-semibold tabular-nums">
                    {formatEuro(maxirata.maxirataAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Informational Callouts */}
            <div className="py-3 space-y-2">
              {cash.forgoneDiscount > 0 ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Sconto Finanziamento Perso</span>
                  </div>
                  <p className="text-amber-800 leading-snug">
                    Rinunci a{' '}
                    <span className="font-bold tabular-nums">
                      {formatEuro(cash.forgoneDiscount)}
                    </span>{' '}
                    di extra sconto promozionale riservato a chi finanzia.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-600 leading-snug">
                  Nessun extra sconto perso: il prezzo in contanti coincide col preventivo.
                </div>
              )}
            </div>
          </div>

          {/* Card Footer: Totals & Breakdown */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Esborso Vivo Totale:</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                {formatEuro(cash.totalOutOfPocket)}
              </span>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
                  Costo Reale Netto
                </div>
                <div className="text-[10px] text-slate-400">
                  {inputs.includeOpportunityCost ? 'Base riferimento' : 'Esborso vivo'}
                </div>
              </div>
              <div className="text-lg font-extrabold tabular-nums text-emerald-400">
                {formatEuro(cash.realNetCost)}
              </div>
            </div>

            {/* Expandable Cost Breakdown */}
            <button
              type="button"
              onClick={() => toggleDetails('cash')}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1 cursor-pointer transition-colors"
            >
              <span>Scomposizione costi</span>
              {openDetails.cash ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDetails.cash && (
              <div className="pt-2 space-y-1 text-xs border-t border-slate-100 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Prezzo listino contanti:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(inputs.carPriceCash, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Permuta usato:</span>
                  <span className="font-medium text-slate-900">
                    - {formatEuro(cash.tradeInValue, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-100">
                  <span>Bonifico concessionario:</span>
                  <span>{formatEuro(cash.upfrontPayment, 2)}</span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* ================================================================= */}
        {/* CARD 2: FINANZIAMENTO STANDARD (RATE COSTANTI)                    */}
        {/* ================================================================= */}
        <article className={getCardStyle('standard')}>
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                    Opzione 2 • Rate Costanti
                  </span>
                  {verdict.winner === 'standard' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Vincente
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Finanziamento Classico
                </h3>
              </div>
              <Landmark className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
            </div>

            {/* Hero Number */}
            <div className="py-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rata Mensile ({inputs.standardMonths} mesi)
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-blue-600 tabular-nums tracking-tight">
                  {formatEuro(standard.monthlyInstallmentTotal, 2)}
                </span>
                <span className="text-xs font-semibold text-slate-500">/mese</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-semibold tabular-nums">
                  + {formatEuro(standard.totalInterestAndFees)} interessi
                </span>
              </div>
            </div>

            {/* Valore Residuo & Proprietà Veicolo */}
            <div className="py-3.5 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Stato Proprietà &amp; Valore Veicolo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
                <div className="flex justify-between">
                  <span>Ammortamento debito:</span>
                  <span className="font-bold text-blue-800">Completo ({inputs.standardMonths}m)</span>
                </div>
                <div className="flex justify-between">
                  <span>Debito finale estinto:</span>
                  <span className="font-bold text-blue-800">0 €</span>
                </div>
              </div>
            </div>

            {/* Interactive Controls inside Card */}
            <div className="py-3.5 space-y-3">
              {/* TAEG (Avanzato) */}
              {!isSimpleMode && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <label htmlFor="card-std-taeg" className="font-semibold text-slate-700">
                      TAEG Finanziamento
                    </label>
                    <NumericInput
                      id="card-std-taeg"
                      value={inputs.standardTaeg}
                      min={0}
                      max={30}
                      step={0.05}
                      decimals={2}
                      suffix="%"
                      onChange={(val) => onUpdateInputs({ standardTaeg: val })}
                      className="w-24"
                      inputClassName="text-xs text-blue-700 border-blue-200 bg-blue-50/40"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.05}
                    value={inputs.standardTaeg}
                    onChange={(e) =>
                      onUpdateInputs({ standardTaeg: parseFloat(e.target.value) })
                    }
                    className="w-full fintech-slider"
                    aria-label="TAEG Finanziamento Standard"
                  />
                </div>
              )}

              {/* Durata in mesi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Durata Mesi</span>
                  <span className="font-bold text-blue-700 tabular-nums">
                    {inputs.standardMonths} mesi
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {STANDARD_MONTH_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onUpdateInputs({ standardMonths: m })}
                      className={`py-2 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer min-h-[38px] flex items-center justify-center ${
                        inputs.standardMonths === m
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Sconto Concessionario su Finanziamento Standard (Avanzato) */}
              {!isSimpleMode && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Sconto su questa opzione</span>
                    <div className="flex items-center gap-1.5">
                      {inputs.financingDiscount > 0 && (inputs.standardFinancingDiscount ?? 0) === 0 && (
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ standardFinancingDiscount: inputs.financingDiscount })}
                          className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                        >
                          Applica sconto promo
                        </button>
                      )}
                      {(inputs.standardFinancingDiscount ?? 0) > 0 && (
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ standardFinancingDiscount: 0 })}
                          className="text-[10px] text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                        >
                          Azzera (Prezzo listino)
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      {(inputs.standardFinancingDiscount ?? 0) > 0
                        ? `Prezzo: ${formatEuro(standard.carPricePromo)}`
                        : 'Prezzo pieno listino (no promo)'}
                    </span>
                    <NumericInput
                      id="card-std-discount"
                      value={inputs.standardFinancingDiscount ?? 0}
                      min={0}
                      max={inputs.carPriceCash}
                      step={50}
                      decimals={0}
                      suffix="€"
                      onChange={(val) => onUpdateInputs({ standardFinancingDiscount: val })}
                      className="w-24"
                      inputClassName="text-xs text-blue-800 border-blue-200 bg-white font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Footer: Totals & Breakdown */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Esborso Vivo Totale:</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                {formatEuro(standard.totalOutOfPocket)}
              </span>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
                  Costo Reale Netto
                </div>
                <div className="text-[10px] text-slate-400">
                  {inputs.includeOpportunityCost ? `Detratto rendimento ${instrumentName}` : 'Esborso vivo'}
                </div>
              </div>
              <div className="text-lg font-extrabold tabular-nums text-blue-400">
                {formatEuro(
                  inputs.includeOpportunityCost
                    ? standard.realNetCost
                    : standard.totalOutOfPocket
                )}
              </div>
            </div>

            {/* Expandable Cost Breakdown */}
            <button
              type="button"
              onClick={() => toggleDetails('standard')}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1 cursor-pointer transition-colors"
            >
              <span>Scomposizione costi</span>
              {openDetails.standard ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDetails.standard && (
              <div className="pt-2 space-y-1 text-xs border-t border-slate-100 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Prezzo listino base:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(inputs.carPriceCash, 2)}
                  </span>
                </div>
                {standard.appliedDiscount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Sconto applicato:</span>
                    <span>- {formatEuro(standard.appliedDiscount, 2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-slate-400">
                    <span>Sconto applicato:</span>
                    <span>0,00 € (nessuno)</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Prezzo auto finanziato:</span>
                  <span>{formatEuro(standard.carPricePromo, 2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Capitale Finanziato:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(standard.financedPrincipal, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Totale Interessi Puri:</span>
                  <span className="font-medium">
                    + {formatEuro(standard.totalPureInterest, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Spese Accessorie:</span>
                  <span className="font-medium">
                    + {formatEuro(standard.totalAccessoryFees, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* ================================================================= */}
        {/* CARD 3: MAXIRATA SENZA BTP (CON SPUNTA RIFINANZIO VS SENZA)       */}
        {/* ================================================================= */}
        <article className={getCardStyle('maxirata_no_btp')}>
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Opzione 3 • Formula Balloon
                  </span>
                  {verdict.winner === 'maxirata_no_btp' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Vincente
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Maxirata Senza {instrumentName}
                </h3>
              </div>
              <Car className="w-5 h-5 text-slate-600 shrink-0 mt-1" />
            </div>

            {/* TOGGLE: Rifinanzio la Maxirata vs Senza Rifinanziamento (Saldo Cash) */}
            <div className="pt-3">
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateInputs({ maxirataNoBtpMode: 'refinance' })}
                  className={`flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    inputs.maxirataNoBtpMode !== 'pay_cash'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Rifinanzio Maxirata
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateInputs({ maxirataNoBtpMode: 'pay_cash' })}
                  className={`flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    inputs.maxirataNoBtpMode === 'pay_cash'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Senza Rifinanziamento
                </button>
              </div>
            </div>

            {/* Hero Number */}
            <div className="py-4 border-b border-slate-100">
              {inputs.maxirataNoBtpMode === 'pay_cash' ? (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rata 1° Periodo ({maxirataNoBtp.interimInstallmentsCount} rate)
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                      {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">/mese</span>
                  </div>
                  <div className="pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-xs tabular-nums">
                      + Saldo finale in contanti: {formatEuro(maxirataNoBtp.maxirataAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 uppercase tracking-wider">
                      Rate 1° Periodo (1°-35°)
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums text-sm">
                      {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)}/m
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="font-bold text-rose-800">
                      Rata 2° Periodo ({inputs.refinanceMonths}m):
                    </span>
                    <span className="font-extrabold text-rose-700 tabular-nums text-sm">
                      {formatEuro(maxirataNoBtp.monthlyInstallment2ndPeriod, 2)}/m
                    </span>
                  </div>
                  <span className="inline-block text-[11px] text-rose-700 font-semibold tabular-nums">
                    + {formatEuro(maxirataNoBtp.extraInterest2ndPeriod)} extra interessi rifinanziamento
                  </span>
                </div>
              )}
            </div>

            {/* Valore Residuo & Proprietà Veicolo */}
            <div className="py-3.5 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Stato Proprietà &amp; Valore Veicolo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 space-y-1">
                {inputs.maxirataNoBtpMode === 'pay_cash' ? (
                  <>
                    <div className="flex justify-between">
                      <span>Proprietà a fine periodo:</span>
                      <span className="font-bold text-slate-900">100% Tua (dopo saldo)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debito residuo dopo il saldo:</span>
                      <span className="font-bold text-slate-900">0 €</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-rose-800 font-bold">
                      <span>Proprietà al mese {inputs.maxirataMonths}:</span>
                      <span>Auto Non Tua (In Debito)</span>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>Debito residuo ancora aperto:</span>
                      <span className="font-extrabold tabular-nums">
                        {formatEuro(maxirataNoBtp.maxirataAmount)}
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-800/90 pt-1 border-t border-rose-200/60 leading-snug">
                      Poiché rifinanzi, al termine dei {inputs.maxirataMonths} mesi il tuo patrimonio netto
                      nell&apos;auto è 0 €: devi ancora pagare l&apos;intero valore residuo!
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* CONTROLLI AVANZATI 1° PERIODO (Solo Modalità Avanzata) */}
            {!isSimpleMode && (
              <>
                {/* CONTROLLO VALORE MAXIRATA FINALE / VFG */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">Maxirata Finale (VFG):</span>
                    <NumericInput
                      id="card-maxirata-amount"
                      value={maxirataNoBtp.maxirataAmount}
                      min={0}
                      max={inputs.carPriceCash * 1.5}
                      step={50}
                      decimals={2}
                      suffix="€"
                      onChange={(val) => {
                        const newPercent =
                          inputs.carPriceCash > 0
                            ? Number(((val / inputs.carPriceCash) * 100).toFixed(2))
                            : inputs.maxirataPercent;
                        onUpdateInputs({
                          maxirataFixedAmount: val,
                          maxirataPercent: newPercent,
                          maxirataCustomMonthlyInstallment: undefined,
                        });
                      }}
                      className="w-28"
                      inputClassName="text-xs text-slate-900 border-slate-300 font-bold bg-white text-right"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">% listino:</span>
                      <div className="flex flex-wrap gap-1">
                        {MAXIRATA_PERCENT_PRESETS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              const newFixed = Number(((inputs.carPriceCash * (p / 100))).toFixed(2));
                              onUpdateInputs({
                                maxirataPercent: p,
                                maxirataFixedAmount: newFixed,
                                maxirataCustomMonthlyInstallment: undefined,
                              });
                            }}
                            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[30px] ${
                              Math.abs(maxirataNoBtp.maxirataPercent - p) < 0.6
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-20">
                      <NumericInput
                        id="card-maxirata-percent"
                        value={maxirataNoBtp.maxirataPercent}
                        min={10}
                        max={85}
                        step={0.5}
                        decimals={1}
                        suffix="%"
                        onChange={(val) => {
                          const newFixed = Number(((inputs.carPriceCash * (val / 100))).toFixed(2));
                          onUpdateInputs({
                            maxirataPercent: val,
                            maxirataFixedAmount: newFixed,
                            maxirataCustomMonthlyInstallment: undefined,
                          });
                        }}
                        inputClassName="text-xs text-slate-900 border-slate-300 font-bold bg-white text-right"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min={20}
                    max={75}
                    step={0.5}
                    value={Math.min(75, Math.max(20, maxirataNoBtp.maxirataPercent))}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value);
                      const newFixed = Number(((inputs.carPriceCash * (p / 100))).toFixed(2));
                      onUpdateInputs({
                        maxirataPercent: p,
                        maxirataFixedAmount: newFixed,
                        maxirataCustomMonthlyInstallment: undefined,
                      });
                    }}
                    className="w-full fintech-slider"
                    aria-label="Slider Percentuale Maxirata"
                  />
                </div>

                {/* CONTROLLO DURATA 1° PERIODO MAXIRATA & SELETTORE 35/36 RATE */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Durata 1° Periodo:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {inputs.maxirataMonths} mesi ({inputs.maxirataInterimCount || inputs.maxirataMonths} rate)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {MAXIRATA_1ST_PERIOD_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          onUpdateInputs({
                            maxirataMonths: m,
                            maxirataInterimCount: m === 36 && inputs.maxirataInterimCount === 35 ? 35 : m,
                            maxirataCustomMonthlyInstallment: undefined,
                          })
                        }
                        className={`py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[34px] ${
                          inputs.maxirataMonths === m
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  {inputs.maxirataMonths === 36 && (
                    <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-200">
                      <span className="text-slate-600 font-medium">Numero rate interim:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataInterimCount: 35 })}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                            inputs.maxirataInterimCount === 35
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          35 rate (es. Škoda/VAG)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataInterimCount: 36 })}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                            inputs.maxirataInterimCount === 36
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          36 rate standard
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTROLLO TAN 1° PERIODO (Tasso Ammortamento Rata) */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">TAN Maxirata (Tasso Nominale):</span>
                    <NumericInput
                      id="card-maxirata-tan"
                      value={inputs.maxirataTan ?? 0}
                      min={0}
                      max={20}
                      step={0.1}
                      decimals={2}
                      suffix="%"
                      onChange={(val) => onUpdateInputs({ maxirataTan: val })}
                      className="w-24"
                      inputClassName="text-xs text-slate-900 border-slate-300 font-bold bg-white text-right"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-500 font-medium">Preset TAN:</span>
                    <div className="flex gap-1">
                      {MAXIRATA_TAN_PRESETS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataTan: t })}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            Math.abs((inputs.maxirataTan ?? 0) - t) < 0.05
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t.toFixed(t === 0 ? 0 : 2)}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.1}
                    value={inputs.maxirataTan ?? 0}
                    onChange={(e) => onUpdateInputs({ maxirataTan: parseFloat(e.target.value) })}
                    className="w-full fintech-slider"
                    aria-label="Slider TAN Finanziamento con Maxirata"
                  />
                </div>

                {/* CONTROLLO TAEG 1° PERIODO MAXIRATA */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 my-2 space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">TAEG Maxirata (1° Periodo):</span>
                    <NumericInput
                      id="card-maxirata-taeg"
                      value={inputs.maxirataTaeg}
                      min={0}
                      max={25}
                      step={0.05}
                      decimals={2}
                      suffix="%"
                      onChange={(val) => onUpdateInputs({ maxirataTaeg: val })}
                      className="w-24"
                      inputClassName="text-xs text-slate-900 border-slate-300 font-bold bg-white text-right"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.05}
                    value={inputs.maxirataTaeg}
                    onChange={(e) => onUpdateInputs({ maxirataTaeg: parseFloat(e.target.value) })}
                    className="w-full fintech-slider"
                    aria-label="TAEG Finanziamento con Maxirata"
                  />
                </div>

                {/* CONTROLLO DIRETTO RATA MENSILE PREVENTIVO */}
                <div className="py-2 px-3 bg-white rounded-lg border border-slate-200 my-2 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">Rata Mensile dal Preventivo:</span>
                    <span className="text-[10px] text-slate-400">
                      {inputs.maxirataCustomMonthlyInstallment
                        ? `Fissata a ${formatEuro(inputs.maxirataCustomMonthlyInstallment, 2)}`
                        : 'Calcolata da TAN (formula francese)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <NumericInput
                      id="card-maxirata-custom-inst"
                      value={inputs.maxirataCustomMonthlyInstallment || 0}
                      min={0}
                      max={5000}
                      step={1}
                      decimals={2}
                      suffix="€"
                      placeholder="Auto da TAN"
                      onChange={(val) =>
                        onUpdateInputs({
                          maxirataCustomMonthlyInstallment: val > 0 ? val : undefined,
                        })
                      }
                      className="w-24"
                      inputClassName="text-xs text-slate-900 border-slate-300 font-bold bg-white text-right"
                    />
                    {inputs.maxirataCustomMonthlyInstallment && (
                      <button
                        type="button"
                        onClick={() => onUpdateInputs({ maxirataCustomMonthlyInstallment: undefined })}
                        className="text-[10px] text-blue-700 underline font-semibold hover:text-blue-900 cursor-pointer"
                        title="Ripristina calcolo automatico della rata"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* CONTROLLI EDITABILI PER IL RIFINANZIAMENTO (quando refinance è attivo) */}
            {inputs.maxirataNoBtpMode !== 'pay_cash' && (
              <div className="py-3.5 space-y-3 bg-rose-50/60 p-3 rounded-lg border border-rose-200 my-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-950">
                  <span className="flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-rose-700" />
                    <span>Rifinanziamento 2° Periodo:</span>
                  </span>
                </div>

                {/* Durata Rifinanziamento */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Durata rateizzazione:</span>
                    <span className="font-bold text-rose-900">{inputs.refinanceMonths} mesi</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {REFINANCE_MONTH_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onUpdateInputs({ refinanceMonths: m })}
                        className={`py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          inputs.refinanceMonths === m
                            ? 'bg-rose-800 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAEG Rifinanziamento (Avanzato) */}
                {!isSimpleMode && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-slate-600">TAEG 2° periodo:</span>
                      <NumericInput
                        id="card-refi-taeg"
                        value={inputs.refinanceTaeg}
                        min={0}
                        max={25}
                        step={0.1}
                        decimals={2}
                        suffix="%"
                        onChange={(val) => onUpdateInputs({ refinanceTaeg: val })}
                        className="w-24"
                        inputClassName="text-xs text-rose-900 border-rose-300 font-bold bg-white"
                      />
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={16}
                      step={0.1}
                      value={inputs.refinanceTaeg}
                      onChange={(e) => onUpdateInputs({ refinanceTaeg: parseFloat(e.target.value) })}
                      className="w-full fintech-slider"
                      aria-label="TAEG del rifinanziamento maxirata"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Footer: Totals & Breakdown */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Esborso Vivo Totale:</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                {formatEuro(maxirataNoBtp.totalOutOfPocket)}
              </span>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
                  Costo Reale Netto
                </div>
                <div className="text-[10px] text-slate-400">
                  {inputs.maxirataNoBtpMode === 'pay_cash' ? 'Saldo unico' : 'Rifinanziamento incluso'}
                </div>
              </div>
              <div className="text-lg font-extrabold tabular-nums text-white">
                {formatEuro(
                  inputs.includeOpportunityCost
                    ? maxirataNoBtp.realNetCost
                    : maxirataNoBtp.totalOutOfPocket
                )}
              </div>
            </div>

            {/* Expandable Cost Breakdown */}
            <button
              type="button"
              onClick={() => toggleDetails('maxirata_no_btp')}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1 cursor-pointer transition-colors"
            >
              <span>Scomposizione costi</span>
              {openDetails.maxirata_no_btp ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDetails.maxirata_no_btp && (
              <div className="pt-2 space-y-1 text-xs border-t border-slate-100 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Totale Rate 1° Periodo:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(maxirataNoBtp.totalPaid1stPeriod, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Esborso 2° Periodo:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(maxirataNoBtp.totalPaid2ndPeriod, 2)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Totale Interessi &amp; Spese:</span>
                  <span className="font-medium">
                    + {formatEuro(maxirataNoBtp.totalInterestAndFees, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* ================================================================= */}
        {/* CARD 4: MAXIRATA + SALVADANAIO BTP (CON CONTROLLO INVESTIMENTO MESE)*/}
        {/* ================================================================= */}
        <article className={getCardStyle('maxirata')}>
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Opzione 4 • VFG + Salvadanaio
                  </span>
                  {verdict.winner === 'maxirata' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Vincente
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Maxirata + {instrumentName}
                </h3>
              </div>
              <PiggyBank className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
            </div>

            {/* Hero Number: Rata Auto vs Accantonamento Personale */}
            <div className="py-4 border-b border-slate-100 space-y-2.5">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rata Auto al Concessionario
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                    {formatEuro(maxirata.monthlyFinancingPaymentWithFees, 2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">/mese</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-amber-950 font-semibold">
                  <span>+ Salvadanaio {instrumentName}:</span>
                  <span className="tabular-nums font-bold text-amber-800">
                    +{formatEuro(maxirata.effectiveMonthlyBtpSavings, 2)}/m
                  </span>
                </div>
                <div className="text-[11px] text-amber-900/80 leading-tight">
                  Tuo capitale patrimoniale a scadenza (+ rendimenti netti maturati a tuo favore).
                </div>
              </div>
            </div>

            {/* Valore Residuo & Proprietà Veicolo */}
            <div className="py-3.5 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stato Proprietà &amp; Valore Veicolo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex justify-between">
                  <span>Proprietà al mese {inputs.maxirataMonths}:</span>
                  <span className="font-bold text-emerald-800">
                    {maxirata.gapAmount > 10 ? 'Proprietà Parziale (con Gap)' : `100% Tua (Fondo ${instrumentName})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Debito residuo pendente:</span>
                  <span className="font-bold text-emerald-800">
                    {maxirata.gapAmount > 10 ? formatEuro(maxirata.gapAmount) : '0 €'}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTROLLI AVANZATI 1° PERIODO (Solo Modalità Avanzata) */}
            {!isSimpleMode && (
              <>
                {/* CONTROLLO VALORE MAXIRATA FINALE / VFG */}
                <div className="py-2.5 px-3 bg-amber-50/50 rounded-xl border border-amber-200/60 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">Maxirata Finale (VFG):</span>
                    <NumericInput
                      id="card-maxirata-btp-amount"
                      value={maxirata.maxirataAmount}
                      min={0}
                      max={inputs.carPriceCash * 1.5}
                      step={50}
                      decimals={2}
                      suffix="€"
                      onChange={(val) => {
                        const newPercent =
                          inputs.carPriceCash > 0
                            ? Number(((val / inputs.carPriceCash) * 100).toFixed(2))
                            : inputs.maxirataPercent;
                        onUpdateInputs({
                          maxirataFixedAmount: val,
                          maxirataPercent: newPercent,
                          maxirataCustomMonthlyInstallment: undefined,
                        });
                      }}
                      className="w-28"
                      inputClassName="text-xs text-amber-900 border-amber-300 font-bold bg-white text-right"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">% listino:</span>
                      <div className="flex flex-wrap gap-1">
                        {MAXIRATA_PERCENT_PRESETS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              const newFixed = Number(((inputs.carPriceCash * (p / 100))).toFixed(2));
                              onUpdateInputs({
                                maxirataPercent: p,
                                maxirataFixedAmount: newFixed,
                                maxirataCustomMonthlyInstallment: undefined,
                              });
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[30px] ${
                              Math.abs(maxirata.maxirataPercent - p) < 0.6
                                ? 'bg-amber-700 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-20">
                      <NumericInput
                        id="card-maxirata-btp-percent"
                        value={maxirata.maxirataPercent}
                        min={10}
                        max={85}
                        step={0.5}
                        decimals={1}
                        suffix="%"
                        onChange={(val) => {
                          const newFixed = Number(((inputs.carPriceCash * (val / 100))).toFixed(2));
                          onUpdateInputs({
                            maxirataPercent: val,
                            maxirataFixedAmount: newFixed,
                            maxirataCustomMonthlyInstallment: undefined,
                          });
                        }}
                        inputClassName="text-xs text-amber-900 border-amber-300 font-bold bg-white text-right"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min={20}
                    max={75}
                    step={0.5}
                    value={Math.min(75, Math.max(20, maxirata.maxirataPercent))}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value);
                      const newFixed = Number(((inputs.carPriceCash * (p / 100))).toFixed(2));
                      onUpdateInputs({
                        maxirataPercent: p,
                        maxirataFixedAmount: newFixed,
                        maxirataCustomMonthlyInstallment: undefined,
                      });
                    }}
                    className="w-full fintech-slider slider-amber"
                    aria-label="Slider Percentuale Maxirata"
                  />
                </div>

                {/* CONTROLLO DURATA 1° PERIODO MAXIRATA & SELETTORE 35/36 RATE */}
                <div className="py-2.5 px-3 bg-amber-50/50 rounded-xl border border-amber-200/60 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Durata 1° Periodo:</span>
                    <span className="font-bold text-amber-900 tabular-nums">
                      {inputs.maxirataMonths} mesi ({inputs.maxirataInterimCount || inputs.maxirataMonths} rate)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {MAXIRATA_1ST_PERIOD_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          onUpdateInputs({
                            maxirataMonths: m,
                            maxirataInterimCount: m === 36 && inputs.maxirataInterimCount === 35 ? 35 : m,
                            maxirataCustomMonthlyInstallment: undefined,
                          })
                        }
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[34px] ${
                          inputs.maxirataMonths === m
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  {inputs.maxirataMonths === 36 && (
                    <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-amber-200/50">
                      <span className="text-slate-600 font-medium">Numero rate interim:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataInterimCount: 35 })}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                            inputs.maxirataInterimCount === 35
                              ? 'bg-amber-700 text-white'
                              : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          35 rate (es. Škoda/VAG)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataInterimCount: 36 })}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                            inputs.maxirataInterimCount === 36
                              ? 'bg-amber-700 text-white'
                              : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          36 rate standard
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTROLLO TAN 1° PERIODO (Tasso Ammortamento Rata) */}
                <div className="py-2.5 px-3 bg-amber-50/50 rounded-xl border border-amber-200/60 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">TAN Maxirata (Tasso Nominale):</span>
                    <NumericInput
                      id="card-maxirata-btp-tan"
                      value={inputs.maxirataTan ?? 0}
                      min={0}
                      max={20}
                      step={0.1}
                      decimals={2}
                      suffix="%"
                      onChange={(val) => onUpdateInputs({ maxirataTan: val })}
                      className="w-24"
                      inputClassName="text-xs text-amber-900 border-amber-300 font-bold bg-white text-right"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-500 font-medium">Preset TAN:</span>
                    <div className="flex gap-1">
                      {MAXIRATA_TAN_PRESETS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onUpdateInputs({ maxirataTan: t })}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            Math.abs((inputs.maxirataTan ?? 0) - t) < 0.05
                              ? 'bg-amber-700 text-white'
                              : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          {t.toFixed(t === 0 ? 0 : 2)}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.1}
                    value={inputs.maxirataTan ?? 0}
                    onChange={(e) => onUpdateInputs({ maxirataTan: parseFloat(e.target.value) })}
                    className="w-full fintech-slider slider-amber"
                    aria-label="Slider TAN Finanziamento con Maxirata"
                  />
                </div>

                {/* CONTROLLO TAEG MAXIRATA 1° PERIODO */}
                <div className="py-2.5 px-3 bg-amber-50/50 rounded-xl border border-amber-200/60 my-2 space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700">TAEG Finanziamento Maxirata:</span>
                    <NumericInput
                      id="card-maxirata-btp-taeg"
                      value={inputs.maxirataTaeg}
                      min={0}
                      max={25}
                      step={0.05}
                      decimals={2}
                      suffix="%"
                      onChange={(val) => onUpdateInputs({ maxirataTaeg: val })}
                      className="w-24"
                      inputClassName="text-xs text-amber-900 border-amber-300 font-bold bg-white text-right"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.05}
                    value={inputs.maxirataTaeg}
                    onChange={(e) => onUpdateInputs({ maxirataTaeg: parseFloat(e.target.value) })}
                    className="w-full fintech-slider slider-amber"
                    aria-label="TAEG Finanziamento con Maxirata"
                  />
                </div>

                {/* CONTROLLO DIRETTO RATA MENSILE PREVENTIVO */}
                <div className="py-2 px-3 bg-white rounded-xl border border-amber-200 my-2 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">Rata Mensile dal Preventivo:</span>
                    <span className="text-[10px] text-slate-400">
                      {inputs.maxirataCustomMonthlyInstallment
                        ? `Fissata a ${formatEuro(inputs.maxirataCustomMonthlyInstallment, 2)}`
                        : 'Calcolata da TAN (formula francese)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <NumericInput
                      id="card-maxirata-btp-custom-inst"
                      value={inputs.maxirataCustomMonthlyInstallment || 0}
                      min={0}
                      max={5000}
                      step={1}
                      decimals={2}
                      suffix="€"
                      placeholder="Auto da TAN"
                      onChange={(val) =>
                        onUpdateInputs({
                          maxirataCustomMonthlyInstallment: val > 0 ? val : undefined,
                        })
                      }
                      className="w-24"
                      inputClassName="text-xs text-amber-900 border-amber-300 font-bold bg-amber-50/50 text-right"
                    />
                    {inputs.maxirataCustomMonthlyInstallment && (
                      <button
                        type="button"
                        onClick={() => onUpdateInputs({ maxirataCustomMonthlyInstallment: undefined })}
                        className="text-[10px] text-amber-700 underline font-semibold hover:text-amber-900 cursor-pointer"
                        title="Ripristina calcolo automatico della rata"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* SELETTORE QUOTA MENSILE DA INVESTIRE NEL FONDO */}
            <div className="py-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="card-btp-monthly-slider"
                  className="font-bold text-emerald-900 flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Quanto investire al mese ({instrumentName}):</span>
                </label>
              </div>

              {/* Bottoni Modalità: Auto 100% vs Custom */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateInputs({
                      btpContributionMode: 'auto',
                      btpCustomMonthlyAmount: undefined,
                    })
                  }
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                    inputs.btpContributionMode !== 'custom'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Auto 100% ({formatEuro(maxirata.btpAccumulator.monthlySavingsRequired)})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateInputs({
                      btpContributionMode: 'custom',
                      btpCustomMonthlyAmount: maxirata.effectiveMonthlyBtpSavings || 150,
                    })
                  }
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                    inputs.btpContributionMode === 'custom'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Libero
                </button>
              </div>

              {/* Slider Quota Mensile */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">Quota mensile {instrumentName}:</span>
                  <NumericInput
                    id="card-btp-monthly-input"
                    value={maxirata.effectiveMonthlyBtpSavings}
                    min={0}
                    max={2000}
                    step={10}
                    decimals={2}
                    suffix="€/m"
                    onChange={(val) =>
                      onUpdateInputs({
                        btpContributionMode: 'custom',
                        btpCustomMonthlyAmount: val,
                      })
                    }
                    className="w-28"
                    inputClassName="text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50/50"
                  />
                </div>
                <input
                  id="card-btp-monthly-slider"
                  type="range"
                  min={0}
                  max={Math.max(800, maxirata.btpAccumulator.monthlySavingsRequired * 1.5)}
                  step={10}
                  value={maxirata.effectiveMonthlyBtpSavings}
                  onChange={(e) =>
                    onUpdateInputs({
                      btpContributionMode: 'custom',
                      btpCustomMonthlyAmount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full fintech-slider slider-emerald"
                  aria-label={`Quota mensile da investire in ${instrumentName}`}
                />
              </div>

              {/* BOX DINAMICO: STATO GAP VS 100% COPERTO */}
              {maxirata.gapAmount > 10 ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs space-y-2 text-amber-900">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gap Maxirata:</span>
                    </span>
                    <span className="text-rose-600 tabular-nums">
                      Mancano {formatEuro(maxirata.gapAmount)}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-900 leading-snug space-y-1">
                    <div>
                      Maxirata totale:{' '}
                      <strong className="text-slate-900 tabular-nums">{formatEuro(maxirata.maxirataAmount)}</strong>
                    </div>
                    <div>
                      Fondo {instrumentName} accumulato a scadenza:{' '}
                      <strong className="text-emerald-700 tabular-nums">
                        - {formatEuro(maxirata.accumulatedBtpAtMaturity, 2)}
                      </strong>
                    </div>
                    <div className="pt-1 border-t border-amber-200/80">
                      Rifinanzi solo il debito residuo ({formatEuro(maxirata.gapAmount)}):{' '}
                      <strong className="text-rose-700 tabular-nums">
                        {formatEuro(maxirata.gapRefinancedMonthly, 2)}/m
                      </strong>{' '}
                      per {inputs.refinanceMonths}m al {inputs.refinanceTaeg}% (+ {formatEuro(maxirata.gapRefinancedExtraInterest)} interessi).
                    </div>
                  </div>

                  {/* MINI CONTROLLI RIFINANZIAMENTO GAP */}
                  <div className="pt-2 border-t border-amber-200/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Modifica durata gap:</span>
                      <div className="flex gap-1">
                        {REFINANCE_MONTH_PRESETS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => onUpdateInputs({ refinanceMonths: m })}
                            className={`px-2 py-1 rounded-md text-xs font-bold min-h-[30px] cursor-pointer ${
                              inputs.refinanceMonths === m
                                ? 'bg-amber-700 text-white'
                                : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs flex items-start gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-bold">100% Maxirata Coperta!</span>
                    <br />
                    A scadenza hai {formatEuro(maxirata.accumulatedBtpAtMaturity)} pronti. Zero debiti o
                    rifinanziamenti!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Footer: Totals & Breakdown */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Esborso Vivo (con {instrumentName} + Gap):</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                {formatEuro(maxirata.totalOutOfPocketWithBtp)}
              </span>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
                  Costo Reale Netto
                </div>
                <div className="text-[10px] text-slate-400">
                  {maxirata.gapAmount > 10 ? 'Compreso rifinanz. gap' : `Inclusi interessi ${instrumentName}`}
                </div>
              </div>
              <div className="text-lg font-extrabold tabular-nums text-amber-400">
                {formatEuro(
                  inputs.includeOpportunityCost
                    ? maxirata.realNetCost
                    : maxirata.totalOutOfPocketWithBtp
                )}
              </div>
            </div>

            {/* Expandable Cost Breakdown */}
            <button
              type="button"
              onClick={() => toggleDetails('maxirata')}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1 cursor-pointer transition-colors"
            >
              <span>Scomposizione costi</span>
              {openDetails.maxirata ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDetails.maxirata && (
              <div className="pt-2 space-y-1 text-xs border-t border-slate-100 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Fondo {instrumentName} a scadenza:</span>
                  <span className="font-medium text-slate-900">
                    {formatEuro(maxirata.accumulatedBtpAtMaturity, 2)}
                  </span>
                </div>
                {maxirata.gapAmount > 10 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Costo Rifinanziamento Gap:</span>
                    <span className="font-medium">
                      + {formatEuro(maxirata.gapRefinancedTotalPaid, 2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                  <span>Interessi {instrumentName} regalati dal fondo:</span>
                  <span>
                    - {formatEuro(maxirata.btpAccumulator.totalNetInterestEarned, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
