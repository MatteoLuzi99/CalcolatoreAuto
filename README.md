# 🚗 AutoFin BTP — Calcolatore Costo Reale Auto & Salvadanaio

> **Quanto ti costa davvero acquistare un'auto?**  
> Il primo strumento web open-source e 100% client-side per confrontare matematicamente l'acquisto in **Contanti**, il **Finanziamento Classico** a rate costanti e il finanziamento con **Maxirata (VFG)** abbinato a un **Salvadanaio in BTP o Conto Deposito**.

---

## 🎯 Il Problema che Risolve

Quando si acquista un'auto nuova o usata recente, le concessionarie propongono quasi sempre la formula con **Maxirata / Valore Futuro Garantito (VFG)** (es. *Progetto Valore Volkswagen, Renault Way, Ford Idea, Škoda Clever Value*, ecc.), offrendo un allettante **sconto sul prezzo di listino** (spesso tra 1.500 € e 4.500 €) a patto di finanziare.

Questo meccanismo pone l'acquirente di fronte a tre dilemmi:

1. **Pagare in contanti:** Si evitano tutti gli interessi passivi, ma si **rinuncia allo sconto promozionale** (spesso di migliaia di euro) e si immobilizza immediatamente una grossa somma di liquidità che potrebbe invece generare rendimenti sicuri.
2. **Finanziamento classico:** Tassi di interesse spesso elevati (TAEG 7% – 10%) che vanificano rapidamente lo sconto ricevuto.
3. **La "Trappola della Maxirata" tradizionale:** Le rate dei primi 3 anni sono basse, ma al 36° mese arriva una maxirata pari al 50-60% del valore dell'auto. Chi non ha accantonato la somma si trova costretto a **rifinanziare la maxirata** a tassi ancora più alti (9% – 12%), finendo per pagare la vettura molto più del prezzo di listino.

### 💡 L'Intuizione: La Strategia del Salvadanaio BTP / Conto Deposito
**AutoFin BTP** dimostra con formule matematiche rigorose come sia possibile:
- **Incassare lo sconto promozionale** della concessionaria scegliendo la formula con maxirata.
- **Accantonare mese per mese la quota necessaria** in uno strumento sicuro e a capitale garantito (es. **BTP a 3 anni** con tassazione agevolata al 12,5%, **Conto Deposito vincolato** a 36 mesi garantito FITD fino a 100k€ o **ETF monetario**).
- **Far pagare gli interessi della maxirata ai rendimenti del titolo**.
- **Riscattare l'auto al mese 36 in contanti**, diventandone proprietari al 100% senza mai cadere nella trappola del rifinanziamento concessionario.

---

## ✨ Funzionalità Principali

### 1. Confronto Dinamico a 4 Opzioni
- **Opzione 1 (Contanti):** Esborso immediato, calcolo dello sconto perso e del costo opportunità della liquidità immobilizzata.
- **Opzione 2 (Finanziamento Standard):** Ammortamento alla francese a rate costanti, TAEG, interessi puri e spese accessorie.
- **Opzione 3 (Maxirata Senza Salvadanaio):** Calcolo della rata del 1° periodo e simulazione a scelta tra **Saldo Unico Cash** o **Rifinanziamento 2° Periodo** (con durata e TAEG personalizzabili).
- **Opzione 4 (Maxirata + Salvadanaio):** Calcolo della quota mensile esatta da investire, interessi netti maturati a tuo favore e costo reale netto.

### 2. Adattamento al Preventivo Reale della Concessionaria
- **Doppio inserimento Maxirata:** Modificabile sia in **Euro esatti (€)** che in **Percentuale sul listino (%)** con slider e preset rapidi (40%, 50%, 55%, 60%).
- **Rata contrattuale fissa:** Possibilità di inserire direttamente la rata mensile dichiarata dalla concessionaria (es. `99,00 €/mese`) oppure calcolarla automaticamente tramite TAN/TAEG.
- **Spese accessorie dettagliate:** Istruttoria pratica, imposta di bollo, spese incasso rata mensili, polizze facoltative/obbligatorie e garanzie estese.

### 3. Simulatore Budget & Gap Maxirata
- Selettore libero dell'importo che si desidera investire ogni mese (es. `100 €/mese` o `200 €/mese`).
- Calcolo automatico dell'eventuale **Gap residuo** a scadenza e simulazione del mini-rifinanziamento solo sulla differenza mancante.
- Calcolo del risparmio netto rispetto a rifinanziare l'intera maxirata.

### 4. Catalogo Strumenti Finanziari Reali (Orizzonte 36 Mesi)
Confronto tra i principali strumenti del mercato italiano:
- **BTP 3 Anni** (Titolo di Stato IT, tassazione 12,5%, capitale certo a scadenza).
- **Conto Deposito Vincolato 36M** (Tassazione 26%, garanzia Fondo Interbancario Tutela Depositi).
- **ETF Monetario Euro Overnight / €STR** (es. XEON, bassissima volatilità, liquidità giornaliera).
- **ETF Obbligazionario Gov 1-3Y** e **PAC ETF Azionario** (MSCI World, S&P 500 per orizzonti più lunghi).

### 5. Grafici Interattivi & Piano di Ammortamento Mese per Mese
- **Grafico temporale ComposedChart:** visualizza l'andamento cumulativo degli esborsi e la crescita progressiva del salvadanaio fino al 100% della maxirata.
- **Scomposizione Costi:** barre orizzontali e verticali che mostrano dove vanno i soldi (Prezzo Netto Auto vs Interessi Passivi vs Rendimento Strumento).
- **Tabella ammortamento completa:** consultabile mese per mese ed **esportabile in CSV** (sanitizzato contro formula injection).

### 6. Report di Perizia in PDF (2 Pagine A4 Pronte per la Stampa)
- **Pagina 1:** Matrice comparativa completa di tutte e 4 le opzioni, dati del preventivo e verdetto vincente con TAEG di break-even.
- **Pagina 2:** Grafici visivi di scomposizione costi, tabella cronologica delle milestone temporali e **vademecum di negoziazione** con le clausole capestro da far rimuovere in concessionaria.

---

## 🔒 Privacy, GDPR & Sicurezza

L'applicazione è stata progettata seguendo il principio di **Privacy-by-Design**:
- **100% Client-Side:** Tutti i calcoli avvengono esclusivamente nel browser dell'utente tramite JavaScript/TypeScript.
- **Zero Cookie & Zero Tracciamento:** Nessun cookie di profilazione, nessun cookie analitico, nessun pixel di tracciamento (niente Google Analytics o Facebook Pixel). Non richiede alcun cookie banner invasivo in conformità alle Linee Guida del Garante Privacy.
- **Nessun Server / Database:** Nessun dato inserito (prezzi, preventivi, stipendi) viene trasmesso o registrato su server remoti.
- **Zero Font Terzi:** Nessuna chiamata a Google Fonts o CDN estere (conforme alle sentenze europee Schrems II).
- **Protezione XSS & CSV:** Sanitizzazione rigorosa dei parametri URL e protezione contro CSV Formula Injection (CWE-1236).
- **Security Headers:** File `vercel.json` preconfigurato con `Content-Security-Policy` difensiva, `Strict-Transport-Security` (HSTS), `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff`.

---

## 🛠️ Stack Tecnologico

- **Frontend Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Grafici:** [Recharts](https://recharts.org/)
- **Icone:** [Lucide React](https://lucide.dev/)
- **Analytics:** [@vercel/analytics](https://vercel.com/analytics) (Privacy-first, cookieless, GDPR-compliant)
- **Test Runner:** [Vitest](https://vitest.dev/) (12 unit test matematici e di sicurezza)

---

## 🚀 Guida all'Installazione e Sviluppo Locale

### Prerequisiti
- [Node.js](https://nodejs.org/) versione 18.0 o superiore
- `npm` (incluso con Node.js)

### 1. Clona il repository o scarica i file
```bash
git clone https://github.com/matteoluzi99/calcolatore-auto-btp.git
cd calcolatore-auto-btp
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Avvia il server di sviluppo locale
```bash
npm run dev
```
L'applicazione sarà accessibile all'indirizzo `http://localhost:5173/`.

### 4. Esegui i test unitari
```bash
npm test -- --run
```

### 5. Compila per la produzione
```bash
npm run build
```
I file ottimizzati e pronti per l'hosting statico verranno generati nella cartella `dist/`.

---

## ☁️ Deploy su Vercel (Consigliato)

Il progetto include già il file di configurazione [`vercel.json`](./vercel.json) con le regole di rewrite SPA e tutti gli header di sicurezza.

### Metodo Rapido via GitHub:
1. Carica il progetto su un repository GitHub (pubblico o privato).
2. Accedi a [Vercel](https://vercel.com) e clicca su **"Import Project"**.
3. Seleziona il repository: Vercel rileverà automaticamente Vite come framework.
4. Clicca su **"Deploy"**: in 30 secondi il sito sarà online con certificato SSL HTTPS gratuito.

---

## ⚖️ Disclaimer Legale e Finanziario

Il presente progetto è un'iniziativa personale indipendente a carattere didattico, divulgativo e non commerciale. Le elaborazioni fornite non costituiscono consulenza finanziaria personalizzata ex D.Lgs. 58/1998 (TUF), sollecitazione al pubblico risparmio ex Direttiva MiFID II, né offerta di credito o intermediazione bancaria. Prima di sottoscrivere finanziamenti automobilistici o acquistare strumenti finanziari, consultare sempre la documentazione precontrattuale ufficiale (modulo SECCI, prospetto informativo e KID) degli emittenti e intermediari autorizzati.

---

## 📄 Licenza

Rilasciato sotto licenza [MIT](./LICENSE). Libero per uso personale, studio e miglioramento.

