import '@testing-library/jest-dom';
import Spotlight from '@enact/spotlight';
import {fireEvent, render, screen} from '@testing-library/react';

import Item from '../../Item';
import VirtualList from '../VirtualList';

// These tests exercise the `stickTo="start"` scroll behavior added to `useThemeVirtualList`. They
// live in their own file because they depend on a clean Spotlight singleton.
const focus = (elm) => fireEvent.focus(elm);

const keyDownUp = (keyCode) => (elm) => {
	fireEvent.keyDown(elm, {keyCode});
	return fireEvent.keyUp(elm, {keyCode});
};

const pressDownKey = keyDownUp(40);

describe('VirtualList stickTo="start"', () => {
	let
		clientSize,
		currentFocusIndex,
		dataSize,
		handlerOnFocus,
		items,
		itemSize,
		renderItem;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		currentFocusIndex = -1;
		dataSize = 200;
		items = [];
		itemSize = 60;

		handlerOnFocus = (index) => () => {
			currentFocusIndex = index;
		};

		renderItem = ({index, ...rest}) => { // eslint-disable-line enact/display-name
			return (
				<Item {...rest} onFocus={handlerOnFocus(index)}>
					{items[index].name}
				</Item>
			);
		};

		for (let i = 0; i < dataSize; i++) {
			items.push({name: 'Account ' + i});
		}
	});

	afterEach(() => {
		clientSize = null;
		dataSize = null;
		handlerOnFocus = null;
		items = null;
		itemSize = null;
		renderItem = null;
	});

	test('should scroll to anchor the focused item at the start slot on 5-way navigation', () => {
		const spy = jest.fn(() => {});
		const scrollToFn = global.Element.prototype.scrollTo;
		global.Element.prototype.scrollTo = spy;

		render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				stickTo="start"
			/>
		);

		const list = screen.getByRole('list');
		const item13 = list.children.item(13).children.item(0);

		focus(item13);
		expect(currentFocusIndex).toBe(13);

		pressDownKey(item13);
		expect(currentFocusIndex).toBe(14);
		expect(spy).toHaveBeenCalled();

		global.Element.prototype.scrollTo = scrollToFn;
	});

	test('should scroll a focused item to the start slot', () => {
		const spy = jest.fn(() => {});
		const scrollToFn = global.Element.prototype.scrollTo;
		global.Element.prototype.scrollTo = spy;
		const pointerSpy = jest.spyOn(Spotlight, 'getPointerMode').mockReturnValue(false);
		const currentSpy = jest.spyOn(Spotlight, 'getCurrent');

		render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				direction="horizontal"
				itemRenderer={renderItem}
				itemSize={itemSize}
				stickTo="start"
			/>
		);

		const list = screen.getByRole('list');
		const node = list.querySelector('[data-index="13"]');
		currentSpy.mockReturnValue(node);

		fireEvent.focusIn(node);

		expect(spy).toHaveBeenCalled();

		currentSpy.mockRestore();
		pointerSpy.mockRestore();
		global.Element.prototype.scrollTo = scrollToFn;
	});
});
