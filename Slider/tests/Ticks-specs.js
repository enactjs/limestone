import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {SliderExtras, Ticks} from '../Ticks';

jest.mock('../../Marquee', () => {
	const Marquee = ({children, marqueeDisabled, marqueeOn}) => (
		<div data-marquee-disabled={marqueeDisabled ? 'true' : 'false'} data-marquee-on={marqueeOn}>
			{children}
		</div>
	);

	return {
		__esModule: true,
		default: Marquee
	};
});

const getMarqueeOn = (node) => {
	const marquee = node.matches('[data-marquee-on]') ? node : node.querySelector('[data-marquee-on]');

	return marquee && marquee.getAttribute('data-marquee-disabled') === 'true' ? 'off' : marquee.getAttribute('data-marquee-on');
};

describe('Ticks', () => {
	test('should render tick marks using default styles', () => {
		render(<Ticks className="customTicks" count={3} />);

		expect(document.querySelector('.customTicks')).toBeInTheDocument();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
	});

	test('should render nothing when no tick count is provided', () => {
		render(<Ticks />);

		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
	});

	test('should skip empty tick labels', () => {
		render(<Ticks count={3} css={{tick: 'tick', tickMark: 'tickMark', tickLabel: 'tickLabel'}} labels={['A', '', 'C']} />);

		expect(screen.getByText('A')).toBeInTheDocument();
		expect(screen.getByText('C')).toBeInTheDocument();
		expect(document.querySelectorAll('.tickMark')).toHaveLength(3);
		expect(document.querySelectorAll('.tickLabel')).toHaveLength(2);
	});

	test('should omit tick labels on a vertical slider', () => {
		render(<Ticks count={3} css={{tickLabel: 'tickLabel'}} labels={['A', 'B', 'C']} orientation="vertical" />);

		expect(document.querySelector('.tickLabel')).toBeNull();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
	});

	test('should marquee only the focused tick label', () => {
		render(<Ticks count={3} css={{tickLabel: 'tickLabel'}} focusedIndex={1} labels={['Low', 'Mid', 'High']} />);

		const labels = document.querySelectorAll('.tickLabel');

		expect(getMarqueeOn(labels[0])).toBe('off');
		expect(getMarqueeOn(labels[1])).toBe('render');
		expect(getMarqueeOn(labels[2])).toBe('off');
	});

	test('should not marquee tick labels when none is focused or hovered', () => {
		render(<Ticks count={3} css={{tickLabel: 'tickLabel'}} labels={['Low', 'Mid', 'High']} />);

		const labels = [...document.querySelectorAll('.tickLabel')];

		expect(labels.map(getMarqueeOn)).toEqual(['off', 'off', 'off']);
	});

	test('should marquee the hovered tick instead of the knob tick', () => {
		render(<Ticks count={3} css={{tick: 'tick', tickLabel: 'tickLabel'}} focusedIndex={0} labels={['Low', 'Mid', 'High']} />);

		const labels = [...document.querySelectorAll('.tickLabel')];
		const ticks = [...document.querySelectorAll('.tick')];

		expect(labels.map(getMarqueeOn)).toEqual(['render', 'off', 'off']);

		fireEvent.mouseOver(ticks[1]);

		expect(labels.map(getMarqueeOn)).toEqual(['off', 'render', 'off']);

		fireEvent.mouseOver(labels[1]);

		expect(labels.map(getMarqueeOn)).toEqual(['off', 'render', 'off']);

		fireEvent.mouseLeave(ticks[0].parentElement);

		expect(labels.map(getMarqueeOn)).toEqual(['render', 'off', 'off']);
	});
});

describe('SliderExtras', () => {
	test('should render min and max values', () => {
		render(<SliderExtras className="minMax" max={10} min={1} showMinMax />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
	});

	test('should render side labels without tick marks', () => {
		render(<SliderExtras count={0} css={{startLabel: 'startLabel', endLabel: 'endLabel'}} endLabel="End" startLabel="Start" />);

		expect(screen.getByText('Start')).toBeInTheDocument();
		expect(screen.getByText('End')).toBeInTheDocument();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
	});

	test('should omit empty side labels', () => {
		render(<SliderExtras count={3} css={{startLabel: 'startLabel', endLabel: 'endLabel'}} endLabel="" startLabel="" />);

		expect(document.querySelector('.startLabel')).toBeNull();
		expect(document.querySelector('.endLabel')).toBeNull();
	});

	test('should render side labels on a vertical slider', () => {
		render(<SliderExtras count={3} endLabel="Max" focused orientation="vertical" startLabel="Min" />);

		expect(screen.getByText('Min')).toBeInTheDocument();
		expect(screen.getByText('Max')).toBeInTheDocument();
	});

	test('should marquee only the side label for the focused end', () => {
		render(
			<SliderExtras
				count={5}
				css={{startLabel: 'startLabel', endLabel: 'endLabel'}}
				endLabel="End"
				focused
				max={100}
				min={0}
				startLabel="Start"
				value={100}
			/>
		);

		expect(getMarqueeOn(document.querySelector('.startLabel'))).toBe('off');
		expect(getMarqueeOn(document.querySelector('.endLabel'))).toBe('render');
	});

	test('should marquee only the tick label that matches the value', () => {
		render(
			<SliderExtras
				count={3}
				css={{tickLabel: 'tickLabel'}}
				focused
				labels={['Low', 'Mid', 'High']}
				max={100}
				min={0}
				value={50}
			/>
		);

		const labels = document.querySelectorAll('.tickLabel');

		expect(getMarqueeOn(labels[0])).toBe('off');
		expect(getMarqueeOn(labels[1])).toBe('render');
		expect(getMarqueeOn(labels[2])).toBe('off');
	});

	test('should marquee the tick label closest to the value', () => {
		render(
			<SliderExtras
				count={3}
				css={{tickLabel: 'tickLabel'}}
				focused
				labels={['Low', 'Mid', 'High']}
				max={100}
				min={0}
				value={40}
			/>
		);

		const labels = [...document.querySelectorAll('.tickLabel')];

		expect(labels.map(getMarqueeOn)).toEqual(['off', 'render', 'off']);
	});

	test('should marquee the side label under the pointer when moving between ends', () => {
		render(
			<SliderExtras
				css={{startLabel: 'startLabel', endLabel: 'endLabel'}}
				endLabel="End"
				focused
				max={100}
				min={0}
				startLabel="Start"
				value={0}
			/>
		);

		const start = document.querySelector('.startLabel');
		const end = document.querySelector('.endLabel');

		expect(getMarqueeOn(start)).toBe('render');
		expect(getMarqueeOn(end)).toBe('off');

		// React turns this mouseout into leave on the start label and enter on the end label.
		fireEvent.mouseOut(start, {relatedTarget: end});

		expect(getMarqueeOn(start)).toBe('off');
		expect(getMarqueeOn(end)).toBe('render');
	});

	test('should marquee the knob side label again after the pointer leaves', () => {
		render(
			<SliderExtras
				css={{startLabel: 'startLabel', endLabel: 'endLabel'}}
				endLabel="End"
				focused
				max={100}
				min={0}
				startLabel="Start"
				value={0}
			/>
		);

		const start = document.querySelector('.startLabel');
		const end = document.querySelector('.endLabel');

		fireEvent.mouseEnter(end);

		expect(getMarqueeOn(start)).toBe('off');
		expect(getMarqueeOn(end)).toBe('render');

		fireEvent.mouseLeave(end);

		expect(getMarqueeOn(start)).toBe('render');
		expect(getMarqueeOn(end)).toBe('off');
	});
});
