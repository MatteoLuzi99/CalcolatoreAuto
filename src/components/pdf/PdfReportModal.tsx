import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, Car } from 'lucide-react';
import { FullCalculationOutput } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';

export interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calc: FullCalculationOutput;
}

export function PdfReportModal({ isOpen, onClose, calc }: PdfReportModalProps) {
  if (!isOpen) return null;

  const { inputs, cash, standard, maxirataNoBtp, maxirata, verdict } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';
  const printDate = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 my-auto text-slate-800 animate-in fade-in zoom-in-95 duration-200 print:m-0 print:p-0 print:border-none print:shadow-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h2 id="pdf-modal-title" className="text-lg font-bold text-slate-900">
                Report di Perizia Preventivo Auto (PDF)
              </h2>
              <p className="text-xs text-slate-500">
                Anteprima pronta per il salvataggio in formato PDF o stampa A4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Salva in PDF / Stampa</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi anteprima"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PRINTABLE DOSSIER CONTENT                                         */}
        {/* ================================================================= */}
        <div id="printable-report" className="pt-6 space-y-6">
          {/* Header Report */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                  AF
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  AutoFin BTP
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Perizia Indipendente
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Confronto matematico imparziale sul costo reale di acquisto dell’auto
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
              <div>
                <span className="font-semibold text-slate-800">Data perizia:</span> {printDate}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Modello veicolo:</span>{' '}
                <span className="font-bold text-slate-900">
                  {inputs.scenarioName || 'Autovettura Preventivo'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Prezzo listino:</span>{' '}
                <span className="font-bold text-slate-900">{formatEuro(inputs.carPriceCash)}</span>
              </div>
            </div>
          </div>

          {/* Sintesi Verdetto */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Opzione Più Conveniente</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Risparmio + {formatEuro(verdict.savingsVsRunnerUp)}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {verdict.winnerLabel}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {verdict.explanation}
            </p>
          </div>

          {/* Tabella Comparativa delle 4 Opzioni */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Matrice di Confronto Completa (4 Opzioni a Confronto)
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left tabular-nums">
                <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Parametro / Voce di Spesa</th>
                    <th className="p-2.5 text-right">1. Contanti</th>
                    <th className="p-2.5 text-right">2. Finanziamento Std</th>
                    <th className="p-2.5 text-right">3. Maxirata No {instrumentName}</th>
                    <th className="p-2.5 text-right bg-emerald-50 text-emerald-900">
                      4. Maxirata + {instrumentName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Prezzo Auto Applicato</td>
                    <td className="p-2.5 text-right">{formatEuro(inputs.carPriceCash)}</td>
                    <td className="p-2.5 text-right">{formatEuro(standard.carPricePromo)}</td>
                    <td className="p-2.5 text-right">{formatEuro(maxirataNoBtp.carPricePromo)}</td>
                    <td className="p-2.5 text-right bg-emerald-50/40 font-semibold">
                      {formatEuro(maxirata.carPricePromo)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Extra Sconto Finanziamento</td>
                    <td className="p-2.5 text-right text-slate-400">0 €</td>
                    <td className="p-2.5 text-right text-emerald-700 font-semibold">
                      {standard.appliedDiscount > 0 ? `- ${formatEuro(standard.appliedDiscount)}` : '0 €'}
                    </td>
                    <td className="p-2.5 text-right text-emerald-700 font-semibold">
                      - {formatEuro(inputs.financingDiscount)}
                    </td>
                    <td className="p-2.5 text-right bg-emerald-50/40 text-emerald-700 font-semibold">
                      - {formatEuro(inputs.financingDiscount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Anticipo Totale (Cash + Permuta)</td>
                    <td className="p-2.5 text-right">{formatEuro(cash.tradeInValue)}</td>
                    <td className="p-2.5 text-right">
                      {formatEuro(standard.upfrontCash + standard.tradeInValue)}
                    </td>
                    <td className="p-2.5 text-right">
                      {formatEuro(maxirataNoBtp.upfrontCash + maxirataNoBtp.tradeInValue)}
                    </td>
                    <td className="p-2.5 text-right bg-emerald-50/40">
                      {formatEuro(maxirata.upfrontCash + maxirata.tradeInValue)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Rata Mensile 1° Periodo</td>
                    <td className="p-2.5 text-right text-slate-400">0 €/m</td>
                    <td className="p-2.5 text-right font-semibold text-blue-700">
                      {formatEuro(standard.monthlyInstallmentTotal, 2)}/m ({inputs.standardMonths}m)
                    </td>
                    <td className="p-2.5 text-right font-semibold text-purple-700">
                      {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)}/m ({maxirataNoBtp.interimInstallmentsCount}m)
                    </td>
                    <td className="p-2.5 text-right bg-emerald-50/40 font-semibold text-amber-800">
                      {formatEuro(maxirata.monthlyFinancingPaymentWithFees, 2)}/m
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Quota Mensile Salvadanaio {instrumentName}</td>
                    <td className="p-2.5 text-right text-slate-400">0 €/m</td>
                    <td className="p-2.5 text-right text-slate-400">0 €/m</td>
                    <td className="p-2.5 text-right text-slate-400">0 €/m</td>
                    <td className="p-2.5 text-right bg-emerald-50/40 font-bold text-emerald-700">
                      + {formatEuro(maxirata.effectiveMonthlyBtpSavings, 2)}/m
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Gestione Maxirata a Scadenza</td>
                    <td className="p-2.5 text-right text-slate-400">Nessuna</td>
                    <td className="p-2.5 text-right text-slate-400">Nessuna</td>
                    <td className="p-2.5 text-right text-purple-900 font-semibold">
                      {inputs.maxirataNoBtpMode === 'pay_cash'
                        ? `Saldo cash ${formatEuro(maxirataNoBtp.maxirataAmount)}`
                        : `Rifinanz. ${formatEuro(maxirataNoBtp.monthlyInstallment2ndPeriod, 2)}/m (${inputs.refinanceMonths}m)`}
                    </td>
                    <td className="p-2.5 text-right bg-emerald-50/40 font-semibold">
                      {maxirata.gapAmount > 10
                        ? `Fondo ${formatEuro(maxirata.accumulatedBtpAtMaturity)} + Rifinanz. Gap ${formatEuro(maxirata.gapRefinancedMonthly, 2)}/m`
                        : `100% Saldata da ${instrumentName} (${formatEuro(maxirata.accumulatedBtpAtMaturity)})`}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Totale Interessi &amp; Spese Accessorie</td>
                    <td className="p-2.5 text-right font-semibold text-emerald-700">0 €</td>
                    <td className="p-2.5 text-right text-rose-700">
                      + {formatEuro(standard.totalInterestAndFees)}
                    </td>
                    <td className="p-2.5 text-right text-rose-700">
                      + {formatEuro(maxirataNoBtp.totalInterestAndFees)}
                    </td>
                    <td className="p-2.5 text-right bg-emerald-50/40 text-rose-700">
                      + {formatEuro(maxirata.totalInterestAndFees1stPeriod + maxirata.gapRefinancedExtraInterest)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Interessi Netti Guadagnati ({instrumentName})</td>
                    <td className="p-2.5 text-right text-slate-400">0 €</td>
                    <td className="p-2.5 text-right text-slate-400">0 €</td>
                    <td className="p-2.5 text-right text-slate-400">0 €</td>
                    <td className="p-2.5 text-right bg-emerald-50/40 font-bold text-emerald-700">
                      - {formatEuro(maxirata.btpAccumulator.totalNetInterestEarned)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                    <td className="p-2.5">Esborso Vivo Totale Uscito dal Conto</td>
                    <td className="p-2.5 text-right">{formatEuro(cash.totalOutOfPocket)}</td>
                    <td className="p-2.5 text-right">{formatEuro(standard.totalOutOfPocket)}</td>
                    <td className="p-2.5 text-right">{formatEuro(maxirataNoBtp.totalOutOfPocket)}</td>
                    <td className="p-2.5 text-right bg-emerald-100/60 text-emerald-950 font-extrabold text-sm">
                      {formatEuro(maxirata.totalOutOfPocketWithBtp)}
                    </td>
                  </tr>
                  <tr className="bg-slate-900 text-white font-extrabold">
                    <td className="p-2.5">Costo Reale Netto (con rendimenti {instrumentName})</td>
                    <td className="p-2.5 text-right text-emerald-400">{formatEuro(cash.realNetCost)}</td>
                    <td className="p-2.5 text-right text-blue-300">{formatEuro(standard.realNetCost)}</td>
                    <td className="p-2.5 text-right text-purple-300">{formatEuro(maxirataNoBtp.realNetCost)}</td>
                    <td className="p-2.5 text-right text-amber-300 text-sm">
                      {formatEuro(maxirata.realNetCost)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dettagli Operativi per la Trattativa in Concessionaria */}
          <div className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              2. Punti di Attenzione per la Trattativa in Concessionaria
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-snug">
              <li>
                <span className="font-semibold">Spese Istruttoria e Incasso Rata:</span> Nel preventivo sono
                presenti spese di istruttoria ({formatEuro(inputs.originationFee)}) e incasso rata (
                {formatEuro(inputs.monthlyCollectionFee, 2)}/mese). Negozia l’azzeramento o la riduzione
                delle polizze facoltative marchiatura vetri o CPI non vincolanti.
              </li>
              <li>
                <span className="font-semibold">Maxirata Finale VFG:</span> Ricorda che ogni mese paghi
                interessi semplici sul capitale non ammortizzato della maxirata ({formatEuro(maxirata.maxirataAmount)}).
                Accantonare la quota mensile in {instrumentName} al {inputs.btpGrossYield}% lordo permette di
                neutralizzare questi costi grazie agli interessi netti maturati.
              </li>
            </ul>
          </div>

          {/* Footer del Report */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulazione calcolata interamente in locale nel browser dell&apos;utente.</span>
            </div>
            <div>Documento a scopo informativo ed educativo &bull; Non costituisce consulenza finanziaria ex TUF</div>
          </div>
        </div>
      </div>
    </div>
  );
}

