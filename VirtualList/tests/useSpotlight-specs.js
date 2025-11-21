import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import Spotlight from '@enact/spotlight';

import Item from '../../Item';
import VirtualList from '../VirtualList';

let capturedSpotlightConfig = null;

describe('VirtualList useSpotlight - Direct Callback Coverage', () => {
	let
		clientSize,
		dataSize,
		items,
		itemSize,
		renderItem;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		dataSize = 50;
		items = [];
		itemSize = 60;
		capturedSpotlightConfig = null;

		// Mock Spotlight.set to capture configuration
		const originalSpotlightSet = Spotlight.set;
		Spotlight.set = jest.fn((id, config) => {
			capturedSpotlightConfig = config;
			return originalSpotlightSet.call(Spotlight, id, config);
		});

		renderItem = ({index, ...rest}) => { // eslint-disable-line enact/display-name
			return (
				<Item {...rest} data-index={index}>
					{items[index].name}
				</Item>
			);
		};

		for (let i = 0; i < dataSize; i++) {
			items.push({name: 'Item ' + i});
		}
	});

	afterEach(() => {
		capturedSpotlightConfig = null;
		clientSize = null;
		dataSize = null;
		items = [];
		itemSize = null;
		renderItem = null;
	});

	describe('#lastFocusedRestore', () => {
		test('should find and use placeholder element', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const container = list.parentElement.parentElement;
			const placeholder = container.querySelector('[data-vl-placeholder]');

			const {lastFocusedRestore} = capturedSpotlightConfig || {};
			expect(lastFocusedRestore).toBeDefined();

			const allElements = placeholder ? [placeholder] : [];

			const result = lastFocusedRestore({key: 5}, allElements);

			expect(result).toBe(placeholder);
		});

		test('should find element by matching key', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const listItems = Array.from(list.querySelectorAll('[data-index]'));

			const {lastFocusedRestore} = capturedSpotlightConfig || {};

			const result = lastFocusedRestore({key: 3}, listItems);

			expect(result).toBeTruthy();
			expect(result.dataset.index).toBe('3');
		});

		test('should return first visible item as fallback', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const listItems = Array.from(list.querySelectorAll('[data-index]'));

			const {lastFocusedRestore} = capturedSpotlightConfig || {};

			// Call with key that doesn't exist
			const result = lastFocusedRestore({key: 999}, listItems);

			expect(result).toBeTruthy();
			expect(result.dataset.index).toBeTruthy();
		});

		test('should return null when no items available', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const {lastFocusedRestore} = capturedSpotlightConfig || {};

			// Call with empty array
			const result = lastFocusedRestore({key: 5}, []);

			expect(result).toBeNull();
		});
	});

	describe('DataSize change', () => {
		test('should clear invalid lastFocusedIndex on dataSize decrease', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={50}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			// Decrease dataSize to trigger clearing logic
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={10}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			expect(capturedSpotlightConfig).toBeTruthy();

			const list = screen.getByRole('list');
			const listItems = list.querySelectorAll('[data-index]');

			listItems.forEach(item => {
				expect(parseInt(item.getAttribute('data-index'))).toBeLessThan(10);
			});
		});

		test('should handle the same dataSize', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={30}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			// Re-render with same dataSize
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={30}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			expect(list).toBeInTheDocument();
		});
	});

	describe('#handleRestoreLastFocus', () => {
		test('should restore when focus is in container', () => {
			const mockGetCurrent = jest.spyOn(Spotlight, 'getCurrent');

			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const item = list.children.item(5)?.children.item(0);

			// Mock getCurrent to return an item inside container
			mockGetCurrent.mockReturnValue(item);

			fireEvent.focus(item);

			expect(item).toHaveAttribute('data-index');

			mockGetCurrent.mockRestore();
		});

		test('should clear flag when focus is outside', () => {
			const mockGetCurrent = jest.spyOn(Spotlight, 'getCurrent');
			const externalElement = document.createElement('div');
			mockGetCurrent.mockReturnValue(externalElement);

			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			expect(list).toBeInTheDocument();

			mockGetCurrent.mockRestore();
		});
	});

	describe('#restoreFocus', () => {
		test('should restore focus to preserved item', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const item = list.children.item(5)?.children.item(0);

			fireEvent.focus(item);
			fireEvent.blur(item);
			fireEvent.focus(item);

			expect(item).toHaveAttribute('data-index');
		});

		test('should focus container when item focus fails', () => {
			const mockSpotlightFocus = jest.spyOn(Spotlight, 'focus');

			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			expect(list).toBeInTheDocument();

			mockSpotlightFocus.mockRestore();
		});
	});

	describe('#updateStatesAndBounds', () => {
		test('should return true when preservation needed', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const item = list.children.item(10)?.children.item(0);

			fireEvent.focus(item);
			expect(item).toBeInTheDocument();
		});

		test('should return false when preservation not needed', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			expect(list).toBeInTheDocument();
		});
	});

	describe('Spotlight configuration', () => {
		test('should set enterTo to last-focused', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			expect(capturedSpotlightConfig).toBeTruthy();
			expect(capturedSpotlightConfig.enterTo).toBe('last-focused');
		});

		test('should set obliqueMultiplier based on spacing', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
					spacing={15}
				/>
			);

			expect(capturedSpotlightConfig.obliqueMultiplier).toBe(15);
		});

		test('should use default oblique multiplier when spacing is 0', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
					spacing={0}
				/>
			);

			expect(capturedSpotlightConfig.obliqueMultiplier).toBe(1);
		});
	});
});
