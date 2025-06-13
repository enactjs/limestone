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
	let style;
	const hasContent = args['children'].length || args['label'];
	const isVertical = args['orientation'] === 'vertical';
	const wideHeight = args['wideImage'] ? ri.scaleToRem(336) : ri.scaleToRem(240);

	if (!hasContent) {
		style = {width: ri.scaleToRem(618), height: ri.scaleToRem(618)};
	} else if (isVertical) {
		style = {width: ri.scaleToRem(768), height: ri.scaleToRem(588)};
	} else {
		style = {width: ri.scaleToRem(1464), height: wideHeight};
	}

	return (
		<ImageItem
			centered={args['centered']}
			disabled={args['disabled']}
			label={args['label']}
			orientation={args['orientation']}
			selected={args['selected']}
			showSelection={args['showSelection']}
			src={args['src']}
			style={{
				position: 'absolute',
				...style
			}}
			wideImage={args['wideImage']}
		>
			{args['children']}
		</ImageItem>
	);
};

boolean('centered', _ImageItem, Config);
boolean('disabled', _ImageItem, Config);
text('label', _ImageItem, Config, 'ImageItem label');
select('orientation', _ImageItem, prop.orientation, Config);
boolean('selected', _ImageItem, Config);
boolean('showSelection', _ImageItem, Config);
boolean('wideImage', _ImageItem, Config);
object('src', _ImageItem, Config, src);
text('children', _ImageItem, Config, 'ImageItem Caption');

_ImageItem.storyName = 'ImageItem';
_ImageItem.parameters = {
	info: {
		text: 'The basic ImageItem'
	}
};
