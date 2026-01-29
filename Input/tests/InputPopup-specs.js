import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {InputPopup} from '../Input';

const FloatingLayerController = FloatingLayerDecorator('div');

describe('InputPopup Specs', () => {
	test('should be rendered opened if open is set to true', () => {
		const placeholder = 'InputPopup Placeholder';
		render(
			<FloatingLayerController>
				<InputPopup open placeholder={placeholder} />
			</FloatingLayerController>
		);

		const actual = screen.getByPlaceholderText(placeholder);

		expect(actual).toBeTruthy();
	});

	test('should set the input default value', () => {
		const str = 'This is the default value';

		render(
			<FloatingLayerController>
				<InputPopup defaultValue={str} open />
			</FloatingLayerController>
		);

		const actual = screen.getByDisplayValue(str);

		expect(actual).toBeTruthy();
	});

	test('should set the input value', () => {
		const str = 'This is the value';

		render(
			<FloatingLayerController>
				<InputPopup open value={str} />
			</FloatingLayerController>
		);

		const actual = screen.getByDisplayValue(str);

		expect(actual).toBeTruthy();
	});

	test('should set value instead defaultValue when both values are set', () => {
		const strDefaultValue = 'This is the default value';
		const strValue = 'This is the value';

		render(
			<FloatingLayerController>
				<InputPopup defaultValue={strDefaultValue} open value={strValue || strDefaultValue} />
			</FloatingLayerController>
		);

		const actual = screen.getByDisplayValue(strValue);

		expect(actual).toBeTruthy();
	});
});
