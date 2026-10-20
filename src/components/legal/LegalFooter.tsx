import React, { useState } from 'react';
import { ShieldCheck, Scale, Lock, Info, ExternalLink } from 'lucide-react';
import { LegalModal } from './LegalModal';

export const LegalFooter: React.FC = () => {
  const [modalTab, setModalTab] = useState<'privacy' | 'financial' | 'corporate' | null>(null);

  return (
    <>
      <footer className="pt-8 pb-10 border-t border-slate-200/80 space-y-6 text-xs text-slate-500">
        {/* Top Summary & Technical Architecture */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-slate-800 text-sm">
                Calcolatore Costo Reale Auto &amp; Salvadanaio BTP
              </strong>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Client-Side &bull; Privacy-Safe
              </span>
            </div>
            <p className="mt-1 text-slate-500 text-xs">
              Simulatore algoritmico indipendente basato su formule di ammortamento alla francese, prestiti balloon (VFG) e capitalizzazione composta netta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0">
            <button
              type="button"
              onClick={() => setModalTab('privacy')}
              className="text-slate-600 hover:text-blue-600 underline font-medium cursor-pointer transition-colors"
            >
              Privacy &amp; Cookie
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              type="button"
              onClick={() => setModalTab('financial')}
              className="text-slate-600 hover:text-blue-600 underline font-medium cursor-pointer transition-colors"
            >
              Disclaimer TUF / MiFID II
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              type="button"
              onClick={() => setModalTab('corporate')}
              className="text-slate-600 hover:text-blue-600 underline font-medium cursor-pointer transition-colors"
            >
              Info Autore &amp; No-Profit
            </button>
          </div>
        </div>

        {/* Mandatory Educational & Financial Disclaimer (TUF / MiFID II) */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Disclaimer Legale e Finanziario (D.Lgs. 58/1998 &mdash; TUF / Direttiva MiFID II 2014/65/UE):</span>
          </div>
          <p>
            Il presente strumento ha finalit&agrave; puramente didattica, informativa e illustrativa. Le simulazioni elaborate non costituiscono n&eacute; possono in alcun caso essere intese come consulenza finanziaria personalizzata, sollecitazione al pubblico risparmio, offerta di strumenti finanziari o mediazione creditizia. I rendimenti simulati dei BTP e di altri titoli (lordi e netti) sono basati su dati storici medi o stime ipotetiche e non garantiscono rendimenti futuri. Prima di sottoscrivere finanziamenti automobilistici o acquistare titoli sul mercato, &egrave; necessario consultare la documentazione informativa ufficiale (SECCI, Prospetto Informativo, KID) fornita dagli intermediari o dagli emittenti autorizzati.
          </p>
        </div>

        {/* Project Nature & Zero Personal Data Notice */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-700">Progetto Personale e Indipendente</span>
            <span>&bull;</span>
            <span>Senza fini di lucro &bull; Nessuna Partita IVA richiesta (Attivit&agrave; divulgativa)</span>
            <span>&bull;</span>
            <span>100% Client-side (Nessun dato inviato a server terzi)</span>
          </div>

          <div className="tabular-nums text-emerald-700 font-semibold shrink-0">
            Zero tracker &bull; Zero cookie di profilazione
          </div>
        </div>
      </footer>

      {/* Accessible Legal Modal */}
      <LegalModal
        isOpen={modalTab !== null}
        initialTab={modalTab || 'privacy'}
        onClose={() => setModalTab(null)}
      />
    </>
  );
};

