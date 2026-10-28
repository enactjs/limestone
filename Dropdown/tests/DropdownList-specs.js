import Spotlight from '@enact/spotlight';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import DropdownList from '../DropdownList';
import VirtualList from '../../VirtualList';

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

jest.mock('../../VirtualList', () => {
	const {useEffect} = require('react');
	const scrollTo = jest.fn();

	function MockVirtualList ({cbScrollTo, dataSize, onFocus}) {
		useEffect(() => {
			cbScrollTo(scrollTo);
		}, [cbScrollTo]);

		return (
			<div onFocus={onFocus} role="group">
				{Array.from({length: dataSize}, (_, index) => (
					<div data-index={index} data-testid={`option-${index}`} key={index}>
						{`option ${index}`}
					</div>
				))}
			</div>
		);
	}

	MockVirtualList.scrollTo = scrollTo;

	return MockVirtualList;
});

describe('DropdownList', () => {
	afterEach(() => {
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
});
