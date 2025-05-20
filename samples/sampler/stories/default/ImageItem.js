import {ImageItem, ImageItemBase} from '@enact/limestone/ImageItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import {ImageItem as UiImageItem} from '@enact/ui/ImageItem';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('ImageItem', UiImageItem, ImageItemBase, ImageItem);
ImageItem.displayName = 'ImageItem';

const src = {
	hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
};

const prop = {
	orientation: ['horizontal', 'vertical']
};

export default {
	title: 'Limestone/ImageItem',
	component: 'ImageItem'
};

export const _ImageItem = (args) => {
	const style = args['children'].length || args['label'] ? {
		position: 'absolute',
		width: args['orientation'] === 'vertical' && ri.scaleToRem(768),
		height: args['orientation'] === 'vertical' && ri.scaleToRem(588)
	} : {};

	return (
		<ImageItem
			centered={args['centered']}
			disabled={args['disabled']}
			label={args['label']}
			orientation={args['orientation']}
			selected={args['selected']}
			showSelection={args['showSelection']}
			src={args['src']}
			style={style}
			wideImage={args['wideImage']}
		>
			{args['children']}
		</ImageItem>
	)
};

boolean('centered', _ImageItem, Config);
boolean('disabled', _ImageItem, Config);
text('label', _ImageItem, Config, 'ImageItem label');
boolean('selected', _ImageItem, Config);
boolean('showSelection', _ImageItem, Config);
boolean('wideImage', _ImageItem, Config);
object('src', _ImageItem, Config, src);
select('orientation', _ImageItem, prop.orientation, Config);
text('children', _ImageItem, Config, 'ImageItem Caption');

_ImageItem.storyName = 'ImageItem';
_ImageItem.parameters = {
	info: {
		text: 'The basic ImageItem'
	}
};
