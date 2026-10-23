import React, { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Download, Table, TrendingUp } from 'lucide-react';
import { FullCalculationOutput } from '../../types/calculator';
import { exportTimelineToCsv, formatEuro, formatPercent } from '../../lib/storage';

type ActiveTab = 'timeline' | 'breakdown' | 'table';
type TableFilterMode = 'all' | 'until_maxirata' | 'yearly';
type TableColumnFocus = 'all' | 'btp_focus' | 'debt_focus';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    dataKey?: string;
  }>;
  label?: string | number;
  maxirataMonth?: number;
}

function TimelineCustomTooltip({
  active,
  payload,
  label,
  maxirataMonth,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const monthNum = Number(label);
  const isMaxirataTarget = monthNum === maxirataMonth;

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-4 border-b border-slate-100 pb-1.5">
        <span className="text-xs font-semibold text-slate-700">
          Mese {label}
          {monthNum > 0 ? ` (${(monthNum / 12).toFixed(1).replace('.0', '')} anni)` : ' (Oggi)'}
        </span>
        {isMaxirataTarget && (
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 ring-1 ring-teal-600/20">
            Scadenza Maxirata
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => {
          const val = typeof entry.value === 'number' ? entry.value : 0;
          return (
            <div
              key={entry.dataKey ?? idx}
              className="flex items-center justify-between gap-6 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color || '#64748b' }}
                />
                <span className="font-medium text-slate-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatEuro(val, 0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakdownCustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-3">
      <p className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold text-slate-800">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => {
          const val = typeof entry.value === 'number' ? entry.value : 0;
          return (
            <div
              key={entry.dataKey ?? idx}
              className="flex items-center justify-between gap-6 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: entry.color || '#64748b' }}
                />
                <span className="font-medium text-slate-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatEuro(val, 0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DeepDiveTabs({ calc }: { calc: FullCalculationOutput }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [tableFilter, setTableFilter] = useState<TableFilterMode>('all');
  const [columnFocus, setColumnFocus] = useState<TableColumnFocus>('all');

  const maxirataMonth = calc.inputs.maxirataMonths;
  const instrumentName = calc.inputs.selectedInstrumentName || 'BTP';

  // Dati Tab 2: Scomposizione Costi per le 4 opzioni
  const breakdownData = useMemo(() => {
    const cashNetCarPrice = calc.cash.totalOutOfPocket;
    const promoNetCarPrice = calc.standard.carPricePromo;

    const btpBenefitStandard = calc.standard.liquidityBtpGain;
    const btpBenefitMaxirata =
      calc.maxirata.btpAccumulator.totalNetInterestEarned + calc.maxirata.liquidityBtpGain;

    const refiTotalInterestAndFees =
      calc.maxirata.totalInterestAndFees1stPeriod +
      calc.maxirata.refinanceScenario.extraInterest2ndPeriod;

    return [
      {
        option: 'Contanti',
        shortLabel: 'Contanti',
        prezzoNettoAuto: Math.round(cashNetCarPrice),
        interessiESpese: 0,
        rendimentoBtp: 0,
        outOfPocket: calc.cash.totalOutOfPocket,
        realNetCost: calc.cash.realNetCost,
        forgoneDiscount: calc.cash.forgoneDiscount,
        note:
          calc.cash.forgoneDiscount > 0
            ? `Rinuncia a ${formatEuro(calc.cash.forgoneDiscount)} di sconto promo`
            : 'Nessun interesse passivo',
      },
      {
        option: 'Finanz. Standard',
        shortLabel: 'Finanz. Standard',
        prezzoNettoAuto: Math.round(promoNetCarPrice),
        interessiESpese: Math.round(calc.standard.totalInterestAndFees),
        rendimentoBtp: Math.round(btpBenefitStandard),
        outOfPocket: calc.standard.totalOutOfPocket,
        realNetCost: calc.standard.realNetCost,
        forgoneDiscount: 0,
        note: `${calc.inputs.standardMonths} rate da ${formatEuro(calc.standard.monthlyInstallmentTotal, 0)}/mese`,
      },
      {
        option: `Maxirata + Salvadanaio ${instrumentName}`,
        shortLabel: `Maxirata + ${instrumentName}`,
        prezzoNettoAuto: Math.round(promoNetCarPrice),
        interessiESpese: Math.round(calc.maxirata.totalInterestAndFees1stPeriod),
        rendimentoBtp: Math.round(btpBenefitMaxirata),
        outOfPocket: calc.maxirata.totalOutOfPocketWithBtp,
        realNetCost: calc.maxirata.realNetCost,
        forgoneDiscount: 0,
        note: `Interessi ${instrumentName} Salvadanaio: +${formatEuro(calc.maxirata.btpAccumulator.totalNetInterestEarned, 0)}`,
      },
      {
        option: `Maxirata Rifinanziata (No ${instrumentName})`,
        shortLabel: 'Maxirata Rifinanz.',
        prezzoNettoAuto: Math.round(promoNetCarPrice),
        interessiESpese: Math.round(refiTotalInterestAndFees),
        rendimentoBtp: 0,
        outOfPocket: calc.maxirata.refinanceScenario.totalOutOfPocketWithRefinance,
        realNetCost: calc.maxirata.refinanceScenario.totalOutOfPocketWithRefinance,
        forgoneDiscount: 0,
        note: `${calc.inputs.maxirataMonths}m + ${calc.inputs.refinanceMonths}m rifinanziamento`,
      },
    ];
  }, [calc]);

  // Dati filtrati Tab 3: Piano di Ammortamento
  const filteredTimeline = useMemo(() => {
    return calc.timeline.filter((pt) => {
      if (tableFilter === 'until_maxirata') {
        return pt.month <= maxirataMonth;
      }
      if (tableFilter === 'yearly') {
        return (
          pt.month === 0 ||
          pt.month % 12 === 0 ||
          pt.month === maxirataMonth ||
          pt.month === calc.horizonMonths
        );
      }
      return true;
    });
  }, [calc.timeline, tableFilter, maxirataMonth, calc.horizonMonths]);

  const formatYAxisEuro = (val: number) => {
    if (val === 0) return '0 €';
    if (Math.abs(val) >= 1000) {
      return `${(val / 1000).toLocaleString('it-IT', { maximumFractionDigits: 1 })}k €`;
    }
    return `${val} €`;
  };

  return (
    <section
      aria-label="Analisi Approfondita e Piano di Ammortamento"
      className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6"
    >
      {/* Header & Selettore 3 Tab */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500">
            Analisi quantitativa &amp; flussi di cassa
          </span>
          <h2 className="mt-0.5 text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Confronto Temporale, Scomposizione Costi e Ammortamento
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Viste di approfondimento"
          className="flex flex-wrap sm:inline-flex gap-1.5 rounded-xl bg-slate-100/90 p-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'timeline'}
            onClick={() => setActiveTab('timeline')}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span className="hidden sm:inline">Evoluzione Esborsi &amp; Crescita Salvadanaio {instrumentName}</span>
            <span className="sm:hidden">1. Grafico Timeline</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'breakdown'}
            onClick={() => setActiveTab('breakdown')}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Scomposizione Costi (Prezzo vs Interessi vs {instrumentName})</span>
            <span className="sm:hidden">2. Scomposizione Costi</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'table'}
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Table className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">Piano di Ammortamento &amp; Accumulo {instrumentName} (Mese per Mese)</span>
            <span className="sm:hidden">3. Tabella Ammortamento</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EVOLUZIONE ESBORSI & CRESCITA SALVADANAIO */}
      {activeTab === 'timeline' && (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
            <div>
              Orizzonte temporale analizzato:{' '}
              <strong className="font-semibold text-slate-900 tabular-nums">
                0 – {calc.horizonMonths} mesi
              </strong>{' '}
              ({(calc.horizonMonths / 12).toFixed(1).replace('.0', '')} anni). L&apos;area verde
              acqua mostra la crescita progressiva del{' '}
              <strong className="font-semibold text-teal-700">Salvadanaio {instrumentName}</strong> fino a
              coprire il 100% della Maxirata ({formatEuro(calc.maxirata.maxirataAmount)}) al mese{' '}
              <span className="font-semibold text-slate-900 tabular-nums">{maxirataMonth}</span>.
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-teal-800">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-600" />
              <span>
                Rendimento {instrumentName} Netto:{' '}
                <strong className="tabular-nums">{formatPercent(calc.netAnnualBtpYield)}</strong>/anno
              </span>
            </div>
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={calc.timeline}
                margin={{ top: 18, right: 20, left: 8, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="btpAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickFormatter={(m: number) => `M${m}`}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxisEuro}
                  width={65}
                />
                <Tooltip
                  content={<TimelineCustomTooltip maxirataMonth={maxirataMonth} />}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                />

                <ReferenceLine
                  x={maxirataMonth}
                  stroke="#0D9488"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Scadenza Maxirata',
                    position: 'insideTopRight',
                    fill: '#0F766E',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="btpFundBalance"
                  name={`Saldo Salvadanaio ${instrumentName}`}
                  stroke="#0D9488"
                  strokeWidth={2}
                  fill="url(#btpAreaFill)"
                  fillOpacity={0.15}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cashCumulativeOut"
                  name="Esborso Contanti"
                  stroke="#059669"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="standardCumulativeOut"
                  name="Esborso Cum. Standard"
                  stroke="#1d5fbf"
                  strokeWidth={2.2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="maxirataWithBtpCumulativeOut"
                  name={`Esborso Cum. Maxirata + ${instrumentName}`}
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="maxirataRefinancedCumulativeOut"
                  name="Esborso Maxirata Rifinanziata"
                  stroke="#E11D48"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Pillole riassuntive chiave sotto il grafico */}
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span>Esborso Contanti (Mese 0)</span>
              </div>
              <p className="mt-1 text-base font-bold text-slate-900 tabular-nums">
                {formatEuro(calc.cash.totalOutOfPocket)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Liquidità immobilizzata subito per intero
              </p>
            </div>

            <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Fine Finanz. Standard (M{calc.inputs.standardMonths})</span>
              </div>
              <p className="mt-1 text-base font-bold text-slate-900 tabular-nums">
                {formatEuro(calc.standard.totalOutOfPocket)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Costo reale netto: {formatEuro(calc.standard.realNetCost)}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                <span>Maxirata + {instrumentName} (M{maxirataMonth})</span>
              </div>
              <p className="mt-1 text-base font-bold text-slate-900 tabular-nums">
                {formatEuro(calc.maxirata.totalOutOfPocketWithBtp)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Include versamenti PAC {instrumentName} da{' '}
                {formatEuro(calc.maxirata.btpAccumulator.monthlySavingsRequired)}/mese
              </p>
            </div>

            <div className="rounded-xl border border-teal-200/70 bg-teal-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                <span>Target Salvadanaio {instrumentName} (M{maxirataMonth})</span>
              </div>
              <p className="mt-1 text-base font-bold text-teal-900 tabular-nums">
                {formatEuro(calc.maxirata.maxirataAmount)}
              </p>
              <p className="mt-0.5 text-[11px] text-teal-700">
                Di cui +{formatEuro(calc.maxirata.btpAccumulator.totalNetInterestEarned)} generati
                da interessi {instrumentName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCOMPOSIZIONE COSTI (PREZZO VS INTERESSI VS BTP) */}
      {activeTab === 'breakdown' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
            <div>
              Confronto diretto delle componenti di costo per ciascuna opzione:{' '}
              <strong className="font-semibold text-slate-800">Prezzo Netto Auto</strong>,{' '}
              <strong className="font-semibold text-rose-600">Interessi &amp; Spese</strong> e{' '}
              <strong className="font-semibold text-emerald-600">
                Rendimento / Risparmio Netto {instrumentName}
              </strong>
              .
            </div>
            <div className="text-[11px] text-slate-500">
              Sconto Finanziamento applicato:{' '}
              <strong className="font-semibold text-slate-800 tabular-nums">
                {formatEuro(calc.inputs.financingDiscount)}
              </strong>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={breakdownData}
                margin={{ top: 16, right: 20, left: 8, bottom: 8 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxisEuro}
                  width={65}
                />
                <Tooltip content={<BreakdownCustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="square"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                />
                <Bar
                  dataKey="prezzoNettoAuto"
                  name="Prezzo Netto Auto"
                  fill="#334155"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="interessiESpese"
                  name="Interessi & Spese Finanziamento"
                  fill="#E11D48"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="rendimentoBtp"
                  name={`Risparmio / Rendimento Netto ${instrumentName}`}
                  fill="#2e7d32"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Griglia riassuntiva sintetica con i 4 totali a confronto */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {breakdownData.map((item, index) => {
              const isRefi = index === 3;
              const isMaxiBtp = index === 2;
              return (
                <div
                  key={item.option}
                  className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                    isMaxiBtp
                      ? 'border-teal-200 bg-teal-50/30'
                      : isRefi
                        ? 'border-rose-200/80 bg-rose-50/20'
                        : 'border-slate-200/80 bg-slate-50/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase">
                        {item.option}
                      </h3>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200/80">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{item.note}</p>

                    <dl className="mt-3.5 space-y-1.5 border-t border-slate-200/60 pt-3 text-xs">
                      <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Prezzo Netto Auto:</dt>
                        <dd className="font-medium text-slate-800 tabular-nums">
                          {formatEuro(item.prezzoNettoAuto)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Interessi &amp; Spese:</dt>
                        <dd className="font-medium text-rose-600 tabular-nums">
                          +{formatEuro(item.interessiESpese)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Beneficio Netto {instrumentName}:</dt>
                        <dd className="font-medium text-emerald-600 tabular-nums">
                          {item.rendimentoBtp > 0 ? `-${formatEuro(item.rendimentoBtp)}` : '0 €'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-4 border-t border-slate-200/80 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        Costo Reale Netto
                      </span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {formatEuro(item.realNetCost)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between text-[11px] text-slate-500">
                      <span>Esborso di tasca:</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {formatEuro(item.outOfPocket)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PIANO DI AMMORTAMENTO & ACCUMULO BTP (MESE PER MESE) */}
      {activeTab === 'table' && (
        <div className="mt-6 space-y-4">
          {/* Barra controlli: Filtro Righe, Filtro Colonne e Bottone Esporta CSV */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Mesi:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setTableFilter('all')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    tableFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tutti (0..{calc.horizonMonths})
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter('until_maxirata')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    tableFilter === 'until_maxirata'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fino a Maxirata (0..{maxirataMonth})
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter('yearly')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    tableFilter === 'yearly'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Snodi Annuali
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-600">Colonne:</span>
              <div className="flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => setColumnFocus('all')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    columnFocus === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tutte
                </button>
                <button
                  type="button"
                  onClick={() => setColumnFocus('btp_focus')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    columnFocus === 'btp_focus'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Focus Salvadanaio {instrumentName}
                </button>
                <button
                  type="button"
                  onClick={() => setColumnFocus('debt_focus')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    columnFocus === 'debt_focus'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Focus Debito
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => exportTimelineToCsv(calc.timeline, calc.inputs.scenarioName)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99] w-full sm:w-auto"
            >
              <Download className="h-3.5 w-3.5 text-teal-600" />
              <span>Esporta CSV</span>
            </button>
          </div>

          {/* Hint mobile per scorrimento */}
          <div className="sm:hidden text-[11px] text-slate-400 flex items-center gap-1 px-1">
            <span>Scorri la tabella in orizzontale &rarr;</span>
          </div>

          {/* Tabella con header sticky e tabular-nums */}
          <div className="max-h-[460px] overflow-auto rounded-xl border border-slate-200/90">
            <table className="w-full min-w-[700px] border-collapse text-left text-xs tabular-nums">
              <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-semibold text-slate-700">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-3 pl-4">Mese</th>
                  {columnFocus !== 'btp_focus' && (
                    <>
                      <th className="px-3 py-3 text-right">Esborso Contanti</th>
                      <th className="px-3 py-3 text-right">Esborso Cum. Standard</th>
                      <th className="px-3 py-3 text-right">Debito Residuo Std</th>
                    </>
                  )}
                  <th className="px-3 py-3 text-right">Esborso Cum. Maxirata+{instrumentName}</th>
                  {columnFocus !== 'debt_focus' && (
                    <>
                      <th className="px-3 py-3 text-right">Capitale Versato {instrumentName}</th>
                      <th className="px-3 py-3 text-right">Interessi {instrumentName} Maturati</th>
                    </>
                  )}
                  <th className="py-3 pr-4 pl-3 text-right">Saldo Totale Salvadanaio {instrumentName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTimeline.map((pt) => {
                  const isMaxirataTargetMonth = pt.month === maxirataMonth;
                  const cumulativeBtpInterest = Math.max(
                    0,
                    pt.btpFundBalance - pt.btpPrincipalCumulative
                  );

                  return (
                    <tr
                      key={pt.month}
                      className={`transition-colors ${
                        isMaxirataTargetMonth
                          ? 'bg-emerald-50/80 font-semibold text-slate-900'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 pr-3 pl-4 font-semibold whitespace-nowrap text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>Mese {pt.month}</span>
                          {isMaxirataTargetMonth && (
                            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              100% Maxirata
                            </span>
                          )}
                        </div>
                      </td>

                      {columnFocus !== 'btp_focus' && (
                        <>
                          <td className="px-3 py-2.5 text-right text-slate-600">
                            {formatEuro(pt.cashCumulativeOut, 0)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium text-blue-700">
                            {formatEuro(pt.standardCumulativeOut, 0)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-500">
                            {formatEuro(pt.standardRemainingDebt, 0)}
                          </td>
                        </>
                      )}

                      <td className="px-3 py-2.5 text-right font-medium text-amber-700">
                        {formatEuro(pt.maxirataWithBtpCumulativeOut, 0)}
                      </td>

                      {columnFocus !== 'debt_focus' && (
                        <>
                          <td className="px-3 py-2.5 text-right text-slate-700">
                            {formatEuro(pt.btpPrincipalCumulative, 0)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium text-emerald-700">
                            +{formatEuro(cumulativeBtpInterest, 2)}
                          </td>
                        </>
                      )}

                      <td className="py-2.5 pr-4 pl-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <span
                            className={`font-bold ${
                              isMaxirataTargetMonth ? 'text-emerald-800' : 'text-teal-700'
                            }`}
                          >
                            {formatEuro(pt.btpFundBalance, 0)}
                          </span>
                          {isMaxirataTargetMonth && (
                            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-600/30">
                              Target Raggiunto
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
