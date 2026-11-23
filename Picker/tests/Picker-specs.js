import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Picker, PickerBase} from '../Picker';

describe('Picker Specs', () => {
	test('should render selected child wrapped with <PickerItem/>', () => {
		render(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);
		const pickerText = screen.getByText('2').parentElement.parentElement;

		const expected = 'item';

		expect(pickerText).toHaveClass(expected);
	});

	test('should set the max of <Picker> to be one less than the number of children', () => {
		render(
			<Picker value={3}>
				{[1, 2, 3, 4]}
			</Picker>
		);
		const arrowForward = screen.getAllByRole('button')[0];

		const expectedValue = 'true';
		const expectedAttribute = 'aria-disabled';

		expect(arrowForward).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should be disabled when empty', () => {
		render(<PickerBase data-testid="picker">{[]}</PickerBase>);
		const picker = screen.getByTestId('picker');

		const expected = 'disabled';

		expect(picker).toHaveAttribute(expected);
	});

	test('should set \'data-webos-voice-disabled\' to decrement button when voice control is disabled', () => {
		render(
			<PickerBase data-webos-voice-disabled>
				{[1, 2, 3, 4]}
			</PickerBase>
		);
		const decrementButton = screen.getAllByRole('button')[1];

		const expected = 'data-webos-voice-disabled';

		expect(decrementButton).toHaveAttribute(expected);
	});

	test('should set \'data-webos-voice-disabled\' to increment button when voice control is disabled', () => {
		render(
			<PickerBase data-webos-voice-disabled>
				{[1, 2, 3, 4]}
			</PickerBase>
		);
		const incrementButton = screen.getAllByRole('button')[0];

		const expected = 'data-webos-voice-disabled';

		expect(incrementButton).toHaveAttribute(expected);
	});

	test('should have a heading element when \'title\'', () => {
		render(
			<PickerBase title="title text">
				{[1, 2, 3, 4]}
			</PickerBase>
		);
		const heading = screen.getByText('title text');

		const expected = 'heading';
		const actual = heading.parentElement.parentElement;

		expect(heading).toBeInTheDocument();
		expect(actual).toHaveClass(expected);
	});

	test('should have a heading element with inline class when \'title\' and \'inlineTitle\'', () => {
		render(
			<PickerBase inlineTitle title="title text">
				{[1, 2, 3, 4]}
			</PickerBase>
		);
		const heading = screen.getByText('title text');

		const expectedInline = 'inlineTitle';
		const expectedHeader = 'heading';
		const actual = heading.parentElement.parentElement;

		expect(heading).toBeInTheDocument();
		expect(actual).toHaveClass(expectedInline);
		expect(actual).toHaveClass(expectedHeader);
	});

	test('should stringify custom voice control labels and set to \'data-webos-voice-labels-ext\'', () => {
		const options = ['Option 1', 'The second one', 'This is the third option', '4'];
		render(
			<Picker data-webos-voice-labels-ext={options} inlineTitle title="title text" >
				{[1, 2, 3, 4]}
			</Picker>
		);

		const picker = screen.getAllByRole('button')[0].parentElement;
		const expected = "[\"Option 1\",\"The second one\",\"This is the third option\",\"4\"]";

		expect(picker).toHaveAttribute('data-webos-voice-labels-ext', expected);
	});

	test('should show value, disabled, and title changes immediately', () => {
		const {rerender} = render(
			<Picker title="First" value={0}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		expect(screen.getByText('One')).toBeInTheDocument();
		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-disabled', 'false');

		rerender(
			<Picker disabled title="Next" value={2}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		expect(screen.getByText('Three')).toBeInTheDocument();
		expect(screen.getByText('Next')).toBeInTheDocument();
		expect(screen.queryByText('First')).not.toBeInTheDocument();
		expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-disabled', 'true');
		expect(screen.getAllByRole('button')[1]).toHaveAttribute('aria-disabled', 'true');
	});

	test('should keep picker buttons spottable when the value changes', () => {
		const {rerender} = render(
			<Picker value={1}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		const buttons = screen.getAllByRole('button');

		expect(buttons[0]).toHaveClass('spottable');
		expect(buttons[1]).toHaveClass('spottable');

		rerender(
			<Picker value={0}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		const nextButtons = screen.getAllByRole('button');

		expect(nextButtons[0]).toHaveClass('spottable');
		expect(nextButtons[1]).toHaveClass('spottable');
		expect(screen.getByText('One')).toBeInTheDocument();

		fireEvent.focus(nextButtons[0]);

		expect(nextButtons[0]).toHaveAttribute('data-spotlight-focused');
	});

	test('should not use children that are not text as voice labels', () => {
		render(
			<Picker>
				{[<span key="one">One</span>, 'Two']}
			</Picker>
		);

		const picker = screen.getAllByRole('button')[0].parentElement;

		expect(picker).toHaveAttribute('data-webos-voice-labels-ext', '["","Two"]');
	});

	test('should change the value in the opposite direction when `reverse` is set on a horizontal Picker', async () => {
		const user = userEvent.setup();
		const handleChange = jest.fn();
		const {rerender} = render(
			<Picker onChange={handleChange} value={1}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		await user.click(screen.getAllByRole('button')[0]);
		const forward = handleChange.mock.calls[0][0].value;

		rerender(
			<Picker onChange={handleChange} reverse value={1}>
				{['One', 'Two', 'Three']}
			</Picker>
		);

		await user.click(screen.getAllByRole('button')[0]);
		const reversed = handleChange.mock.calls[1][0].value;

		expect(forward).not.toBe(reversed);
		expect([forward, reversed].sort()).toEqual([0, 2]);
	});
});
