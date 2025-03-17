import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Indicator from '../Indicator';

describe('Indicator', () => {
    const total = 10;
    const current = 5;
    describe('with type dots', () => {
        test('should render the proper number of children', () => {
            render(<Indicator current={current} total={total} />);

            const expected = 10;
            const actual = screen.getAllByRole('list')[0].children().length;

            expect(actual).toBe(expected);
        });
        test('should display the proper current', () => {
            const {rerender} = render(<Indicator current={current} total={total} />);

            const expected = 'current';
            let actual = screen.getAllByRole('list')[0].children().item(4);

            expect(actual).toHaveClass(expected);

            rerender(<Indicator current={current + 1} total={total} />);

            actual = screen.getAllByRole('list')[0].children().item(5);

            expect(actual).toHaveClass(expected);
        });
    });
    describe('with type numbers', () => {

    });
});
