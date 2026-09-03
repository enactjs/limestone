// Utility methods for testing

// adapted from https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
const daysInMonth = ({month, year}) => new Date(year, month, 0).getDate();

// Reads a field's numeric value, retrying briefly if a transition happens to be mid-flight (e.g.
// `day` gets silently re-animated when a month/year change clamps it to a shorter month, even
// though no test acted on `day` directly), which can otherwise return blank/blended text.
const readValue = async (picker, type, {timeout = 2000, interval = 100} = {}) => {
	const deadline = Date.now() + timeout;
	let value = NaN;

	do {
		value = parseInt(await picker.item(type).getText());
		if (!isNaN(value)) return value;
		await browser.pause(interval);
	} while (Date.now() < deadline);

	return value;
};

const extractValues = async (picker) => {
	const day = await readValue(picker, 'day');
	const month = await readValue(picker, 'month');
	const year = await readValue(picker, 'year');

	return {day, month, year};
};

// Waits for the picker's transition to settle on `expected` rather than sleeping for a fixed
// duration, since the outgoing item stays in the DOM (and getText() can return its stale or
// blended value) until the leave animation finishes.
const waitForValue = async (picker, type, expected) => {
	await browser.waitUntil(async function () {
		const value = parseInt(await picker.item(type).getText());
		return value === expected;
	}, {timeout: 2000, timeoutMsg: `timed out waiting for ${type} to become ${expected}`});
};

// Validations are self-contained 'it' statements
function validateTitle (picker, title) {
	it('should have correct title', async function () {
		expect(await picker.titleText).toBe(title);
	});
}

module.exports = {
	daysInMonth,
	extractValues,
	validateTitle,
	waitForValue
};
