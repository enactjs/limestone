import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {SliderExtras, Ticks} from '../Ticks';

describe('Ticks', () => {
	test('should render tick marks using default styles', () => {
		render(<Ticks className="customTicks" count={3} />);

		expect(document.querySelector('.customTicks')).toBeInTheDocument();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
	});

	test('should render nothing when no tick count is provided', () => {
		render(<Ticks startLabel="Start" />);

		expect(screen.getByText('Start')).toBeInTheDocument();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
	});

	test('should skip empty tick labels', () => {
		render(<Ticks count={3} css={{tick: 'tick', tickMark: 'tickMark', tickLabel: 'tickLabel'}} labels={['A', '', 'C']} />);

		expect(screen.getByText('A')).toBeInTheDocument();
		expect(screen.getByText('C')).toBeInTheDocument();
		expect(document.querySelectorAll('.tickMark')).toHaveLength(3);
		expect(document.querySelectorAll('.tickLabel')).toHaveLength(2);
	});

	test('should omit empty side labels', () => {
		render(<Ticks count={3} css={{startLabel: 'startLabel', endLabel: 'endLabel'}} endLabel="" startLabel="" />);

		expect(document.querySelector('.startLabel')).toBeNull();
		expect(document.querySelector('.endLabel')).toBeNull();
	});

	test('should center side labels on a vertical slider', () => {
		render(<Ticks count={3} endLabel="Max" focused orientation="vertical" startLabel="Min" />);

		expect(screen.getByText('Min')).toBeInTheDocument();
		expect(screen.getByText('Max')).toBeInTheDocument();
	});
});

describe('SliderExtras', () => {
	test('should render min and max values', () => {
		render(<SliderExtras className="minMax" max={10} min={1} showMinMax />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
	});

	test('should render side labels without tick marks', () => {
		render(<SliderExtras count={0} endLabel="End" startLabel="Start" />);

		expect(screen.getByText('Start')).toBeInTheDocument();
		expect(screen.getByText('End')).toBeInTheDocument();
		expect(document.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
	});
});
