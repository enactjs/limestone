import KeyGuide from '@enact/limestone/KeyGuide';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, range, select, text} from '@enact/storybook-utils/addons/controls';

import css from './KeyGuide.module.less';

const prop = {
	icon: ['red', 'green', 'yellow', 'blue', 'gear', 'trash', 'search'],
	arrowPosition: ['none', 'top', 'bottom', 'left', 'right'],
	type: ['icon', 'image']
};

const Config = mergeComponentMetadata('KeyGuide', KeyGuide);
KeyGuide.displayName = 'KeyGuide';

export default {
	title: 'Limestone/KeyGuide',
	component: 'KeyGuide'
};

export const _KeyGuide = (args) => {
	const itemCount = args['items'];
	const icon = args['first item icon'];
	const items = [
		{icon, children: args['Item 1 children'], key: 1},
		{icon: 'plus', children: 'Item 1', key: 2},
		{icon: 'minus', children: 'Item 2', key: 3},
		{icon: 'music', children: 'Item 3', key: 4}
	];
	const children = args['guide type'] === 'image' ? {imageSrc: 'https://dummyimage.com/64/e048e0/0011ff', children: 'Remote control use guide. text text text text text text.'} : items.slice(0, itemCount);

	return <KeyGuide arrowPosition={args['arrowPosition']} css={css} open={args['open']}>{children}</KeyGuide>;
};

select('guide type', _KeyGuide, prop.type, Config, 'icon');
range('items', _KeyGuide, Config, {min: 0, max: 4}, 3);
select('first item icon', _KeyGuide, prop.icon, Config, prop.icon[0]);
text('Item 1 children', _KeyGuide, Config, 'This is long name item');
select('arrowPosition', _KeyGuide, prop.arrowPosition, Config, prop.arrowPosition[0]);
boolean('open', _KeyGuide, Config, true);

_KeyGuide.storyName = 'KeyGuide';
_KeyGuide.parameters = {
	info: {
		text: 'Explains the operation of remote keys'
	},
	// Work around for https://github.com/storybookjs/storybook/issues/18269
	docs: {
		source: {
			code: `<KeyGuide open>
	{[
		{icon: 'red', children: 'This is long name item', key: 1},
		{icon: 'plus', children: 'Item 1', key: 2},
		{icon: 'minus', children: 'Item 2', key: 3}
	]}
</KeyGuide>`
		}
	}
};
