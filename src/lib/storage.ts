import { CalculatorInputs, MonthlyTimelinePoint, SavedScenario } from '../types/calculator';
import { DEFAULT_INPUTS } from './financialEngine';

const STORAGE_KEY = 'calcolatore_auto_btp_scenarios_v1';

export interface PresetOption {
  id: string;
  label: string;
  badge: string;
  inputs: CalculatorInputs;
}

export const PRESET_SCENARIOS: PresetOption[] = [
  {
    id: 'skoda_real',
    label: 'Škoda Fabia (Preventivo Reale)',
    badge: '35x99€ • VFG 14.065€',
    inputs: {
      ...DEFAULT_INPUTS,
      scenarioName: 'Škoda Fabia 1.0 TSI (Clever Value)',
      carPriceCash: 23350,
      financingDiscount: 2956.3, // Prezzo Listino 23.350 - Prezzo Promo 20.393,70
      tradeInValue: 0,
      downPaymentCash: 3243.32,
      extraServicesFee: 280, // Extended Warranty 280 €
      originationFee: 380,
      monthlyCollectionFee: 3.4,
      stampDuty: 43.82,
      mandatoryInsuranceMonthly: 0,
      standardTaeg: 7.45,
      standardMonths: 60,
      maxirataTan: 0.0,
      maxirataTaeg: 1.19,
      maxirataMonths: 36,
      maxirataInterimCount: 35,
      maxirataCustomMonthlyInstallment: 99.0,
      maxirataFixedAmount: 14065.33,
      maxirataPercent: Number(((14065.33 / 23350) * 100).toFixed(2)),
      btpGrossYield: 3.5,
      taxRegime: 'btp_12_5',
    },
  },
  {
    id: 'citycar',
    label: 'Citycar / Utilitaria',
    badge: '18.500 €',
    inputs: {
      ...DEFAULT_INPUTS,
      scenarioName: 'Utilitaria Ibrida 18.500 €',
      carPriceCash: 18500,
      financingDiscount: 1200,
      tradeInValue: 1500,
      downPaymentCash: 2500,
      extraServicesFee: 0,
      standardTaeg: 7.95,
      standardMonths: 60,
      maxirataTan: 6.5,
      maxirataTaeg: 8.2,
      maxirataMonths: 36,
      maxirataInterimCount: 36,
      maxirataCustomMonthlyInstallment: 0,
      maxirataFixedAmount: 0,
      maxirataPercent: 48,
      btpGrossYield: 3.4,
    },
  },
  {
    id: 'crossover',
    label: 'Crossover Segmento C',
    badge: '28.000 €',
    inputs: {
      ...DEFAULT_INPUTS,
      scenarioName: 'Crossover Segmento C 28.000 €',
      carPriceCash: 28000,
      financingDiscount: 1500,
      tradeInValue: 2500,
      downPaymentCash: 4000,
      extraServicesFee: 0,
      standardTaeg: 7.45,
      standardMonths: 60,
      maxirataTan: 6.9,
      maxirataTaeg: 7.9,
      maxirataMonths: 36,
      maxirataInterimCount: 36,
      maxirataCustomMonthlyInstallment: 0,
      maxirataFixedAmount: 12600,
      maxirataPercent: 45,
      btpGrossYield: 3.5,
    },
  },
  {
    id: 'suv_ev',
    label: 'SUV / Elettrica Premium',
    badge: '42.000 €',
    inputs: {
      ...DEFAULT_INPUTS,
      scenarioName: 'SUV / EV 42.000 €',
      carPriceCash: 42000,
      financingDiscount: 2500,
      tradeInValue: 5000,
      downPaymentCash: 6000,
      extraServicesFee: 0,
      standardTaeg: 6.45,
      standardMonths: 60,
      maxirataTan: 5.9,
      maxirataTaeg: 6.9,
      maxirataMonths: 36,
      maxirataInterimCount: 36,
      maxirataCustomMonthlyInstallment: 0,
      maxirataFixedAmount: 21000,
      maxirataPercent: 50,
      btpGrossYield: 3.6,
    },
  },
  {
    id: 'promo_zero',
    label: 'Promo Tasso Basso (TAEG 2,95%)',
    badge: 'TAEG 2,95%',
    inputs: {
      ...DEFAULT_INPUTS,
      scenarioName: 'Promo Tasso Basso 2,95%',
      carPriceCash: 30000,
      financingDiscount: 1500,
      tradeInValue: 3000,
      downPaymentCash: 4000,
      extraServicesFee: 0,
      standardTaeg: 3.45,
      standardMonths: 48,
      maxirataTan: 1.99,
      maxirataTaeg: 2.95,
      maxirataMonths: 36,
      maxirataInterimCount: 35,
      maxirataCustomMonthlyInstallment: 0,
      maxirataFixedAmount: 13500,
      maxirataPercent: 45,
      btpGrossYield: 3.7,
    },
  },
];

export function loadSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScenarioToStorage(inputs: CalculatorInputs): SavedScenario[] {
  const existing = loadSavedScenarios();
  const newScenario: SavedScenario = {
    id: 'sc_' + Date.now(),
    name: inputs.scenarioName?.trim() || `Preventivo ${inputs.carPriceCash.toLocaleString('it-IT')} €`,
    createdAt: new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    inputs: { ...inputs },
  };
  const updated = [newScenario, ...existing].slice(0, 15);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }
  return updated;
}

export function deleteScenarioFromStorage(id: string): SavedScenario[] {
  const updated = loadSavedScenarios().filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function clearAllSavedScenarios(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export const getSavedScenarios = loadSavedScenarios;

export function encodeInputsToUrl(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  params.set('name', inputs.scenarioName);
  params.set('p', String(inputs.carPriceCash));
  params.set('disc', String(inputs.financingDiscount));
  params.set('tr', String(inputs.tradeInValue));
  params.set('dp', String(inputs.downPaymentCash));
  params.set('srv', String(inputs.extraServicesFee || 0));
  params.set('stT', String(inputs.standardTaeg));
  params.set('stM', String(inputs.standardMonths));
  params.set('mxT', String(inputs.maxirataTaeg));
  params.set('mxTan', String(inputs.maxirataTan || 0));
  params.set('mxM', String(inputs.maxirataMonths));
  params.set('mxI', String(inputs.maxirataInterimCount || 0));
  params.set('mxR', String(inputs.maxirataCustomMonthlyInstallment || 0));
  params.set('mxFix', String(inputs.maxirataFixedAmount || 0));
  params.set('mxP', String(inputs.maxirataPercent));
  params.set('btp', String(inputs.btpGrossYield));
  params.set('tax', inputs.taxRegime);
  params.set('btp0', String(inputs.btpInitialCapital));
  params.set('opp', inputs.includeOpportunityCost ? '1' : '0');
  params.set('feeI', String(inputs.originationFee));
  params.set('feeR', String(inputs.monthlyCollectionFee));
  params.set('stamp', String(inputs.stampDuty));
  params.set('ins', String(inputs.mandatoryInsuranceMonthly));
  const url = new URL(window.location.href);
  url.search = params.toString();
  return url.toString();
}

/** Helper per validare e clampare numerici provenienti da URL non fidati */
function parseClampedNumber(
  params: URLSearchParams,
  key: string,
  fallback: number,
  min: number,
  max: number,
  decimals = 2
): number {
  const val = params.get(key);
  if (val === null || val === undefined || val.trim() === '') return fallback;
  const parsed = Number(val);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallback;
  const clamped = Math.min(max, Math.max(min, parsed));
  return Number(clamped.toFixed(decimals));
}

/** Sanifica stringhe utente da URL: limita la lunghezza ed elimina caratteri di controllo */
function sanitizeScenarioName(raw: string | null): string {
  if (!raw) return DEFAULT_INPUTS.scenarioName;
  const cleaned = raw
    .replace(/[\x00-\x1F\x7F]/g, '') // rimuove caratteri di controllo ASCII
    .trim()
    .slice(0, 80); // max 80 caratteri
  return cleaned || DEFAULT_INPUTS.scenarioName;
}

/** Sanifica le celle CSV per proteggere da Formula / DDE Injection (Excel/Calc) */
export function sanitizeCsvCell(value: string | number): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  }
  const str = String(value ?? '');
  // Se la stringa inizia con caratteri pericolosi per fogli di calcolo (=, +, -, @, \t, \r)
  const isFormulaTrigger = /^[=+\-@\t\r]/.test(str);
  let safeStr = str.replace(/"/g, '""'); // escape delle virgolette doppie
  if (isFormulaTrigger) {
    safeStr = "'" + safeStr; // prepend apostrofo per forzare testo letterale
  }
  // Racchiude tra doppi apici se contiene separatori o a capo
  if (/[;"'\n\r]/.test(safeStr) || isFormulaTrigger) {
    return `"${safeStr}"`;
  }
  return safeStr;
}

export function parseInputsFromUrl(): CalculatorInputs | null {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('p')) return null;

    const tax = params.get('tax');
    const validTax =
      tax === 'btp_12_5' || tax === 'deposito_26' || tax === 'net_0'
        ? tax
        : DEFAULT_INPUTS.taxRegime;

    return {
      ...DEFAULT_INPUTS,
      scenarioName: sanitizeScenarioName(params.get('name')),
      // Prezzo auto compreso tra 500 € e 1.000.000 €
      carPriceCash: parseClampedNumber(params, 'p', DEFAULT_INPUTS.carPriceCash, 500, 1_000_000),
      financingDiscount: parseClampedNumber(params, 'disc', DEFAULT_INPUTS.financingDiscount, 0, 500_000),
      tradeInValue: parseClampedNumber(params, 'tr', DEFAULT_INPUTS.tradeInValue, 0, 500_000),
      downPaymentCash: parseClampedNumber(params, 'dp', DEFAULT_INPUTS.downPaymentCash, 0, 500_000),
      extraServicesFee: parseClampedNumber(params, 'srv', DEFAULT_INPUTS.extraServicesFee, 0, 50_000),

      // Finanziamento Standard: TAEG [0%, 50%], Mesi [6, 120] (limite anti-DoS per il loop temporale)
      standardTaeg: parseClampedNumber(params, 'stT', DEFAULT_INPUTS.standardTaeg, 0, 50),
      standardMonths: Math.round(parseClampedNumber(params, 'stM', DEFAULT_INPUTS.standardMonths, 6, 120)),

      // Maxirata: Durata [12, 84], TAN/TAEG [0, 50], Percentuale [0, 100]
      maxirataTaeg: parseClampedNumber(params, 'mxT', DEFAULT_INPUTS.maxirataTaeg, 0, 50),
      maxirataTan: parseClampedNumber(params, 'mxTan', DEFAULT_INPUTS.maxirataTan, 0, 50),
      maxirataMonths: Math.round(parseClampedNumber(params, 'mxM', DEFAULT_INPUTS.maxirataMonths, 12, 84)),
      maxirataInterimCount: Math.round(parseClampedNumber(params, 'mxI', DEFAULT_INPUTS.maxirataInterimCount, 0, 84)),
      maxirataCustomMonthlyInstallment: parseClampedNumber(params, 'mxR', DEFAULT_INPUTS.maxirataCustomMonthlyInstallment, 0, 50_000),
      maxirataFixedAmount: parseClampedNumber(params, 'mxFix', DEFAULT_INPUTS.maxirataFixedAmount, 0, 1_000_000),
      maxirataPercent: parseClampedNumber(params, 'mxP', DEFAULT_INPUTS.maxirataPercent, 0, 100),

      // Rendimento BTP e Salvadanaio
      btpGrossYield: parseClampedNumber(params, 'btp', DEFAULT_INPUTS.btpGrossYield, 0, 50),
      taxRegime: validTax,
      btpInitialCapital: parseClampedNumber(params, 'btp0', DEFAULT_INPUTS.btpInitialCapital, 0, 1_000_000),
      includeOpportunityCost: params.get('opp') !== '0',

      // Spese accessorie
      originationFee: parseClampedNumber(params, 'feeI', DEFAULT_INPUTS.originationFee, 0, 5_000),
      monthlyCollectionFee: parseClampedNumber(params, 'feeR', DEFAULT_INPUTS.monthlyCollectionFee, 0, 100),
      stampDuty: parseClampedNumber(params, 'stamp', DEFAULT_INPUTS.stampDuty, 0, 500),
      mandatoryInsuranceMonthly: parseClampedNumber(params, 'ins', DEFAULT_INPUTS.mandatoryInsuranceMonthly, 0, 1_000),
    };
  } catch {
    return null;
  }
}

export function exportTimelineToCsv(timeline: MonthlyTimelinePoint[], scenarioName: string): void {
  const headers = [
    'Mese',
    'Esborso Cumulativo Contanti (EUR)',
    'Esborso Cumulativo Standard (EUR)',
    'Debito Residuo Standard (EUR)',
    'Esborso Cumulativo Maxirata+BTP (EUR)',
    'Saldo Salvadanaio BTP (EUR)',
    'Capitale Versato BTP (EUR)',
    'Debito Residuo Maxirata (EUR)',
  ];

  // Intestazione protetta con scenarioName sanificato
  const safeTitle = sanitizeCsvCell(`Scenario: ${scenarioName || 'Preventivo Auto'}`);
  const metaHeader = `${safeTitle};;;;;;;`;

  const rows = timeline.map((pt) =>
    [
      pt.month,
      sanitizeCsvCell(pt.cashCumulativeOut),
      sanitizeCsvCell(pt.standardCumulativeOut),
      sanitizeCsvCell(pt.standardRemainingDebt),
      sanitizeCsvCell(pt.maxirataWithBtpCumulativeOut),
      sanitizeCsvCell(pt.btpFundBalance),
      sanitizeCsvCell(pt.btpPrincipalCumulative),
      sanitizeCsvCell(pt.maxirataRemainingDebt),
    ].join(';')
  );

  const csvContent = '\uFEFF' + [metaHeader, headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (scenarioName || 'preventivo-auto').replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
  link.download = `piano_ammortamento_btp_${safeName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatEuro(value: number, decimals = 0): string {
  return (
    value.toLocaleString('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + ' €'
  );
}

export function formatPercent(value: number, decimals = 2): string {
  return (
    value.toLocaleString('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + '%'
  );
}
