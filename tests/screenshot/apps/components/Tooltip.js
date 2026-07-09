import {Tooltip} from '../../../../TooltipDecorator/TooltipDecorator';

import {withConfig, withTallglyphLocale, TallglyphLatin, TallglyphMultiScript} from './utils';

const TooltipDisplay = (props) => (
	<div {...props}>
		<Tooltip type={props.type} direction={props.direction} arrowAnchor={props.arrowAnchor} style={{top: '50%', left: '50%'}} marquee={props.marquee} width={props.tooltipWidth}>{props.children || `View ${props.type} ${props.direction} ${props.arrowAnchor}`}</Tooltip>
	</div>
);

const tooltipSmokeTests = [
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center'}),
	TooltipDisplay({type: 'balloon', direction: 'below', arrowAnchor: 'center'}),
	TooltipDisplay({type: 'balloon', direction: 'right', arrowAnchor: 'middle'}),
	TooltipDisplay({type: 'balloon', direction: 'left', arrowAnchor: 'middle'}),
	TooltipDisplay({type: 'transparent', direction: 'below', arrowAnchor: 'center'}),
	TooltipDisplay({type: 'transparent', direction: 'above', arrowAnchor: 'center'}),
	TooltipDisplay({type: 'transparent', direction: 'left', arrowAnchor: 'middle'})
];

const tooltipExtendedTests = [
	// Custom width — smoke representatives
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center', tooltipWidth: 200}),
	TooltipDisplay({type: 'balloon', direction: 'left', arrowAnchor: 'middle', tooltipWidth: 200}),

	// Testing marquee
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center', tooltipWidth: 200, marquee: true}),
	TooltipDisplay({type: 'balloon', direction: 'left', arrowAnchor: 'middle', tooltipWidth: 200, marquee: true})
];

const tooltipLargeTextTests = [
	// textSize = 'large'
	{textSize: 'large', component: TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center'})},
	{textSize: 'large', component: TooltipDisplay({type: 'balloon', direction: 'below', arrowAnchor: 'center'})}
];

const tooltipTallglyphTests = [
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center', children: TallglyphMultiScript}),
	TooltipDisplay({type: 'transparent', direction: 'below', arrowAnchor: 'center', children: TallglyphLatin})
];

const TooltipTests = [
	...withConfig({
		wrapper: {
			full: true
		}
	}, [
		...tooltipSmokeTests,
		...tooltipExtendedTests,
		...tooltipLargeTextTests
	]),
	...withTallglyphLocale(tooltipTallglyphTests, {wrapper: {full: true}})
];

export default TooltipTests;
