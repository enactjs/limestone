import Spotlight from '@enact/spotlight';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import '@testing-library/jest-dom';
import {createEvent, fireEvent, render, screen, waitFor} from '@testing-library/react';

import Button from '../../Button';
import {Popup} from '../Popup';

const FloatingLayerController = FloatingLayerDecorator('div');

describe('Popup specs', () => {
	test('should be rendered opened if open is set to true', () => {
		render(
			<FloatingLayerController>
				<Popup open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.getByText('popup');

		expect(popup).toBeInTheDocument();
	});

	test('should not be rendered if open is set to false', () => {
		render(
			<FloatingLayerController>
				<Popup><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.queryByText('popup');

		expect(popup).toBeNull();
	});

	test('should set role to alert by default', () => {
		render(
			<FloatingLayerController>
				<Popup open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.getByRole('alert');

		expect(popup).toBeInTheDocument();
	});

	test('should allow role to be overridden', () => {
		render(
			<FloatingLayerController>
				<Popup open role="dialog"><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.getByRole('dialog');

		expect(popup).toBeInTheDocument();
	});

	test('should set "data-webos-voice-exclusive" when popup is open', () => {
		render(
			<FloatingLayerController>
				<Popup open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.getByRole('alert');

		expect(popup).toHaveAttribute('data-webos-voice-exclusive');
	});

	test('should set "data-webos-voice-disabled" when voice control is disabled', () => {
		render(
			<FloatingLayerController>
				<Popup data-webos-voice-disabled open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const popup = screen.getByRole('alert');

		expect(popup).toHaveAttribute('data-webos-voice-disabled');
	});

	test('should fire onClose event with type and detail info when Popup is closed', () => {
		const handleClose = jest.fn();

		render(
			<FloatingLayerController>
				<Popup onClose={handleClose} open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		fireEvent.keyUp(screen.getByText('popup'), {keyCode: 27});

		const expectedType = {type: 'onClose', detail: {inputType: 'key'}};
		const actual = handleClose.mock.calls.length && handleClose.mock.calls[0][0];

		expect(actual).toMatchObject(expectedType);
	});

	describe('with position bottom', function () {
		test('should have bottom class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="bottom"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('bottom');
		});

		test('should have bottom class in popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="bottom"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('bottom');
		});
	});

	describe('with position left', function () {
		test('should have left class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="left"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('left');
		});

		test('should have left class in popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="left"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('left');
		});
	});

	describe('with position right', function () {
		test('should have right class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="right"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('right');
		});

		test('should have right class in popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="right"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('right');
		});
	});

	describe('with position top', function () {
		test('should have top class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="top"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('top');
		});

		test('should have top class popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="top"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('top');
		});
	});

	describe('with position center', function () {
		test('should have center class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="center"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('center');
		});

		test('should have center class popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="center"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('center');
		});
	});

	describe('with position fullscreen', function () {
		test('should have fullscreen class', () => {
			render(
				<FloatingLayerController>
					<Popup open position="fullscreen"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');

			expect(popup).toHaveClass('fullscreen');
		});

		test('should have fullscreen class popup transition container', () => {
			render(
				<FloatingLayerController>
					<Popup open position="fullscreen"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(transitionContainer).toHaveClass('fullscreen');
		});
	});

	describe('with position changes dynamically - [GT-28270]', function () {
		test('should not have top class when position change from top to any other position', () => {
			const firstPosition = 'top';
			const {rerender} = render(
				<FloatingLayerController>
					<Popup open position={firstPosition}><div>popup</div></Popup>
				</FloatingLayerController>
			);

			const popup = screen.getByRole('alert');
			const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

			expect(popup).toHaveClass(firstPosition);
			expect(transitionContainer).toHaveClass(firstPosition);
			expect(popup).not.toHaveClass('fullscreen');
			expect(transitionContainer).not.toHaveClass('fullscreen');
			expect(popup).not.toHaveClass('center');
			expect(transitionContainer).not.toHaveClass('center');
			expect(popup).not.toHaveClass('bottom');
			expect(transitionContainer).not.toHaveClass('bottom');
			expect(popup).not.toHaveClass('right');
			expect(transitionContainer).not.toHaveClass('right');
			expect(popup).not.toHaveClass('left');
			expect(transitionContainer).not.toHaveClass('left');

			rerender(
				<FloatingLayerController>
					<Popup open position="fullscreen"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			expect(popup).not.toHaveClass(firstPosition);
			expect(transitionContainer).not.toHaveClass(firstPosition);

			rerender(
				<FloatingLayerController>
					<Popup open position="center"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			expect(popup).not.toHaveClass(firstPosition);
			expect(transitionContainer).not.toHaveClass(firstPosition);

			rerender(
				<FloatingLayerController>
					<Popup open position="bottom"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			expect(popup).not.toHaveClass(firstPosition);
			expect(transitionContainer).not.toHaveClass(firstPosition);

			rerender(
				<FloatingLayerController>
					<Popup open position="left"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			expect(popup).not.toHaveClass(firstPosition);
			expect(transitionContainer).not.toHaveClass(firstPosition);

			rerender(
				<FloatingLayerController>
					<Popup open position="right"><div>popup</div></Popup>
				</FloatingLayerController>
			);

			expect(popup).not.toHaveClass(firstPosition);
			expect(transitionContainer).not.toHaveClass(firstPosition);
		});
	});

	test('should apply `ease-in-out` class to transition container when noAnimation is false', () => {
		render(
			<FloatingLayerController>
				<Popup noAnimation={false} open><div>popup</div></Popup>
			</FloatingLayerController>
		);
		const transitionContainer = screen.getByRole('alert').parentElement.parentElement;

		const expected = 'ease-in-out';

		expect(transitionContainer).toHaveClass(expected);
	});

	test('should apply \'shown\' class when visible with noAnimation', () => {
		render(
			<FloatingLayerController>
				<Popup noAnimation open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const expected = 'shown';
		const actual = screen.getByRole('alert').parentElement.parentElement;

		expect(actual).toHaveClass(expected);
	});

	test('should close popup on escape', async () => {
		const handleClose = jest.fn();
		render(
			<FloatingLayerController>
				<Popup open onClose={handleClose}>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		fireEvent.keyUp(screen.getByText('popup'), {keyCode: 27});

		await waitFor(() => {
			expect(handleClose).toHaveBeenCalled();
		});
	});

	test('should call onShow after popup with noAnimation is opened', () => {
		const handleShow = jest.fn();
		const {rerender} = render(
			<FloatingLayerController>
				<Popup noAnimation onShow={handleShow}>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		rerender(
			<FloatingLayerController>
				<Popup noAnimation onShow={handleShow} open>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		expect(handleShow).toHaveBeenCalled();
	});

	test('should call onHide after popup with noAnimation is closed', () => {
		const handleHide = jest.fn();
		const {rerender} = render(
			<FloatingLayerController>
				<Popup noAnimation onHide={handleHide} open>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		rerender(
			<FloatingLayerController>
				<Popup noAnimation onHide={handleHide}>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		expect(handleHide).toHaveBeenCalled();
	});

	describe('transition end events', () => {
		const renderOpenPopup = (props) => render(
			<FloatingLayerController>
				<Popup open {...props}>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		const getTransitionInner = () => screen.getByRole('alert').parentElement;

		const fireTransitionEnd = (propertyName) => {
			const node = getTransitionInner();
			const event = createEvent.transitionEnd(node);
			Object.defineProperty(event, 'propertyName', {value: propertyName});
			fireEvent(node, event);
		};

		test('should call onShow once when the `transform` transition ends', () => {
			const handleShow = jest.fn();
			renderOpenPopup({onShow: handleShow});

			fireTransitionEnd('transform');

			expect(handleShow).toHaveBeenCalledTimes(1);
		});

		test('should not call onShow when a non-`transform` transition ends', () => {
			const handleShow = jest.fn();
			renderOpenPopup({onShow: handleShow});

			fireTransitionEnd('opacity');

			expect(handleShow).not.toHaveBeenCalled();
		});

		test('should call onShow only once when both `transform` and `opacity` transitions end', () => {
			const handleShow = jest.fn();
			renderOpenPopup({onShow: handleShow});

			fireTransitionEnd('opacity');
			fireTransitionEnd('transform');

			expect(handleShow).toHaveBeenCalledTimes(1);
		});

		test('should call onHide once when the `transform` transition ends after closing', () => {
			const handleHide = jest.fn();
			const {rerender} = renderOpenPopup({onHide: handleHide});

			rerender(
				<FloatingLayerController>
					<Popup onHide={handleHide}>
						<div>popup</div>
					</Popup>
				</FloatingLayerController>
			);

			fireTransitionEnd('transform');

			expect(handleHide).toHaveBeenCalledTimes(1);
		});

		test('should not call onHide when a non-`transform` transition ends after closing', () => {
			const handleHide = jest.fn();
			const {rerender} = renderOpenPopup({onHide: handleHide});

			rerender(
				<FloatingLayerController>
					<Popup onHide={handleHide}>
						<div>popup</div>
					</Popup>
				</FloatingLayerController>
			);

			fireTransitionEnd('opacity');

			expect(handleHide).not.toHaveBeenCalled();
		});
	});

	test('should apply `hidden` class when popup closes', () => {
		const {rerender} = render(
			<FloatingLayerController>
				<Popup open>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		rerender(
			<FloatingLayerController>
				<Popup>
					<div>popup</div>
				</Popup>
			</FloatingLayerController>
		);

		const transitionContainer = screen.getByRole('alert').parentElement.parentElement;
		const expected = 'hidden';

		expect(transitionContainer).toHaveClass(expected);
	});

	describe('closing with 5-way keys', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		const renderPopup = (props, content = <div>popup</div>) => render(
			<FloatingLayerController>
				<Popup noAnimation open {...props}>
					{content}
				</Popup>
			</FloatingLayerController>
		);

		test('should close on a direction key when it has nothing to focus', () => {
			const handleClose = jest.fn();
			renderPopup({onClose: handleClose});

			fireEvent.keyDown(screen.getByText('popup'), {keyCode: 38});

			expect(handleClose).toHaveBeenCalled();
		});

		test('should not close on a direction key when `no5WayClose` is set', () => {
			const handleClose = jest.fn();
			renderPopup({no5WayClose: true, onClose: handleClose});

			fireEvent.keyDown(screen.getByText('popup'), {keyCode: 38});

			expect(handleClose).not.toHaveBeenCalled();
		});

		describe('with focusable content', () => {
			// Focus may only leave a popup, and so close it, when the popup does not restrict focus to itself
			const setUpFocusedPopup = (props) => {
				renderPopup({spotlightRestrict: 'self-first', ...props}, <Button>button</Button>);
				const button = screen.getByRole('button');
				jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(button);
				jest.spyOn(Spotlight, 'getSpottableDescendants').mockReturnValue([button]);

				return button;
			};

			test('should move focus instead of closing when focus can move', () => {
				const handleClose = jest.fn();
				const button = setUpFocusedPopup({onClose: handleClose});
				const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);

				fireEvent.keyDown(button, {keyCode: 40});

				expect(moveSpy).toHaveBeenCalledWith('down');
				expect(handleClose).not.toHaveBeenCalled();
			});

			test('should close a bottom popup when focus cannot move up out of it', () => {
				const handleClose = jest.fn();
				const button = setUpFocusedPopup({onClose: handleClose, position: 'bottom'});
				jest.spyOn(Spotlight, 'move').mockReturnValue(false);

				fireEvent.keyDown(button, {keyCode: 38});

				expect(handleClose).toHaveBeenCalled();
			});

			test('should not close a bottom popup when focus cannot move down', () => {
				const handleClose = jest.fn();
				const button = setUpFocusedPopup({onClose: handleClose, position: 'bottom'});
				jest.spyOn(Spotlight, 'move').mockReturnValue(false);

				fireEvent.keyDown(button, {keyCode: 40});

				expect(handleClose).not.toHaveBeenCalled();
			});

			test.each([
				['center', 37],
				['top', 40],
				['left', 39],
				['right', 37]
			])('should close a %s popup when focus cannot move away from its content', (position, keyCode) => {
				const handleClose = jest.fn();
				const button = setUpFocusedPopup({onClose: handleClose, position});
				jest.spyOn(Spotlight, 'move').mockReturnValue(false);

				fireEvent.keyDown(button, {keyCode});

				expect(handleClose).toHaveBeenCalled();
			});

			test('should neither move focus nor close when focus is restricted to the popup', () => {
				const handleClose = jest.fn();
				const button = setUpFocusedPopup({onClose: handleClose, spotlightRestrict: 'self-only'});
				const moveSpy = jest.spyOn(Spotlight, 'move');

				fireEvent.keyDown(button, {keyCode: 38});

				expect(moveSpy).not.toHaveBeenCalled();
				expect(handleClose).not.toHaveBeenCalled();
			});
		});
	});
});
