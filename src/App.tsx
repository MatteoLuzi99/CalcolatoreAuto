import { useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CalculatorInputs } from './types/calculator';
import { calculateAllOptions, DEFAULT_INPUTS } from './lib/financialEngine';
import { parseInputsFromUrl } from './lib/storage';
import { Header } from './components/Header';
import { PageNavBar, ActivePage } from './components/navigation/PageNavBar';
import { TopVehicleBar } from './components/controls/TopVehicleBar';
import { VerdictBanner } from './components/results/VerdictBanner';
import { InteractiveComparisonCards } from './components/results/InteractiveComparisonCards';
import { BtpMaxirataPlanner } from './components/results/BtpMaxirataPlanner';
import { BudgetGapSimulator } from './components/simulator/BudgetGapSimulator';
import { InstrumentsCatalog } from './components/instruments/InstrumentsCatalog';
import { DeepDiveTabs } from './components/charts/DeepDiveTabs';
import { TutorialGuide } from './components/tutorial/TutorialGuide';
import { LegalFooter } from './components/legal/LegalFooter';
import { PdfReportModal } from './components/pdf/PdfReportModal';

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const fromUrl = parseInputsFromUrl();
    return fromUrl || DEFAULT_INPUTS;
  });

  const [activePage, setActivePage] = useState<ActivePage>('comparison');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const calc = useMemo(() => calculateAllOptions(inputs), [inputs]);

  const handleUpdateInputs = (patch: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleLoadInputs = (full: CalculatorInputs) => {
    setInputs({ ...full });
  };

  const handleReset = () => {
    setInputs({ ...DEFAULT_INPUTS });
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleToggleOpportunityCost = () => {
    setInputs((prev) => ({
      ...prev,
      includeOpportunityCost: !prev.includeOpportunityCost,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white">
      <div className="max-w-7xl mx-auto space-y-6 print:m-0 print:p-0 print:max-w-none">
        <div className="print:hidden space-y-6">
          <Header
            inputs={inputs}
            onUpdateInputs={handleUpdateInputs}
            onLoadInputs={handleLoadInputs}
            onReset={handleReset}
            onOpenTutorial={() => setActivePage('tutorial')}
            onDownloadPdf={() => setIsPdfModalOpen(true)}
          />

          {/* Multi-Page Navigation Bar */}
          <PageNavBar
            activePage={activePage}
            onChangePage={setActivePage}
            calc={calc}
          />

          <main className="space-y-6">
            {/* PAGINA 1: CONFRONTO PREVENTIVO & AUTO */}
            {activePage === 'comparison' && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. Barra Orizzontale Parametri Auto, Sconto, Anticipo e Tasso BTP */}
                <TopVehicleBar
                  inputs={inputs}
                  onUpdateInputs={handleUpdateInputs}
                  netAnnualBtpYield={calc.netAnnualBtpYield}
                />

                {/* 2. Banner Verdetto Immediato */}
                <VerdictBanner
                  calc={calc}
                  onToggleOpportunityCost={handleToggleOpportunityCost}
                />

                {/* 3. Le 4 Grandi Card Interattive a Confronto */}
                <InteractiveComparisonCards
                  calc={calc}
                  onUpdateInputs={handleUpdateInputs}
                />

                {/* 4. Pianificatore Salvadanaio BTP per la Maxirata vs Rifinanziamento */}
                <BtpMaxirataPlanner
                  calc={calc}
                  onUpdateInputs={handleUpdateInputs}
                />
              </div>
            )}

            {/* PAGINA 2: SIMULATORE BUDGET & GAP MAXIRATA */}
            {activePage === 'simulator' && (
              <div className="animate-fade-in">
                <BudgetGapSimulator
                  calc={calc}
                  onUpdateInputs={handleUpdateInputs}
                />
              </div>
            )}

            {/* PAGINA 3: STRUMENTI FINANZIARI & RENDIMENTI REALI 3Y */}
            {activePage === 'instruments' && (
              <div className="animate-fade-in">
                <InstrumentsCatalog
                  calc={calc}
                  onUpdateInputs={handleUpdateInputs}
                  onNavigateToSimulator={() => setActivePage('simulator')}
                />
              </div>
            )}

            {/* PAGINA 4: GRAFICI INTERATTIVI & PIANO DI AMMORTAMENTO */}
            {activePage === 'amortization' && (
              <div className="animate-fade-in">
                <DeepDiveTabs calc={calc} />
              </div>
            )}

            {/* PAGINA 5: GUIDA & TUTORIAL PASSO-PASSO */}
            {activePage === 'tutorial' && (
              <div className="animate-fade-in">
                <TutorialGuide
                  onGoToPage={setActivePage}
                  carPriceCash={inputs.carPriceCash}
                  maxirataAmount={calc.maxirata.maxirataAmount}
                />
              </div>
            )}
          </main>

          {/* Legal & Educational Footer */}
          <LegalFooter />
        </div>

        {/* Modal Generazione e Stampa Report PDF */}
        <PdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          calc={calc}
        />
      </div>
      <Analytics />
    </div>
  );
}
