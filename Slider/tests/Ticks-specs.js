import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {SliderExtras, Ticks} from '../Ticks';

// Wraps the real Marquee and exposes `marqueeOn`, which the rendered DOM does not reveal.
jest.mock('../../Marquee', () => {
	const {default: ActualMarquee} = jest.requireActual('../../Marquee');
	const Marquee = (props) => <ActualMarquee {...props} data-marquee-on={props.marqueeOn} />;

	return {
		__esModule: true,
		default: Marquee
	};
});

const hasMarquee = (node) => node.classList.contains('marquee') || Boolean(node.querySelector('.marquee'));

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

		expect(hasMarquee(labels[0])).toBe(false);
		expect(hasMarquee(labels[1])).toBe(true);
		expect(hasMarquee(labels[2])).toBe(false);
	});

	test('should not marquee tick labels when none is focused or hovered', () => {
		render(<Ticks count={3} css={{tickLabel: 'tickLabel'}} labels={['Low', 'Mid', 'High']} />);

		const labels = [...document.querySelectorAll('.tickLabel')];

		expect(labels.map(hasMarquee)).toEqual([false, false, false]);
	});

	test('should marquee the hovered tick when the slider is not focused', () => {
		render(<Ticks count={3} css={{tick: 'tick', tickLabel: 'tickLabel'}} labels={['Low', 'Mid', 'High']} />);

		const labels = [...document.querySelectorAll('.tickLabel')];
		const ticks = [...document.querySelectorAll('.tick')];

		fireEvent.mouseOver(ticks[1]);

		expect(labels.map(hasMarquee)).toEqual([false, true, false]);

		fireEvent.mouseOver(labels[1]);

		expect(labels.map(hasMarquee)).toEqual([false, true, false]);

		fireEvent.mouseLeave(ticks[0].parentElement);

		expect(labels.map(hasMarquee)).toEqual([false, false, false]);
	});

	test('should keep the focused tick label while the pointer is over another tick', () => {
		const props = {count: 3, css: {tick: 'tick', tickLabel: 'tickLabel'}, labels: ['Low', 'Mid', 'High']};
		const {rerender} = render(<Ticks {...props} focusedIndex={0} />);
		const marquee = () => [...document.querySelectorAll('.tickLabel')].map(hasMarquee);

		fireEvent.mouseOver(document.querySelectorAll('.tick')[1]);

		expect(marquee()).toEqual([true, false, false]);

		rerender(<Ticks {...props} focusedIndex={2} />);

		expect(marquee()).toEqual([false, false, true]);

		rerender(<Ticks {...props} />);

		expect(marquee()).toEqual([false, false, false]);
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

	test('should marquee only the side label closest to the value while focused', () => {
		const {rerender} = render(
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

		expect(hasMarquee(document.querySelector('.startLabel'))).toBe(true);
		expect(hasMarquee(document.querySelector('.endLabel'))).toBe(false);

		rerender(
			<SliderExtras
				css={{startLabel: 'startLabel', endLabel: 'endLabel'}}
				endLabel="End"
				focused
				max={100}
				min={0}
				startLabel="Start"
				value={100}
			/>
		);

		expect(hasMarquee(document.querySelector('.startLabel'))).toBe(false);
		expect(hasMarquee(document.querySelector('.endLabel'))).toBe(true);
	});

	test('should marquee side labels on hover when the slider is not focused', () => {
		render(
			<SliderExtras
				css={{startLabel: 'startLabel', endLabel: 'endLabel'}}
				endLabel="End"
				startLabel="Start"
			/>
		);

		expect(hasMarquee(document.querySelector('.startLabel'))).toBe(true);
		expect(hasMarquee(document.querySelector('.endLabel'))).toBe(true);
		expect(document.querySelector('.startLabel')).toHaveAttribute('data-marquee-on', 'hover');
		expect(document.querySelector('.endLabel')).toHaveAttribute('data-marquee-on', 'hover');
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

		expect(hasMarquee(labels[0])).toBe(false);
		expect(hasMarquee(labels[1])).toBe(true);
		expect(hasMarquee(labels[2])).toBe(false);
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

		expect(labels.map(hasMarquee)).toEqual([false, true, false]);
	});

});
