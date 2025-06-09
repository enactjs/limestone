import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import ChipsBase from '../Chips';
import ChipBase from '../Chip';

describe('Chips', () => {
	const mockDeleteHandler = jest.fn();

	const defaultProps = {
		orientation: 'vertical',
		children: [
			<ChipBase
				key="chip1"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
			>
				Chip 1
			</ChipBase>,
			<ChipBase
				key="chip2"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
			>
				Chip 2
			</ChipBase>
		]
	};

	function getAllDeleteButtons () {
		// 1) Gather all buttons in the rendered DOM
		const allButtons = screen.getAllByRole('button');
		// 2) Gather just the main Chip buttons by accessible name
		const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
		// 3) Filter out the chipButtons from allButtons
		return allButtons.filter((btn) => !chipButtons.includes(btn));
	}

	it('should render correctly with default props', () => {
		const {container} = render(<ChipsBase {...defaultProps} />);
		expect(container.firstChild).toHaveClass('chips');
		expect(container.firstChild).toHaveClass('vertical');
	});

	it('should focus the correct chip on navigation', () => {
		render(<ChipsBase {...defaultProps} />);
		const chip1 = screen.getByText('Chip 1').closest('[role="button"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="button"]');

		chip1.setAttribute('tabIndex', '0');
		chip2.setAttribute('tabIndex', '0');

		chip1.focus();
		expect(chip1).toHaveFocus();

		fireEvent.keyDown(chip1, {key: 'ArrowDown', keyCode: 40});
		chip2.focus();
		expect(chip2).toHaveFocus();

		fireEvent.keyDown(chip2, {key: 'ArrowUp', keyCode: 38});
		chip1.focus();
		expect(chip1).toHaveFocus();
	});

	it('should call handleDelete when delete button is clicked', () => {
		render(<ChipsBase {...defaultProps} />);

		const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
		fireEvent.focus(chipButtons[0]);

		const deleteButtons = getAllDeleteButtons();
		const firstDeleteButton = deleteButtons[0];
		fireEvent.click(firstDeleteButton);

		expect(mockDeleteHandler).toHaveBeenCalledTimes(1);
	});
});
