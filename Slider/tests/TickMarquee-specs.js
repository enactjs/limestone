import {render} from '@testing-library/react';

import {SliderExtras} from '../Ticks';

const marqueeCount = (label) => label.querySelectorAll('.marquee').length;

describe('Tick marquee', () => {
	test('should mount a marquee only for the tick label closest to the value', () => {
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

		expect(marqueeCount(labels[0])).toBe(0);
		expect(marqueeCount(labels[1])).toBe(1);
		expect(marqueeCount(labels[2])).toBe(0);
	});
});
