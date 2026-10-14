/* global HTMLElement */

import {add} from '@enact/core/keymap';
import {scale} from '@enact/ui/resolution';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import VerticalMarquee from '../VerticalMarquee';

import css from '../VerticalMarquee.module.less';

const longText = 'A long piece of text that is measured as overflowing the visible line count.';

add('pointerHide', 1537);

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

const mockLineBoxes = (lineRects) => {
	jest.spyOn(document, 'createRange').mockImplementation(() => ({
		getClientRects: () => lineRects,
		selectNodeContents: () => {}
	}));
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

	test('should fall back to one line when maxLines is not positive', () => {
		render(<VerticalMarquee data-testid="vertical-marquee" maxLines={0}>Lines</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view.style.getPropertyValue('--vertical-marquee-lines')).toBe('1');
	});

	test('should apply custom css classes', () => {
		render(<VerticalMarquee css={{verticalMarquee: 'custom'}} data-testid="vertical-marquee">Text</VerticalMarquee>);
		const view = screen.getByTestId('vertical-marquee');

		expect(view).toHaveClass('custom');
	});

	describe('overflow measurement', () => {
		beforeEach(() => {
			global.ResizeObserver = class {
				observe () {}
				disconnect () {}
			};
		});

		afterEach(() => {
			delete global.ResizeObserver;
			jest.useRealTimers();
			jest.restoreAllMocks();
		});

		const setup = ({contentHeight, lineHeight, lineRects, ...props}) => {
			jest.useFakeTimers();
			mockBox({contentHeight, lineHeight});
			if (lineRects) mockLineBoxes(lineRects);
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

		test('should measure clip height from line boxes', () => {
			const view = setup({
				contentHeight: 10,
				lineHeight: 30,
				lineRects: [
					{bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0},
					{bottom: 30, height: 30, left: 0, right: 100, top: 0, width: 100},
					{bottom: 40, height: 40, left: 0, right: 20, top: 0, width: 20},
					{bottom: 60, height: 30, left: 0, right: 100, top: 30, width: 100},
					{bottom: 90, height: 30, left: 0, right: 100, top: 60, width: 100},
					{bottom: 120, height: 30, left: 0, right: 100, top: 90, width: 100}
				],
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			const track = view.querySelector('[data-vertical-marquee-track]');

			expect(view.style.maxHeight).toBe('90px');
			expect(track.style.transform).toBe('translateY(-120px)');
		});

		test('should scroll the block height when it is taller than the glyph boxes', () => {
			const view = setup({
				contentHeight: 200,
				lineHeight: 30,
				lineRects: [
					{bottom: 30, height: 30, left: 0, right: 100, top: 0, width: 100},
					{bottom: 60, height: 30, left: 0, right: 100, top: 30, width: 100},
					{bottom: 90, height: 30, left: 0, right: 100, top: 60, width: 100},
					{bottom: 120, height: 30, left: 0, right: 100, top: 90, width: 100}
				],
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view.style.maxHeight).toBe('90px');
			expect(view.querySelector('[data-vertical-marquee-track]').style.transform).toBe('translateY(-200px)');
		});

		test('should not scroll line boxes that fit in maxLines', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				lineRects: [
					{bottom: 30, height: 30, left: 0, right: 100, top: 0, width: 100},
					{bottom: 60, height: 30, left: 0, right: 100, top: 30, width: 100}
				],
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view).not.toHaveClass(css.animate);
			expect(view.style.maxHeight).toBe('60px');
		});

		test('should use font size when line-height is not a length', () => {
			const originalStyle = window.getComputedStyle.bind(window);
			jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => {
				const style = originalStyle(node);
				return new Proxy(style, {
					get: (target, prop, receiver) => {
						if (prop === 'lineHeight') return 'normal';
						if (prop === 'fontSize') return '30px';
						const value = Reflect.get(target, prop, receiver);
						return typeof value === 'function' ? value.bind(target) : value;
					}
				});
			});
			jest.useFakeTimers();
			jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
				const height = this.hasAttribute('data-vertical-marquee-measurer') ? 100 : 0;
				return rect(height);
			});
			render(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={0} marqueeSpacing="0%" marqueeSpeed={30} maxLines={1}>
					{longText}
				</VerticalMarquee>
			);
			const view = screen.getByTestId('vertical-marquee');

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view.querySelector('[data-vertical-marquee-track]').style.transform).toBe('translateY(-100px)');
		});

		test('should scale numeric spacing', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeSpacing: 48,
				maxLines: 3
			});

			expect(view.style.getPropertyValue('--vertical-marquee-spacing')).toBe(String(scale(48)));
		});

		test('should ignore a spacing value that is not a number or percentage', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeSpacing: 'wide',
				maxLines: 3
			});

			expect(view.style.getPropertyValue('--vertical-marquee-spacing')).toBe('0');
		});

		test('should not scroll when the user prefers reduced motion', () => {
			const originalMatchMedia = window.matchMedia;
			window.matchMedia = () => ({matches: true});
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(view).not.toHaveClass(css.animate);
			window.matchMedia = originalMatchMedia;
		});

		test('should scroll on hover and stop on pointer hide', () => {
			const onMouseEnter = jest.fn();
			const onMouseLeave = jest.fn();
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeOn: 'hover',
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3,
				onMouseEnter,
				onMouseLeave
			});

			fireEvent.focus(view);
			fireEvent.mouseEnter(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(onMouseEnter).toHaveBeenCalled();
			expect(view).toHaveClass(css.animate);

			fireEvent.keyDown(document, {keyCode: 1});
			expect(view).toHaveClass(css.animate);

			fireEvent.keyDown(document, {keyCode: 1537});
			expect(view).not.toHaveClass(css.animate);

			fireEvent.mouseEnter(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});
			fireEvent.mouseLeave(view);

			expect(onMouseLeave).toHaveBeenCalled();
			expect(view).not.toHaveClass(css.animate);
		});

		test('should treat a disabled focus marquee as hover', () => {
			const onFocus = jest.fn();
			const onBlur = jest.fn();
			const view = setup({
				contentHeight: 300,
				disabled: true,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeOn: 'focus',
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3,
				onBlur,
				onFocus
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(onFocus).toHaveBeenCalled();
			expect(view).not.toHaveClass(css.animate);

			fireEvent.mouseEnter(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view).toHaveClass(css.animate);

			fireEvent.blur(view);
			expect(onBlur).toHaveBeenCalled();
			expect(view).toHaveClass(css.animate);

			fireEvent.mouseLeave(view);
			expect(view).not.toHaveClass(css.animate);
		});

		test('should start when marqueeOn is render and stop on unmount', () => {
			jest.useFakeTimers();
			mockBox({contentHeight: 300, lineHeight: 30});
			const {unmount} = render(
				<VerticalMarquee
					data-testid="vertical-marquee"
					marqueeOn="render"
					marqueeOnRenderDelay={500}
					marqueeSpacing="0%"
					marqueeSpeed={30}
					maxLines={3}
				>
					{longText}
				</VerticalMarquee>
			);
			const view = screen.getByTestId('vertical-marquee');

			act(() => {
				jest.advanceTimersByTime(500);
			});

			expect(view).toHaveClass(css.animate);

			unmount();
		});

		test('should ignore a second focus and a mouse leave that does not control the marquee', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});
			fireEvent.focus(view);
			fireEvent.mouseLeave(view);

			expect(view).toHaveClass(css.animate);
			expect(view.querySelector('[data-vertical-marquee-track]').style.transform).toBe('translateY(-300px)');
		});

		test('should ignore a second hover while a hover session is running', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeOn: 'hover',
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});

			fireEvent.mouseEnter(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});
			fireEvent.mouseEnter(view);

			expect(view).toHaveClass(css.animate);
		});

		test('should fall back when the document cannot create a range', () => {
			const originalCreateRange = document.createRange;
			document.createRange = null;
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});
			document.createRange = originalCreateRange;

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view.querySelector('[data-vertical-marquee-track]').style.transform).toBe('translateY(-300px)');
		});

		test('should ignore transitionend that is not the running transform', () => {
			const view = setup({
				contentHeight: 300,
				lineHeight: 30,
				marqueeDelay: 0,
				marqueeSpacing: '0%',
				marqueeSpeed: 30,
				maxLines: 3
			});
			const track = () => view.querySelector('[data-vertical-marquee-track]');

			fireEvent.transitionEnd(track());
			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});
			view.querySelector('[data-vertical-marquee-content]').dispatchEvent(new Event('transitionend', {bubbles: true}));

			const ignored = new Event('transitionend', {bubbles: true});
			Object.defineProperty(ignored, 'propertyName', {value: 'opacity'});
			track().dispatchEvent(ignored);

			expect(view).toHaveClass(css.animate);
			expect(track().style.transform).toBe('translateY(-300px)');
		});

		test('should keep the in-flight distance when measured again', () => {
			jest.useFakeTimers();
			let contentHeight = 300;
			const originalStyle = window.getComputedStyle.bind(window);

			jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => {
				const style = originalStyle(node);
				return new Proxy(style, {
					get: (target, prop, receiver) => {
						if (prop === 'lineHeight' || prop === 'fontSize') return '30px';
						const value = Reflect.get(target, prop, receiver);
						return typeof value === 'function' ? value.bind(target) : value;
					}
				});
			});
			jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
				const height = this.hasAttribute('data-vertical-marquee-measurer') ? contentHeight : 0;
				return rect(height);
			});

			const {rerender} = render(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={0} marqueeSpacing="0%" marqueeSpeed={30} maxLines={3}>
					{longText}
				</VerticalMarquee>
			);
			const view = screen.getByTestId('vertical-marquee');
			const track = () => view.querySelector('[data-vertical-marquee-track]');

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			contentHeight = 500;
			rerender(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={0} marqueeSpacing="0%" marqueeSpeed={30} maxLines={3}>
					{longText} more
				</VerticalMarquee>
			);

			expect(view).toHaveClass(css.animate);
			expect(track().style.transform).toBe('translateY(-300px)');
		});

		test('should start after a later measurement shows overflow', () => {
			jest.useFakeTimers();
			let contentHeight = 20;
			const originalStyle = window.getComputedStyle.bind(window);

			jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => {
				const style = originalStyle(node);
				return new Proxy(style, {
					get: (target, prop, receiver) => {
						if (prop === 'lineHeight' || prop === 'fontSize') return '30px';
						const value = Reflect.get(target, prop, receiver);
						return typeof value === 'function' ? value.bind(target) : value;
					}
				});
			});
			jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
				const height = this.hasAttribute('data-vertical-marquee-measurer') ? contentHeight : 0;
				return rect(height);
			});

			const {rerender} = render(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={0} marqueeSpacing="0%" marqueeSpeed={30} maxLines={3}>
					{longText}
				</VerticalMarquee>
			);
			const view = screen.getByTestId('vertical-marquee');

			fireEvent.focus(view);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view).not.toHaveClass(css.animate);

			contentHeight = 300;
			rerender(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={0} marqueeSpacing="0%" marqueeSpeed={30} maxLines={3}>
					{longText} more
				</VerticalMarquee>
			);
			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(view).toHaveClass(css.animate);
			expect(view.querySelector('[data-vertical-marquee-track]').style.transform).toBe('translateY(-300px)');
		});

		test('should stop a running session when the text no longer overflows', () => {
			jest.useFakeTimers();
			let contentHeight = 300;
			const originalStyle = window.getComputedStyle.bind(window);

			jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => {
				const style = originalStyle(node);
				return new Proxy(style, {
					get: (target, prop, receiver) => {
						if (prop === 'lineHeight' || prop === 'fontSize') return '30px';
						const value = Reflect.get(target, prop, receiver);
						return typeof value === 'function' ? value.bind(target) : value;
					}
				});
			});
			jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
				const height = this.hasAttribute('data-vertical-marquee-measurer') ? contentHeight : 0;
				return rect(height);
			});

			const {rerender} = render(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={1000} marqueeSpacing="0%" marqueeSpeed={0} maxLines={3}>
					{longText}
				</VerticalMarquee>
			);
			const view = screen.getByTestId('vertical-marquee');

			fireEvent.focus(view);
			contentHeight = 20;
			rerender(
				<VerticalMarquee data-testid="vertical-marquee" marqueeDelay={1000} marqueeSpacing="0%" marqueeSpeed={0} maxLines={3}>
					{longText} short
				</VerticalMarquee>
			);

			expect(view).not.toHaveClass(css.animate);
			expect(view).not.toHaveClass(css.willAnimate);
		});
	});
});
