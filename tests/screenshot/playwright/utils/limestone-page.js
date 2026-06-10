const VIEW = 'Limestone-View';

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
	return `/${VIEW}/${urlExtra}`;
}

async function open (page, urlExtra = '?locale=en-US') {
	await page.goto(buildUrl(urlExtra), {waitUntil: 'load'});
}

export async function openComponent (page, params) {
	const query = serializeParams(Object.assign({locale: 'en-US'}, params));
	await open(page, `?${query}`);
	await page.locator('[data-ui-test-id="test"]').waitFor({state: 'visible', timeout: 30000});
	// Wait for web fonts to finish loading so glyphs are painted before the screenshot.
	await page.evaluate(() => document.fonts.ready);
}
