import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import MediaSliderDecorator from '../MediaSliderDecorator';

// Minimal wrapped component that exposes the decorator's preview state through data attributes
// and renders a child element so `relatedTarget` can point inside the slider.
const SliderStub = ({backgroundProgress, preview, previewProportion, progressAnchor, value, ...rest}) => ( // eslint-disable-line no-unused-vars
	<div {...rest} data-preview={preview} data-proportion={previewProportion}>
		<span data-testid="child" />
	</div>
);

const MediaSlider = MediaSliderDecorator(SliderStub);

const focus = (slider) => fireEvent.focus(slider);
const activate = (slider) => fireEvent.keyUp(slider, {keyCode: 13});
const keyDown = (keyCode) => (slider) => fireEvent.keyDown(slider, {keyCode});

const leftKeyDown = keyDown(37);
const rightKeyDown = keyDown(39);

const getProportion = (slider) => Number(slider.dataset.proportion);
const lastProportion = (spy) => spy.mock.calls[spy.mock.calls.length - 1][0].proportion;

describe('MediaSliderDecorator', () => {
	beforeEach(() => {
		global.Element.prototype.getBoundingClientRect = jest.fn(() => {
			return {
				width: 500,
				height: 100,
				top: 0,
				left: 0,
				bottom: 100,
				right: 500
			};
		});
	});

	test('should move the preview knob right when the right key is pressed while tracking', () => {
		const handleKnobMove = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		focus(slider);
		rightKeyDown(slider);

		expect(getProportion(slider)).toBeCloseTo(0.55);
		expect(lastProportion(handleKnobMove)).toBeCloseTo(0.55);
	});

	test('should move the preview knob left when the left key is pressed while tracking', () => {
		const handleKnobMove = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		focus(slider);
		leftKeyDown(slider);

		expect(getProportion(slider)).toBeCloseTo(0.45);
		expect(lastProportion(handleKnobMove)).toBeCloseTo(0.45);
	});

	test('should prevent default and stop native propagation of left/right keys while tracking', () => {
		// Spotlight listens for native keydown events on window
		const handleWindowKeyDown = jest.fn();
		window.addEventListener('keydown', handleWindowKeyDown);

		render(<MediaSlider data-testid="mediaslider-id" value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		focus(slider);

		const notCancelled = rightKeyDown(slider);

		window.removeEventListener('keydown', handleWindowKeyDown);

		expect(notCancelled).toBe(false);
		expect(handleWindowKeyDown).not.toHaveBeenCalled();
	});

	test('should keep the preview knob within 0 and 1', () => {
		const handleKnobMove = jest.fn();

		const {rerender} = render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0} />);

		const slider = screen.getByTestId('mediaslider-id');

		focus(slider);
		leftKeyDown(slider);

		expect(getProportion(slider)).toBe(0);
		expect(handleKnobMove).not.toHaveBeenCalled();

		fireEvent.blur(slider);
		rerender(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={1} />);
		focus(slider);
		handleKnobMove.mockClear();
		rightKeyDown(slider);

		expect(getProportion(slider)).toBe(1);
		expect(handleKnobMove).not.toHaveBeenCalled();
	});

	test('should not move the preview knob when not tracking', () => {
		const handleKnobMove = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		rightKeyDown(slider);
		leftKeyDown(slider);

		expect(getProportion(slider)).toBe(0);
		expect(handleKnobMove).not.toHaveBeenCalled();
	});

	test('should forward `onChange` with the preview position when enter is released while tracking', () => {
		const handleChange = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onChange={handleChange} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		focus(slider);
		rightKeyDown(slider);
		activate(slider);

		expect(handleChange).toHaveBeenCalledTimes(1);

		const {type, value, proportion} = handleChange.mock.calls[0][0];

		expect(type).toBe('onChange');
		expect(value).toBeCloseTo(0.55);
		expect(proportion).toBeCloseTo(0.55);
	});

	test('should not forward `onChange` when enter is released while not tracking', () => {
		const handleChange = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onChange={handleChange} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		activate(slider);

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should ignore mouseOver coming from an element inside the slider', () => {
		const handleKnobMove = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');
		const child = screen.getByTestId('child');

		fireEvent.mouseOver(slider, {clientX: 100, relatedTarget: child});

		expect(slider).toHaveAttribute('data-preview', 'false');
		expect(handleKnobMove).not.toHaveBeenCalled();
	});

	test('should keep tracking when mouseOut moves to an element inside the slider', () => {
		render(<MediaSlider data-testid="mediaslider-id" value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');
		const child = screen.getByTestId('child');

		fireEvent.mouseOver(slider, {clientX: 100, relatedTarget: document.body});

		expect(slider).toHaveAttribute('data-preview', 'true');
		expect(getProportion(slider)).toBeCloseTo(0.2);

		fireEvent.mouseOut(slider, {relatedTarget: child});

		expect(slider).toHaveAttribute('data-preview', 'true');
	});

	test('should stop tracking when mouseOut leaves the slider', () => {
		const handleKnobMove = jest.fn();

		render(<MediaSlider data-testid="mediaslider-id" onKnobMove={handleKnobMove} value={0.5} />);

		const slider = screen.getByTestId('mediaslider-id');

		fireEvent.mouseOver(slider, {clientX: 100, relatedTarget: document.body});
		fireEvent.mouseOut(slider, {relatedTarget: document.body});

		expect(slider).toHaveAttribute('data-preview', 'false');

		handleKnobMove.mockClear();
		rightKeyDown(slider);

		expect(handleKnobMove).not.toHaveBeenCalled();
	});
});
