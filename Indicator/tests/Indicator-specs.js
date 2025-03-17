import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Indicator from '../Indicator';

describe('Indicator', () => {
	const total = 10;
	const current = 5;
	describe('with type dots', () => {
		test('should render the proper number of children', () => {
			render(<Indicator current={current} total={total} />);

			const expected = 10;
			const actual = screen.getByRole('list').children.length;

			expect(actual).toBe(expected);
		});
		test('should display the proper current', () => {
			const {rerender} = render(<Indicator current={current} total={total} />);

			const expected = 'current';
			let actual = screen.getByRole('list').children.item(4);

			expect(actual).toHaveClass(expected);

			rerender(<Indicator current={current + 1} total={total} />);

			actual = screen.getByRole('list').children.item(5);

			expect(actual).toHaveClass(expected);
		});
	});
	describe('with type numbers', () => {
		test('should render the proper values for `current` and `total`', () => {
			render(<Indicator current={current} total={total} type="numbers" />);

			const actual = screen.getAllByRole('button')[1].previousElementSibling.textContent;
			const expected = '5 / 10';

			expect(actual).toBe(expected);
		});
		test('should update value for `current`', () => {
			const {rerender} = render(<Indicator current={current} total={total} type="numbers" />);

			let actual = screen.getAllByRole('button')[1].previousElementSibling.textContent;
			let expected = '5 / 10';

			expect(actual).toBe(expected);

			rerender(<Indicator current={current + 1} total={total} type="numbers" />);

			actual = screen.getAllByRole('button')[1].previousElementSibling.textContent;
			expected = '6 / 10';

			expect(actual).toBe(expected);
		});
		test('should call `onChange` for button press', async () => {
			const handleClick = jest.fn();
			const user = userEvent.setup();
			render(<Indicator current={current} onChange={handleClick} total={total} type="numbers" />);

			const buttonPrev = screen.getAllByRole('button')[0];
			const buttonNext = screen.getAllByRole('button')[1];

			await user.click(buttonPrev);
			await user.click(buttonNext);

			const actualPrev = handleClick.mock.calls[0][0];
			const actualNext = handleClick.mock.calls[1][0];
			const expectedPrev = {type: "decrement", value: 4};
			const expectedNext = {type: "increment", value: 6};

			expect(actualPrev).toMatchObject(expectedPrev);
			expect(actualNext).toMatchObject(expectedNext);
		});

		test('should not call `onChange` for increment button if `current` equals `total`', async () => {
			const handleClick = jest.fn();
			const user = userEvent.setup();
			render(<Indicator current={total} onChange={handleClick} total={total} type="numbers" />);

			const buttonNext = screen.getAllByRole('button')[1];

			await user.click(buttonNext);

			expect(handleClick).not.toBeCalled();
		});

		test('should not call `onChange` for decrement button if `current` equals 1', async () => {
			const handleClick = jest.fn();
			const user = userEvent.setup();
			render(<Indicator current={1} onChange={handleClick} total={total} type="numbers" />);

			const buttonPrev = screen.getAllByRole('button')[0];

			await user.click(buttonPrev);

			expect(handleClick).not.toBeCalled();
		});

		test('should not display buttons if `hideButtons` is set `true`', () => {
			render(<Indicator current={1} hideButtons total={total} type="numbers" />);

			const actual = screen.queryAllByRole('button').length;
			const expected = 0;

			expect(actual).toBe(expected);
		});
	});
});
