import ri from '@enact/ui/resolution';

import Card from '../../../../Card';

import {withConfig, withProps} from './utils';

import img from '../../images/600x600.png';

const verticalStyle = {height: ri.scale(708), width: ri.scale(768)};
const horizontalStyle = {height: ri.scale(336), width: ri.scale(1500)};

const defaultCardTests = [
	// Vertical
	<Card src={img} style={verticalStyle} orientation="vertical">Short</Card>,
	<Card src={img} style={verticalStyle} selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short">Short</Card>,
	<Card src={img} style={verticalStyle} label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} style={verticalStyle} label="Short" selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" roudedImage>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" roudedImage selected>Short</Card>,
	<Card src={img} style={verticalStyle} imageIconSrc={img}>Short</Card>,
	<Card src={img} style={verticalStyle} imageIconSrc={img} selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img}>Short</Card>,
	<Card src={img} style={verticalStyle} label="This is very very very very long label. This is very very long label." imageIconSrc={img}>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} roundedImage selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} hasContainer>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} hasContainer roundedImage>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} hasContainer selected>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} style={verticalStyle} label="Short" imageIconSrc={img} captionOverlay selected>Short</Card>,

	// Horizontal
	<Card src={img} style={horizontalStyle} orientation="horizontal">Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" selected>Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="Short">Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="short" selected>Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="Short" roundedImage>Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="Short" roundedImage selected>Short</Card>
];

const CardTests = [
	...defaultCardTests,

	// Disabled
	...withProps({disabled: true}, defaultCardTests),

	// Centered
	...withProps({centered: true}, defaultCardTests),

	// Focused
	...withConfig({focus: true, wrapper: {padded: true}}, defaultCardTests)
];

export default CardTests;
