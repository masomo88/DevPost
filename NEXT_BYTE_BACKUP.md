# Next Byte Hacks V5 — bozza di riserva

Stato: bozza, non iscritta né inviata. Le [regole dettagliate](https://next-byte-hacks-v5.devpost.com/rules) ammettono persone dai 13 anni, ma il [riquadro Devpost](https://next-byte-hacks-v5.devpost.com/) indica la maggiore età. L'idoneità di una persona di 17 anni resta da chiarire.

Premi in denaro dichiarati: 50 USD al primo, 25 USD al secondo e 25 USD al terzo. La [finestra](https://next-byte-hacks-v5.devpost.com/details/dates) è dal 6 al 31 ottobre 2026. Repair Relay è stato avviato il 17 ottobre e non è stato inviato a Devpost. Il divieto di progetti previously submitted or completed va chiarito per una candidatura a questa gara.

## Testo della candidatura da adattare

Project name: Repair Relay

Elevator pitch: Repair Relay turns requests and volunteer skills into a usable schedule for a neighbourhood repair day, while holding risky items for safety review.

Inspiration: Organising a repair event requires matching requests to volunteer skills and limited time. Repair Relay makes those constraints visible. ISTAT provides national context; no local pilot or interview is claimed.

What it does: An organiser creates an event, adds item requests and volunteer aliases, and gets time slots for compatible volunteers. Unassigned requests stay on a waitlist. Safety-flagged requests are held for qualified review. The organiser can record self-reported outcomes, export or import JSON, and print the plan. A clearly marked fictional example allows inspection without presenting sample data as real outcomes.

How we built it: HTML, CSS, JavaScript, an ES module matching engine, an optional Node.js scheduling endpoint, browser localStorage, and Playwright for video and screenshots. No paid API or generative model is required at runtime. The matching algorithm is deterministic, prioritises urgent requests, and respects skills and available minutes.

Challenges and learning: Fictional cards are excluded from reported repaired totals. Risky items cannot become automatic assignments. Item weight is self-reported and does not represent verified waste avoided.

AI disclosure: OpenAI Codex generated a substantial portion of code, design, tests, documentation and video production. The entrant should review and understand the submission. No manual authorship of those materials is claimed.

What next: Validate the flow with a real repair organiser, add stations and breaks, and explore consent-aware multi-device collaboration. These are plans, not shipped features.

## Materiali

- Demo: https://masomo88.github.io/RepairRelay-NeighborhoodHacks-2026/
- Sorgente: https://github.com/masomo88/RepairRelay-NeighborhoodHacks-2026
- Video 2:21: https://youtu.be/kOVYe9LRZQk
- Schermate: RepairRelaySubmission/assets/preview.png, RepairRelaySubmission/assets/planning-board.png, RepairRelaySubmission/assets/safety-review.png
- Archivio sorgente: NeighborhoodHacks/RepairRelay-submission.zip

Il video attuale cita Neighborhood Hacks nel titolo e nella chiusura: preparare una versione neutra prima di usarlo per Next Byte. Le [regole](https://next-byte-hacks-v5.devpost.com/rules) richiedono 2–5 minuti, la panoramica 1–3; 2:21 rientra in entrambe. La panoramica chiede 2–3 schermate; ne abbiamo tre. Non iscrivere o inviare senza autorizzazione esplicita.
