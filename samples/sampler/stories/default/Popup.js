import BodyText from '@enact/limestone/BodyText';
import Popup from '@enact/limestone/Popup';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';

const Config = mergeComponentMetadata('Popup', Popup);

export default {
	title: 'Limestone/Popup',
	component: 'Popup'
};

export const _Popup = (args) => {
	const actions = {
		onClose: action('onClose'),
		onHide: action('onHide'),
		onShow: action('onShow')
	};

	const controls = {
		open: args['open'],
		position: args['position'],
		noAnimation: args['noAnimation'],
		noAutoDismiss: args['noAutoDismiss'],
		scrimType: args['scrimType'],
		spotlightRestrict: args['spotlightRestrict']
	};

	return (
		<div>
			<Popup
				{...actions}
				{...controls}
			>
				<div>{args['children']}</div>
			</Popup>
			<BodyText centered>Use CONTROLS to interact with Popup.</BodyText>
		</div>
	);
};

boolean('open', _Popup, Config);
select(
	'position',
	_Popup,
	['bottom', 'bottom left', 'bottom right', 'center', 'fullscreen', 'left', 'right', 'top', 'top left', 'top right'],
	Config,
	'bottom'
);
boolean('noAnimation', _Popup, Config);
boolean('noAutoDismiss', _Popup, Config);
select('scrimType', _Popup, ['none', 'translucent', 'transparent'], Config, 'translucent');
select(
	'spotlightRestrict',
	_Popup,
	['self-first', 'self-only'],
	Config,
	'self-only'
);
text('children', _Popup, Config, 'Hello Popup');

_Popup.storyName = 'Popup';
_Popup.parameters = {
	info: {
		text: 'Basic usage of Popup'
	}
};
