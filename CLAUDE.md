# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, server-less web app that pulls hourly consumption from the Tibber GraphQL API and computes power peaks
("effekttoppar") and the monthly power fee using Telge Nät rules. The UI language is Swedish; keep new UI text in Swedish.
Live at <https://powershelltoday.github.io/effekttoppar-tibber-telge/> (GitHub Pages, deploys from `main` / repo root, so a push = a deploy).

## Commands

- `npm run serve`: local server on <http://localhost:8080> (no caching). Opening `index.html` via `file://` breaks IndexedDB and fetch behaviour, so always serve it.
- `npm install && npm run icons`: regenerates everything in `icons/` from `tools/build-icons.mjs`. The SVG artwork is defined inline in that script; edit the script, never the generated files.
- There is no build, bundler, linter or test suite in the repo. `package.json` only holds dev tooling (sharp).

## Architecture (all in index.html)

- **One file, no dependencies.** CSS, markup and a single `<script>` live in `index.html`. Don't add external scripts or CDNs.
- **Pure analysis core** sits between the `// ==ANALYSIS START==` and `// ==ANALYSIS END==` markers. It covers Stockholm-time parsing (`localParts`), Swedish holidays (`easter`, `swedishHolidays`), `dayType`/`qualifies`, `analyzeMonth`, and `seasonMonths`. It is DOM-free, so it can be extracted and tested in node. Keep it that way.
- **Rules** (`DEFAULT_RULES`): price per kW, number of peaks averaged, peak-hour window, which months count, one-peak-per-day, and the weekend/holiday/eve exclusions. Users can override these in the settings panel; the overrides are persisted to `localStorage["tp.rules"]`.
- **Data model:** `cache = { version, homes: { [homeId]: { name, hours: { [tsMs]: [kWh, cost] }, coveredFrom, coveredTo } } }`.
  It is stored in IndexedDB (`tibberPeaks` / store `kv` / key `cache`), and optionally mirrored to a disk file through the File System Access API (Chromium only).
- **Fetching** (`fetchConsumption`) pages backwards through `consumption(resolution: HOURLY, last: n, before: cursor)` in pages of up to 744 hours, stopping once it reaches the season start (or `rules.from`). After that, fetches are incremental, using `coveredFrom`/`coveredTo`.
- **Token:** held in memory. It is written to `localStorage["tp.token"]` only after the user clicks "Ja, spara" in the inline consent panel (deliberately localStorage, not a cookie, so it never goes to github.io). Boot auto-starts a session when a saved token exists. The token must only ever be sent to `api.tibber.com`.
- **Rendering:** `render()` rebuilds every card from `analyzeMonth`. `chart()` emits an inline SVG and uses a smaller viewBox below 600px (`narrowMQ`), re-rendering when that breakpoint changes. Mobile-specific CSS is in the `@media (max-width: 600px)` block.
- **PWA bits:** `manifest.webmanifest`, the apple-touch/OG meta tags in `<head>` (the OG URLs are absolute and point at the Pages URL), and `.nojekyll`. There is no service worker.

## Testing

- `API.txt` (gitignored) holds a real Tibber personal access token for live tests. Never print it, commit it, or put it in screenshots.
- For browser checks, use `puppeteer-core` with the installed Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), set up in a scratch directory rather than in this repo. Check 375px and 1280px widths in light and dark mode. Assert there's no horizontal body scroll, the demo button renders the cards, and the consent → save → reload → "Glöm token" flow works.
- "Visa demodata" produces deterministic fake data that is never persisted. Use it for UI work that doesn't need the API.
