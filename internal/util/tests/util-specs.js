import '@testing-library/jest-dom';
import {render} from '@testing-library/react';

import {compareChildren, onlyUpdateForProps} from '../util';

describe('internal util', () => {
	describe('compareChildren', () => {
		test('should match string children with the same values', () => {
			expect(compareChildren(['a', 'b'], ['a', 'b'])).toBe(true);
		});

		test('should not match string children with a different value', () => {
			expect(compareChildren(['a', 'b'], ['a', 'c'])).toBe(false);
		});

		test('should compare object children by value', () => {
			expect(compareChildren([{key: 'a', children: 'A'}], [{key: 'a', children: 'A'}])).toBe(true);
			expect(compareChildren([{key: 'a', children: 'A'}], [{key: 'a', children: 'B'}])).toBe(false);
		});

		test('should not match children of a different length or missing children', () => {
			expect(compareChildren(['a'], ['a', 'b'])).toBe(false);
			expect(compareChildren(null, ['a'])).toBe(false);
		});
	});

	describe('onlyUpdateForProps', () => {
		test('should re-render only when one of the given props changes', () => {
			const renderSpy = jest.fn(() => null);
			const Component = onlyUpdateForProps(renderSpy, ['value']);

			const {rerender} = render(<Component other={1} value={1} />);
			rerender(<Component other={2} value={1} />);

			expect(renderSpy).toHaveBeenCalledTimes(1);

			rerender(<Component other={2} value={2} />);

			expect(renderSpy).toHaveBeenCalledTimes(2);
		});

		test('should always re-render when no prop keys are given', () => {
			const renderSpy = jest.fn(() => null);
			const Component = onlyUpdateForProps(renderSpy);

			const {rerender} = render(<Component value={1} />);
			rerender(<Component value={1} />);

			expect(renderSpy).toHaveBeenCalledTimes(2);
		});
	});
});
