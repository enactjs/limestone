import Indicator, {IndicatorBase} from '@enact/limestone/Indicator';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {range, select} from '@enact/storybook-utils/addons/controls';
import {action} from '@enact/storybook-utils/addons/actions';
import BodyText from '../../../../BodyText';

Indicator.displayName = 'Indicator';
const Config = mergeComponentMetadata('Indicator', IndicatorBase, Indicator);

const prop = {
	types: ['dots', 'numbers']
};

export default {
	title: 'Limestone/Indicator',
	component: 'Indicator'
};

export const _Indicator = (args) => (
	<>
		<BodyText>
			Use controls to change the values for indicator
		</BodyText>
		<Indicator
			current={args['current']}
			onChange={action('onChange')}
			total={args['total']}
			type={args['type']}
		/>
	</>
);

range('current', _Indicator, Config, {min: 1, max: 10}, 3);
range('total', _Indicator, Config, {min: 2, max: 10}, 5);
select('type', _Indicator, prop.types, Config);

_Indicator.storyName = 'Indicator';
_Indicator.parameters = {
	info: {
		text: 'Basic usage of Indicator'
	}
};
