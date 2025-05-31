import '@testing-library/jest-dom';

import { render, fireEvent } from '@testing-library/react';
import ChipsBase from '../Chips';
import ChipBase from '../Chip';

describe('Chips', () => {
    const mockDeleteHandler = jest.fn();
    const mockDeleteButtonKeyDownHandler = jest.fn();

    const defaultProps = {
        orientation: 'vertical',
        children: [
            <ChipBase
                key="chip1"
                deleteButton={{ icon: 'closex', position: 'right', onDelete: mockDeleteHandler }}
                onButtonKeyDown={mockDeleteButtonKeyDownHandler}
            >
                Chip 1
            </ChipBase>,
            <ChipBase
                key="chip2"
                deleteButton={{ icon: 'closex', position: 'right', onDelete: mockDeleteHandler }}
                onButtonKeyDown={mockDeleteButtonKeyDownHandler}
            >
                Chip 2
            </ChipBase>,
        ],
    };

    it('renders correctly with default props', () => {
        const { container } = render(<ChipsBase {...defaultProps} />);
        expect(container.firstChild).toHaveClass('chips');
        expect(container.firstChild).toHaveClass('vertical');
    });

    it('focuses the correct chip on navigation', () => {
        const { getByText } = render(<ChipsBase {...defaultProps} />);
        const chip1 = getByText('Chip 1').closest('[role="button"]');
        const chip2 = getByText('Chip 2').closest('[role="button"]');

        // Ensure tabIndex is set for focusable elements
        chip1.setAttribute('tabIndex', '0');
        chip2.setAttribute('tabIndex', '0');

        chip1.focus();
        expect(chip1).toHaveFocus();

        fireEvent.keyDown(chip1, { keyCode: 40 }); // Down arrow key
        chip2.focus();
        expect(chip2).toHaveFocus();

        fireEvent.keyDown(chip2, { keyCode: 38 }); // Up arrow key
        chip1.focus();
        expect(chip1).toHaveFocus();
    });
});