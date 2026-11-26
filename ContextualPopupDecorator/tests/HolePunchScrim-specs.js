import {unit} from '@enact/ui/resolution';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {HolePunchScrimBase} from '../HolePunchScrim';

describe('HolePunchScrim', () => {
	test('should convert numeric bounds from pixels to rem', () => {
		render(<HolePunchScrimBase data-testid="scrim" holeBounds={{top: 10, left: 20, width: 30, height: 40}} />);

		const scrim = screen.getByTestId('scrim');

		expect(scrim.style.getPropertyValue('--hole-top')).toBe(unit(10, 'rem'));
		expect(scrim.style.getPropertyValue('--hole-left')).toBe(unit(20, 'rem'));
		expect(scrim.style.getPropertyValue('--hole-width')).toBe(unit(30, 'rem'));
		expect(scrim.style.getPropertyValue('--hole-height')).toBe(unit(40, 'rem'));
	});

	test('should use string bounds as they are', () => {
		render(<HolePunchScrimBase data-testid="scrim" holeBounds={{top: '5px', width: '50%'}} />);

		const scrim = screen.getByTestId('scrim');

		expect(scrim.style.getPropertyValue('--hole-top')).toBe('5px');
		expect(scrim.style.getPropertyValue('--hole-width')).toBe('50%');
	});

	test('should default missing bounds to zero', () => {
		render(<HolePunchScrimBase data-testid="scrim" />);

		const scrim = screen.getByTestId('scrim');

		expect(scrim.style.getPropertyValue('--hole-left')).toBe('0rem');
		expect(scrim.style.getPropertyValue('--hole-height')).toBe('0rem');
	});

	test('should keep a given `style`', () => {
		render(<HolePunchScrimBase data-testid="scrim" style={{opacity: 0.5}} />);

		expect(screen.getByTestId('scrim')).toHaveStyle({opacity: '0.5'});
	});
});
