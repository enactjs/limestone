import {IconItem, IconItemBase} from '@enact/limestone/IconItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, number, object, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import iconNames from '../helper/icons';
import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('IconItem', IconItemBase, IconItem);
IconItem.displayName = 'IconItem';

const imageObj = {
	src: {
		hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
		fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
		uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
	},
	size: {
		height: ri.scaleToRem(150),
		width: ri.scaleToRem(150)
	}
};

export default {
	title: 'Limestone/IconItem',
	component: 'IconItem'
};

export const _IconItem = (args) => {
	const image = Object.assign({}, args['image'], args['label'] === '' &&
		{
			size: {
				height: ri.scaleToRem(231),
				width: ri.scaleToRem(231)
			}
		});

	return (
		<IconItem
			background={args['background']}
			bordered={args['bordered']}
			disabled={args['disabled']}
			icon={args['icon']}
			image={image}
			label={args['label']}
			labelColor={args['labelColor']}
			labelOn={args['labelOn']}
			style={{
				position: 'absolute',
				height: args['height'] !== 0 && ri.scale(args['height']),
				width: args['height'] !== 0 && ri.scale(args['width'])
			}}
			title={args['title']}
			titleOn={args['titleOn']}
		/>
	);
};

text('background', _IconItem, Config, '#26282b');
boolean('bordered', _IconItem, Config, true);
boolean('disabled', _IconItem, Config);
select('icon', _IconItem, ['', ...iconNames], Config, 'usb');
object('image', _IconItem, Config, imageObj);
text('label', _IconItem, Config, 'USB');
select('labelColor', _IconItem, ['light', 'dark'], Config);
select('labelOn', _IconItem, ['focus', 'render'], Config);
number('width', _IconItem, Config, 0);
number('height', _IconItem, Config, 0);
text('title', _IconItem, Config);
select('titleOn', _IconItem, ['focus', 'render'], Config);

_IconItem.storyName = 'IconItem';
_IconItem.parameters = {
	info: {
		text: 'The basic IconItem'
	}
};
