import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {CardBase} from '../Card';

const src = {
	'hd': 'https://placehold.co/200x200/000000/ffffff/png',
	'fhd': 'https://placehold.co/300x300/000000/ffffff/png',
	'uhd': 'https://placehold.co/600x600/000000/ffffff/png'
};

describe('Card', () => {
	test('should support `captionOverlay` prop', () => {
		const children = 'children';
		render(<CardBase data-testid="card" captionOverlay src={src}>{children}</CardBase>);

		const expected = 'captionOverlay';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `roundedImage` prop', () => {
		render(<CardBase data-testid="card" roundedImage src={src} />);

		const expected = 'roundedImage';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `hasContainer` prop', () => {
		render(<CardBase data-testid="card" hasContainer src={src} />);

		const expected = 'hasContainer';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `withoutMarquee` prop', () => {
		const children = 'very very very very very very very very long children';
		render(<CardBase data-testid="card" withoutMarquee src={src}>{children}</CardBase>);

		const expected = 'withoutMarquee';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `imageIconSrc` prop when `orientation="vertical"`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase imageIconSrc={imageIconSrc} orientation="vertical" />);

		const expected = imageIconSrc;
		const actual = screen.getAllByRole('img')[2].children.item(0);

		expect(actual).toHaveAttribute('src', expected);
	});

	test('should not support `imageIconSrc` prop when `orientation="horizontal"`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase imageIconSrc={imageIconSrc} orientation="horizontal" />);

		const expected = 2;
		const actual = screen.getAllByRole('img').length;

		expect(actual).toBe(expected);
	});

	test('should apply prop `fitImage`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase data-testid="card" fitImage imageIconSrc={imageIconSrc} />);

		const expected = 'fitImage';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});
});
