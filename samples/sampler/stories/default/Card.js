import {Card, CardBase} from '@enact/limestone/Card';
import icons from '@enact/limestone/Icon/IconList';
import {Icon} from '@enact/limestone/Icon';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, object, select, text} from '@enact/storybook-utils/addons/controls';
import {Card as UiCard} from '@enact/ui/Card';

import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('Card', UiCard, CardBase, Card);
Card.displayName = 'Card';

const generateImageSrc = (color) => {
	return {
		hd: svgGenerator(200, 200, color, 'ffffff', '200 X 200'),
		fhd: svgGenerator(300, 300, color, 'ffffff', '300 X 300'),
		uhd: svgGenerator(600, 600, color, 'ffffff', '600 X 600')
	};
};

const iconsList = Object.keys(icons).sort();
const randomIcon = iconsList[Math.floor(Math.random() * iconsList.length)];

const prop = {
	orientation: ['horizontal', 'vertical'],
	icons: {
		'no icons': null,
		'1 icon': [
			<Icon>{randomIcon}</Icon>
		],
		'2 icons': [
			<Icon>{randomIcon}</Icon>,
			<Icon>{randomIcon}</Icon>
		],
		'3 icons': [
			<Icon>{randomIcon}</Icon>,
			<Icon>{randomIcon}</Icon>,
			<Icon>{randomIcon}</Icon>
		]
	}
};

export default {
	title: 'Limestone/Card',
	component: 'Card'
};

export const _Card = (args) => (
	<Card
		aria-label={args['aria-label']}
		captionOverlay={args['captionOverlay']}
		captionOverlayOnFocus={args['captionOverlayOnFocus']}
		centered={args['centered']}
		disabled={args['disabled']}
		fitImage={args['fitImage']}
		icon={args['icon']}
		labelIcons={prop.icons[args['labelIcons']]}
		imageIconSrc={args['imageIconSrc']}
		imageSize={args['imageSize']}
		hasContainer={args['hasContainer']}
		// eslint-disable-next-line no-undefined
		label={args['label'] ? args['label'] : undefined}
		onClick={action('onClick')}
		orientation={args['orientation']}
		primaryBadgeSrc={args['primaryBadgeSrc']}
		progress={args['progress']}
		roundedImage={args['roundedImage']}
		secondaryBadgeSrc={args['secondaryBadgeSrc']}
		// eslint-disable-next-line no-undefined
		secondaryLabel={args['secondaryLabel'] ? args['secondaryLabel'] : undefined}
		secondaryLabelIcons={prop.icons[args['secondaryLabelIcons']]}
		selected={args['selected']}
		showProgressBar={args['showProgressBar']}
		splitCaption={args['splitCaption']}
		src={args['src']}
		withoutMarquee={args['withoutMarquee']}
	>
		{args['children']}
	</Card>
);

text('aria-label', _Card, Config);
boolean('captionOverlay', _Card, Config);
boolean('captionOverlayOnFocus', _Card, Config);
boolean('centered', _Card, Config);
text('children', _Card, Config, 'Card Caption');
boolean('disabled', _Card, Config);
boolean('fitImage', _Card, Config);
select('icon', _Card, iconsList, Config);
object('imageIconSrc', _Card, Config, generateImageSrc('0084ff'));
object('imageSize', _Card, Config);
boolean('hasContainer', _Card, Config);
text('label', _Card, Config, 'Card label');
select('labelIcons', _Card, ['no icons', '1 icon', '2 icons', '3 icons'], Config, 'no icons');
select('orientation', _Card, prop.orientation, Config);
object('primaryBadgeSrc', _Card, Config, generateImageSrc('ff6d78'));
number('progress', _Card, Config, 0.5);
boolean('roundedImage', _Card, Config);
object('secondaryBadgeSrc', _Card, Config, generateImageSrc('ffc600'));
text('secondaryLabel', _Card, Config, 'Card secondary label');
select('secondaryLabelIcons', _Card, ['no icons', '1 icon', '2 icons', '3 icons'], Config, 'no icons');
boolean('selected', _Card, Config);
boolean('showProgressBar', _Card, Config);
boolean('splitCaption', _Card, Config);
object('src', _Card, Config, generateImageSrc('93d371'));
boolean('withoutMarquee', _Card, Config);

_Card.storyName = 'Card';
_Card.parameters = {
	info: {
		text: 'The basic Card'
	}
};
