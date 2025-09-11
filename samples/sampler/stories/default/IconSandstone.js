import Heading from '@enact/limestone/Heading';
import Icon, {IconBase} from '@enact/limestone/IconSandstone';
import Scroller from '@enact/limestone/Scroller';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {range, select, text} from '@enact/storybook-utils/addons/controls';
import UiIcon from '@enact/ui/Icon';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

import iconNames from '../helper/iconsSandstone';

Icon.displayName = 'IconSandstone';
const Config = mergeComponentMetadata('Icon', UiIcon, IconBase, Icon);

export default {
	title: 'Limestone/Icon',
	component: 'Icon'
};

export const _IconSandstone = (args) => {
	const flip = args['flip'];

	let size = args['size'];
	if (size === 'custom number') {
		size = args['size (number)'];
	}

	const iconType = args['icon type'];
	let children;
	switch (iconType) {
		case 'glyph':
			children = args['icon'];
			break;
		case 'url src':
			children = args['src'];
			break;
		default:
			children = args['custom icon'];
	}
	return (
		<Scroller style={{height: '100%'}}>
			<Icon flip={flip} size={size}>
				{children}
			</Icon>
			<br />
			<br />
			<Heading showLine>All Icons</Heading>
			{iconNames.map((icon, index) => (
				<Icon key={index} flip={flip} size={size} title={icon}>
					{icon}
				</Icon>
			))}
		</Scroller>
	);
};

select('flip', _IconSandstone, ['', 'auto', 'both', 'horizontal', 'vertical'], Config, '');
select('size', _IconSandstone, ['tiny', 'small', 'medium', 'large', 'custom number'], Config);
range('size (number)', _IconSandstone, Config, {min: 24, max: 480, step: 6}, 60);
select('icon type', _IconSandstone, ['glyph', 'url src', 'custom'], Config, 'glyph');
select('icon', _IconSandstone, ['', ...iconNames], Config, 'record');
select('src', _IconSandstone, [docs, factory, logo], Config, logo);
text('custom icon', _IconSandstone, Config);

_IconSandstone.storyName = 'IconSandstone';
_IconSandstone.parameters = {
	info: {
		text: 'Basic usage of Icon'
	}
};
