import React, { useState } from 'react';
import {
  Share2,
  Check,
  RotateCcw,
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
    <header className="bg-white border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Bar: Identity and Main Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="md" showSubtitle={true} />
          </div>

          {/* Center/Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Simple / Advanced Toggle */}
            {onToggleSimpleMode && (
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isSimpleMode
                      ? 'bg-white text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Essenziale
                </button>
                <button
                  type="button"
                  onClick={() => !isSimpleMode || onToggleSimpleMode()}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    !isSimpleMode
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>Dati Avanzati</span>
                </button>
              </div>
            )}

            {/* Editable Scenario Name */}
            <input
              type="text"
              aria-label="Nome del veicolo o preventivo"
              value={inputs.scenarioName}
              onChange={(e) => onUpdateInputs({ scenarioName: e.target.value })}
              placeholder="Es. SUV Compatto 28.000 €"
              className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 w-48 sm:w-56 transition-colors"
            />

            {/* Perizia PDF */}
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Perizia PDF</span>
              </button>
            )}

            {/* Condividi Link */}
            <button
              type="button"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                copiedFeedback
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copiato</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Condividi</span>
                </>
              )}
            </button>

            {/* Guida SECCI */}
            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guida SECCI</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Presets Bar: Quiet Ledger presets */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-slate-400 font-medium mr-1">Casi reali da concessionaria:</span>
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
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    ({preset.badge})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset parametri</span>
          </button>
        </div>
      </div>
    </header>
  );
}
