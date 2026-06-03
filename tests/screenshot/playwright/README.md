# Playwright screenshot tests

Visual regression with [Playwright](https://playwright.dev/) `toHaveScreenshot`, alongside WDIO (`npm run test-ss`). Scenarios live in `../apps/components/`; at test time Playwright only serves `../dist/` and picks cases via URL (`component` + `testId`), not by reading `.js` files on disk.

## Layout

```
tests/screenshot/
  apps/components/        ← scenario source (shared with WDIO)
  images/, videos/
  dist/                   ← buildApps('screenshot') (shared)
  specs/                  ← WDIO *-specs.js
  playwright/             ← this folder
    specs/neutral|light/  *-spec.js shards
    utils/                registerScreenshotTests, limestone-page, screenshot-name
    snapshots/            PNG baselines: <Component>/<TestName>/<case>.png (same layout as WDIO reference/)
    benchmark.mjs
  scripts/                run-playwright-component, run-component-wdio (npm shortcuts)
    global-setup.js       build, .test-data.json, serve :4568 (default)
    playwright.config.mjs
    paths.js
```

| | WDIO | Playwright |
|--|------|------------|
| Scenarios / build | `../apps/`, `../dist/` | Same |
| Static server port | **4567** | **4568** (default) |
| Specs | `../specs/*-specs.js` | `specs/*-spec.js` |
| Assertions / baselines | `dist/screenshots/reference/` | `playwright/snapshots/` (same `<Component>/<TestName>/` paths) |

## How a scenario runs (e.g. Chip, testId 3)

```
Chip.js → LimestoneComponents / testMetadata → buildApps → ../dist/
  → global-setup ?request → .test-data.json
  → registerScreenshotTests → GET …?component=Chip&testId=3&skin=…
  → prepareTest in bundle → toHaveScreenshot
```

## Setup

```bash
npm install
npm run prepare-playwright
```

Uses `@enact/ui-test-utils@^4.0.2` from npm (same as `test-ss`).

## Commands

Run from the **repository root**:

| Command | Description |
|---------|-------------|
| `npm run test-playwright` | Full suite (27 shards) |
| `npm run test-playwright:update` | Update all baselines |
| `npm run test-playwright:report` | HTML report |
| `npm run test-playwright:component -- Sprite` | One component, all cases (e.g. Sprite ≈ 4, Spinner ≈ 6, Button ≈ 205) |
| `npm run test-playwright:component -- Sprite --test-id 0` | Single case by index |
| `npm run test-playwright:component -- Sprite --update` | Refresh baselines |
| `npm run test-ss:component -- Sprite` | WDIO, same component (Default shard) |
| `npm run benchmark-screenshots -- Chip` | Playwright vs WDIO timing (`--build` to rebuild dist) |

Without baselines, add `--update` once.

## Benchmark (local)

Compare end-to-end runtime for one component (Default shard, `instances` / `workers` = 1, existing `tests/screenshot/dist`):

```bash
npm run benchmark-screenshots -- Chip
# optional: PLAYWRIGHT_SKIP_BUILD=1 if dist is already built
```

Both runners filter a single component name (WDIO uses `--component ^Name$` so `Chip` does not include `Chips`).

| Component | Cases | Playwright | WebdriverIO | Faster |
|-----------|------:|-----------:|--------------:|--------|
| Sprite | 4 | 16.7 s | 18.0 s | Playwright (~8%) |
| Chip | 51 | 99.2 s | 84.6 s | WDIO (~15%) |

Measured on Windows (Chrome 132), June 2026; times include browser startup and screenshot compare. Chip ≈ 1.9 s/test (Playwright) vs ≈ 1.7 s/test (WDIO). Full suite (`Button` ≈ 205 cases) is much slower — use component scripts for day-to-day runs.

**View results:** Playwright — `npm run test-playwright:report` and `snapshots/<Component>/Limestone/`. WDIO — `tests/screenshot/dist/newFiles.html` / `failedTests.html` and `dist/screenshots/reference/`.

**Parallel with WDIO:** default ports differ (WDIO **4567**, Playwright **4568**), both serve `../dist/`. Override with `PLAYWRIGHT_BASE_URL` if needed.

## Maintenance

- **New/changed UI case:** edit `../apps/components/<Name>.js`; register in `../apps/LimestoneComponents.js` if new; run tests (build unless `PLAYWRIGHT_SKIP_BUILD=1`); `--update` for PNGs.
- **New WDIO shard:** add matching `specs/**/<Name>-spec.js` with same `skin`, `highContrast`, `concurrency` as `../specs/`. Shards split by `testId % workers` (`Default` … `Default9`, `HighContrast*`, `Light*`).

## Environment variables

| Variable | Effect |
|----------|--------|
| `PLAYWRIGHT_SKIP_BUILD=1` | Skip `buildApps('screenshot')` |
| `PLAYWRIGHT_REFRESH_TEST_DATA=1` | Regenerate `.test-data.json` |
| `PLAYWRIGHT_COMPONENT` | One component (set by `../scripts/run-playwright-component.mjs`) |
| `PLAYWRIGHT_TEST_ID` / `PLAYWRIGHT_TITLE` | Filter cases (or `--test-id` / `--title` on npm script) |
| `PLAYWRIGHT_INSTANCES` / `PLAYWRIGHT_WORKERS` | Shard index / parallelism |
| `PLAYWRIGHT_BASE_URL` | Playwright static server (default `http://localhost:4568`) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WebServer timeout | Build `../dist/` (unset `PLAYWRIGHT_SKIP_BUILD` or `npm run test-ss`) |
| Snapshot does not exist | `--update` |
| No tests found | Check `PLAYWRIGHT_COMPONENT`; refresh `.test-data.json` |
| Missing images/videos on build | Use `../images/`, `../videos/` |
| Port in use | Change `PLAYWRIGHT_BASE_URL` (port in URL must match `webServer`) |

CI: `build-scripts/enact-playwright-tests.sh`.
