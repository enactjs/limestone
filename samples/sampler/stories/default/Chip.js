import {Chip, ChipBase} from '@enact/limestone/Chip';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {select, text, boolean, object} from '@enact/storybook-utils/addons/controls';

import iconNames from '../helper/icons';

const Config = mergeComponentMetadata('Chip', ChipBase, Chip);
Chip.displayName = 'Chip';

export default {
	title: 'Limestone/Chip',
	component: 'Chip'
};

export const _Chip = (args) => {
	return (
		<div style={{position: 'relative', top: '24px', width: '100%', height: '100%'}}>
			<Chip
				icon={args['icon']}
				disabled={args['disabled']}
				deleteButton={args['deleteButton']}
			>
				{args['children']}
			</Chip>
		</div>
	);
};

const deleteButtonProps = {
	icon: 'closex',
	position: 'right'
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
