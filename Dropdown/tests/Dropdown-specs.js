import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import '@testing-library/jest-dom';
import {act, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Dropdown, {DropdownBase} from '../Dropdown';

const FloatingLayerController = FloatingLayerDecorator('div');

const children = ['option1', 'option2', 'option3'];
const placeholder = 'Dropdown select';
const title = 'Options';

// An open list repositions its popup from a MutationObserver callback, which runs after `render` returns
const flushPopupPositioning = () => act(() => Promise.resolve());

describe('Dropdown', () => {
	test('should have default `placeholder` when a value is not provided', () => {
		render(
			<DropdownBase>
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText('No Selection');

		expect(actual).toBeInTheDocument();
	});

	test('should have `placeholder` when a value is provided', () => {
		render(
			<DropdownBase placeholder={placeholder}>
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText(placeholder);

		expect(actual).toBeInTheDocument();
	});

	test('should have `title`', () => {
		render(
			<DropdownBase title={title}>
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText(title);
		const titleContainer = actual.parentElement.parentElement;

		expect(actual).toBeInTheDocument();
		expect(titleContainer).toHaveClass('heading');
	});

	test('should apply id to dropdown', () => {
		render(
			<DropdownBase id="drop">
				{children}
			</DropdownBase>
		);

		const expected = 'drop';
		const actual = screen.getByRole('region');

		expect(actual).toHaveAttribute('id', expected);
	});

	test('should apply aria label id to `title`', () => {
		render(
			<DropdownBase title={title} id="drop">
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText(title);
		const titleContainer = actual.parentElement.parentElement;

		expect(actual).toBeInTheDocument();
		expect(titleContainer).toHaveAttribute('id', 'drop_title');
	});

	test('should apply aria-labelled-by to dropdown with title', () => {
		render(
			<DropdownBase title={title} id="drop">
				{children}
			</DropdownBase>
		);

		const expected = 'drop_title';
		const actual = screen.getByRole('region');

		expect(actual).toHaveAttribute('aria-labelledby', expected);
	});

	test('should not apply aria-labelled-by when no title exists', () => {
		render(
			<DropdownBase id="drop">
				{children}
			</DropdownBase>
		);

		const actual = screen.getByRole('region');

		expect(actual).not.toHaveAttribute('aria-labelledby');
	});

	test('should have `placeholder` when `children` is invalid', () => {
		render(
			<DropdownBase placeholder={placeholder}>
				{null}
			</DropdownBase>
		);

		const actual = screen.getByText(placeholder);

		expect(actual).toBeInTheDocument();
	});

	test('should have `placeholder` that reflects `selected` option', () => {
		const selectedIndex = 1;
		render(
			<DropdownBase selected={selectedIndex}>
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText(children[selectedIndex]);

		expect(actual).toBeInTheDocument();
	});

	test('should have `placeholder` when `selected` is invalid', () => {
		render(
			<DropdownBase placeholder={placeholder} selected={-1}>
				{children}
			</DropdownBase>
		);

		const actual = screen.getByText(placeholder);

		expect(actual).toBeInTheDocument();
	});

	test('should be disabled when `children` is omitted', () => {
		render(
			<DropdownBase title={title} />
		);

		const expected = 'true';
		const actual = screen.getByRole('button');

		expect(actual).toHaveAttribute('aria-disabled', expected);
	});

	test('should be disabled when there are no `children`', () => {
		render(
			<DropdownBase title={title}>
				{[]}
			</DropdownBase>
		);

		const expected = 'true';
		const actual = screen.getByRole('button');

		expect(actual).toHaveAttribute('aria-disabled', expected);
	});

	test('should update when children are removed or added', async () => {
		const {rerender} = render(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{children}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const lessChildren = children.slice(0, -1);

		rerender(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{lessChildren}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const lessChildrenExpected = 2;
		const lessChildrenActual = screen.getByRole('group').children;

		expect(lessChildrenActual).toHaveLength(lessChildrenExpected);

		const moreChildren = children.concat('option3');

		rerender(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{moreChildren}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const moreChildrenExpected = 3;
		const moreChildrenActual = screen.getByRole('group').children;

		expect(moreChildrenActual).toHaveLength(moreChildrenExpected);
	});

	test('should set the `role` of items to "checkbox"', async () => {
		render(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{['item']}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const expected = 'layout item';
		const actual = screen.getByRole('checkbox');

		expect(actual).toBeInTheDocument();
		expect(actual).toHaveClass(expected);
	});

	test('should set the `aria-checked` state of the `selected` item', async () => {
		render(
			<FloatingLayerController>
				<DropdownBase open selected={0} title={title}>
					{['item']}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const expected = 'true';
		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-checked', expected);
	});

	test('should set the `aria-posinset` and `aria-setsize` state of the item in the list', async () => {
		render(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{children}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const posinsetExpected = '1';
		const setsizeExpected = '3';
		const actual = screen.getByRole('group').children[0].children[0];

		expect(actual).toHaveAttribute('aria-posinset', posinsetExpected);
		expect(actual).toHaveAttribute('aria-setsize', setsizeExpected);
	});

	test('should pass through members of child objects to props for each item', async () => {
		render(
			<FloatingLayerController>
				<DropdownBase open title={title}>
					{[{
						disabled: true,
						children: 'child',
						key: 'item-0'
					}]}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const expected = 'true';
		const actual = screen.getByRole('checkbox');

		expect(actual).toHaveAttribute('aria-disabled', expected);
	});

	test('should allow members in child object to override injected aria values', async () => {
		render(
			<FloatingLayerController>
				<DropdownBase open selected={0} title={title}>
					{[{
						disabled: true,
						children: 'child',
						key: 'item-0',
						role: 'button',
						'aria-checked': false
					}]}
				</DropdownBase>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const actual = within(screen.getByRole('group')).getByRole('button');

		expect(actual).toHaveAttribute('aria-checked', 'false');
	});

	test('should fire `onSelect` event with type `onSelect`', async () => {
		const handleSelect = jest.fn();
		const user = userEvent.setup();
		render(
			<FloatingLayerController>
				<DropdownBase open onSelect={handleSelect} title={title}>
					{children}
				</DropdownBase>
			</FloatingLayerController>
		);

		const firstItem = screen.getByRole('group').children[0].children[0];

		await user.click(firstItem);

		expect(handleSelect).toHaveBeenCalledWith({data: 'option1', selected: 0, type: 'onSelect'});
	});

	test('should update the open list when options are added, removed, or renamed', async () => {
		const {rerender} = render(
			<FloatingLayerController>
				<Dropdown open title={title}>
					{children}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		rerender(
			<FloatingLayerController>
				<Dropdown open title={title}>
					{children.slice(0, -1)}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		expect(screen.getByRole('group').children).toHaveLength(2);
		expect(screen.queryByText('option3')).not.toBeInTheDocument();

		rerender(
			<FloatingLayerController>
				<Dropdown open title={title}>
					{['option1', 'renamed', 'option3']}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		expect(screen.getByText('renamed')).toBeInTheDocument();
		expect(screen.queryByText('option2')).not.toBeInTheDocument();

		rerender(
			<FloatingLayerController>
				<Dropdown open title={title}>
					{children.concat('option4')}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-setsize', '4');
	});

	test('should keep the selection when re-rendered with the same options', async () => {
		const options = ['option1', 'option2', 'option3'];
		const {rerender} = render(
			<FloatingLayerController>
				<Dropdown open selected={1} title={title}>
					{options}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		const selected = screen.getByRole('checkbox', {checked: true});

		rerender(
			<FloatingLayerController>
				<Dropdown open selected={1} title={title}>
					{[...options]}
				</Dropdown>
			</FloatingLayerController>
		);
		await flushPopupPositioning();

		expect(screen.getByRole('checkbox', {checked: true})).toBe(selected);
		expect(selected).toHaveTextContent('option2');
		expect(screen.getByRole('button')).toHaveTextContent('option2');
	});

	test('should show selected, disabled, and title changes', () => {
		const {rerender} = render(
			<Dropdown selected={0} title="First title">
				{children}
			</Dropdown>
		);

		expect(screen.getByRole('button')).toHaveTextContent('option1');
		expect(screen.getByText('First title')).toBeInTheDocument();
		expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');

		rerender(
			<Dropdown disabled selected={2} title="Next title">
				{children}
			</Dropdown>
		);

		expect(screen.getByRole('button')).toHaveTextContent('option3');
		expect(screen.getByText('Next title')).toBeInTheDocument();
		expect(screen.queryByText('First title')).not.toBeInTheDocument();
		expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
	});

	describe('opening', () => {
		test('should fire `onOpen` when a closed Dropdown is clicked', async () => {
			const handleOpen = jest.fn();
			const user = userEvent.setup();
			render(<DropdownBase onOpen={handleOpen} title={title}>{children}</DropdownBase>);

			await user.click(screen.getByRole('button'));

			expect(handleOpen).toHaveBeenCalled();
		});

		test('should not fire `onOpen` when a disabled Dropdown is clicked', async () => {
			const handleOpen = jest.fn();
			const user = userEvent.setup();
			render(<DropdownBase disabled onOpen={handleOpen} title={title}>{children}</DropdownBase>);

			await user.click(screen.getByRole('button'));

			expect(handleOpen).not.toHaveBeenCalled();
		});

		test('should not fire `onOpen` again when an open Dropdown is clicked', async () => {
			const handleOpen = jest.fn();
			const user = userEvent.setup();
			render(
				<FloatingLayerController>
					<DropdownBase onOpen={handleOpen} open title={title}>{children}</DropdownBase>
				</FloatingLayerController>
			);
			await flushPopupPositioning();

			await user.click(screen.getByRole('button'));

			expect(handleOpen).not.toHaveBeenCalled();
		});
	});
});
