import React, { useState } from 'react';
import {
  Car,
  Tag,
  Wallet,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Receipt,
  RefreshCw,
  Percent,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { CalculatorInputs } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';
import { NumericInput } from '../common/NumericInput';

export interface TopVehicleBarProps {
  inputs: CalculatorInputs;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  netAnnualBtpYield: number;
  isSimpleMode?: boolean;
  onToggleSimpleMode?: () => void;
}

interface VehicleCategory {
  id: string;
  label: string;
  image: string;
  typicalPrice: number;
  typicalDiscount: number;
  typicalMaxirataPercent: number;
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'citycar',
    label: 'Citycar & Compatta',
    image: '/images/cars/citycar.jpg',
    typicalPrice: 23350,
    typicalDiscount: 3500,
    typicalMaxirataPercent: 55,
  },
  {
    id: 'suv',
    label: 'SUV & Crossover',
    image: '/images/cars/suv.jpg',
    typicalPrice: 28800,
    typicalDiscount: 4767,
    typicalMaxirataPercent: 58,
  },
  {
    id: 'berlina',
    label: 'Berlina & Station',
    image: '/images/cars/berlina.jpg',
    typicalPrice: 38500,
    typicalDiscount: 5200,
    typicalMaxirataPercent: 52,
  },
  {
    id: 'electric',
    label: 'Elettrica & Tech',
    image: '/images/cars/electric.jpg',
    typicalPrice: 42900,
    typicalDiscount: 6000,
    typicalMaxirataPercent: 50,
  },
];

export function TopVehicleBar({
  inputs,
  onUpdateInputs,
  netAnnualBtpYield,
  isSimpleMode = true,
  onToggleSimpleMode,
}: TopVehicleBarProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  const promoPrice = Math.max(0, inputs.carPriceCash - inputs.financingDiscount);
  const totalUpfront = inputs.downPaymentCash + inputs.tradeInValue;
  const maxDownPayment = Math.min(40000, Math.max(0, promoPrice - inputs.tradeInValue));

  // Rileva la categoria corrispondente in base al prezzo o preset
  const selectedCategory =
    VEHICLE_CATEGORIES.find((c) =>
      inputs.scenarioName?.toLowerCase().includes(c.id) ||
      (inputs.carPriceCash <= 25000 && c.id === 'citycar') ||
      (inputs.carPriceCash > 25000 && inputs.carPriceCash <= 33000 && c.id === 'suv') ||
      (inputs.carPriceCash > 33000 && inputs.carPriceCash <= 40000 && c.id === 'berlina') ||
      (inputs.carPriceCash > 40000 && c.id === 'electric')
    ) || VEHICLE_CATEGORIES[1];

  const handleSelectCategory = (cat: VehicleCategory) => {
    onUpdateInputs({
      carPriceCash: cat.typicalPrice,
      financingDiscount: cat.typicalDiscount,
      maxirataPercent: cat.typicalMaxirataPercent,
      maxirataFixedAmount: Number(((cat.typicalPrice * (cat.typicalMaxirataPercent / 100))).toFixed(2)),
      scenarioName: `${cat.label} (Stima)`,
      maxirataCustomMonthlyInstallment: undefined,
    });
  };

  return (
    <section
      aria-label="Dati Veicolo, Anticipo e Rendimento Liquidità"
      className="bg-white rounded-xl border border-slate-200/90 overflow-hidden"
    >
      {/* Editorial Automotive Banner */}
      <div className="relative bg-slate-900 text-white min-h-[140px] sm:min-h-[160px] flex flex-col md:flex-row items-stretch justify-between overflow-hidden">
        {/* Car Photo Frame with Overlay */}
        <div className="absolute inset-0 md:relative md:w-2/5 shrink-0 overflow-hidden">
          <img
            src={selectedCategory.image}
            alt={selectedCategory.label}
            className="w-full h-full object-cover object-center brightness-[0.75] md:brightness-95 contrast-105"
            loading="lazy"
          />
          {/* taste-skill-ignore: neutral scrim over car photography */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
        </div>

        {/* Banner Content & Category Switcher */}
        <div className="relative z-10 flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>Configurazione Preventivo Auto</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                {inputs.scenarioName || 'Preventivo Concessionaria'}
              </h2>
            </div>

            {/* Opportunity Cost & Mode Controls */}
            <div className="flex items-center gap-2">
              {!isSimpleMode && (
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer select-none text-xs text-slate-300">
                  <span>Costo Opportunità {instrumentName}</span>
                  <input
                    type="checkbox"
                    checked={inputs.includeOpportunityCost}
                    onChange={(e) => onUpdateInputs({ includeOpportunityCost: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                </label>
              )}

              {isSimpleMode ? (
                <button
                  type="button"
                  onClick={onToggleSimpleMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Dati Avanzati</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen((prev) => !prev)}
                  aria-expanded={isDetailsOpen}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Spese Accessorie</span>
                  {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mr-1">
              Segmento:
            </span>
            {VEHICLE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSimpleMode ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-5 p-5 sm:p-6 bg-white`}>
        {/* 1. Prezzo Auto Contanti */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="input-carPriceCash"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide"
            >
              <Car className="w-3.5 h-3.5 text-slate-600" />
              <span>Prezzo di Listino (&euro;)</span>
            </label>
            <NumericInput
              id="input-carPriceCash"
              value={inputs.carPriceCash}
              min={1000}
              max={250000}
              step={100}
              decimals={0}
              suffix="€"
              onChange={(val) => onUpdateInputs({ carPriceCash: val })}
              className="w-full"
              inputClassName="text-base py-1.5 font-bold text-slate-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <input
              type="range"
              aria-label="Slider Prezzo Auto Contanti"
              min={8000}
              max={80000}
              step={500}
              value={Math.min(80000, Math.max(8000, inputs.carPriceCash))}
              onChange={(e) => onUpdateInputs({ carPriceCash: Number(e.target.value) })}
              className="w-full fintech-slider"
            />
            <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
              <span>8.000 &euro;</span>
              <span>Digita qualsiasi valore</span>
              <span>80.000 &euro;</span>
            </div>
          </div>
        </div>

        {/* 2. Sconto Promozionale Finanziamento */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-financingDiscount"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide"
              >
                <Tag className="w-3.5 h-3.5 text-slate-600" />
                <span>Sconto Concessionaria</span>
              </label>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold tabular-nums">
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
                  inputClassName="text-sm py-1 font-bold text-slate-900 bg-white"
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
                  inputClassName="text-sm py-1 font-bold text-slate-900 bg-white"
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
              onChange={(e) => onUpdateInputs({ financingDiscount: Number(e.target.value) })}
              className="w-full fintech-slider"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
              <span>Prezzo scontato netto:</span>
              <span className="font-bold text-slate-800">{formatEuro(promoPrice, 2)}</span>
            </div>
          </div>
        </div>

        {/* 3. Anticipo Versato Cash */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="input-downPaymentCash"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide"
            >
              <Wallet className="w-3.5 h-3.5 text-slate-600" />
              <span>Anticipo Iniziale Cash (&euro;)</span>
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
                inputClassName="text-base py-1.5 font-bold text-slate-900 bg-white"
              />
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-800 tabular-nums">
                  Totale: {formatEuro(totalUpfront, 2)}
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
              onChange={(e) => onUpdateInputs({ downPaymentCash: Number(e.target.value) })}
              className="w-full fintech-slider"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
              <span>Cash: {formatEuro(inputs.downPaymentCash, 2)}</span>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                + Permuta: {formatEuro(inputs.tradeInValue, 2)}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Rata e Maxirata della Concessionaria */}
        {isSimpleMode ? (
          <div className="p-4 rounded-lg bg-slate-100 border border-slate-300 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <Coins className="w-3.5 h-3.5 text-slate-700" />
                  <span>Proposta Concessionaria</span>
                </label>
                <div className="flex gap-1">
                  {[36, 48].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        onUpdateInputs({
                          maxirataMonths: m,
                          maxirataInterimCount: m === 36 ? 35 : m,
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        inputs.maxirataMonths === m
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {m} mesi
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-600 font-medium block">Rata Preventivo (€/m)</span>
                  <NumericInput
                    id="simple-monthly-inst"
                    value={inputs.maxirataCustomMonthlyInstallment || 0}
                    min={0}
                    max={5000}
                    step={1}
                    decimals={2}
                    suffix="€/m"
                    placeholder="Auto da TAN"
                    onChange={(val) =>
                      onUpdateInputs({
                        maxirataCustomMonthlyInstallment: val > 0 ? val : undefined,
                      })
                    }
                    className="w-full"
                    inputClassName="text-sm py-1 font-bold text-slate-900 bg-white border-slate-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 font-medium block">Maxirata Finale VFG (€)</span>
                  <NumericInput
                    id="simple-maxirata-amount"
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
                      });
                    }}
                    className="w-full"
                    inputClassName="text-sm py-1 font-bold text-slate-900 bg-white border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
              <span>{inputs.maxirataMonths} mesi ({inputs.maxirataInterimCount || inputs.maxirataMonths} rate)</span>
              <span className="font-semibold text-slate-800">
                TAN {inputs.maxirataTan ?? 0}% • TAEG {inputs.maxirataTaeg}%
              </span>
            </div>
          </div>
        ) : (
          /* Rendimento Annuo Lordo BTP in Modalità Avanzata */
          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="input-btpGrossYield"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
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
                  inputClassName="text-base py-1.5 text-amber-950 font-bold bg-white border-amber-300"
                />
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold tabular-nums shrink-0">
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
                onChange={(e) => onUpdateInputs({ btpGrossYield: Number(e.target.value) })}
                className="w-full fintech-slider slider-amber"
              />
              <div className="flex items-center justify-between text-[11px] text-amber-800 tabular-nums">
                <span>0%</span>
                <span className="font-semibold">
                  Tassa{' '}
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
        )}
      </div>

      {/* Drawer Spese Accessorie & Polizze */}
      {isDetailsOpen && (
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                Spese Accessorie, Polizze &amp; Valore Futuro Garantito
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Personalizza i costi accessori previsti dal foglio SECCI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Permuta Usato */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-tradeInValue" className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Valore Permuta Usato (&euro;)</span>
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.tradeInValue)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  aria-label="Slider Valore Permuta Usato"
                  min={0}
                  max={30000}
                  step={250}
                  value={Math.min(30000, Math.max(0, inputs.tradeInValue))}
                  onChange={(e) => onUpdateInputs({ tradeInValue: Number(e.target.value) })}
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
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>

            {/* Spese Istruttoria */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-originationFee" className="text-xs font-semibold text-slate-700">
                  Istruttoria Pratica (&euro;)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.originationFee)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  aria-label="Slider Spese Istruttoria"
                  min={0}
                  max={1000}
                  step={25}
                  value={Math.min(1000, Math.max(0, inputs.originationFee))}
                  onChange={(e) => onUpdateInputs({ originationFee: Number(e.target.value) })}
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
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>

            {/* Spese Incasso Rata */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-monthlyCollectionFee" className="text-xs font-semibold text-slate-700">
                  Incasso Rata Mensile (&euro;/m)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.monthlyCollectionFee, 2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  aria-label="Slider Spese Incasso Rata"
                  min={0}
                  max={15}
                  step={0.5}
                  value={Math.min(15, Math.max(0, inputs.monthlyCollectionFee))}
                  onChange={(e) => onUpdateInputs({ monthlyCollectionFee: Number(e.target.value) })}
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
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>

            {/* Imposta di Bollo */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-stampDuty" className="text-xs font-semibold text-slate-700">
                  Imposta di Bollo (&euro;)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.stampDuty, 2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  aria-label="Slider Imposta di Bollo"
                  min={0}
                  max={100}
                  step={2}
                  value={Math.min(100, Math.max(0, inputs.stampDuty))}
                  onChange={(e) => onUpdateInputs({ stampDuty: Number(e.target.value) })}
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
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>

            {/* Polizze Obbligatorie */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-mandatoryInsuranceMonthly" className="text-xs font-semibold text-slate-700">
                  Polizze nel Finanziamento (&euro;/m)
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatEuro(inputs.mandatoryInsuranceMonthly, 2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  aria-label="Slider Polizze Obbligatorie Mensili"
                  min={0}
                  max={250}
                  step={5}
                  value={Math.min(250, Math.max(0, inputs.mandatoryInsuranceMonthly))}
                  onChange={(e) => onUpdateInputs({ mandatoryInsuranceMonthly: Number(e.target.value) })}
                  className="flex-1 fintech-slider"
                />
                <NumericInput
                  id="detail-mandatoryInsuranceMonthly"
                  value={inputs.mandatoryInsuranceMonthly}
                  min={0}
                  max={2000}
                  step={1}
                  decimals={2}
                  suffix="€"
                  onChange={(val) => onUpdateInputs({ mandatoryInsuranceMonthly: val })}
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>

            {/* Maxirata VFG Custom */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="detail-maxirataAmount" className="text-xs font-semibold text-slate-700">
                  Maxirata Finale VFG
                </label>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {inputs.maxirataPercent}% listino
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  className="flex-1 fintech-slider"
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
                  className="w-24"
                  inputClassName="text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
