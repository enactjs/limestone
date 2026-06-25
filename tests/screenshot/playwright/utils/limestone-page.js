import {SCREENSHOT_VIEW} from '../paths.js';

const BODY_WAIT_MS = 10000;
const SETTLE_MS = 200;
const FONTS_WAIT_MS = 10000;
const READY_STATE_WAIT_MS = 15000;

function serializeParams (params) {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value != null) {
			searchParams.set(key, String(value));
		}
	}

	return searchParams.toString();
}

function buildUrl (urlExtra = '?locale=en-US') {
	return `/${SCREENSHOT_VIEW}/${urlExtra}`;
}

// Chrome's native spellcheck draws wavy underlines on editable fields with "misspelled" content
// That overlay is environment-dependent. Force spellcheck off on every editable element
// before navigation, so the markers never render regardless of the browser environment.
async function disableSpellcheck (page) {
	await page.addInitScript(() => {
		const SELECTOR = 'input, textarea, [contenteditable]';

		const disableWithin = (node) => {
			if (node.nodeType !== 1) return;
			if (node.matches && node.matches(SELECTOR)) {
				node.setAttribute('spellcheck', 'false');
			}
			if (node.querySelectorAll) {
				for (const el of node.querySelectorAll(SELECTOR)) {
					el.setAttribute('spellcheck', 'false');
				}
			}
		};

		const apply = () => {
			// Set a non-spellchecked default that descendants inherit, then sweep existing fields.
			document.documentElement && document.documentElement.setAttribute('spellcheck', 'false');
			disableWithin(document.documentElement || document);
		};

		// React mounts the screenshot app after load, so watch for fields added later.
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const added of mutation.addedNodes) {
					disableWithin(added);
				}
			}
		});

		const start = () => {
			apply();
			if (document.body) {
				observer.observe(document.body, {childList: true, subtree: true});
			}
		};

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', start, {once: true});
		} else {
			start();
		}
	});
}

async function open (page, urlExtra = '?locale=en-US') {
	await page.goto(buildUrl(urlExtra), {waitUntil: 'load'});
}

async function waitForPageReady (page) {
	// Enact screenshot app may keep <body> hidden; WDIO waitForDisplayed still passes once #root
	// has content. Wait for attached + rendered root instead of body visibility.
	await page.locator('body').waitFor({state: 'attached', timeout: BODY_WAIT_MS});
	await page.waitForFunction(
		() => {
			const root = document.getElementById('root');
			return document.readyState === 'complete' && root != null && root.childElementCount > 0;
		},
		{timeout: READY_STATE_WAIT_MS}
	);

	await page.evaluate((ms) => new Promise((resolve) => setTimeout(resolve, ms)), SETTLE_MS);

	await page.evaluate((fontsTimeout) => Promise.race([
		document.fonts.ready,
		new Promise((resolve) => setTimeout(resolve, fontsTimeout))
	]), FONTS_WAIT_MS);

	// MediaOverlay and similar: freeze video on first frame (non-deterministic otherwise).
	await page.evaluate(() => {
		for (const video of document.querySelectorAll('video')) {
			video.pause();
			try {
				video.currentTime = 0;
			} catch {
				// ignore seek errors on unloaded media
			}
		}
	});
}

export async function openComponent (page, params) {
	await disableSpellcheck(page);
	const query = serializeParams(Object.assign({locale: 'en-US'}, params));
	await open(page, `?${query}`);
	await waitForPageReady(page);
}
