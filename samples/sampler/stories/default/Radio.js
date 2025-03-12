import Radio, {RadioBase} from '@enact/limestone/Radio';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';

import iconNames from '../helper/icons';

Radio.displayName = 'Radio';
const Config = mergeComponentMetadata('Radio', RadioBase, Radio);

export default {
	title: 'Limestone/Radio',
	component: 'Radio'
};

export const _Radio = (args) => (
	<Radio
		disabled={args['disabled']}
		label={args['label']}
		onToggle={action('onToggle')}
	>
		{args['children']}
	</Radio>
);

select('children', _Radio, ['', ...iconNames], Config);
boolean('disabled', _Radio, Config);
text('label', _Radio, Config, 'Radio label');

_Radio.storyName = 'Radio';
_Radio.parameters = {
	info: {
		text: 'Standalone Radio component. The component used in RadioItem.'
	}
};
