import React, { useState } from 'react';
import {
  Car,
  Tag,
  Wallet,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Receipt,
  RefreshCw,
} from 'lucide-react';
import { CalculatorInputs } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';
import { NumericInput } from '../common/NumericInput';

export interface TopVehicleBarProps {
  inputs: CalculatorInputs;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  netAnnualBtpYield: number;
}

export function TopVehicleBar({
  inputs,
  onUpdateInputs,
  netAnnualBtpYield,
}: TopVehicleBarProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  const promoPrice = Math.max(0, inputs.carPriceCash - inputs.financingDiscount);
  const totalUpfront = inputs.downPaymentCash + inputs.tradeInValue;
  const maxDownPayment = Math.min(40000, Math.max(0, promoPrice - inputs.tradeInValue));

  return (
    <section
      aria-label="Dati Veicolo, Anticipo e Rendimento Liquidità"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
    >
      {/* Card Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              1. Dati Veicolo, Anticipo &amp; Rendimento Liquidit&agrave;
            </h2>
            <p className="text-xs text-slate-500">
              Scrivi direttamente i valori esatti nelle caselle oppure usa gli slider
            </p>
          </div>
        </div>

        {/* Right Controls: Opportunity Cost Toggle + Drawer Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={inputs.includeOpportunityCost}
              onChange={(e) =>
                onUpdateInputs({ includeOpportunityCost: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">
              Includi Costo Opportunit&agrave; Liquidit&agrave; {instrumentName}
            </span>
          </label>

          <button
            type="button"
            onClick={() => setIsDetailsOpen((prev) => !prev)}
            aria-expanded={isDetailsOpen}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDetailsOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dettagli Preventivo &amp; Spese Accessorie</span>
            {isDetailsOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main 4-Column Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
        {/* 1. Prezzo Auto (Contanti) */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="input-carPriceCash"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              <Car className="w-3.5 h-3.5 text-blue-600" />
              <span>Prezzo Auto (Contanti)</span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <NumericInput
                id="input-carPriceCash"
                value={inputs.carPriceCash}
                min={1000}
                max={250000}
                step={100}
                decimals={0}
                suffix="€"
                onChange={(val) => onUpdateInputs({ carPriceCash: val })}
                className="flex-1"
                inputClassName="text-base py-1.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              aria-label="Slider Prezzo Auto Contanti"
              min={8000}
              max={80000}
              step={500}
              value={Math.min(80000, Math.max(8000, inputs.carPriceCash))}
              onChange={(e) =>
                onUpdateInputs({ carPriceCash: Number(e.target.value) })
              }
              className="w-full fintech-slider"
            />
            <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
              <span>8.000 &euro;</span>
              <span>Scrivi qualsiasi importo</span>
              <span>80.000 &euro;</span>
            </div>
          </div>
        </div>

        {/* 2. Extra Sconto & Prezzo Promozionato */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-financingDiscount"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Sconto Promo Maxirata</span>
              </label>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold tabular-nums">
                -{formatEuro(inputs.financingDiscount, 2)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-medium block">Sconto (&euro;)</span>
                <NumericInput
                  id="input-financingDiscount"
                  value={inputs.financingDiscount}
                  min={0}
                  max={inputs.carPriceCash}
                  step={50}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ financingDiscount: val })}
                  className="w-full"
                  inputClassName="text-sm py-1 font-semibold text-blue-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium block">Prezzo Promo (&euro;)</span>
                <NumericInput
                  id="input-promoPriceDirect"
                  value={promoPrice}
                  min={0}
                  max={inputs.carPriceCash}
                  step={50}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => {
                    const newDiscount = Math.max(0, inputs.carPriceCash - val);
                    onUpdateInputs({ financingDiscount: newDiscount });
                  }}
                  className="w-full"
                  inputClassName="text-sm py-1 font-semibold text-slate-900 border-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              aria-label="Slider Extra Sconto Finanziamento"
              min={0}
              max={Math.min(25000, inputs.carPriceCash)}
              step={100}
              value={Math.min(inputs.carPriceCash, Math.max(0, inputs.financingDiscount))}
              onChange={(e) =>
                onUpdateInputs({ financingDiscount: Number(e.target.value) })
              }
              className="w-full fintech-slider"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
              <span>Promo dal preventivo:</span>
              <span className="font-bold text-slate-800">{formatEuro(promoPrice, 2)}</span>
            </div>
          </div>
        </div>

        {/* 3. Anticipo Cash + Permuta */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="input-downPaymentCash"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              <Wallet className="w-3.5 h-3.5 text-blue-600" />
              <span>Anticipo Cash (&euro;)</span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <NumericInput
                id="input-downPaymentCash"
                value={inputs.downPaymentCash}
                min={0}
                max={inputs.carPriceCash + (inputs.extraServicesFee || 0)}
                step={100}
                decimals={2}
                suffix="€"
                onChange={(val) => onUpdateInputs({ downPaymentCash: val })}
                className="flex-1"
                inputClassName="text-base py-1.5"
              />
              <div className="text-right shrink-0">
                <div className="text-xs font-extrabold text-slate-800 tabular-nums">
                  Tot: {formatEuro(totalUpfront, 2)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              aria-label="Slider Anticipo Cash"
              min={0}
              max={maxDownPayment > 0 ? maxDownPayment : 30000}
              step={250}
              value={Math.min(
                maxDownPayment > 0 ? maxDownPayment : 30000,
                inputs.downPaymentCash
              )}
              onChange={(e) =>
                onUpdateInputs({ downPaymentCash: Number(e.target.value) })
              }
              className="w-full fintech-slider"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
              <span>Cash: {formatEuro(inputs.downPaymentCash, 2)}</span>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                + Permuta: {formatEuro(inputs.tradeInValue, 2)} (modifica)
              </button>
            </div>
          </div>
        </div>

        {/* 4. Rendimento Annuo Lordo BTP */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="input-btpGrossYield"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rendimento Lordo {instrumentName}</span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <NumericInput
                id="input-btpGrossYield"
                value={inputs.btpGrossYield}
                min={0}
                max={20}
                step={0.05}
                decimals={2}
                suffix="%"
                onChange={(val) => onUpdateInputs({ btpGrossYield: val })}
                className="flex-1"
                inputClassName="text-base py-1.5 text-emerald-900 border-emerald-300 focus:border-emerald-600"
              />
              <span className="px-2 py-1 rounded-md bg-emerald-100/90 text-emerald-800 text-xs font-bold tabular-nums shrink-0">
                Netto: {formatPercent(netAnnualBtpYield, 2)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              aria-label={`Slider Rendimento Annuo Lordo ${instrumentName}`}
              min={0}
              max={7}
              step={0.1}
              value={Math.min(7, Math.max(0, inputs.btpGrossYield))}
              onChange={(e) =>
                onUpdateInputs({ btpGrossYield: Number(e.target.value) })
              }
              className="w-full fintech-slider slider-emerald"
            />
            <div className="flex items-center justify-between text-[11px] text-emerald-700 tabular-nums">
              <span>0%</span>
              <span className="font-semibold">
                Tassazione{' '}
                {inputs.taxRegime === 'btp_12_5'
                  ? '12,5%'
                  : inputs.taxRegime === 'deposito_26'
                  ? '26%'
                  : '0%'}
              </span>
              <span>7,0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Drawer: Dettagli Preventivo & Spese Accessorie */}
      {isDetailsOpen && (
        <div className="mt-6 pt-5 border-t border-slate-200/80 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                Dettagli Preventivo: Permuta, Istruttoria, Incasso Rata e Polizze
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Puoi digitare qualsiasi valore esatto nelle caselle
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Valore Permuta Usato */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-tradeInValue"
                  className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Valore Permuta Usato (&euro;)</span>
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.tradeInValue)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Valore Permuta Usato"
                  min={0}
                  max={30000}
                  step={250}
                  value={Math.min(30000, Math.max(0, inputs.tradeInValue))}
                  onChange={(e) =>
                    onUpdateInputs({ tradeInValue: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-tradeInValue"
                  value={inputs.tradeInValue}
                  min={0}
                  max={inputs.carPriceCash}
                  step={100}
                  decimals={0}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ tradeInValue: val })}
                  className="w-28"
                  inputClassName="text-xs"
                />
              </div>
            </div>

            {/* 2. Anticipo Cash */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-downPaymentCash"
                  className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Anticipo Cash (&euro;)</span>
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.downPaymentCash)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Anticipo Cash Dettaglio"
                  min={0}
                  max={30000}
                  step={250}
                  value={Math.min(30000, Math.max(0, inputs.downPaymentCash))}
                  onChange={(e) =>
                    onUpdateInputs({ downPaymentCash: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-downPaymentCash"
                  value={inputs.downPaymentCash}
                  min={0}
                  max={inputs.carPriceCash}
                  step={100}
                  decimals={0}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ downPaymentCash: val })}
                  className="w-28"
                  inputClassName="text-xs"
                />
              </div>
            </div>

            {/* 3. Spese Istruttoria */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-originationFee"
                  className="text-xs font-semibold text-slate-700"
                >
                  Spese Istruttoria Pratica (&euro;)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.originationFee)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Spese Istruttoria"
                  min={0}
                  max={1000}
                  step={25}
                  value={Math.min(1000, Math.max(0, inputs.originationFee))}
                  onChange={(e) =>
                    onUpdateInputs({ originationFee: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-originationFee"
                  value={inputs.originationFee}
                  min={0}
                  max={5000}
                  step={10}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ originationFee: val })}
                  className="w-28"
                  inputClassName="text-xs"
                />
              </div>
            </div>

            {/* 4. Spese Incasso Rata */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-monthlyCollectionFee"
                  className="text-xs font-semibold text-slate-700"
                >
                  Spese Incasso Rata (&euro;/mese)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.monthlyCollectionFee, 2)}/mese
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Spese Incasso Rata"
                  min={0}
                  max={15}
                  step={0.5}
                  value={Math.min(15, Math.max(0, inputs.monthlyCollectionFee))}
                  onChange={(e) =>
                    onUpdateInputs({ monthlyCollectionFee: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-monthlyCollectionFee"
                  value={inputs.monthlyCollectionFee}
                  min={0}
                  max={100}
                  step={0.5}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ monthlyCollectionFee: val })}
                  className="w-28"
                  inputClassName="text-xs"
                />
              </div>
            </div>

            {/* 5. Imposta di Bollo */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-stampDuty"
                  className="text-xs font-semibold text-slate-700"
                >
                  Imposta di Bollo (&euro;)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.stampDuty, 2)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Imposta di Bollo"
                  min={0}
                  max={100}
                  step={2}
                  value={Math.min(100, Math.max(0, inputs.stampDuty))}
                  onChange={(e) =>
                    onUpdateInputs({ stampDuty: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-stampDuty"
                  value={inputs.stampDuty}
                  min={0}
                  max={1000}
                  step={1}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ stampDuty: val })}
                  className="w-28"
                  inputClassName="text-xs"
                />
              </div>
            </div>

            {/* 6. Polizze / Servizi Obbligatori nel Finanziamento */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-mandatoryInsuranceMonthly"
                  className="text-xs font-semibold text-amber-900 inline-flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Polizze Obbligatorie (&euro;/mese)</span>
                </label>
                <span className="text-xs font-bold text-amber-800 tabular-nums">
                  {formatEuro(inputs.mandatoryInsuranceMonthly, 2)}/mese
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Polizze Obbligatorie Mensili"
                  min={0}
                  max={250}
                  step={5}
                  value={Math.min(250, Math.max(0, inputs.mandatoryInsuranceMonthly))}
                  onChange={(e) =>
                    onUpdateInputs({ mandatoryInsuranceMonthly: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider slider-amber"
                />
                <NumericInput
                  id="detail-mandatoryInsuranceMonthly"
                  value={inputs.mandatoryInsuranceMonthly}
                  min={0}
                  max={2000}
                  step={1}
                  decimals={2}
                  suffix="€"
                  onChange={(val) =>
                    onUpdateInputs({ mandatoryInsuranceMonthly: val })
                  }
                  className="w-28"
                  inputClassName="text-xs text-amber-900 border-amber-300"
                />
              </div>
            </div>

            {/* 7. Garanzia Estesa / Servizi Una Tantum dal Preventivo */}
            <div className="bg-white p-3.5 rounded-xl border border-blue-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-extraServicesFee"
                  className="text-xs font-semibold text-blue-900 inline-flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Garanzia Estesa / Servizi Una Tantum (&euro;)</span>
                </label>
                <span className="text-xs font-bold text-blue-800 tabular-nums">
                  {formatEuro(inputs.extraServicesFee || 0, 2)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Garanzia Estesa Servizi Una Tantum"
                  min={0}
                  max={2000}
                  step={20}
                  value={Math.min(2000, Math.max(0, inputs.extraServicesFee || 0))}
                  onChange={(e) =>
                    onUpdateInputs({ extraServicesFee: Number(e.target.value) })
                  }
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-extraServicesFee"
                  value={inputs.extraServicesFee || 0}
                  min={0}
                  max={10000}
                  step={10}
                  decimals={2}
                  suffix="€"
                  onChange={(val) =>
                    onUpdateInputs({ extraServicesFee: val })
                  }
                  className="w-28"
                  inputClassName="text-xs text-blue-900 border-blue-300"
                />
              </div>
            </div>

            {/* 8. Maxirata Finale / Valore Futuro Garantito (VFG) */}
            <div className="bg-white p-3.5 rounded-xl border border-purple-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-maxirataAmount"
                  className="text-xs font-semibold text-purple-900 inline-flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Maxirata Finale VFG (&euro;)</span>
                </label>
                <span className="text-xs font-bold text-purple-800 tabular-nums">
                  {inputs.maxirataPercent}% del listino
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slider Percentuale Maxirata Dettagli"
                  min={15}
                  max={75}
                  step={0.5}
                  value={inputs.maxirataPercent}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value);
                    const newFixed = Number(((inputs.carPriceCash * (p / 100))).toFixed(2));
                    onUpdateInputs({
                      maxirataPercent: p,
                      maxirataFixedAmount: newFixed,
                      maxirataCustomMonthlyInstallment: undefined,
                    });
                  }}
                  className="flex-1 fintech-slider slider-purple"
                />
                <NumericInput
                  id="detail-maxirataAmount"
                  value={
                    inputs.maxirataFixedAmount && inputs.maxirataFixedAmount > 0
                      ? inputs.maxirataFixedAmount
                      : Number(((inputs.carPriceCash * (inputs.maxirataPercent / 100))).toFixed(2))
                  }
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
                  inputClassName="text-xs text-purple-900 border-purple-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
