import Spotlight from '@enact/spotlight';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropdownList from '../DropdownList';
import VirtualList from '../../VirtualList';

const children = ['option1', 'option2', 'option3'];

const options = [
	{key: 'a', children: 'A'},
	{key: 'b', children: 'B'},
	{key: 'c', children: 'C'}
];

const changedOptions = [
	{key: 'a', children: 'A2'},
	{key: 'b', children: 'B2'},
	{key: 'c', children: 'C2'}
];

// Tests that need to control how the list scrolls render a simple stand-in instead of the real
// VirtualList. The `mock` prefix lets the `jest.mock` factory read this flag.
let mockStandInList = false;

jest.mock('../../VirtualList', () => {
	const {useEffect} = require('react');
	const {default: ActualVirtualList} = jest.requireActual('../../VirtualList');
	const scrollTo = jest.fn();

	// WithRef locates the list's DOM node through the forwarded `data-withref-id`
	function StandInVirtualList ({cbScrollTo, dataSize, onFocus, 'data-withref-id': withRefId}) {
		useEffect(() => {
			cbScrollTo(scrollTo);
		}, [cbScrollTo]);

		return (
			<div data-withref-id={withRefId} onFocus={onFocus} role="group">
				{Array.from({length: dataSize}, (_, index) => (
					<div data-index={index} data-testid={`option-${index}`} key={index}>
						{`option ${index}`}
					</div>
				))}
			</div>
		);
	}

	function MockVirtualList (props) {
		return mockStandInList ? <StandInVirtualList {...props} /> : <ActualVirtualList {...props} />;
	}

	MockVirtualList.scrollTo = scrollTo;

	return MockVirtualList;
});

describe('DropdownList', () => {
	test('should include `data` and `selected` in `onSelect` callback', async () => {
		const handler = jest.fn();
		const user = userEvent.setup();
		render(
			<DropdownList onSelect={handler}>
				{children}
			</DropdownList>
		);
		const firstItem = screen.getByRole('group').children[0].children[0];

		await user.click(firstItem);

		const expected = {data: 'option1', selected: 0};
		const actual = handler.mock.calls[0][0];

		expect(actual).toEqual(expected);
	});

	describe('with a stand-in list', () => {
		beforeEach(() => {
			mockStandInList = true;
		});

		afterEach(() => {
			mockStandInList = false;
			Spotlight.setPointerMode(false);
			VirtualList.scrollTo.mockClear();
		});

		test('should restore the last 5-way focused item when the list updates', () => {
			Spotlight.setPointerMode(false);
			const {rerender} = render(
				<DropdownList selected={0}>
					{options}
				</DropdownList>
			);

			VirtualList.scrollTo.mockClear();
			fireEvent.focus(screen.getByTestId('option-2'));

			rerender(
				<DropdownList selected={0}>
					{changedOptions}
				</DropdownList>
			);

			expect(VirtualList.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
				focus: true,
				index: 2
			}));
		});

		test('should forward `onFocus` when an item gets focus', () => {
			const handleFocus = jest.fn();
			render(
				<DropdownList onFocus={handleFocus} selected={0}>
					{options}
				</DropdownList>
			);

			fireEvent.focus(screen.getByTestId('option-1'));

			expect(handleFocus).toHaveBeenCalled();
		});
	});
});
