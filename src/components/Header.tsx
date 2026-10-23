import React, { useState } from 'react';
import {
  Share2,
  Check,
  RotateCcw,
  PenLine,
  FileText,
  Sliders,
  BookOpen,
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
    <header className="bg-white border-b border-slate-200/90 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Row: Brand & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left: Logo & Purpose Statement */}
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Logo size="md" showSubtitle={false} />
              <div className="hidden sm:block w-px h-8 bg-slate-200" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                  Costo Reale Auto &amp; Salvadanaio Titoli
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Confronto matematico imparziale tra acquisto in <strong className="text-slate-800">Contanti</strong>,{' '}
                  <strong className="text-slate-800">Finanziamento Standard</strong> e formula con{' '}
                  <strong className="text-slate-800">Maxirata VFG + Salvadanaio BTP</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Switcher */}
            {onToggleSimpleMode && (
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isSimpleMode
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Essenziale
                </button>
                <button
                  type="button"
                  onClick={() => !isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    !isSimpleMode
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>Avanzato</span>
                </button>
              </div>
            )}

            {/* Editable Scenario Name */}
            <div className="relative flex items-center w-full sm:w-56">
              <PenLine className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                aria-label="Modello auto o preventivo"
                value={inputs.scenarioName}
                onChange={(e) => onUpdateInputs({ scenarioName: e.target.value })}
                placeholder="Es. SUV Compatto 28.000 €"
                className="w-full pl-8 pr-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/90 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            {/* PDF Report Button */}
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Perizia PDF</span>
              </button>
            )}

            {/* Share URL */}
            <button
              type="button"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                copiedFeedback
                  ? 'bg-blue-50 border border-blue-300 text-blue-700'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <span>Copiato!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Condividi</span>
                </>
              )}
            </button>

            {/* Tutorial */}
            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Guida SECCI</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Presets Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-slate-500 mr-1">Preventivi Reali:</span>
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
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] tabular-nums ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600'
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
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Ripristina default</span>
          </button>
        </div>
      </div>
    </header>
  );
}
