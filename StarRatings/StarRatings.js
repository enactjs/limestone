import {adaptEvent, forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Changeable from '@enact/ui/Changeable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Skinnable from '../Skinnable';

import Star from './Star';

import css from './StarRatings.module.less';

// Returns the star element under the current touch point, or null
const getStarFromTouch = (ev, id) => {
    const touch = ev.touches && ev.touches[0];
    if (!touch) return null;

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    return el && el.closest(`[id^="${id}-star-"]`);
};

// Reads the star number (1-based) from a star id like `${id}-star-3`
const getStarNumber = (starId, id) => Number(starId.slice(`${id}-star-`.length));

// Moves focus to the star, which triggers the :focus-within glow
const focusStar = (star) => {
    if (star && document.activeElement !== star) {
        if (!Spotlight.focus(star)) {
            star.focus({preventScroll: true}); // fallback if Spotlight declines
        }
    }
};

const StarRatingsBase = kind({
    name: 'StarRatings',

    propTypes: {
        /**
         * Unique identifier, used to build each star's id.
         *
         * @type {String}
         * @required
         * @public
         */
        id: PropTypes.string.isRequired,

        /**
         * `false` = display mode (shows `displayValue`, not interactive)
         * `true`  = edit mode (shows `value`, interactive)
         *
         * @type {Boolean}
         * @default false
         * @public
         */
        active: PropTypes.bool,

        /**
         * Value shown in display mode. Supports fractions, e.g. 3.7.
         *
         * @type {Number}
         * @default 0
         * @public
         */
        displayValue: PropTypes.number,

        /**
         * Number of stars.
         *
         * @type {Number}
         * @default 5
         * @public
         */
        max: PropTypes.number,

        /**
         * Called in edit mode with `{value}`: the number of the selected star.
         *
         * @type {Function}
         * @public
         */
        onChange: PropTypes.func,

        /**
         * Value shown in edit mode. If omitted, the component keeps its own
         * internal value (via Changeable). Use `defaultValue` to set a starting value.
         *
         * @type {Number}
         * @public
         */
        value: PropTypes.number
    },

    defaultProps: {
        active: false,
        displayValue: 0,
        max: 5
    },

    styles: {
        css,
        className: 'starRatings'
    },

    handlers: {
        // Star forwards {id, ev}; turn it into {value} for onChange
        onStarClick: handle(
            forProp('active', true),
            adaptEvent(
                ({id: starId}, {id}) => ({value: getStarNumber(starId, id)}),
                forward('onChange')
            )
        ),

        // Glow starts as soon as the finger touches a star
        onTouchStart: handle(
            forward('onTouchStart'),
            forProp('active', true),
            (ev, {id}) => {
                focusStar(getStarFromTouch(ev, id));
                return true;
            }
        ),

        // Drag across the stars to change the rating
        onTouchMove: handle(
            forward('onTouchMove'),
            forProp('active', true),
            (ev, {id, onChange, value}) => {
                const star = getStarFromTouch(ev, id);
                if (!star) return false; // outside the row: keep the last value and focus

                focusStar(star);

                const starNumber = getStarNumber(star.id, id);
                if (onChange && starNumber && starNumber !== value) {
                    onChange({value: starNumber});
                }
                return true;
            }
        )
    },

    computed: {
        className: ({active, styler}) => styler.append({active}),
        shownValue: ({active, displayValue, value}) => (active ? value : displayValue) || 0
    },

    render: ({active, id, max, onStarClick, onTouchMove, onTouchStart, shownValue, ...rest}) => {
        delete rest.displayValue;
        delete rest.onChange;
        delete rest.value;

        return (
            <div
                {...rest}
                id={id}
                onTouchMove={onTouchMove}
                onTouchStart={onTouchStart}
            >
                {Array.from({length: max}, (_, i) => {
                    const starValue = Math.min(Math.max(shownValue - i, 0), 1);

                    return (
                        <Star
                            key={i}
                            id={`${id}-star-${i + 1}`}
                            active={active}
                            highlighted={active && starValue > 0}
                            value={starValue}
                            onClick={onStarClick}
                        />
                    );
                })}
            </div>
        );
    }
});

const StarRatingsDecorator = compose(
    Changeable,
    SpotlightContainerDecorator({enterTo: 'last-focused'}),
    Skinnable
);

const StarRatings = StarRatingsDecorator(StarRatingsBase);

export default StarRatings;
export {
    StarRatings,
    StarRatingsBase,
    StarRatingsDecorator
};