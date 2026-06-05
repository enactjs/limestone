# Playwright screenshot tests — developer guide

Visual regression for Limestone using [Playwright](https://playwright.dev/) `toHaveScreenshot`. This runs **alongside** the existing WebdriverIO suite (`npm run test-ss`). Both share the same scenario source, build output, and case indices — only the runner, port, spec files, and baseline folder differ.

---

## Quick start

From the **repository root**:

```bash
npm install
npm run prepare-playwright          # installs Chrome for Playwright (once per machine)

# First time for a component — create PNG baselines (use parallel 1 for stability)
npm run test-playwright:component -- Sprite --update

# Verify screenshots against baselines
npm run test-playwright:component -- Sprite

# Compare Playwright vs WDIO runtime on one component
npm run benchmark-screenshots -- Chip
```

**Day-to-day:** prefer `test-playwright:component` over the full suite. Button alone has **205** cases; the full suite has **thousands** of screenshots across 27 shards.

---

## How it fits with WDIO

| | WebdriverIO | Playwright |
|--|-------------|------------|
| Scenario source | `tests/screenshot/apps/components/*.js` | Same |
| Build output | `tests/screenshot/dist/` via `buildApps('screenshot')` | Same |
| Static server | port **4567** | port **4568** (default) |
| Spec files | `tests/screenshot/specs/**/*-specs.js` | `tests/screenshot/playwright/specs/**/*-spec.js` |
| Baselines | `dist/screenshots/reference/` | `playwright/snapshots/` |
| Compare API | `@wdio/visual-service` | `expect(page).toHaveScreenshot()` |

Playwright does **not** read `apps/components/*.js` at test time. It serves the **built** app from `dist/` and selects cases with URL query parameters (`component`, `testId`, `skin`, …).

---

## Repository layout

```
tests/screenshot/
  apps/
    components/           ← scenario JSX (shared with WDIO)
    LimestoneComponents.js
    Limestone-View.js
  images/, videos/
  dist/                   ← buildApps('screenshot') output (shared)
  specs/                  ← WDIO *-specs.js
  scripts/
    run-playwright-component.mjs
    run-component-wdio.mjs
  playwright/             ← this folder
    specs/neutral|light/  *-spec.js (27 shards)
    utils/                registerScreenshotTests, limestone-page, screenshot-name
    snapshots/            PNG baselines
    global-setup.js       build, .test-data.json, serve :4568 if needed
    global-teardown.js    stops serve when global-setup started it
    playwright.config.mjs
    paths.js
    benchmark.mjs
```

---

## How a component reaches Playwright (example: Chip, testId 3)

### 1. Author scenarios — `apps/components/Chip.js`

Each exported array entry is one case; **array index = `testId`**:

```js
const ChipTests = [
  <Chip>Default Chip</Chip>,                              // testId 0
  <Chip icon="home">Chip with Icon</Chip>,                // testId 1
  <Chip icon="checkmark">Chip with checkmark Icon</Chip>, // testId 3
  …
];
export default ChipTests;
```

`withConfig({ focus: true }, […])` and `withConfig({ skinVariants: ['largeText'] }, […])` append more cases. Chip has **51** cases total (same as WDIO).

### 2. Register — `apps/LimestoneComponents.js`

`Chip` is imported into the `components` map. `generateTestData()` (`@enact/ui-test-utils`) produces `testMetadata.Chip`: one `{ title, … }` per index (titles are derived from JSX props when no explicit `title` is set).

### 3. Build — `buildApps('screenshot')`

Triggered from `global-setup.js` unless `PLAYWRIGHT_SKIP_BUILD=1`. Packs `Limestone-View` into `dist/Limestone-View/`. The bundle contains all components and metadata. WDIO uses the same build.

### 4. Case index — `.test-data.json`

`global-setup` loads `http://localhost:4568/Limestone-View/?request`. That sets `window.__TEST_DATA = testMetadata` without rendering a case. The JSON is cached at `playwright/.test-data.json`.

`registerScreenshotTests()` reads this file to register Playwright tests — it never parses `Chip.js` on disk.

### 5. Spec shard — `specs/neutral/Default-spec.js`

```js
registerScreenshotTests({
  testName: 'Limestone',
  skin: 'neutral',
  highContrast: false,
  concurrency: 1   // shard 1 of N (see sharding below)
});
```

### 6. Browser URL

```
/Limestone-View/?locale=en-US&component=Chip&testId=3&skin=neutral&highContrast=false
```

`Limestone-View` → `prepareTest('Chip', 3)` → renders `[data-ui-test-id="test"]`.

### 7. Screenshot

`toHaveScreenshot(getScreenshotName('Chip', 'Limestone', <title>))` writes/compares under `playwright/snapshots/` (filename encodes component, test name, and case title — same naming rules as WDIO reference PNGs).

**One case only:**

```bash
npm run test-playwright:component -- Chip --test-id 3
```

---

## Setup (detailed)

### Prerequisites

- Node.js + npm (same as the rest of Limestone)
- Chrome (Playwright uses `channel: 'chrome'` from `playwright.config.mjs`)
- `@enact/ui-test-utils@^4.0.2` (declared in root `package.json`, same as `test-ss`)

### Install

```bash
npm install
npm run prepare-playwright
```

`prepare-playwright` runs `playwright install chrome`. It is **not** hooked to `postinstall` — run it once per machine (CI runs it via `build-scripts/enact-playwright-tests.sh`).

### Build screenshot dist

The first Playwright run builds `tests/screenshot/dist/` automatically. To reuse an existing build:

```powershell
$env:PLAYWRIGHT_SKIP_BUILD='1'   # PowerShell
# export PLAYWRIGHT_SKIP_BUILD=1  # bash
```

Or build via WDIO / `buildApps` before running Playwright.

### Baselines

Playwright needs PNG baselines under `playwright/snapshots/`. Without them, tests fail with “snapshot doesn't exist”.

```bash
# One component (recommended)
npm run test-playwright:component -- Sprite --update

# Entire suite (long — thousands of PNGs)
npm run test-playwright:update
```

**Tip:** use `--parallel 1` when running `--update` on components with **focus** cases (Chip, Button). Parallel updates can produce slightly different focus pixels and cause flaky compares on later parallel runs.

---

## Running tests

All commands run from the **repository root**.

### Command reference

| Command | What it does |
|---------|----------------|
| `npm run test-playwright` | Full suite — all components, all Playwright shards |
| `npm run test-playwright:update` | Update all Playwright baselines |
| `npm run test-playwright:report` | Open HTML report (`playwright/reports/html/`) |
| `npm run test-playwright:component -- <Name>` | One component, all its cases (Default neutral shard) |
| `npm run test-playwright:component -- <Name> --update` | Refresh baselines for that component |
| `npm run test-playwright:component -- <Name> --test-id <n>` | Single case by index |
| `npm run test-playwright:component -- <Name> --parallel <n>` | Same cases, `n` Playwright workers |
| `npm run test-ss:component -- <Name>` | WDIO equivalent (for comparison) |
| `npm run benchmark-screenshots -- <Name>` | Time Playwright then WDIO for one component |

### Single component (recommended)

```bash
# Verify (skip rebuild if dist exists)
PLAYWRIGHT_SKIP_BUILD=1 npm run test-playwright:component -- Button

# Faster local run
PLAYWRIGHT_SKIP_BUILD=1 npm run test-playwright:component -- Button --parallel 5

# Filter by title regex
npm run test-playwright:component -- Button --title "Focused"
```

Component script sets `PLAYWRIGHT_INSTANCES=1` (all `testId`s for that component) and `PLAYWRIGHT_WORKERS` from `--parallel` (default **1**).

### Full suite

Runs every registered component across **27** spec shards (`Default`…`Default9`, `HighContrast*`, `Light*` under `specs/neutral` and `specs/light`).

```bash
npm install && npm run prepare-playwright

# First time or after UI changes
npm run test-playwright:update

# Verify
PLAYWRIGHT_SKIP_BUILD=1 npm run test-playwright

# HTML report
npm run test-playwright:report
```

**Parallelism in full suite:** `playwright.config.mjs` defaults to **5 workers** (`PLAYWRIGHT_WORKERS`). Shards split cases by `testId % PLAYWRIGHT_INSTANCES` (default instances **5**).

**Limit shards** (same idea as Jenkins `SPEC`):

| `PLAYWRIGHT_SPEC` | Runs |
|-------------------|------|
| *(unset)* | All `*-spec.js` files |
| `Default` | `Default-spec.js` … `Default9-spec.js` |
| `HighContrast` | `HighContrast-spec.js` … `HighContrast9-spec.js` |
| `Light` | `Light-spec.js` … `Light9-spec.js` |
| `Default-spec` | Only `specs/neutral/Default-spec.js` (TV-style) |

```powershell
$env:PLAYWRIGHT_SPEC='Default'
$env:PLAYWRIGHT_SKIP_BUILD='1'
npm run test-playwright
```

### Sharding vs workers

| Concept | Env / flag | Meaning |
|---------|------------|---------|
| **Shard** | `concurrency` in spec + `PLAYWRIGHT_INSTANCES` | Which `testId`s this spec file owns (`testId % instances === concurrency - 1`) |
| **Workers** | `PLAYWRIGHT_WORKERS` or `--parallel` on component script | How many tests run at once in one Playwright process |
| **Component filter** | `PLAYWRIGHT_COMPONENT` | Only one component's cases |

Full suite: many spec files × 5 workers each. Component run: one spec file, all cases, N workers.

---

## Viewing results

| Output | Location |
|--------|----------|
| Playwright HTML report | `npm run test-playwright:report` → `playwright/reports/html/index.html` |
| Playwright baselines | `playwright/snapshots/` |
| Playwright failures | `playwright/test-results/` (actual, diff, error-context) |
| WDIO failures | `tests/screenshot/dist/failedTests.html`, `newFiles.html` |
| WDIO baselines | `tests/screenshot/dist/screenshots/reference/` |

---

## Benchmarking

Compare end-to-end runtime for **one component** (Playwright first, then WDIO, same `dist/`):

```bash
npm run benchmark-screenshots -- Sprite
npm run benchmark-screenshots -- Chip --parallel 5
npm run benchmark-screenshots -- Button --parallel 5

# Rebuild dist first if missing
npm run benchmark-screenshots -- Chip --build
```

- **`--parallel N`** (default `1`): every case for the component, up to `N` at once.
- Playwright: `PLAYWRIGHT_INSTANCES=1`, `PLAYWRIGHT_WORKERS=N`.
- WDIO: `--instances 1` (all cases), `--parallel N` (requires `@enact/ui-test-utils` with `--parallel` support).
- Ports stay separate: Playwright **4568**, WDIO **4567**.

Benchmark requires **existing baselines** for both runners (Playwright `snapshots/`, WDIO `dist/screenshots/reference/`). Create Playwright baselines with `--update` before benchmarking.

---

## Performance analysis

Measured **locally on Windows, Chrome 132, June 2026**. Times include browser startup, page load, and screenshot compare. `PLAYWRIGHT_SKIP_BUILD=1` (reused `tests/screenshot/dist`).

### Results

| Component | Cases | Parallel | Playwright | WebdriverIO | Faster | PW s/case | WDIO s/case |
|-----------|------:|---------:|-----------:|--------------:|--------|----------:|------------:|
| Sprite | 4 | 1 | 16.2 s | 19.7 s | Playwright (~18%) | 4.1 | 4.9 |
| Sprite | 4 | 5 | 15.7 s | 17.9 s | Playwright (~12%) | 3.9 | 4.5 |
| Chip | 51 | 1 | 103.8 s | 83.9 s | WDIO (~19%) | 2.0 | 1.6 |
| Chip | 51 | 5 | 50.2 s † | 137.7 s | Playwright (~64%) | 1.0 | 2.7 |
| Button | 205 | 1 | 525.4 s | 1427.2 s | Playwright (~63%) | 2.6 | 7.0 |
| Button | 205 | 5 | 111.4 s † | 979.3 s | Playwright (~89%) | 0.5 | 4.8 |

† Parallel Playwright runs can **flake on focus cases** (spotlight timing). Wall time is still representative; use `--parallel 1` for `--update` on focus-heavy components, or re-run failed ids with `--test-id`.

### Takeaways

1. **Small components (Sprite):** similar cost; Playwright slightly faster even at parallel 1.
2. **Medium (Chip), sequential:** WDIO is ~15–20% faster per case — one browser, mature visual-service path.
3. **Medium/large, parallel 5:** Playwright scales much better — shared server, lighter workers. Chip ~2× faster wall time; Button ~9× faster wall time vs WDIO parallel 5.
4. **Large (Button), sequential:** Playwright ~2.6 s/case vs WDIO ~7.0 s/case — WDIO session overhead dominates at 205 cases.
5. **Full suite:** not benchmarked here; use **component scripts** for daily work. CI should shard by `PLAYWRIGHT_SPEC` / `PLAYWRIGHT_INSTANCES` and set `PLAYWRIGHT_WORKERS` per agent (see `build-scripts/enact-playwright-tests.sh`).

### Making Playwright faster locally

```powershell
$env:PLAYWRIGHT_SKIP_BUILD='1'
$env:PLAYWRIGHT_WORKERS='8'    # full suite only; component uses --parallel
npm run test-playwright:component -- Button --parallel 8
```

Diminishing returns appear when too many Chrome instances contend for CPU/RAM (WDIO shows this clearly at `--parallel 5` on one machine).

---

## Environment variables

| Variable | Effect |
|----------|--------|
| `PLAYWRIGHT_SKIP_BUILD=1` | Skip `buildApps('screenshot')` in global-setup |
| `PLAYWRIGHT_REFRESH_TEST_DATA=1` | Force-regenerate `.test-data.json` |
| `PLAYWRIGHT_COMPONENT` | Filter to one component (set by `run-playwright-component.mjs`) |
| `PLAYWRIGHT_TEST_ID` | Filter to one case index |
| `PLAYWRIGHT_TITLE` | Filter cases by title regex |
| `PLAYWRIGHT_INSTANCES` | Shard divisor (`testId % instances`); component script sets `1` |
| `PLAYWRIGHT_WORKERS` | Parallel workers in `playwright.config.mjs` (default **5**) |
| `PLAYWRIGHT_SPEC` | Limit which `*-spec.js` files run |
| `PLAYWRIGHT_BASE_URL` | Static server URL (default `http://localhost:4568`) |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WebServer / server timeout | Build `tests/screenshot/dist/` (unset `PLAYWRIGHT_SKIP_BUILD`) |
| Snapshot does not exist | `npm run test-playwright:component -- <Name> --update` |
| Snapshot diff on focus cases in parallel | Re-baseline with `--parallel 1`, or run failing `--test-id` alone |
| No tests found | Check `PLAYWRIGHT_COMPONENT`, `PLAYWRIGHT_SPEC`; delete stale `.test-data.json` or set `PLAYWRIGHT_REFRESH_TEST_DATA=1` |
| Missing images on build | Place assets under `tests/screenshot/images/`, `videos/` |
| Port already in use | Set `PLAYWRIGHT_BASE_URL` to another port (must match `webServer` in config) |
| `build-apps` import error | Requires `@enact/ui-test-utils` with export `./build-apps` (local link or published version) |
| WDIO `--parallel` ignored | Update `@enact/ui-test-utils` (see ui-test-utils PR for `--parallel` CLI) |

---

## CI (planned)

Jenkins job via `build-scripts/enact-playwright-tests.sh`:

1. `npm run prepare-playwright`
2. Optionally seed `playwright/snapshots/` from Nebula reference
3. `npm run test-playwright` with `PLAYWRIGHT_SPEC`, `PLAYWRIGHT_WORKERS`, `PLAYWRIGHT_COMPONENT`
4. Upload `playwright/reports/html`, `snapshots/`, `test-results/`

On TV: typically `PLAYWRIGHT_SPEC=Default-spec` (single shard).

---

## Maintenance

### New or changed UI case

1. Edit `tests/screenshot/apps/components/<Name>.js`
2. Register in `tests/screenshot/apps/LimestoneComponents.js` if new component
3. Run tests (build runs unless `PLAYWRIGHT_SKIP_BUILD=1`)
4. `npm run test-playwright:component -- <Name> --update` for new PNGs

### New WDIO shard

Add matching `playwright/specs/**/<Name>-spec.js` with the same `skin`, `highContrast`, and `concurrency` as the WDIO `*-specs.js` file.

---

## Related npm scripts (root `package.json`)

```json
"test-playwright": "playwright test --config tests/screenshot/playwright/playwright.config.mjs",
"test-playwright:update": "... --update-snapshots",
"test-playwright:report": "playwright show-report tests/screenshot/playwright/reports/html",
"test-playwright:component": "node tests/screenshot/scripts/run-playwright-component.mjs",
"prepare-playwright": "playwright install chrome",
"benchmark-screenshots": "node tests/screenshot/playwright/benchmark.mjs"
```
