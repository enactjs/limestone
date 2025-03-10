import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioButton, {RadioButtonBase} from '../RadioButton';

describe('RadioButton Specs', () => {

	test('should not include the selected class when not selected', () => {
		render(<RadioButtonBase />);
		const radioButtonElement = screen.getByRole('checkbox');

		expect(radioButtonElement).not.toHaveClass('selected');
	});

	test('should not be checked', () => {
		render(<RadioButtonBase />);

		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-checked', 'false');
	});

	test('should add the selected class when given the selected prop', () => {
		render(<RadioButtonBase selected />);
		const checkboxElement = screen.getByRole('checkbox');

		const expected = 'selected';

		expect(checkboxElement).toHaveClass(expected);
	});

	test('should be checked when initiated with `selected` prop', () => {
		render(<RadioButtonBase selected />);

		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-checked', 'true');
	});

	test('should check the radioButton with one click', async () => {
		const user = userEvent.setup();
		render(<RadioButton />);

		const actual = screen.getByRole('checkbox');
		const expected = 'selected';

		await user.click(actual);

		expect(actual).toHaveClass(expected);
	});

	test('should uncheck the radioButton with two clicks', async () => {
		const user = userEvent.setup();
		render(<RadioButton />);

		const actual = screen.getByRole('checkbox');
		const expected = 'selected';

		await user.click(actual);
		await user.click(actual);

		expect(actual).not.toHaveClass(expected);
	});
});
