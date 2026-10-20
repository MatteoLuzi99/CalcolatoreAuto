import React, { useState } from 'react';
import {
  BookOpen,
  Car,
  Calculator,
  TrendingUp,
  ShieldAlert,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Coins,
  Sparkles,
  Info,
  Sliders,
} from 'lucide-react';
import { formatEuro } from '../../lib/storage';

interface TutorialGuideProps {
  onGoToPage: (page: 'comparison' | 'simulator' | 'instruments' | 'amortization') => void;
  carPriceCash?: number;
  maxirataAmount?: number;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  onGoToPage,
  carPriceCash = 23350,
  maxirataAmount = 14065,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '1. Inserisci i dati del tuo Preventivo',
      icon: Car,
      badge: 'Passo 1 • Dati Iniziali',
      description: 'Come inserire esattamente ciò che ti ha proposto la concessionaria.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Nella pagina <strong>"1. Preventivo Auto"</strong> puoi compilare tutti i valori digitandoli direttamente con la tastiera oppure trascinando gli slider:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Prezzo di Listino vs Prezzo Promo</span>
              Puoi inserire sia il prezzo di listino e lo sconto, oppure digitare direttamente il <strong>Prezzo Promozionato</strong> fornito dal venditore.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Anticipo e Permuta</span>
              Inserisci l&apos;anticipo in contanti e l&apos;eventuale valore di valutazione della tua auto usata data in permuta.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Dettagli & Spese Accessorie</span>
              Apri il cassetto per inserire le spese di istruttoria (es. 380 €), incasso rata (es. 3,40 €/m), imposta di bollo e polizze o garanzie estese.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Preset Rapido con 1 Click</span>
              In alto trovi il pulsante rapido <em>"Škoda Fabia (Preventivo Reale)"</em> che carica all&apos;istante un preventivo autentico per fare prove.
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: '2. Capire il Verdetto e le 3 Opzioni',
      icon: Calculator,
      badge: 'Passo 2 • Confronto Matematico',
      description: 'Contanti vs Finanziamento Standard vs Finanziamento con Maxirata.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Il nostro motore finanziario analizza simultaneamente le tre strade d&apos;acquisto:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="font-bold text-emerald-900 block text-xs uppercase">Opzione 1 • Contanti (Zero Debiti)</span>
              <p className="mt-0.5 text-slate-700">
                Paghi subito l&apos;auto in bonifico. Eviti qualsiasi interesse e spesa di istruttoria, ma rinunci all&apos;extra sconto che il concessionario offre solo a chi attiva il finanziamento e immobilizzi liquidità che avrebbe potuto rendere investita.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="font-bold text-blue-900 block text-xs uppercase">Opzione 2 • Finanziamento Standard</span>
              <p className="mt-0.5 text-slate-700">
                Ammortamento classico a rate costanti (es. 48 o 60 mesi). Rata tutto incluso, con interessi distribuiti su tutto il capitale.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="font-bold text-amber-900 block text-xs uppercase">Opzione 3 • Maxirata Finale / VFG</span>
              <p className="mt-0.5 text-slate-700">
                Rate mensili basse per 35-36 mesi, ma con una Maxirata finale elevata (spesso il 50-60% del valore dell&apos;auto, es. {formatEuro(maxirataAmount)}).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: '3. Rata Auto vs Quota da Investire A PARTE',
      icon: PiggyBank,
      badge: 'Passo 3 • La Strategia Vincente',
      description: 'Come evitare la trappola del rifinanziamento con il Salvadanaio BTP.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-300">
            <span className="font-extrabold text-slate-900 block text-sm">
              Attenzione alla differenza fondamentale tra le due uscite mensili:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block">1. RATA ALLA FINANZIARIA</span>
                <span className="text-[11px] text-slate-500">Es. 99 € + 3,40 € = 102,40 €/m</span>
                <p className="mt-1">
                  Viene addebitata via RID bancario dal concessionario per coprire l&apos;uso dell&apos;auto e gli interessi.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-300">
                <span className="font-bold text-emerald-900 block">2. QUOTA SALVADANAIO BTP</span>
                <span className="text-[11px] text-slate-500">Es. ~373 €/m A PARTE</span>
                <p className="mt-1">
                  <strong>NON la dai al concessionario!</strong> Rimane sul tuo conto personale per comprare BTP o vincoli su conto deposito.
                </p>
              </div>
            </div>
          </div>
          <p>
            <strong>Cosa succede dopo 36 mesi?</strong> Sul tuo conto avrai i 14.000 € pronti per riscattare l&apos;auto in contanti, di cui oltre 600 € di interessi regalati dallo Stato. In questo modo eviti di dover <em>rifinanziare</em> l&apos;auto a tassi usurai dell&apos;8-11%!
          </p>
        </div>
      ),
    },
    {
      step: 4,
      title: '4. Usa il Simulatore di Budget & GAP',
      icon: TrendingUp,
      badge: 'Passo 4 • Simulazioni Libere',
      description: 'Scegli quanto puoi risparmiare ogni mese e scopri il disavanzo finale.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Nella pagina <strong>"2. Simulatore Budget & Gap"</strong> puoi simulare qualsiasi cifra mensile:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Se metti 100 €/mese:</strong> accumuli circa 3.750 € al 3° anno. Ti mancheranno circa 10.300 € per saldare la maxirata.
            </li>
            <li>
              <strong>Se metti 200 €/mese:</strong> accumuli circa 7.500 € al 3° anno, coprendo oltre il 50% della maxirata.
            </li>
            <li>
              <strong>Cosa fare con il GAP residuo?</strong> Puoi pagare la differenza in contanti, oppure fare un <em>Mini-Rifinanziamento</em> solo sui soldi che mancano, ottenendo una rata molto più bassa e risparmiando centinaia di euro di interessi bancari!
            </li>
          </ul>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Tabella Multi-Scenario</span>
            Puoi confrontare in un solo colpo d&apos;occhio 4 diversi livelli di risparmio (0€, 100€, 200€ e Quota Piena).
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: '5. Scegli lo Strumento Finanziario Idoneo',
      icon: Coins,
      badge: 'Passo 5 • Investimento Consapevole',
      description: 'Perché a 3 anni non tutti gli investimenti sono uguali.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Nella pagina <strong>"3. Strumenti & Rendimenti"</strong> trovi il catalogo con le medie storiche reali a 3 anni:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900 block">BTP & Conti Deposito (Ideali)</span>
              Hanno scadenza fissa o capitale garantito a 100. Non rischi di trovarti con meno soldi il giorno in cui scade la maxirata.
            </div>
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900 block">ETF Azionari / Azioni (Cautela)</span>
              Sebbene storicamente abbiano rendimenti del 7-10%, su soli 3 anni sono volatili. Se al 36° mese il mercato corregge del -15%, potresti trovarti in perdita quando devi pagare l&apos;auto.
            </div>
          </div>
          <p>
            Cliccando su <strong>"Applica questo Strumento"</strong> su qualsiasi scheda, il tasso e la tassazione vengono applicati all&apos;istante a tutti i calcoli dell&apos;app.
          </p>
        </div>
      ),
    },
  ];

  const current = steps.find((s) => s.step === activeStep) || steps[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Guida Passo-Passo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                Tutorial Interattivo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Come Usare il Calcolatore Auto &amp; Salvadanaio BTP
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Segui i 5 passaggi chiave per confrontare i preventivi, scoprire il costo reale e pianificare il riscatto della maxirata senza debiti.
            </p>
          </div>
        </div>

        {/* Action button to explore options */}
        <button
          type="button"
          onClick={() => onGoToPage('comparison')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Vai al Calcolatore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.step;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between last:col-span-2 sm:last:col-span-1 ${
                isActive
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 text-blue-900 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {s.step}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <div className="text-[11px] font-bold line-clamp-2 leading-tight">
                {s.title.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Content Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              {current.badge}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{current.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{current.description}</p>
          </div>
        </div>

        <div className="py-2">{current.content}</div>

        {/* Step Navigation Controls */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1.5 min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Precedente</span>
          </button>

          <span className="text-xs font-bold text-slate-500 tabular-nums">
            Passo {activeStep} di {steps.length}
          </span>

          {activeStep < steps.length ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 min-h-[40px]"
            >
              <span>Successivo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGoToPage('comparison')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 min-h-[40px]"
            >
              <span>Inizia a Calcolare</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

