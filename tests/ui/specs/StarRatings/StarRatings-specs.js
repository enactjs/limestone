const Page = require('./StarRatingsPage');

describe('StarRatings', function () {

	const {
		starRatingsDefault,
		starRatingsReadOnly,
		starRatingsDisabled
	} = Page.components;

	describe('LTR locale', function () {
		beforeEach(async function () {
			await Page.open();
		});

		describe('default', function () {
			it('should focus the first star on load', async function () {
				expect(await starRatingsDefault.star(1).isFocused()).toBe(true);
			});

			it('should show 3 stars when no value is set', async function () {
				expect(await starRatingsDefault.filledStars()).toBe(3);
			});

			it('should show a half star in read-only mode', async function () {
				expect(await starRatingsReadOnly.fills()).toEqual(['100%', '100%', '100%', '50%', '0%']);
			});

			it('should mark read-only and disabled ratings', async function () {
				expect(await starRatingsReadOnly.isReadOnly).toBe(true);
				expect(await starRatingsDisabled.isDisabled).toBe(true);
				expect(await starRatingsDefault.isReadOnly).toBe(false);
				expect(await starRatingsDefault.isDisabled).toBe(false);
			});

			it('should show the focus outline only on the focused star', async function () {
				expect(await starRatingsDefault.hasFocusOutline(1)).toBe(true);
				expect(await starRatingsDefault.hasFocusOutline(2)).toBe(false);
			});
		});

		describe('5-way', function () {
			it('should move focus to the next star', async function () {
				await Page.spotlightRight();

				expect(await starRatingsDefault.star(2).isFocused()).toBe(true);
				expect(await starRatingsDefault.hasFocusOutline(2)).toBe(true);
				expect(await starRatingsDefault.hasFocusOutline(1)).toBe(false);
			});

			it('should select the focused star', async function () {
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightSelect();

				expect(await starRatingsDefault.filledStars()).toBe(4);
				expect(await Page.lastChange).toBe('4');
			});

			it('should select a lower star', async function () {
				await Page.spotlightSelect();

				expect(await starRatingsDefault.filledStars()).toBe(1);
				expect(await Page.lastChange).toBe('1');
			});

			it('should not change the fill when focusing an empty star', async function () {
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightRight();

				expect(await starRatingsDefault.star(4).isFocused()).toBe(true);
				expect(await starRatingsDefault.fill(4)).toBe('0%');
			});

			it('should skip the read-only rating and focus the disabled one', async function () {
				await Page.spotlightDown();

				expect(await Page.focusedId).toMatch(/^starRatingsDisabled-star-/);
			});

			it('should not change a disabled rating on select', async function () {
				await Page.spotlightDown();
				await Page.spotlightSelect();

				expect(await starRatingsDisabled.filledStars()).toBe(2);
				expect(await Page.lastChange).toBe('none');
			});

			it('should return to the last focused star', async function () {
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightDown();

				// A rating entered for the first time starts at its first star
				expect(await starRatingsDisabled.star(1).isFocused()).toBe(true);

				// Move to the far end, so only "last focused" (not position) leads back to star 3
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightRight();
				await Page.spotlightRight();

				expect(await starRatingsDisabled.star(5).isFocused()).toBe(true);

				await Page.spotlightUp();

				expect(await starRatingsDefault.star(3).isFocused()).toBe(true);
			});
		});

		describe('pointer', function () {
			it('should select the clicked star', async function () {
				await starRatingsDefault.star(5).click();

				expect(await starRatingsDefault.filledStars()).toBe(5);
				expect(await Page.lastChange).toBe('5');
			});

			it('should not change a read-only rating on click', async function () {
				await starRatingsReadOnly.star(1).click();

				expect(await starRatingsReadOnly.fills()).toEqual(['100%', '100%', '100%', '50%', '0%']);
				expect(await Page.lastChange).toBe('none');
			});

			it('should not change a disabled rating on click', async function () {
				await starRatingsDisabled.star(4).click();

				expect(await starRatingsDisabled.filledStars()).toBe(2);
				expect(await Page.lastChange).toBe('none');
			});
		});
	});

	describe('RTL locale', function () {
		beforeEach(async function () {
			await Page.open('?locale=ar-SA');
		});

		it('should place the first star on the right', async function () {
			expect(await starRatingsDefault.starLeft(1)).toBeGreaterThan(await starRatingsDefault.starLeft(2));
		});

		it('should move focus to the next star with the left key', async function () {
			expect(await starRatingsDefault.star(1).isFocused()).toBe(true);

			await Page.spotlightLeft();

			expect(await starRatingsDefault.star(2).isFocused()).toBe(true);
		});

		it('should fill a partial star from the right', async function () {
			const direction = await browser.execute((el) => window.getComputedStyle(el).getPropertyValue('--star-direction').trim(), await starRatingsReadOnly.star(4));

			expect(direction).toBe('to left');
		});
	});
});
