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
	// WDIO Page.open: body.waitForDisplayed + delay(200). Playwright "visible" is stricter
	// (body often stays non-visible while #root is ready); wait on app content instead.
	await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 200)));
	await page.waitForFunction(() => {
		if (document.readyState !== 'complete') {
			return false;
		}

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
