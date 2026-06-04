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
    global-setup.js       build, .test-data.json, serve :4568 if needed
    global-teardown.js    stops serve only when global-setup started it
    playwright.config.mjs
    paths.js
```

| | WDIO | Playwright |
|--|------|------------|
| Scenarios / build | `../apps/`, `../dist/` | Same |
| Static server port | **4567** | **4568** (default) |
| Specs | `../specs/*-specs.js` | `specs/*-spec.js` |
| Assertions / baselines | `dist/screenshots/reference/` | `playwright/snapshots/` (same `<Component>/<TestName>/` paths) |

## How a component reaches Playwright (e.g. Chip, testId 3)

Playwright never opens `apps/components/Chip.js` at test time. That file is **source** for the screenshot app; the runner only serves the **built** bundle under `../dist/` and drives cases by URL query (`component` + `testId`).

### 1. Author scenarios in `apps/components/`

`Chip.js` exports an array of JSX cases (order = `testId`):

```js
const ChipTests = [
  <Chip>Default Chip</Chip>,           // testId 0
  <Chip icon="home">…</Chip>,          // testId 1
  …
  <Chip icon="checkmark">Chip with checkmark Icon</Chip>,  // testId 3
  …
];
export default ChipTests;
```

`withConfig({…}, […])` expands into more entries (focus, `largeText`, etc.), so Chip ends up with ~51 cases — same list WDIO uses.

### 2. Register the component

`apps/LimestoneComponents.js` imports `Chip` from `./components/Chip` and puts it in the `components` map. For each key it runs `generateTestData` (`@enact/ui-test-utils`) to build `testMetadata[Chip]`: one `{title, …}` per array index (titles come from props/children when the JSX has no explicit `title`).

### 3. Build into `../dist/`

`global-setup` (unless `PLAYWRIGHT_SKIP_BUILD=1`) calls `buildApps('screenshot')` from `@enact/ui-test-utils/build-apps`. That packs `Limestone-View` (entry `screenshot/index.js`) into `dist/Limestone-View/`. The bundle includes **all** registered components and `testMetadata` from step 2. Assets from `../images/` and `../videos/` are copied as part of the same build WDIO uses.

### 4. Cache case list for the runner

On first run (or when dist is newer than the cache), `global-setup` opens:

`http://localhost:4568/Limestone-View/?request`

With `?request`, the app sets `window.__TEST_DATA = testMetadata` and does not render a case. Playwright writes that JSON to `playwright/.test-data.json`, e.g.:

```json
{ "Chip": [ { "title": "…" }, { "title": "…" }, … ] }
```

`registerScreenshotTests` reads this file to know **which** `(component, testId, title)` pairs exist — it does not parse `Chip.js` again.

### 5. Playwright spec → one test per case

`specs/neutral/Default-spec.js` calls `registerScreenshotTests({ testName: 'Limestone', skin: 'neutral', … })`. That loops `.test-data.json` and, for each included case, registers a Playwright test.

For **Chip, testId 3** on the Default shard (`concurrency: 1`, `PLAYWRIGHT_INSTANCES=5` → only ids where `testId % 5 === 0` on that shard; component runs use `PLAYWRIGHT_INSTANCES=1` so **all** Chip ids run):

| Filter | Example |
|--------|---------|
| Shard | `testId % PLAYWRIGHT_INSTANCES === concurrency - 1` |
| Component | `PLAYWRIGHT_COMPONENT=Chip` (from `run-playwright-component.mjs`) |
| Single case | `PLAYWRIGHT_TEST_ID=3` |

Playwright test title: `Chip~/Limestone~/<case title>~/3`.

### 6. Open the case in the browser

`openComponent` navigates to the built app (base URL port **4568**):

`/Limestone-View/?locale=en-US&component=Chip&testId=3&skin=neutral&highContrast=false`

`Limestone-View` calls `prepareTest('Chip', 3)`, clones `components.Chip[3]` from the bundle, applies theme/skin from query + per-case metadata, and renders `[data-ui-test-id="test"]`.

### 7. Screenshot baseline

`toHaveScreenshot` uses `getScreenshotName('Chip', 'Limestone', <case title>)` →  
`snapshots/Chip/Limestone/<sanitized-title>.png` (same path layout as WDIO `dist/screenshots/reference/`).

```text
apps/components/Chip.js
  → LimestoneComponents.js (import + generateTestData)
  → buildApps → tests/screenshot/dist/Limestone-View/
  → global-setup ?request → .test-data.json
  → Default-spec.js → registerScreenshotTests
  → page: ?component=Chip&testId=3&skin=neutral&…
  → prepareTest(Chip, 3) in bundle → toHaveScreenshot
```

**Quick run for that one case:**

```bash
npm run test-playwright:component -- Chip --test-id 3
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
| `npm run test-playwright` | Full suite — all components, 27 shards (neutral/light, Default/HighContrast) |
| `npm run test-playwright:update` | Update all baselines |
| `npm run test-playwright:report` | HTML report |
| `npm run test-playwright:component -- Sprite` | One component, all cases (e.g. Sprite ≈ 4, Spinner ≈ 6, Button ≈ 205) |
| `npm run test-playwright:component -- Sprite --test-id 0` | Single case by index |
| `npm run test-playwright:component -- Sprite --update` | Refresh baselines |
| `npm run test-ss:component -- Sprite` | WDIO, same component (Default shard) |
| `npm run benchmark-screenshots -- Chip` | Playwright vs WDIO timing (`--build` to rebuild dist) |
| `npm run benchmark-screenshots -- Chip --parallel 5` | Same, up to 5 cases at a time per runner |

Without baselines, add `--update` once.

## Full suite (all components)

Runs every registered component across all Playwright shards (`specs/neutral`, `specs/light`). Expect a long run (thousands of screenshots).

```bash
npm install
npm run prepare-playwright

# First time or after UI / scenario changes — creates/updates all baselines
npm run test-playwright:update

# Verify against baselines (reuses dist build when possible)
$env:PLAYWRIGHT_SKIP_BUILD='1'   # PowerShell; omit on first run
npm run test-playwright

# Browse results (list, timings, failures with diffs)
npm run test-playwright:report
```

| Step | Output |
|------|--------|
| `--update` | `playwright/snapshots/<Component>/Limestone/*.png` |
| test run | Terminal summary; failures in `playwright/test-results/` |
| `:report` | `playwright/reports/html/index.html` |

Optional: more workers locally — `$env:PLAYWRIGHT_WORKERS='8'; npm run test-playwright` (default **5**).

**Subset of shards** (same as Jenkins `SPEC` / TV):

| `PLAYWRIGHT_SPEC` | Runs |
|-------------------|------|
| *(unset)* | All `*-spec.js` files (27 shards) |
| `Default` | `Default-spec.js` … `Default9-spec.js` |
| `HighContrast` | `HighContrast-spec.js` … `HighContrast9-spec.js` |
| `Light` | `Light-spec.js` … `Light9-spec.js` |
| `Default-spec` | Only `specs/neutral/Default-spec.js` (TV-style single shard) |

```powershell
$env:PLAYWRIGHT_SPEC='Default'
npm run test-playwright
```

## Benchmark (local)

Compare end-to-end runtime for one component (Default shard, all cases, existing `tests/screenshot/dist`):

```bash
npm run benchmark-screenshots -- Chip
npm run benchmark-screenshots -- Chip --parallel 5   # faster: 5 workers / 5 WDIO browsers
# optional: --build to rebuild dist; PLAYWRIGHT_SKIP_BUILD=1 when dist exists
```

**Parallelism:** `--parallel N` (default `1`) runs every case for the component, but up to `N` at once. Playwright uses `PLAYWRIGHT_INSTANCES=1` (no shard filter) and `PLAYWRIGHT_WORKERS=N`. WDIO uses `--instances 1` (all cases) and `--parallel N` for `wdio:maxInstances` (requires `@enact/ui-test-utils` with `--parallel` support).

Both runners filter a single component name (WDIO uses `--component ^Name$` so `Chip` does not include `Chips`). Benchmark still runs Playwright then WDIO sequentially; ports **4568** / **4567** stay separate.

| Component | Cases | Parallel | Playwright | WebdriverIO | Faster |
|-----------|------:|---------:|-----------:|--------------:|--------|
| Sprite | 4 | 1 | 16.7 s | 18.0 s | Playwright (~8%) |
| Chip | 51 | 1 | 99.2 s | 84.6 s | WDIO (~15%) |
| Chip | 51 | 5 | 58.9 s | 154.8 s | Playwright (~62%) |

Measured on Windows (Chrome 132), June 2026; times include browser startup and screenshot compare. Benchmark runs Playwright then WDIO (not at the same time).

**Sequential (`--parallel 1`, default):** Chip ≈ 1.9 s/test (Playwright) vs ≈ 1.7 s/test (WDIO).

**Parallel 5 (`--parallel 5`):** Chip ≈ 1.2 s/test (Playwright) vs ≈ 3.0 s/test (WDIO). Playwright wall time drops (~41%); WDIO can be slower on one machine with many Chrome sessions (visual compare + resource contention) — CI uses sharded jobs plus `--parallel` instead of one large component run.

Full suite (`Button` ≈ 205 cases) is much slower — use component scripts for day-to-day runs.

**View results:** Playwright — `npm run test-playwright:report` and `snapshots/<Component>/Limestone/`. WDIO — `tests/screenshot/dist/newFiles.html` / `failedTests.html` and `dist/screenshots/reference/`.

**Parallel with WDIO:** default ports differ (WDIO **4567**, Playwright **4568**), both serve `../dist/`. Override with `PLAYWRIGHT_BASE_URL` if needed. `webServer` in config also uses `reuseExistingServer`; if `global-setup` had to start `serve`, `global-teardown` stops that process after the run.

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
| `PLAYWRIGHT_SPEC` | Limit spec files (`Default`, `Light`, `Default-spec`, …) — see [Full suite](#full-suite-all-components) |
| `PLAYWRIGHT_BASE_URL` | Playwright static server (default `http://localhost:4568`) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WebServer timeout | Build `../dist/` (unset `PLAYWRIGHT_SKIP_BUILD` or `npm run test-ss`) |
| Snapshot does not exist | `--update` |
| No tests found | Check `PLAYWRIGHT_COMPONENT` / `PLAYWRIGHT_SPEC`; refresh `.test-data.json` |
| Missing images/videos on build | Use `../images/`, `../videos/` |
| Port in use | Change `PLAYWRIGHT_BASE_URL` (port in URL must match `webServer`) |

**CI (planned):** Jenkins job `enact-playwright-tests` via `build-scripts/enact-playwright-tests.sh` — sets `PLAYWRIGHT_SPEC` (`Default-spec` on TV, or `SPEC` shard group), `PLAYWRIGHT_COMPONENT`, `PLAYWRIGHT_WORKERS`. Uploads `playwright/` to Nebula: `reports/html`, `snapshots/`, `test-results/`.
