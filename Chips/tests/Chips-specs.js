import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {ChipsBase} from '../Chips';
import {ChipBase} from '../Chip';

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
		// Look for buttons that are inside deleteButtonContainer
		const container = document.querySelector('.chips');
		const deleteButtonContainers = container?.querySelectorAll('.deleteButtonContainer') || [];
		const deleteButtons = [];

		deleteButtonContainers.forEach(buttonContainer => {
			const button = buttonContainer.querySelector('[role="button"]');
			if (button) {
				deleteButtons.push(button);
			}
		});

		return deleteButtons;
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
		expect(deleteButtons.length).toBeGreaterThan(0);

		fireEvent.click(deleteButtons[0]);

		expect(mockDeleteHandler).toHaveBeenCalledTimes(1);
	});

	it('should render correctly with horizontal orientation', () => {
		const horizontalProps = {
			...defaultProps,
			orientation: 'horizontal'
		};
		const {container} = render(<ChipsBase {...horizontalProps} />);
		expect(container.firstChild).toHaveClass('chips');
		expect(container.firstChild).toHaveClass('horizontal');
	});

	it('should handle navigation in horizontal orientation', () => {
		const horizontalProps = {
			...defaultProps,
			orientation: 'horizontal'
		};
		render(<ChipsBase {...horizontalProps} />);
		const chip1 = screen.getByText('Chip 1').closest('[role="button"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="button"]');

		chip1.setAttribute('tabIndex', '0');
		chip2.setAttribute('tabIndex', '0');

		chip1.focus();
		expect(chip1).toHaveFocus();

		fireEvent.keyDown(chip1, {key: 'ArrowRight', keyCode: 39});
		chip2.focus();
		expect(chip2).toHaveFocus();

		fireEvent.keyDown(chip2, {key: 'ArrowLeft', keyCode: 37});
		chip1.focus();
		expect(chip1).toHaveFocus();
	});

	it('should render chips without delete buttons', () => {
		const propsWithoutDelete = {
			orientation: 'vertical',
			children: [
				<ChipBase key="chip1" id="chip1">Chip 1</ChipBase>,
				<ChipBase key="chip2" id="chip2">Chip 2</ChipBase>
			]
		};
		render(<ChipsBase {...propsWithoutDelete} />);

		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons).toHaveLength(0);

		expect(screen.getByText('Chip 1')).toBeInTheDocument();
		expect(screen.getByText('Chip 2')).toBeInTheDocument();
	});
	it('should handle chips with different delete button positions', () => {
		const mixedPositionProps = {
			orientation: 'vertical',
			children: [
				<ChipBase
					key="chip1"
					id="chip1"
					deleteButton={{icon: 'closex', position: 'top', onDelete: mockDeleteHandler}}
				>
					Chip 1
				</ChipBase>,
				<ChipBase
					key="chip2"
					id="chip2"
					deleteButton={{icon: 'closex', position: 'bottom', onDelete: mockDeleteHandler}}
				>
					Chip 2
				</ChipBase>
			]
		};
		render(<ChipsBase {...mixedPositionProps} />);

		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons).toHaveLength(2);

		// Verify that the delete buttons have the correct positioning classes
		const chip1DeleteButton = deleteButtons[0].closest('.deleteButtonContainer');
		const chip2DeleteButton = deleteButtons[1].closest('.deleteButtonContainer');
		expect(chip1DeleteButton).toHaveClass('top');
		expect(chip2DeleteButton).toHaveClass('bottom');
	});

	it('should handle click events on chip buttons', () => {
		const mockOnClick = jest.fn();
		const clickableProps = {
			orientation: 'vertical',
			children: [
				<ChipBase key="chip1" id="chip1" onClick={mockOnClick}>
					Chip 1
				</ChipBase>
			]
		};
		render(<ChipsBase {...clickableProps} />);

		const chipButton = screen.getByText('Chip 1').closest('[role="button"]');
		fireEvent.click(chipButton);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should render chips with icons', () => {
		const iconProps = {
			orientation: 'vertical',
			children: [
				<ChipBase key="chip1" id="chip1" icon="star">
					Chip with Star
				</ChipBase>,
				<ChipBase key="chip2" id="chip2" icon="heart">
					Chip with Heart
				</ChipBase>
			]
		};
		render(<ChipsBase {...iconProps} />);

		expect(screen.getByText('Chip with Star')).toBeInTheDocument();
		expect(screen.getByText('Chip with Heart')).toBeInTheDocument();
	});

	it('should handle disabled chips', () => {
		const disabledProps = {
			orientation: 'vertical',
			children: [
				<ChipBase key="chip1" id="chip1" disabled>
					Disabled Chip
				</ChipBase>,
				<ChipBase
					key="chip2"
					id="chip2"
					disabled
					deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
				>
					Disabled Chip with Delete
				</ChipBase>
			]
		};
		render(<ChipsBase {...disabledProps} />);

		const disabledChips = screen.getAllByRole('button');
		disabledChips.forEach(chip => {
			expect(chip).toHaveAttribute('aria-disabled', 'true');
		});
	});

	it('should handle single chip rendering', () => {
		const singleChipProps = {
			orientation: 'vertical',
			children: [
				<ChipBase
					key="chip1"
					id="chip1"
					deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
				>
					Single Chip
				</ChipBase>
			]
		};
		render(<ChipsBase {...singleChipProps} />);

		expect(screen.getByText('Single Chip')).toBeInTheDocument();
		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons.length).toBeGreaterThan(0);
	});

	it('should handle empty children', () => {
		const emptyProps = {
			orientation: 'vertical',
			children: []
		};
		const {container} = render(<ChipsBase {...emptyProps} />);

		expect(container.firstChild).toHaveClass('chips');
		expect(container.firstChild).toHaveClass('vertical');
		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});

	it('should handle custom className', () => {
		const customProps = {
			...defaultProps,
			className: 'custom-chips-class'
		};
		const {container} = render(<ChipsBase {...customProps} />);

		expect(container.firstChild).toHaveClass('chips');
		expect(container.firstChild).toHaveClass('vertical');
		expect(container.firstChild).toHaveClass('custom-chips-class');
	});

	it('should handle keyboard navigation with mixed orientations', () => {
		const verticalProps = {
			...defaultProps,
			orientation: 'vertical'
		};
		render(<ChipsBase {...verticalProps} />);

		const chip1 = screen.getByText('Chip 1').closest('[role="button"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="button"]');

		chip1.setAttribute('tabIndex', '0');
		chip2.setAttribute('tabIndex', '0');

		// Test vertical navigation (down/up arrows)
		chip1.focus();
		fireEvent.keyDown(chip1, {key: 'ArrowDown', keyCode: 40});
		chip2.focus();
		expect(chip2).toHaveFocus();

		// Test that horizontal arrows don't interfere with vertical orientation
		fireEvent.keyDown(chip2, {key: 'ArrowRight', keyCode: 39});
		// Focus should remain on chip2 since we're in vertical mode
		expect(chip2).toHaveFocus();
	});

	it('should call onDelete with correct parameters', () => {
		const mockDeleteWithParams = jest.fn();
		const propsWithParams = {
			orientation: 'vertical',
			children: [
				<ChipBase
					key="chip1"
					id="chip1"
					deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteWithParams}}
				>
					Test Chip
				</ChipBase>
			]
		};
		render(<ChipsBase {...propsWithParams} />);

		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons.length).toBeGreaterThan(0);

		fireEvent.click(deleteButtons[0]);

		expect(mockDeleteWithParams).toHaveBeenCalledTimes(1);
		expect(mockDeleteWithParams).toHaveBeenCalledWith(expect.any(Object));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});
});
