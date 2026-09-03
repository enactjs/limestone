import ColorPicker, {ColorPickerBase} from '@enact/limestone/ColorPicker';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, text} from '@enact/storybook-utils/addons/controls';
import {Fragment, useState} from 'react';

ColorPicker.displayName = 'ColorPicker';
const Config = mergeComponentMetadata('ColorPicker', ColorPickerBase, ColorPicker);

const presetColors = [
	'#FF0000',
	'#00FF00',
	'#0000FF',
	'#FFFF00',
	'#00FFFF',
	'#FFFFFF',
	'#000000'
];

export default {
	title: 'Limestone/ColorPicker',
	component: 'ColorPicker'
};

export const WithPresetColors = (args) => {
	const [color, setColor] = useState('#FF00FF');
	const controls = {
		disabled: args['disabled'],
		text: args['text']
	};

	return (
		<Fragment>
			<ColorPicker
				{...controls}
				color={color}
				colorHandler={setColor}
				presetColors={presetColors}
			/>
		</Fragment>
	);
};

boolean('disabled', WithPresetColors, Config, false);
text('text', WithPresetColors, Config, 'Color Picker');

WithPresetColors.storyName = 'with preset colors';
