const Page = require('./PopupTabLayoutPage');

describe('PopupTabLayout prerender/optimized', function () {
	const {popupTabLayout} = Page.components;

	describe('prerender', function () {
		beforeEach(async function () {
			await Page.open('', '?prerender');
		});

		it('should render the popup open with the first tab\'s view', async function () {
			await Page.waitForExist('#tabLayout');

			const expected = 'display';
			const actual = await popupTabLayout.currentView.getAttribute('id');

			expect(actual).toBe(expected);
		});

		it('should render its content inside the floating layer (portal) at runtime', async function () {
			await Page.waitForExist('#tabLayout');

			expect(await Page.isContentInFloatingLayer()).toBe(true);
		});

		it('should not apply the `optimized` class', async function () {
			await Page.waitForExist('#tabLayout');

			const className = await popupTabLayout.self.getAttribute('class');

			expect(className).not.toContain('optimized');
		});

		it('should support 5-way tab navigation like the default', async function () {
			const soundId = 'sound';

			await Page.delay(1000);
			await Page.spotlightDown();
			await Page.waitForExist(`#${soundId}`);

			const expected = soundId;
			const actual = await popupTabLayout.currentView.getAttribute('id');

			expect(actual).toBe(expected);
		});

		it('should close the popup on back when the focus is on the tabs', async function () {
			await Page.delay(500);
			await Page.waitTransitionEnd(1500, 'waiting for popup to close', async () => {
				await Page.backKey();
			});

			await Page.delay(500);
			const expected = false;
			const actual = await $('#tabLayout').isExisting();

			expect(actual).toBe(expected);
		});
	});

	describe('optimized', function () {
		beforeEach(async function () {
			await Page.open('', '?optimized');
		});

		it('should render the popup open with the first tab\'s view', async function () {
			await Page.waitForExist('#tabLayout');

			const expected = 'display';
			const actual = await popupTabLayout.currentView.getAttribute('id');

			expect(actual).toBe(expected);
		});

		it('should render its content inline, not inside the floating layer', async function () {
			await Page.waitForExist('#tabLayout');

			expect(await Page.isContentInFloatingLayer()).toBe(false);
		});

		it('should apply the `optimized` class', async function () {
			await Page.waitForExist('#tabLayout');

			const className = await popupTabLayout.self.getAttribute('class');

			expect(className).toContain('optimized');
		});

		it('should support 5-way tab navigation', async function () {
			const soundId = 'sound';

			await Page.delay(1000);
			await Page.spotlightDown();
			await Page.waitForExist(`#${soundId}`);

			const expected = soundId;
			const actual = await popupTabLayout.currentView.getAttribute('id');

			expect(actual).toBe(expected);
		});
	});
});
