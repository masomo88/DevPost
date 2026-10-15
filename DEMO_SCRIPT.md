# ShelfLoop demo script (target: 2 minutes 30 seconds)

This is a recording script, **not a claim that a video has been recorded**. Use a local running app or a published demo URL. Show genuine interactions and only features that work in that environment.

**0:00–0:20 — Problem.** “Households produce a large share of food waste. A common practical problem is losing track of ingredients that need attention. ShelfLoop turns the food already in a kitchen into a small action plan.” Show the home dashboard. Cite UNEP in the written description; avoid claiming personal interviews or proven savings.

**0:20–0:45 — Inventory.** Point out that the starting list is a clearly labeled example. Add “Zucchini”, 275 g, date three days from today. Show the item appear, and that it persists after reload. Explain the browser stores the inventory locally.

**0:45–1:15 — Priorities.** Show the count of items needing attention and the entered grams. Explain that these grams are **food needing a plan, not waste already prevented**. Show items ordered by date and the reminder to check food condition.

**1:15–1:45 — Rescue ideas and journal.** Scroll to combinations grounded in the current inventory. Point at the ingredients listed under a recipe. Mark the newly added zucchini as used and show its grams in the journal; example items are excluded from the real total. Explain that past-date items are excluded from suggestions.

**1:45–2:05 — Technical design.** Show `public/planner.js`, `server.js`, and the test command briefly. Explain the rule-based planner requires no account, subscription or API key. If a local Ollama model is actually running and tested, demonstrate **Ask local AI**; otherwise explain the optional integration without claiming its output was tested. The hosted static demo disables this button.

**2:05–2:30 — Impact and next step.** “The next step is a household pilot: weigh edible discards each week, compare before and after, and record how often prompts lead to use. We have not measured savings yet.” End on the ShelfLoop dashboard and show the public repo URL once it exists.
