import RadioButton, {RadioButtonBase} from '@enact/limestone/RadioButton';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';

import iconNames from '../helper/icons';

RadioButton.displayName = 'RadioButton';
const Config = mergeComponentMetadata('RadioButton', RadioButtonBase, RadioButton);

export default {
	title: 'Limestone/RadioButton',
	component: 'RadioButton'
};

export const _RadioButton = (args) => (
	<RadioButton
		disabled={args['disabled']}
		label={args['label']}
		onToggle={action('onToggle')}
		selected={args['selected']}
	>
		{args['children']}
	</RadioButton>
);

select('children', _RadioButton, ['', ...iconNames], Config);
boolean('disabled', _RadioButton, Config);
text('label', _RadioButton, Config, 'RadioButton label');
boolean('selected', _RadioButton, Config);

_RadioButton.storyName = 'RadioButton';
_RadioButton.parameters = {
	info: {
		text: 'Standalone RadioButton component. The component used in RadioItem.'
	}
};
