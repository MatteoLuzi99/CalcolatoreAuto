import type {
  BtpAccumulatorResult,
  CalculatorInputs,
  CashOptionResult,
  ComparisonVerdict,
  FullCalculationOutput,
  MaxirataLoanResult,
  MaxirataNoBtpResult,
  MaxirataRefinanceResult,
  MonthlyTimelinePoint,
  StandardLoanResult,
  TaxRegime,
  WinnerOptionId,
} from '../types/calculator';

export const DEFAULT_INPUTS: CalculatorInputs = {
  scenarioName: 'Škoda Fabia 1.0 TSI (Clever Value)',
  carPriceCash: 23350,
  financingDiscount: 2956.3, // 23.350 - 20.393,70 (promozione legata alla Maxirata)
  standardFinancingDiscount: 0, // Nessun extra sconto sul finanziamento classico (prezzo pieno di listino)
  tradeInValue: 0,
  downPaymentCash: 3243.32,
  extraServicesFee: 280, // Extended Warranty 280 €

  standardTaeg: 7.45,
  standardMonths: 60,

  maxirataTan: 0.0,
  maxirataTaeg: 1.19,
  maxirataMonths: 36,
  maxirataInterimCount: 35,
  maxirataCustomMonthlyInstallment: 99.0,
  maxirataPercent: 60.237,
  maxirataFixedAmount: 14065.33,

  btpGrossYield: 3.5,
  taxRegime: 'btp_12_5',
  selectedInstrumentId: 'btp_3y',
  selectedInstrumentName: 'BTP',
  btpInitialCapital: 0,
  includeOpportunityCost: true,

  originationFee: 380,
  monthlyCollectionFee: 3.4,
  stampDuty: 43.82,
  mandatoryInsuranceMonthly: 0,

  refinanceMonths: 36,
  refinanceTaeg: 8.9,

  maxirataNoBtpMode: 'refinance',
  btpContributionMode: 'auto',
  btpCustomMonthlyAmount: 0,
};

export function getTaxRate(regime: TaxRegime): number {
  switch (regime) {
    case 'btp_12_5':
      return 0.125;
    case 'deposito_26':
      return 0.26;
    case 'net_0':
      return 0;
  }
}

/**
 * Calcola la rata costante posticipata (ammortamento alla francese)
 */
export function calcFrenchInstallment(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

/**
 * Calcola la rata mensile di un finanziamento con Maxirata Finale (Balloon Loan).
 * Sulla quota ammortizzata (Principal - Maxirata) si applica l'ammortamento alla francese;
 * sulla Maxirata si pagano gli interessi semplici mensili (Maxirata * monthlyRate) per tutta la durata.
 */
export function calcBalloonInstallment(
  principal: number,
  balloon: number,
  monthlyRate: number,
  months: number
): { installment: number; monthlyBalloonInterest: number } {
  if (principal <= 0 || months <= 0) {
    return { installment: 0, monthlyBalloonInterest: 0 };
  }
  const effectiveBalloon = Math.min(principal, Math.max(0, balloon));
  const amortizedPart = Math.max(0, principal - effectiveBalloon);
  const baseInstallment = calcFrenchInstallment(amortizedPart, monthlyRate, months);
  const monthlyBalloonInterest = effectiveBalloon * Math.max(0, monthlyRate);
  return {
    installment: baseInstallment + monthlyBalloonInterest,
    monthlyBalloonInterest,
  };
}

/**
 * Calcola il Piano di Accumulo Mensile (Salvadanaio BTP) per coprire esattamente la Maxirata a scadenza.
 */
export function calcBtpAccumulator(
  targetMaxirata: number,
  months: number,
  grossAnnualYieldPercent: number,
  taxRegime: TaxRegime,
  initialCapital = 0
): BtpAccumulatorResult {
  const taxRate = getTaxRate(taxRegime);
  const grossAnnualYield = Math.max(0, grossAnnualYieldPercent) / 100;
  const netAnnualYield = grossAnnualYield * (1 - taxRate);
  // Tasso mensile composto equivalente: (1 + r_netto)^(1/12) - 1
  const netMonthlyRate = Math.pow(1 + netAnnualYield, 1 / 12) - 1;

  const safeMonths = Math.max(1, months);
  const safeTarget = Math.max(0, targetMaxirata);
  const safeInitial = Math.min(safeTarget, Math.max(0, initialCapital));

  const initialCapitalFutureValue =
    safeInitial * Math.pow(1 + netMonthlyRate, safeMonths);
  const remainingTarget = Math.max(0, safeTarget - initialCapitalFutureValue);

  let monthlySavingsRequired = 0;
  if (remainingTarget > 0) {
    if (netMonthlyRate <= 0) {
      monthlySavingsRequired = remainingTarget / safeMonths;
    } else {
      // Versamento mensile posticipato: M_res * i / ((1 + i)^N - 1)
      monthlySavingsRequired =
        (remainingTarget * netMonthlyRate) /
        (Math.pow(1 + netMonthlyRate, safeMonths) - 1);
    }
  }

  const monthlySavingsZeroYield = Math.max(0, safeTarget - safeInitial) / safeMonths;
  const monthlySavingsBenefit = Math.max(
    0,
    monthlySavingsZeroYield - monthlySavingsRequired
  );
  const totalPrincipalDeposited =
    safeInitial + monthlySavingsRequired * safeMonths;
  const totalNetInterestEarned = Math.max(0, safeTarget - totalPrincipalDeposited);
  const interestCoveragePercent =
    safeTarget > 0 ? (totalNetInterestEarned / safeTarget) * 100 : 0;

  return {
    targetMaxirata: safeTarget,
    months: safeMonths,
    grossAnnualYield: grossAnnualYieldPercent,
    netAnnualYield: netAnnualYield * 100,
    netMonthlyRate,
    taxRate: taxRate * 100,
    initialCapital: safeInitial,
    initialCapitalFutureValue,
    monthlySavingsRequired,
    monthlySavingsZeroYield,
    monthlySavingsBenefit,
    totalPrincipalDeposited,
    totalNetInterestEarned,
    interestCoveragePercent,
  };
}

/**
 * Simula quanto rende il capitale non speso subito se mantenuto investito al tasso netto BTP.
 */
export function calcRetainedLiquidityBtpGain(
  unspentInitialCash: number,
  monthlyOutflow: number,
  netMonthlyRate: number,
  months: number
): number {
  if (unspentInitialCash <= 0 || netMonthlyRate <= 0 || months <= 0) return 0;
  let balance = unspentInitialCash;
  let totalInterestEarned = 0;

  for (let m = 1; m <= months; m++) {
    if (balance > 0) {
      const interest = balance * netMonthlyRate;
      totalInterestEarned += interest;
      balance = Math.max(0, balance + interest - monthlyOutflow);
    }
  }
  return totalInterestEarned;
}

/**
 * Calcola il TAEG di Pareggio (Break-Even TAEG).
 */
export function solveBreakEvenTaeg(
  inputs: CalculatorInputs,
  cashTargetCost: number
): number {
  // Calcola il TAEG di pareggio rispetto alla formula di finanziamento promozionata
  const promoDiscount = Math.max(0, inputs.financingDiscount);
  const totalUpfront = inputs.tradeInValue + inputs.downPaymentCash;
  const carPricePromo = Math.max(0, inputs.carPriceCash - promoDiscount);
  const basePrincipal = Math.max(0, carPricePromo - totalUpfront);
  if (basePrincipal <= 0) return 0;

  const financedPrincipal =
    basePrincipal + inputs.originationFee + (inputs.extraServicesFee || 0);
  const taxRate = getTaxRate(inputs.taxRegime);
  const netAnnualYield = (Math.max(0, inputs.btpGrossYield) / 100) * (1 - taxRate);
  const netMonthlyRate = Math.pow(1 + netAnnualYield, 1 / 12) - 1;
  const unspentInitialCash = Math.max(
    0,
    inputs.carPriceCash - inputs.tradeInValue - inputs.downPaymentCash
  );

  const months = Math.max(1, inputs.maxirataMonths || inputs.standardMonths);

  const costAtTaeg = (taegPercent: number): number => {
    const i = taegPercent / 100 / 12;
    const pureR = calcFrenchInstallment(financedPrincipal, i, months);
    const totR =
      pureR + inputs.monthlyCollectionFee + inputs.mandatoryInsuranceMonthly;
    const outOfPocket =
      inputs.tradeInValue +
      inputs.downPaymentCash +
      inputs.stampDuty +
      totR * months;
    const btpGain = inputs.includeOpportunityCost
      ? calcRetainedLiquidityBtpGain(
          unspentInitialCash,
          totR,
          netMonthlyRate,
          months
        )
      : 0;
    return outOfPocket - btpGain;
  };

  if (costAtTaeg(0) > cashTargetCost) return 0;
  let low = 0;
  let high = 25;
  for (let iter = 0; iter < 35; iter++) {
    const mid = (low + high) / 2;
    if (costAtTaeg(mid) < cashTargetCost) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

/**
 * Esegue il calcolo completo per tutte le opzioni.
 */
export function calculateAllOptions(
  inputs: CalculatorInputs
): FullCalculationOutput {
  const taxRate = getTaxRate(inputs.taxRegime);
  const grossAnnualYield = Math.max(0, inputs.btpGrossYield) / 100;
  const netAnnualYield = grossAnnualYield * (1 - taxRate);
  const netMonthlyBtpRate = Math.pow(1 + netAnnualYield, 1 / 12) - 1;

  const safeCarPriceCash = Math.max(100, inputs.carPriceCash);
  const safeDiscount = Math.min(safeCarPriceCash, Math.max(0, inputs.financingDiscount));
  const carPricePromo = safeCarPriceCash - safeDiscount;

  const safeTradeIn = Math.min(carPricePromo, Math.max(0, inputs.tradeInValue));
  const safeDownCash = Math.max(0, inputs.downPaymentCash);
  const safeExtraServices = Math.max(0, inputs.extraServicesFee || 0);

  // 1. OPZIONE CONTANTI
  const cashUpfront = Math.max(0, safeCarPriceCash - safeTradeIn);
  const cashTotalOutOfPocket = safeCarPriceCash;
  const extraCashImmobilized = Math.max(0, cashUpfront - safeDownCash);
  const opportunityCostBtp = inputs.includeOpportunityCost
    ? calcRetainedLiquidityBtpGain(
        extraCashImmobilized,
        extraCashImmobilized / Math.max(1, inputs.maxirataMonths),
        netMonthlyBtpRate,
        inputs.maxirataMonths
      )
    : 0;

  const cashResult: CashOptionResult = {
    upfrontPayment: cashUpfront,
    tradeInValue: safeTradeIn,
    totalOutOfPocket: cashTotalOutOfPocket,
    forgoneDiscount: safeDiscount,
    opportunityCostBtp,
    realNetCost: cashTotalOutOfPocket,
  };

  // 2. OPZIONE FINANZIAMENTO STANDARD
  const stdDiscount = Math.min(
    safeCarPriceCash,
    Math.max(0, inputs.standardFinancingDiscount ?? 0)
  );
  const stdCarPrice = safeCarPriceCash - stdDiscount;
  const stdNetPrincipal = Math.max(
    0,
    stdCarPrice + safeExtraServices - safeTradeIn - safeDownCash
  );
  const stdFinancedPrincipal =
    stdNetPrincipal > 0 ? stdNetPrincipal + Math.max(0, inputs.originationFee) : 0;
  const stdMonthlyRate = Math.max(0, inputs.standardTaeg) / 100 / 12;
  const stdInstallmentPure = calcFrenchInstallment(
    stdFinancedPrincipal,
    stdMonthlyRate,
    inputs.standardMonths
  );
  const stdMonthlyTotal =
    stdFinancedPrincipal > 0
      ? stdInstallmentPure +
        inputs.monthlyCollectionFee +
        inputs.mandatoryInsuranceMonthly
      : 0;
  const stdTotalInstallmentsPaid = stdMonthlyTotal * inputs.standardMonths;
  const stdStampDuty = stdFinancedPrincipal > 0 ? inputs.stampDuty : 0;
  const stdTotalOutOfPocket =
    safeTradeIn + safeDownCash + stdStampDuty + stdTotalInstallmentsPaid;
  const stdTotalAccessoryFees =
    stdFinancedPrincipal > 0
      ? inputs.originationFee +
        stdStampDuty +
        (inputs.monthlyCollectionFee + inputs.mandatoryInsuranceMonthly) *
          inputs.standardMonths
      : 0;
  const stdTotalPureInterest = Math.max(
    0,
    stdInstallmentPure * inputs.standardMonths - stdFinancedPrincipal
  );
  const stdTotalInterestAndFees = stdTotalPureInterest + stdTotalAccessoryFees;

  const stdLiquidityBtpGain = inputs.includeOpportunityCost
    ? calcRetainedLiquidityBtpGain(
        extraCashImmobilized,
        stdMonthlyTotal,
        netMonthlyBtpRate,
        inputs.standardMonths
      )
    : 0;

  const stdRealNetCost = stdTotalOutOfPocket - stdLiquidityBtpGain;

  const standardResult: StandardLoanResult = {
    carPricePromo: stdCarPrice,
    appliedDiscount: stdDiscount,
    upfrontCash: safeDownCash,
    tradeInValue: safeTradeIn,
    financedPrincipal: stdFinancedPrincipal,
    monthlyInstallmentPure: stdInstallmentPure,
    monthlyInstallmentTotal: stdMonthlyTotal,
    totalInstallmentsPaid: stdTotalInstallmentsPaid,
    totalInterestAndFees: stdTotalInterestAndFees,
    totalPureInterest: stdTotalPureInterest,
    totalAccessoryFees: stdTotalAccessoryFees,
    totalOutOfPocket: stdTotalOutOfPocket,
    liquidityBtpGain: stdLiquidityBtpGain,
    realNetCost: stdRealNetCost,
    effectiveTaeg: inputs.standardTaeg,
  };

  // 3. OPZIONE FINANZIAMENTO CON MAXIRATA + SALVADANAIO BTP
  const maxiNetPrincipal = Math.max(
    0,
    carPricePromo + safeExtraServices - safeTradeIn - safeDownCash
  );
  const maxiFinancedPrincipal =
    maxiNetPrincipal > 0 ? maxiNetPrincipal + Math.max(0, inputs.originationFee) : 0;

  // Maxirata amount: se l'utente ha inserito maxirataFixedAmount dal preventivo usa quello, altrimenti calcola dalla %
  let maxirataAmount = 0;
  if (inputs.maxirataFixedAmount && inputs.maxirataFixedAmount > 0) {
    maxirataAmount = inputs.maxirataFixedAmount;
  } else {
    maxirataAmount = Number(
      (safeCarPriceCash * (inputs.maxirataPercent / 100)).toFixed(2)
    );
  }

  // Durata ed eventuali rate intermedie (es. 35 rate invece di 36)
  const totalMonths = Math.max(1, inputs.maxirataMonths);
  const interimCount =
    inputs.maxirataInterimCount && inputs.maxirataInterimCount > 0
      ? inputs.maxirataInterimCount
      : totalMonths;

  // Tasso mensile nominale (TAN) per il calcolo della rata di ammortamento contrattuale.
  // Nei contratti di finanziamento ufficiali (come Škoda Clever Value, Volkswagen Progetto Valore, ecc.),
  // la rata è calcolata esclusivamente sul TAN (Tasso Annuo Nominale).
  // Se il TAN è 0.00% (tasso zero promozionale), la quota interessi è esattamente 0,00 € e la rata ammortizza solo
  // la differenza tra capitale finanziato e Maxirata: (Capitale - Maxirata) / rate.
  // Il TAEG include invece oneri accessori (istruttoria, incasso, bollo) e rappresenta il costo globale.
  const effectiveTan =
    typeof inputs.maxirataTan === 'number'
      ? inputs.maxirataTan
      : inputs.maxirataTaeg;
  const maxiMonthlyRate = Math.max(0, effectiveTan) / 100 / 12;

  let maxiInstallmentPure = 0;
  let monthlyBalloonInterest = 0;

  // Se l'utente ha inserito direttamente la rata del preventivo (es. 99,00 €)
  if (
    inputs.maxirataCustomMonthlyInstallment &&
    inputs.maxirataCustomMonthlyInstallment > 0
  ) {
    maxiInstallmentPure = inputs.maxirataCustomMonthlyInstallment;
    monthlyBalloonInterest = maxirataAmount * maxiMonthlyRate;
  } else {
    const calc = calcBalloonInstallment(
      maxiFinancedPrincipal,
      maxirataAmount,
      maxiMonthlyRate,
      interimCount
    );
    maxiInstallmentPure = calc.installment;
    monthlyBalloonInterest = calc.monthlyBalloonInterest;
  }

  // Rata pagata alla concessionaria comprensiva di spese incasso rata e polizze
  const maxiMonthlyTotal =
    maxiFinancedPrincipal > 0
      ? maxiInstallmentPure +
        inputs.monthlyCollectionFee +
        inputs.mandatoryInsuranceMonthly
      : 0;

  const maxiStampDuty = maxiFinancedPrincipal > 0 ? inputs.stampDuty : 0;
  const maxiAccessoryFees =
    maxiFinancedPrincipal > 0
      ? inputs.originationFee +
        maxiStampDuty +
        (inputs.monthlyCollectionFee + inputs.mandatoryInsuranceMonthly) *
          interimCount
      : 0;

  const maxiPureInterest = Math.max(
    0,
    maxiInstallmentPure * interimCount + maxirataAmount - maxiFinancedPrincipal
  );
  const maxiInterestAndFees = maxiPureInterest + maxiAccessoryFees;

  // --- OPZIONE 3: MAXIRATA SENZA BTP (Classica) ---
  const noBtpMode = inputs.maxirataNoBtpMode || 'refinance';

  // Calcolo Rifinanziamento standard della Maxirata (2° Periodo)
  const refiMonthlyRate = Math.max(0, inputs.refinanceTaeg) / 100 / 12;
  const refiPureInstallment = calcFrenchInstallment(
    maxirataAmount,
    refiMonthlyRate,
    inputs.refinanceMonths
  );
  const refiMonthlyTotal =
    maxirataAmount > 0 ? refiPureInstallment + inputs.monthlyCollectionFee : 0;
  const totalPaid2ndPeriod = refiMonthlyTotal * inputs.refinanceMonths;
  const extraInterest2ndPeriod = Math.max(0, totalPaid2ndPeriod - maxirataAmount);

  const noBtpTotalPaid1stPeriod = maxiMonthlyTotal * interimCount;
  const noBtpTotalPaid2ndPeriod =
    noBtpMode === 'pay_cash' ? maxirataAmount : totalPaid2ndPeriod;
  const noBtpExtraInterest =
    noBtpMode === 'pay_cash' ? 0 : extraInterest2ndPeriod;

  const noBtpTotalOutOfPocket =
    safeTradeIn +
    safeDownCash +
    maxiStampDuty +
    noBtpTotalPaid1stPeriod +
    noBtpTotalPaid2ndPeriod;

  const noBtpTotalInterestAndFees = maxiInterestAndFees + noBtpExtraInterest;

  const noBtpLiquidityBtpGain = inputs.includeOpportunityCost
    ? calcRetainedLiquidityBtpGain(
        extraCashImmobilized,
        maxiMonthlyTotal,
        netMonthlyBtpRate,
        totalMonths
      )
    : 0;

  const noBtpRealNetCost = noBtpTotalOutOfPocket - noBtpLiquidityBtpGain;

  const maxirataNoBtpResult: MaxirataNoBtpResult = {
    mode: noBtpMode,
    carPricePromo,
    upfrontCash: safeDownCash,
    tradeInValue: safeTradeIn,
    extraServicesFee: safeExtraServices,
    financedPrincipal: maxiFinancedPrincipal,
    maxirataAmount,
    maxirataPercent: Number(((maxirataAmount / safeCarPriceCash) * 100).toFixed(2)),
    months: totalMonths,
    interimInstallmentsCount: interimCount,
    monthlyInstallmentPure: maxiInstallmentPure,
    monthlyFinancingPaymentWithFees: maxiMonthlyTotal,
    totalPaid1stPeriod: noBtpTotalPaid1stPeriod,
    monthlyInstallment2ndPeriod: noBtpMode === 'pay_cash' ? 0 : refiMonthlyTotal,
    totalPaid2ndPeriod: noBtpTotalPaid2ndPeriod,
    extraInterest2ndPeriod: noBtpExtraInterest,
    totalOutOfPocket: noBtpTotalOutOfPocket,
    totalInterestAndFees: noBtpTotalInterestAndFees,
    liquidityBtpGain: noBtpLiquidityBtpGain,
    realNetCost: noBtpRealNetCost,
  };

  // --- OPZIONE 4: MAXIRATA + SALVADANAIO BTP (Con Quota Custom e Rifinanziamento Gap) ---
  const btpAccumulator = calcBtpAccumulator(
    maxirataAmount,
    totalMonths,
    inputs.btpGrossYield,
    inputs.taxRegime,
    inputs.btpInitialCapital
  );

  // Determina la quota mensile BTP: auto (copertura 100%) oppure scelta libera dell'utente
  const effectiveMonthlyBtpSavings =
    inputs.btpContributionMode === 'custom' &&
    inputs.btpCustomMonthlyAmount !== undefined &&
    inputs.btpCustomMonthlyAmount >= 0
      ? inputs.btpCustomMonthlyAmount
      : btpAccumulator.monthlySavingsRequired;

  // Calcolo del valore effettivo del fondo BTP accumulato a scadenza
  const safeInitial = Math.min(maxirataAmount, Math.max(0, inputs.btpInitialCapital || 0));
  const initialFutureVal = safeInitial * Math.pow(1 + netMonthlyBtpRate, totalMonths);
  let monthlySavingsFutureVal = 0;
  if (netMonthlyBtpRate <= 0) {
    monthlySavingsFutureVal = effectiveMonthlyBtpSavings * totalMonths;
  } else {
    monthlySavingsFutureVal =
      effectiveMonthlyBtpSavings *
      ((Math.pow(1 + netMonthlyBtpRate, totalMonths) - 1) / netMonthlyBtpRate);
  }
  const accumulatedBtpAtMaturity = initialFutureVal + monthlySavingsFutureVal;

  // Calcolo Gap da colmare vs eventuale Surplus
  const gapAmount = Math.max(0, maxirataAmount - accumulatedBtpAtMaturity);
  const surplusAmount = Math.max(0, accumulatedBtpAtMaturity - maxirataAmount);

  // Rifinanziamento del Gap residuo (se presente)
  let gapRefinancedMonthly = 0;
  let gapRefinancedTotalPaid = 0;
  let gapRefinancedExtraInterest = 0;

  if (gapAmount > 1) {
    const gapRefiPure = calcFrenchInstallment(gapAmount, refiMonthlyRate, inputs.refinanceMonths);
    gapRefinancedMonthly = gapRefiPure + inputs.monthlyCollectionFee;
    gapRefinancedTotalPaid = gapRefinancedMonthly * inputs.refinanceMonths;
    gapRefinancedExtraInterest = Math.max(0, gapRefinancedTotalPaid - gapAmount);
  }

  // Capitale versato di tasca nel salvadanaio BTP
  const totalBtpPrincipalDeposited = safeInitial + effectiveMonthlyBtpSavings * totalMonths;

  // Impegno mensile 1° periodo (Rata finanziaria concessionaria + Quota mensile BTP)
  const realMonthlyCommitmentWithBtp = maxiMonthlyTotal + effectiveMonthlyBtpSavings;

  // Esborso totale nominale senza BTP
  const nominalTotalWithoutBtp =
    safeTradeIn +
    safeDownCash +
    maxiStampDuty +
    maxiMonthlyTotal * interimCount +
    maxirataAmount;

  // Esborso vivo complessivo: include anticipo, rate 1° periodo, capitale versato BTP,
  // eventuale rifinanziamento del gap residuo, e sconta l'eventuale surplus
  const totalOutOfPocketWithBtp =
    safeTradeIn +
    safeDownCash +
    maxiStampDuty +
    maxiMonthlyTotal * interimCount +
    totalBtpPrincipalDeposited +
    gapRefinancedTotalPaid -
    surplusAmount;

  const remainingUnspentCashForMaxi = Math.max(
    0,
    extraCashImmobilized - safeInitial
  );
  const maxiLiquidityBtpGain = inputs.includeOpportunityCost
    ? calcRetainedLiquidityBtpGain(
        remainingUnspentCashForMaxi,
        realMonthlyCommitmentWithBtp,
        netMonthlyBtpRate,
        totalMonths
      )
    : 0;

  const maxiRealNetCost = totalOutOfPocketWithBtp - maxiLiquidityBtpGain;

  const refinanceScenario: MaxirataRefinanceResult = {
    refinancedPrincipal: maxirataAmount,
    months: inputs.refinanceMonths,
    taeg: inputs.refinanceTaeg,
    monthlyInstallment2ndPeriod: refiMonthlyTotal,
    totalPaid2ndPeriod,
    extraInterest2ndPeriod,
    totalOutOfPocketWithRefinance: noBtpTotalOutOfPocket,
    extraCostVsBtpAccumulator: Math.max(
      0,
      noBtpTotalOutOfPocket - totalOutOfPocketWithBtp
    ),
  };

  const maxirataResult: MaxirataLoanResult = {
    carPricePromo,
    upfrontCash: safeDownCash,
    tradeInValue: safeTradeIn,
    extraServicesFee: safeExtraServices,
    financedPrincipal: maxiFinancedPrincipal,
    maxirataAmount,
    maxirataPercent: Number(((maxirataAmount / safeCarPriceCash) * 100).toFixed(2)),
    months: totalMonths,
    interimInstallmentsCount: interimCount,
    monthlyInstallmentPure: maxiInstallmentPure,
    monthlyFinancingPaymentWithFees: maxiMonthlyTotal,
    monthlyBtpSavingsPure: effectiveMonthlyBtpSavings,
    monthlyInterestOnBalloon: monthlyBalloonInterest,
    monthlyInstallmentTotal: maxiMonthlyTotal,
    realMonthlyCommitmentWithBtp,
    totalInterestAndFees1stPeriod: maxiInterestAndFees,
    totalPureInterest1stPeriod: maxiPureInterest,
    totalAccessoryFees1stPeriod: maxiAccessoryFees,
    nominalTotalWithoutBtp,
    totalOutOfPocketWithBtp,
    effectiveMonthlyBtpSavings,
    accumulatedBtpAtMaturity,
    gapAmount,
    surplusAmount,
    gapRefinancedMonthly,
    gapRefinancedTotalPaid,
    gapRefinancedExtraInterest,
    liquidityBtpGain: maxiLiquidityBtpGain,
    realNetCost: maxiRealNetCost,
    btpAccumulator,
    refinanceScenario,
  };

  const instrumentName = inputs.selectedInstrumentName || 'BTP';

  // --- 4. VERDETTO & RANKING DELLE 4 OPZIONI ---
  const candidates: Array<{ id: WinnerOptionId; label: string; cost: number }> = [
    {
      id: 'cash',
      label: 'Acquisto in Contanti',
      cost: inputs.includeOpportunityCost
        ? cashResult.realNetCost
        : cashResult.totalOutOfPocket,
    },
    {
      id: 'standard',
      label: 'Finanziamento Standard',
      cost: inputs.includeOpportunityCost
        ? standardResult.realNetCost
        : standardResult.totalOutOfPocket,
    },
    {
      id: 'maxirata_no_btp',
      label:
        noBtpMode === 'pay_cash'
          ? `Maxirata (Senza ${instrumentName}) - Saldo Unico`
          : `Maxirata (Senza ${instrumentName}) - Rifinanziata`,
      cost: inputs.includeOpportunityCost
        ? maxirataNoBtpResult.realNetCost
        : maxirataNoBtpResult.totalOutOfPocket,
    },
    {
      id: 'maxirata',
      label:
        gapAmount > 10
          ? `Maxirata + ${instrumentName} (con Gap di ${Math.round(gapAmount).toLocaleString('it-IT')} €)`
          : `Maxirata + Salvadanaio ${instrumentName}`,
      cost: inputs.includeOpportunityCost
        ? maxirataResult.realNetCost
        : maxirataResult.totalOutOfPocketWithBtp,
    },
  ];

  candidates.sort((a, b) => a.cost - b.cost);
  const best = candidates[0];
  const second = candidates[1];
  const worst = candidates[candidates.length - 1];

  const savingsVsRunnerUp = Math.max(0, second.cost - best.cost);
  const savingsVsWorst = Math.max(0, worst.cost - best.cost);
  const breakEvenTaeg = solveBreakEvenTaeg(inputs, cashResult.realNetCost);

  let explanation = '';
  if (best.id === 'cash') {
    explanation = `Pagare in contanti ti fa risparmiare ${Math.round(
      savingsVsRunnerUp
    ).toLocaleString('it-IT')} € rispetto a "${second.label}". Lo sconto finanziamento (${Math.round(
      safeDiscount
    ).toLocaleString('it-IT')} €) e i rendimenti del salvadanaio non bastano a compensare gli interessi del finanziamento.`;
  } else if (best.id === 'standard') {
    const stdDisc = standardResult.appliedDiscount;
    explanation = stdDisc > 0
      ? `Grazie allo sconto di ${Math.round(stdDisc).toLocaleString('it-IT')} € e al rendimento sulla liquidità trattenuta, il Finanziamento Standard batte "${second.label}" di ${Math.round(savingsVsRunnerUp).toLocaleString('it-IT')} € netti.`
      : `Il Finanziamento Standard risulta la scelta migliore con un vantaggio di ${Math.round(savingsVsRunnerUp).toLocaleString('it-IT')} € rispetto a "${second.label}" grazie alla gestione flessibile della liquidità trattenuta.`;
  } else if (best.id === 'maxirata_no_btp') {
    explanation = `La formula Maxirata (${
      noBtpMode === 'pay_cash' ? 'saldo unico' : 'rifinanziata'
    }) risulta la più conveniente con un vantaggio di ${Math.round(
      savingsVsRunnerUp
    ).toLocaleString('it-IT')} € rispetto a "${second.label}".`;
  } else {
    if (gapAmount > 10) {
      explanation = `Anche dovendo rifinanziare il gap residuo di ${Math.round(
        gapAmount
      ).toLocaleString('it-IT')} €, la combinazione Maxirata + ${instrumentName} (${Math.round(
        effectiveMonthlyBtpSavings
      ).toLocaleString('it-IT')} €/mese) vince con un risparmio netto di ${Math.round(
        savingsVsRunnerUp
      ).toLocaleString('it-IT')} € rispetto a "${second.label}".`;
    } else {
      explanation = `La formula Maxirata con Salvadanaio ${instrumentName} al 100% sfrutta lo sconto promozionale di ${Math.round(
        safeDiscount
      ).toLocaleString('it-IT')} € e genera interessi a tuo favore, facendoti risparmiare ${Math.round(
        savingsVsRunnerUp
      ).toLocaleString('it-IT')} € rispetto a "${second.label}".`;
    }
  }

  const verdict: ComparisonVerdict = {
    winner: best.id,
    winnerLabel: best.label,
    runnerUp: second.id,
    runnerUpLabel: second.label,
    savingsVsRunnerUp,
    savingsVsWorst,
    breakEvenTaeg,
    explanation,
    candidates,
  };

  // 5. TIMELINE MENSILE
  const horizonMonths = Math.max(
    inputs.standardMonths,
    totalMonths + inputs.refinanceMonths
  );

  const timeline: MonthlyTimelinePoint[] = [];
  let stdDebt = stdFinancedPrincipal;
  let maxiDebt = maxiFinancedPrincipal;
  let btpBalance = btpAccumulator.initialCapital;
  let btpPrincipalCum = btpAccumulator.initialCapital;

  let stdCumOut = safeTradeIn + safeDownCash + stdStampDuty;
  let maxiBtpCumOut =
    safeTradeIn + safeDownCash + maxiStampDuty + btpAccumulator.initialCapital;
  let maxiRefiCumOut = safeTradeIn + safeDownCash + maxiStampDuty;

  timeline.push({
    month: 0,
    cashCumulativeOut: safeCarPriceCash,
    standardCumulativeOut: stdCumOut,
    maxirataWithBtpCumulativeOut: maxiBtpCumOut,
    maxirataRefinancedCumulativeOut: maxiRefiCumOut,
    btpFundBalance: btpBalance,
    btpPrincipalCumulative: btpPrincipalCum,
    standardRemainingDebt: stdDebt,
    maxirataRemainingDebt: maxiDebt,
    standardInterestMonth: 0,
    standardPrincipalMonth: 0,
    maxirataInterestMonth: 0,
    maxirataPrincipalMonth: 0,
    btpInterestEarnedMonth: 0,
  });

  const maxiAmortizedPortion = Math.max(0, maxiFinancedPrincipal - maxirataAmount);
  const maxiBaseInstallment = calcFrenchInstallment(
    maxiAmortizedPortion,
    maxiMonthlyRate,
    interimCount
  );
  let maxiAmortizedDebt = maxiAmortizedPortion;

  for (let m = 1; m <= horizonMonths; m++) {
    let stdIntM = 0;
    let stdPrinM = 0;
    if (m <= inputs.standardMonths && stdDebt > 0) {
      stdIntM = stdDebt * stdMonthlyRate;
      stdPrinM = Math.min(stdDebt, Math.max(0, stdInstallmentPure - stdIntM));
      stdDebt = Math.max(0, stdDebt - stdPrinM);
      stdCumOut += stdMonthlyTotal;
    }

    let maxiIntM = 0;
    let maxiPrinM = 0;
    let btpIntM = 0;

    if (m <= totalMonths) {
      if (m <= interimCount && maxiDebt > 0) {
        const intOnAmortized = maxiAmortizedDebt * maxiMonthlyRate;
        maxiIntM = intOnAmortized + monthlyBalloonInterest;
        maxiPrinM = Math.min(
          maxiAmortizedDebt,
          Math.max(0, maxiBaseInstallment - intOnAmortized)
        );
        maxiAmortizedDebt = Math.max(0, maxiAmortizedDebt - maxiPrinM);
        maxiDebt = maxiAmortizedDebt + maxirataAmount;
        maxiBtpCumOut += maxiMonthlyTotal;
        maxiRefiCumOut += maxiMonthlyTotal;
      }

      btpIntM = btpBalance * netMonthlyBtpRate;
      btpBalance = btpBalance + btpIntM + btpAccumulator.monthlySavingsRequired;
      btpPrincipalCum += btpAccumulator.monthlySavingsRequired;

      maxiBtpCumOut += btpAccumulator.monthlySavingsRequired;

      if (m === totalMonths) {
        maxiDebt = 0;
      }
    } else if (m <= totalMonths + inputs.refinanceMonths) {
      maxiRefiCumOut += refiMonthlyTotal;
    }

    timeline.push({
      month: m,
      cashCumulativeOut: safeCarPriceCash,
      standardCumulativeOut: stdCumOut,
      maxirataWithBtpCumulativeOut: maxiBtpCumOut,
      maxirataRefinancedCumulativeOut: maxiRefiCumOut,
      btpFundBalance: m <= totalMonths ? btpBalance : maxirataAmount,
      btpPrincipalCumulative: btpPrincipalCum,
      standardRemainingDebt: stdDebt,
      maxirataRemainingDebt: maxiDebt,
      standardInterestMonth: stdIntM,
      standardPrincipalMonth: stdPrinM,
      maxirataInterestMonth: maxiIntM,
      maxirataPrincipalMonth: maxiPrinM,
      btpInterestEarnedMonth: btpIntM,
    });
  }

  return {
    inputs,
    horizonMonths,
    netAnnualBtpYield: netAnnualYield * 100,
    cash: cashResult,
    standard: standardResult,
    maxirataNoBtp: maxirataNoBtpResult,
    maxirata: maxirataResult,
    verdict,
    timeline,
  };
}
