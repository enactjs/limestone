import {Chip, ChipBase} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, object, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import iconNames from '../helper/icons';
import gameHomeIcon from '../../images/icon_app_game.png';

const icons = ['', ...iconNames].filter(iconName => iconName !== 'check' && iconName);

const Config = mergeComponentMetadata('Chip', ChipBase, Chip);
Chip.displayName = 'Chip';

export default {
	title: 'Limestone/Chip',
	component: 'Chip'
};

export const _Chip = (args) => {
	const isImage = args['isImage'];
	const icon = isImage ? gameHomeIcon : args['icon'];
	return (
		<div style={{marginTop: ri.scaleToRem(100), marginLeft: ri.scaleToRem(36)}}>
			<Chip
				checked={args['checked']}
				deleteButton={args['deleteButton']}
				disabled={args['disabled']}
				icon={icon}
				imageSize={args['imageSize']}
				isImage={isImage}
				onClick={action('onClick')}
			>
				{args['children']}
			</Chip>
		</div>
	);
};

const deleteButtonProps = {
	icon: 'closex',
	position: 'right',
	onDelete: action('onDelete')
};

boolean('checked', _Chip, Config, false);
select('icon', _Chip, ['', ...icons], Config, 'home');
text('children', _Chip, Config, 'chip');
object('deleteButton', _Chip, Config, deleteButtonProps);
boolean('disabled', _Chip, Config, false);
number('imageSize', _Chip, Config, 24);
boolean('isImage', _Chip, Config, false);

_Chip.storyName = 'Chip';
_Chip.parameters = {
	info: {
		text: 'The basic Chip'
	}
};
