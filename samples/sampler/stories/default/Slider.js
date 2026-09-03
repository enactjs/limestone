import Slider, {SliderBase, SliderTooltip} from '@enact/limestone/Slider';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, range, object, select} from '@enact/storybook-utils/addons/controls';

const SliderConfig = mergeComponentMetadata('Slider', SliderBase, Slider);
const SliderTooltipConfig = mergeComponentMetadata('SliderTooltip', SliderTooltip);
Slider.displayName = 'Slider';
SliderTooltip.displayName = 'SliderTooltip';

export default {
	title: 'Limestone/Slider',
	component: 'Slider'
};

export const _Slider = (args) => {
	const actions = {
		onActivate: action('onActivate'),
		onChange: action('onChange'),
		onWheel: action('onWheel')
	};

	const controls = {
		activateOnSelect: args['activateOnSelect'] || false,
		backgroundProgress: args['backgroundProgress'],
		colorPicker: args['colorPicker'],
		disabled: args['disabled'],
		keyFrequency: args['keyFrequency'],
		knobStep: args['knobStep'],
		max: args['max'],
		min: args['min'],
		noFill: args['noFill'],
		orientation: args['orientation'],
		progressAnchor: args['progressAnchor'],
		showAnchor: args['showAnchor'],
		showMinMax: args['showMinMax'],
		step: args['step'],
		wheelInterval: args['wheelInterval']
	};

	return (
		<Slider
			{...actions}
			{...controls}
		>
			{args['tooltip'] ? <SliderTooltip percent={args['percent']} position={args['position']} /> : null}
		</Slider>
	);
};

boolean('disabled', _Slider, SliderConfig);
boolean('tooltip', _Slider, SliderTooltipConfig);
boolean('percent', _Slider, SliderTooltipConfig);
select(
	'position',
	_Slider,
	[
		'',
		'above',
		'above left',
		'above center',
		'above right',
		'above before',
		'above after',
		'before',
		'left',
		'right',
		'after',
		'below',
		'below left',
		'below center',
		'below right',
		'below before',
		'below after'
	],
	SliderTooltipConfig,
	''
);
boolean('activateOnSelect', _Slider, SliderConfig);
range(
	'backgroundProgress',
	_Slider,
	SliderConfig,
	{min: 0, max: 1, step: 0.01},
	0.5
);
object('keyFrequency', _Slider, SliderConfig, [1]);
number('knobStep', _Slider, SliderConfig);
number('max', _Slider, SliderConfig, 10);
number('min', _Slider, SliderConfig, 0);
boolean('noFill', _Slider, SliderConfig);
select('orientation', _Slider, ['horizontal', 'vertical'], SliderConfig);
range(
	'progressAnchor',
	_Slider,
	SliderConfig,
	{min: 0, max: 1, step: 0.01},
	0
);
boolean('showAnchor', _Slider, SliderConfig);
boolean('showMinMax', _Slider, SliderConfig);
number('step', _Slider, SliderConfig, 1);
number('wheelInterval', _Slider, SliderConfig);
boolean('colorPicker', _Slider, SliderConfig);

_Slider.storyName = 'Slider';
_Slider.parameters = {
	info: {
		text: 'Basic usage of Slider'
	}
};
