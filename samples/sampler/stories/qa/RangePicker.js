import RangePicker, {RangePickerBase} from '@enact/limestone/RangePicker';
import {mergeComponentMetadata, nullify} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select, text} from '@enact/storybook-utils/addons/controls';

import css from './Picker.module.less';

const Config = mergeComponentMetadata('RangePicker', RangePickerBase, RangePicker);

// Set up some defaults for info and controls
const prop = {
	changedBy: ['enter', 'arrow'],
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large', 1, 2, 3, 4, 5, 6]
};
const parseIntOrNullify = (v) => {
	if (!isNaN(parseInt(v))) {
		return parseInt(v);
	} else {
		return nullify(v);
	}
};

RangePicker.displayName = 'RangePicker';

export default {
	title: 'Limestone/RangePicker',
	component: 'RangePicker'
};

export const WithCustomizedTitleStyle = (args) => {
	const controls = {
		max: args['max'],
		min: args['min'],
		changedBy: args['changedBy'],
		disabled: args['disabled'],
		inlineTitle: args['inlineTitle'],
		joined: args['joined'],
		noAnimation: args['noAnimation'],
		orientation: args['orientation'],
		step: args['step'],
		title: args['title'],
		width: parseIntOrNullify(args['width']),
		wrap: args['wrap']
	};

	return (
		<RangePicker
			{...controls}
			css={css}
			defaultValue={0}
			onChange={action('onChange')}
		/>
	);
};

number('max', WithCustomizedTitleStyle, Config, 100);
number('min', WithCustomizedTitleStyle, Config, 0);
select('changedBy', WithCustomizedTitleStyle, prop.changedBy, Config, 'enter');
boolean('disabled', WithCustomizedTitleStyle, Config);
boolean('inlineTitle', WithCustomizedTitleStyle, Config);
boolean('joined', WithCustomizedTitleStyle, Config);
boolean('noAnimation', WithCustomizedTitleStyle, Config);
select('orientation', WithCustomizedTitleStyle, prop.orientation, Config, 'horizontal');
number('step', WithCustomizedTitleStyle, Config, 5);
text('title', WithCustomizedTitleStyle, Config, 'Long title with customized style');
select('width', WithCustomizedTitleStyle, prop.width, Config, 'small');
boolean('wrap', WithCustomizedTitleStyle, Config);

WithCustomizedTitleStyle.storyName = 'With Customized Style';
