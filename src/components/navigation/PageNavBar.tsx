import React from 'react';
import {
  Car,
  Calculator,
  TrendingUp,
  BarChart3,
  BookOpen,
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
    title: 'Confronto 4 Opzioni',
    shortTitle: 'Confronto',
    subtitle: 'Contanti, Standard, Maxirata, BTP',
    icon: Car,
  },
  {
    id: 'amortization',
    title: 'Ammortamento & Grafici',
    shortTitle: 'Grafici',
    subtitle: 'Timeline mensile e CSV',
    icon: BarChart3,
  },
  {
    id: 'simulator',
    title: 'Simulatore Gap Maxirata',
    shortTitle: 'Simulatore',
    subtitle: 'Budget mensile personalizzato',
    icon: Calculator,
  },
  {
    id: 'instruments',
    title: 'Titoli di Stato & Rendimenti',
    shortTitle: 'Rendimenti',
    subtitle: 'BTP, Depositi, ETF Monetari',
    icon: TrendingUp,
  },
  {
    id: 'tutorial',
    title: 'Guida Negoziazione SECCI',
    shortTitle: 'Guida',
    subtitle: 'Clausole e trucchi concessionaria',
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

  const visiblePages = isSimpleMode
    ? ALL_PAGES.filter((p) => p.id === 'comparison' || p.id === 'amortization' || p.id === 'tutorial')
    : ALL_PAGES;

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <nav
        aria-label="Sezioni di Analisi"
        className="bg-white rounded-xl border border-slate-200/90 p-1 flex overflow-x-auto sm:flex-wrap no-scrollbar gap-1"
      >
        {visiblePages.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onChangePage(page.id)}
              className={`min-w-[130px] sm:min-w-[160px] shrink-0 sm:shrink sm:flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="overflow-hidden">
                <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                  <span className="hidden md:inline">{page.title}</span>
                  <span className="md:hidden">{page.shortTitle}</span>
                </div>
                <div
                  className={`text-[11px] truncate leading-tight mt-0.5 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {page.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Persistent Vehicle Context Bar */}
      <div className="bg-slate-100 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-medium">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-semibold text-[11px]">
            Veicolo
          </span>
          <span className="font-semibold text-slate-900">
            {inputs.scenarioName || 'Preventivo Auto'}
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Listino:{' '}
            <strong className="text-slate-900 tabular-nums">
              {formatEuro(inputs.carPriceCash)}
            </strong>
          </span>
          {inputs.financingDiscount > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">
                Sconto Finanziamento: -{formatEuro(inputs.financingDiscount)}
              </span>
            </>
          )}
          <span className="text-slate-300">•</span>
          <span>
            Maxirata (VFG):{' '}
            <strong className="text-slate-900 tabular-nums">
              {formatEuro(maxirata.maxirataAmount)}
            </strong>
          </span>
        </div>

        <div className="text-slate-500 text-[11px] font-medium shrink-0">
          Orizzonte: <strong className="text-slate-800">{inputs.maxirataMonths} Mesi</strong>
        </div>
      </div>
    </div>
  );
};
