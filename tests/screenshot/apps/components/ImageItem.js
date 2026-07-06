import ri from '@enact/ui/resolution';

import ImageItem from '../../../../ImageItem';

import {withConfig, withProps, withTallglyphLocale} from './utils';

import img from '../../images/600x600.png';

import css from './ImageItem.module.less';

// vertical ImageItem doesn't render well without defined styles right now.
const verticalStyle = {height: ri.scale(540), width: ri.scale(640)};

const imageItemBaseCases = [
	// Vertical
	<ImageItem src={img} style={verticalStyle} orientation="vertical" />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical">Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short" />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" imageIconSrc={img} />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short">Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img}>Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short" showSelection>Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short" selected showSelection>Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img} css={css}>Short</ImageItem>,

	// Horizontal
	<ImageItem src={img} orientation="horizontal" />,
	<ImageItem src={img} orientation="horizontal">Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" />,
	<ImageItem src={img} orientation="horizontal" imageIconSrc={img} />,
	<ImageItem src={img} orientation="horizontal" label="Short">Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" imageIconSrc={img}>Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" showSelection>Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" selected showSelection>Short</ImageItem>,

	// Wide Image
	<ImageItem src={img} orientation="horizontal" wideImage />,
	<ImageItem src={img} orientation="horizontal" wideImage >Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" wideImage />,
	<ImageItem src={img} orientation="horizontal" imageIconSrc={img} wideImage />,
	<ImageItem src={img} orientation="horizontal" label="Short" wideImage >Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" imageIconSrc={img} wideImage >Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" showSelection wideImage >Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Short" selected showSelection wideImage >Short</ImageItem>
];

const imageItemFocusTests = [
	// Vertical
	<ImageItem src={img} style={verticalStyle} orientation="vertical" />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical">Focused Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short" />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" imageIconSrc={img} />,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short">Focused Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short" imageIconSrc={img}>Focused Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short" showSelection>Focused Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short" selected showSelection>Focused Short</ImageItem>,
	<ImageItem src={img} style={verticalStyle} orientation="vertical" label="Focused Short" imageIconSrc={img} css={css}>Focused Short</ImageItem>,

	// Horizontal
	<ImageItem src={img} orientation="horizontal" />,
	<ImageItem src={img} orientation="horizontal">Focused Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Focused Short" />,
	<ImageItem src={img} orientation="horizontal" imageIconSrc={img} />,
	<ImageItem src={img} orientation="horizontal" label="Focused Short">Focused Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Focused Short" imageIconSrc={img}>Focused Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Focused Short" showSelection>Focused Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label="Focused Short" selected showSelection>Focused Short</ImageItem>
];

const imageItemFocusCases = withConfig({focus: true, wrapper: {light: true, padded: true}}, imageItemFocusTests);

// Focus representatives (one vertical + one horizontal) for axes where the focus overlay
// barely interacts with the variant
const imageItemFocusReps = withConfig({focus: true, wrapper: {light: true, padded: true}}, [
	imageItemFocusTests[0],
	imageItemFocusTests[9]
]);

const imageItemTallglyphTests = [
	<ImageItem src={img} orientation="horizontal" label="Short">Short</ImageItem>,
	<ImageItem src={img} orientation="horizontal" label=" ฟิ้  ไั  ஒ  து"> ฟิ้  ไั  ஒ  து</ImageItem>
];

const ImageItemTests = [
	// base layout permutations + full focus coverage.
	...imageItemBaseCases,
	...imageItemFocusCases,

	// Layout variations, applied to the layout-bearing base cases only. Focus is an overlay
	// state covered above/below, so it isn't re-mirrored across every variation.
	...withProps({centered: true}, imageItemBaseCases),
	...withProps({disabled: true}, imageItemBaseCases),
	...withProps({centered: true, disabled: true}, imageItemBaseCases),

	// focus + disabled is a distinct state; keep representatives.
	...withProps({disabled: true}, imageItemFocusReps),

	// Large text — base permutations + focus representatives.
	...withConfig({skinVariants: ['largeText']}, imageItemBaseCases),
	...withConfig({skinVariants: ['largeText']}, imageItemFocusReps),

	// FocusRing
	...withConfig({
		focusRing: true,
		focus: true
	}, [
		<ImageItem src={img} style={{height: ri.scale(360), width: ri.scale(480)}} orientation="vertical" />
	]),

	// RTL — base permutations + focus representatives.
	...withConfig({locale: 'ar-SA'}, imageItemBaseCases),
	...withConfig({locale: 'ar-SA'}, imageItemFocusReps),

	...withTallglyphLocale(imageItemTallglyphTests)
];

export default ImageItemTests;
