'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

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

		await browser.waitUntil(async () => {
			return browser.execute(() => typeof window.__CURRENT_TEST_FOCUS === 'boolean');
		}, {
			timeout: 3000,
			interval: 50,
			timeoutMsg: 'timed out waiting for test focus state'
		});

		const needsFocus = await browser.execute(() => window.__CURRENT_TEST_FOCUS === true);
		if (needsFocus) {
			await this.waitForSpotlightFocus();
		} else {
			await this.waitForNoSpotlightFocus();
		}
	}

	async waitForNoSpotlightFocus ({timeout = 3000, interval = 100} = {}) {
		await browser.waitUntil(async () => {
			return browser.execute(() => {
				const test = document.querySelector('[data-ui-test-id="test"]');
				if (!test) {
					return false;
				}

				return !test.hasAttribute('data-spotlight-focused') &&
					!test.querySelector('[data-spotlight-focused]');
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
				const test = document.querySelector('[data-ui-test-id="test"]');
				if (!test) {
					return false;
				}

				if (test.hasAttribute('data-spotlight-focused')) {
					return true;
				}

				if (test.querySelector('[data-spotlight-focused]')) {
					return true;
				}

				const active = document.activeElement;
				return test === active || test.contains(active);
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
