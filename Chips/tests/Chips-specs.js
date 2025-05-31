import '@testing-library/jest-dom';
import {render, fireEvent, screen} from '@testing-library/react';

import ChipsBase from '../Chips';
import ChipBase from '../Chip';
import Spotlight from '@enact/spotlight';

describe('Chips', () => {
	const mockDeleteHandler = jest.fn();
	const mockButtonKeyDown = jest.fn();

	const defaultProps = {
		orientation: 'vertical',
		children: [
			<ChipBase
				key="chip1"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
				onButtonKeyDown={mockButtonKeyDown}
			>
				Chip 1
			</ChipBase>,
			<ChipBase
				key="chip2"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
				onButtonKeyDown={mockButtonKeyDown}
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

	describe('ChipsBase onButtonKeyDown from delete button', () => {
		let getSpottableSpy, focusSpy;

		beforeEach(() => {
			getSpottableSpy = jest.spyOn(Spotlight, 'getSpottableDescendants').mockImplementation(() => {
				const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
				const chipElements = chipButtons; // [Chip1, Chip2]
				const deleteElements = getAllDeleteButtons(); // [delete0, delete1]

				return [chipElements[0], deleteElements[0], chipElements[1], deleteElements[1]];
			});
			focusSpy = jest.spyOn(Spotlight, 'focus').mockImplementation(() => {});
		});

		afterEach(() => {
			getSpottableSpy.mockRestore();
			focusSpy.mockRestore();
		});

		it('should call onButtonKeyDown when delete button receives key up and then focus on the previous chip (vertical)', () => {
			const mockDeleteHandlerLocal = jest.fn();

			render(
				<ChipsBase orientation="vertical">
					<ChipBase
						key="chip1"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 1
					</ChipBase>
					<ChipBase
						key="chip2"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 2
					</ChipBase>
				</ChipsBase>
			);

			const deleteButtons = getAllDeleteButtons();
			expect(deleteButtons.length).toBe(2);

			deleteButtons[0].focus();
			expect(deleteButtons[0]).toHaveFocus();

			fireEvent.keyDown(deleteButtons[0], {key: 'ArrowUp', keyCode: 38});

			expect(getSpottableSpy).toHaveBeenCalledTimes(1);

			const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
			expect(focusSpy).toHaveBeenCalledWith(chipButtons[0]);
		});

		it('should call onButtonKeyDown when delete button receives key down and then focus on the next chip (vertical)', () => {
			const mockDeleteHandlerLocal = jest.fn();

			render(
				<ChipsBase orientation="vertical">
					<ChipBase
						key="chip1"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 1
					</ChipBase>
					<ChipBase
						key="chip2"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 2
					</ChipBase>
				</ChipsBase>
			);

			const deleteButtons = getAllDeleteButtons();
			expect(deleteButtons.length).toBe(2);

			deleteButtons[0].focus();
			expect(deleteButtons[0]).toHaveFocus();

			fireEvent.keyDown(deleteButtons[0], {key: 'ArrowDown', keyCode: 40});

			expect(getSpottableSpy).toHaveBeenCalledTimes(1);

			const chipElements = screen.getAllByRole('button', {name: /Chip [12]/i});
			expect(focusSpy).toHaveBeenCalledWith(chipElements[1]);
		});

		it('should call onButtonKeyDown when delete button receives key right and then focus on the next chip (horizontal)', () => {
			const mockDeleteHandlerLocal = jest.fn();

			render(
				<ChipsBase orientation="horizontal">
					<ChipBase
						key="chip1"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 1
					</ChipBase>
					<ChipBase
						key="chip2"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 2
					</ChipBase>
				</ChipsBase>
			);

			const deleteButtons = getAllDeleteButtons();
			expect(deleteButtons.length).toBe(2);

			deleteButtons[0].focus();
			expect(deleteButtons[0]).toHaveFocus();

			fireEvent.keyDown(deleteButtons[0], {key: 'ArrowRight', keyCode: 39});

			expect(getSpottableSpy).toHaveBeenCalledTimes(1);

			const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
			expect(focusSpy).toHaveBeenCalledWith(chipButtons[1]);
		});

		it('should call onButtonKeyDown when delete button receives key left and then focus on the previous chip (horizontal)', () => {
			const mockDeleteHandlerLocal = jest.fn();

			render(
				<ChipsBase orientation="horizontal">
					<ChipBase
						key="chip1"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 1
					</ChipBase>
					<ChipBase
						key="chip2"
						deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandlerLocal}}
					>
						Chip 2
					</ChipBase>
				</ChipsBase>
			);

			const deleteButtons = getAllDeleteButtons();
			expect(deleteButtons.length).toBe(2);

			deleteButtons[1].focus();
			expect(deleteButtons[1]).toHaveFocus();

			fireEvent.keyDown(deleteButtons[1], {key: 'ArrowLeft', keyCode: 37});

			expect(getSpottableSpy).toHaveBeenCalledTimes(1);

			const chipButtons = screen.getAllByRole('button', {name: /Chip [12]/i});
			expect(focusSpy).toHaveBeenCalledWith(chipButtons[0]);
		});
	});
});
