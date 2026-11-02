import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import Item, {ItemBase} from '../Item';

const longItem = 'A long item label that should marquee only after Spotlight focus';

const mockOverflow = () => {
	const original = global.Element.prototype.getBoundingClientRect;
	global.Element.prototype.getBoundingClientRect = function () {
		const wide = this && this.tagName === 'SPAN';
		return {width: wide ? 400 : 100, height: 20, top: 0, left: 0, bottom: 20, right: wide ? 400 : 100};
	};
	global.IntersectionObserver = class {
		disconnect () {}
		observe () {}
	};
	return () => {
		global.Element.prototype.getBoundingClientRect = original;
	};
};

describe('Item Specs', () => {
	test('should support adding text as a child', () => {
		const expected = 'Hello Item';

		render(<ItemBase>{expected}</ItemBase>);
		const actual = screen.getByText(expected);

		expect(actual).toHaveTextContent(expected);
	});

	test('should support adding a `label`', () => {
		const expected = 'Example Label';

		render(<ItemBase label={expected}>Hello Item</ItemBase>);
		const label = screen.getByText(expected);

		expect(label).toBeInTheDocument();
	});

	test('should support label with 0', () => {
		const expected = '0';

		render(<ItemBase label={expected}>Hello Item</ItemBase>);
		const label = screen.getByText(expected);

		expect(label).toBeInTheDocument();
	});

	test('should support adding text as a child when a label is also set', () => {
		const expected = 'Hello Item';

		render(<ItemBase label="Example Label">{expected}</ItemBase>);
		const actual = screen.getByText(expected);

		expect(actual).toBeInTheDocument();
	});

	test('should support `slotBefore`', () => {
		const expected = 'slot before';

		render(<ItemBase slotBefore={expected}>Hello Item</ItemBase>);
		const actual = screen.getByText(expected);

		expect(actual).toBeInTheDocument();
	});

	test('should support `slotAfter`', () => {
		const expected = 'slot after';

		render(<ItemBase slotAfter={expected}>Hello Item</ItemBase>);
		const actual = screen.getByText(expected);

		expect(actual).toBeInTheDocument();
	});

	test('should support repositioning of the label', () => {
		render(<ItemBase data-testid="item" labelPosition="above" label="my label">Hello Item</ItemBase>);
		const itemLabel = screen.getByTestId('item').children.item(1);

		expect(itemLabel).toHaveClass('labelAbove');
	});

	test('should not include the selected class when not selected', () => {
		render(<ItemBase data-testid="item">Hello Item</ItemBase>);

		const expected = 'selected';
		const actual = screen.getByTestId('item');

		expect(actual).not.toHaveClass(expected);
	});

	test('should add the selected class when given the selected prop', () => {
		render(<ItemBase data-testid="item" selected>Hello Item</ItemBase>);

		const expected = 'selected';
		const actual = screen.getByTestId('item');

		expect(actual).toHaveClass(expected);
	});

	test('should have apply small class when small', function () {
		render(<ItemBase data-testid="item" size="small" />);

		const expected = 'small';
		const actual = screen.getByTestId('item');

		expect(actual).toHaveClass(expected);
	});

	test('should support RTL text', () => {
		const text = 'Hello מצב תמונה';
		render(<ItemBase>{text}</ItemBase>);

		const expected = 'rtl';
		const actual = screen.getByText(text).style;

		expect(actual).toHaveProperty('direction', expected);
	});

	test('should show selected, disabled, and label changes immediately', () => {
		const {rerender} = render(
			<Item data-testid="item" label="First">Hello Item</Item>
		);

		expect(screen.getByTestId('item')).not.toHaveClass('selected');
		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByTestId('item')).not.toHaveAttribute('disabled');

		rerender(
			<Item data-testid="item" disabled label="Second" selected>Hello Item</Item>
		);

		expect(screen.getByTestId('item')).toHaveClass('selected');
		expect(screen.getByText('Second')).toBeInTheDocument();
		expect(screen.queryByText('First')).not.toBeInTheDocument();
		expect(screen.getByTestId('item')).toHaveAttribute('aria-disabled', 'true');
	});

	test('should stay spottable and marquee on focus', () => {
		jest.useFakeTimers();
		const restore = mockOverflow();

		render(<Item data-testid="item">{longItem}</Item>);
		const item = screen.getByTestId('item');

		expect(item).toHaveClass('spottable');

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(screen.getAllByText(longItem).some(node => node.classList.contains('animate'))).toBe(false);

		fireEvent.focus(item);

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(item).toHaveAttribute('data-spotlight-focused');
		expect(screen.getAllByText(longItem).some(node => node.classList.contains('animate'))).toBe(true);

		restore();
		jest.useRealTimers();
	});
});
