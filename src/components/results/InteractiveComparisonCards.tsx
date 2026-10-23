import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  CalculatorInputs,
  FullCalculationOutput,
  WinnerOptionId,
} from '../../types/calculator';
import { formatEuro } from '../../lib/storage';

export interface InteractiveComparisonCardsProps {
  calc: FullCalculationOutput;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  isSimpleMode?: boolean;
}

const STANDARD_MONTH_PRESETS = [36, 48, 60, 72, 84];

export const InteractiveComparisonCards: React.FC<InteractiveComparisonCardsProps> = ({
  calc,
  onUpdateInputs,
}) => {
  const { inputs, cash, standard, maxirataNoBtp, maxirata, verdict } = calc;
  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  const [mobileActiveTab, setMobileActiveTab] = useState<WinnerOptionId>(verdict.winner || 'maxirata');
  const [mobileViewAll, setMobileViewAll] = useState(false);
  const [showSecciDetails, setShowSecciDetails] = useState(false);

  const totalUpfront = inputs.downPaymentCash + inputs.tradeInValue;

  const strategies: {
    id: WinnerOptionId;
    title: string;
    subtitle: string;
    isWinner: boolean;
  }[] = [
    {
      id: 'cash',
      title: 'Contanti',
      subtitle: 'Nessun debito futuro',
      isWinner: verdict.winner === 'cash',
    },
    {
      id: 'standard',
      title: 'Finanziamento Standard',
      subtitle: 'Rata costante ammortizzata',
      isWinner: verdict.winner === 'standard',
    },
    {
      id: 'maxirata_no_btp',
      title: 'Maxirata Tradizionale',
      subtitle: 'Rata bassa + saldo finale',
      isWinner: verdict.winner === 'maxirata_no_btp',
    },
    {
      id: 'maxirata',
      title: `Maxirata + ${instrumentName}`,
      subtitle: 'Piano accumulo dedicato',
      isWinner: verdict.winner === 'maxirata',
    },
  ];

  return (
    <section aria-label="Matrice comparativa delle 4 opzioni finanziarie" className="space-y-4">
      {/* Mobile Segmented Control */}
      <div className="lg:hidden flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
        <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
          {strategies.map((strat) => (
            <button
              key={strat.id}
              type="button"
              onClick={() => {
                setMobileActiveTab(strat.id);
                setMobileViewAll(false);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                !mobileViewAll && mobileActiveTab === strat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {strat.title}
              {strat.isWinner && ' *'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMobileViewAll((prev) => !prev)}
          className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors shrink-0 ${
            mobileViewAll ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {mobileViewAll ? 'Singola' : 'Tutte (Matrice)'}
        </button>
      </div>

      {/* Main Comparative Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Table Toolbar / Title Bar */}
        <div className="p-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Matrice Comparativa Strategie di Acquisto
            </h2>
            <p className="text-xs text-slate-500">
              Confronto sincrono riga per riga su tassi, flussi di cassa, oneri accessori e costo netto finale.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSecciDetails((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{showSecciDetails ? 'Nascondi voci SECCI' : 'Dettagli voci SECCI'}</span>
              {showSecciDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* The Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-0">
            {/* Column Headers */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75">
                <th scope="col" className="w-1/4 p-4 text-xs font-semibold text-slate-500">
                  Voce di Bilancio &amp; Flusso
                </th>
                {strategies.map((strat) => {
                  const isVisible = mobileViewAll || mobileActiveTab === strat.id;
                  return (
                    <th
                      key={strat.id}
                      scope="col"
                      className={`w-[18.75%] p-4 text-left transition-colors ${
                        isVisible ? '' : 'hidden lg:table-cell'
                      } ${
                        strat.isWinner
                          ? 'bg-slate-100/90 border-t-2 border-t-blue-700'
                          : 'border-t-2 border-t-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-sm font-bold text-slate-900">
                          {strat.title}
                        </span>
                        {strat.isWinner && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-700 text-white text-[10px] font-bold">
                            Consigliata
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {strat.subtitle}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* SECTION: ESBORSO INIZIALE (T0) */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={5}
                  className="px-4 py-2 text-[11px] font-bold text-slate-700 tracking-wide bg-slate-100/50"
                >
                  1. Esborso Iniziale Immediato (T0)
                </td>
              </tr>

              {/* Riga: Anticipo Versato Cash */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Anticipo versato (cash)</div>
                  <div className="text-[11px] text-slate-400">Capitale versato al ritiro</div>
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(inputs.downPaymentCash, 2)}
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(inputs.downPaymentCash, 2)}
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(inputs.downPaymentCash, 2)}
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(inputs.downPaymentCash, 2)}
                </td>
              </tr>

              {/* Riga: Permuta Usato */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Valore permuta usato</div>
                  <div className="text-[11px] text-slate-400">Riconosciuto dal concessionario</div>
                </td>
                <td className={`p-4 text-slate-600 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.tradeInValue > 0 ? `-${formatEuro(inputs.tradeInValue, 2)}` : '0,00 €'}
                </td>
                <td className={`p-4 text-slate-600 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.tradeInValue > 0 ? `-${formatEuro(inputs.tradeInValue, 2)}` : '0,00 €'}
                </td>
                <td className={`p-4 text-slate-600 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.tradeInValue > 0 ? `-${formatEuro(inputs.tradeInValue, 2)}` : '0,00 €'}
                </td>
                <td className={`p-4 text-slate-600 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.tradeInValue > 0 ? `-${formatEuro(inputs.tradeInValue, 2)}` : '0,00 €'}
                </td>
              </tr>

              {/* Riga: Spese Istruttoria & Imposta Bollo */}
              {showSecciDetails && (
                <tr className="text-slate-500 bg-slate-50/25">
                  <td className="p-4 pl-6 text-slate-600">
                    <div>Spese istruttoria &amp; bollo contratto</div>
                    <div className="text-[11px] text-slate-400">Oneri una tantum all'apertura</div>
                  </td>
                  <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                    0,00 €
                  </td>
                  <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                    {formatEuro(inputs.originationFee + inputs.stampDuty, 2)}
                  </td>
                  <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                    {formatEuro(inputs.originationFee + inputs.stampDuty, 2)}
                  </td>
                  <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                    {formatEuro(inputs.originationFee + inputs.stampDuty, 2)}
                  </td>
                </tr>
              )}

              {/* Riga Totale T0: Esborso Cash Iniziale Effettivo */}
              <tr className="bg-slate-50/60 font-semibold border-b border-slate-200">
                <td className="p-4 text-slate-900">
                  <div>Esborso Cash Effettivo T0</div>
                  <div className="text-[11px] font-normal text-slate-500">Liquidità necessaria oggi</div>
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(cash.upfrontPayment, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(totalUpfront, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(totalUpfront, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(totalUpfront, 2)}
                </td>
              </tr>

              {/* SECTION: FLUSSO MENSILE */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={5}
                  className="px-4 py-2 text-[11px] font-bold text-slate-700 tracking-wide bg-slate-100/50"
                >
                  2. Impegno Mensile Ricorrente (Periodo Iniziale)
                </td>
              </tr>

              {/* Riga: Rata Finanziamento Mensile */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Rata finanziamento auto</div>
                  <div className="text-[11px] text-slate-400">
                    Quota capitale + interessi al concessionario
                  </div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 € / mese
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(standard.monthlyInstallmentTotal, 2)} / mese
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)} / mese
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirata.monthlyFinancingPaymentWithFees, 2)} / mese
                </td>
              </tr>

              {/* Riga: Quota Salvadanaio Titoli (BTP/Conto Deposito) */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Quota accumulo salvadanaio</div>
                  <div className="text-[11px] text-slate-400">
                    Investita a proprio favore per coprire la maxirata
                  </div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  —
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  —
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 € / mese
                </td>
                <td className={`p-4 font-bold text-blue-700 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  +{formatEuro(maxirata.effectiveMonthlyBtpSavings, 2)} / mese
                </td>
              </tr>

              {/* Riga: Durata Periodo Iniziale */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Durata ammortamento iniziale</div>
                  <div className="text-[11px] text-slate-400">Numero di rate mensili</div>
                </td>
                <td className={`p-4 text-slate-500 ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0 mesi (immediato)
                </td>
                <td className={`p-4 text-slate-800 ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="flex flex-wrap gap-1">
                    {STANDARD_MONTH_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onUpdateInputs({ standardMonths: m })}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                          inputs.standardMonths === m
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </td>
                <td className={`p-4 text-slate-800 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.maxirataMonths} mesi
                </td>
                <td className={`p-4 text-slate-800 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.maxirataMonths} mesi
                </td>
              </tr>

              {/* Riga Totale Mensile: Uscita Mensile Complessiva */}
              <tr className="bg-slate-50/60 font-semibold border-b border-slate-200">
                <td className="p-4 text-slate-900">
                  <div>Impegno Mensile Complessivo</div>
                  <div className="text-[11px] font-normal text-slate-500">Esborso dal conto corrente</div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(standard.monthlyInstallmentTotal, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirataNoBtp.monthlyFinancingPaymentWithFees, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirata.realMonthlyCommitmentWithBtp, 2)}
                </td>
              </tr>

              {/* SECTION: SCADENZA / MAXIRATA VFG */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={5}
                  className="px-4 py-2 text-[11px] font-bold text-slate-700 tracking-wide bg-slate-100/50"
                >
                  3. Chiusura del Contratto a Scadenza (Mese {inputs.maxirataMonths})
                </td>
              </tr>

              {/* Riga: Maxirata Finale da Saldare */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Maxirata finale (VFG)</div>
                  <div className="text-[11px] text-slate-400">Valore residuo garantito da estinguere</div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 € (già saldata)
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 € (ammortizzata)
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirataNoBtp.maxirataAmount, 2)}
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirata.maxirataAmount, 2)}
                </td>
              </tr>

              {/* Riga: Strategia Riscatto Maxirata Opzione 3 */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Modalità liquidazione maxirata</div>
                  <div className="text-[11px] text-slate-400">Decisione al termine del periodo 1</div>
                </td>
                <td className={`p-4 text-slate-500 ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  Auto di proprietà
                </td>
                <td className={`p-4 text-slate-500 ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  Auto di proprietà
                </td>
                <td className={`p-4 ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateInputs({ maxirataNoBtpMode: 'pay_cash' })}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                          inputs.maxirataNoBtpMode === 'pay_cash'
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Saldo Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateInputs({ maxirataNoBtpMode: 'refinance' })}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                          inputs.maxirataNoBtpMode === 'refinance'
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Rifinanzio
                      </button>
                    </div>
                    {inputs.maxirataNoBtpMode === 'refinance' && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                        {inputs.refinanceMonths} rate da {formatEuro(maxirataNoBtp.monthlyInstallment2ndPeriod, 2)} (TAEG {inputs.refinanceTaeg}%)
                      </div>
                    )}
                  </div>
                </td>
                <td className={`p-4 ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="text-slate-800">
                    <div className="font-semibold text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Copertura con Salvadanaio</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Capitale nel titolo: {formatEuro(maxirata.accumulatedBtpAtMaturity, 2)}
                    </div>
                  </div>
                </td>
              </tr>

              {/* Riga: Rendimenti Attivi Generati (Cedole) */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Interessi attivi netti generati</div>
                  <div className="text-[11px] text-slate-400">Guadagno maturato dal portafoglio</div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 font-bold text-emerald-700 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  +{formatEuro(maxirata.btpAccumulator.totalNetInterestEarned, 2)}
                </td>
              </tr>

              {/* Riga: Gap Finale Maxirata */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Disavanzo / Gap a scadenza</div>
                  <div className="text-[11px] text-slate-400">Differenza tra maxirata e liquidità pronta</div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 font-medium text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {inputs.maxirataNoBtpMode === 'pay_cash' ? formatEuro(maxirataNoBtp.maxirataAmount, 2) : 'Rifinanziata a debito'}
                </td>
                <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {maxirata.gapAmount <= 0.01 ? (
                    <span className="font-bold text-emerald-700">0,00 € (Interamente Coperta)</span>
                  ) : (
                    <span className="font-bold text-amber-700">Gap: {formatEuro(maxirata.gapAmount, 2)}</span>
                  )}
                </td>
              </tr>

              {/* SECTION: ONERI FINANZIARI & TASSI */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={5}
                  className="px-4 py-2 text-[11px] font-bold text-slate-700 tracking-wide bg-slate-100/50"
                >
                  4. Oneri Finanziari, Tassi &amp; Costo Opportunità
                </td>
              </tr>

              {/* Riga: Tassi Applicati (TAN / TAEG) */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Tassi di interesse (TAN / TAEG)</div>
                  <div className="text-[11px] text-slate-400">Condizioni applicate da contratto</div>
                </td>
                <td className={`p-4 text-slate-400 ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  Nessun finanziamento
                </td>
                <td className={`p-4 text-slate-700 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  TAEG {formatEuro(standard.effectiveTaeg, 2)}%
                </td>
                <td className={`p-4 text-slate-700 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  TAN {inputs.maxirataTan}% • TAEG {inputs.maxirataTaeg}%
                </td>
                <td className={`p-4 text-slate-700 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  TAN {inputs.maxirataTan}% • TAEG {inputs.maxirataTaeg}%
                </td>
              </tr>

              {/* Riga: Interessi Passivi Totali */}
              <tr>
                <td className="p-4 text-slate-700">
                  <div className="font-medium text-slate-900">Interessi passivi versati</div>
                  <div className="text-[11px] text-slate-400">Costo totale del credito</div>
                </td>
                <td className={`p-4 text-slate-400 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  0,00 €
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(standard.totalInterestAndFees, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirataNoBtp.totalInterestAndFees, 2)}
                </td>
                <td className={`p-4 text-slate-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  {formatEuro(maxirata.totalInterestAndFees1stPeriod, 2)}
                </td>
              </tr>

              {/* Riga: Costo Opportunità Liquidità (se selezionato) */}
              {inputs.includeOpportunityCost && (
                <tr className="bg-amber-50/25">
                  <td className="p-4 text-slate-700">
                    <div className="font-medium text-amber-900">Costo opportunità liquidità</div>
                    <div className="text-[11px] text-amber-700">
                      Rendimento non incassato sull'anticipo
                    </div>
                  </td>
                  <td className={`p-4 font-medium text-amber-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                    +{formatEuro(cash.opportunityCostBtp, 2)}
                  </td>
                  <td className={`p-4 font-medium text-amber-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                    +{formatEuro(standard.liquidityBtpGain, 2)}
                  </td>
                  <td className={`p-4 font-medium text-amber-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                    0,00 €
                  </td>
                  <td className={`p-4 font-medium text-amber-900 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                    0,00 €
                  </td>
                </tr>
              )}

              {/* SECTION: VERDETTO FINALE & COSTO COMPLESSIVO REALE */}
              <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                <td className="p-4 text-slate-900">
                  <div className="text-sm font-bold">COSTO TOTALE REALE NETTO</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Esborso complessivo al netto di cedole e sconti
                  </div>
                </td>

                {/* Totale Cash */}
                <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'cash' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="text-base font-bold text-slate-900">
                    {formatEuro(cash.realNetCost, 2)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Riferimento base
                  </div>
                </td>

                {/* Totale Standard */}
                <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'standard' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="text-base font-bold text-slate-900">
                    {formatEuro(standard.realNetCost, 2)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {standard.realNetCost > cash.realNetCost
                      ? `+${formatEuro(standard.realNetCost - cash.realNetCost, 2)} vs contanti`
                      : `-${formatEuro(cash.realNetCost - standard.realNetCost, 2)} vs contanti`}
                  </div>
                </td>

                {/* Totale Maxirata Sola */}
                <td className={`p-4 tabular-nums ${mobileViewAll || mobileActiveTab === 'maxirata_no_btp' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="text-base font-bold text-slate-900">
                    {formatEuro(maxirataNoBtp.realNetCost, 2)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {maxirataNoBtp.realNetCost > cash.realNetCost
                      ? `+${formatEuro(maxirataNoBtp.realNetCost - cash.realNetCost, 2)} vs contanti`
                      : `-${formatEuro(cash.realNetCost - maxirataNoBtp.realNetCost, 2)} vs contanti`}
                  </div>
                </td>

                {/* Totale Maxirata + BTP */}
                <td className={`p-4 tabular-nums bg-blue-50/40 border-l border-r border-blue-200 ${mobileViewAll || mobileActiveTab === 'maxirata' ? '' : 'hidden lg:table-cell'}`}>
                  <div className="text-base font-bold text-blue-900">
                    {formatEuro(maxirata.realNetCost, 2)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                    {maxirata.realNetCost < cash.realNetCost ? (
                      `Risparmio reale: -${formatEuro(cash.realNetCost - maxirata.realNetCost, 2)}`
                    ) : (
                      `Differenziale: +${formatEuro(maxirata.realNetCost - cash.realNetCost, 2)}`
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Metodo di calcolo:</span>
            <span>Attualizzazione SECCI con rivalutazione attiva a regime fiscale agevolato ({inputs.taxRegime === 'btp_12_5' ? '12,5%' : '26%'}).</span>
          </div>
          <div className="tabular-nums text-slate-600">
            Valutazione valida per listino {formatEuro(inputs.carPriceCash)} • Sconto {formatEuro(inputs.financingDiscount)}
          </div>
        </div>
      </div>
    </section>
  );
};
