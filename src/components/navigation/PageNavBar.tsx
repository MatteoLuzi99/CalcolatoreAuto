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

interface PageNavBarProps {
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
  calc: FullCalculationOutput;
}

const PAGES: {
  id: ActivePage;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'comparison',
    title: '1. Confronto Preventivo & Opzioni Auto',
    shortTitle: '1. Preventivo Auto',
    subtitle: 'Contanti vs Standard vs Maxirata',
    icon: Car,
  },
  {
    id: 'simulator',
    title: '2. Simulatore Budget & Gap Maxirata',
    shortTitle: '2. Simulatore Budget & Gap',
    subtitle: 'Scegli quanto investire al mese',
    icon: Calculator,
  },
  {
    id: 'instruments',
    title: '3. Strumenti Finanziari & Rendimenti 3Y',
    shortTitle: '3. Strumenti & Rendimenti',
    subtitle: 'BTP, ETF Monetari, Azioni 3Y',
    icon: TrendingUp,
  },
  {
    id: 'amortization',
    title: '4. Grafici & Piano di Ammortamento',
    shortTitle: '4. Grafici & Tabella Mese',
    subtitle: 'Evoluzione nel tempo e CSV',
    icon: BarChart3,
  },
  {
    id: 'tutorial',
    title: '5. Guida & Tutorial',
    shortTitle: '5. Tutorial',
    subtitle: 'Come funziona e strategie',
    icon: BookOpen,
  },
];

export const PageNavBar: React.FC<PageNavBarProps> = ({
  activePage,
  onChangePage,
  calc,
}) => {
  const { inputs, maxirata } = calc;

  return (
    <div className="space-y-3">
      {/* Tab Navigation Pill Bar */}
      <nav
        aria-label="Navigazione Pagine dell'Applicazione"
        className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-xs flex flex-wrap gap-1.5"
      >
        {PAGES.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onChangePage(page.id)}
              className={`flex-1 min-w-[150px] sm:min-w-[180px] px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
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
                  className={`text-[11px] truncate ${
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
      <div className="bg-slate-100/90 border border-slate-200/70 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium">
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

