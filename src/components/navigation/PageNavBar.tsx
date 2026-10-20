import React from 'react';
import {
  Car,
  Calculator,
  TrendingUp,
  BarChart3,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { formatEuro } from '../../lib/storage';
import { FullCalculationOutput } from '../../types/calculator';

export type ActivePage = 'comparison' | 'simulator' | 'instruments' | 'amortization' | 'tutorial';

export interface PageNavBarProps {
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
  calc: FullCalculationOutput;
  isSimpleMode?: boolean;
}

const ALL_PAGES: {
  id: ActivePage;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'comparison',
    title: '1. Calcolatore & Confronto Preventivo',
    shortTitle: '1. Calcolatore',
    subtitle: 'Contanti vs Finanziamento vs Maxirata',
    icon: Car,
  },
  {
    id: 'simulator',
    title: '2. Simulatore Budget & Gap Maxirata',
    shortTitle: '2. Simulatore Gap',
    subtitle: 'Scegli quanto investire al mese',
    icon: Calculator,
  },
  {
    id: 'instruments',
    title: '3. Strumenti Finanziari & Rendimenti',
    shortTitle: '3. Titoli & Rendimenti',
    subtitle: 'BTP, ETF Monetari, Azioni 3Y',
    icon: TrendingUp,
  },
  {
    id: 'amortization',
    title: '2. Tabella Mese per Mese & Grafici',
    shortTitle: '2. Ammortamento & Grafici',
    subtitle: 'Evoluzione nel tempo e CSV',
    icon: BarChart3,
  },
  {
    id: 'tutorial',
    title: '3. Guida & Trucchi',
    shortTitle: '3. Guida',
    subtitle: 'Come evitare le trappole dei concessionari',
    icon: BookOpen,
  },
];

export const PageNavBar: React.FC<PageNavBarProps> = ({
  activePage,
  onChangePage,
  calc,
  isSimpleMode = true,
}) => {
  const { inputs, maxirata } = calc;

  // In modalità semplice mostriamo solo le 3 sezioni chiave senza dispersioni
  const visiblePages = isSimpleMode
    ? ALL_PAGES.filter((p) => p.id === 'comparison' || p.id === 'amortization' || p.id === 'tutorial')
    : ALL_PAGES;

  return (
    <div className="space-y-3">
      {/* Tab Navigation Pill Bar */}
      <nav
        aria-label="Navigazione Pagine dell'Applicazione"
        className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-xs flex overflow-x-auto sm:flex-wrap no-scrollbar gap-1.5"
      >
        {visiblePages.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onChangePage(page.id)}
              className={`min-w-[135px] sm:min-w-[170px] shrink-0 sm:shrink sm:flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs sm:text-sm font-bold truncate">
                  <span className="hidden md:inline">{page.title}</span>
                  <span className="md:hidden">{page.shortTitle}</span>
                </div>
                <div
                  className={`text-[10px] sm:text-[11px] truncate ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {page.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Persistent Mini Vehicle Badge Bar (visible on all pages so user keeps context) */}
      <div className="bg-slate-100/90 border border-slate-200/70 rounded-xl px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
            AUTO
          </span>
          <span className="font-bold text-slate-800">
            {inputs.scenarioName || 'Preventivo Auto'}
          </span>
          <span className="text-slate-400">•</span>
          <span>
            Listino:{' '}
            <strong className="text-slate-800 tabular-nums">
              {formatEuro(inputs.carPriceCash)}
            </strong>
          </span>
          {inputs.financingDiscount > 0 && (
            <>
              <span className="text-slate-400">•</span>
              <span>
                Promo:{' '}
                <strong className="text-blue-700 tabular-nums">
                  {formatEuro(inputs.carPriceCash - inputs.financingDiscount)}
                </strong>
              </span>
            </>
          )}
          <span className="text-slate-400">•</span>
          <span>
            Maxirata:{' '}
            <strong className="text-amber-700 tabular-nums">
              {formatEuro(maxirata.maxirataAmount)}
            </strong>{' '}
            a {inputs.maxirataMonths} mesi
          </span>
        </div>

        {activePage !== 'comparison' && (
          <button
            type="button"
            onClick={() => onChangePage('comparison')}
            className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Modifica parametri preventivo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

