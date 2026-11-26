import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import RadioItem, {RadioItemBase, RadioItemGroup} from '../RadioItem';

describe('RadioItem Specs', () => {

	test('should support a custom icon', () => {
		render(<RadioItemBase icon="check" selected>Hello RadioItem</RadioItemBase>);
		const radioItemElement = screen.getByRole('checkbox');

		const expected = 983489;
		const actual = radioItemElement.children.item(1).textContent.codePointAt();

		expect(actual).toBe(expected);
	});

	test('should render `children`', () => {
		render(<RadioItemBase>Hello RadioItem</RadioItemBase>);

		const actual = screen.getByText('Hello RadioItem');

		expect(actual).toBeInTheDocument();
	});

	test('should render a disabled RadioItem when `disabled` is true', () => {
		render(<RadioItemBase disabled>Hello RadioItem</RadioItemBase>);
		const radioItem = screen.getByRole('checkbox');

		expect(radioItem).toHaveAttribute('disabled');
	});

	test('should render a `slot before`', () => {
		render(<RadioItemBase slotBefore="arrowup">Hello RadioItem</RadioItemBase>);

		const actual = screen.getByText('arrowup');

		expect(actual).toBeInTheDocument();
	});

	test('should select RadioItem with click', () => {
		render(<RadioItem>Hello RadioItem</RadioItem>);
		const radioItem = screen.getAllByRole('checkbox');

		fireEvent.click(radioItem[0]);

		const expected = 'selected';

		expect(radioItem[0]).toHaveClass(expected);
	});

	test('should not select RadioItem with click when disabled', () => {
		render(<RadioItem disabled>Hello RadioItem</RadioItem>);
		const radioItem = screen.getAllByRole('checkbox');

		fireEvent.click(radioItem[0]);

		const expected = 'selected';

		expect(radioItem[0]).not.toHaveClass(expected);
	});

	describe('RadioItemGroup', () => {
		test('should render a RadioItem for each string and label the group with the item count', () => {
			render(<RadioItemGroup>{['One', 'Two', 'Three']}</RadioItemGroup>);

			const group = screen.getByLabelText('3 items in total');

			expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'radioItemGroup');
			expect(group).toHaveAttribute('id', 'radioItemGroup');
			expect(screen.getByText('One')).toBeInTheDocument();
			expect(screen.getByText('Two')).toBeInTheDocument();
			expect(screen.getByText('Three')).toBeInTheDocument();
		});

		test('should call `onSelect` with the index of the toggled string item', () => {
			const handleSelect = jest.fn();
			render(<RadioItemGroup onSelect={handleSelect}>{['One', 'Two', 'Three']}</RadioItemGroup>);

			fireEvent.click(screen.getByText('Two'));

			const expected = {selected: 1, data: 'Two'};
			const actual = handleSelect.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		test('should render RadioItem children with `itemProps` and use `groupId` for labelling', () => {
			render(
				<RadioItemGroup groupId="custom" itemProps={{disabled: true}}>
					<RadioItem>One</RadioItem>
					<RadioItem>Two</RadioItem>
				</RadioItemGroup>
			);

			const group = screen.getByRole('group');

			expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'custom');
			expect(group).toHaveAttribute('id', 'custom');
			expect(group).toHaveAttribute('aria-label', '2 items in total');
			expect(screen.getByText('One').closest('[aria-disabled]')).toHaveAttribute('aria-disabled', 'true');
			expect(screen.getByText('Two').closest('[aria-disabled]')).toHaveAttribute('aria-disabled', 'true');
		});
	});
});
