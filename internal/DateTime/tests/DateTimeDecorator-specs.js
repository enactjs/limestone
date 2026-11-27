import Spotlight from '@enact/spotlight';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {DateTimeDecorator} from '../';

describe('DateTimeDecorator', () => {
	test('should accept an updated JavaScript Date for its value prop', () => {
		const Picker = DateTimeDecorator({}, function PickerBase ({title, value}) {
			const minuteValue = value.getMinutes();
			return <div title={title}>{minuteValue}</div>;
		});

		const {rerender} = render(
			<Picker
				title="Date"
				value={new Date(2000, 0, 1, 12, 30)}
				locale="en-US"
			/>
		);

		rerender(
			<Picker
				title="Date"
				value={new Date(2000, 0, 1, 12, 45)}
				locale="en-US"
			/>
		);

		const expected = '45';
		const actual = screen.getByTitle('Date').textContent;

		expect(actual).toBe(expected);
	});

	test('should keep the generated value after mount when no value is set', () => {
		const renderedValues = [];
		const Picker = DateTimeDecorator({}, function PickerBase ({value}) {
			renderedValues.push(value);
			return <div />;
		});

		render(<Picker locale="en-US" />);

		// Without a value, a value is generated on mount. It should not be replaced by an empty
		// value before it comes back from `onChange`, which would animate the pickers.
		expect(renderedValues.length).toBeGreaterThan(0);
		renderedValues.forEach((value) => expect(value).toBeTruthy());
	});

	test('should emit onChange with the generated value on mount when no value is set', () => {
		const handleChange = jest.fn();
		const Picker = DateTimeDecorator({}, function PickerBase () {
			return <div />;
		});

		render(<Picker locale="en-US" onChange={handleChange} />);

		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange.mock.calls[0][0].value).toBeInstanceOf(Date);
	});

	test('should clear its value when the value prop changes to null', () => {
		const Picker = DateTimeDecorator({}, function PickerBase ({title, value}) {
			return <div title={title}>{value ? value.getMinutes() : 'empty'}</div>;
		});

		const {rerender} = render(
			<Picker
				title="Date"
				value={new Date(2000, 0, 1, 12, 30)}
				locale="en-US"
			/>
		);

		rerender(
			<Picker
				title="Date"
				value={null}
				locale="en-US"
			/>
		);

		const expected = 'empty';
		const actual = screen.getByTitle('Date').textContent;

		expect(actual).toBe(expected);
	});

	describe('enter key', () => {
		const Picker = DateTimeDecorator({}, function PickerBase ({onKeyDown}) {
			return (
				<div onKeyDown={onKeyDown}>
					<button>first</button>
					<button data-last-element="true">last</button>
				</div>
			);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		test('should complete with the current value when enter is pressed on the last picker', () => {
			const handleComplete = jest.fn();
			const value = new Date(2000, 0, 1, 12, 30);
			render(<Picker locale="en-US" onComplete={handleComplete} value={value} />);

			fireEvent.keyDown(screen.getByText('last'), {keyCode: 13});

			expect(handleComplete).toHaveBeenCalledTimes(1);
			expect(handleComplete.mock.calls[0][0].value.getTime()).toBe(value.getTime());
		});

		test.each([
			['right', false],
			['left', true]
		])('should move focus %s to the next picker when enter is pressed on another picker', (direction, rtl) => {
			const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);
			const handleComplete = jest.fn();
			render(<Picker locale="en-US" onComplete={handleComplete} rtl={rtl} value={new Date(2000, 0, 1)} />);

			fireEvent.keyDown(screen.getByText('first'), {keyCode: 13});

			expect(moveSpy).toHaveBeenCalledWith(direction);
			expect(handleComplete).not.toHaveBeenCalled();
		});

		test('should ignore keys other than enter', () => {
			const moveSpy = jest.spyOn(Spotlight, 'move');
			render(<Picker locale="en-US" value={new Date(2000, 0, 1)} />);

			fireEvent.keyDown(screen.getByText('first'), {keyCode: 40});

			expect(moveSpy).not.toHaveBeenCalled();
		});
	});
});
