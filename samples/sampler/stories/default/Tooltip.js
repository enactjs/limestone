import Button from '@enact/limestone/Button';
import Tooltip from '../../../../Tooltip/Tooltip';
import {boolean, number, object, select, text} from '@enact/storybook-utils/addons/controls';
import {mergeComponentMetadata} from '@enact/storybook-utils';

import {svgGenerator} from '../helper/svg';

Tooltip.displayName = 'Tooltip';

export default {
	title: 'Limestone/Tooltip',
	component: 'Tooltip'
};

const TooltipButton = Tooltip(Button);

const Config = mergeComponentMetadata('Tooltip', Tooltip);

Config.defaultProps = {
	direction: 'below center',
	forceOpen: false,
	marquee: false
};

const src = {
	hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
};

export const _Tooltip = (args) => (
	<TooltipButton
		forceOpen={args['forceOpen']}
		marquee={args['marquee']}
		direction={args['direction']}
		text={args['text']}
		src={args['hasImage'] ? args['src'] : null}
		size={{
			height: args['height'],
			width: args['width']
		}}
	>
		Click me
	</TooltipButton>
);

boolean('forceOpen', _Tooltip);
select('direction', _Tooltip, ['below center', 'above center', 'right middle', 'left middle'], Config);
boolean('hasImage', _Tooltip, false);
boolean('marquee', _Tooltip);
text('text', _Tooltip, Config, 'Tooltip');
number('height', _Tooltip, Config, 0);
number('width', _Tooltip, Config, 0);
object('src', _Tooltip, Config, src);

_Tooltip.storyName = 'Tooltip';
_Tooltip.parameters = {
	info: {
		text: 'The basic Tooltip'
	}
};
