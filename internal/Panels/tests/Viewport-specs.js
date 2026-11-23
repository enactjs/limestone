import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {createRef} from 'react';

import {ViewportBase} from '../Viewport';

const keyUp = 38;

// `fireEvent` returns `false` when the event was canceled (i.e. captured by `captureKeys`)
const isKeyCaptured = () => !fireEvent.keyDown(document.body, {keyCode: keyUp});

const TestPanel = ({children, 'data-index': index}) => (
	<div data-index={index}>
		{children}
	</div>
);

const generateId = (index) => `panel-${index}`;

const renderViewport = (props = {}) => {
	const ref = createRef();
	const view = render(
		<ViewportBase generateId={generateId} ref={ref} {...props}>
			<TestPanel>
				<button>Inside</button>
			</TestPanel>
		</ViewportBase>
	);

	return {ref, ...view};
};

describe('Viewport Specs', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		document.activeElement?.blur?.();
	});

	test('should capture 5-way keys while transitioning', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));

		expect(isKeyCaptured()).toBe(true);

		unmount();
	});

	test('should keep capturing 5-way keys after the transition until focus enters the viewport', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));
		act(() => ref.current.handleTransition({}));

		expect(isKeyCaptured()).toBe(true);

		act(() => screen.getByText('Inside').focus());

		expect(isKeyCaptured()).toBe(false);

		unmount();
	});

	test('should stop capturing 5-way keys after a timeout when focus never enters the viewport', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));
		act(() => ref.current.handleTransition({}));

		act(() => jest.advanceTimersByTime(250));
		expect(isKeyCaptured()).toBe(true);

		act(() => jest.advanceTimersByTime(100));
		expect(isKeyCaptured()).toBe(false);

		unmount();
	});

	test('should stop capturing 5-way keys immediately after the transition when focus is already within the viewport', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));
		act(() => screen.getByText('Inside').focus());
		act(() => ref.current.handleTransition({}));

		expect(isKeyCaptured()).toBe(false);

		unmount();
	});

	test('should stop capturing 5-way keys immediately after the transition when `noAnimation`', () => {
		const {ref, unmount} = renderViewport({noAnimation: true});

		act(() => ref.current.handleWillTransition({}));
		act(() => ref.current.handleTransition({}));

		expect(isKeyCaptured()).toBe(false);

		unmount();
	});

	test('should restart capturing when a new transition begins before focus enters the viewport', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));
		act(() => ref.current.handleTransition({}));
		act(() => ref.current.handleWillTransition({}));

		// the pending timeout from the first transition must not release the capture
		act(() => jest.advanceTimersByTime(1000));
		expect(isKeyCaptured()).toBe(true);

		act(() => ref.current.handleTransition({}));
		act(() => screen.getByText('Inside').focus());
		expect(isKeyCaptured()).toBe(false);

		unmount();
	});

	test('should stop capturing 5-way keys when unmounted while waiting for focus', () => {
		const {ref, unmount} = renderViewport();

		act(() => ref.current.handleWillTransition({}));
		act(() => ref.current.handleTransition({}));

		unmount();

		expect(isKeyCaptured()).toBe(false);
	});
});
