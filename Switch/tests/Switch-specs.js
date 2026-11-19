import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Switch, {BounceOnToggle, SwitchBase} from '../Switch';

describe('Switch Specs', () => {
	test('should not have `selected` className', () => {
		render(<SwitchBase />);

		const unexpected = 'selected';
		const actual = screen.getByRole('button');

		expect(actual).not.toHaveClass(unexpected);
	});

	test('should have `selected` className', () => {
		render(<SwitchBase selected />);

		const expected = 'selected';
		const actual = screen.getByRole('button');

		expect(actual).toHaveClass(expected);
	});

	test('should have `animated` className', () => {
		render(<SwitchBase />);

		const expected = 'animated';
		const actual = screen.getByRole('button');

		expect(actual).toHaveClass(expected);
	});

	test('should not have `animated` className when `noAnimation`', () => {
		render(<SwitchBase noAnimation />);

		const unexpected = 'animated';
		const actual = screen.getByRole('button');

		expect(actual).not.toHaveClass(unexpected);
	});

	test('toggle Switch', async () => {
		const handleToggle = jest.fn();
		const user = userEvent.setup();
		render(<Switch onToggle={handleToggle} />);

		const actual = screen.getByRole('button');

		await user.click(actual);

		const expectedClass = 'selected';
		expect(actual).toHaveClass(expectedClass);

		const expectedTimes = 1;
		expect(handleToggle).toHaveBeenCalledTimes(expectedTimes);
	});

	test('should have `bouncing` className when `bouncing`', () => {
		render(<SwitchBase bouncing selected />);

		const expected = 'bouncing';
		const actual = screen.getByRole('button');

		expect(actual).toHaveClass(expected);
	});

	test('should not have `bouncing` className when `noAnimation`', () => {
		render(<SwitchBase bouncing noAnimation selected />);

		const unexpected = 'bouncing';
		const actual = screen.getByRole('button');

		expect(actual).not.toHaveClass(unexpected);
	});

	describe('BounceOnToggle', () => {
		const Bounceable = BounceOnToggle(SwitchBase);

		test('should not bounce when a selected switch first mounts', () => {
			render(<Bounceable selected />);

			const unexpected = 'bouncing';
			const actual = screen.getByRole('button');

			expect(actual).not.toHaveClass(unexpected);
		});

		test('should not bounce when a selected switch re-mounts', () => {
			const {unmount} = render(<Bounceable selected />);
			unmount();
			render(<Bounceable selected />);

			const unexpected = 'bouncing';
			const actual = screen.getByRole('button');

			expect(actual).not.toHaveClass(unexpected);
		});

		test('should bounce when `selected` transitions from false to true', () => {
			const {rerender} = render(<Bounceable selected={false} />);

			rerender(<Bounceable selected />);

			const expected = 'bouncing';
			const actual = screen.getByRole('button');

			expect(actual).toHaveClass(expected);
		});

		test('should stop bouncing after the animation ends', () => {
			const {rerender} = render(<Bounceable selected={false} />);
			rerender(<Bounceable selected />);

			const actual = screen.getByRole('button');
			expect(actual).toHaveClass('bouncing');

			// The bounce animation is on the handle; its end bubbles to the root.
			act(() => {
				actual.dispatchEvent(new Event('animationend', {bubbles: true}));
			});

			expect(actual).not.toHaveClass('bouncing');
		});
	});
});
