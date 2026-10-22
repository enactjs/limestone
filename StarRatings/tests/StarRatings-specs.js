import '@testing-library/jest-dom';
import {act, fireEvent, render} from '@testing-library/react';

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
			render(<StarRatings id={ID} defaultValue={1} onChange={handleChange} />);

			fireEvent.click(getStar(3));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 3}));
			expect(handleChange.mock.calls[0][0].normalized).toBeUndefined();
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

	// Spec: selecting starts at 3 stars; the app must hold the rating the user sees
	describe('shown value sync', () => {
		test('should report the default 3 stars when no value is set', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith({value: 3, normalized: true});
			expect(getFilledTotal()).toBe(3);
		});

		test.each([
			['0', {value: 0}, 1],
			['a value above max', {value: 7}, 5],
			['a fraction', {value: 2.6}, 3],
			['NaN', {value: NaN}, 3],
			['a default value of 0', {defaultValue: 0}, 1],
			['the default above a smaller max', {max: 2}, 2]
		])('should report the shown rating for %s', (_, props, expected) => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} {...props} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith({value: expected, normalized: true});
		});

		test('should store the reported rating when `value` is not set', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={9} onChange={handleChange} />);

			fireEvent.click(getStar(5));

			// 9 was stored as 5, so selecting star 5 is still reported, and nothing loops
			expect(handleChange).toHaveBeenCalledTimes(2);
			expect(getFilledTotal()).toBe(5);
		});

		test.each([
			['a whole value', {value: 4}],
			['a whole default value', {defaultValue: 2}],
			['read-only', {readOnly: true}],
			['read-only with a fraction', {readOnly: true, value: 2.5}],
			['disabled', {disabled: true}]
		])('should not call `onChange` for %s', (_, props) => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} {...props} onChange={handleChange} />);

			expect(handleChange).not.toHaveBeenCalled();
		});

		test('should report once when a controlled parent ignores it', () => {
			const handleChange = jest.fn();
			const {rerender} = render(<StarRatings id={ID} value={0} onChange={handleChange} />);
			rerender(<StarRatings id={ID} value={0} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledTimes(1);
		});

		test('should report again when the shown rating changes', () => {
			const handleChange = jest.fn();
			const {rerender} = render(<StarRatings id={ID} value={0} onChange={handleChange} />);
			rerender(<StarRatings id={ID} value={8} onChange={handleChange} />);

			expect(handleChange).toHaveBeenLastCalledWith({value: 5, normalized: true});
			expect(handleChange).toHaveBeenCalledTimes(2);
		});

		test('should report again after the app goes back to the same value', () => {
			const handleChange = jest.fn();
			const {rerender} = render(<StarRatings id={ID} value={0} onChange={handleChange} />);
			rerender(<StarRatings id={ID} value={4} onChange={handleChange} />);
			rerender(<StarRatings id={ID} value={0} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledTimes(2);
		});

		test('should report when leaving read-only mode', () => {
			const handleChange = jest.fn();
			const {rerender} = render(<StarRatings id={ID} readOnly value={2.5} onChange={handleChange} />);
			rerender(<StarRatings id={ID} value={2.5} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledWith({value: 3, normalized: true});
		});

		test('should report when enabled', () => {
			const handleChange = jest.fn();
			const {rerender} = render(<StarRatings id={ID} disabled onChange={handleChange} />);
			rerender(<StarRatings id={ID} onChange={handleChange} />);

			expect(handleChange).toHaveBeenCalledWith({value: 3, normalized: true});
		});

		test('should not report from `StarRatingsBase`', () => {
			const handleChange = jest.fn();
			render(<StarRatingsBase id={ID} onChange={handleChange} />);

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	// While selecting, the stars up to and including the focused one are filled as a preview
	describe('focus preview', () => {
		const focus = (el) => act(() => el.focus());

		const renderWithOutside = (props) => render(
			<div>
				<StarRatings id={ID} {...props} />
				<button id="outside">outside</button>
			</div>
		);

		test('should fill up to a higher focused star without changing the value', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={3} onChange={handleChange} />);

			focus(getStar(5));

			expect(getFilledTotal()).toBe(5);
			expect(handleChange).not.toHaveBeenCalled();
		});

		test('should fill only up to a lower focused star', () => {
			render(<StarRatings id={ID} defaultValue={4} />);

			focus(getStar(2));

			expect(getFills()).toEqual(['100%', '100%', '0%', '0%', '0%']);
		});

		test('should follow focus from star to star', () => {
			render(<StarRatings id={ID} defaultValue={3} />);

			focus(getStar(5));
			focus(getStar(1));

			expect(getFilledTotal()).toBe(1);
		});

		test('should show the selected rating again when focus leaves the row', () => {
			renderWithOutside({defaultValue: 3});

			focus(getStar(5));
			focus(document.getElementById('outside'));

			expect(getFilledTotal()).toBe(3);
		});

		test('should select the previewed star on click', () => {
			const handleChange = jest.fn();
			renderWithOutside({defaultValue: 3, onChange: handleChange});

			focus(getStar(4));
			fireEvent.click(getStar(4));
			focus(document.getElementById('outside'));

			expect(handleChange).toHaveBeenCalledWith({value: 4});
			expect(getFilledTotal()).toBe(4);
		});

		test('should keep the selected star marked while previewing', () => {
			render(<StarRatings id={ID} defaultValue={3} />);

			focus(getStar(5));

			expect(getStar(3)).toHaveAttribute('data-star-selected');
			expect(getStar(5)).not.toHaveAttribute('data-star-selected');
		});

		test('should not preview when disabled', () => {
			render(<StarRatings id={ID} disabled defaultValue={2} />);

			focus(getStar(5));

			expect(getStar(5)).toHaveFocus();
			expect(getFilledTotal()).toBe(2);
		});

		test('should forward `onFocus` and `onBlur`', () => {
			const handleFocus = jest.fn();
			const handleBlur = jest.fn();
			renderWithOutside({onBlur: handleBlur, onFocus: handleFocus});

			focus(getStar(2));
			focus(document.getElementById('outside'));

			expect(handleFocus).toHaveBeenCalledTimes(1);
			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		test('should fill up to `focusedStar` in `StarRatingsBase`', () => {
			render(<StarRatingsBase id={ID} focusedStar={4} value={2} />);

			expect(getFilledTotal()).toBe(4);
		});

		test.each([
			['read-only', {readOnly: true, value: 2.5}, 2.5],
			['disabled', {disabled: true, value: 2}, 2]
		])('should ignore `focusedStar` when %s', (_, props, expected) => {
			render(<StarRatingsBase id={ID} focusedStar={4} {...props} />);

			expect(getFilledTotal()).toBe(expected);
		});
	});

	// Spotlight enters the row at this star, so Enter keeps the shown rating
	describe('selected star', () => {
		const getSelected = () => getStars().filter((star) => star.hasAttribute('data-star-selected'));

		test('should mark star 3 when no value is set', () => {
			render(<StarRatings id={ID} />);

			expect(getSelected()).toEqual([getStar(3)]);
		});

		test('should mark the clamped value', () => {
			render(<StarRatings id={ID} value={0} />);

			expect(getSelected()).toEqual([getStar(1)]);
		});

		test('should follow the selection', () => {
			render(<StarRatings id={ID} />);

			fireEvent.click(getStar(5));

			expect(getSelected()).toEqual([getStar(5)]);
		});

		test('should not mark a star when read-only', () => {
			render(<StarRatings id={ID} readOnly value={3} />);

			expect(getSelected()).toEqual([]);
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

		const touchStartOn = (star) => {
			document.elementFromPoint = jest.fn(() => star);
			fireEvent.touchStart(document.getElementById(ID), {
				touches: [{clientX: 0, clientY: 0}]
			});
		};

		// Spec (touch drag, step 1 to 2): with 3 stars, pressing star 4 selects 4 right away
		test('should select the pressed star as soon as the finger lands', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={3} onChange={handleChange} />);

			touchStartOn(getStar(4));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith({value: 4});
			expect(getFilledTotal()).toBe(4);
			expect(getStar(4)).toHaveFocus();
		});

		test('should not call `onChange` when pressing the shown star', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);
			handleChange.mockClear(); // the mount sync of the default 3

			touchStartOn(getStar(3));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getStar(3)).toHaveFocus();
		});

		test('should keep updating while dragging after the press', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={3} onChange={handleChange} />);

			touchStartOn(getStar(4));
			touchMoveOver(getStar(5));
			touchMoveOver(document.body);

			expect(handleChange.mock.calls.map(([ev]) => ev.value)).toEqual([4, 5]);
			expect(getFilledTotal()).toBe(5);
		});

		test('should keep the value when the press is outside the stars', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={2} onChange={handleChange} />);

			touchStartOn(document.body);

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(2);
		});

		test.each([
			['disabled', {disabled: true}],
			['read-only', {readOnly: true}]
		])('should not select on press when %s', (_, props) => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={2} {...props} onChange={handleChange} />);

			touchStartOn(getStar(4));

			expect(handleChange).not.toHaveBeenCalled();
			expect(getFilledTotal()).toBe(2);
		});

		// The press already selected the star, so the click on release would call `onChange` again
		test('should cancel the click that follows the touch', () => {
			render(<StarRatings id={ID} defaultValue={3} />);

			touchStartOn(getStar(4));

			expect(fireEvent.touchEnd(document.getElementById(ID))).toBe(false);
		});

		test.each([
			['disabled', {disabled: true}],
			['read-only', {readOnly: true}]
		])('should not cancel the touch end when %s', (_, props) => {
			render(<StarRatings id={ID} {...props} />);

			expect(fireEvent.touchEnd(document.getElementById(ID))).toBe(true);
		});

		test('should call `onChange` with the star under the finger', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);

			touchMoveOver(getStar(4));

			expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({value: 4}));
			expect(getFilledTotal()).toBe(4);
		});

		test('should not call `onChange` again while staying on the same star', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={1} onChange={handleChange} />);

			touchMoveOver(getStar(2));
			touchMoveOver(getStar(2));

			expect(handleChange).toHaveBeenCalledTimes(1);
		});

		test('should keep the last value when the finger leaves the row', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} defaultValue={1} onChange={handleChange} />);

			touchMoveOver(getStar(3));
			touchMoveOver(document.body);

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(getFilledTotal()).toBe(3);
		});

		// Regression: the star was compared with the raw `value` (undefined), not the 3 shown
		test('should not call `onChange` when moving on the shown default star', () => {
			const handleChange = jest.fn();
			render(<StarRatings id={ID} onChange={handleChange} />);
			handleChange.mockClear(); // the mount sync, covered in "shown value sync"

			touchMoveOver(getStar(3));

			expect(handleChange).not.toHaveBeenCalled();
		});

		test('should compare with the clamped value in `StarRatingsBase`', () => {
			const handleChange = jest.fn();
			render(<StarRatingsBase id={ID} value={7} onChange={handleChange} />);

			touchMoveOver(getStar(5));

			expect(handleChange).not.toHaveBeenCalled();
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
