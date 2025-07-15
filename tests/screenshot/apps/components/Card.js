import Card from '../../../../Card';

import {withConfig, withProps} from './utils';

import img from '../../images/600x600.png';

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
	<Card src={img} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} label="Short" imageIconSrc={img} captionOverlay selected>Short</Card>,

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

const CardTests = [
	...defaultCardTests,

	// Disabled
	...withProps({disabled: true}, defaultCardTests),

	// Centered
	...withProps({centered: true}, defaultCardTests),

	// Focused
	...withConfig({focus: true, wrapper: {padded: true}}, defaultCardTests),

	...withConfig({
		focusRing: true,
		focus: true
	}, [
		<Card src={img} css={css} label="Focus ring label">Short</Card>,
		<Card src={img} css={css} label="Focus ring label" roundedImage>Short</Card>
	])
];

export default CardTests;
