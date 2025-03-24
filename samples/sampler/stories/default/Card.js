import {Card, CardBase} from '@enact/limestone/Card';
import {Card as UiCard} from '@enact/ui/Card';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';

const Config = mergeComponentMetadata('Card', UiCard, CardBase, Card);
Card.displayName = 'Card';

const src = {
	hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
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
		hasContainer={args['hasContainer']}
		label={args['label']}
		orientation={args['orientation']}
		roundedImage={args['roundedImage']}
		selected={args['selected']}
		showSelection={args['showSelection']}
		src={args['src']}
		style={{
			position: 'absolute',
			width: ri.scaleToRem(args['orientation'] === 'vertical' ? 768 : 1020),
			height: ri.scaleToRem(args['orientation'] === 'vertical' ? 588 : 240)
		}}
	>
		{args['children']}
	</Card>
);

boolean('captionOverlay', _Card, Config);
boolean('centered', _Card, Config);
boolean('disabled', _Card, Config);
boolean('hasContainer', _Card, Config);
text('label', _Card, Config, 'Card label');
select('orientation', _Card, prop.orientation, Config);
boolean('roundedImage', _Card, Config);
boolean('selected', _Card, Config);
boolean('showSelection', _Card, Config);
object('src', _Card, Config, src);
text('children', _Card, Config, 'Card Caption');

_Card.storyName = 'Card';
_Card.parameters = {
	info: {
		text: 'The basic Card'
	}
};
