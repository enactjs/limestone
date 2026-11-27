import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';

import Heading, {HeadingBase} from '../Heading';

const longHeading = 'A long heading that should start scrolling as soon as it renders, with no focus needed';

const mockOverflow = () => {
	const originalGetBoundingClientRect = global.Element.prototype.getBoundingClientRect;
	const originalIntersectionObserver = global.IntersectionObserver;
	global.Element.prototype.getBoundingClientRect = function () {
		const wide = this && this.tagName === 'SPAN';
		return {width: wide ? 400 : 100, height: 20, top: 0, left: 0, bottom: 20, right: wide ? 400 : 100};
	};
	global.IntersectionObserver = class {
		disconnect () {}
		observe () {}
	};
	return () => {
		global.Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
		// jsdom has no IntersectionObserver, so remove it
		if (originalIntersectionObserver) {
			global.IntersectionObserver = originalIntersectionObserver;
		} else {
			delete global.IntersectionObserver;
		}
	};
};

describe('Heading Specs', () => {

	test('should render a Heading with content', () => {
		const content = 'Hello Heading!';
		render(<HeadingBase data-testid="heading">{content}</HeadingBase>);
		const heading = screen.getByTestId('heading').textContent;

		expect(heading).toBe(content);
	});

	test('should add the showLine class', () => {
		render(<HeadingBase data-testid="heading" showLine>check</HeadingBase>);
		const heading = screen.getByTestId('heading');

		const expected = 'showLine';

		expect(heading).toHaveClass(expected);
	});

	test('should have large class if `size` is large', () => {
		render(<HeadingBase data-testid="heading" size="large">Hello Heading</HeadingBase>);
		const heading = screen.getByTestId('heading');

		const expected = 'large';

		expect(heading).toHaveClass(expected);
	});

	test('should have small class if `size` is small', () => {
		render(<HeadingBase data-testid="heading" size="small">Hello Heading</HeadingBase>);
		const heading = screen.getByTestId('heading');

		const expected = 'small';

		expect(heading).toHaveClass(expected);
	});

	test('should have tiny class if `size` is tiny', () => {
		render(<HeadingBase data-testid="heading" size="tiny">Hello Heading</HeadingBase>);
		const heading = screen.getByTestId('heading');

		const expected = 'tiny';

		expect(heading).toHaveClass(expected);
	});

	test('should marquee long text on render without focus', () => {
		jest.useFakeTimers();
		const restore = mockOverflow();

		try {
			render(<Heading>{longHeading}</Heading>);

			act(() => {
				jest.advanceTimersByTime(1000);
			});

			const copies = screen.getAllByText(longHeading);

			expect(copies.some(node => node.classList.contains('animate'))).toBe(true);
		} finally {
			restore();
			jest.useRealTimers();
		}
	});
});
