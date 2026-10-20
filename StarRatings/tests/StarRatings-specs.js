import '@testing-library/jest-dom';
import {fireEvent, render} from '@testing-library/react';

import {FILL_STEPS} from '../Star';
import StarRatings, {StarRatingsBase} from '../StarRatings';

const ID = 'rating';

const getStar = (number) => document.getElementById(`${ID}-star-${number}`);

const getStars = () => Array.from(document.querySelectorAll(`[id^="${ID}-star-"]`));

// Fill of each star as rendered, e.g. ['100%', '100%', '50%', '0%', '0%']
const getFills = () => getStars().map((star) => star.style.getPropertyValue('--star-fill'));

// Total number of stars filled, e.g. 2.5: each star's fill position is mapped back to its tenth
// (sums whole tenths to avoid float error)
const getFilledTotal = () => getFills().reduce((sum, fill) => {
	const tenths = FILL_STEPS.indexOf(parseInt(fill));
	if (tenths < 0) throw new Error(`unexpected --star-fill ${fill}`);
	return sum + tenths;
}, 0) / 10;

describe('StarRatings', () => {
	describe('read-only rounding (spec: half-up to one decimal place)', () => {
		// Regression: per-star subtraction made 2.55 - 2 = 0.5499…, which rounded down to 50%
		test('should fill 2.5 stars for 2.54', () => {
			render(<StarRatings id={ID} readOnly value={2.54} />);

			expect(getFills()).toEqual(['100%', '100%', '50%', '0%', '0%']);
			expect(getFilledTotal()).toBe(2.5);
		});

		test('should fill 2.6 stars for 2.55', () => {
			render(<StarRatings id={ID} readOnly value={2.55} />);

			expect(getFills()).toEqual(['100%', '100%', '55%', '0%', '0%']);
			expect(getFilledTotal()).toBe(2.6);
		});

		test.each([
			[0.04, 0],
			[0.05, 0.1],
			[1.15, 1.2],
			[1.45, 1.5],
			[3.3, 3.3],
			[3.75, 3.8],
			[4.94, 4.9],
			[4.95, 5]
		])('should fill %p as %p stars', (value, expected) => {
			render(<StarRatings id={ID} readOnly value={value} />);

			expect(getFilledTotal()).toBe(expected);
		});

		test.each([
			[-1, 0],
			[0, 0],
			[7, 5],
			[null, 0],
			[NaN, 0]
		])('should clamp %p to %p stars', (value, expected) => {
			render(<StarRatings id={ID} readOnly value={value} />);

			expect(getFilledTotal()).toBe(expected);
		});

		test('should show no stars when `value` is not set', () => {
			render(<StarRatings id={ID} readOnly />);

			expect(getFilledTotal()).toBe(0);
		});
	});

	describe('selecting rounding (whole stars, 1 to max)', () => {
		test.each([
			[3, 3],
			[2.4, 2],
			[2.5, 3],
			[3.3, 3],
			[0.3, 1],
			[7, 5]
		])('should show %p as %p stars', (value, expected) => {
			render(<StarRatings id={ID} value={value} />);

			expect(getFilledTotal()).toBe(expected);
		});

		// Spec: the lowest selectable value is 1
		test.each([
			[0],
			[-1]
		])('should clamp %p up to 1 star', (value) => {
			render(<StarRatings id={ID} value={value} />);

			expect(getFilledTotal()).toBe(1);
		});

		// Spec: 3 is the recommended default selection
		test('should show 3 stars when neither `value` nor `defaultValue` is set', () => {
			render(<StarRatings id={ID} />);

			expect(getFilledTotal()).toBe(3);
		});

		test.each([
			[null],
			[NaN]
		])('should show the default 3 stars for %p', (value) => {
			render(<StarRatings id={ID} value={value} />);

			expect(getFilledTotal()).toBe(3);
		});

		test('should clamp the default to `max`', () => {
			render(<StarRatings id={ID} max={2} />);

			expect(getFilledTotal()).toBe(2);
		});

		test('should let the user change the default selection', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			fireEvent.click(getStar(5));

			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 5}));
			expect(getFilledTotal()).toBe(5);
		});

		test('should start from `defaultValue` when `value` is not set', () => {
			render(<StarRatings id={ID} defaultValue={2} />);

			expect(getFilledTotal()).toBe(2);
		});
	});

	describe('switching modes', () => {
		test('should show the same `value` in both modes', () => {
			const {rerender} = render(<StarRatings id={ID} readOnly value={3.3} />);
			expect(getFilledTotal()).toBe(3.3);

			rerender(<StarRatings id={ID} value={3.3} />);
			expect(getFilledTotal()).toBe(3);
		});
	});

	describe('rendering', () => {
		test('should render 5 stars by default', () => {
			render(<StarRatings id={ID} />);

			expect(getStars()).toHaveLength(5);
		});

		test('should not use `overlayMode` on the stars by default', () => {
			render(<StarRatings id={ID} />);

			getStars().forEach((star) => expect(star).not.toHaveClass('overlayMode'));
		});

		test('should pass `overlayMode` to every star', () => {
			render(<StarRatings id={ID} overlayMode readOnly value={2.5} />);

			getStars().forEach((star) => expect(star).toHaveClass('overlayMode'));
			expect(document.getElementById(ID)).not.toHaveAttribute('overlaymode');
		});

		test('should render `max` stars', () => {
			render(<StarRatings id={ID} max={10} readOnly value={7.5} />);

			expect(getStars()).toHaveLength(10);
			expect(getFilledTotal()).toBe(7.5);
		});

		test('should add the `readOnly` class when read-only', () => {
			render(<StarRatings id={ID} readOnly />);

			expect(document.getElementById(ID)).toHaveClass('readOnly');
		});

		test('should not add the `readOnly` class when selecting', () => {
			render(<StarRatings id={ID} />);

			expect(document.getElementById(ID)).not.toHaveClass('readOnly');
		});
	});

	describe('read-only mode', () => {
		test('should not make stars focusable', () => {
			render(<StarRatings id={ID} readOnly value={3} />);

			getStars().forEach((star) => expect(star).not.toHaveClass('spottable'));
		});

		test('should not call `onChange` or change the value on click', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} readOnly defaultValue={3} onChange={handleChange} />);

			fireEvent.click(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(3);
		});
	});

	describe('selecting mode', () => {
		test('should make stars focusable', () => {
			render(<StarRatings id={ID} />);

			getStars().forEach((star) => expect(star).toHaveClass('spottable'));
		});

		test('should call `onChange` with the number of the clicked star', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			fireEvent.click(getStar(3));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 3}));
		});

		test('should remember the clicked star when `value` is not set', () => {
			render(<StarRatings id={ID} />);

			fireEvent.click(getStar(4));

			expect(getFilledTotal()).toBe(4);
		});

		test('should keep showing a controlled `value` until the parent updates it', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} value={2} onChange={handleChange} />);

			fireEvent.click(getStar(4));

			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 4}));
			expect(getFilledTotal()).toBe(2);
		});
	});

	describe('disabled', () => {
		test('should not be disabled by default', () => {
			render(<StarRatings id={ID} />);

			expect(document.getElementById(ID)).not.toHaveClass('disabled');
			getStars().forEach((star) => expect(star).not.toHaveAttribute('disabled'));
		});

		test('should mark the component and every star as disabled', () => {
			render(<StarRatings id={ID} disabled />);

			const row = document.getElementById(ID);
			expect(row).toHaveClass('disabled');
			expect(row).toHaveAttribute('aria-disabled', 'true');
			getStars().forEach((star) => expect(star).toHaveAttribute('disabled'));
		});

		test('should still show the rating', () => {
			render(<StarRatings id={ID} disabled value={4} />);

			expect(getFilledTotal()).toBe(4);
		});

		test('should still show decimals when also read-only', () => {
			render(<StarRatings id={ID} disabled readOnly value={2.55} />);

			expect(getFilledTotal()).toBe(2.6);
		});

		// Limestone convention: disabled controls can still receive focus
		test('should keep the stars focusable while selecting', () => {
			render(<StarRatings id={ID} disabled />);

			getStars().forEach((star) => expect(star).toHaveClass('spottable'));
		});

		test('should not make the stars focusable when also read-only', () => {
			render(<StarRatings id={ID} disabled readOnly value={3} />);

			getStars().forEach((star) => expect(star).not.toHaveClass('spottable'));
		});

		test('should not call `onChange` or change the value on click', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} disabled defaultValue={2} onChange={handleChange} />);

			fireEvent.click(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(2);
		});
	});

	describe('touch drag', () => {
		const originalElementFromPoint = document.elementFromPoint;

		afterEach(() => {
			document.elementFromPoint = originalElementFromPoint;
		});

		// jsdom has no layout, so point the "finger" at a given star
		const touchMoveOver = (star) => {
			document.elementFromPoint = jest.fn(() => star);
			fireEvent.touchMove(document.getElementById(ID), {
				touches: [{clientX: 0, clientY: 0}]
			});
		};

		test('should call `onChange` with the star under the finger', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			touchMoveOver(getStar(4));

			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 4}));
			expect(getFilledTotal()).toBe(4);
		});

		test('should not call `onChange` again while staying on the same star', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			touchMoveOver(getStar(2));
			touchMoveOver(getStar(2));

			expect(handleChange).toHaveBeenCalledTimes(1);
		});

		test('should keep the last value when the finger leaves the row', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			touchMoveOver(getStar(3));
			touchMoveOver(document.body);

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(getFilledTotal()).toBe(3);
		});

		test('should not call `onChange` when disabled', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} disabled defaultValue={2} onChange={handleChange} />);

			touchMoveOver(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(2);
		});

		// Changeable also blocks `onChange` when disabled, so test the base component on its own
		test('should not call `onChange` from `StarRatingsBase` when disabled', () => {
			const handleChange = jest.fn();
			render(<StarRatingsBase id={ID} disabled value={2} onChange={handleChange} />);

			touchMoveOver(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
		});

		test('should not move focus to the touched star when disabled', () => {
			render(<StarRatings id={ID} disabled />);

			touchMoveOver(getStar(4));

			expect(getStar(4)).not.toHaveFocus();
		});

		test('should move focus to the touched star while selecting', () => {
			render(<StarRatings id={ID} />);

			touchMoveOver(getStar(4));

			expect(getStar(4)).toHaveFocus();
		});

		test('should not call `onChange` when read-only', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} readOnly defaultValue={1} onChange={handleChange} />);

			touchMoveOver(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(1);
		});
	});
});
