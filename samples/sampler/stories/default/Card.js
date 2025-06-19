import {Card, CardBase} from '@enact/limestone/Card';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import {Card as UiCard} from '@enact/ui/Card';
import ri from '@enact/ui/resolution';

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
		centered={args['centered']}
		disabled={args['disabled']}
		imageIconSrc={args['imageIconSrc']}
		hasContainer={args['hasContainer']}
		// eslint-disable-next-line no-undefined
		label={args['label'] ? args['label'] : undefined}
		orientation={args['orientation']}
		primaryBadgeSrc={args['primaryBadgeSrc']}
		roundedImage={args['roundedImage']}
		secondaryBadgeSrc={args['secondaryBadgeSrc']}
		// eslint-disable-next-line no-undefined
		secondaryLabel={args['secondaryLabel'] ? args['secondaryLabel'] : undefined}
		selected={args['selected']}
		src={args['src']}
		style={{
			position: 'absolute',
			width: ri.scaleToRem(args['orientation'] === 'vertical' ? 768 : 1320),
			height: ri.scaleToRem(args['orientation'] === 'vertical' ? 708 : 336)
		}}
	>
		{args['children']}
	</Card>
);

boolean('captionOverlay', _Card, Config);
boolean('centered', _Card, Config);
boolean('disabled', _Card, Config);
object('imageIconSrc', _Card, Config, generateImageSrc('0084ff'));
object('imageSize', _Card, Config);
boolean('hasContainer', _Card, Config);
text('label', _Card, Config, 'Card label');
select('orientation', _Card, prop.orientation, Config);
object('primaryBadgeSrc', _Card, Config, generateImageSrc('ff6d78'));
boolean('roundedImage', _Card, Config);
object('secondaryBadgeSrc', _Card, Config, generateImageSrc('ffc600'));
text('secondaryLabel', _Card, Config, 'Card secondary label');
boolean('selected', _Card, Config);
object('src', _Card, Config, generateImageSrc('93d371'));
text('children', _Card, Config, 'Card Caption');

_Card.storyName = 'Card';
_Card.parameters = {
	info: {
		text: 'The basic Card'
	}
};
