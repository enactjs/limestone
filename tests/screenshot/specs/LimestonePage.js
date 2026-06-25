'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

function getQueryString (urlExtra) {
	if (typeof urlExtra !== 'string') {
		return '';
	}

	return urlExtra.startsWith('?') ? urlExtra.slice(1) : urlExtra;
}

class LimestonePage extends Page {
	constructor () {
		super();
		this.title = 'Limestone Test';
	}

	async open (urlExtra) {
		await super.open('Limestone-View', urlExtra);

		if (typeof urlExtra === 'string' && urlExtra.includes('request')) {
			return;
		}

		const query = getQueryString(urlExtra);

		await browser.waitUntil(async () => {
			return browser.execute(() => Boolean(document.querySelector('[data-ui-test-id="test"]')));
		}, {
			timeout: 3000,
			interval: 50,
			timeoutMsg: 'timed out waiting for test component'
		});

		const needsFocus = await browser.execute((params) => {
			const search = new URLSearchParams(params);
			const component = search.get('component');
			const testId = Number.parseInt(search.get('testId'), 10);
			const fromMap = Boolean(window.__TEST_FOCUS?.[component]?.[testId]);

			return fromMap || window.__CURRENT_TEST_FOCUS === true;
		}, query);

		await browser.execute((focused) => {
			const testNode = document.querySelector('[data-ui-test-id="test"]');
			const spotlightApi = window.__SPOTLIGHT;

			if (!testNode || !spotlightApi) {
				return;
			}

			spotlightApi.setPointerMode(!focused);

			if (focused) {
				spotlightApi.focus(testNode);
			} else {
				const current = spotlightApi.getCurrent();

				if (current && (testNode === current || testNode.contains(current))) {
					current.blur();
				}
			}
		}, needsFocus);

		if (needsFocus) {
			await this.waitForSpotlightFocus();
		} else {
			await this.waitForNoSpotlightFocus();
		}

		await this.delay(100);
	}

	async waitForNoSpotlightFocus ({timeout = 3000, interval = 100} = {}) {
		await browser.waitUntil(async () => {
			return browser.execute(() => {
				const testNode = document.querySelector('[data-ui-test-id="test"]');
				if (!testNode) {
					return false;
				}

				return !testNode.hasAttribute('data-spotlight-focused') &&
					!testNode.querySelector('[data-spotlight-focused]');
			});
		}, {
			timeout,
			interval,
			timeoutMsg: 'timed out waiting for test component unfocused'
		});
	}

	async waitForSpotlightFocus ({timeout = 3000, interval = 100} = {}) {
		await browser.waitUntil(async () => {
			return browser.execute(() => {
				const testNode = document.querySelector('[data-ui-test-id="test"]');
				if (!testNode) {
					return false;
				}

				if (testNode.hasAttribute('data-spotlight-focused')) {
					return true;
				}

				if (testNode.querySelector('[data-spotlight-focused]')) {
					return true;
				}

				const active = document.activeElement;
				return testNode === active || testNode.contains(active);
			});
		}, {
			timeout,
			interval,
			timeoutMsg: 'timed out waiting for test component focused'
		});
	}

	get component () {
		return $('[data-ui-test-id="test"]');
	}
}

module.exports = new LimestonePage();
