import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import Slider from '../Slider';

const focus = (slider) => fireEvent.focus(slider);
const blur = (slider) => fireEvent.blur(slider);
const activate = (slider) => fireEvent.keyUp(slider, {keyCode: 13});
const keyDown = (keyCode) => (slider) => fireEvent.keyDown(slider, {keyCode});

const leftKeyDown = keyDown(37);
const rightKeyDown = keyDown(39);
const upKeyDown = keyDown(38);
const downKeyDown = keyDown(40);

const getElementClientCenter = (element) => {
	const {left, top, width, height} = element.getBoundingClientRect();
	return {x: left + width / 2, y: top + height / 2};
};

const drag = async (element, {delta, steps = 1}) => {
	const from = getElementClientCenter(element);
	const to = {x: from.x + delta.x, y: from.y + delta.y};
	const step = {x: (to.x - from.x) / steps, y: (to.y - from.y) / steps};
	const current = {clientX: from.x, clientY: from.y};

	fireEvent.mouseEnter(element, current);
	fireEvent.mouseOver(element, current);
	fireEvent.mouseMove(element, current);
	fireEvent.mouseDown(element, current);
	for (let i = 0; i < steps; i++) {
		current.clientX += step.x;
		current.clientY += step.y;
		act(() => jest.advanceTimersByTime(1000 / steps));
		fireEvent.mouseMove(element, current);
	}
	fireEvent.mouseUp(element, current);
};

describe('Slider', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test('should set "aria-valuetext" to hint string for the first render when vertical is false', () => {
		render(<Slider />);
		const slider = screen.getByRole('slider');

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = 'From 0 to 100 0 change a value with left right button';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should set "aria-valuetext" to hint string for the first render when vertical is true', () => {
		render(<Slider orientation="vertical" />);
		const slider = screen.getByRole('slider');

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = 'From 0 to 100 0 change a value with up down button';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should set "aria-valuetext" to value when value is changed', () => {
		render(<Slider defaultValue={10} showMinMax />);
		const slider = screen.getByRole('slider');

		focus(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '11';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should be pressed when selected', () => {
		render(<Slider />);
		const slider = screen.getByRole('slider');

		// Select by key
		fireEvent.keyDown(slider, {key: 'Enter', code: 'Enter', keyCode: 13, which: 13});
		expect(slider).toHaveClass('pressed');

		fireEvent.keyUp(slider, {key: 'Enter', code: 'Enter', keyCode: 13, which: 13});
		expect(slider).not.toHaveClass('pressed');

		// Select by pointer
		fireEvent.mouseDown(slider);
		expect(slider).toHaveClass('pressed');

		fireEvent.mouseUp(slider);
		expect(slider).not.toHaveClass('pressed');
	});

	test('should activate the slider on enter keyup', () => {
		render(<Slider activateOnSelect />);
		const slider = screen.getByRole('slider');

		activate(slider);

		const expected = 'active';

		expect(slider).toHaveClass(expected);
	});

	test('should change value of slider on drag', async () => {
		render(<Slider activateOnSelect defaultValue={50} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		await drag(slider, {delta: {x: 50, y: 0}});

		const expectedAttribute = 'aria-valuetext';
		const unexpectedValue = '50 change a value with left right button';

		expect(slider).not.toHaveAttribute(expectedAttribute, unexpectedValue);
	});

	test('should deactivate the slider on blur', () => {
		render(<Slider activateOnSelect />);
		const slider = screen.getByRole('slider');

		const notExpected = 'active';

		activate(slider);

		expect(slider).toHaveClass(notExpected);

		blur(slider);

		expect(slider).not.toHaveClass(notExpected);
	});

	test('should not activate the slider on enter', () => {
		render(<Slider />);
		const slider = screen.getByRole('slider');

		activate(slider);

		const notExpected = 'active';

		expect(slider).not.toHaveClass(notExpected);
	});

	test('should fire `onChange` with `onChange` type when value changed', () => {
		const handleChange = jest.fn();

		render(<Slider activateOnSelect defaultValue={50} onChange={handleChange} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should decrement the value of horizontal slider on key left when active', () => {
		render(<Slider activateOnSelect defaultValue={50} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value of horizontal slider on key left', () => {
		render(<Slider defaultValue={50} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		leftKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value of horizontal slider on wheel down when active', () => {
		render(<Slider activateOnSelect defaultValue={50} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		fireEvent.wheel(slider, {deltaY: 10});

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value of vertical slider on key down when active', () => {
		render(<Slider activateOnSelect defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		activate(slider);
		downKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value of vertical slider on key down', () => {
		render(<Slider defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		focus(slider);
		downKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value of vertical slider on wheel down when active', () => {
		render(<Slider activateOnSelect defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		activate(slider);
		fireEvent.wheel(slider, {deltaY: 10});

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '49';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of horizontal slider on key right when active', () => {
		render(<Slider activateOnSelect defaultValue={50} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of horizontal slider on key right', () => {
		render(<Slider defaultValue={50} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of vertical slider on key up when active', () => {
		render(<Slider activateOnSelect defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		activate(slider);
		upKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of horizontal slider on wheel up when active', () => {
		render(<Slider activateOnSelect defaultValue={50} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		fireEvent.wheel(slider, {deltaY: -10});

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of vertical slider on key up', () => {
		render(<Slider defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		focus(slider);
		upKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value of vertical slider on wheel up when active', () => {
		render(<Slider activateOnSelect defaultValue={50} orientation="vertical" />);
		const slider = screen.getByRole('slider');

		activate(slider);
		fireEvent.wheel(slider, {deltaY: -10});

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '51';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value by \'knobStep\' on key left when active', () => {
		render(<Slider activateOnSelect defaultValue={50} knobStep={5} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '45';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value by \'knobStep\' on key right when active', () => {
		render(<Slider activateOnSelect defaultValue={50} knobStep={5} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '55';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should decrement the value by \'step\' on key left when active', () => {
		render(<Slider activateOnSelect defaultValue={50} step={5} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '45';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should increment the value by \'step\' on key right when active', () => {
		render(<Slider activateOnSelect defaultValue={50} step={5} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '55';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	// these tests validate behavior relating to `value` defaulting to `min`
	test('should not emit onChange when decrementing at the lower bound when value is unset', () => {
		const handleChange = jest.fn();
		render(<Slider activateOnSelect min={0} max={10} onChange={handleChange} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should increment from the lower bound when value is unset', () => {
		const handleChange = jest.fn();
		render(<Slider activateOnSelect min={0} max={10} onChange={handleChange} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		rightKeyDown(slider);

		const expectedAttribute = 'aria-valuetext';
		const expectedValue = '1';

		expect(slider).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should call onSpotlightLeft on horizontal slider at min value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={0} onSpotlightLeft={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		leftKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should call onSpotlightLeft on vertical slider at any value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={50} orientation="vertical" onSpotlightLeft={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		leftKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should not call onSpotlightLeft on horizontal slider at greater than min value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={1} onSpotlightLeft={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		leftKeyDown(slider);

		expect(handleSpotlight).not.toHaveBeenCalled();
	});

	test('should call onSpotlightDown on vertical slider at min value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={0} orientation="vertical" onSpotlightDown={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		downKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should call onSpotlightDown on horizontal slider at any value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={50} onSpotlightDown={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		downKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should not call onSpotlightDown on vertical slider at greater than min value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={1} orientation="vertical" onSpotlightDown={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		downKeyDown(slider);

		expect(handleSpotlight).not.toHaveBeenCalled();
	});

	test('should call onSpotlightRight on horizontal slider at max value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={100} onSpotlightRight={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		rightKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should call onSpotlightRight on vertical slider at any value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={50} orientation="vertical" onSpotlightRight={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		rightKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should not call onSpotlightRight on horizontal slider at less than max value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={99} onSpotlightRight={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		rightKeyDown(slider);

		expect(handleSpotlight).not.toHaveBeenCalled();
	});

	test('should call onSpotlightUp on vertical slider at max value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={100} max={100} orientation="vertical" onSpotlightUp={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		upKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should call onSpotlightUp on horizontal slider at any value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={50} onSpotlightUp={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		upKeyDown(slider);

		const expected = 1;

		expect(handleSpotlight).toHaveBeenCalledTimes(expected);
	});

	test('should not call onSpotlightUp on vertical slider at less than max value', () => {
		const handleSpotlight = jest.fn();
		render(<Slider defaultValue={99} orientation="vertical" onSpotlightUp={handleSpotlight} />);
		const slider = screen.getByRole('slider');

		focus(slider);
		upKeyDown(slider);

		expect(handleSpotlight).not.toHaveBeenCalled();
	});

	test('should set the tooltip to visible when focused', () => {
		render(<Slider tooltip />);
		const slider = screen.getByRole('slider');

		focus(slider);

		const actual = screen.getByText('0');
		const expected = 'tooltipLabel';

		expect(actual).toHaveClass(expected);
	});

	test('should set the tooltip to not visible when unfocused', () => {
		render(<Slider tooltip />);

		const tooltip = screen.queryByText('0');

		expect(tooltip).toBeNull();
	});

	test('should apply `colorPicker`', () => {
		render(<Slider colorPicker />);

		const slider = screen.getByRole('slider');

		const expected = 'colorPicker';

		expect(slider).toHaveClass(expected);
	});

	test('should render tick marks when ticks is true', () => {
		render(<Slider ticks />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasTicks');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should keep ticks hoverable', () => {
		render(<Slider ticks />);

		const slider = screen.getByRole('slider');
		const tick = slider.querySelector('.tick');

		expect(tick).not.toBeNull();
		fireEvent.mouseOver(tick);
		expect(slider).toHaveClass('hasTicks');
	});

	test('should render one tick per step when ticks is true and the range is small', () => {
		render(<Slider max={10} min={0} step={1} ticks />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(11);
	});

	test('should keep an explicit tick count even when it differs from the step count', () => {
		render(<Slider max={10} min={0} step={1} ticks={5} />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should increment by the tick interval when alignStepsWithTicks is set even if knobStep is set', () => {
		render(<Slider activateOnSelect alignStepsWithTicks defaultValue={0} knobStep={1} max={100} min={0} step={1} ticks={5} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		rightKeyDown(slider);

		expect(slider).toHaveAttribute('aria-valuetext', '25');
	});

	test('should render the specified number of tick marks', () => {
		render(<Slider ticks={4} />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(4);
	});

	test('should not render tick marks when ticks is less than 3', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Slider ticks={2} />);

		const slider = screen.getByRole('slider');

		expect(slider).not.toHaveClass('hasTicks');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(0);
	});

	test('should render start and end labels when two labels are provided', () => {
		render(<Slider labels={['Short Text', 'Long Text']} ticks={5} />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasSideLabels');
		expect(slider).toHaveTextContent('Short Text');
		expect(slider).toHaveTextContent('Long Text');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should render a label for each tick when three or more labels are provided', () => {
		render(<Slider labels={['Low', 'Medium', 'High', 'Max']} />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasTicks');
		expect(slider).toHaveClass('hasTickLabels');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(4);
		expect(slider).toHaveTextContent('Low');
		expect(slider).toHaveTextContent('Medium');
		expect(slider).toHaveTextContent('High');
		expect(slider).toHaveTextContent('Max');
	});

	test('should not display min and max values when tick labels are provided', () => {
		render(<Slider labels={['A', 'B', 'C']} showMinMax />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasTickLabels');
		expect(slider).not.toHaveClass('hasMinMax');
		expect(slider.querySelector('.minMax')).toBeNull();
	});

	test('should generate tick labels from min and max when automaticLabels is set', () => {
		render(<Slider automaticLabels max={100} min={0} ticks={5} />);

		const slider = screen.getByRole('slider');
		const tickLabels = [...slider.querySelectorAll('.tickLabel')].map((node) => node.textContent);

		expect(slider).toHaveClass('hasTickLabels');
		expect(tickLabels).toEqual(['0', '25', '50', '75', '100']);
	});

	test('should ignore labels when automaticLabels is set', () => {
		render(<Slider automaticLabels labels={['Low', 'Medium', 'High']} max={10} min={0} ticks={3} />);

		const slider = screen.getByRole('slider');
		const tickLabels = [...slider.querySelectorAll('.tickLabel')].map((node) => node.textContent);

		expect(tickLabels).toEqual(['0', '5', '10']);
	});

	test('should use the label count when ticks is true and three or more labels are provided', () => {
		render(<Slider labels={['A', 'B', 'C', 'D']} ticks />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(4);
		expect(slider).toHaveTextContent('A');
		expect(slider).toHaveTextContent('D');
	});

	test('should use five ticks when ticks is true and alignStepsWithTicks is set', () => {
		render(<Slider alignStepsWithTicks max={10} min={0} step={1} ticks />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should warn when alignStepsWithTicks is set without ticks', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Slider alignStepsWithTicks />);

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	test('should warn when automaticLabels is set without ticks', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Slider automaticLabels />);

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	test('should display min and max beside the track when showMinMax is set with ticks', () => {
		render(<Slider max={80} min={20} showMinMax ticks={5} />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasSideLabels');
		expect(slider).not.toHaveClass('hasMinMax');
		expect(slider.querySelector('.minMax')).toBeNull();
		expect(slider.querySelector('.startLabel')).toHaveTextContent('20');
		expect(slider.querySelector('.endLabel')).toHaveTextContent('80');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should display min and max before and after a vertical slider when showMinMax is set with ticks', () => {
		render(<Slider max={80} min={20} orientation="vertical" showMinMax ticks={5} />);

		const slider = screen.getByRole('slider');

		expect(slider).toHaveClass('hasSideLabels');
		expect(slider).not.toHaveClass('hasMinMax');
		expect(slider.querySelector('.minMax')).toBeNull();
		expect(slider.querySelector('.startLabel')).toHaveTextContent('20');
		expect(slider.querySelector('.endLabel')).toHaveTextContent('80');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should display min and max values when showMinMax is set without labels', () => {
		render(<Slider max={80} min={20} showMinMax />);

		const slider = screen.getByRole('slider');
		const minMax = slider.querySelector('.minMax');

		expect(slider).toHaveClass('hasMinMax');
		expect(minMax).toHaveTextContent('20');
		expect(minMax).toHaveTextContent('80');
	});

	test('should skip empty tick labels', () => {
		render(<Slider labels={['Low', '', 'High']} />);

		const slider = screen.getByRole('slider');
		const tickLabels = [...slider.querySelectorAll('.tickLabel')].map((node) => node.textContent);

		expect(slider.querySelectorAll('.tickMark')).toHaveLength(3);
		expect(tickLabels).toEqual(['Low', 'High']);
	});

	test('should skip empty start and end labels', () => {
		render(<Slider labels={['', '']} ticks={5} />);

		const slider = screen.getByRole('slider');

		expect(slider.querySelector('.startLabel')).toBeNull();
		expect(slider.querySelector('.endLabel')).toBeNull();
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(5);
	});

	test('should position ticks on a vertical slider', () => {
		render(<Slider labels={['Low', 'Mid', 'High']} orientation="vertical" />);

		const slider = screen.getByRole('slider');
		const ticks = slider.querySelectorAll('.tick');

		expect(ticks).toHaveLength(3);
		expect(ticks[0]).toHaveStyle({bottom: '0%'});
		expect(ticks[2]).toHaveStyle({bottom: '100%'});
		expect(slider).not.toHaveClass('hasTickLabels');
		expect(slider.querySelector('.tickLabel')).toBeNull();
	});

	test('should marquee tick labels while focused', () => {
		render(<Slider labels={['Short Text', 'Long Text']} ticks={5} />);
		const slider = screen.getByRole('slider');

		focus(slider);

		expect(slider.querySelector('.startLabel')).toBeInTheDocument();
		expect(slider.querySelector('.endLabel')).toBeInTheDocument();
	});

	test('should not render ticks when colorPicker is set', () => {
		render(<Slider colorPicker ticks={5} labels={['A', 'B', 'C']} />);

		const slider = screen.getByRole('slider');

		expect(slider).not.toHaveClass('hasTicks');
		expect(slider.querySelectorAll('.tickMark')).toHaveLength(0);
	});

	test('should fire `onChange` with `onChange` type when value changed for `colorPicker`', () => {
		const handleChange = jest.fn();

		render(<Slider activateOnSelect colorPicker defaultValue={50} onChange={handleChange} />);
		const slider = screen.getByRole('slider');

		activate(slider);
		leftKeyDown(slider);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});
});
