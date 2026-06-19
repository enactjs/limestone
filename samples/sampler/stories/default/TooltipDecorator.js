import Button from '@enact/limestone/Button';
import TooltipDecorator, {Tooltip, TooltipBase} from '@enact/limestone/TooltipDecorator';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, number, object, select, text} from '@enact/storybook-utils/addons/controls';

import iconNames from '../helper/icons';
import {svgGenerator} from '../helper/svg';
import css from './Tooltip.module.less';

const src = {
	hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
};

const Config = mergeComponentMetadata('TooltipDecorator', TooltipBase, Tooltip, TooltipDecorator);
Config.defaultProps.tooltipType = 'balloon';
const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const prop = {
	icons: ['', ...iconNames],
	tooltipPosition: [
		'above',
		'above center',
		'above left',
		'above right',
		'below',
		'below center',
		'below left',
		'below right',
		'left bottom',
		'left middle',
		'left top',
		'right bottom',
		'right middle',
		'right top'
	],
	tooltipType: ['balloon', 'transparent']
};

export default {
	title: 'Limestone/TooltipDecorator',
	component: 'TooltipDecorator'
};

export const _TooltipDecorator = (args) => (
	<div style={{textAlign: 'center'}}>
		<TooltipButton
			disabled={args['disabled']}
			icon={args['icon']}
			noArrow={args['noArrow']}
			tooltipCss={css}
			tooltipDelay={args['tooltipDelay']}
			tooltipImage={args['hasImage'] && args['tooltipImage']}
			tooltipMarquee={args['tooltipMarquee']}
			tooltipPosition={args['tooltipPosition']}
			tooltipRelative={args['tooltipRelative']}
			tooltipText={args['tooltipText']}
			tooltipType={args['tooltipType']}
			tooltipWidth={args['tooltipWidth']}
		>
			{args['children']}
		</TooltipButton>
	</div>
);

boolean('disabled', _TooltipDecorator, Config);
boolean('hasImage', _TooltipDecorator, Config);
select('icon', _TooltipDecorator, prop.icons, Config);
boolean('noArrow', _TooltipDecorator, Config);
number('tooltipDelay', _TooltipDecorator, Config, 500);
boolean('tooltipMarquee', _TooltipDecorator, Config);
select('tooltipPosition', _TooltipDecorator, prop.tooltipPosition, Config, prop.tooltipPosition[0]);
boolean('tooltipRelative', _TooltipDecorator, Config);
text('tooltipText', _TooltipDecorator, Config, 'tooltip!');
select('tooltipType', _TooltipDecorator, prop.tooltipType, Config);
number('tooltipWidth', _TooltipDecorator, Config);
text('children', _TooltipDecorator, Config, 'click me');
object('tooltipImage', _TooltipDecorator, Config, src);

_TooltipDecorator.storyName = 'TooltipDecorator';
_TooltipDecorator.parameters = {
	info: {
		text: 'The basic TooltipDecorator'
	}
};
