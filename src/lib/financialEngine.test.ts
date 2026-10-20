import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INPUTS,
  calcBalloonInstallment,
  calcBtpAccumulator,
  calcFrenchInstallment,
  calculateAllOptions,
  solveBreakEvenTaeg,
} from './financialEngine';
import { PRESET_SCENARIOS, sanitizeCsvCell } from './storage';
import { simulateMonthlyInvestment } from './financialInstruments';

describe('Financial Engine — Calcolatore Auto & BTP', () => {
  it('calculates French amortization installment accurately', () => {
    // 20,000 € a 6% annuo (0.5% mensile) per 60 mesi -> ~386.66 €/mese
    const r = calcFrenchInstallment(20000, 0.06 / 12, 60);
    expect(r).toBeCloseTo(386.656, 2);
  });

  it('handles zero interest rate in French amortization without NaN', () => {
    const r = calcFrenchInstallment(18000, 0, 36);
    expect(r).toBeCloseTo(500, 2);
  });

  it('calculates Balloon (Maxirata) installment accurately including balloon simple interest', () => {
    // 20,000 € finanziati, 10,000 € maxirata, 6% TAN (0.5% mensile), 36 mesi
    // Quota ammortizzata = 10,000 € su 36 mesi (~304.22 €) + Interessi su 10,000 € (50 €/mese) = ~354.22 €
    const res = calcBalloonInstallment(20000, 10000, 0.06 / 12, 36);
    expect(res.monthlyBalloonInterest).toBeCloseTo(50, 2);
    expect(res.installment).toBeCloseTo(354.219, 2);
  });

  it('calculates BTP Accumulator with 12.5% vs 26% tax and initial capital', () => {
    // Target: 12,600 € in 36 mesi con BTP al 3.5% lordo (3.0625% netto)
    const btp = calcBtpAccumulator(12600, 36, 3.5, 'btp_12_5', 0);
    expect(btp.netAnnualYield).toBeCloseTo(3.0625, 4);
    expect(btp.monthlySavingsZeroYield).toBeCloseTo(350, 2);
    expect(btp.monthlySavingsRequired).toBeLessThan(350);
    expect(btp.totalPrincipalDeposited + btp.totalNetInterestEarned).toBeCloseTo(12600, 2);

    // Con Conto Deposito (tassazione 26%), il rendimento netto è minore e serve versare di più ogni mese
    const cd = calcBtpAccumulator(12600, 36, 3.5, 'deposito_26', 0);
    expect(cd.netAnnualYield).toBeCloseTo(3.5 * 0.74, 4);
    expect(cd.monthlySavingsRequired).toBeGreaterThan(btp.monthlySavingsRequired);

    // Con capitale iniziale di 3.000 € già nel salvadanaio, la quota mensile scende sensibilmente
    const withInit = calcBtpAccumulator(12600, 36, 3.5, 'btp_12_5', 3000);
    expect(withInit.monthlySavingsRequired).toBeLessThan(btp.monthlySavingsRequired - 80);
    expect(withInit.totalPrincipalDeposited + withInit.totalNetInterestEarned).toBeCloseTo(12600, 2);
  });

  it('produces complete calculation output with timeline, refinancing trap, and valid verdict', () => {
    const out = calculateAllOptions(DEFAULT_INPUTS);
    expect(out.cash.totalOutOfPocket).toBe(DEFAULT_INPUTS.carPriceCash);
    expect(out.standard.monthlyInstallmentTotal).toBeGreaterThan(0);
    expect(out.maxirata.realMonthlyCommitmentWithBtp).toBeCloseTo(
      out.maxirata.monthlyInstallmentTotal + out.maxirata.btpAccumulator.monthlySavingsRequired,
      2
    );
    // Il rifinanziamento della maxirata costa più del salvadanaio BTP
    expect(out.maxirata.refinanceScenario.extraCostVsBtpAccumulator).toBeGreaterThan(1000);

    // Al mese di scadenza della maxirata (36), il saldo del salvadanaio BTP raggiunge la maxirata
    const month36 = out.timeline.find((p) => p.month === DEFAULT_INPUTS.maxirataMonths);
    expect(month36).toBeDefined();
    expect(month36!.btpFundBalance).toBeCloseTo(out.maxirata.maxirataAmount, 0);
    expect(['cash', 'standard', 'maxirata']).toContain(out.verdict.winner);
  });

  it('correctly switches winner to financing when promo discount is high and TAEG is low', () => {
    const promoScenario = PRESET_SCENARIOS.find((p) => p.id === 'promo_zero')!.inputs;
    const out = calculateAllOptions(promoScenario);
    const breakEven = solveBreakEvenTaeg(promoScenario, out.cash.realNetCost);
    expect(breakEven).toBeGreaterThan(promoScenario.maxirataTaeg);
    expect(out.verdict.winner).not.toBe('cash');
  });

  it('accurately simulates monthly investment budget, gap, and mini-refinance savings', () => {
    // Caso 1: 0 €/mese -> Gap = 14065.33, 0% coperto
    const zeroSim = simulateMonthlyInvestment({
      monthlyInvestment: 0,
      months: 36,
      annualGrossYield: 3.4,
      taxRatePercent: 12.5,
      targetBalloon: 14065.33,
    });
    expect(zeroSim.gapAmount).toBeCloseTo(14065.33, 2);
    expect(zeroSim.coveragePercent).toBe(0);
    expect(zeroSim.miniRefinanceMonthly).toBeCloseTo(zeroSim.fullRefinanceMonthly, 2);

    // Caso 2: 150 €/mese per 36 mesi al 3.4% BTP
    const partialSim = simulateMonthlyInvestment({
      monthlyInvestment: 150,
      months: 36,
      annualGrossYield: 3.4,
      taxRatePercent: 12.5,
      targetBalloon: 14065.33,
      refinanceMonths: 36,
      refinanceTaeg: 8.5,
    });
    // Capitale versato = 5.400 €
    expect(partialSim.totalPrincipalDeposited).toBe(5400);
    // Interessi maturati > 0
    expect(partialSim.totalNetInterestEarned).toBeGreaterThan(200);
    expect(partialSim.totalAccumulated).toBeGreaterThan(5600);
    // Gap residuo è esattamente target - totalAccumulated
    expect(partialSim.gapAmount).toBeCloseTo(14065.33 - partialSim.totalAccumulated, 2);
    expect(partialSim.coveragePercent).toBeGreaterThan(35);
    expect(partialSim.coveragePercent).toBeLessThan(50);
    // La mini-rata del gap è meno della metà della rata del rifinanziamento totale
    expect(partialSim.miniRefinanceMonthly).toBeLessThan(partialSim.fullRefinanceMonthly * 0.7);
    expect(partialSim.interestSavedVsFullRefinance).toBeGreaterThan(500);
  });

  it('sanitizes CSV cells against formula injection (CWE-1236)', () => {
    // Numeri normali
    expect(sanitizeCsvCell(1250.5)).toBe('1250.50');
    expect(sanitizeCsvCell(0)).toBe('0.00');

    // Testi normali
    expect(sanitizeCsvCell('Piano Ammortamento')).toBe('Piano Ammortamento');

    // Payload malevoli con trigger formula (=, +, -, @, \t, \r)
    expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
    expect(sanitizeCsvCell('+cmd|/C calc')).toBe('"\'=cmd|/C calc"'.replace('=cmd', '+cmd'));
    expect(sanitizeCsvCell('-2+3+cmd')).toBe('"\'=-2+3+cmd"'.replace('=-2', '-2'));
    expect(sanitizeCsvCell('@SUM(1+1)')).toBe('"\'=@SUM(1+1)"'.replace('=@', '@'));
  });

  it('correctly calculates Maxirata Semplice in pay_cash vs refinance mode', () => {
    const outCash = calculateAllOptions({
      ...DEFAULT_INPUTS,
      maxirataNoBtpMode: 'pay_cash',
    });
    const outRefi = calculateAllOptions({
      ...DEFAULT_INPUTS,
      maxirataNoBtpMode: 'refinance',
    });

    expect(outCash.maxirataNoBtp.mode).toBe('pay_cash');
    expect(outCash.maxirataNoBtp.monthlyInstallment2ndPeriod).toBe(0);
    expect(outRefi.maxirataNoBtp.mode).toBe('refinance');
    expect(outRefi.maxirataNoBtp.monthlyInstallment2ndPeriod).toBeGreaterThan(0);
    expect(outRefi.maxirataNoBtp.totalOutOfPocket).toBeGreaterThan(outCash.maxirataNoBtp.totalOutOfPocket);
  });

  it('correctly handles custom monthly BTP investment and gap refinancing in verdict', () => {
    // Investendo solo 100 €/mese per 36 mesi su 14.065 € di maxirata, si crea un gap evidente
    const outGap = calculateAllOptions({
      ...DEFAULT_INPUTS,
      btpContributionMode: 'custom',
      btpCustomMonthlyAmount: 100,
    });

    expect(outGap.maxirata.effectiveMonthlyBtpSavings).toBe(100);
    expect(outGap.maxirata.accumulatedBtpAtMaturity).toBeLessThan(4000);
    expect(outGap.maxirata.gapAmount).toBeGreaterThan(10000);
    expect(outGap.maxirata.gapRefinancedMonthly).toBeGreaterThan(0);
    expect(outGap.maxirata.gapRefinancedTotalPaid).toBeGreaterThan(outGap.maxirata.gapAmount);
  });

  it('prints exact numbers for inspection', () => {
    const res1 = calculateAllOptions(DEFAULT_INPUTS);
    console.log('=== TEST 1 (Škoda Reale con Promo 2.956 € e TAN 0%) ===');
    console.log('1. Contanti (Listino 23.350 €): outOfPocket =', res1.cash.totalOutOfPocket);
    console.log('2. Finanziamento Std (Listino 23.350 €, no promo, TAEG 7.45%): outOfPocket =', res1.standard.totalOutOfPocket, 'carPricePromo =', res1.standard.carPricePromo);
    console.log('3. Maxirata Rifinanziata 36m (con Promo): outOfPocket =', res1.maxirataNoBtp.totalOutOfPocket);
    console.log('   - 1° Periodo (35 x 99 €):', res1.maxirataNoBtp.totalPaid1stPeriod);
    console.log('   - 2° Periodo (36 x 446.85 €):', res1.maxirataNoBtp.totalPaid2ndPeriod);
    console.log('   - Anticipo + Spese:', res1.maxirataNoBtp.upfrontCash + 43.82);
    console.log('4. Maxirata + BTP: outOfPocket =', res1.maxirata.totalOutOfPocketWithBtp);
    console.log('VERDICT 1:', res1.verdict.winner, res1.verdict.winnerLabel);

    const calcWithoutCustom = calculateAllOptions({
      ...DEFAULT_INPUTS,
      maxirataCustomMonthlyInstallment: 0,
    });
    console.log('--- TEST WITH FORMULA (maxirataCustomMonthlyInstallment = 0) ---');
    console.log('maxiFinancedPrincipal =', calcWithoutCustom.maxirata.financedPrincipal);
    console.log('maxirataAmount =', calcWithoutCustom.maxirata.maxirataAmount);
    console.log('interimCount =', calcWithoutCustom.maxirata.interimInstallmentsCount);
    console.log('monthlyInstallmentPure =', calcWithoutCustom.maxirata.monthlyInstallmentPure);
    console.log('monthlyInstallmentTotal =', calcWithoutCustom.maxirata.monthlyInstallmentTotal);
    console.log('monthlyInterestOnBalloon =', calcWithoutCustom.maxirata.monthlyInterestOnBalloon);

    const res2 = calculateAllOptions({
      ...DEFAULT_INPUTS,
      carPriceCash: 23350,
      financingDiscount: 0,
      maxirataCustomMonthlyInstallment: 0,
      maxirataFixedAmount: 14065.33,
      maxirataTan: 6.9,
      maxirataTaeg: 8.5,
      refinanceTaeg: 8.9,
      refinanceMonths: 36,
    });
    console.log('\n=== TEST 2 (Senza Sconto Concessionario: Promo = 0 €, TAN 6.9%, TAEG 8.5%) ===');
    console.log('1. Contanti:', res2.cash.totalOutOfPocket);
    console.log('2. Finanziamento Std:', res2.standard.totalOutOfPocket);
    console.log('3. Maxirata Rifinanziata (No BTP):', res2.maxirataNoBtp.totalOutOfPocket);
    console.log('4. Maxirata + BTP:', res2.maxirata.totalOutOfPocketWithBtp);
    console.log('VERDICT 2:', res2.verdict.winner, res2.verdict.winnerLabel);
  });

  it('dynamically adapts candidate labels and explanations to selectedInstrumentName', () => {
    const res = calculateAllOptions({
      ...DEFAULT_INPUTS,
      selectedInstrumentId: 'conto_deposito',
      selectedInstrumentName: 'Conto Deposito',
      btpGrossYield: 3.2,
      taxRegime: 'deposito_26',
    });

    const candidates = res.verdict.candidates;
    const maxiCand = candidates.find((c) => c.id === 'maxirata');
    const maxiNoBtpCand = candidates.find((c) => c.id === 'maxirata_no_btp');

    expect(maxiCand?.label).toContain('Conto Deposito');
    expect(maxiNoBtpCand?.label).toContain('Senza Conto Deposito');
    if (res.verdict.winner === 'maxirata') {
      expect(res.verdict.winnerLabel).toContain('Conto Deposito');
    }
  });

  it('accurately calculates real quote Škoda Kamiq Be More (35 installments of 119 € with TAN 0% and TAEG 1.01%)', () => {
    // Škoda Kamiq Be More 1.0 TSI 95cv:
    // Listino 28.800 €, Promo 24.033 €, Anticipo 3.514,31 €, Istruttoria 380 € (nel credito)
    // Finanziato 20.898,69 €, 35 rate da 119 €, VFG 16.733,66 €, TAN 0,00%, TAEG 1,01%, incasso 3,40 €
    const res = calculateAllOptions({
      ...DEFAULT_INPUTS,
      scenarioName: 'Škoda Kamiq Be More 1.0 TSI',
      carPriceCash: 28800,
      financingDiscount: 28800 - 24033, // 4.767 € di sconto promo
      downPaymentCash: 3514.31,
      tradeInValue: 0,
      extraServicesFee: 0,
      originationFee: 380,
      monthlyCollectionFee: 3.4,
      stampDuty: 52.24,
      maxirataMonths: 36,
      maxirataInterimCount: 35,
      maxirataTan: 0.0,
      maxirataTaeg: 1.01,
      maxirataFixedAmount: 16733.66,
      maxirataPercent: Number(((16733.66 / 28800) * 100).toFixed(2)),
      maxirataCustomMonthlyInstallment: 0, // Lasciato calcolare dalla formula via TAN!
    });

    // 1. Financed principal deve essere esattamente 20.898,69 € (24.033 - 3.514,31 + 380)
    expect(res.maxirata.financedPrincipal).toBeCloseTo(20898.69, 1);
    // 2. Rata pura calcolata dalla formula: (20.898,69 - 16.733,66) / 35 = 119,00 €!
    expect(res.maxirata.monthlyInstallmentPure).toBeCloseTo(119.0, 1);
    // 3. Rata comprensiva di spese incasso: 119,00 + 3,40 = 122,40 €!
    expect(res.maxirata.monthlyFinancingPaymentWithFees).toBeCloseTo(122.4, 1);
    // 4. Interessi puri balloon a TAN 0% devono essere 0,00 €!
    expect(res.maxirata.monthlyInterestOnBalloon).toBe(0);
    expect(res.maxirata.totalPureInterest1stPeriod).toBeCloseTo(0, 1);
    // 5. In Card 3 (Maxirata No BTP) la rata deve coincidere al centesimo
    expect(res.maxirataNoBtp.monthlyFinancingPaymentWithFees).toBeCloseTo(122.4, 1);
  });
});

