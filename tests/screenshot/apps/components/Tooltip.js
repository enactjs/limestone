import {Tooltip} from '../../../../TooltipDecorator/TooltipDecorator';

import hd from '../../images/200x200.png';

import {withConfig, withTallglyphLocale, TallglyphLatin, TallglyphMultiScript} from './utils';

const TooltipDisplay = (props) => (
	<div {...props}>
		<Tooltip
			type={props.type}
			direction={props.direction}
			arrowAnchor={props.arrowAnchor}
			style={{top: '50%', left: '50%'}}
			marquee={props.marquee}
			width={props.tooltipWidth}
			tooltipImage={props.tooltipImage}
			tooltipImagePosition={props.tooltipImagePosition}
			tooltipImageSize={props.tooltipImageSize}
		>
			{props.children || `View ${props.type} ${props.direction} ${props.arrowAnchor}`}
		</Tooltip>
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

const tooltipImageSize = {height: 200, width: 200};

const tooltipImageTests = [
	// Image above the text label (default position)
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center', tooltipImage: hd, tooltipImageSize}),

	// Image below the text label
	TooltipDisplay({type: 'balloon', direction: 'above', arrowAnchor: 'center', tooltipImage: hd, tooltipImageSize, tooltipImagePosition: 'below'}),

	// Image below the text label, tooltip positioned below the anchor
	TooltipDisplay({type: 'balloon', direction: 'below', arrowAnchor: 'center', tooltipImage: hd, tooltipImageSize, tooltipImagePosition: 'below'})
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
		...tooltipImageTests,
		...tooltipLargeTextTests
	]),
	...withTallglyphLocale(tooltipTallglyphTests, {wrapper: {full: true}})
];

export default TooltipTests;
