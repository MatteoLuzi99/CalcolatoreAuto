export type TaxRegime = 'btp_12_5' | 'deposito_26' | 'net_0';

export interface CalculatorInputs {
  /** Nome opzionale del modello/preventivo (es. "Škoda Fabia Clever Value") */
  scenarioName: string;
  /** Prezzo auto chiavi in mano per acquisto in contanti (€) (Prezzo di Listino) */
  carPriceCash: number;
  /** Extra sconto concessionario se si sceglie un finanziamento con maxirata / promo (€) */
  financingDiscount: number;
  /** Extra sconto concessionario se si sceglie il finanziamento standard classico (€, default 0: normalmente le promozioni sono riservate alla maxirata) */
  standardFinancingDiscount?: number;
  /** Valore permuta o rottamazione dell'usato (€) */
  tradeInValue: number;
  /** Anticipo in contanti versato nei finanziamenti (€) */
  downPaymentCash: number;
  /** Servizi aggiuntivi / Garanzie estese una tantum finanziate (€, es. Extended Warranty 280 €) */
  extraServicesFee: number;

  // Parametri Finanziamento Standard
  /** TAEG / Tasso annuo Finanziamento Standard (%) */
  standardTaeg: number;
  /** Durata in mesi Finanziamento Standard (es. 12..84) */
  standardMonths: number;

  // Parametri Finanziamento con Maxirata (VFG / Valore Futuro Garantito)
  /** TAN fisso Finanziamento con Maxirata (%, es. 0.00%) */
  maxirataTan: number;
  /** TAEG Finanziamento con Maxirata (%, es. 1.19%) */
  maxirataTaeg: number;
  /** Durata totale 1° periodo in mesi (es. 36 o 48 mesi) */
  maxirataMonths: number;
  /** Numero esatto di rate mensili intermedie del preventivo (es. 35 rate + 1 finale). Se 0, usa maxirataMonths */
  maxirataInterimCount: number;
  /** Rata mensile pura contrattuale indicata sul preventivo (€/mese, es. 99,00 €). Se 0, viene calcolata via formula */
  maxirataCustomMonthlyInstallment: number;
  /** Percentuale Maxirata Finale calcolata sul prezzo listino/contanti (%) */
  maxirataPercent: number;
  /** Importo fisso Maxirata / Rata Finale (€, es. 14.065,33 €). Se > 0, ha precedenza sulla percentuale */
  maxirataFixedAmount: number;

  // Parametri Salvadanaio & Costo Opportunità Liquidità (Strumento Finanziario Selezionato)
  /** ID dello strumento finanziario selezionato (es. 'btp_3y', 'conto_deposito', 'pac_etf_azionario_mondo') */
  selectedInstrumentId?: string;
  /** Nome breve personalizzato dello strumento selezionato (es. "BTP 3 Anni", "Conto Deposito", "PAC ETF") */
  selectedInstrumentName?: string;
  /** Rendimento annuo lordo strumento di risparmio (%) */
  btpGrossYield: number;
  /** Tassazione applicata al rendimento ('btp_12_5' = 12.5%, 'deposito_26' = 26%, 'net_0' = 0%) */
  taxRegime: TaxRegime;
  /** Capitale iniziale eventualmente già messo da parte nel Salvadanaio al mese 0 (€) */
  btpInitialCapital: number;
  /** Se true, il verdetto e il confronto principale includono il costo opportunità del capitale non speso */
  includeOpportunityCost: boolean;

  // Dettagli Preventivo & Costi Accessori (espandibili)
  /** Spese di istruttoria pratica (€, aggiunte al capitale finanziato o pagate all'inizio) */
  originationFee: number;
  /** Spese di incasso rata mensili (€/mese, es. 3,40 €) */
  monthlyCollectionFee: number;
  /** Imposta di bollo / sostitutiva apertura pratica (€, es. 43,82 €) */
  stampDuty: number;
  /** Polizze / servizi obbligatori vincolati al finanziamento (€/mese) */
  mandatoryInsuranceMonthly: number;

  // Simulazione "Trappola del Rifinanziamento" della Maxirata
  /** Durata rifinanziamento della maxirata in mesi (es. 36) */
  refinanceMonths: number;
  /** TAEG del rifinanziamento della maxirata (%) */
  refinanceTaeg: number;

  /** Modalità scenario Maxirata Senza BTP: 'pay_cash' (saldo unico a scadenza) o 'refinance' (rifinanziamento a rate) */
  maxirataNoBtpMode?: 'pay_cash' | 'refinance';
  /** Modalità quota mensile BTP: 'auto' (copertura 100% maxirata) o 'custom' (scelta libera dell'utente) */
  btpContributionMode?: 'auto' | 'custom';
  /** Quota mensile scelta dall'utente da investire nel Salvadanaio BTP (€/mese) */
  btpCustomMonthlyAmount?: number;
}

export interface CashOptionResult {
  upfrontPayment: number;
  tradeInValue: number;
  totalOutOfPocket: number;
  forgoneDiscount: number;
  /** Interessi netti BTP persi per aver immobilizzato subito il capitale */
  opportunityCostBtp: number;
  /** Costo reale netto = totalOutOfPocket */
  realNetCost: number;
}

export interface StandardLoanResult {
  carPricePromo: number;
  appliedDiscount: number;
  upfrontCash: number;
  tradeInValue: number;
  financedPrincipal: number;
  monthlyInstallmentPure: number;
  monthlyInstallmentTotal: number;
  totalInstallmentsPaid: number;
  totalInterestAndFees: number;
  totalPureInterest: number;
  totalAccessoryFees: number;
  /** Somma totale uscita di tasca (Anticipo cash + Permuta + Tutte le rate + Bollo) */
  totalOutOfPocket: number;
  /** Guadagno netto BTP generato dalla liquidità non spesa subito */
  liquidityBtpGain: number;
  /** Costo reale netto = totalOutOfPocket - liquidityBtpGain */
  realNetCost: number;
  /** TAEG effettivo calcolato */
  effectiveTaeg: number;
}

export interface BtpAccumulatorResult {
  targetMaxirata: number;
  months: number;
  grossAnnualYield: number;
  netAnnualYield: number;
  netMonthlyRate: number;
  taxRate: number;
  initialCapital: number;
  initialCapitalFutureValue: number;
  /** Quota mensile da versare A PARTE nel Salvadanaio BTP per raggiungere il 100% della Maxirata */
  monthlySavingsRequired: number;
  /** Quota mensile che servirebbe a tasso 0% (sotto il materasso) */
  monthlySavingsZeroYield: number;
  /** Risparmio mensile generato dagli interessi BTP rispetto a non investire */
  monthlySavingsBenefit: number;
  /** Totale capitale versato di tasca nel salvadanaio */
  totalPrincipalDeposited: number;
  /** Totale interessi netti maturati grazie ai BTP (Sconto effettivo sulla Maxirata) */
  totalNetInterestEarned: number;
  /** Percentuale della maxirata pagata dagli interessi BTP */
  interestCoveragePercent: number;
}

export interface MaxirataRefinanceResult {
  refinancedPrincipal: number;
  months: number;
  taeg: number;
  monthlyInstallment2ndPeriod: number;
  totalPaid2ndPeriod: number;
  extraInterest2ndPeriod: number;
  /** Esborso totale complessivo (1° periodo + 2° periodo rifinanziato) */
  totalOutOfPocketWithRefinance: number;
  /** Quanto costa in più rifinanziare rispetto ad accumulare col Salvadanaio BTP */
  extraCostVsBtpAccumulator: number;
}

export interface MaxirataLoanResult {
  carPricePromo: number;
  upfrontCash: number;
  tradeInValue: number;
  extraServicesFee: number;
  financedPrincipal: number;
  maxirataAmount: number;
  maxirataPercent: number;
  months: number;
  interimInstallmentsCount: number;
  /** Rata mensile pura finanziamento (indicata sul preventivo o calcolata via TAN/TAEG) */
  monthlyInstallmentPure: number;
  /** Rata mensile totale pagata alla concessionaria/finanziaria (Rata pura + Spese incasso rata) */
  monthlyFinancingPaymentWithFees: number;
  /** Quota mensile separata da investire A PARTE nel Salvadanaio BTP */
  monthlyBtpSavingsPure: number;
  /** Quota di interessi mensili pagata solo a causa della Maxirata non ammortizzata */
  monthlyInterestOnBalloon: number;
  /** Rata mensile totale pagata alla finanziaria */
  monthlyInstallmentTotal: number;
  /** Impegno mensile complessivo dal conto = Rata Finanziaria + Quota BTP a parte */
  realMonthlyCommitmentWithBtp: number;
  totalInterestAndFees1stPeriod: number;
  totalPureInterest1stPeriod: number;
  totalAccessoryFees1stPeriod: number;
  /** Esborso totale nominale senza BTP */
  nominalTotalWithoutBtp: number;
  /** Esborso vivo di tasca usando il Salvadanaio BTP */
  totalOutOfPocketWithBtp: number;
  /** Importo mensile effettivamente investito nei BTP (€/mese) */
  effectiveMonthlyBtpSavings: number;
  /** Valore totale accumulato a scadenza con i BTP (Capitale + Interessi netti) */
  accumulatedBtpAtMaturity: number;
  /** Gap residuo da saldare se il fondo BTP non copre l'intera Maxirata (€) */
  gapAmount: number;
  /** Eventuale surplus accumulato se il fondo BTP supera la Maxirata (€) */
  surplusAmount: number;
  /** Rata mensile del rifinanziamento del gap residuo (€/mese) */
  gapRefinancedMonthly: number;
  /** Totale pagato per rifinanziare il gap residuo (Capitale + Interessi 2° periodo) */
  gapRefinancedTotalPaid: number;
  /** Interessi extra pagati per rifinanziare il gap residuo */
  gapRefinancedExtraInterest: number;
  /** Ulteriore rendimento BTP sulla liquidità residua non impegnata */
  liquidityBtpGain: number;
  /** Costo reale netto finale che include l'eventuale rifinanziamento del gap residuo */
  realNetCost: number;
  btpAccumulator: BtpAccumulatorResult;
  refinanceScenario: MaxirataRefinanceResult;
}

export interface MaxirataNoBtpResult {
  mode: 'pay_cash' | 'refinance';
  carPricePromo: number;
  upfrontCash: number;
  tradeInValue: number;
  extraServicesFee: number;
  financedPrincipal: number;
  maxirataAmount: number;
  maxirataPercent: number;
  months: number;
  interimInstallmentsCount: number;
  monthlyInstallmentPure: number;
  monthlyFinancingPaymentWithFees: number;
  totalPaid1stPeriod: number;
  monthlyInstallment2ndPeriod: number;
  totalPaid2ndPeriod: number;
  extraInterest2ndPeriod: number;
  totalOutOfPocket: number;
  totalInterestAndFees: number;
  liquidityBtpGain: number;
  realNetCost: number;
}

export interface MonthlyTimelinePoint {
  month: number;
  /** Esborso cumulativo Contanti */
  cashCumulativeOut: number;
  /** Esborso cumulativo Finanziamento Standard */
  standardCumulativeOut: number;
  /** Esborso cumulativo Maxirata + Versamenti BTP */
  maxirataWithBtpCumulativeOut: number;
  /** Esborso cumulativo Maxirata con Rifinanziamento */
  maxirataRefinancedCumulativeOut: number;
  /** Valore accumulato nel Salvadanaio BTP al mese corrente (Capitale + Interessi) */
  btpFundBalance: number;
  /** Solo capitale versato nel Salvadanaio BTP al mese corrente */
  btpPrincipalCumulative: number;
  /** Debito residuo Finanziamento Standard */
  standardRemainingDebt: number;
  /** Debito residuo Finanziamento Maxirata */
  maxirataRemainingDebt: number;
  /** Dettaglio rata standard del mese */
  standardInterestMonth: number;
  standardPrincipalMonth: number;
  /** Dettaglio rata maxirata del mese */
  maxirataInterestMonth: number;
  maxirataPrincipalMonth: number;
  btpInterestEarnedMonth: number;
}

export type WinnerOptionId = 'cash' | 'standard' | 'maxirata_no_btp' | 'maxirata';

export interface ComparisonVerdict {
  winner: WinnerOptionId;
  winnerLabel: string;
  runnerUp: WinnerOptionId;
  runnerUpLabel: string;
  /** Risparmio rispetto alla seconda migliore opzione (€) */
  savingsVsRunnerUp: number;
  /** Risparmio rispetto all'opzione peggiore (€) */
  savingsVsWorst: number;
  /** TAEG massimo di pareggio per cui il finanziamento pareggia l'acquisto in contanti (%) */
  breakEvenTaeg: number;
  /** Spiegazione chiara in italiano del perché vince questa opzione */
  explanation: string;
  /** Classifica completa ordinata dal più conveniente al meno conveniente */
  candidates: Array<{ id: WinnerOptionId; label: string; cost: number }>;
}

export interface FullCalculationOutput {
  inputs: CalculatorInputs;
  horizonMonths: number;
  netAnnualBtpYield: number;
  cash: CashOptionResult;
  standard: StandardLoanResult;
  maxirataNoBtp: MaxirataNoBtpResult;
  maxirata: MaxirataLoanResult;
  verdict: ComparisonVerdict;
  timeline: MonthlyTimelinePoint[];
}

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  inputs: CalculatorInputs;
}
