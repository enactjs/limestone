import Spotlight from '@enact/spotlight';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import ri from '@enact/ui/resolution';
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {FlexiblePopupPanels, Header, Panel} from '../';

const FloatingLayerController = FloatingLayerDecorator('div');

describe('FlexiblePopupPanels Specs', () => {
	test('should hide previous and next buttons when there is only one panel', () => {
		render(
			<FloatingLayerController>
				<FlexiblePopupPanels open>
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const actual = screen.queryByRole('button');

		expect(actual).toBeNull();
	});

	test('should show previous and next buttons when there is more than one panel', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels open>
					<Panel />
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 2;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should show previous button when using `prevButton` on the only panel', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels open>
					<Panel prevButton />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should show previous button when using `nextButton` on the only panel', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels open>
					<Panel nextButton />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide previous button on all panels when `prevButtonVisibility` is set to "never"', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels prevButtonVisibility="never" open>
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide next button on all panels when `nextButtonVisibility` is set to "never"', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels nextButtonVisibility="never" open>
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should show previous button on the only panel when `prevButtonVisibility` set to "always"', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels prevButtonVisibility="always" open>
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should show next button on the only panel when `nextButtonVisibility` set to "always"', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels nextButtonVisibility="always" open>
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide previous button on panels that override using `prevButton={false}`', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={1} open>
					<Panel />
					<Panel prevButton={false} />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide next button on panels that override using `nextButton={false}`', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={0} open>
					<Panel nextButton={false} />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide previous button when `prevButtonVisibility` prop is set to always and panel overrides using `prevButton={false}`', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={1} prevButtonVisibility="always" open>
					<Panel />
					<Panel prevButton={false} />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should hide next button when `nextButtonVisibility` prop is set to always and panel overrides using `nextButton={false}`', () => {
		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={0} nextButtonVisibility="always" open>
					<Panel nextButton={false} />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 1;
		const actual = screen.getAllByRole('button').length;

		unmount();
		expect(actual).toBe(expected);
	});

	test('should fire `onNextClick` and `onChange` with each type in it when the next button is clicked', async () => {
		const handleNextClick = jest.fn();
		const handleChange = jest.fn();
		const user = userEvent.setup();

		render(
			<FloatingLayerController>
				<FlexiblePopupPanels open onNextClick={handleNextClick} onChange={handleChange}>
					<Panel />
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		await user.click(screen.getByLabelText('Next'));

		const nextClickExpected = {type: 'onNextClick'};
		const changeExpected = {type: 'onChange'};

		await waitFor(() => {
			const nextClickActual = handleNextClick.mock.calls.length && handleNextClick.mock.calls[0][0];

			expect(nextClickActual).toMatchObject(nextClickExpected);
		});

		await waitFor(() => {
			const changeActual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

			expect(changeActual).toMatchObject(changeExpected);
		});
	});

	test('should fire `onPrevClick` with type `onPrevClick` when the previous button is clicked', async () => {
		const handlePrevClick = jest.fn();
		const user = userEvent.setup();

		render(
			<FloatingLayerController>
				<FlexiblePopupPanels open onPrevClick={handlePrevClick}>
					<Panel />
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		await user.click(screen.getByLabelText('Previous'));

		const expected = {type: 'onPrevClick'};

		await waitFor(() => {
			const actual = handlePrevClick.mock.calls.length && handlePrevClick.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

	});

	test('should close on back key when on first panel', () => {
		const map = {};

		window.addEventListener = jest.fn((event, cb) => {
			map[event] = cb;
		});
		const spy = jest.fn();

		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={0} onClose={spy} open>
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		map.keyup({type: 'keyup', currentTarget: window, keyCode: 27});

		const expectedEvent = {type: 'onClose'};
		const actualEvent = spy.mock.calls.length && spy.mock.calls[0][0];

		unmount();
		expect(spy).toHaveBeenCalled();
		expect(actualEvent).toMatchObject(expectedEvent);
	});

	test('should go back on back key when not on first panel', () => {
		const map = {};

		window.addEventListener = jest.fn((event, cb) => {
			map[event] = cb;
		});
		const spy = jest.fn();

		const {unmount} = render(
			<FloatingLayerController>
				<FlexiblePopupPanels index={1} onBack={spy} open>
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		map.keyup({type: 'keyup', currentTarget: window, keyCode: 27});

		const expectedEvent = {type: 'onBack'};
		const actualEvent = spy.mock.calls.length && spy.mock.calls[0][0];

		unmount();
		expect(spy).toHaveBeenCalled();
		expect(actualEvent).toMatchObject(expectedEvent);
	});

	test('should correctly assign the fullHeight class', () => {
		render(
			<FloatingLayerController>
				<FlexiblePopupPanels data-testid="flexiblePopupPanels" fullHeight open>
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const expected = 'fullHeight';
		const actual = screen.getByTestId('flexiblePopupPanels').parentElement.parentElement;

		expect(actual).toHaveClass(expected);
	});

	describe('Header', () => {
		test('should show an "Exit app" button that fires `onClose`', async () => {
			const user = userEvent.setup();
			const handleClose = jest.fn();

			render(
				<FloatingLayerController>
					<FlexiblePopupPanels onClose={handleClose} open>
						<Panel>
							<Header title="Title" />
						</Panel>
					</FlexiblePopupPanels>
				</FloatingLayerController>
			);

			await user.click(screen.getByRole('button', {name: 'Exit app'}));

			const expected = {type: 'onClose'};
			const actual = handleClose.mock.calls.length && handleClose.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		test('should use `closeButtonAriaLabel` for the close button', () => {
			render(
				<FloatingLayerController>
					<FlexiblePopupPanels closeButtonAriaLabel="Close settings" open>
						<Panel>
							<Header title="Title" />
						</Panel>
					</FlexiblePopupPanels>
				</FloatingLayerController>
			);

			expect(screen.getByRole('button', {name: 'Close settings'})).toBeInTheDocument();
		});

		test('should hide the close button when `noCloseButton` is set', () => {
			render(
				<FloatingLayerController>
					<FlexiblePopupPanels noCloseButton open>
						<Panel>
							<Header title="Title" />
						</Panel>
					</FlexiblePopupPanels>
				</FloatingLayerController>
			);

			expect(screen.queryByRole('button', {name: 'Exit app'})).toBeNull();
		});

		test('should reserve the close button area only when `noCloseButton` is set and there are several panels', () => {
			const renderPanels = (noCloseButton, panelCount) => (
				<FloatingLayerController>
					<FlexiblePopupPanels noCloseButton={noCloseButton} open>
						{Array.from({length: panelCount}, (_, i) => (
							<Panel key={i}>
								<Header data-testid={`header-${i}`} title="Title" />
							</Panel>
						))}
					</FlexiblePopupPanels>
				</FloatingLayerController>
			);

			const {rerender} = render(renderPanels(true, 2));
			expect(screen.getByTestId('header-0')).toHaveClass('showBack');

			rerender(renderPanels(true, 1));
			expect(screen.getByTestId('header-0')).not.toHaveClass('showBack');

			rerender(renderPanels(false, 2));
			expect(screen.getByTestId('header-0')).not.toHaveClass('showBack');
		});
	});

	describe('nav button focus', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		const renderPanels = (index) => (
			<FloatingLayerController>
				<FlexiblePopupPanels index={index} open>
					<Panel />
					<Panel />
					<Panel />
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		test.each([
			['next', 'Next', '.navCellAfter .navButton'],
			['previous', 'Previous', '.navCellBefore .navButton']
		])('should focus the %s button of the new panel after navigating with it', (_, label, selector) => {
			const {rerender} = render(renderPanels(1));
			const setSpy = jest.spyOn(Spotlight, 'set');
			jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(screen.getByRole('button', {name: label}));

			rerender(renderPanels(2));

			expect(setSpy).toHaveBeenCalledWith(expect.any(String), {defaultElement: selector});
		});

		test('should not target a nav button when focus was elsewhere', () => {
			const {rerender} = render(renderPanels(1));
			const setSpy = jest.spyOn(Spotlight, 'set');
			jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(null);

			rerender(renderPanels(2));

			expect(setSpy).not.toHaveBeenCalledWith(expect.any(String), {defaultElement: expect.stringContaining('navButton')});
		});
	});

	test.each([
		['small', 600],
		['large', 1320]
	])('should size the content of a `%s` panel', (size, width) => {
		render(
			<FloatingLayerController>
				<FlexiblePopupPanels open>
					<Panel size={size}>
						<div>content</div>
					</Panel>
				</FlexiblePopupPanels>
			</FloatingLayerController>
		);

		const contentCell = screen.getByText('content').parentElement;

		expect(contentCell.style.getPropertyValue('--cell-size')).toBe(ri.scaleToRem(width));
	});
});
