import {Chip, ChipBase} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import iconNames from '../helper/icons';

const Config = mergeComponentMetadata('Chip', ChipBase, Chip);
Chip.displayName = 'Chip';

export default {
	title: 'Limestone/Chip',
	component: 'Chip'
};

export const _Chip = (args) => {
	return (
		<div style={{marginTop: ri.scaleToRem(100)}}>
			<Chip
				deleteButton={args['deleteButton']}
				disabled={args['disabled']}
				icon={args['icon']}
				style={{marginLeft: ri.scaleToRem(36)}}
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

select('icon', _Chip, ['', ...iconNames], Config, 'check');
text('children', _Chip, Config, 'chip');
object('deleteButton', _Chip, Config, deleteButtonProps);
boolean('disabled', _Chip, Config, false);

_Chip.storyName = 'Chip';
_Chip.parameters = {
	info: {
		text: 'The basic Chip'
	}
};
