import React, { useState } from 'react';
import {
  Share2,
  Check,
  Sparkles,
  RotateCcw,
  PenLine,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { CalculatorInputs } from '../types/calculator';
import { PRESET_SCENARIOS, encodeInputsToUrl } from '../lib/storage';
import { Logo } from './common/Logo';

export interface HeaderProps {
  inputs: CalculatorInputs;
  onUpdateInputs: (patch: Partial<CalculatorInputs>) => void;
  onLoadInputs: (full: CalculatorInputs) => void;
  onReset: () => void;
  onOpenTutorial?: () => void;
  onDownloadPdf?: () => void;
  isSimpleMode?: boolean;
  onToggleSimpleMode?: () => void;
}

export function Header({
  inputs,
  onUpdateInputs,
  onLoadInputs,
  onReset,
  onOpenTutorial,
  onDownloadPdf,
  isSimpleMode = true,
  onToggleSimpleMode,
}: HeaderProps) {
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const handleShare = async () => {
    const shareUrl = encodeInputsToUrl(inputs);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2400);
    } catch {
      window.prompt('Copia il link al preventivo:', shareUrl);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Row: Brand Title + Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left: Badge, Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Simulatore Matematico Indipendente &bull; 100% Client-Side</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
              <Logo size="md" showSubtitle={false} />
              <div className="hidden sm:block w-px h-9 bg-slate-200/90" />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Quanto ti costa davvero l&apos;auto?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Confronto matematico trasparente tra{' '}
                  <span className="font-semibold text-slate-800">Contanti</span>,{' '}
                  <span className="font-semibold text-slate-800">Finanziamento Standard</span>,{' '}
                  <span className="font-semibold text-purple-700">Maxirata Sola</span> e{' '}
                  <span className="font-semibold text-emerald-700">
                    Maxirata con Salvadanaio Titoli
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right: Scenario Name Input & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Simple vs Advanced Mode Toggle */}
            {onToggleSimpleMode && (
              <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSimpleMode
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Interfaccia semplice e snella con soli 3 dati da preventivo"
                >
                  ✨ Semplice
                </button>
                <button
                  type="button"
                  onClick={() => !isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !isSimpleMode
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Interfaccia avanzata: sblocca tutti i tassi, spese accessorie e dettagli matematici"
                >
                  ⚙️ Avanzata
                </button>
              </div>
            )}

            {/* Editable Scenario Name (Modello auto da periziare) */}
            <div className="relative flex items-center w-full sm:w-60">
              <PenLine className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                aria-label="Nome del modello auto o preventivo"
                value={inputs.scenarioName}
                onChange={(e) => onUpdateInputs({ scenarioName: e.target.value })}
                placeholder="Es. Crossover Hybrid 28.000 €"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* SCARICA REPORT PDF BUTTON */}
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Scarica Report PDF</span>
              </button>
            )}

            {/* Share URL Button */}
            <button
              type="button"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                copiedFeedback
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-2xs'
              }`}
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Link copiato!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Condividi Link</span>
                </>
              )}
            </button>

            {/* Tutorial Button */}
            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-blue-300 bg-blue-50 hover:bg-blue-100/80 text-blue-800 transition-all cursor-pointer shadow-2xs"
              >
                <span>💡 Guida &amp; Tutorial</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Preset Scenarios Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Scenari Rapidi:</span>
            </span>

            {PRESET_SCENARIOS.map((preset) => {
              const isSelected =
                inputs.carPriceCash === preset.inputs.carPriceCash &&
                inputs.maxirataTaeg === preset.inputs.maxirataTaeg &&
                inputs.financingDiscount === preset.inputs.financingDiscount;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onLoadInputs(preset.inputs)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100/90 hover:bg-slate-200/75 text-slate-700'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold tabular-nums ${
                      isSelected ? 'bg-blue-700 text-blue-100' : 'bg-white text-slate-600'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
