# ShelfLoop

ShelfLoop is a small, privacy-first household food-rescue planner. Enter food, weight, and a date; it highlights what deserves attention and proposes combinations grounded in the entered ingredients. It does **not** claim that food has been saved or that a date proves food is safe.

Built as a candidate for [Arbiter Hacks V1](https://arbiter-hacks-v1.devpost.com/) — **Theme Track: Rethinking Waste**. The event begins 20 October 2026, while this initial prototype was created on 15 October 2026. The [published rules](https://arbiter-hacks-v1.devpost.com/rules) do not explicitly resolve whether pre-event work is eligible. Disclose these dates in any submission and obtain organizer clarification before relying on eligibility. Additional, substantive work during the event should be documented accurately.

## Run

Requires Node.js 20 or newer. No package installation, account, paid API, or database is needed. On Windows, double-click **Start ShelfLoop.cmd** to start the server and open the app; closing the server window stops it.

```sh
node server.js
```

Open <http://127.0.0.1:3000>. Use **Add food**, remove an item, or load the clearly marked example inventory. Run `node --test` for the automated checks.

## Local AI (optional)

The core planner works without AI. For two additional suggestions from a **local** model, install and run [Ollama](https://ollama.com/) separately, pull a model you are licensed to use, set `OLLAMA_MODEL` to its local model name, and restart ShelfLoop. The app sends inventory names, weights and dates to `127.0.0.1:11434` **only when** the user presses **Ask local AI**. The server rejects generated suggestions whose ingredient IDs are absent from the current inventory. The HTTP integration has been tested with a simulated local Ollama response; a real model has not been exercised in this checkout. Model output is advisory and must be checked for food safety and factual accuracy. No cloud AI fees are required.

PowerShell example, after a model is already present locally:

```powershell
$env:OLLAMA_MODEL = 'your-local-model-name'
node server.js
```

## Architecture

```text
Browser: HTML/CSS/JS
  ├─ localStorage inventory and outcome journal (browser only)
  ├─ shared, explainable date/recipe planner (runs in browser)
  └─ POST /api/ai-plan → optional local Ollama generation (configurable local port)
Node HTTP server: static files, 80 KB request limit, JSON API (including /api/plan)
```

`public/planner.js` is a pure function module shared by browser and server. `server.js` serves files and API responses. `public/app.js` handles form, storage, rendering, a self-reported food outcome journal and CSV inventory export. Inventory is never stored on the server. The journal distinguishes food marked used from food marked discarded. All example items are fictional and excluded from real journal totals. The ingredient matcher supports several common English and Italian ingredient names; it is intentionally a small proof of concept, not an exhaustive food database. Recipe suggestions use listed ingredients and allow unspecified basic staples.

## Static demo

Run `npm run build:pages` to copy the browser app into `docs/`. A public GitHub repository can serve `docs/` with GitHub Pages at no software cost. The inventory planner and outcome journal work there without a backend. Local Ollama suggestions are available only when running the Node server with a local model.

## Privacy, safety and accessibility

- The inventory stays in browser localStorage. The main planner runs in the browser. When using the local server, an optional AI request goes to that server and then only to local Ollama.
- User-entered names are escaped before insertion into the page. The server validates item count, name length, weight and dates and limits request size.
- Dates are **planning prompts**, not expiry or food-safety certification. Users must inspect labels, storage and condition. Past-date items are excluded from recipe suggestions and flagged for review.
- Semantic headings, labels, table markup, keyboard focus indicators, live toast messages, and reduced-motion support are included. Color is reinforced with text labels.

## Measuring real impact

The dashboard's “food needing a plan” is the entered mass of items dated within two days. The journal separately totals food the user says they used and discarded, excluding example items; none of these figures is **measured waste avoided**. A pilot could compare weekly weighed discards before and after use, report grams per household per week, and separately record how many prompted items were actually used. No pilot or user interviews have been conducted yet.

## Submission status

The code and write-up are local and tested. A public repository URL, externally hosted demo, and a 2–3 minute video do not exist yet. The published Arbiter requirements call for a public repository and demo video; see [SUBMISSION.md](SUBMISSION.md) and [DEMO_SCRIPT.md](DEMO_SCRIPT.md). No registration or submission has been made.

## License

MIT. See [LICENSE](LICENSE).
