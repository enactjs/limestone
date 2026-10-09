import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range} from '@enact/storybook-utils/addons/controls';
import StarRatings, {StarRatingsBase} from '../../../../StarRatings/StarRatings';

const StarRatingsConfig = mergeComponentMetadata('Star', StarRatings, StarRatingsBase);

export default {
    title: 'Limestone/StarRatings',
    component: 'StarRatings'
};

export const _StarRatings = (args) => {
    const actions = {
        onChange: action('onChange')
    };

    const controls = {
        active: args['active'],
        displayValue: args['displayValue']
    };

    return (<>
        <StarRatings
            {...actions}
            {...controls}
            id="user-rating"
        />
    </>);
}

boolean('active', _StarRatings, StarRatingsConfig);
range('displayValue', _StarRatings, StarRatingsConfig, {min: 0, max: 5, step: 0.01});

_StarRatings.storyName = 'StarRatings';