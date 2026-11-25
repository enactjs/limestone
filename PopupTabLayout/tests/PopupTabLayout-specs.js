import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Item} from '../../Item';
import {PopupTabLayout, Tab, TabPanel, TabPanels} from '../PopupTabLayout';

const FloatingLayerController = FloatingLayerDecorator('div');

const keyDown = (keyCode) => (elm) => fireEvent.keyDown(elm, {keyCode});

const enterKeyDown = keyDown(13);
const escapeKeyDown = keyDown(27);
const leftKeyDown = keyDown(37);
const downKeyDown = keyDown(40);

const keyUp = (keyCode) => (elm) => fireEvent.keyUp(elm, {keyCode});

const enterKeyUp = keyUp(13);
const escapeKeyUp = keyUp(27);
const downKeyUp = keyUp(40);

describe('PopupTabLayout specs', () => {
	test('should be rendered opened if open is set to true', () => {
		render(
			<FloatingLayerController>
				<PopupTabLayout open><div>popupTabLayout</div></PopupTabLayout>
			</FloatingLayerController>
		);

		const popupTabLayout = screen.getByText('popupTabLayout');

		expect(popupTabLayout).toBeInTheDocument();
	});

	test('should not be rendered if open is set to false', () => {
		render(
			<FloatingLayerController>
				<PopupTabLayout><div>popupTabLayout</div></PopupTabLayout>
			</FloatingLayerController>
		);

		const popupTabLayout = screen.queryByText('popupTabLayout');

		expect(popupTabLayout).toBeNull();
	});

	test('should apply \'ease-in-out\' class when noAnimation is false', () => {
		render(
			<FloatingLayerController>
				<PopupTabLayout data-testid="popupTabLayout" noAnimation={false} open><div>popupTabLayout</div></PopupTabLayout>
			</FloatingLayerController>
		);

		const expected = 'ease-in-out';
		const actual = screen.getByTestId('popupTabLayout').parentElement.parentElement.parentElement.parentElement;

		expect(actual).toHaveClass(expected);
	});

	test('should not apply \'ease-in-out\' class when noAnimation is true', () => {
		render(
			<FloatingLayerController>
				<PopupTabLayout data-testid="popupTabLayout" noAnimation open><div>popupTabLayout</div></PopupTabLayout>
			</FloatingLayerController>
		);

		const expected = 'ease-in-out';
		const actual = screen.getByTestId('popupTabLayout').parentElement.parentElement.parentElement.parentElement;

		expect(actual).not.toHaveClass(expected);
	});

	test('should not close popupTabLayout on escape if noAutoDismiss is true', async () => {
		const handleClose = jest.fn();
		render(
			<FloatingLayerController>
				<PopupTabLayout noAutoDismiss onClose={handleClose} open><div>popupTabLayout</div></PopupTabLayout>
			</FloatingLayerController>
		);

		fireEvent.keyUp(screen.getByText('popupTabLayout'), {keyCode: 27});

		await waitFor(() => {
			expect(handleClose).not.toHaveBeenCalled();
		});
	});

	test('should display items from second tab', async () => {
		const user = userEvent.setup();
		render(
			<FloatingLayerController>
				<PopupTabLayout open>
					<Tab title="First Tab Title">
						<TabPanels>
							<TabPanel>
								<Item>Item 1</Item>
								<Item>Item 2</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
					<Tab title="Second Tab Title">
						<TabPanels>
							<TabPanel>
								<Item>Item 3</Item>
								<Item>Item 4</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		let thirdItem = screen.queryByText('Item 3');
		let fourthItem = screen.queryByText('Item 4');

		expect(thirdItem).not.toBeInTheDocument();
		expect(fourthItem).not.toBeInTheDocument();

		const secondTab = screen.getByText('Second Tab Title');

		await user.click(secondTab);

		thirdItem = screen.getByText('Item 3');
		fourthItem = screen.getByText('Item 4');

		expect(thirdItem).toBeInTheDocument();
		expect(fourthItem).toBeInTheDocument();
	});

	test('should fire onTabClick event for 5-way Select on tab element', () => {
		const onTabClick = jest.fn();
		render(
			<FloatingLayerController>
				<PopupTabLayout open>
					<Tab onTabClick={onTabClick} title="First Tab Title">
						<TabPanels>
							<TabPanel>
								<Item>Item 1</Item>
								<Item>Item 2</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
					<Tab title="Second Tab Title">
						<TabPanels>
							<TabPanel>
								<Item>Item 3</Item>
								<Item>Item 4</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		const firstTab = screen.getByText('First Tab Title');

		enterKeyDown(firstTab);
		enterKeyUp(firstTab);

		expect(onTabClick).toHaveBeenCalled();
	});

	test('should fire onBack event when returning to previous tab', () => {
		const handleOnBack = jest.fn();
		render(
			<FloatingLayerController>
				<PopupTabLayout open>
					<Tab title="Tab Title">
						<TabPanels index={1} onBack={handleOnBack}>
							<TabPanel>
								<Item>Item 1</Item>
								<Item>Item 2</Item>
							</TabPanel>
							<TabPanel>
								<Item>Item 3</Item>
								<Item>Item 4</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		const tab = screen.getByText('Tab Title');

		escapeKeyDown(tab);
		escapeKeyUp(tab);

		expect(handleOnBack).toHaveBeenCalled();
	});

	test('should fire onKeyDown event for 5-way navigation inside Tab element', () => {
		const onKeyDown = jest.fn();
		render(
			<FloatingLayerController>
				<PopupTabLayout open>
					<Tab title="First Tab Title">
						<TabPanels>
							<TabPanel onKeyDown={onKeyDown}>
								<Item>Item 1</Item>
								<Item>Item 2</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
					<Tab title="Second Tab Title">
						<TabPanels>
							<TabPanel>
								<Item>Item 3</Item>
								<Item>Item 4</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		const firstItem = screen.getByText('Item 1');

		downKeyDown(firstItem);
		downKeyUp(firstItem);

		expect(onKeyDown).toHaveBeenCalled();
	});

	test('should fire onBack event when left key pressed from the second TabPanel', () => {
		const onBack = jest.fn();
		render(
			<FloatingLayerController>
				<PopupTabLayout open>
					<Tab title="Tab Title">
						<TabPanels index={1} onBack={onBack} rtl={false} >
							<TabPanel>
								<Item>Item 1</Item>
								<Item>Item 2</Item>
							</TabPanel>
							<TabPanel>
								<Item>Item 3</Item>
								<Item>Item 4</Item>
							</TabPanel>
						</TabPanels>
					</Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		const firstItem = screen.getByText('Item 3');

		leftKeyDown(firstItem);

		expect(onBack).toHaveBeenCalled();
	});

	describe('collapse animation suppression', () => {
		const popup = (open, callbacks = {}) => (
			<FloatingLayerController>
				<PopupTabLayout data-test-id="tab-layout" noAnimation open={open} {...callbacks}>
					<Tab title="Tab"><div>content</div></Tab>
				</PopupTabLayout>
			</FloatingLayerController>
		);

		const duration = () => document
			.querySelector('[data-test-id="tab-layout"]')
			.style.getPropertyValue('--lime-tablayout-collapse-duration');

		beforeEach(() => jest.useFakeTimers());
		afterEach(() => jest.useRealTimers());

		test('forwards show and hide callbacks and resets suppression', () => {
			const onShow = jest.fn();
			const onHide = jest.fn();
			const callbacks = {onShow, onHide};
			const {rerender} = render(popup(false, callbacks));

			rerender(popup(true, callbacks));
			expect(onShow).toHaveBeenCalledTimes(1);
			expect(duration()).toBe('0');

			act(() => jest.runOnlyPendingTimers());
			expect(duration()).toBe('');

			rerender(popup(false, callbacks));
			expect(onHide).toHaveBeenCalledTimes(1);

			rerender(popup(true, callbacks));
			expect(onShow).toHaveBeenCalledTimes(2);
			expect(duration()).toBe('0');
		});

		test('cancels the pending show timer when hidden without callbacks', () => {
			const {rerender} = render(popup(false));

			rerender(popup(true));
			expect(duration()).toBe('0');

			rerender(popup(false));
			act(() => jest.runOnlyPendingTimers());

			rerender(popup(true));
			expect(duration()).toBe('0');
			act(() => jest.runOnlyPendingTimers());
			expect(duration()).toBe('');
		});
	});
});
