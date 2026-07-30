import TimePicker from '@enact/limestone/TimePicker';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, text} from '@enact/storybook-utils/addons/controls';

const Config = mergeComponentMetadata('TimePicker', TimePicker);
TimePicker.displayName = 'TimePicker';

export default {
	title: 'Limestone/TimePicker',
	component: 'TimePicker'
};

export const _TimePicker = (args) => {
	const actions = {
		onChange: action('onChange'),
		onComplete: action('onComplete')
	};

	const controls = {
		disabled: args['disabled'],
		spotlightDisabled: args['spotlightDisabled'],
		noLabel: args['noLabel'],
		hourAriaLabel: args['hourAriaLabel'],
		minuteAriaLabel: args['minuteAriaLabel'],
		meridiemAriaLabel: args['meridiemAriaLabel']
	};

	return (
		<TimePicker
			{...actions}
			{...controls}
		/>
	);
};

boolean('disabled', _TimePicker, Config);
boolean('spotlightDisabled', _TimePicker, Config);
boolean('noLabel', _TimePicker, Config);
text('hourAriaLabel', _TimePicker, Config, '');
text('minuteAriaLabel', _TimePicker, Config, '');
text('meridiemAriaLabel', _TimePicker, Config, '');

_TimePicker.storyName = 'TimePicker';
_TimePicker.parameters = {
	info: {
		text: 'The basic TimePicker'
	}
};
