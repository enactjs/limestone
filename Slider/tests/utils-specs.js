import {getAutomaticTickLabels, getTickAlignedStep, getTickConfig} from '../utils';

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
});
