import {
	FULLSCREEN_JOINED_DIGITS_LIMIT,
	OVERLAY_JOINED_DIGITS_LIMIT,
	calcAriaLabel,
	convertToPasswordFormat,
	limitNumberLength
} from '../util';

describe('Input util', () => {
	describe('calcAriaLabel', () => {
		test('should read the prefix, the value and the field hint', () => {
			expect(calcAriaLabel('Name', 'text', 'Bob')).toBe('Name Bob Input field');
		});

		test('should read an empty value when there is none', () => {
			expect(calcAriaLabel('Name', 'text')).toBe('Name  Input field');
		});

		test.each([
			['password'],
			['passwordtel']
		])('should read the number of characters instead of a %s value', (type) => {
			expect(calcAriaLabel('PIN', type, 'abc')).toBe('PIN 3 characters Input field');
			expect(calcAriaLabel('PIN', type, 'a')).toBe('PIN 1 character Input field');
		});
	});

	describe('convertToPasswordFormat', () => {
		test('should mask each character', () => {
			expect(convertToPasswordFormat('abc')).toBe('***');
		});

		test('should mask with a given replacement', () => {
			expect(convertToPasswordFormat('12', '●')).toBe('●●');
		});

		test('should return an empty string for an empty value', () => {
			expect(convertToPasswordFormat('')).toBe('');
		});
	});

	describe('limitNumberLength', () => {
		let consoleError;

		beforeEach(() => {
			// The limit warnings are expected, so keep them off the console
			consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		});

		test.each([
			['fullscreen', FULLSCREEN_JOINED_DIGITS_LIMIT],
			['overlay', OVERLAY_JOINED_DIGITS_LIMIT]
		])('should cap a %s input at its digit limit and warn', (popupType, limit) => {
			expect(limitNumberLength(popupType, limit + 1)).toBe(limit);
			expect(consoleError.mock.calls.flat().join('\n')).toContain(`must not exceed ${limit} digits`);
		});

		test.each([
			['fullscreen', FULLSCREEN_JOINED_DIGITS_LIMIT],
			['overlay', OVERLAY_JOINED_DIGITS_LIMIT]
		])('should keep a %s length within its limit', (popupType, limit) => {
			expect(limitNumberLength(popupType, limit)).toBe(limit);
			expect(consoleError).not.toHaveBeenCalled();
		});
	});
});
