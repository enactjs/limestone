import {getAutomaticTickLabels, getFocusedTickIndex, getTickAlignedStep, getTickConfig} from '../utils';

describe('Slider utils', () => {
	describe('getTickConfig', () => {
		test('should return no ticks by default', () => {
			const actual = getTickConfig();

			expect(actual).toEqual({
				count: 0,
				tickLabels: null,
				startLabel: null,
				endLabel: null
			});
		});

		test('should follow the label count when ticks is true', () => {
			const actual = getTickConfig(true, ['A', 'B', 'C', 'D']);

			expect(actual.count).toBe(4);
			expect(actual.tickLabels).toEqual(['A', 'B', 'C', 'D']);
		});

		test('should use five ticks when ticks is true and alignStepsWithTicks is set', () => {
			const actual = getTickConfig(true, null, {alignStepsWithTicks: true, max: 10, min: 0, step: 1});

			expect(actual.count).toBe(5);
		});

		test('should use the default tick count when the step range is invalid', () => {
			const actual = getTickConfig(true, null, {max: 0, min: 10, step: 1});

			expect(actual.count).toBe(5);
		});

		test('should use the default tick count when there are fewer than three step stops', () => {
			const actual = getTickConfig(true, null, {max: 1, min: 0, step: 1});

			expect(actual.count).toBe(5);
		});

		test('should return side labels when two labels are provided', () => {
			const actual = getTickConfig(5, ['Start', 'End']);

			expect(actual).toMatchObject({
				count: 5,
				tickLabels: null,
				startLabel: 'Start',
				endLabel: 'End'
			});
		});
	});

	describe('getAutomaticTickLabels', () => {
		test('should return null when fewer than three ticks are requested', () => {
			expect(getAutomaticTickLabels(0, 100, 2)).toBeNull();
		});

		test('should format non-finite values as empty strings', () => {
			expect(getAutomaticTickLabels(NaN, 100, 3)).toEqual(['', '', '']);
		});
	});

	describe('getTickAlignedStep', () => {
		test('should return null when fewer than three ticks are provided', () => {
			expect(getTickAlignedStep(0, 100, 2)).toBeNull();
		});

		test('should return null when the range is not positive', () => {
			expect(getTickAlignedStep(100, 0, 5)).toBeNull();
			expect(getTickAlignedStep(50, 50, 5)).toBeNull();
		});

		test('should divide the range by the number of tick intervals', () => {
			expect(getTickAlignedStep(0, 100, 5)).toBe(25);
		});
	});

	describe('getFocusedTickIndex', () => {
		test('should return the tick index when the value lands on a tick', () => {
			expect(getFocusedTickIndex(0, 0, 100, 5)).toBe(0);
			expect(getFocusedTickIndex(50, 0, 100, 5)).toBe(2);
			expect(getFocusedTickIndex(100, 0, 100, 5)).toBe(4);
		});

		test('should return the nearest tick when the value is between ticks', () => {
			expect(getFocusedTickIndex(10, 0, 100, 5)).toBe(0);
			expect(getFocusedTickIndex(40, 0, 100, 3)).toBe(1);
			expect(getFocusedTickIndex(90, 0, 100, 5)).toBe(4);
		});

		test('should clamp values outside the range onto the end ticks', () => {
			expect(getFocusedTickIndex(-10, 0, 100, 5)).toBe(0);
			expect(getFocusedTickIndex(140, 0, 100, 5)).toBe(4);
		});

		test('should return -1 when a tick cannot be resolved', () => {
			expect(getFocusedTickIndex(0, 0, 100, 1)).toBe(-1);
			expect(getFocusedTickIndex(0, 100, 0, 5)).toBe(-1);
			expect(getFocusedTickIndex(NaN, 0, 100, 5)).toBe(-1);
		});
	});
});
