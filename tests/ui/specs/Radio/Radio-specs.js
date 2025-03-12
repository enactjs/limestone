const Page = require('./RadioPage');

describe('Radio', function () {

	beforeEach(async function () {
		await Page.open();
	});

	const {
		normalRadio,
		labeledRadio,
		selectedRadio,
		disabledRadio
	} = Page.components;

	describe('default', function () {
		it('should focus on load', async function () {
			expect(await normalRadio.self.isFocused()).toBe(true);
		});

		it('should not be checked', async function () {
			expect(await normalRadio.isChecked).toBe(false);
		});

		it('should be checked', async function () {
			expect(await selectedRadio.isChecked).toBe(true);
		});
	});

	describe('5-way', function () {
		it('should focus', async function () {
			await Page.spotlightDown();

			expect(await labeledRadio.self.isFocused()).toBe(true);

			await Page.spotlightDown();

			expect(await selectedRadio.self.isFocused()).toBe(true);

			await Page.spotlightDown();

			expect(await disabledRadio.self.isFocused()).toBe(true);
		});

		it('should get checked', async function () {
			await Page.spotlightSelect();

			expect(await normalRadio.isChecked).toBe(true);
		});

		it('should get checked (labeled)', async function () {
			await Page.spotlightDown();
			await Page.spotlightSelect();

			expect(await labeledRadio.isChecked).toBe(true);
		});

		it('should re-uncheck the item when selected twice', async function () {
			await Page.spotlightSelect();
			await Page.spotlightSelect();
			expect(await normalRadio.isChecked).toBe(false);
		});

		it('should not get checked', async function () {
			await Page.spotlightDown();
			await Page.spotlightDown();
			await Page.spotlightDown();
			await Page.spotlightSelect();

			expect(await disabledRadio.isChecked).toBe(false);
		});

		it('should get unchecked', async function () {
			await Page.spotlightDown();
			await Page.spotlightDown();
			await Page.spotlightSelect();

			expect(await selectedRadio.isChecked).toBe(false);
		});
	});

	describe('pointer', function () {
		it('should get checked', async function () {
			await normalRadio.self.click();

			expect(await normalRadio.isChecked).toBe(true);
		});

		it('should get checked (indeterminate)', async function () {
			await labeledRadio.self.click();

			expect(await labeledRadio.isChecked).toBe(true);
		});

		it('should re-uncheck the item when selected twice', async function () {
			await normalRadio.self.click();
			await normalRadio.self.click();

			expect(await normalRadio.isChecked).toBe(false);
		});

		it('should not get checked', async function () {
			await disabledRadio.self.click();

			expect(await disabledRadio.isChecked).toBe(false);
		});

		it('should get unchecked', async function () {
			await selectedRadio.self.click();

			expect(await selectedRadio.isChecked).toBe(false);
		});
	});
});
