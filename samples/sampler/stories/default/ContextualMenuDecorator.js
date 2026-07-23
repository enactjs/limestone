import Button from '@enact/limestone/Button';
import ContextualMenuDecorator from '@enact/limestone/ContextualMenuDecorator';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {range, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

const ContextualButton = ContextualMenuDecorator(Button);

ContextualButton.displayName = 'ContextualButton';
const Config = mergeComponentMetadata(
	'ContextualMenuDecorator',
	Button,
	ContextualButton,
	ContextualMenuDecorator
);

// NOTE: Something about the HOC is inhibiting accessing its defaultProps, so we're adding them here
// manually. This can (should) be revisited later to find out why and a solution.
Config.defaultProps = {
	direction: 'below right',
	offset: 'overlap',
	popupWidth: 'auto'
};

export default {
	title: 'Limestone/ContextualMenuDecorator',
	component: 'ContextualMenuDecorator'
};

export const _ContextualMenuDecorator = (args) => {
	const controls = {
		direction: args['direction'],
		offset: args['offset'],
		popupWidth: args['popupWidth']
	};

	const itemCount = args['items'];
	const items = new Array(itemCount).fill().map((i, index) => `Option ${index + 1}`);

	return (
		<div style={{textAlign: 'center', marginTop: ri.scaleToRem(198)}}>
			<ContextualButton
				{...controls}
				menuItems={items}
				onClose={action('onClose')}
				style={{width: ri.scaleToRem(1020)}}
			>
				{args['button string']}
			</ContextualButton>
		</div>
	);
};

range('items', _ContextualMenuDecorator, Config, {min: 0, max: 10}, 2);
select(
	'direction',
	_ContextualMenuDecorator,
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
select('offset', _ContextualMenuDecorator, ['none', 'overlap', 'small', 'large'], Config);
select('popupWidth', _ContextualMenuDecorator, ['auto', 'small', 'large'], Config);
text('button string', _ContextualMenuDecorator, Config, 'Contextual Button');

_ContextualMenuDecorator.storyName = 'ContextualMenuDecorator';
_ContextualMenuDecorator.parameters = {
	info: {
		text: 'Basic usage of ContextualMenuDecorator'
	}
};
