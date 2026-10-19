import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Sliders,
  ArrowUpRight,
  Landmark,
} from 'lucide-react';
import { CalculatorInputs, FullCalculationOutput, TaxRegime } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';
import { FINANCIAL_INSTRUMENTS, FinancialInstrument, getInstrumentShortName } from '../../lib/financialInstruments';
import { NumericInput } from '../common/NumericInput';

interface InstrumentsCatalogProps {
  calc: FullCalculationOutput;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  onNavigateToSimulator?: () => void;
}

export const InstrumentsCatalog: React.FC<InstrumentsCatalogProps> = ({
  calc,
  onUpdateInputs,
  onNavigateToSimulator,
}) => {
  const { inputs, maxirata } = calc;
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(() => {
    if (inputs.selectedInstrumentId) return inputs.selectedInstrumentId;
    const match = FINANCIAL_INSTRUMENTS.find(
      (inst) =>
        Math.abs(inst.avgGrossYield3Y - inputs.btpGrossYield) < 0.15 &&
        inst.taxRegime === inputs.taxRegime
    );
    return match ? match.id : 'btp_3y';
  });

  const activeInstrumentId = inputs.selectedInstrumentId || selectedInstrumentId;
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  const handleApplyInstrument = (instrument: FinancialInstrument) => {
    setSelectedInstrumentId(instrument.id);
    const shortName = getInstrumentShortName(instrument);

    onUpdateInputs({
      selectedInstrumentId: instrument.id,
      selectedInstrumentName: shortName,
      btpGrossYield: instrument.avgGrossYield3Y,
      taxRegime: instrument.taxRegime,
    });
    setAppliedFeedback(instrument.name);
    setTimeout(() => {
      setAppliedFeedback(null);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Catalogo Strumenti di Risparmio &amp; Investimento
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Rendimenti Storici Reali a 3 Anni a Confronto
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Confronta i rendimenti medi annui, la tassazione fiscale e il livello di rischio
                per un orizzonte temporale di <strong>36 mesi</strong> (la durata tipica della Maxirata).
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
              Tasso Attualmente Attivo
            </span>
            <div className="text-xl font-extrabold text-emerald-900 tabular-nums">
              {formatPercent(inputs.btpGrossYield, 2)} lordo
            </div>
            <span className="text-xs font-bold text-emerald-700 tabular-nums block">
              = {formatPercent(calc.netAnnualBtpYield, 2)} netto annuo
            </span>
          </div>
        </div>

        {/* Advisory Warning: Fixed Deadline (Maxirata) vs Volatility */}
        <div className="mt-5 rounded-xl bg-amber-50/70 border border-amber-200/80 p-4 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-sm">
              Regola d&apos;Oro per la Maxirata dell&apos;Auto (Scadenza a 3 Anni):
            </span>
            <p className="leading-relaxed">
              La Maxirata ha una <strong>data di pagamento fissa e non posticipabile</strong>.
              Gli strumenti a <strong>capitale garantito a scadenza (BTP a 3 anni o Conti Deposito)</strong>{' '}
              oppure a bassissima oscillazione (ETF monetari) sono i più sicuri: sai al centesimo quanto avrai
              al mese {inputs.maxirataMonths}. I mercati azionari (MSCI World, S&P 500, azioni singole),
              pur avendo rendimenti medi storici più alti, presentano oscillazioni a 3 anni che potrebbero costringerti
              a vendere in perdita proprio nel mese in cui devi riscattare l&apos;auto.
            </p>
          </div>
        </div>
      </div>

      {appliedFeedback && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-sm text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Strumento applicato con successo:{' '}
              <span className="underline">{appliedFeedback}</span>! Tutti i calcoli e il simulatore sono stati aggiornati.
            </span>
          </div>
          {onNavigateToSimulator && (
            <button
              type="button"
              onClick={onNavigateToSimulator}
              className="bg-white text-emerald-800 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              Vai al Simulatore &rarr;
            </button>
          )}
        </div>
      )}

      {/* Grid of Financial Instruments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FINANCIAL_INSTRUMENTS.map((instrument) => {
          const isSelected = activeInstrumentId === instrument.id;

          return (
            <div
              key={instrument.id}
              className={`rounded-2xl bg-white p-5 flex flex-col justify-between transition-all border ${
                isSelected
                  ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/10 shadow-md'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="space-y-3.5">
                {/* Category & Suitability Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {instrument.categoryLabel}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${instrument.suitabilityBadgeColor}`}
                  >
                    {instrument.suitabilityLabel}
                  </span>
                </div>

                {/* Name & Ticker */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {instrument.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                    {instrument.tickerOrExample}
                  </span>
                </div>

                {/* Yields Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 grid grid-cols-2 gap-2 text-xs tabular-nums">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Media 3Y Lorda
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatPercent(instrument.avgGrossYield3Y, 2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">annuo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 block uppercase font-semibold">
                      Netto Effettivo
                    </span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {formatPercent(instrument.netAnnualYield, 2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (tax {instrument.taxRatePercent}%)
                    </span>
                  </div>
                </div>

                {/* Risk and Volatility */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Livello Rischio:</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${instrument.riskColor}`}
                    >
                      {instrument.riskLabel}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-1 text-[11px] text-slate-500">
                    <span>Volatilità 3Y:</span>
                    <span className="text-right text-slate-700 font-medium">
                      {instrument.volatility3Y}
                    </span>
                  </div>
                </div>

                {/* Description and Advisory */}
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <p>{instrument.description}</p>
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    💡 {instrument.advisoryNote}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleApplyInstrument(instrument)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selezionato e Attivo</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applica questo Strumento ({formatPercent(instrument.avgGrossYield3Y, 2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom / Personalizzato Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Opzione Personalizzata
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Custom
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inserisci Rendimento a Piacere
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Definisci il tuo tasso personalizzato e il regime fiscale
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label
                  htmlFor="custom-gross-yield-input"
                  className="text-xs font-semibold text-slate-700 block mb-1"
                >
                  Rendimento Annuo Lordo (%):
                </label>
                <NumericInput
                  id="custom-gross-yield-input"
                  value={inputs.btpGrossYield}
                  min={0}
                  max={30}
                  step={0.1}
                  decimals={2}
                  suffix="%"
                  onChange={(val) => onUpdateInputs({ btpGrossYield: val })}
                  className="w-full"
                  inputClassName="text-sm font-bold text-slate-900 border-slate-300"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-tax-regime-select"
                  className="text-xs font-semibold text-slate-700 block mb-1"
                >
                  Regime Fiscale:
                </label>
                <select
                  id="custom-tax-regime-select"
                  value={inputs.taxRegime}
                  onChange={(e) =>
                    onUpdateInputs({ taxRegime: e.target.value as TaxRegime })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="btp_12_5">Tassazione Agevolata 12,5% (Titoli di Stato)</option>
                  <option value="deposito_26">Ritenuta Ordinaria 26% (Conti e Azioni)</option>
                  <option value="net_0">Tasso Già Netto 0% (Nessuna imposta)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Netto calcolato:</span>
                  <span className="font-extrabold text-blue-700 text-sm">
                    {formatPercent(calc.netAnnualBtpYield, 2)} annuo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block text-center">
              Le modifiche inserite sono già attive in tutta l&apos;applicazione.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

