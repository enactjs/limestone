import '@testing-library/jest-dom';
import {act, render, screen, waitFor} from '@testing-library/react';

import Item from '../../Item';
import VirtualList from '../VirtualList';

describe('VirtualList useSpotlight', () => {
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
		clientSize = null;
		dataSize = null;
		items = [];
		itemSize = null;
		renderItem = null;
	});

	describe('VirtualList rendering with spotlight configuration', () => {
		test('should render VirtualList with spotlight container', () => {
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

			// VirtualList should have spotlight container configured
			expect(container).toHaveAttribute('data-spotlight-container');
			expect(container).toHaveAttribute('data-spotlight-id');
		});

		test('should render items with data-index attributes', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const firstItem = list.children.item(0).children.item(0);
			const secondItem = list.children.item(1).children.item(0);

			expect(firstItem).toHaveAttribute('data-index', '0');
			expect(secondItem).toHaveAttribute('data-index', '1');
		});
	});

	describe('Invalid index handling when dataSize changes', () => {
		test('should re-render correctly when dataSize decreases', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');

			// Initially should render items up to dataSize
			let itemsInDOM = list.querySelectorAll('[data-index]');
			itemsInDOM.forEach(item => {
				const index = parseInt(item.getAttribute('data-index'));
				expect(index).toBeLessThan(dataSize);
			});

			// Reduce dataSize significantly
			const newDataSize = 10;
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={newDataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			// After reduction, all rendered items should be within new dataSize
			itemsInDOM = list.querySelectorAll('[data-index]');
			itemsInDOM.forEach(item => {
				const index = parseInt(item.getAttribute('data-index'));
				expect(index).toBeLessThan(newDataSize);
			});
		});

		test('should not have items with indices >= dataSize after reduction', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={30}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');

			// Drastically reduce dataSize
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={5}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			// Verify no items with index >= 5 exist
			const invalidItems = list.querySelectorAll('[data-index]');
			invalidItems.forEach(item => {
				const index = parseInt(item.getAttribute('data-index'));
				expect(index).toBeLessThan(5);
			});
		});

		test('should handle multiple dataSize changes gracefully', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const dataSizeSequence = [40, 25, 35, 15, 30, 10];

			dataSizeSequence.forEach(newSize => {
				rerender(
					<VirtualList
						clientSize={clientSize}
						dataSize={newSize}
						itemRenderer={renderItem}
						itemSize={itemSize}
					/>
				);

				const items = list.querySelectorAll('[data-index]');
				items.forEach(item => {
					const index = parseInt(item.getAttribute('data-index'));
					expect(index).toBeLessThan(newSize);
					expect(index).toBeGreaterThanOrEqual(0);
				});
			});
		});
	});

	describe('Spotlight container configuration', () => {
		test('should set up spotlight container with correct attributes', () => {
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

			expect(container).toHaveAttribute('data-spotlight-container', 'true');
			expect(container).toHaveAttribute('data-spotlight-container-disabled', 'false');
		});

		test('should have spotlight-id on container', () => {
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
			const spotlightId = container.getAttribute('data-spotlight-id');

			expect(spotlightId).toBeTruthy();
			expect(spotlightId).toMatch(/container-\d+/);
		});
	});

	describe('Item rendering with spotlight properties', () => {
		test('should render items as spottable elements', () => {
			render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const items = list.querySelectorAll('[data-index]');

			items.forEach(item => {
				// Items should be spottable (have required attributes)
				expect(item).toHaveAttribute('tabindex');
				expect(item.className).toContain('spottable');
			});
		});

		test('should maintain correct indices after re-render', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');

			// Force a re-render
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			// Indices should still be correct
			const items = list.querySelectorAll('[data-index]');
			const indices = Array.from(items).map(item =>
				parseInt(item.getAttribute('data-index'))
			);

			// Should have sequential indices starting from firstVisibleIndex
			for (let i = 1; i < indices.length; i++) {
				expect(indices[i]).toBeGreaterThan(indices[i - 1]);
			}
		});
	});

	describe('dataSize change scenarios', () => {
		test('should handle increase then decrease in dataSize', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={20}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');

			// Increase
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={40}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			let items = list.querySelectorAll('[data-index]');
			items.forEach(item => {
				expect(parseInt(item.getAttribute('data-index'))).toBeLessThan(40);
			});

			// Decrease
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={15}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			items = list.querySelectorAll('[data-index]');
			items.forEach(item => {
				expect(parseInt(item.getAttribute('data-index'))).toBeLessThan(15);
			});
		});

		test('should handle rapid dataSize changes', () => {
			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={20}
					itemRenderer={renderItem}
					itemSize={itemSize}
				/>
			);

			const list = screen.getByRole('list');
			const sizes = [25, 15, 30, 10, 35, 8];

			sizes.forEach(size => {
				rerender(
					<VirtualList
						clientSize={clientSize}
						dataSize={size}
						itemRenderer={renderItem}
						itemSize={itemSize}
					/>
				);

				const items = list.querySelectorAll('[data-index]');
				items.forEach(item => {
					const index = parseInt(item.getAttribute('data-index'));
					expect(index).toBeGreaterThanOrEqual(0);
					expect(index).toBeLessThan(size);
				});
			});
		});
	});
});