import '@testing-library/jest-dom';
import {fireEvent, render} from '@testing-library/react';

import Icon from '../../Icon';
import Star from '../Star';

const ID = 'star';

const getStar = () => document.getElementById(ID);

const getFill = () => getStar().style.getPropertyValue('--star-fill');

describe('Star', () => {
	describe('rendering', () => {
		// Icon maps the name `star` to a font glyph, so compare with what Icon renders
		test('should render the `star` icon', () => {
			const {container} = render(<Icon>star</Icon>);
			const expectedGlyph = container.firstChild.textContent;

			render(<Star id={ID} />);

			expect(getStar().textContent).not.toBe('');
			expect(getStar().textContent).toBe(expectedGlyph);
		});

		test('should apply `id` to the root element', () => {
			render(<Star id={ID} />);

			expect(getStar()).toBeInTheDocument();
		});

		test('should have the `star` class', () => {
			render(<Star id={ID} />);

			expect(getStar()).toHaveClass('star');
		});

		test('should keep a custom `className`', () => {
			render(<Star id={ID} className="custom" />);

			expect(getStar()).toHaveClass('star');
			expect(getStar()).toHaveClass('custom');
		});

		test('should not pass `value` or `highlighted` to the DOM', () => {
			render(<Star id={ID} highlighted value={0.5} />);

			expect(getStar()).not.toHaveAttribute('value');
			expect(getStar()).not.toHaveAttribute('highlighted');
		});
	});

	describe('fill (`value` → --star-fill)', () => {
		test('should be empty by default', () => {
			render(<Star id={ID} />);

			expect(getFill()).toBe('0%');
		});

		test.each([
			[0, '0%'],
			[0.1, '10%'],
			[0.5, '50%'],
			[0.7, '70%'],
			[1, '100%']
		])('should fill %p as %s', (value, expected) => {
			render(<Star id={ID} value={value} />);

			expect(getFill()).toBe(expected);
		});

		test.each([
			[0.04, '0%'],
			[0.05, '10%'],
			[0.54, '50%'],
			[0.55, '60%'],
			[0.94, '90%'],
			[0.95, '100%']
		])('should round %p half-up to %s', (value, expected) => {
			render(<Star id={ID} value={value} />);

			expect(getFill()).toBe(expected);
		});

		test.each([
			[-0.5, '0%'],
			[-10, '0%'],
			[1.5, '100%'],
			[10, '100%']
		])('should clamp %p to %s', (value, expected) => {
			render(<Star id={ID} value={value} />);

			expect(getFill()).toBe(expected);
		});

		test('should show an empty star for NaN', () => {
			render(<Star id={ID} value={NaN} />);

			expect(getFill()).toBe('0%');
		});

		test('should keep other inline styles', () => {
			render(<Star id={ID} style={{color: 'red'}} value={0.5} />);

			expect(getStar().style.color).toBe('red');
			expect(getFill()).toBe('50%');
		});
	});

	describe('`highlighted`', () => {
		test('should not have the `highlighted` class by default', () => {
			render(<Star id={ID} />);

			expect(getStar()).not.toHaveClass('highlighted');
		});

		test('should add the `highlighted` class when true', () => {
			render(<Star id={ID} highlighted />);

			expect(getStar()).toHaveClass('highlighted');
		});
	});

	describe('`readOnly`', () => {
		test('should be focusable by default', () => {
			render(<Star id={ID} />);

			expect(getStar()).toHaveClass('spottable');
		});

		test('should not be focusable when true', () => {
			render(<Star id={ID} readOnly />);

			expect(getStar()).not.toHaveClass('spottable');
		});
	});

	describe('`onClick`', () => {
		test('should be called with `{id, ev}`', () => {
			const handleClick = jest.fn();
			render(<Star id={ID} onClick={handleClick} />);

			fireEvent.click(getStar());

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
				id: ID,
				ev: expect.objectContaining({type: 'click'})
			}));
		});

		test('should not be called when read-only', () => {
			const handleClick = jest.fn();
			render(<Star id={ID} readOnly onClick={handleClick} />);

			fireEvent.click(getStar());

			expect(handleClick).not.toHaveBeenCalled();
		});

		test('should not throw on click when no handler is given', () => {
			render(<Star id={ID} />);

			expect(() => fireEvent.click(getStar())).not.toThrow();
		});
	});
});
