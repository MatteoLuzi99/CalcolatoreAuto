import type { TaxRegime } from '../types/calculator';

export interface FinancialInstrument {
  id: string;
  name: string;
  tickerOrExample: string;
  category: 'gov_bond' | 'deposit' | 'money_market' | 'bond_etf' | 'equity_etf' | 'single_stock' | 'custom';
  categoryLabel: string;
  avgGrossYield3Y: number; // % lordo annuo medio a 3 anni
  taxRegime: TaxRegime;
  taxRatePercent: number;  // % aliquota
  netAnnualYield: number;  // % netto annuo calcolato
  riskLevel: 'molto_basso' | 'basso' | 'medio' | 'medio_alto' | 'alto';
  riskLabel: string;
  riskColor: string; // Tailwind color class
  volatility3Y: string;
  suitabilityForBalloon: 'ideale' | 'buono' | 'cautela' | 'sconsigliato';
  suitabilityLabel: string;
  suitabilityBadgeColor: string;
  description: string;
  advisoryNote: string;
}

export const FINANCIAL_INSTRUMENTS: FinancialInstrument[] = [
  {
    id: 'btp_3y',
    name: 'BTP 3 Anni (Titolo di Stato Italiano)',
    tickerOrExample: 'es. BTP Scadenza 2027-2028',
    category: 'gov_bond',
    categoryLabel: 'Titoli di Stato',
    avgGrossYield3Y: 3.40,
    taxRegime: 'btp_12_5',
    taxRatePercent: 12.5,
    netAnnualYield: 3.40 * (1 - 0.125), // 2.975%
    riskLevel: 'molto_basso',
    riskLabel: 'Molto Basso (Garantito da Stato IT)',
    riskColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    volatility3Y: 'Nulla se portato a scadenza (Rimborso 100/100)',
    suitabilityForBalloon: 'ideale',
    suitabilityLabel: 'Ideale per la Maxirata',
    suitabilityBadgeColor: 'bg-emerald-600 text-white',
    description: 'Obbligazione a tasso fisso emessa dal Ministero dell\'Economia con cedole semestrali certe.',
    advisoryNote: 'Strumento perfetto per il rimborso della Maxirata: acquistando l\'emissione con scadenza coincidente con il mese del riscatto auto, il rimborso del 100% del capitale è certo e non risente delle oscillazioni di mercato.',
  },
  {
    id: 'conto_deposito',
    name: 'Conto Deposito Vincolato a 36 Mesi',
    tickerOrExample: 'es. Illimity, CA Auto Bank, Cherry Bank',
    category: 'deposit',
    categoryLabel: 'Conto Deposito',
    avgGrossYield3Y: 3.20,
    taxRegime: 'deposito_26',
    taxRatePercent: 26.0,
    netAnnualYield: 3.20 * (1 - 0.26), // 2.368%
    riskLevel: 'molto_basso',
    riskLabel: 'Bassissimo (Garantito FITD fino a 100k€)',
    riskColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    volatility3Y: 'Zero assoluto (Valore monetario fisso)',
    suitabilityForBalloon: 'ideale',
    suitabilityLabel: 'Ideale e Zero Pensieri',
    suitabilityBadgeColor: 'bg-emerald-600 text-white',
    description: 'Deposito bancario a tasso prefissato e garantito per tutta la durata dei 36 mesi.',
    advisoryNote: 'Ideale per chi non vuole aprire un conto titoli. Zero oscillazioni sul capitale versato e massima serenità mentale, a fronte di una tassazione ordinaria al 26%.',
  },
  {
    id: 'etf_monetario_xeon',
    name: 'ETF Monetario Euro Overnight (€STR)',
    tickerOrExample: 'es. Xtrackers II EUR Overnight (XEON / SMART)',
    category: 'money_market',
    categoryLabel: 'ETF Monetario',
    avgGrossYield3Y: 3.45,
    taxRegime: 'btp_12_5', // Molti replicano con basket governativo (white list ~15-18%), qui usiamo 15% o btp
    taxRatePercent: 15.0,
    netAnnualYield: 3.45 * (1 - 0.15), // 2.93%
    riskLevel: 'molto_basso',
    riskLabel: 'Molto Basso (Tasso interbancario BCE)',
    riskColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    volatility3Y: 'Minima (< 0.2%), rendimento composto giornaliero',
    suitabilityForBalloon: 'buono',
    suitabilityLabel: 'Ottimo e Super Liquido',
    suitabilityBadgeColor: 'bg-teal-600 text-white',
    description: 'ETF a bassissimo costo che replica il tasso interbancario overnight €STR fissato dalla BCE.',
    advisoryNote: 'Permette di impostare un PAC mensile flessibile. I soldi non sono vincolati e maturano interessi giorno per giorno. Il rendimento segue le decisioni sui tassi della BCE.',
  },
  {
    id: 'etf_obbligazionario_gov',
    name: 'PAC ETF Obbligazionario Governativo 1-3 Anni',
    tickerOrExample: 'es. iShares € Govt Bond 1-3yr (IBGS)',
    category: 'bond_etf',
    categoryLabel: 'ETF Obbligazionario',
    avgGrossYield3Y: 3.30,
    taxRegime: 'btp_12_5',
    taxRatePercent: 12.5,
    netAnnualYield: 3.30 * (1 - 0.125), // 2.8875%
    riskLevel: 'basso',
    riskLabel: 'Basso (Diversificato Gov Eurozone)',
    riskColor: 'text-blue-700 bg-blue-50 border-blue-200',
    volatility3Y: 'Contenuta (duration ~1.8 anni)',
    suitabilityForBalloon: 'buono',
    suitabilityLabel: 'Buono e Diversificato',
    suitabilityBadgeColor: 'bg-blue-600 text-white',
    description: 'Paniere diversificato di titoli di stato dei principali paesi dell\'Eurozona con scadenza breve.',
    advisoryNote: 'Ottimo per chi desidera diversificare il rischio paese al di fuori dell\'Italia (Germania, Francia, Spagna, ecc.) mantenendo la tassazione agevolata al 12,5%.',
  },
  {
    id: 'pac_etf_azionario_mondo',
    name: 'PAC ETF Azionario Globale (MSCI World)',
    tickerOrExample: 'es. iShares Core MSCI World (SWDA) / Vanguard All-World (VWCE)',
    category: 'equity_etf',
    categoryLabel: 'PAC Azionario Globale',
    avgGrossYield3Y: 8.50,
    taxRegime: 'deposito_26',
    taxRatePercent: 26.0,
    netAnnualYield: 8.50 * (1 - 0.26), // 6.29%
    riskLevel: 'medio_alto',
    riskLabel: 'Medio-Alto (Volatilità azionaria)',
    riskColor: 'text-amber-700 bg-amber-50 border-amber-200',
    volatility3Y: 'Elevata (oscillazioni storiche annuali del +/- 15-20%)',
    suitabilityForBalloon: 'cautela',
    suitabilityLabel: 'Cautela (Orizzonte Breve)',
    suitabilityBadgeColor: 'bg-amber-600 text-white',
    description: 'Investimento mensile nelle oltre 1.500 maggiori aziende dei mercati sviluppati mondiali.',
    advisoryNote: 'ATTENZIONE: Sebbene storicamente renda il 7-9% annuo, 3 anni sono un orizzonte temporale troppo breve per un\'uscita obbligatoria come la maxirata. Se proprio al 36° mese il mercato affronta una correzione, potresti trovarti in disavanzo. Usare solo se si dispone di liquidità di riserva.',
  },
  {
    id: 'pac_etf_sp500',
    name: 'PAC ETF Azionario S&P 500 (USA)',
    tickerOrExample: 'es. Vanguard S&P 500 (VUAA / CSSPX)',
    category: 'equity_etf',
    categoryLabel: 'PAC Azionario USA',
    avgGrossYield3Y: 10.20,
    taxRegime: 'deposito_26',
    taxRatePercent: 26.0,
    netAnnualYield: 10.20 * (1 - 0.26), // 7.548%
    riskLevel: 'alto',
    riskLabel: 'Alto (Azioni USA + Rischio Cambio Dollaro)',
    riskColor: 'text-rose-700 bg-rose-50 border-rose-200',
    volatility3Y: 'Molto Elevata (volatilità S&P500 + fluttuazione EUR/USD)',
    suitabilityForBalloon: 'sconsigliato',
    suitabilityLabel: 'Sconsigliato per la Maxirata',
    suitabilityBadgeColor: 'bg-rose-600 text-white',
    description: 'Le 500 maggiori aziende statunitensi (Apple, Microsoft, Nvidia, Amazon, Alphabet, ecc.).',
    advisoryNote: 'Altissimo potenziale di rendimento storico, ma doppio rischio (azionario + cambio valuta dollaro/euro). Non idoneo per coprire un debito con data di scadenza fissa e non rinviabile.',
  },
  {
    id: 'azioni_dividendo',
    name: 'Portafoglio Azioni Singole ad Alto Dividendo',
    tickerOrExample: 'es. Eni, Intesa Sanpaolo, Enel, Generali',
    category: 'single_stock',
    categoryLabel: 'Azioni Singole',
    avgGrossYield3Y: 6.80,
    taxRegime: 'deposito_26',
    taxRatePercent: 26.0,
    netAnnualYield: 6.80 * (1 - 0.26), // 5.032%
    riskLevel: 'alto',
    riskLabel: 'Alto (Rischio specifico singole società)',
    riskColor: 'text-rose-700 bg-rose-50 border-rose-200',
    volatility3Y: 'Elevata',
    suitabilityForBalloon: 'sconsigliato',
    suitabilityLabel: 'Non Adatto a Rimborso Certo',
    suitabilityBadgeColor: 'bg-rose-600 text-white',
    description: 'Azioni blue-chip italiane o europee note per la distribuzione di dividendi stabili (4-5% yield).',
    advisoryNote: 'I dividendi generano un flusso di cassa periodico, ma il valore dell\'azione alla fine dei 3 anni può fluttuare ampiamente, mettendo a repentaglio la disponibilità esatta dei soldi della maxirata.',
  },
];

/**
 * Calcola l'accumulo mensile composto e il GAP rispetto alla maxirata
 */
export function simulateMonthlyInvestment({
  monthlyInvestment,
  months,
  annualGrossYield,
  taxRatePercent,
  initialCapital = 0,
  targetBalloon,
  refinanceMonths = 36,
  refinanceTaeg = 8.5,
}: {
  monthlyInvestment: number;
  months: number;
  annualGrossYield: number;
  taxRatePercent: number;
  initialCapital?: number;
  targetBalloon: number;
  refinanceMonths?: number;
  refinanceTaeg?: number;
}) {
  const netAnnualRate = (annualGrossYield / 100) * (1 - taxRatePercent / 100);
  const netMonthlyRate = netAnnualRate > 0 ? Math.pow(1 + netAnnualRate, 1 / 12) - 1 : 0;

  // Futuro valore del capitale iniziale
  const initialCapitalFV = initialCapital * Math.pow(1 + netMonthlyRate, months);

  // Futuro valore dei versamenti mensili
  let monthlyDepositsFV = 0;
  if (netMonthlyRate > 0) {
    monthlyDepositsFV =
      monthlyInvestment * ((Math.pow(1 + netMonthlyRate, months) - 1) / netMonthlyRate);
  } else {
    monthlyDepositsFV = monthlyInvestment * months;
  }

  const totalAccumulated = initialCapitalFV + monthlyDepositsFV;
  const totalPrincipalDeposited = initialCapital + monthlyInvestment * months;
  const totalNetInterestEarned = Math.max(0, totalAccumulated - totalPrincipalDeposited);

  const gapAmount = Math.max(0, targetBalloon - totalAccumulated);
  const surplusAmount = Math.max(0, totalAccumulated - targetBalloon);
  const coveragePercent = targetBalloon > 0 ? Math.min(100, (totalAccumulated / targetBalloon) * 100) : 100;

  // Simulazione mini-rifinanziamento sul GAP residuo
  let miniRefinanceMonthly = 0;
  let miniRefinanceTotalPaid = 0;
  let miniRefinanceInterest = 0;

  // Calcolo rifinanziamento totale senza salvadanaio (base di confronto)
  let fullRefinanceMonthly = 0;
  let fullRefinanceTotalPaid = 0;
  let fullRefinanceInterest = 0;

  const monthlyRefiRate =
    refinanceTaeg > 0 ? Math.pow(1 + refinanceTaeg / 100, 1 / 12) - 1 : 0;

  if (gapAmount > 0) {
    if (monthlyRefiRate > 0) {
      miniRefinanceMonthly =
        (gapAmount * monthlyRefiRate) / (1 - Math.pow(1 + monthlyRefiRate, -refinanceMonths));
    } else {
      miniRefinanceMonthly = gapAmount / refinanceMonths;
    }
    miniRefinanceTotalPaid = miniRefinanceMonthly * refinanceMonths;
    miniRefinanceInterest = Math.max(0, miniRefinanceTotalPaid - gapAmount);
  }

  if (targetBalloon > 0) {
    if (monthlyRefiRate > 0) {
      fullRefinanceMonthly =
        (targetBalloon * monthlyRefiRate) / (1 - Math.pow(1 + monthlyRefiRate, -refinanceMonths));
    } else {
      fullRefinanceMonthly = targetBalloon / refinanceMonths;
    }
    fullRefinanceTotalPaid = fullRefinanceMonthly * refinanceMonths;
    fullRefinanceInterest = Math.max(0, fullRefinanceTotalPaid - targetBalloon);
  }

  const interestSavedVsFullRefinance = Math.max(0, fullRefinanceInterest - miniRefinanceInterest);

  return {
    monthlyInvestment,
    months,
    annualGrossYield,
    taxRatePercent,
    netAnnualYield: netAnnualRate * 100,
    totalAccumulated,
    totalPrincipalDeposited,
    totalNetInterestEarned,
    targetBalloon,
    gapAmount,
    surplusAmount,
    coveragePercent,
    // Mini-rifinanziamento
    miniRefinanceMonthly,
    miniRefinanceTotalPaid,
    miniRefinanceInterest,
    fullRefinanceMonthly,
    fullRefinanceTotalPaid,
    fullRefinanceInterest,
    interestSavedVsFullRefinance,
  };
}

export function getInstrumentShortName(idOrInstrument: string | FinancialInstrument): string {
  const id = typeof idOrInstrument === 'string' ? idOrInstrument : idOrInstrument.id;
  if (id === 'btp_3y') return 'BTP';
  if (id === 'conto_deposito') return 'Conto Deposito';
  if (id === 'etf_monetario_xeon') return 'ETF Monetario';
  if (id === 'etf_obbligazionario_gov') return 'ETF Obbligazionario';
  if (id === 'pac_etf_azionario_mondo') return 'PAC ETF Mondo';
  if (id === 'pac_etf_sp500') return 'PAC S&P 500';
  if (id === 'azioni_dividendo') return 'Azioni Dividendo';
  const found = FINANCIAL_INSTRUMENTS.find((f) => f.id === id);
  return found ? found.categoryLabel || found.name : 'BTP';
}

