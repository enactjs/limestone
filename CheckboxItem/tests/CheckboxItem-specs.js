import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CheckboxItem, {CheckboxItemBase, CheckboxItemGroup} from '../CheckboxItem';

describe('CheckboxItem Specs', () => {

	test('should support a custom icon', () => {
		render(<CheckboxItemBase icon="trash">Hello CheckboxItem</CheckboxItemBase>);

		const checkboxItemElement = screen.getAllByRole('checkbox');

		const actual = checkboxItemElement[1].textContent.codePointAt();
		const expected = 983077; // decimal converted charCode of Unicode 'trash' character

		expect(actual).toBe(expected);
	});

	test('should have correct text', () => {
		render(<CheckboxItemBase>Hello CheckboxItem</CheckboxItemBase>);

		const element = screen.getByText(/Hello CheckboxItem/i);

		expect(element).toBeInTheDocument();
	});

	test('should select with click', async () => {
		const user = userEvent.setup();
		render(<CheckboxItem>Hello CheckboxItem</CheckboxItem>);

		const checkboxItemElement = screen.getAllByRole('checkbox')[0];
		const expected = 'selected';

		await user.click(checkboxItemElement);

		expect(checkboxItemElement).toHaveClass(expected);
	});

	test('should unselect with click twice', async () => {
		const user = userEvent.setup();
		render(<CheckboxItem>Hello CheckboxItem</CheckboxItem>);

		const checkboxItemElement = screen.getAllByRole('checkbox')[0];
		const expected = 'selected';

		await user.click(checkboxItemElement);
		await user.click(checkboxItemElement);

		expect(checkboxItemElement).not.toHaveClass(expected);
	});

	describe('CheckboxItemGroup', () => {
		test('should render a CheckboxItem for each string and label the group with the item count', () => {
			render(<CheckboxItemGroup>{['One', 'Two', 'Three']}</CheckboxItemGroup>);

			const group = screen.getByLabelText('3 items in total');

			expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'checkboxItemGroup');
			expect(group).toHaveAttribute('id', 'checkboxItemGroup');
			expect(screen.getByText('One')).toBeInTheDocument();
			expect(screen.getByText('Two')).toBeInTheDocument();
			expect(screen.getByText('Three')).toBeInTheDocument();
		});

		test('should call `onSelect` with the index of the toggled string item', () => {
			const handleSelect = jest.fn();
			render(<CheckboxItemGroup onSelect={handleSelect}>{['One', 'Two', 'Three']}</CheckboxItemGroup>);

			fireEvent.click(screen.getByText('Two'));

			const expected = {selected: 1, data: 'Two'};
			const actual = handleSelect.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		test('should render CheckboxItem children with `itemProps` and use `groupId` for labelling', () => {
			render(
				<CheckboxItemGroup groupId="custom" itemProps={{disabled: true}}>
					<CheckboxItem>One</CheckboxItem>
					<CheckboxItem>Two</CheckboxItem>
				</CheckboxItemGroup>
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
