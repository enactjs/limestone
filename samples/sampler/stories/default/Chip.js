import {Chip, ChipBase} from '@enact/limestone/Chip';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {select, text, boolean} from '@enact/storybook-utils/addons/controls';

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
				label={args['label']}
				direction={args['direction']}
				disabled={args['disabled']}
				hasDeleteButton={args['hasDeleteButton']}
			/>
		</div>
	);
};

select('icon', _Chip, ['', ...iconNames], Config, 'check');
text('label', _Chip, Config, 'chip');
select('direction', _Chip, ['top', 'right', 'bottom'], Config, 'right');
boolean('hasDeleteButton', _Chip, Config, true);
boolean('disabled', _Chip, Config, false);

_Chip.storyName = 'Chip';
_Chip.parameters = {
	info: {
		text: 'The basic Chip'
	}
};
