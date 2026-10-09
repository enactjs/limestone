import Star, {StarBase} from '../../../../StarRatings/Star';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range} from '@enact/storybook-utils/addons/controls';

const StarConfig = mergeComponentMetadata('Star', Star, StarBase);

export default {
    title: 'Limestone/StarRatings',
    component: 'Star'
};

export const _Star = (args) => {
    const actions = {
        onClick: action('onClick'),
    };

    const controls = {
        active: args['active'],
        value: args['value']
    };

    return (<>
        <Star
            {...actions}
            {...controls}
            id='star'
        />
    </>);
}

boolean('active', _Star, StarConfig);
range('value', _Star, StarConfig, {min: 0, max: 1, step: 0.01});

_Star.storyName = 'Star';