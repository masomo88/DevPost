# Devpost submission draft — Arbiter Hacks V1

**Track:** Rethinking Waste  
**Project name:** ShelfLoop  
**Tagline:** Turn food already in your kitchen into a practical rescue plan before it is forgotten.

## Description

Household food waste is a measurable problem. The [UNEP Food Waste Index 2024](https://www.unep.org/en/news-and-stories/press-release/world-squanders-over-1-billion-meals-day-un-report) estimates 1.05 billion tonnes of food waste in 2022 across households, food service and retail, with 60% occurring in households. ShelfLoop addresses one small, actionable part of this problem: people often know what they own but do not have a clear order for using it.

The app turns a short kitchen inventory into a prioritized list. People add the name, weight and date of each item. ShelfLoop highlights food dated within two days, displays its entered weight, and suggests combinations that can use the ingredients. For example, spinach, tomatoes and eggs can become a frittata; ingredients in the example are explicitly fictional. Items past the entered date are flagged for review and excluded from recipe suggestions. A self-reported outcome journal separately records used and discarded food and keeps example items out of the real totals. Data stays in the browser; the rule-based planner runs locally. An optional Ollama integration can generate two extra suggestions without a paid cloud API, rejecting suggestions that reference unlisted ingredient IDs.

The core is deliberately transparent. The “at risk” figure means entered inventory weight nearing a date; it is not a claim that ShelfLoop has already prevented that much waste. To evaluate real impact, we would run a household pilot and weigh discarded food weekly before and after use, with a separate count of prompted items used.

### How it was built

Vanilla HTML/CSS/JavaScript, Node.js HTTP server, pure JavaScript planner, browser localStorage, optional local Ollama HTTP API. The source contains tests for planning, validation and API behavior. Codex assisted with implementation; this should be disclosed in the final submission. The participant must review and understand the project before presenting it.

### Challenges

Dates alone cannot establish food safety. ShelfLoop labels them as planning prompts and excludes past-date items from recipes. Recipe matching also needs to work without a paid model; a deterministic ingredient matcher provides reliable baseline behavior, with local AI as an optional enhancement.

### Next steps

Add household-specific portions, label types (use-by versus best-before), more languages, and a measured pilot. Expand ingredient matching with a reviewed, licensed food taxonomy. Test the optional model with users and reject suggestions that violate food-safety guidance.

## Theme paragraph requested by Arbiter

ShelfLoop targets **avoidable household food waste caused by forgotten ingredients nearing their entered dates**. Its central workflow is inventory → urgency order → grounded recipe idea, so waste prevention is the product's purpose. Effectiveness should be measured as the change in grams of discarded edible food per household per week in a pilot, plus the share of prompted ingredients actually used. No reduction has been measured yet.

## Submission checklist

- [x] Working local application and source code
- [x] Written description and theme measurement paragraph
- [x] Automated tests, simulated Ollama contract test, and manual browser interaction check
- [ ] Confirm with organizer whether code created before 20 October is eligible; disclose the 15 October prototype
- [ ] Confirm AI coding-assistant policy and any fee or minor-specific condition; question drafted in `ORGANIZER_MESSAGE.md`
- [ ] Build and log substantive event-period work if required
- [ ] Publish a public repository with this source and license (authorized; in progress)
- [ ] Record and publish the 2–3 minute video (requires user participation/authorization)
- [ ] Register and submit on Devpost (requires explicit user authorization)

The [Arbiter overview](https://arbiter-hacks-v1.devpost.com/) requires a public repository, a demo video of 2–3 minutes maximum, a description, and the theme paragraph; its [rules](https://arbiter-hacks-v1.devpost.com/rules) specify solo/team size and the judging rubric. The public page labels the first theme prize “$1,100 in cash”, but its breakdown says **$100 cash and $1,000 Adaption credits**. No award is guaranteed.
