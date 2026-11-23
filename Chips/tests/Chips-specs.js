import Spotlight from '@enact/spotlight';
import * as spotlightContainer from '@enact/spotlight/src/container';
import * as spotlightTarget from '@enact/spotlight/src/target';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Chips, {Chip} from '../';
import {ChipsBase} from '../Chips';
import {ChipBase} from '../Chip';

describe('Chips', () => {
	const mockDeleteHandler = jest.fn();

	const defaultProps = {
		orientation: 'vertical',
		children: [
			<ChipBase
				key="chip1"
				id="chip1"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
			>
				Chip 1
			</ChipBase>,
			<ChipBase
				key="chip2"
				id="chip2"
				deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteHandler}}
			>
				Chip 2
			</ChipBase>
		]
	};

	function renderChips ({children, ...rest}) {
		return render(<ChipsBase {...rest}>{children}</ChipsBase>);
	}

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
		const {container} = renderChips(defaultProps);
		expect(container.firstChild.firstChild).toHaveClass('chips');
		expect(container.firstChild.firstChild).toHaveClass('vertical');
	});

	it('should focus the correct chip on navigation', () => {
		renderChips(defaultProps);
		const chip1 = screen.getByText('Chip 1').closest('[role="checkbox"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="checkbox"]');

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
		renderChips(defaultProps);

		const chipButtons = screen.getAllByRole('checkbox', {name: /Chip [12]/i});
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
		const {container} = renderChips(horizontalProps);
		expect(container.firstChild.firstChild).toHaveClass('chips');
		expect(container.firstChild.firstChild).toHaveClass('horizontal');
	});

	it('should handle navigation in horizontal orientation', () => {
		const horizontalProps = {
			...defaultProps,
			orientation: 'horizontal'
		};
		renderChips(horizontalProps);
		const chip1 = screen.getByText('Chip 1').closest('[role="checkbox"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="checkbox"]');

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
		renderChips(propsWithoutDelete);

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
		renderChips(mixedPositionProps);

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
		renderChips(clickableProps);

		const chipButton = screen.getByText('Chip 1').closest('[role="checkbox"]');
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
		renderChips(iconProps);

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
		renderChips(disabledProps);

		const disabledChips = screen.getAllByRole('checkbox');
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
		renderChips(singleChipProps);

		expect(screen.getByText('Single Chip')).toBeInTheDocument();
		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons.length).toBeGreaterThan(0);
	});

	it('should handle empty children', () => {
		const emptyProps = {
			orientation: 'vertical',
			children: []
		};
		const {container} = renderChips(emptyProps);

		expect(container.firstChild.firstChild).toHaveClass('chips');
		expect(container.firstChild.firstChild).toHaveClass('vertical');
		const buttons = screen.queryAllByRole('checkbox');
		expect(buttons).toHaveLength(0);
	});

	it('should handle custom className', () => {
		const customProps = {
			...defaultProps,
			className: 'custom-chips-class'
		};
		const {container} = renderChips(customProps);

		expect(container.firstChild.firstChild).toHaveClass('chips');
		expect(container.firstChild.firstChild).toHaveClass('vertical');
		expect(container.firstChild.firstChild).toHaveClass('custom-chips-class');
	});

	it('should handle keyboard navigation with mixed orientations', () => {
		const verticalProps = {
			...defaultProps,
			orientation: 'vertical'
		};
		renderChips(verticalProps);

		const chip1 = screen.getByText('Chip 1').closest('[role="checkbox"]');
		const chip2 = screen.getByText('Chip 2').closest('[role="checkbox"]');

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
					Chip 1
				</ChipBase>,
				<ChipBase
					key="chip2"
					id="chip2"
					deleteButton={{icon: 'closex', position: 'right', onDelete: mockDeleteWithParams}}
				>
					Chip 2
				</ChipBase>
			]
		};
		renderChips(propsWithParams);

		const deleteButtons = getAllDeleteButtons();
		expect(deleteButtons.length).toBeGreaterThan(0);

		fireEvent.click(deleteButtons[0]);

		expect(mockDeleteWithParams).toHaveBeenCalledTimes(1);
		expect(mockDeleteWithParams).toHaveBeenCalledWith(expect.any(Object));
	});

	describe('focus after deleting a chip', () => {
		let focusSpy;

		beforeEach(() => {
			focusSpy = jest.spyOn(Spotlight, 'focus');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		const getChip = (name) => screen.getByRole('checkbox', {name: new RegExp(name)});
		const getDeleteButton = (name) => screen.getByRole('button', {name: new RegExp(name + ' Delete')});

		it('should focus the next chip when the first chip is deleted', () => {
			renderChips(defaultProps);

			fireEvent.click(getDeleteButton('Chip 1'));

			expect(focusSpy).toHaveBeenCalledWith(getChip('Chip 2'));
		});

		it('should focus the previous chip when a chip after the first one is deleted', () => {
			renderChips(defaultProps);

			fireEvent.click(getDeleteButton('Chip 2'));

			expect(focusSpy).toHaveBeenCalledWith(getChip('Chip 1'));
		});

		it('should focus the nearest target outside the chips when the only chip is deleted', () => {
			render(
				<>
					<button data-testid="outside" />
					<ChipsBase data-testid="chips">
						<ChipBase id="only" deleteButton={{onDelete: mockDeleteHandler}}>Only Chip</ChipBase>
					</ChipsBase>
				</>
			);
			const outside = screen.getByTestId('outside');
			const chips = screen.getByTestId('chips');
			let disabledWhileSearching;
			jest.spyOn(spotlightContainer, 'getAllContainerIds').mockReturnValue(['chips-container', 'other-container']);
			const nearestSpy = jest.spyOn(spotlightTarget, 'getNearestTargetFromPosition').mockImplementation((position, containerId) => {
				disabledWhileSearching = chips.dataset.spotlightContainerDisabled;
				return containerId === 'other-container' ? outside : null;
			});

			fireEvent.click(getDeleteButton('Only Chip'));

			// The chips container is excluded from the search, then restored
			expect(disabledWhileSearching).toBe('true');
			expect(chips.dataset.spotlightContainerDisabled).toBe('false');
			expect(nearestSpy).toHaveBeenCalledTimes(2);
			expect(focusSpy).toHaveBeenCalledWith(outside);
			expect(mockDeleteHandler).toHaveBeenCalledTimes(1);
		});

		it('should focus the remaining chip after deleting two chips in a row', () => {
			const threeChips = [
				...defaultProps.children,
				<ChipBase key="chip3" id="chip3" deleteButton={{onDelete: mockDeleteHandler}}>Chip 3</ChipBase>
			];
			renderChips({children: threeChips});

			fireEvent.click(getDeleteButton('Chip 2'));
			// Chip 2 is no longer registered, so Chip 1 is now the previous chip of Chip 3
			fireEvent.click(getDeleteButton('Chip 3'));

			expect(focusSpy).toHaveBeenLastCalledWith(getChip('Chip 1'));
		});
	});

	describe('5-way navigation from a delete button', () => {
		let focusSpy;

		beforeEach(() => {
			focusSpy = jest.spyOn(Spotlight, 'focus');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		const getChip = (name) => screen.getByRole('checkbox', {name: new RegExp(name)});
		const getDeleteButton = (name) => screen.getByRole('button', {name: new RegExp(name + ' Delete')});

		it.each([
			['vertical', 'up', 38, 'Chip 2', 'Chip 1'],
			['vertical', 'down', 40, 'Chip 1', 'Chip 2'],
			['horizontal', 'left', 37, 'Chip 2', 'Chip 1'],
			['horizontal', 'right', 39, 'Chip 1', 'Chip 2']
		])('should focus the adjacent chip in a %s Chips when pressing %s', (orientation, _, keyCode, from, to) => {
			renderChips({...defaultProps, orientation});

			fireEvent.keyDown(getDeleteButton(from), {keyCode});

			expect(focusSpy).toHaveBeenCalledWith(getChip(to));
		});

		it('should not move to another chip across the Chips orientation', () => {
			renderChips(defaultProps);

			// Right is not along a vertical Chips, so focus falls back to regular spatial navigation
			fireEvent.keyDown(getDeleteButton('Chip 1'), {keyCode: 39});

			expect(focusSpy).not.toHaveBeenCalledWith(getChip('Chip 2'));
		});

		it('should not move past the first chip', () => {
			renderChips(defaultProps);

			fireEvent.keyDown(getDeleteButton('Chip 1'), {keyCode: 38});

			expect(focusSpy).not.toHaveBeenCalledWith(getChip('Chip 2'));
		});
	});

	it('should expose `Chip` as `Chips.Chip`', () => {
		expect(Chips.Chip).toBe(Chip);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});
});
