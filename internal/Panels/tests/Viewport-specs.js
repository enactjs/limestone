import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {StrictMode} from 'react';

import {SharedState} from '../../SharedStateDecorator';
import {ViewportBase} from '../Viewport';

// Mimics a Panel: Spotlight containers render their `spotlightId` as `data-spotlight-id`
const TestPanel = ({autoFocus, 'data-index': index, spotlightId}) => (
	<div data-autofocus={autoFocus} data-index={index} data-spotlight-id={spotlightId} data-testid={`panel-${index}`}>
		<button data-testid={`button-${index}`} />
	</div>
);

// Viewport only calls `delete` on the shared state context
const createSharedState = () => ({delete: jest.fn()});

// Props for each rendered panel; the array length is the number of panels
const threePanels = [{}, {}, {}];

const renderViewport = (Wrapper, {viewportProps, panels = threePanels} = {}) => {
	const shared = createSharedState();
	const viewport = (index, extraProps, panelList = panels) => (
		<Wrapper>
			<SharedState value={shared}>
				<ViewportBase generateId={(i) => `panel${i}`} index={index} noAnimation {...viewportProps} {...extraProps}>
					{panelList.map((panelProps, i) => <TestPanel key={i} {...panelProps} />)}
				</ViewportBase>
				<button data-testid="outside" />
			</SharedState>
		</Wrapper>
	);
	const {rerender, unmount} = render(viewport(0));

	return {
		shared,
		// Each call re-renders the same Viewport with a new `index` (and optional extra props and panel list)
		rerenderAt: (index, extraProps, panelList) => rerender(viewport(index, extraProps, panelList)),
		unmount
	};
};

const NoWrapper = ({children}) => children;

// `fireEvent` returns `false` when the event was canceled, i.e. captured by `captureKeys`
const isKeyCaptured = () => !fireEvent.keyDown(document.body, {keyCode: 38});

describe('Panels Viewport Specs', () => {
	describe.each([
		['default', NoWrapper],
		['StrictMode', StrictMode]
	])('%s', (_, Wrapper) => {
		test('should set `autoFocus` to "default-element" when moving forward', () => {
			const {rerenderAt} = renderViewport(Wrapper);

			rerenderAt(1);

			expect(screen.getByTestId('panel-1')).toHaveAttribute('data-autofocus', 'default-element');
		});

		test('should not set `autoFocus` when moving backward', () => {
			const {rerenderAt} = renderViewport(Wrapper);

			rerenderAt(2);
			rerenderAt(0);

			expect(screen.getByTestId('panel-0')).not.toHaveAttribute('data-autofocus');
		});

		test('should set `autoFocus` to "default-element" on a re-render after moving backward', () => {
			const {rerenderAt} = renderViewport(Wrapper);

			rerenderAt(2);
			rerenderAt(0);
			// The extra prop only forces another render at the same index
			rerenderAt(0, {'data-rerender': true});

			expect(screen.getByTestId('panel-0')).toHaveAttribute('data-autofocus', 'default-element');
		});

		test('should keep `autoFocus` as "default-element" on a re-render after moving forward', () => {
			const {rerenderAt} = renderViewport(Wrapper);

			rerenderAt(1);
			rerenderAt(1, {'data-rerender': true});

			expect(screen.getByTestId('panel-1')).toHaveAttribute('data-autofocus', 'default-element');
		});

		test('should delete shared state of panels removed by moving backward', () => {
			const {rerenderAt, shared} = renderViewport(Wrapper);

			rerenderAt(2);
			rerenderAt(0);

			// Panels are removed from the highest index down, so panel 2 is deleted before panel 1
			expect(shared.delete.mock.calls).toEqual([[2], [1]]);
		});

		test('should blur the focused element inside the panel being left', () => {
			const {rerenderAt} = renderViewport(Wrapper);
			const button = screen.getByTestId('button-0');
			button.focus();
			const blur = jest.spyOn(button, 'blur');

			rerenderAt(1);

			expect(blur).toHaveBeenCalled();
		});

		test('should not blur a focused element outside the panel being left', () => {
			const {rerenderAt} = renderViewport(Wrapper);
			const outside = screen.getByTestId('outside');
			outside.focus();
			const blur = jest.spyOn(outside, 'blur');

			rerenderAt(1);

			expect(blur).not.toHaveBeenCalled();
			expect(outside).toHaveFocus();
		});

		test('should blur the focused element when the panel being left is removed at the same time', () => {
			const {rerenderAt} = renderViewport(Wrapper);

			rerenderAt(2);
			const button = screen.getByTestId('button-2');
			button.focus();
			const blur = jest.spyOn(button, 'blur');

			// Going back while removing the last panel, as apps with dynamic panels do
			rerenderAt(1, {}, [{}, {}]);

			expect(blur).toHaveBeenCalled();
		});

		test('should pass a Viewport-level `autoFocus` to panels in both directions', () => {
			const {rerenderAt} = renderViewport(Wrapper, {viewportProps: {autoFocus: 'last-focused'}});

			expect(screen.getByTestId('panel-0')).toHaveAttribute('data-autofocus', 'last-focused');

			rerenderAt(2);
			expect(screen.getByTestId('panel-2')).toHaveAttribute('data-autofocus', 'last-focused');

			rerenderAt(1);
			expect(screen.getByTestId('panel-1')).toHaveAttribute('data-autofocus', 'last-focused');
		});

		test('should keep a panel\'s own `autoFocus` over the Viewport-level and direction-based values', () => {
			const panels = [{autoFocus: 'none'}, {autoFocus: '.first-item'}, {}];
			const {rerenderAt} = renderViewport(Wrapper, {viewportProps: {autoFocus: 'last-focused'}, panels});

			rerenderAt(1);
			expect(screen.getByTestId('panel-1')).toHaveAttribute('data-autofocus', '.first-item');

			rerenderAt(0);
			expect(screen.getByTestId('panel-0')).toHaveAttribute('data-autofocus', 'none');
		});

		test('should keep a panel\'s own `autoFocus` when moving forward without a Viewport-level `autoFocus`', () => {
			const {rerenderAt} = renderViewport(Wrapper, {panels: [{}, {autoFocus: 'last-focused'}, {}]});

			rerenderAt(1);

			expect(screen.getByTestId('panel-1')).toHaveAttribute('data-autofocus', 'last-focused');
		});

		describe('5-way key capture', () => {
			beforeEach(() => {
				jest.useFakeTimers();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			const withAnimation = {viewportProps: {noAnimation: false}};

			test('should keep capturing 5-way keys after the transition until focus enters the viewport', () => {
				const {rerenderAt} = renderViewport(Wrapper, withAnimation);

				rerenderAt(1);

				expect(isKeyCaptured()).toBe(true);

				act(() => screen.getByTestId('button-1').focus());

				expect(isKeyCaptured()).toBe(false);
			});

			test('should stop capturing 5-way keys after a timeout when focus never enters the viewport', () => {
				const {rerenderAt} = renderViewport(Wrapper, withAnimation);

				rerenderAt(1);

				act(() => jest.advanceTimersByTime(250));
				expect(isKeyCaptured()).toBe(true);

				act(() => jest.advanceTimersByTime(100));
				expect(isKeyCaptured()).toBe(false);
			});

			test('should not stop capturing 5-way keys when focus moves outside the viewport', () => {
				const {rerenderAt} = renderViewport(Wrapper, withAnimation);

				rerenderAt(1);
				act(() => screen.getByTestId('outside').focus());

				expect(isKeyCaptured()).toBe(true);
			});

			test('should restart capturing when a new transition begins before focus enters the viewport', () => {
				const {rerenderAt} = renderViewport(Wrapper, withAnimation);

				rerenderAt(1);
				act(() => jest.advanceTimersByTime(200));
				rerenderAt(2);

				// the timeout of the first transition must not release the capture of the second one
				act(() => jest.advanceTimersByTime(150));
				expect(isKeyCaptured()).toBe(true);

				act(() => screen.getByTestId('button-2').focus());
				expect(isKeyCaptured()).toBe(false);
			});

			test('should not capture 5-way keys after the transition when `noAnimation`', () => {
				const {rerenderAt} = renderViewport(Wrapper);

				rerenderAt(1);

				expect(isKeyCaptured()).toBe(false);
			});

			test('should stop capturing 5-way keys when unmounted while waiting for focus', () => {
				const {rerenderAt, unmount} = renderViewport(Wrapper, withAnimation);

				rerenderAt(1);
				unmount();

				expect(isKeyCaptured()).toBe(false);
			});
		});
	});
});
