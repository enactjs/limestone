import Card from '../../../../Card';
import Icon from '../../../../Icon';
import Image from '../../../../Image';

import {pick, withConfig, withProps} from './utils';

import img from '../../images/600x600.png';

const iconBadge = <Icon>ai</Icon>;
const imageBadge = <Image src={img} />;
const labelIcons = [<Icon>ai</Icon>, <Icon>ai</Icon>];

const defaultCardTests = [
	// Vertical
	<Card src={img} orientation="vertical">Short</Card>,
	<Card src={img} selected>Short</Card>,
	<Card src={img} label="Short">Short</Card>,
	<Card src={img} label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Label" secondaryLabel="Secondary label">Short</Card>,
	<Card src={img} label="Label" secondaryLabel="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Short" selected>Short</Card>,
	<Card src={img} label="Short" roundedImage>Short</Card>,
	<Card src={img} label="Short" roundedImage selected>Short</Card>,
	<Card src={img} imageIconSrc={img}>Short</Card>,
	<Card src={img} imageIconSrc={img} selected>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img}>Short</Card>,
	<Card src={img} label="Label" secondaryLabel="Secondary label" imageIconSrc={img}>Short</Card>,
	<Card src={img} label="This is very very very very long label. This is very very long label." imageIconSrc={img}>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Short" imageIconSrc={img} selected>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} roundedImage selected>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} hasContainer>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} hasContainer roundedImage>Short</Card>,
	<Card src={img} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} hasContainer roundedImage>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} hasContainer selected>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlayOnFocus>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay captionOverlayOnFocus>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay hasContainer>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlayOnFocus hasContainer>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay captionOverlayOnFocus hasContainer>Short</Card>,
	<Card src={img} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay selected>Short</Card>,
	<Card src={img} label="This is very very very very long label. This is very very long label." captionOverlay>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Label" secondaryLabel="This is very very very very long label. This is very very long label." captionOverlay>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="This is very very very very long label. This is very very long label." withoutMarquee>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Label" secondaryLabel="This is very very very very long label. This is very very long label." withoutMarquee>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="This is very very very very long label. This is very very long label." captionOverlay withoutMarquee>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} label="Label" secondaryLabel="This is very very very very long label. This is very very long label." captionOverlay withoutMarquee>This is very very very very long caption. This is very very long caption.</Card>,

	// Horizontal
	<Card src={img} orientation="horizontal">Short</Card>,
	<Card src={img} orientation="horizontal" selected>Short</Card>,
	<Card src={img} orientation="horizontal" label="Short">Short</Card>,
	<Card src={img} orientation="horizontal" label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} orientation="horizontal" label="Label" secondaryLabel="Secondary label">Short</Card>,
	<Card src={img} orientation="horizontal" label="Label" secondaryLabel="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} orientation="horizontal" label="short" selected>Short</Card>,
	<Card src={img} orientation="horizontal" label="Short" roundedImage>Short</Card>,
	<Card src={img} orientation="horizontal" label="Short" roundedImage selected>Short</Card>
];

const newTypeCardTests = [
	// Vertical
	<Card src={img} label="Secondary Text" labelIcons={labelIcons} primaryBadge={iconBadge} progress={0.7} secondaryBadge={imageBadge} secondaryLabel="Secondary Text" secondaryLabelIcons={labelIcons} captionOverlay roundedImage selected showProgressBar>Title</Card>,
	<Card src={img} imageIconSrc={img} label="Secondary Text" labelIcons={labelIcons} primaryBadge={iconBadge} secondaryBadge={imageBadge} secondaryLabel="Secondary Text" secondaryLabelIcons={labelIcons} roundedImage selected>Title</Card>,
	<Card src={img} imageIconSrc={img} captionOverlay centeredTitle withoutMarquee>Title Title Title Title Title</Card>,
	<Card src={img} imageIconSrc={img} captionOverlayOnFocus centeredTitle withoutMarquee>Title Title Title Title Title</Card>,
	<Card src={img} captionImageIconsSrc={[img, img, img, img]} label="Secondary Text" labelIcons={labelIcons} primaryBadge={iconBadge} progress={0.7} secondaryBadge={imageBadge} progressBarOverlay selected showProgressBar>Title</Card>,
	<Card src={img} captionImageIconsSrc={[img, img, img, img]} label="This is very very very very long label. This is very very long label." labelIcons={labelIcons} primaryBadge={iconBadge} progress={0.7} secondaryBadge={imageBadge} captionOverflow progressBarOverlay selected showProgressBar>Title</Card>,
	<Card src={img} captionImageIconsSrc={[img, img, img, img]} label="This is very very very very long label. This is very very long label." labelIcons={labelIcons} primaryBadge={iconBadge} progress={0.7} secondaryBadge={imageBadge} captionOverflowOnFocus progressBarOverlay selected showProgressBar>Title</Card>,
	<Card src={img} captionImageIconsSrc={[img, img, img, img]} label="Secondary Text" labelIcons={labelIcons} primaryBadge={iconBadge} duration={234} secondaryBadge={imageBadge} durationOverlay selected showDuration>Title</Card>,

	// Horizontal
	<Card src={img} label="Secondary Text" labelIcons={labelIcons} orientation="horizontal" secondaryLabel="Secondary Text" secondaryLabelIcons={labelIcons} selected>Title</Card>
];

const cardSmokeTests = [
	...defaultCardTests.slice(0, 15),
	...defaultCardTests.slice(36, 41),
	...newTypeCardTests
];

const cardCommentedTests = [
	// Disabled
	...withProps({disabled: true}, defaultCardTests),

	// Centered
	...withProps({centered: true}, defaultCardTests),

	// Icon
	...withProps({icon: 'trash'}, defaultCardTests),

	// Show ProgressBar
	...withProps({progress: 0.5, showProgressBar: true}, defaultCardTests),

	// Split Caption
	...withProps({splitCaption: true}, defaultCardTests)
];

const cardFocusTests = [
	// Focused
	...withConfig({focus: true, wrapper: {padded: true}}, defaultCardTests),
	...withConfig({focus: true, wrapper: {padded: true}}, newTypeCardTests),

	// FocusRing
	...withConfig({focusRing: true, focus: true, wrapper: {padded: true}}, withProps({label: 'focusRing'}, defaultCardTests))
];

const cardLargeTextTests = [
	// Large text
	...withConfig({skinVariants: ['largeText']}, defaultCardTests),
	...withConfig({skinVariants: ['largeText']}, newTypeCardTests),
	...withConfig({focus: true, wrapper: {padded: true}}, pick(cardSmokeTests, 0, 5, 10)),
	...withConfig({focusRing: true, focus: true, wrapper: {padded: true}}, withProps({label: 'focusRing'}, pick(cardSmokeTests, 0)))
];

const CardTests = [
	...cardSmokeTests,
	...cardCommentedTests,
	...cardFocusTests,
	...cardLargeTextTests
];

export default CardTests;
