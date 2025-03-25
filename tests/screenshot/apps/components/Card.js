import ri from '@enact/ui/resolution';

import Card from '../../../../Card';

import {withProps} from './utils';

import img from '../../images/600x600.png';

const verticalStyle = {height: ri.scale(708), width: ri.scale(768)};
const horizontalStyle = {height: ri.scale(336), width: ri.scale(1500)};

const defaultCardTests = [
	// Vertical
	<Card src={img} style={verticalStyle} orientation="vertical">Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short">Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" imageIconSrc={img}>Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img}>Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img} hasContainer>Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} style={verticalStyle} orientation="vertical" label="Short" showSelection selected>Short</Card>,

	// Horizontal
	<Card src={img} style={horizontalStyle} orientation="horizontal">Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="Short">Short</Card>,
	<Card src={img} style={horizontalStyle} orientation="horizontal" label="short" showSelection selected>Short</Card>
];

const CardTests = [
	...defaultCardTests,

	// Disabled
	...withProps({disabled: true}, defaultCardTests)
];

export default CardTests;
