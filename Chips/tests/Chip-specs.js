import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {ChipBase} from '../Chip';

describe('Chip', () => {
	test('should support `icon` prop', () => {
		const icon = 'star';
		render(<ChipBase data-testid="chip" icon={icon} />);

		const expected = 983080; // decimal converted charCode of Unicode 'star' character
		const actual = screen.getByTestId('chip').textContent.codePointAt();

		expect(actual).toBe(expected);
	});

	test('should support image if prop `isImage` is `true', () => {
		const svg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiB2aWV3Qm94PSIwIDAgNzAwIDcwMCI+PGRlZnM+PHN0eWxlPi5hLC5ie2ZpbGw6I2ZmZjt9LmJ7b3BhY2l0eTowLjg7fTwvc3R5bGU+PC9kZWZzPjxwb2x5Z29uIGNsYXNzPSJhIiBwb2ludHM9IjM0OS45IDUyNy44IDE5OS45IDQyOS44IDE5OS45IDM3NC40IDM1MC4xIDQ3Mi43IDM0OS45IDM0OC41IDE5OS45IDI2MS4xIDE5OS45IDIwOS4zIDM1MCAyOTMuNiAzNTAgMjkzLjYgMzUwLjIgMjkzLjcgMzQ5LjkgMTY5LjMgMTAyLjcgNDguNSAxMDIuNyA0NzIuNiAzNTAuMSA2NTEuNiAzNDkuOSA1MjcuOCIvPjxwb2x5Z29uIGNsYXNzPSJiIiBwb2ludHM9IjM1MC4xIDY1MS42IDU5Ny4zIDQ3Mi44IDU5Ny4zIDM2Ni4zIDM0OS45IDUyNy44IDM1MC4xIDY1MS42Ii8+PHBvbHlnb24gY2xhc3M9ImIiIHBvaW50cz0iMzUwLjEgNDcyLjcgNTIzLjUgMzU5LjMgNTIzLjUgMjQ3LjQgMzQ5LjkgMzQ4LjUgMzUwLjEgNDcyLjciLz48cG9seWdvbiBjbGFzcz0iYiIgcG9pbnRzPSIzNTAgMjkzLjYgMzUwIDI5My42IDM1MC4yIDI5My43IDU5Ny4zIDE1NC44IDU5Ny4zIDQ4LjQgMzQ5LjkgMTY5LjMgMzUwIDI5My42Ii8+PC9zdmc+';
		render(<ChipBase data-testid="chip" icon={svg} isImage />);

		const actual = screen.queryAllByRole('img')[0].firstChild;

		expect(actual).toHaveAttribute('src', svg);
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

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).toHaveClass(position);
	});

	test('should apply `.bottom` when direction prop is `bottom`', () => {
		const position = 'bottom';
		render(<ChipBase data-testid="chip" deleteButton={{position}} />);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).toHaveClass(position);
	});

	test('should apply `.right` when direction prop is `right`', () => {
		const position = 'right';
		render(<ChipBase data-testid="chip" deleteButton={{position}} />);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).toHaveClass(position);
	});

	test('should render without delete button when deleteButton is false', () => {
		render(<ChipBase data-testid="chip" deleteButton={false}>Test Chip</ChipBase>);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).not.toBeInTheDocument();
	});

	test('should render without delete button when deleteButton is undefined', () => {
		render(<ChipBase data-testid="chip">Test Chip</ChipBase>);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).not.toBeInTheDocument();
	});

	test('should handle disabled state', () => {
		render(<ChipBase data-testid="chip" disabled>Disabled Chip</ChipBase>);

		const chipButton = screen.getByRole('button');
		expect(chipButton).toHaveAttribute('aria-disabled', 'true');
	});

	test('should handle disabled state with delete button', () => {
		render(
			<ChipBase
				data-testid="chip"
				disabled
				deleteButton={{position: 'right'}}
			>
				Disabled Chip
			</ChipBase>
		);

		const allButtons = screen.getAllByRole('button');
		allButtons.forEach(button => {
			expect(button).toHaveAttribute('aria-disabled', 'true');
		});
	});

	test('should use default delete button icon when not specified', () => {
		render(<ChipBase data-testid="chip" deleteButton={{position: 'right'}}>Test Chip</ChipBase>);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).toBeInTheDocument();
	});

	test('should use custom delete button icon when specified', () => {
		render(
			<ChipBase
				data-testid="chip"
				deleteButton={{position: 'right', icon: 'trash'}}
			>
				Test Chip
			</ChipBase>
		);

		const chip = screen.getByTestId('chip');
		const deleteButton = chip.querySelector('.deleteButtonContainer');

		expect(deleteButton).toBeInTheDocument();
	});

	test('should handle id prop', () => {
		const chipId = 'test-chip-id';
		render(<ChipBase id={chipId}>Test Chip</ChipBase>);

		const chipButton = screen.getByRole('button');
		expect(chipButton).toHaveAttribute('data-chip-index', chipId);
	});

	test('should handle onClick events', () => {
		const mockOnClick = jest.fn();
		render(<ChipBase onClick={mockOnClick}>Clickable Chip</ChipBase>);

		const chipButton = screen.getByRole('button');
		fireEvent.click(chipButton);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	test('should render with both icon and children', () => {
		const icon = 'star';
		const children = 'Star Chip';
		render(<ChipBase data-testid="chip" icon={icon}>{children}</ChipBase>);

		const chipText = screen.getByText(children);
		expect(chipText).toBeInTheDocument();

		const expected = 983080; // decimal converted charCode of Unicode 'star' character
		const actual = screen.getByTestId('chip').textContent.codePointAt();
		expect(actual).toBe(expected);
	});

	test('should apply custom className', () => {
		const customClass = 'custom-chip-class';
		render(<ChipBase className={customClass} data-testid="chip">Test Chip</ChipBase>);

		const chipButton = screen.getByRole('button');
		expect(chipButton).toHaveClass(customClass);
	});

	test('should render chip with required props only', () => {
		render(<ChipBase id="minimal-chip">Minimal Chip</ChipBase>);

		const chipText = screen.getByText('Minimal Chip');
		expect(chipText).toBeInTheDocument();

		const chipButton = screen.getByRole('button');
		expect(chipButton).toHaveAttribute('data-chip-index', 'minimal-chip');
	});
});
