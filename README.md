# WebMark

AI regression testing across 6 public websites, powered by [Passmark](https://passmark.dev).

Built for the **Hashnode "Breaking Things" Hackathon 2026**.


---

## What it found

- **Vercel Commerce**: product page shows $20, cart shows $15 — price discrepancy caught by AI assertion
- **Sauce Demo `visual_user`**: product images mismatched to wrong products — AI vision caught it
- **Rallly**: poll creation, date picker navigation, and form validation all work via snapshot mode
- **Hoppscotch**: GET and POST requests through a complex React SPA — no selectors needed
- **CUA mode**: requires `OPENAI_API_KEY` directly — cannot route through OpenRouter

## Sites tested

| Site | Flows | Pass rate |
|---|---|---|
| DEV Community | browse-feed, search, signup-email-otp | 2/3 |
| Hoppscotch | snapshot-get, cua-get, snapshot-post, cua-post | 2/4 |
| Rallly | create-poll, form-validation, vote-on-poll | 2/3 |
| Sauce Demo | login-standard, login-locked-out, visual-user-bugs, checkout-pricing | 3/4 |
| UI Testing Playground | 3× snapshot + 3× CUA | 2/6 |
| Vercel Commerce | browse-add-to-cart, cart-global-state, pricing-accuracy | 1/3 |

## Quick start

```bash
git clone https://github.com/bishalbera/webmark
cd webmark
npm install
npx playwright install chromium

cp .env.example .env
# Add: OPENROUTER_API_KEY=sk-or-v1-...
#      REDIS_URL=redis://localhost:6379

docker run -d --name webmark-redis -p 6379:6379 redis:7-alpine

npm run test:cache       # cache benchmark (3 runs, real timing)
npm run test:auth        # Rallly + DEV.to flows
npm run test:ecommerce   # Sauce Demo + Vercel Commerce
npm run test:automation  # UITP + Hoppscotch (CUA requires OPENAI_API_KEY)
npm test                 # full suite

npm run dashboard        # generate dashboard/index.html
```

## Environment variables

```bash
OPENROUTER_API_KEY=sk-or-v1-...   # required — all snapshot-mode models
REDIS_URL=redis://localhost:6379    # required — step caching + global state
OPENAI_API_KEY=sk-...              # optional — CUA mode only (direct OpenAI, not OpenRouter)
```

## Stack

TypeScript · Passmark · Playwright · Redis · OpenRouter · GitHub Pages

## Key files

| File | Purpose |
|---|---|
| `lib/timer.ts` | `timedRunSteps()` — wall-clock timing per run, writes to `results/cache-run-results.json` |
| `lib/logger.ts` | `logFlowScore()` — appends to `results/site-scores.json` |
| `lib/sites.ts` | Site registry (6 sites, categories, flows) |
| `dashboard/generate.ts` | Reads results JSON → builds `dashboard/index.html` |
| `playwright.config.ts` | Passmark configuration, model overrides, testMatch |

---
