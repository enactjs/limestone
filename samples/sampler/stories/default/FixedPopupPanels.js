import Button from '@enact/limestone/Button';
import BodyText from '@enact/limestone/BodyText';
import {FixedPopupPanels, Panel, Header} from '@enact/limestone/FixedPopupPanels';
import Item from '@enact/limestone/Item';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range, select} from '@enact/storybook-utils/addons/controls';

import css from './FixedPopupPanels.module.less';

const Config = mergeComponentMetadata('FixedPopupPanels', FixedPopupPanels);
Config.defaultProps.position = 'right';
Config.defaultProps.scrimType = 'translucent';
Config.defaultProps.spotlightRestrict = 'self-only';
Config.defaultProps.width = 'narrow';

export default {
	title: 'Limestone/FixedPopupPanels',
	component: 'FixedPopupPanels'
};

export const _FixedPopupPanels = (args) => {
	const actions = {
		onBack: action('onBack'),
		onClose: action('onClose'),
		onHide: action('onHide'),
		onShow: action('onShow')
	};

	const controls = {
		index: args['index'],
		open: args['open'],
		position: args['position'],
		fullHeight: args['fullHeight'],
		width: args['width'],
		noAnimation: args['noAnimation'],
		noAutoDismiss: args['noAutoDismiss'],
		scrimType: args['scrimType'],
		spotlightRestrict: args['spotlightRestrict']
	};

	return (
		<div>
			<FixedPopupPanels
				{...actions}
				{...controls}
			>
				<Panel>
					<Header>
						<title>FixedPopupPanels Title</title>
						<subtitle>A panel type for options views</subtitle>
					</Header>
					<BodyText className={css.bodyText}>Example text inside an FixedPopupPanels Panel</BodyText>
					<div className={css.container}>
						<Item>Example Item 1</Item>
						<Item>Example Item 2</Item>
						<Item>Example Item 3</Item>
					</div>
				</Panel>
				<Panel>
					<Header>
						<title>Another Panel</title>
						<subtitle>This is the second page</subtitle>
					</Header>
					<BodyText className={css.bodyText}>Woo woo</BodyText>
					<div className={css.container}>
						<Item>Example Item 1 on Panel 2</Item>
						<Item>Example Item 2 on Panel 2</Item>
						<Item>Example Item 3 on Panel 2</Item>
					</div>
				</Panel>
				<Panel>
					<Header>
						<title>FixedPopupPanels Panel</title>
						<subtitle>This is the third page</subtitle>
					</Header>
					<div className={css.container}>
						<Item>Example Item 1 on Panel 3</Item>
						<Item>Example Item 2 on Panel 3</Item>
					</div>
					<footer className={css.footer}>
						<Button>Button 1</Button>
						<Button>Button 2</Button>
					</footer>
				</Panel>
			</FixedPopupPanels>
			<BodyText centered>Use CONTROLS to interact with FixedPopupPanels.</BodyText>
		</div>
	);
};

range('index', _FixedPopupPanels, Config, {min: 0, max: 2}, 0);
boolean('open', _FixedPopupPanels, Config);
select('position', _FixedPopupPanels, ['left', 'right'], Config);
boolean('fullHeight', _FixedPopupPanels, Config);
select('width', _FixedPopupPanels, ['narrow', 'half'], Config);
boolean('noAnimation', _FixedPopupPanels, Config);
boolean('noAutoDismiss', _FixedPopupPanels, Config);
select('scrimType', _FixedPopupPanels, ['none', 'translucent', 'transparent'], Config);
select('spotlightRestrict', _FixedPopupPanels, ['self-first', 'self-only'], Config);

_FixedPopupPanels.storyName = 'FixedPopupPanels';
_FixedPopupPanels.parameters = {
	info: {
		text: 'Basic usage of FixedPopupPanels'
	}
};
