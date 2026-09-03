import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import {ContextualPopupDecorator} from '@enact/limestone/ContextualPopupDecorator';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

const ContextualButton = ContextualPopupDecorator(Button);

ContextualButton.displayName = 'ContextualButton';
const Config = mergeComponentMetadata('ContextualPopupDecorator', Button, ContextualButton);

// NOTE: Something about the HOC is inhibiting accessing its defaultProps, so we're adding them here
// manually. This can (should) be revisited later to find out why and a solution.
Config.defaultProps = {
	direction: 'below center',
	offset: 'small',
	open: false,
	spotlightRestrict: 'self-first'
};

export default {
	title: 'Limestone/ContextualPopupDecorator',
	component: 'ContextualPopupDecorator'
};

export const _ContextualPopupDecorator = (args) => {
	const renderPopup = () => (
		<div>{args['popup string']}</div>
	);

	const actions = {
		onClose: action('onClose'),
		onOpen: action('onOpen')
	};

	const controls = {
		direction: args['direction'],
		noAutoDismiss: args['noAutoDismiss'],
		offset: args['offset'],
		open: args['open'],
		spotlightRestrict: args['spotlightRestrict']
	};

	return (
		<div style={{textAlign: 'center', marginTop: ri.scaleToRem(198)}}>
			<ContextualButton
				{...actions}
				{...controls}
				popupComponent={renderPopup} // eslint-disable-line react/jsx-no-bind
			>
				{args['button string']}
			</ContextualButton>
			<BodyText centered>Use CONTROLS to interact with the ContextualPopup.</BodyText>
		</div>
	);
};

boolean('open', _ContextualPopupDecorator, Config);
select(
	'direction',
	_ContextualPopupDecorator,
	[
		'above',
		'above center',
		'above left',
		'above right',
		'below',
		'below center',
		'below left',
		'below right',
		'left middle',
		'left top',
		'left bottom',
		'right middle',
		'right top',
		'right bottom'
	],
	Config
);
boolean('noAutoDismiss', _ContextualPopupDecorator, Config);
select('offset', _ContextualPopupDecorator, ['none', 'overlap', 'small', 'large'], Config);
select('spotlightRestrict', _ContextualPopupDecorator, ['none', 'self-first', 'self-only'], Config);
text('button string', _ContextualPopupDecorator, Config, 'Hello Contextual Button');
text('popup string', _ContextualPopupDecorator, {groupId: 'Popup'}, 'Hello Contextual Popup');

_ContextualPopupDecorator.storyName = 'ContextualPopupDecorator';
_ContextualPopupDecorator.parameters = {
	info: {
		text: 'Basic usage of ContextualPopupDecorator'
	}
};
