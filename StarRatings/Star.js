import {adaptEvent, forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './Star.module.less';

const SpottableIcon = Spottable(Icon);

const StarBase = kind({
    name: 'Star',

    propTypes: {
        /**
         * Unique identifier for the star.
         *
         * @type {String}
         * @required
         * @public
         */
        id: PropTypes.string.isRequired,

        /**
         * When `true`, the star is focusable and clickable.
         *
         * @type {Boolean}
         * @default false
         * @public
         */
        active: PropTypes.bool,

        /**
         * When `true`, the star glows while its row has focus.
         *
         * @type {Boolean}
         * @default false
         * @public
         */
        highlighted: PropTypes.bool,

        /**
         * Fill amount from 0 to 1, rounded to 10% steps.
         *
         * @type {Number}
         * @default 0
         * @public
         */
        value: PropTypes.number
    },

    defaultProps: {
        active: false,
        highlighted: false,
        value: 0
    },

    styles: {
        css,
        className: 'star'
    },

    handlers: {
        onClick: handle(
            forProp('active', true),
            adaptEvent(
                (ev, {id}) => ({id, ev}),
                forward('onClick')
            )
        )
    },

    computed: {
        className: ({highlighted, styler}) => styler.append({highlighted}),
        style: ({style, value}) => {
            const percent = Math.round(value * 10) * 10;
            return {...style, '--star-fill': percent + '%'};
        }
    },

    render: ({active, className, id, onClick, style, ...rest}) => {
        delete rest.highlighted;
        delete rest.value;

        const IconComponent = active ? SpottableIcon : Icon;

        return (
            <IconComponent
                {...rest}
                className={className}
                id={id}
                onClick={onClick}
                style={style}
                size={180}
            >
                star
            </IconComponent>
        );
    }
});

const StarDecorator = compose(
    Skinnable
);

const Star = StarDecorator(StarBase);

export default Star;
export {
    Star,
    StarBase,
    StarDecorator
};