import React, { useState, useEffect } from 'react';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Coins,
  Sparkles,
  HelpCircle,
  PiggyBank,
  Check,
} from 'lucide-react';
import { FullCalculationOutput, CalculatorInputs } from '../../types/calculator';
import { formatEuro, formatPercent } from '../../lib/storage';
import { NumericInput } from '../common/NumericInput';
import {
  simulateMonthlyInvestment,
  FINANCIAL_INSTRUMENTS,
  getInstrumentShortName,
} from '../../lib/financialInstruments';

interface BudgetGapSimulatorProps {
  calc: FullCalculationOutput;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
}

export const BudgetGapSimulator: React.FC<BudgetGapSimulatorProps> = ({
  calc,
  onUpdateInputs,
}) => {
  const { inputs, maxirata, netAnnualBtpYield } = calc;
  const instrumentName =
    inputs.selectedInstrumentName ||
    getInstrumentShortName(inputs.selectedInstrumentId || 'btp_3y');
  const targetBalloon = maxirata.maxirataAmount;
  const fullCoverageMonthly = maxirata.btpAccumulator.monthlySavingsRequired;

  // Stato per l'importo mensile che l'utente vuole investire
  const [customMonthly, setCustomMonthly] = useState<number>(() => {
    if (
      inputs.btpContributionMode === 'custom' &&
      inputs.btpCustomMonthlyAmount !== undefined
    ) {
      return inputs.btpCustomMonthlyAmount;
    }
    return Math.round(fullCoverageMonthly / 2 / 10) * 10 || 150;
  });

  const [appliedFeedback, setAppliedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (
      inputs.btpContributionMode === 'custom' &&
      inputs.btpCustomMonthlyAmount !== undefined
    ) {
      setCustomMonthly(inputs.btpCustomMonthlyAmount);
    }
  }, [inputs.btpContributionMode, inputs.btpCustomMonthlyAmount]);

  const handleApplyToMainCalc = () => {
    onUpdateInputs({
      btpContributionMode: 'custom',
      btpCustomMonthlyAmount: customMonthly,
    });
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2400);
  };

  // Calcolo simulazione per l'importo custom
  const currentSim = simulateMonthlyInvestment({
    monthlyInvestment: customMonthly,
    months: inputs.maxirataMonths,
    annualGrossYield: inputs.btpGrossYield,
    taxRatePercent:
      inputs.taxRegime === 'btp_12_5'
        ? 12.5
        : inputs.taxRegime === 'deposito_26'
        ? 26.0
        : 0,
    initialCapital: inputs.btpInitialCapital,
    targetBalloon,
    refinanceMonths: inputs.refinanceMonths,
    refinanceTaeg: inputs.refinanceTaeg,
  });

  // Scenari predefiniti a confronto (0€, 100€, 200€, Quota Piena)
  const comparisonScenarios = [
    { label: `0 €/mese (Senza ${instrumentName})`, amount: 0, tag: 'Nessun risparmio' },
    { label: '100 €/mese', amount: 100, tag: 'Investimento leggero' },
    { label: '200 €/mese', amount: 200, tag: 'Investimento medio' },
    {
      label: `Quota Piena (${formatEuro(fullCoverageMonthly, 0)}/m)`,
      amount: Math.round(fullCoverageMonthly),
      tag: '100% Maxirata Coperta',
    },
  ].map((scen) => ({
    ...scen,
    result: simulateMonthlyInvestment({
      monthlyInvestment: scen.amount,
      months: inputs.maxirataMonths,
      annualGrossYield: inputs.btpGrossYield,
      taxRatePercent:
        inputs.taxRegime === 'btp_12_5'
          ? 12.5
          : inputs.taxRegime === 'deposito_26'
          ? 26.0
          : 0,
      initialCapital: inputs.btpInitialCapital,
      targetBalloon,
      refinanceMonths: inputs.refinanceMonths,
      refinanceTaeg: inputs.refinanceTaeg,
    }),
  }));

  const isFullCovered = currentSim.gapAmount <= 0.01;

  return (
    <div className="space-y-6">
      {/* Header Sezione */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Simulatore Flessibile a Scelta Libera
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Quanto vuoi investire ogni mese per la Maxirata?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Simula qualsiasi cifra mensile e scopri istantaneamente{' '}
                <strong>quanto riesci ad accumulare</strong> e{' '}
                <strong className="text-rose-700">quanti soldi mancano</strong> per riscattare l&apos;auto.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-right shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Maxirata Finale (Target)
            </span>
            <span className="text-xl font-extrabold text-amber-900 tabular-nums">
              {formatEuro(targetBalloon, 2)}
            </span>
            <span className="text-[11px] text-slate-500 block">
              da saldare al mese {inputs.maxirataMonths}
            </span>
          </div>
        </div>

        {/* Input & Slider: Quanto vuoi investire al mese? */}
        <div className="pt-6 space-y-4">
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="input-custom-monthly-sim"
                  className="text-sm font-bold text-slate-900 block"
                >
                  Scegli la cifra che desideri accantonare ogni mese (€/mese):
                </label>
                <span className="text-xs text-slate-500">
                  Strumento attivo:{' '}
                  <strong className="text-slate-900 font-bold">{instrumentName}</strong> • Rendimento:{' '}
                  <strong className="text-emerald-700 tabular-nums">
                    {formatPercent(netAnnualBtpYield, 2)} netto annuo
                  </strong>{' '}
                  ({inputs.btpGrossYield}% lordo, tassazione{' '}
                  {inputs.taxRegime === 'btp_12_5' ? '12,5%' : inputs.taxRegime === 'deposito_26' ? '26%' : '0%'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <NumericInput
                  id="input-custom-monthly-sim"
                  value={customMonthly}
                  min={0}
                  max={2500}
                  step={10}
                  decimals={0}
                  suffix="€/m"
                  onChange={(val) => setCustomMonthly(val)}
                  className="w-36"
                  inputClassName="text-lg font-bold text-amber-900 bg-white border-amber-300"
                />
              </div>
            </div>

            <input
              type="range"
              aria-label="Slider quota mensile personalizzata"
              min={0}
              max={Math.max(600, Math.round(fullCoverageMonthly * 1.3))}
              step={10}
              value={customMonthly}
              onChange={(e) => setCustomMonthly(Number(e.target.value))}
              className="w-full fintech-slider slider-amber"
            />

            {/* Quick Preset Buttons & Apply Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-amber-200/60 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Pillole rapide:</span>
                {[50, 100, 150, 200, 250, 300].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomMonthly(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                      customMonthly === amt
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {amt} €/m
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCustomMonthly(Math.round(fullCoverageMonthly))}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    customMonthly === Math.round(fullCoverageMonthly)
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quota 100% Copertura ({formatEuro(fullCoverageMonthly, 0)}/m)</span>
                </button>
              </div>

              {/* Tasto Applica al Calcolatore Principale */}
              <button
                type="button"
                onClick={handleApplyToMainCalc}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  appliedFeedback
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                }`}
              >
                {appliedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Quota Applicata al Calcolatore!</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Applica {formatEuro(customMonthly)}/m alla Card Maxirata</span>
                  </>
                )}
              </button>
            </div>

            {/* SELETTORE RAPIDO STRUMENTO FINANZIARIO */}
            <div className="pt-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cambia Strumento Finanziario per la Simulazione:</span>
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  Attivo: {instrumentName}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FINANCIAL_INSTRUMENTS.map((inst) => {
                  const isSelected =
                    (inputs.selectedInstrumentId || 'btp_3y') === inst.id;
                  const shortName = getInstrumentShortName(inst);
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() =>
                        onUpdateInputs({
                          selectedInstrumentId: inst.id,
                          selectedInstrumentName: shortName,
                          btpGrossYield: inst.avgGrossYield3Y,
                          taxRegime: inst.taxRegime,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{shortName}</span>
                      <span className="text-[10px] opacity-80">
                        ({inst.avgGrossYield3Y}% lordo)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RISULTATO DELLA SIMULAZIONE CORRENTE: 3 Grandi Card KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Totale che Riesci ad Accumulare */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span>Totale sul Conto al Mese {inputs.maxirataMonths}</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatEuro(currentSim.totalAccumulated, 2)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {customMonthly > 0 ? (
                  <span>
                    Con {formatEuro(customMonthly)}/mese per {inputs.maxirataMonths} mesi
                  </span>
                ) : (
                  <span>Nessun risparmio mensile impostato</span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Tuo Capitale versato di tasca:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatEuro(currentSim.totalPrincipalDeposited, 2)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Interessi netti guadagnati:</span>
                <span className="font-bold tabular-nums">
                  + {formatEuro(currentSim.totalNetInterestEarned, 2)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar coverage */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex justify-between text-xs font-bold tabular-nums">
              <span className="text-slate-700">Copertura Maxirata:</span>
              <span
                className={
                  currentSim.coveragePercent >= 100
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }
              >
                {formatPercent(currentSim.coveragePercent, 1)}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/60">
              <div
                style={{ width: `${Math.min(100, currentSim.coveragePercent)}%` }}
                className={`h-full transition-all duration-300 ${
                  currentSim.coveragePercent >= 100
                    ? 'bg-emerald-500'
                    : currentSim.coveragePercent >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Card 2: GAP MANCANTE RISPETTO ALLA MAXIRATA */}
        <div
          className={`rounded-2xl p-5 shadow-sm flex flex-col justify-between border ${
            isFullCovered
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/70 border-rose-300 text-rose-950'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>
                {isFullCovered ? 'Copertura Completa' : 'Soldi che Mancano (GAP)'}
              </span>
              {isFullCovered ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              )}
            </div>

            <div className="mt-3">
              {isFullCovered ? (
                <div>
                  <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
                    0,00 €
                  </div>
                  <div className="text-xs text-emerald-800 font-semibold mt-1">
                    🎉 La Maxirata è coperta al 100%!
                  </div>
                  {currentSim.surplusAmount > 1 && (
                    <div className="mt-1 text-xs text-emerald-700 font-medium">
                      Hai persino un surplus di{' '}
                      <strong>+{formatEuro(currentSim.surplusAmount, 2)}</strong>!
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-extrabold text-rose-700 tabular-nums">
                    {formatEuro(currentSim.gapAmount, 2)}
                  </div>
                  <div className="text-xs text-rose-900 font-semibold mt-1">
                    Disavanzo al mese {inputs.maxirataMonths} rispetto ai{' '}
                    {formatEuro(targetBalloon)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs space-y-2 border-t border-slate-200/60 pt-3">
              <div className="flex justify-between">
                <span>Maxirata da pagare:</span>
                <span className="font-bold tabular-nums">
                  {formatEuro(targetBalloon, 2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Soldi accumulati con {instrumentName}:</span>
                <span className="font-bold tabular-nums">
                  - {formatEuro(currentSim.totalAccumulated, 2)}
                </span>
              </div>
              <div className="flex justify-between font-extrabold pt-1 border-t border-slate-300/60">
                <span>Da reperire a scadenza:</span>
                <span className="tabular-nums">
                  {formatEuro(currentSim.gapAmount, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs leading-relaxed">
            {isFullCovered ? (
              <span className="text-emerald-800 font-medium">
                Non dovrai chiedere alcun prestito né sborsare altri contanti al mese{' '}
                {inputs.maxirataMonths}. L&apos;auto è tua al 100%.
              </span>
            ) : (
              <span className="text-rose-900 font-medium">
                Dovrai coprire i <strong>{formatEuro(currentSim.gapAmount)}</strong>{' '}
                rimasti: o con un bonifico di tasca tua o con un mini-finanziamento.
              </span>
            )}
          </div>
        </div>

        {/* Card 3: SOLUZIONE INTELLIGENTE PER IL GAP (Mini-Rifinanziamento) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Cosa fare con il GAP residuo?</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>

            {isFullCovered ? (
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <strong>Zero Debiti a Scadenza:</strong> Avendo coperto l&apos;intera maxirata,
                  risparmi <strong>{formatEuro(currentSim.fullRefinanceInterest, 0)}</strong> di
                  interessi bancari che avresti dovuto pagare rifinanziando l&apos;importo.
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="text-xs text-slate-600">
                  Se a scadenza non hai i contanti per il gap, puoi chiedere un{' '}
                  <strong className="text-slate-900">Mini-Rifinanziamento</strong> solo sui{' '}
                  <strong className="text-rose-700 tabular-nums">
                    {formatEuro(currentSim.gapAmount)}
                  </strong>{' '}
                  invece che su tutti i {formatEuro(targetBalloon)}!
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs tabular-nums">
                  <div className="flex justify-between text-slate-600">
                    <span>Nuova Mini-Rata ({inputs.refinanceMonths}m):</span>
                    <span className="font-extrabold text-blue-700 text-sm">
                      {formatEuro(currentSim.miniRefinanceMonthly, 2)}/mese
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>(Rata rifinanziando TUTTO):</span>
                    <span className="line-through text-slate-400">
                      {formatEuro(currentSim.fullRefinanceMonthly, 2)}/mese
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                    <span>Interessi risparmiati:</span>
                    <span>
                      + {formatEuro(currentSim.interestSavedVsFullRefinance, 2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Impegno mensile combinato:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatEuro(maxirata.monthlyFinancingPaymentWithFees + customMonthly, 2)}/m
            </span>
          </div>
        </div>
      </div>

      {/* TABELLA COMPARATIVA MULTI-SCENARIO */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Confronto Immediato tra Scenari di Risparmio Mensile
            </h3>
            <p className="text-xs text-slate-500">
              Guarda come varia il GAP mancante e la rata di rifinanziamento in funzione di quanto metti da parte al mese
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left tabular-nums border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3">Scenario</th>
                <th className="py-3 px-3">Quota Mensile {instrumentName}</th>
                <th className="py-3 px-3">Uscita Mensile Totale</th>
                <th className="py-3 px-3">Totale Accumulato</th>
                <th className="py-3 px-3">GAP Mancante</th>
                <th className="py-3 px-3">Copertura Maxirata</th>
                <th className="py-3 px-3">Mini-Rata 2° Periodo</th>
                <th className="py-3 px-3 text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonScenarios.map((scen, idx) => {
                const isSelected = customMonthly === scen.amount;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-amber-50/70 font-semibold'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{scen.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {scen.tag}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {formatEuro(scen.amount)}/mese
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {formatEuro(
                        maxirata.monthlyFinancingPaymentWithFees + scen.amount,
                        0
                      )}
                      /m
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {formatEuro(scen.result.totalAccumulated, 0)}
                    </td>
                    <td className="py-3 px-3">
                      {scen.result.gapAmount > 0 ? (
                        <span className="font-bold text-rose-700">
                          {formatEuro(scen.result.gapAmount, 0)}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700">
                          0 € (Coperta)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            style={{
                              width: `${Math.min(100, scen.result.coveragePercent)}%`,
                            }}
                            className={`h-full ${
                              scen.result.coveragePercent >= 100
                                ? 'bg-emerald-500'
                                : scen.result.coveragePercent >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                        </div>
                        <span className="text-[11px]">
                          {formatPercent(scen.result.coveragePercent, 0)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {scen.result.gapAmount > 0 ? (
                        <span>
                          {formatEuro(scen.result.miniRefinanceMonthly, 0)}/m
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">0 €/mese</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setCustomMonthly(scen.amount)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Attivo' : 'Simula'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

