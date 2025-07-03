const Page = require('./ButtonPage');

describe('Button', function () {

	beforeEach(async function () {
		await Page.open();
	});

	const {
		buttonDefault,
		buttonDisabled,
		buttonSizeSmall,
		iconButton
	} = Page.components;

	describe('5-way', function () {
		it('should focus disabled button on 5-way right', async function () {
			await buttonDefault.focus();
			await Page.spotlightRight();
			expect(await buttonDisabled.self.isFocused()).toBe(false);
		});

		it('should focus iconButton on 5-way right', async function () {
			await buttonSizeSmall.focus();
			await Page.spotlightRight();
			expect(await iconButton.self.isFocused()).toBe(false);
		});
	});

	describe('pointer', function () {
		it('should focus the disabled when hovered', async function () {
			await buttonDisabled.hover();
			expect(await buttonDisabled.self.isFocused()).toBe(true);
		});

		it('should focus first when hovered', async function () {
			await buttonDefault.hover();
			expect(await buttonDefault.self.isFocused()).toBe(true);
		});
	});
});
