import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range} from '@enact/storybook-utils/addons/controls';
import {useCallback, useState} from 'react';
import StarRatings, {StarRatingsBase} from '../../../../StarRatings/StarRatings';

const StarRatingsConfig = mergeComponentMetadata('StarRatings', StarRatings, StarRatingsBase);

export default {
	title: 'Limestone/StarRatings',
	component: 'StarRatings'
};

export const _StarRatings = (args) => {
	const [defaultValue, setDefaultValue] = useState(0); // eslint-disable-line react-hooks/rules-of-hooks

	const handleValue = useCallback((event) => { // eslint-disable-line react-hooks/rules-of-hooks
		action('onChange')(event);
		setDefaultValue(event.value);
	}, []);

	const controls = {
		disabled: args['disabled'],
		overlayMode: args['overlayMode'],
		readOnly: args['readOnly'],
		value: args['readOnly'] ? args['value'] : defaultValue
	};

	return (<>
		<StarRatings
			onChange={handleValue}
			{...controls}
			id="user-rating"
		/>
	</>);
};

boolean('disabled', _StarRatings, StarRatingsConfig);
boolean('readOnly', _StarRatings, StarRatingsConfig);
boolean('overlayMode', _StarRatings, StarRatingsConfig);
range('value', _StarRatings, StarRatingsConfig, {min: 0, max: 5, step: 0.01});

_StarRatings.storyName = 'StarRatings';
