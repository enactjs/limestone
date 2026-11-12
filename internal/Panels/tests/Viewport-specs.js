import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {StrictMode} from 'react';

import {SharedState} from '../../SharedStateDecorator';
import {ViewportBase} from '../Viewport';

const TestPanel = ({autoFocus, 'data-index': index}) => (
	<div data-autofocus={autoFocus} data-index={index} data-testid={`panel-${index}`} />
);

// Viewport only calls `delete` on the shared state context
const createSharedState = () => ({delete: jest.fn()});

const renderViewport = (Wrapper) => {
	const shared = createSharedState();
	const viewport = (index, extraProps) => (
		<Wrapper>
			<SharedState value={shared}>
				<ViewportBase generateId={(i) => `panel${i}`} index={index} noAnimation {...extraProps}>
					<TestPanel />
					<TestPanel />
					<TestPanel />
				</ViewportBase>
			</SharedState>
		</Wrapper>
	);
	const {rerender} = render(viewport(0));

	return {
		shared,
		// Each call re-renders the same Viewport with a new `index` (and optional extra props)
		rerenderAt: (index, extraProps) => rerender(viewport(index, extraProps))
	};
};

const NoWrapper = ({children}) => children;

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

		test('should delete shared state of panels removed by moving backward', () => {
			const {rerenderAt, shared} = renderViewport(Wrapper);

			rerenderAt(2);
			rerenderAt(0);

			// Panels are removed from the highest index down, so panel 2 is deleted before panel 1
			expect(shared.delete.mock.calls).toEqual([[2], [1]]);
		});
	});
});
