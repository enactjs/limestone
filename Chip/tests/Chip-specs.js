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

	test('should support `label` prop', () => {
		const label = 'label';
		render(<ChipBase label={label} />);

		const expected = label;
		const actual = screen.getByText(label);

		expect(actual).toHaveTextContent(expected);
	});

	test('should apply `.top` when direction prop is `top`', () => {
		const direction = 'top';
		render(<ChipBase data-testid="chip" direction={direction} />);

		const expected = 'top';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});

	test('should apply `.bottom` when direction prop is `bottom`', () => {
		const direction = 'bottom';
		render(<ChipBase data-testid="chip" direction={direction} />);

		const expected = 'bottom';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});

	test('should apply `.right` when direction prop is `right`', () => {
		const direction = 'right';
		render(<ChipBase data-testid="chip" direction={direction} />);

		const expected = 'right';
		const chip = screen.getByTestId('chip');

		expect(chip).toHaveClass(expected);
	});

	test('should not apply `.focused` when hasDeleteButton prop is `true`', () => {
		const hasDeleteButton = true;
		render(<ChipBase data-testid="chip" hasDeleteButton={hasDeleteButton} />);

		const expected = 'focused';
		const chip = screen.getByTestId('chip');

		expect(chip).not.toHaveClass(expected);
	});
});
