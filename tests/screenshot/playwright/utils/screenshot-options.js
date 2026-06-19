/**
 * Shared screenshot settings aligned with WDIO (@enact/ui-test-utils):
 * - setWindowSize(1920, 1167) in wdio.conf.js
 * - checkScreen({ ignoreAntialiasing: true, ... }) → threshold 0.2 in Playwright
 */
export const SCREENSHOT_VIEWPORT = {
	width: 1920,
	height: 1080
};

/** Playwright per-pixel color tolerance; mirrors WDIO ignoreAntialiasing. */
export const SCREENSHOT_THRESHOLD = 0.2;

export const SCREENSHOT_COMPARE_OPTIONS = {
	animations: 'disabled',
	caret: 'hide',
	threshold: SCREENSHOT_THRESHOLD,
	maxDiffPixelRatio: 0
};

export const PAGE_SCREENSHOT_OPTIONS = {
	animations: 'disabled',
	caret: 'hide',
	type: 'png'
};
