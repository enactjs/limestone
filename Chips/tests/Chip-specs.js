import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {ChipBase} from '../Chip';

describe('Chip', () => {
	test('should support `icon` prop', () => {
		const icon = 'star';
		render(<ChipBase data-testid="chip" icon={icon} />);

		const expected = 983080; // decimal converted charCode of Unicode 'star' character
		const actual = screen.getByTestId('chip').textContent.codePointAt();

		expect(actual).toBe(expected);
	});

	test('should support `children` prop', () => {
		const children = 'label';
		render(<ChipBase>{children}</ChipBase>);

		const expected = children;
		const actual = screen.getByText(children);

		expect(actual).toHaveTextContent(expected);
	});

	test('should apply `.top` when direction prop is `top`', () => {
		const position = 'top';
		render(<ChipBase data-testid="chip" deleteButton={{position}} />);

		const expected = 'top';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});

	test('should apply `.bottom` when direction prop is `bottom`', () => {
		const position = 'bottom';
		render(<ChipBase data-testid="chip" deleteButton={{position}} />);

		const expected = 'bottom';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});

	test('should apply `.right` when direction prop is `right`', () => {
		const position = 'right';
		render(<ChipBase data-testid="chip" deleteButton={{position}} />);

		const expected = 'right';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});
});
