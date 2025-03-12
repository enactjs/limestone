import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Radio, {RadioBase} from '.././Radio';

describe('Radio Specs', () => {

	test('should not include the selected class when not selected', () => {
		render(<RadioBase />);

		const radioElement = screen.getByRole('checkbox');

		expect(radioElement).not.toHaveClass('selected');
	});

	test('should not be checked', () => {
		render(<RadioBase />);

		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-checked', 'false');
	});

	test('should add the selected class when given the selected prop', () => {
		render(<RadioBase selected />);

		const radioElement = screen.getByRole('checkbox');
		const expected = 'selected';

		expect(radioElement).toHaveClass(expected);
	});

	test('should be checked when initiated with `selected` prop', () => {
		render(<RadioBase selected />);

		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-checked', 'true');
	});

	test('should check the radio with one click', async () => {
		const user = userEvent.setup();
		render(<Radio />);

		const actual = screen.getByRole('checkbox');
		const expected = 'selected';

		await user.click(actual);

		expect(actual).toHaveClass(expected);
	});

	test('should uncheck the radio with two clicks', async () => {
		const user = userEvent.setup();
		render(<Radio />);

		const actual = screen.getByRole('checkbox');
		const expected = 'selected';

		await user.click(actual);
		await user.click(actual);

		expect(actual).not.toHaveClass(expected);
	});
});
