import Card from '../../../../Card';

import {withConfig, withProps} from './utils';

import img from '../../images/600x600.png';

import css from './Card.module.less';
const defaultCardTests = [
	// Vertical
	<Card src={img} css={css} orientation="vertical">Short</Card>,
	<Card src={img} css={css} selected>Short</Card>,
	<Card src={img} css={css} label="Short">Short</Card>,
	<Card src={img} css={css} label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="Secondary label">Short</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} css={css} label="Short" selected>Short</Card>,
	<Card src={img} css={css} label="Short" roundedImage>Short</Card>,
	<Card src={img} css={css} label="Short" roundedImage selected>Short</Card>,
	<Card src={img} css={css} imageIconSrc={img}>Short</Card>,
	<Card src={img} css={css} imageIconSrc={img} selected>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img}>Short</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="Secondary label" imageIconSrc={img}>Short</Card>,
	<Card src={img} css={css} label="This is very very very very long label. This is very very long label." imageIconSrc={img}>This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} selected>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} roundedImage>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} roundedImage selected>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} hasContainer>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} hasContainer roundedImage>Short</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} hasContainer roundedImage>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} hasContainer selected>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} css={css} label="Label" secondaryLabel="Secondary label" imageIconSrc={img} captionOverlay>Short</Card>,
	<Card src={img} css={css} label="Short" imageIconSrc={img} captionOverlay selected>Short</Card>,

	// Horizontal
	<Card src={img} css={css} orientation="horizontal">Short</Card>,
	<Card src={img} css={css} orientation="horizontal" selected>Short</Card>,
	<Card src={img} css={css} orientation="horizontal" label="Short">Short</Card>,
	<Card src={img} css={css} orientation="horizontal" label="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} css={css} orientation="horizontal" label="Label" secondaryLabel="Secondary label">Short</Card>,
	<Card src={img} css={css} orientation="horizontal" label="Label" secondaryLabel="This is very very very very long label. This is very very long label.">This is very very very very long caption. This is very very long caption.</Card>,
	<Card src={img} css={css} orientation="horizontal" label="short" selected>Short</Card>,
	<Card src={img} css={css} orientation="horizontal" label="Short" roundedImage>Short</Card>,
	<Card src={img} css={css} orientation="horizontal" label="Short" roundedImage selected>Short</Card>
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
