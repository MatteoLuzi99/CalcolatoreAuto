import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, TrendingUp, BarChart3, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { FullCalculationOutput } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';

export interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calc: FullCalculationOutput;
}

export function PdfReportModal({ isOpen, onClose, calc }: PdfReportModalProps) {
  if (!isOpen) return null;

  const { inputs, cash, standard, maxirataNoBtp, maxirata, verdict, timeline } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';
  const printDate = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  // Milestone temporali chiave per la pagina 2
  const m0 = timeline[0] || { month: 0, cashCumulativeOut: 0, standardCumulativeOut: 0, maxirataWithBtpCumulativeOut: 0, standardRemainingDebt: 0, btpFundBalance: 0 };
  const m12 = timeline[Math.min(12, timeline.length - 1)] || m0;
  const m24 = timeline[Math.min(24, timeline.length - 1)] || m0;
  const mFinal = timeline[Math.min(inputs.maxirataMonths, timeline.length - 1)] || m0;

  // Massimo per la scala visiva dei grafici a barre
  const maxBarTotal = Math.max(
    cash.totalOutOfPocket,
    standard.totalOutOfPocket,
    maxirataNoBtp.totalOutOfPocket,
    maxirata.totalOutOfPocketWithBtp,
    1
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 overflow-y-auto print:static print:inset-auto print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:w-full print:max-w-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 my-auto text-slate-800 animate-in fade-in zoom-in-95 duration-200 print:m-0 print:p-0 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h2 id="pdf-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Report di Perizia Preventivo Auto (PDF Multi-Pagina)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Pagina 1: Matrice Comparativa Completa &bull; Pagina 2: Grafici Visivi, Ammortamento &amp; Negoziazione
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Salva in PDF / Stampa (2 Pagine)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi anteprima"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DOSSIER CONTENT                                                   */}
        {/* ================================================================= */}
        <div id="printable-report" className="space-y-8 pt-4">

          {/* =============================================================== */}
          {/* PAGINA 1: PERIZIA & MATRICE COMPARATIVA DELLE 4 OPZIONI          */}
          {/* =============================================================== */}
          <div className="space-y-5 print-avoid-break">
            {/* Header Report */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                    AF
                  </div>
                  <div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                      AutoFin BTP
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Perizia Finanziaria Indipendente Acquisto Auto
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-800">Data documento:</span> {printDate}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Veicolo esaminato:</span>{' '}
                  <span className="font-bold text-slate-900">
                    {inputs.scenarioName || 'Autovettura Nuova'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Prezzo Listino Contanti:</span>{' '}
                  <span className="font-bold text-slate-900">{formatEuro(inputs.carPriceCash)}</span>
                </div>
              </div>
            </div>

            {/* Dati Sintetici del Preventivo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Sconto Concessionaria</span>
                <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                  {inputs.financingDiscount > 0 ? `-${formatEuro(inputs.financingDiscount)}` : '0 €'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Anticipo + Permuta</span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                  {formatEuro(inputs.downPaymentCash + inputs.tradeInValue)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Maxirata Finale VFG</span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                  {formatEuro(maxirata.maxirataAmount)} ({maxirata.maxirataPercent}%)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Salvadanaio Scelto</span>
                <span className="text-sm font-extrabold text-emerald-900 tabular-nums">
                  {instrumentName} ({inputs.btpGrossYield}% lordo)
                </span>
              </div>
            </div>

            {/* Sintesi Verdetto Vincente */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Award className="w-4 h-4 text-blue-700" />
                  <span>Opzione Raccomandata dalla Matematica Finanziaria</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-700 text-white">
                  Risparmio Netto + {formatEuro(verdict.savingsVsRunnerUp)}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {verdict.winnerLabel}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {verdict.explanation}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                <span>TAEG massimo di break-even rispetto ai contanti: <strong>{verdict.breakEvenTaeg}%</strong></span>
                <span>Vantaggio vs opzione peggiore: <strong>+{formatEuro(verdict.savingsVsWorst)}</strong></span>
              </div>
            </div>

            {/* Tabella Comparativa delle 4 Opzioni */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>1. Matrice di Confronto Completa (4 Opzioni a Confronto Diretto)</span>
                <span className="text-[10px] font-normal text-slate-500">Valori calcolati al centesimo</span>
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-x-auto print:overflow-visible">
                <table className="w-full min-w-[540px] print:min-w-0 text-xs text-left tabular-nums">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2">Parametro / Voce di Spesa</th>
                      <th className="p-2 text-right">1. Contanti</th>
                      <th className="p-2 text-right">2. Finanziamento Std</th>
                      <th className="p-2 text-right">3. Maxirata No {instrumentName}</th>
                      <th className="p-2 text-right bg-emerald-50 text-emerald-950 font-extrabold">
                        4. Maxirata + {instrumentName}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                    <tr>
                      <td className="p-2 font-medium">Prezzo Auto Applicato</td>
                      <td className="p-2 text-right">{formatEuro(inputs.carPriceCash)}</td>
                      <td className="p-2 text-right">{formatEuro(standard.carPricePromo)}</td>
                      <td className="p-2 text-right">{formatEuro(maxirataNoBtp.carPricePromo)}</td>
                      <td className="p-2 text-right bg-emerald-50/40 font-semibold">{formatEuro(maxirata.carPricePromo)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Sconto Concessionaria Maxirata</td>
                      <td className="p-2 text-right text-slate-400">0 €</td>
                      <td className="p-2 text-right text-emerald-700 font-semibold">
                        {standard.appliedDiscount > 0 ? `-${formatEuro(standard.appliedDiscount)}` : '0 €'}
                      </td>
                      <td className="p-2 text-right text-emerald-700 font-semibold">-{formatEuro(inputs.financingDiscount)}</td>
                      <td className="p-2 text-right bg-emerald-50/40 text-emerald-700 font-bold">-{formatEuro(inputs.financingDiscount)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Anticipo Totale (Cash + Permuta)</td>
                      <td className="p-2 text-right">{formatEuro(cash.tradeInValue + inputs.downPaymentCash)}</td>
                      <td className="p-2 text-right">{formatEuro(standard.upfrontCash + standard.tradeInValue)}</td>
                      <td className="p-2 text-right">{formatEuro(maxirataNoBtp.upfrontCash + maxirataNoBtp.tradeInValue)}</td>
                      <td className="p-2 text-right bg-emerald-50/40">{formatEuro(maxirata.upfrontCash + maxirata.tradeInValue)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Rata Finanziaria 1° Periodo</td>
                      <td className="p-2 text-right text-slate-400">0 €/m</td>
                      <td className="p-2 text-right font-semibold text-blue-700">
                        {formatEuro(standard.monthlyInstallmentTotal, 2)}/m ({inputs.standardMonths}m)
                      </td>
                      <td className="p-2 text-right font-semibold text-slate-800">
                        {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)}/m ({maxirataNoBtp.interimInstallmentsCount}m)
                      </td>
                      <td className="p-2 text-right bg-emerald-50/40 font-semibold text-amber-800">
                        {formatEuro(maxirata.monthlyFinancingPaymentWithFees, 2)}/m ({maxirata.interimInstallmentsCount}m)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Quota Mensile Salvadanaio {instrumentName}</td>
                      <td className="p-2 text-right text-slate-400">0 €/m</td>
                      <td className="p-2 text-right text-slate-400">0 €/m</td>
                      <td className="p-2 text-right text-slate-400">0 €/m</td>
                      <td className="p-2 text-right bg-emerald-50/40 font-bold text-emerald-700">
                        +{formatEuro(maxirata.effectiveMonthlyBtpSavings, 2)}/m
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Gestione Maxirata a Scadenza (M{inputs.maxirataMonths})</td>
                      <td className="p-2 text-right text-slate-400">Nessuna</td>
                      <td className="p-2 text-right text-slate-400">Nessuna</td>
                      <td className="p-2 text-right text-slate-800 font-semibold">
                        {inputs.maxirataNoBtpMode === 'pay_cash'
                          ? `Saldo cash ${formatEuro(maxirataNoBtp.maxirataAmount)}`
                          : `Rifinanz. ${formatEuro(maxirataNoBtp.monthlyInstallment2ndPeriod, 2)}/m (${inputs.refinanceMonths}m)`}
                      </td>
                      <td className="p-2 text-right bg-emerald-50/40 font-semibold text-emerald-900">
                        {maxirata.gapAmount > 10
                          ? `Fondo ${formatEuro(maxirata.accumulatedBtpAtMaturity)} + Rifinanz. Gap ${formatEuro(maxirata.gapRefinancedMonthly, 2)}/m`
                          : `100% Saldata dal Fondo ${instrumentName} (${formatEuro(maxirata.accumulatedBtpAtMaturity)})`}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Totale Interessi Passivi &amp; Oneri</td>
                      <td className="p-2 text-right font-semibold text-emerald-700">0 €</td>
                      <td className="p-2 text-right text-rose-700 font-medium">+{formatEuro(standard.totalInterestAndFees)}</td>
                      <td className="p-2 text-right text-rose-700 font-medium">+{formatEuro(maxirataNoBtp.totalInterestAndFees)}</td>
                      <td className="p-2 text-right bg-emerald-50/40 text-rose-700 font-medium">
                        +{formatEuro(maxirata.totalInterestAndFees1stPeriod + maxirata.gapRefinancedExtraInterest)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Interessi Netti Guadagnati ({instrumentName})</td>
                      <td className="p-2 text-right text-slate-400">0 €</td>
                      <td className="p-2 text-right text-slate-400">0 €</td>
                      <td className="p-2 text-right text-slate-400">0 €</td>
                      <td className="p-2 text-right bg-emerald-50/40 font-bold text-emerald-700">
                        -{formatEuro(maxirata.btpAccumulator.totalNetInterestEarned)}
                      </td>
                    </tr>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                      <td className="p-2">Esborso Vivo Totale Uscito dal Conto</td>
                      <td className="p-2 text-right">{formatEuro(cash.totalOutOfPocket)}</td>
                      <td className="p-2 text-right">{formatEuro(standard.totalOutOfPocket)}</td>
                      <td className="p-2 text-right">{formatEuro(maxirataNoBtp.totalOutOfPocket)}</td>
                      <td className="p-2 text-right bg-emerald-100/70 text-emerald-950 font-extrabold">
                        {formatEuro(maxirata.totalOutOfPocketWithBtp)}
                      </td>
                    </tr>
                    <tr className="bg-slate-900 text-white font-extrabold text-xs">
                      <td className="p-2">Costo Reale Netto (con rendimenti {instrumentName})</td>
                      <td className="p-2 text-right text-emerald-400">{formatEuro(cash.realNetCost)}</td>
                      <td className="p-2 text-right text-blue-300">{formatEuro(standard.realNetCost)}</td>
                      <td className="p-2 text-right text-slate-300">{formatEuro(maxirataNoBtp.realNetCost)}</td>
                      <td className="p-2 text-right text-amber-300 font-black">
                        {formatEuro(maxirata.realNetCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Piede Pagina 1 */}
            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200">
              <span>AutoFin BTP &bull; Pagina 1 di 2</span>
              <span>Continua a Pagina 2 con Grafici di Scomposizione Costi &amp; Piano di Accumulo &rarr;</span>
            </div>
          </div>


          {/* =============================================================== */}
          {/* PAGINA 2: GRAFICI VISIVI, SCOMPOSIZIONE COSTI & AMMORTAMENTO      */}
          {/* =============================================================== */}
          <div className="print-page-break space-y-5 pt-4 print:pt-0">
            {/* Header Pagina 2 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                  2. Scomposizione Grafica dei Costi &amp; Piano di Accumulo
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Veicolo: {inputs.scenarioName || 'Autovettura Preventivo'}
              </span>
            </div>

            {/* GRAFICO VISIVO A BARRE SCOMPOSIZIONE COSTI */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Grafico visivo: dove vanno i tuoi soldi nelle 4 opzioni?
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-700 inline-block" /> Prezzo Netto Auto
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" /> Interessi &amp; Oneri
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Rendimento {instrumentName}
                  </span>
                </div>
              </div>

              {/* Barre Orizzontali Proporzionali ad Alta Precisione */}
              <div className="space-y-3 text-xs">
                {/* 1. Contanti */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>1. Acquisto in Contanti</span>
                    <span className="font-extrabold tabular-nums">{formatEuro(cash.totalOutOfPocket)}</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, (cash.totalOutOfPocket / maxBarTotal) * 100)}%` }}
                      className="bg-slate-700 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      Prezzo 100%
                    </div>
                  </div>
                </div>

                {/* 2. Finanziamento Standard */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>2. Finanziamento Standard (Rate Costanti)</span>
                    <span className="font-extrabold tabular-nums text-blue-700">{formatEuro(standard.totalOutOfPocket)}</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden flex">
                    <div
                      style={{ width: `${(standard.carPricePromo / maxBarTotal) * 100}%` }}
                      className="bg-slate-700 h-full text-[10px] text-white flex items-center justify-center font-bold"
                      title="Prezzo Auto Promo"
                    >
                      Auto
                    </div>
                    <div
                      style={{ width: `${(standard.totalInterestAndFees / maxBarTotal) * 100}%` }}
                      className="bg-rose-600 h-full text-[10px] text-white flex items-center justify-center font-bold"
                      title="Interessi e spese"
                    >
                      +{formatEuro(standard.totalInterestAndFees)}
                    </div>
                  </div>
                </div>

                {/* 3. Maxirata Senza Strumento */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>3. Maxirata Senza {instrumentName} ({inputs.maxirataNoBtpMode === 'pay_cash' ? 'Saldo Cash' : 'Rifinanziata'})</span>
                    <span className="font-extrabold tabular-nums text-slate-800">{formatEuro(maxirataNoBtp.totalOutOfPocket)}</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden flex">
                    <div
                      style={{ width: `${(maxirataNoBtp.carPricePromo / maxBarTotal) * 100}%` }}
                      className="bg-slate-700 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      Auto
                    </div>
                    <div
                      style={{ width: `${(maxirataNoBtp.totalInterestAndFees / maxBarTotal) * 100}%` }}
                      className="bg-rose-600 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      +{formatEuro(maxirataNoBtp.totalInterestAndFees)}
                    </div>
                  </div>
                </div>

                {/* 4. Maxirata + Strumento */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-emerald-900 font-bold">4. Maxirata + Salvadanaio {instrumentName} (Consigliata)</span>
                    <span className="font-extrabold tabular-nums text-emerald-800">{formatEuro(maxirata.totalOutOfPocketWithBtp)}</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden flex">
                    <div
                      style={{ width: `${(maxirata.carPricePromo / maxBarTotal) * 100}%` }}
                      className="bg-slate-700 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      Auto
                    </div>
                    <div
                      style={{ width: `${(maxirata.totalInterestAndFees1stPeriod / maxBarTotal) * 100}%` }}
                      className="bg-rose-600 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      +{formatEuro(maxirata.totalInterestAndFees1stPeriod)}
                    </div>
                    <div
                      style={{ width: `${(maxirata.btpAccumulator.totalNetInterestEarned / maxBarTotal) * 100}%` }}
                      className="bg-emerald-500 h-full text-[10px] text-white flex items-center justify-center font-bold"
                    >
                      -{formatEuro(maxirata.btpAccumulator.totalNetInterestEarned)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABELLA MILESTONES EVOLUZIONE SALVADANAIO VS DEBITO RESIDUO */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
                <span>Evoluzione Temporale: Salvadanaio {instrumentName} vs Debito Residuo</span>
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-x-auto print:overflow-visible">
                <table className="w-full min-w-[540px] print:min-w-0 text-xs text-left tabular-nums">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2">Momento Temporale</th>
                      <th className="p-2 text-right">Esborso Contanti</th>
                      <th className="p-2 text-right">Esborso Standard</th>
                      <th className="p-2 text-right">Debito Residuo Std</th>
                      <th className="p-2 text-right text-emerald-800 bg-emerald-50">Saldo Salvadanaio {instrumentName}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                    <tr>
                      <td className="p-2 font-bold">Mese 0 (Stipula &amp; Anticipo)</td>
                      <td className="p-2 text-right font-medium">{formatEuro(m0.cashCumulativeOut)}</td>
                      <td className="p-2 text-right font-medium">{formatEuro(m0.standardCumulativeOut)}</td>
                      <td className="p-2 text-right text-rose-700 font-semibold">{formatEuro(m0.standardRemainingDebt)}</td>
                      <td className="p-2 text-right bg-emerald-50/50 font-bold text-emerald-800">{formatEuro(m0.btpFundBalance)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">Mese 12 (Fine 1° Anno)</td>
                      <td className="p-2 text-right">{formatEuro(m12.cashCumulativeOut)}</td>
                      <td className="p-2 text-right">{formatEuro(m12.standardCumulativeOut)}</td>
                      <td className="p-2 text-right text-rose-700">{formatEuro(m12.standardRemainingDebt)}</td>
                      <td className="p-2 text-right bg-emerald-50/50 font-bold text-emerald-800">{formatEuro(m12.btpFundBalance)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">Mese 24 (Fine 2° Anno)</td>
                      <td className="p-2 text-right">{formatEuro(m24.cashCumulativeOut)}</td>
                      <td className="p-2 text-right">{formatEuro(m24.standardCumulativeOut)}</td>
                      <td className="p-2 text-right text-rose-700">{formatEuro(m24.standardRemainingDebt)}</td>
                      <td className="p-2 text-right bg-emerald-50/50 font-bold text-emerald-800">{formatEuro(m24.btpFundBalance)}</td>
                    </tr>
                    <tr className="bg-emerald-100/70 font-extrabold text-emerald-950">
                      <td className="p-2">Mese {inputs.maxirataMonths} (Scadenza Maxirata / Riscatto)</td>
                      <td className="p-2 text-right">{formatEuro(mFinal.cashCumulativeOut)}</td>
                      <td className="p-2 text-right">{formatEuro(mFinal.standardCumulativeOut)}</td>
                      <td className="p-2 text-right">{formatEuro(mFinal.standardRemainingDebt)}</td>
                      <td className="p-2 text-right font-black text-emerald-900 bg-emerald-200/80">
                        {formatEuro(maxirata.accumulatedBtpAtMaturity)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* VADEMECUM & CHECKLIST DI TRATTATIVA IN CONCESSIONARIA */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Vademecum: 3 cose da verificare prima di firmare in concessionaria</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-700 leading-snug">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Polizze Facoltative</span>
                  Verifica nel prospetto SECCI che polizze CPI, marchiatura vetri o furto non siano state inserite come obbligatorie nel finanziamento.
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">2. TAN vs TAEG</span>
                  I venditori pubblicizzano il TAN (es. 0% o 3.99%), ma il costo effettivo reale è il TAEG (che include istruttoria, incasso e imposta).
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">3. Evita il Rifinanziamento</span>
                  Non farti trovare senza liquidità al mese {inputs.maxirataMonths}: impostando subito il salvadanaio {instrumentName} eviti il rifinanziamento a tassi usurari.
                </div>
              </div>
            </div>

            {/* Footer Finale di Pagina 2 */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulazione indipendente calcolata interamente in locale nel browser &bull; Privacy 100% tutelata</span>
              </div>
              <div>AutoFin BTP &bull; Pagina 2 di 2 &bull; Documento ad uso informativo ed educativo ex TUF / MIFID II</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
