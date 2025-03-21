import {ImageItem, ImageItemBase} from '@enact/limestone/ImageItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import {ImageItem as UiImageItem} from '@enact/ui/ImageItem';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('ImageItem', UiImageItem, ImageItemBase, ImageItem);
ImageItem.displayName = 'ImageItem';

const src = {
	hd: svgGenerator(180, 180, '7ed31d', 'ffffff', '180 X 180'),
	fhd: svgGenerator(270, 270, '7ed31d', 'ffffff', '270 X 270'),
	uhd: svgGenerator(540, 540, '7ed31d', 'ffffff', '540 X 540')
};

const prop = {
	orientation: ['horizontal', 'vertical']
};

export default {
	title: 'Limestone/ImageItem',
	component: 'ImageItem'
};

export const _ImageItem = (args) => (
	<ImageItem
		centered={args['centered']}
		disabled={args['disabled']}
		label={args['label']}
		orientation={args['orientation']}
		selected={args['selected']}
		showSelection={args['showSelection']}
		src={args['src']}
		wideImage={args['wideImage']}
	>
		{args['children']}
	</ImageItem>
);

select('orientation', _ImageItem, prop.orientation, Config);
boolean('centered', _ImageItem, Config);
boolean('disabled', _ImageItem, Config);
boolean('selected', _ImageItem, Config);
boolean('showSelection', _ImageItem, Config);
boolean('wideImage', _ImageItem, Config);
text('children', _ImageItem, Config, 'Item Label');
text('label', _ImageItem, Config, 'Description label');
object('src', _ImageItem, Config, src);

_ImageItem.storyName = 'ImageItem';
_ImageItem.parameters = {
	info: {
		text: 'The basic ImageItem'
	}
};
