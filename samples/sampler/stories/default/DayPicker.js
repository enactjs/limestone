import DayPicker from '@enact/limestone/DayPicker';
import Scroller from '@enact/limestone/Scroller';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, text} from '@enact/storybook-utils/addons/controls';

DayPicker.displayName = 'DayPicker';

export default {
	title: 'Limestone/DayPicker',
	component: 'DayPicker'
};

export const _DayPicker = (args) => (
	<Scroller>
		<DayPicker
			aria-label={args['aria-label']}
			disabled={args['disabled']}
			onSelect={action('onSelect')}
		/>
	</Scroller>
);

text('aria-label', _DayPicker, DayPicker);
boolean('disabled', _DayPicker, DayPicker);

_DayPicker.storyName = 'DayPicker';
_DayPicker.parameters = {
	info: {
		text: 'The basic DayPicker'
	}
};
