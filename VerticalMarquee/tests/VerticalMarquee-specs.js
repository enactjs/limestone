/* global HTMLElement */

import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import VerticalMarquee from '../VerticalMarquee';

import css from '../VerticalMarquee.module.less';

const longText = 'A long piece of text that is measured as overflowing the visible line count.';

const rect = (height) => ({
	bottom: height,
	height,
	left: 0,
	right: 100,
	top: 0,
	width: 100,
	x: 0,
	y: 0,
	toJSON: () => ({})
});

const mockBox = ({contentHeight, lineHeight}) => {
	const originalStyle = window.getComputedStyle.bind(window);

	jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => {
		const style = originalStyle(node);
		return new Proxy(style, {
			get: (target, prop, receiver) => {
				if (prop === 'lineHeight' || prop === 'fontSize') return `${lineHeight}px`;
				const value = Reflect.get(target, prop, receiver);
				return typeof value === 'function' ? value.bind(target) : value;
			}
		});
	});

	jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
		const height = this.hasAttribute('data-vertical-marquee-measurer') ? contentHeight : 0;
		return rect(height);
	});
};

describe('VerticalMarquee Specs', () => {
	test('should not become focusable on its own when marqueeOn is focus', () => {
		render(<VerticalMarquee data-testid="vertical-marquee">Text</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view).not.toHaveAttribute('tabindex');
	});

	test('should forward tabIndex from the parent', () => {
		render(<VerticalMarquee data-testid="vertical-marquee" tabIndex={-1}>Text</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view).toHaveAttribute('tabindex', '-1');
	});

	test('should mount children once and measure from a DOM clone', () => {
		render(
			<VerticalMarquee data-testid="vertical-marquee">
				<span id="marquee-child">Hello</span>
			</VerticalMarquee>
		);
		const view = screen.getByTestId('vertical-marquee');
		const measurer = view.querySelector('[data-vertical-marquee-measurer]');

		expect(view.querySelectorAll('#marquee-child')).toHaveLength(1);
		expect(measurer).toHaveTextContent('Hello');
		expect(measurer.querySelector('#marquee-child')).toBeNull();
	});

	test('should render its children', () => {
		render(<VerticalMarquee data-testid="vertical-marquee">Hello Vertical Marquee</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view).toHaveTextContent('Hello Vertical Marquee');
		expect(view).toHaveClass(css.verticalMarquee);
	});

	test('should set the visible line count from maxLines', () => {
		render(<VerticalMarquee data-testid="vertical-marquee" maxLines={4}>Lines</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		const expected = '4';
		const actual = view.style.getPropertyValue('--vertical-marquee-lines');

		expect(actual).toBe(expected);
	});

	test('should render a plain block when marqueeDisabled is true', () => {
		render(<VerticalMarquee data-testid="vertical-marquee" marqueeDisabled>Plain text</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view).toHaveTextContent('Plain text');
		expect(view.querySelector('[data-vertical-marquee-measurer]')).toBeNull();
		expect(view.querySelector('[data-vertical-marquee-track]')).toBeNull();
	});

	describe('overflow measurement', () => {
		afterEach(() => {
			jest.useRealTimers();
			jest.restoreAllMocks();
		});

		const setup = ({contentHeight, lineHeight, ...props}) => {
			jest.useFakeTimers();
			mockBox({contentHeight, lineHeight});
			render(
				<VerticalMarquee data-testid="vertical-marquee" {...props}>
					{longText}
				</VerticalMarquee>
			);
			return screen.getByTestId('vertical-marquee');
		};

		test('should scroll one full cycle after focus when text overflows maxLines', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 1000,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			const track = view.querySelector('[data-vertical-marquee-track]');

			expect(view).toHaveClass(css.animate);
			expect(track.style.transform).toBe('translateY(-300px)');
			expect(view.querySelectorAll('[data-vertical-marquee-content]')).toHaveLength(2);
		});

		test('should pause after a cycle and then scroll again', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 1000,
				marqueeResetDelay: 1000,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});
			const track = () => view.querySelector('[data-vertical-marquee-track]');

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(1000);
			});
			fireEvent.transitionEnd(track());

			expect(view).not.toHaveClass(css.animate);
			expect(track().style.transform).toBe('translateY(0)');
			expect(view.querySelectorAll('[data-vertical-marquee-content]')).toHaveLength(2);

			act(() => {
				jest.advanceTimersByTime(2000);
			});

			expect(view).toHaveClass(css.animate);
			expect(track().style.transform).toBe('translateY(-300px)');
		});

		test('should stop scrolling when focus leaves', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});
			fireEvent.blur(view);

			expect(view).not.toHaveClass(css.animate);
			expect(view).not.toHaveClass(css.willAnimate);
			expect(view.querySelectorAll('[data-vertical-marquee-content]')).toHaveLength(1);
		});

		test('should not scroll when the text fits in maxLines', () => {
			const view = setup({
				contentHeight: 20,
				lineHeight: 30,
				marqueeDelay: 0,
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(view).not.toHaveClass(css.animate);
			expect(view.querySelectorAll('[data-vertical-marquee-content]')).toHaveLength(1);
		});
	});
});
