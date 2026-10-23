import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  FileText,
  Lock,
  Landmark,
  Scale,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'financial' | 'corporate';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'financial' | 'corporate'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fade-in"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base font-bold text-slate-900">
                Informative Legali, Privacy &amp; Disclaimer Finanziario
              </h2>
              <p className="text-[11px] text-slate-500">
                Conformit&agrave; Privacy GDPR (UE 2016/679), Architettura 100% Client-Side e Direttiva MiFID II
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi finestra modale"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 pt-2 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy &amp; Cookie Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'financial'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Disclaimer Finanziario (TUF / MiFID II)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corporate')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'corporate'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Natura del Progetto &amp; No-Profit</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Architettura Privacy-by-Design (100% Client-Side)</span>
                  <p className="mt-0.5 text-xs text-emerald-900 leading-normal">
                    La presente applicazione non raccoglie, non trasmette e non archivia alcun dato personale,
                    bancario o finanziario su server esterni. Tutti i calcoli e le simulazioni avvengono
                    esclusivamente nella memoria temporanea locale del tuo browser.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">1. Natura del Progetto e Titolare del Trattamento</h3>
                <p>
                  L&apos;applicazione web <strong>AutoFin BTP</strong> &egrave; un progetto software personale, indipendente e a titolo puramente divulgativo ed educativo, realizzato da uno sviluppatore privato senza fini di lucro e senza esercizio di attivit&agrave; d&apos;impresa o professionale (nessun obbligo di partita IVA ex art. 2082 c.c.).
                </p>
                <p>
                  Poich&eacute; il software &egrave; strutturato con architettura <em>100% Client-Side</em> e non raccoglie, non memorizza e non trasmette alcun dato personale identificativo a server esterni, <strong>non viene effettuato alcun trattamento di dati personali degli utenti</strong> ai sensi del Regolamento (UE) 2016/679 (GDPR).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">2. Assenza di Cookie di Profilazione &amp; Web Analytics Privacy-First</h3>
                <p>
                  Questo sito <strong>non fa uso di cookie di profilazione o tracciamento pubblicitario</strong> (nessun pixel di tracciamento commerciale o profilazione comportamentale).
                </p>
                <p>
                  Per monitorare in forma strettamente aggregata il volume di traffico e le prestazioni del software viene utilizzato <strong>Vercel Web Analytics</strong> in modalit&agrave; <em>cookieless</em> (senza cookie o local storage sul dispositivo). Il servizio rispetta rigorosamente le intestazioni di privacy del browser: se hai attivo il segnale <code>Do Not Track (DNT)</code> o <code>Global Privacy Control (GPC)</code>, la telemetria &egrave; completamente inibita.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">3. Uso del LocalStorage Tecnico (Art. 122 Codice Privacy)</h3>
                <p>
                  L&apos;applicazione utilizza la memoria locale del browser (<code>localStorage</code>) unicamente per la funzione facoltativa{' '}
                  <strong>&ldquo;Salva Preventivo&rdquo;</strong>, consentendoti di richiamare i tuoi preventivi salvati sullo stesso dispositivo.
                  Tale archiviazione ha natura puramente tecnica su richiesta esplicita dell&apos;utente ed &egrave; esente da consenso preventivo.
                  Puoi cancellare tutti i dati salvati in qualsiasi momento tramite il pulsante &ldquo;Elimina&rdquo; o svuotando la cache del browser.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">4. Font Locali e Nessun Trasferimento Dati Estero</h3>
                <p>
                  In conformit&agrave; con le recenti pronunce giurisprudenziali europee (LG M&uuml;nchen I, 20.01.2022),
                  i font e gli asset grafici sono serviti localmente e non tramite CDN terze (nessun caricamento dinamico da Google Fonts),
                  impedendo qualsiasi trasmissione non autorizzata del tuo indirizzo IP verso server extra-UE.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="font-bold block text-sm mb-1">Dichiarazione Liberatoria di Responsabilit&agrave;</span>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Le elaborazioni e le metriche fornite dal presente software sono generate tramite modelli matematici
                  e algoritmi finanziari a solo scopo didattico, comparativo e di simulazione numerica.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Esclusione di Consulenza Finanziaria (TUF &amp; MiFID II)</h3>
                <p>
                  I contenuti, le stime, i tassi di pareggio (break-even TAEG) e i piani di accumulo in BTP o altri strumenti
                  <strong> non costituiscono in alcun caso e non possono essere intesi come</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Servizio di consulenza in materia di investimenti o raccomandazione personalizzata ex Art. 1, comma 5-septies del D.Lgs. 58/1998 (Testo Unico della Finanza - TUF);</li>
                  <li>Sollecitazione all&apos;investimento o offerta al pubblico di prodotti finanziari ai sensi della Direttiva MiFID II (2014/65/UE);</li>
                  <li>Promozione o intermediazione del credito bancario o finanziario ex D.Lgs. 385/1993 (Testo Unico Bancario - TUB).</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Rendimenti Passati e Fluttuazioni di Mercato</h3>
                <p>
                  I rendimenti medi a 3 anni indicati nel catalogo strumenti (BTP, conti deposito vincolati, ETF monetari, ETF azionari)
                  hanno valore puramente indicativo e non garantiscono rendimenti futuri.
                  I titoli azionari e gli ETF sono soggetti a oscillazioni di mercato e rischio di capitale.
                  Prima di sottoscrivere qualsiasi finanziamento automobilistico o investire in strumenti finanziari,
                  &egrave; fatto espresso invito a consultare la documentazione contrattuale e precontrattuale obbligatoria
                  (Modulo SECCI, Prospetto Informativo, Fascicolo Informativo, Scheda KID/PIEG)
                  rilasciata dagli intermediari finanziari ed emittenti autorizzati.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'corporate' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block text-sm">
                  Informativa sulla Natura del Progetto e Assenza di Scopo di Lucro
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Questa applicazione web &egrave; un <strong>progetto personale indipendente a carattere didattico, divulgativo e non commerciale</strong>, ideato e sviluppato da un privato cittadino per favorire la trasparenza finanziaria nell&apos;acquisto delle autovetture.
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <div className="font-semibold text-slate-800">Perch&eacute; non &egrave; presente una Partita IVA o iscrizione al Registro Imprese:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <strong>Assenza di attivit&agrave; d&apos;impresa (Art. 2082 c.c. e Art. 35 D.P.R. 633/1972):</strong> Il sito non offre beni o servizi a pagamento, non genera ricavi pubblicitari e non richiede alcun compenso agli utenti. L&apos;apertura di una Partita IVA &egrave; richiesta unicamente per l&apos;esercizio abituale di attivit&agrave; economiche o professionali.
                    </li>
                    <li>
                      <strong>Inapplicabilit&agrave; dell&apos;Art. 2250 c.c.:</strong> L&apos;obbligo di indicare dati societari, REA e capitale sociale si applica esclusivamente alle societ&agrave; soggette all&apos;obbligo di iscrizione nel Registro delle Imprese (es. S.r.l., S.p.A.), non ai privati che pubblicano progetti open-source o divulgativi.
                    </li>
                    <li>
                      <strong>Conformit&agrave; Privacy (Art. 2, par. 2, lett. c del GDPR):</strong> L&apos;applicazione opera al 100% sul dispositivo dell&apos;utente (client-side) e non raccoglie n&eacute; trasmette dati personali o identificativi a server esterni.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-semibold block text-slate-800">Contatto e Comunicazioni (Art. 7 D.Lgs. 70/2003):</span>
                <p>
                  Per segnalazioni tecniche, miglioramenti agli algoritmi di calcolo o richieste di chiarimento sul software open-source, &egrave; possibile contattare lo sviluppatore tramite la repository GitHub del progetto: <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">AutoFin BTP su GitHub</a>.
                </p>
              </div>

              <p className="text-[11px] text-slate-500">
                Il codice &egrave; distribuito a scopo di utilit&agrave; pubblica e non persegue alcuna attivit&agrave; di intermediazione bancaria o finanziaria.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Ho compreso e accetto
          </button>
        </div>
      </div>
    </div>
  );
};

