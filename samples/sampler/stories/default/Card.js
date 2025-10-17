import {Card, CardBase} from '@enact/limestone/Card';
import icons from '@enact/limestone/Icon/IconList';
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

const prop = {
	orientation: ['horizontal', 'vertical']
};

export default {
	title: 'Limestone/Card',
	component: 'Card'
};

export const _Card = (args) => (
	<Card
		captionOverlay={args['captionOverlay']}
		captionOverlayOnFocus={args['captionOverlayOnFocus']}
		centered={args['centered']}
		disabled={args['disabled']}
		fitImage={args['fitImage']}
		icon={args['icon']}
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
		selected={args['selected']}
		showProgressBar={args['showProgressBar']}
		src={args['src']}
	>
		{args['children']}
	</Card>
);

boolean('captionOverlay', _Card, Config);
boolean('captionOverlayOnFocus', _Card, Config);
boolean('centered', _Card, Config);
boolean('disabled', _Card, Config);
boolean('fitImage', _Card, Config);
select('icon', _Card, iconsList, Config);
object('imageIconSrc', _Card, Config, generateImageSrc('0084ff'));
object('imageSize', _Card, Config);
boolean('hasContainer', _Card, Config);
text('label', _Card, Config, 'Card label');
select('orientation', _Card, prop.orientation, Config);
object('primaryBadgeSrc', _Card, Config, generateImageSrc('ff6d78'));
number('progress', _Card, Config, 0.5);
boolean('roundedImage', _Card, Config);
object('secondaryBadgeSrc', _Card, Config, generateImageSrc('ffc600'));
text('secondaryLabel', _Card, Config, 'Card secondary label');
boolean('selected', _Card, Config);
boolean('showProgressBar', _Card, Config);
object('src', _Card, Config, generateImageSrc('93d371'));
text('children', _Card, Config, 'Card Caption');

_Card.storyName = 'Card';
_Card.parameters = {
	info: {
		text: 'The basic Card'
	}
};
