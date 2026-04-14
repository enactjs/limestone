const Page = require('./PageViewsPage');

describe('PageViews', function () {

	const {
		pageViewsPage1,
		pageViewsPage2,
		pageViewsItem1,
		pageViewsItem3
	} = Page.components;

	describe('default', function () {

		beforeEach(async function () {
			await Page.open();
		});

		describe('focus management', function () {
			it('should focus item on load', async function () {
				expect(await pageViewsItem1.self.isFocused()).toBe(true);
			});

			it('should focus item after switching page', async function () {
				await Page.spotlightRight();
				await Page.spotlightSelect();
				await browser.pause(500);

				expect(await pageViewsItem3.self.isFocused()).toBe(true);
			});
		});

		describe('5-way', function () {
			it('should change page when selecting next/previous button', async function () {
				expect(await pageViewsPage1.isPageExist).toBe(true);

				await Page.spotlightRight();
				await Page.spotlightSelect();

				expect(await pageViewsPage2.isPageExist).toBe(true);

				await browser.pause(500);
				await Page.spotlightLeft();
				await Page.spotlightSelect();

				expect(await pageViewsPage1.isPageExist).toBe(true);
			});
		});

		describe('pointer', function () {
			it('should change page when clicking next/previous button', async function () {
				expect(await pageViewsPage1.isPageExist).toBe(true);

				await pageViewsPage1.nextButton.click();

				expect(await pageViewsPage2.isPageExist).toBe(true);

				await pageViewsPage2.prevButton.click();

				expect(await pageViewsPage1.isPageExist).toBe(true);
			});
		});
	});

	describe('autoFocus', function () {

		beforeEach(async function () {
			await Page.open('AutoFocus');
		});

		it('should focus nothing when `autoFocus="none"` and it`s the first page', async function () {
			const expected = null;
			const actual = Page.focusedText;

			expect(await actual).toBe(expected);
		});
	});

	describe('pointerEvents', function () {

		beforeEach(async function () {
			await Page.open('PointerEvents');
		});

		it('should focus the button on the same line with arrow for next page', async function () {
			await $('#PageViewsButton2').moveTo();

			expect(await $('#PageViewsButton2').isFocused()).toBe(true);
		});
	});

	describe('footerButtons', function () {

		const {pageViewsPage1} = Page.components;

		beforeEach(async function () {
			await Page.open('FooterButtons');
		});

		it('should focus footer Next button on initial load', async function () {
			expect(await Page.focusedText).toBe('Next');
		});

		it('should focus footer Close button when footer Next navigates to the last page', async function () {
			await pageViewsPage1.footerDefaultButton.click();
			await browser.pause(500);
			expect(await Page.focusedText).toBe('Next');

			await pageViewsPage1.footerDefaultButton.click();
			await browser.pause(500);
			expect(await Page.focusedText).toBe('Close');
		});

		it('should focus internal next button during navigation and footer Close button when reaching the last page with the internal next button', async function () {
			await pageViewsPage1.nextButton.click();
			await browser.pause(500);
			expect(await pageViewsPage1.nextButton.isFocused()).toBe(true);

			await pageViewsPage1.nextButton.click();
			await browser.pause(500);

			expect(await Page.focusedText).toBe('Close');
		});

		it('should focus internal previous button during navigation and footer Next button when reaching the first page with the internal previous button', async function () {
			await pageViewsPage1.nextButton.click();
			await browser.pause(500);
			await pageViewsPage1.nextButton.click();
			await browser.pause(500);

			await pageViewsPage1.prevButton.click();
			await browser.pause(500);
			expect(await pageViewsPage1.prevButton.isFocused()).toBe(true);

			await pageViewsPage1.prevButton.click();
			await browser.pause(500);

			expect(await Page.focusedText).toBe('Next');
		});
	});
});
