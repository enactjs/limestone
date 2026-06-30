# Playwright screenshot tests — developer guide

Visual regression for Limestone using [Playwright](https://playwright.dev/) `toHaveScreenshot`. This runs **alongside** the existing WebdriverIO suite (`npm run test-ss`). Both share the same scenario source, build output, and case indices — only the runner, port, spec files, and baseline folder differ.

---

## Quick start

From the **repository root**:

```bash
npm install
npm run bootstrap                       # enact CLI — required for the screenshot build
npm link @enact/ui-test-utils           # see “Link local ui-test-utils” below until npm publishes ./build-apps
npm run prepare-playwright              # optional if Chrome is already available (see below)

# First time for a component — baselines are created automatically on pass
npm run test-playwright:component -- Sprite

# Force refresh baselines after UI changes
npm run test-playwright:component -- Sprite --update

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
| Viewport | 1920×**1167** (WDIO window) | 1920×**1080** (FHD) |
| Page ready | `body` visible + 200 ms + fonts | Same (`limestone-page.js`) |
| Compare tolerance | `ignoreAntialiasing: true` | `threshold: 0.2` (Playwright equivalent) |

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
    run-playwright.mjs      full suite + component (same entry; mode from argv)
    parse-cli-args.mjs      shared CLI parsing
    ensure-screenshot-dist.mjs
    spawn-playwright.mjs
    run-component-wdio.mjs
  playwright/             ← this folder
    specs/neutral|light/  *-spec.js (27 shards)
    utils/                registerScreenshotTests, limestone-page, screenshot-name, shard-registry
    snapshots/            PNG baselines (gitignored — generate with --update)
    .shard-registry.jsonl run-time shard log (gitignored; see shard-registry.js)
    global-setup.js       build, dist check, .test-data.json (serve :4568 only while fetching)
    global-teardown.js    shard coverage check
    playwright.config.mjs
    paths.js              SCREENSHOT_VIEW, SCREENSHOT_HEALTH_URL, assertScreenshotDist()
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

When `.test-data.json` is missing or older than `dist/Limestone-View/index.html`, `global-setup` briefly starts `serve` on port **4568**, loads `…/Limestone-View/?request` (waits for `window.__TEST_DATA`), writes `playwright/.test-data.json`, then stops that server so Playwright’s `webServer` can bind the same port. Cached runs with `--skip-build` skip the fetch entirely.

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

`Limestone-View` → `prepareTest('Chip', 3)` → renders the case under `[data-ui-test-id="test"]` (see **Page ready** below — Playwright does not wait for that node to be visible).

### 7. Page ready — `utils/limestone-page.js`

Matches WDIO `Page.open`: navigate, **200 ms** settle, then wait for fonts (capped at **10 s**). Playwright does **not** wait for `body` or `[data-ui-test-id="test"]` to be visible — Enact often leaves `body` non-visible to Playwright while the app is ready; popup content (e.g. Input `open`) lives in `FloatingLayer`.

### 8. Screenshot

`toHaveScreenshot(getScreenshotPathSegments('Chip', 'Limestone', <title>))` writes/compares under `playwright/snapshots/<Component>/<TestName>/<case>.png` — same folder layout as WDIO `dist/screenshots/reference/`.

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
npm run bootstrap
npm run prepare-playwright   # optional on machines that already have Chrome (see below)
```

`prepare-playwright` runs `playwright install chrome`. It is **not** hooked to `postinstall`. Use it on **local machines** without system Chrome.

**Jenkins / CI** (`build-scripts/enact-playwright-tests.sh`) uses system Chrome from `installChrome` (same as WDIO) and skips `playwright install` to avoid broken apt GPG keys on agents. CI sets `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`.

`global-setup.js` and `ensure-screenshot-dist.mjs` call `assertScreenshotDist()` from `paths.js` when a build is needed. If `tests/screenshot/dist/Limestone-View/index.html` is missing, the run fails immediately with a clear error (not a webServer timeout).

### Build screenshot dist

The first Playwright run builds `tests/screenshot/dist/` automatically. To reuse an existing build, pass `--skip-build`:

```bash
npm run test-playwright -- --skip-build
npm run test-playwright:component -- Button --skip-build
```

Or set `PLAYWRIGHT_SKIP_BUILD=1` (same effect as `--skip-build`).

### Link local `@enact/ui-test-utils` (until `./build-apps` is published)

Playwright `global-setup.js` imports `@enact/ui-test-utils/build-apps`. The npm release **4.0.2** does not export that path yet; the local `ui-test-utils` repo does (see `exports["./build-apps"]` in its `package.json`). Until a new version is published, link the local package:

```bash
# From your ui-test-utils clone (must include "./build-apps": "./src/build-apps.js" in exports)
cd ../ui-test-utils
npm install
npm link

# From limestone repo root
cd ../limestone
npm link @enact/ui-test-utils
npm install   # refresh lockfile/node_modules if needed
```

Alternative without global link — in limestone root `package.json`:

```json
"@enact/ui-test-utils": "file:../ui-test-utils"
```

Then `npm install` from limestone root.

To undo `npm link`:

```bash
cd limestone
npm unlink @enact/ui-test-utils
npm install
```

When `@enact/ui-test-utils` is published with the `./build-apps` export, remove the link and use the registry version from `package.json` again.

### Baselines

Missing PNG baselines under `playwright/snapshots/` are **created automatically** on the first run (same idea as WDIO `autoSaveBaseline`). Use `--update` to **force** overwriting existing baselines.

```bash
# First run — baselines are written as tests pass
npm run test-playwright:component -- Sprite

# Force refresh all baselines for one component
npm run test-playwright:component -- Sprite --update

# Force refresh entire suite
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
| `npm run test-playwright -- --component Button` | All specs; components whose name contains `Button` |
| `npm run test-playwright -- --spec Light` | `Light*` specs only; all components |
| `npm run test-playwright -- --component Button --spec Light` | Both filters combined |
| `npm run test-playwright -- --title "Focused"` | Filter cases by title (regex per term; case-insensitive fallback) |
| `npm run test-playwright -- --title Button Focused` | Shorthand: `Button` → `--component`, `Focused` → `--title` |
| `npm run test-playwright -- --test-id <n>` | Single case index (invalid values fail fast) |
| `npm run test-playwright -- --skip-build` | Skip `buildApps('screenshot')` when `dist/` already exists |
| `npm run test-playwright:update` | Force-update all Playwright baselines (`--update`) |
| `npm run test-playwright:report` | Open HTML report (`playwright/reports/html/`) |
| `npm run test-playwright:component -- <Name>` | One component, all spec shards |
| `npm run test-playwright:component -- <Name> --update` | Force refresh baselines for that component |
| `npm run test-playwright:component -- <Name> --skip-build` | Skip screenshot build |
| `npm run test-playwright:component -- <Name> --spec Light` | One component, `Light*` specs only |
| `npm run test-playwright:component -- <Name> --test-id <n>` | Single case by index |
| `npm run test-playwright:component -- <Name> --parallel <n>` | Same cases, `n` Playwright workers |
| `npm run test-ss:component -- <Name>` | WDIO equivalent (for comparison) |
| `npm run benchmark-screenshots -- <Name>` | Time Playwright then WDIO for one component |

### Single component (recommended)

```bash
# Verify (skip rebuild if dist exists)
npm run test-playwright:component -- Button --skip-build

# Faster local run
npm run test-playwright:component -- Button --skip-build --parallel 5

# Filter by title regex
npm run test-playwright:component -- Button --title "Focused"

# Light skin only
npm run test-playwright:component -- Button --spec Light
```

Each run prints total wall-clock time when finished (e.g. `Playwright (Button) finished in 1m 2.3s`).

`test-playwright` and `test-playwright:component` both invoke `scripts/run-playwright.mjs`. **Component mode** is selected when the first argument after `--` is a positional name (e.g. `Sprite`); **suite mode** uses flags only (`--component`, `--spec`, …).

Component mode sets `PLAYWRIGHT_INSTANCES=1` (all `testId`s for that component), `PLAYWRIGHT_WORKERS` from `--parallel` (default **1**), and runs **all** matching spec shards unless `--spec` is set.

#### `scripts/parse-cli-args.mjs` — why it exists

npm passes arguments after `--` to the Node script. A naive parser such as `args.find(a => !a.startsWith('--'))` treats **flag values** as the component name — e.g. `… --test-id 0 Sprite` would resolve component `"0"` instead of `"Sprite"`.

`parse-cli-args.mjs` exports `parsePlaywrightArgs()`, `parseComponentArgs()`, and `isComponentPlaywrightRun()` for:

- `run-playwright.mjs` — full suite and component entry (same file)
- `benchmark.mjs` — `--build`, `--parallel`

**Rules:**

- **Component mode:** the component name is the first positional token (non-flag argument).
- **Suite mode:** use `--component <Name>`; no positional component name.
- Value flags (`--test-id`, `--title`, `--parallel`, `--spec`, `--component`) consume following tokens until the next `--flag` (multi-word values such as `--title Button Focused` are supported).
- Boolean flags: `--update`, `--build`, `--skip-build`.

**Examples:**

| Command | Mode / component resolved |
|---------|---------------------------|
| `npm run test-playwright:component -- Button --parallel 5` | component → `Button` |
| `npm run test-playwright:component -- Button --test-id 0` | component → `Button` |
| `npm run test-playwright -- --component Button --spec Light` | suite; component filter `Button` |
| `npm run test-playwright -- --title Button Focused --spec Light` | suite; `Button` + title `Focused` |
| `npm run benchmark-screenshots -- Chip --build` | component → `Chip` |

Put the component name **first** after `--` in component mode (as in the examples above). `run-component-wdio.mjs` still uses its own parser — use the same name-first order there too.

### Full suite

Runs every registered component across **27** spec shards (`Default`…`Default9`, `HighContrast*`, `Light*` under `specs/neutral` and `specs/light`).

```bash
npm install && npm run bootstrap
npm link @enact/ui-test-utils   # until ./build-apps is on npm (see above)
npm run prepare-playwright

# First run or after UI changes — force refresh all baselines
npm run test-playwright:update

# Verify (all components, all specs)
npm run test-playwright

# Skip rebuild when dist/ already exists
npm run test-playwright -- --skip-build

# Filter examples
npm run test-playwright -- --component Button
npm run test-playwright -- --spec Light
npm run test-playwright -- --component Button --spec Light

# HTML report
npm run test-playwright:report
```

**Parallelism in full suite:** `playwright.config.mjs` defaults to **5 workers** (`PLAYWRIGHT_WORKERS`) and **120 s** per test (WDIO mocha uses 1 h). Navigation/action timeouts are **60 s**. Shards split cases by `testId % PLAYWRIGHT_INSTANCES` (default instances **5**).

**Limit shards** (`utils/spec-match.js`):

| `PLAYWRIGHT_SPEC` | Runs |
|-------------------|------|
| *(unset)* | All `*-spec.js` files |
| `Default` | All neutral default shards: `Default-spec.js` … `Default9-spec.js` |
| `Default2` … `Default5` | Single shard file each (e.g. `Default3-spec.js`) |
| `Default-spec` | Only `specs/neutral/Default-spec.js` (shard 1 — same file as WDIO `Default-specs.js`) |
| `HighContrast` | `HighContrast-spec.js` … `HighContrast9-spec.js` |
| `Light` | `Light-spec.js` … `Light9-spec.js` |

**Jenkins `SPEC` (WDIO names)** is normalized in `build-scripts/enact-playwright-tests.sh` (`Default-specs` → `Default`, etc.) so Playwright uses the same substring filter as WDIO `--spec`. E.g. `SPEC=Default` → `PLAYWRIGHT_SPEC=Default` → all neutral `*Default*-spec.js` shards active for `INSTANCES=5`. Matrix desktop: `Default`, `Default2` … `Default5`.

```powershell
$env:PLAYWRIGHT_SPEC='Default'
npm run test-playwright -- --skip-build
```

### Sharding vs workers

| Concept | Env / flag | Meaning |
|---------|------------|---------|
| **Shard** | `concurrency` in spec + `PLAYWRIGHT_INSTANCES` | Which `testId`s this spec file owns (`testId % instances === concurrency - 1`) |
| **Workers** | `PLAYWRIGHT_WORKERS` or `--parallel` on component script | How many tests run at once in one Playwright process |
| **Component filter** | `PLAYWRIGHT_COMPONENT` | Only one component's cases |

**Shard coverage:** `global-teardown` checks that every shard **you asked for** actually ran. It derives expected shards from `PLAYWRIGHT_SPEC` (same rules as `testMatch` in `playwright.config.mjs`) — e.g. `PLAYWRIGHT_SPEC=Default3` requires only shard 3; no `PLAYWRIGHT_SPEC` requires all active shards 1…`PLAYWRIGHT_INSTANCES` per skin/HC group. If you set `PLAYWRIGHT_INSTANCES=9` but only invoke shards 1–5, cases with `testId % 9` in `{5,6,7,8}` are silently skipped and teardown fails for the missing expected shards. Shards with `concurrency > PLAYWRIGHT_INSTANCES` are inert (empty) — expected when the default instances is **5** but nine shard files exist per skin.

#### `utils/shard-registry.js` — why it exists

Each `*-spec.js` file is independent: it only knows its own `concurrency` value and cannot see which other spec files ran in the same Playwright process. That makes **partial shard runs look successful** — the suite is green even when whole slices of `testId`s were never rendered.

`shard-registry.js` collects which shards actually loaded and validates coverage at the end of the run:

| Step | Where | What |
|------|--------|------|
| Reset | `global-setup.js` → `clearShardRegistry()` | Deletes `playwright/.shard-registry.jsonl` from any previous run |
| Record | `registerScreenshotTests()` → `recordShard()` | Appends one JSON line per spec file: skin, highContrast, `concurrency`, `PLAYWRIGHT_INSTANCES` |
| Validate | `global-teardown.js` → `validateShardCoverage()` | For each skin/HC group, ensures every shard in the current `PLAYWRIGHT_SPEC` filter ran (`utils/spec-match.js`) |

**Skipped when** `PLAYWRIGHT_COMPONENT` is set (component script — no cross-shard risk).

**Example failure:** no `PLAYWRIGHT_SPEC` (full suite) but only `Default3-spec.js` loads → teardown throws *Incomplete Playwright shard coverage* because shards 1, 2, 4, 5 were expected for that skin/HC group.

The registry file is **gitignored** (`.shard-registry.jsonl`); it is a run-time artifact only.

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
| Button | 205 | 5 | 96 s † | 979.3 s | Playwright (~89%) | 0.5 | 4.8 |

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
| `PLAYWRIGHT_SKIP_BUILD=1` | Skip `buildApps('screenshot')` in global-setup (same as `--skip-build`) |
| `PLAYWRIGHT_FORCE_UPDATE=1` | Force overwrite baselines (same as `--update`) |
| `PLAYWRIGHT_COMPONENT_EXACT=1` | Exact component name match (set by component script) |
| `PLAYWRIGHT_COMPONENT` | Filter components (substring match from `--component`; exact when set by component script) |
| `PLAYWRIGHT_REFRESH_TEST_DATA=1` | Force-regenerate `.test-data.json` |
| `PLAYWRIGHT_TEST_ID` | Filter to one case index (must be a non-negative integer; invalid values throw) |
| `PLAYWRIGHT_TITLE` | Filter cases by title (regex per whitespace-separated term; invalid regex falls back to substring; case-insensitive) |
| `PLAYWRIGHT_INSTANCES` | Shard divisor (`testId % instances`); component script sets `1` |
| `PLAYWRIGHT_WORKERS` | Parallel workers in `playwright.config.mjs` (default **5**) |
| `PLAYWRIGHT_SPEC` | Limit which `*-spec.js` files run; also defines which shards teardown expects |
| `PLAYWRIGHT_BASE_URL` | Static server URL (default `http://localhost:4568`) |
| `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` | Set to `1` on Jenkins agents (build-scripts); skips Playwright host-deps check |
| `PLAYWRIGHT_CI_DEFAULT_SPEC` | Jenkins only: optional subset when `SPEC` is unset (e.g. `Default-spec` for smoke) |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing dist / build failed | Read the `assertScreenshotDist()` error (fail-fast in global-setup, not a webServer timeout); link `@enact/ui-test-utils` if build-apps fails |
| Snapshot diff | Re-baseline with `--update`, or run failing `--test-id` alone |
| Snapshot diff on focus cases in parallel | Re-baseline with `--parallel 1`, or run failing `--test-id` alone |
| No tests found | Wrong `PLAYWRIGHT_SPEC` (shard 1 = `Default-spec`, not `Default1`); check `PLAYWRIGHT_COMPONENT`, `PLAYWRIGHT_TITLE`, `PLAYWRIGHT_TEST_ID`; delete stale `.test-data.json` or set `PLAYWRIGHT_REFRESH_TEST_DATA=1` |
| Invalid `PLAYWRIGHT_TEST_ID` | Use a non-negative integer for `--test-id` (e.g. `--test-id 3`) |
| Stale `.test-data.json` (`undefined` parse error) | Delete `playwright/.test-data.json` or set `PLAYWRIGHT_REFRESH_TEST_DATA=1`; rebuild dist if needed |
| `locator.waitFor` / page timeout on CI | Ensure `playwright.config.mjs` uses `timeout: 120000`; use current `limestone-page.js` (WDIO-style ready, no `visible` on `body` / `data-ui-test-id`) |
| Port conflict on CI after setup | Ensure global-setup stopped its temporary `serve` (fresh `.test-data.json` + `--skip-build` should not leave an orphan on :4568) |
| Missing images on build | Place assets under `tests/screenshot/images/`, `videos/` |
| Port already in use | Set `PLAYWRIGHT_BASE_URL` to another port; restart any stale `serve` on 4568 |
| `build-apps` import error | Link or pin `@enact/ui-test-utils` with export `./build-apps` (see **Link local @enact/ui-test-utils** above) |
| Incomplete shard coverage | Ensure every spec file matched by `PLAYWRIGHT_SPEC` loaded and ran (see **Sharding vs workers**) |
| WDIO `--parallel` ignored | Update `@enact/ui-test-utils` (see ui-test-utils PR for `--parallel` CLI) |

---

## CI

Jenkins job **`enact-screenshot-tests`** runs WDIO (`npm run test-ss`) then Playwright via `build-scripts/enact-playwright-tests.sh` in the same workspace. Standalone job `enact-playwright-tests` is also supported. See `build-scripts/README.md` for full env var list.

1. **Chrome:** `installChrome` from build-scripts (same as WDIO); skips `npm run prepare-playwright` on agents
2. **Reference:** optional Nebula `reference/${TARGET_TYPE}-playwright/` (separate from WDIO `reference/${TARGET_TYPE}/`)
3. **`npm run test-playwright`** with Jenkins env (aligned with WDIO `wdio-screenshot-test-opts.sh`):

| Jenkins param | Playwright | WDIO (same job) |
|---------------|------------|-----------------|
| *(no `SPEC`, desktop)* | Full suite (`PLAYWRIGHT_SPEC` unset) | `--instances 5 --parallel 5`, all `*-specs.js` |
| `SPEC=Default` | `PLAYWRIGHT_SPEC=Default` | `--spec Default` |
| `SPEC=Default2` … `Default5` | `PLAYWRIGHT_SPEC=Default2`, … | `--spec Default2`, … |
| `COMPONENT` | `PLAYWRIGHT_COMPONENT`, `INSTANCES=1` | `--instances 1 --parallel …` |
| `WDIO_PARALLEL` | `PLAYWRIGHT_WORKERS` (default **5**) | `--parallel` |
| `PLAYWRIGHT_CI_DEFAULT_SPEC` | Optional smoke when no `SPEC` (e.g. `Default-spec` for shard 1 only) | — |
| `REFERENCE` | Nebula `limestone-playwright/` | Nebula `limestone/` |

4. **Results:** `http://nebula.lge.com/results/playwright-results-<timestamp>/reports/html/index.html`

On TV: `PLAYWRIGHT_SPEC=Default`, `INSTANCES=1`, `WORKERS=1`.

---

## Maintenance

### New or changed UI case

1. Edit `tests/screenshot/apps/components/<Name>.js`
2. Register in `tests/screenshot/apps/LimestoneComponents.js` if new component
3. Run tests (build runs unless `--skip-build`); missing baselines are created automatically
4. `npm run test-playwright:component -- <Name> --update` to force refresh PNGs after UI changes

### New WDIO shard

Add matching `playwright/specs/**/<Name>-spec.js` with the same `skin`, `highContrast`, and `concurrency` as the WDIO `*-specs.js` file.

---

## Related npm scripts (root `package.json`)

```json
"test-playwright": "node tests/screenshot/scripts/run-playwright.mjs",
"test-playwright:update": "node tests/screenshot/scripts/run-playwright.mjs -- --update",
"test-playwright:report": "playwright show-report tests/screenshot/playwright/reports/html",
"test-playwright:component": "node tests/screenshot/scripts/run-playwright.mjs",
"test-ss:component": "node tests/screenshot/scripts/run-component-wdio.mjs",
"prepare-playwright": "playwright install chrome",
"benchmark-screenshots": "node tests/screenshot/playwright/benchmark.mjs"
```
