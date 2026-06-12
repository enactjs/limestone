import {SCREENSHOT_VIEW} from '../paths.js';

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

async function open (page, urlExtra = '?locale=en-US') {
	await page.goto(buildUrl(urlExtra), {waitUntil: 'load'});
}

export async function openComponent (page, params) {
	const query = serializeParams(Object.assign({locale: 'en-US'}, params));
	await open(page, `?${query}`);
	// Match WDIO Page.open: body ready + short settle (no wait on [data-ui-test-id]).
	// That node can be attached but not Playwright-"visible" (e.g. Input open in FloatingLayer).
	await page.locator('body').waitFor({state: 'visible', timeout: 10000});
	await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 200)));
	await page.waitForFunction(() => {
		const root = document.querySelector('#root');

		if (!root?.children.length) {
			return false;
		}

		const text = root.textContent || '';

		return !text.includes('INVALID COMPONENT') && !text.includes('ERROR IN');
	}, {timeout: 60000});
	// Wait for web fonts to finish loading so glyphs are painted before the screenshot.
	await page.evaluate(() => document.fonts.ready);
}
