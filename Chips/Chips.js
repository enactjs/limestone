/**
 * A container that surrounds the chip.
 *
 * @example
 * <Chips
 *   orientation="vertical"
 * >
 *  <Chip icon={icon}>label</Chip>
 *  <Chip icon={icon}> ... </Chip>
 *  <Chip icon={icon}>label</Chip>
 * </Chips>
 *
 * @module limestone/Chips
 * @exports Chips
 * @exports ChipsBase
 * @exports ChipsDecorator
 */

import {is} from '@enact/core/keymap';
import {setDefaultProps} from '@enact/core/util';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import Spotlight from '@enact/spotlight';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React, {useRef, createRef, Children, cloneElement, isValidElement} from 'react';

import css from './Chips.module.less';

const ChipsDefaultProps = {
	orientation: 'vertical'
};

/**
 * A container that contains the basic behavior of {@link limestone/Chips.Chips|ChipsBase}.
 *
 * @class ChipsBase
 * @memberof limestone/Chips
 * @ui
 * @public
 */

const ChipsBase = (props) => {
	const chipsProps = setDefaultProps(props, ChipsDefaultProps);
	const {children, orientation, ...rest} = chipsProps;
    const chipsClassNames = classnames(css.chips, css[orientation]);

    const containerRef = useRef(null);
    const buttonRefs = useRef(children.map(() => createRef()));

    const onButtonKeyDown = (ev, focused) => {
        const {keyCode, target} = ev;

        const containerId = containerRef.current.dataset.spotlightId;
        const candidate = Spotlight.getSpottableDescendants(containerId);
        const buttons = candidate.filter((_, index) => index % 2 === 1);
        const chips = candidate.filter((_, index) => index % 2 === 0);
        const currentIndex = buttons.findIndex((element) => target === element);

        const handleNavigation = (direction) => {
            const isPrev = direction === 'prev';
            const isNext = direction === 'next';

            const nextIndex = isPrev
                ? Math.max(0, currentIndex - 1)
                : isNext
                ? Math.min(buttons.length - 1, currentIndex + 1)
                : currentIndex;

            Spotlight.focus(chips[nextIndex]);
            ev.stopPropagation();
            buttonRefs.current[currentIndex].current.classList.remove(focused);
        };

        const isVertical = orientation === 'vertical';
        const isHorizontal = orientation === 'horizontal';

        if (isVertical) {
            if (is('up', keyCode)) handleNavigation('prev');
            else if (is('down', keyCode)) handleNavigation('next');
        } else if (isHorizontal) {
            if (is('left', keyCode)) handleNavigation('prev');
            else if (is('right', keyCode)) handleNavigation('next');
        }
    };

	return (
		<div className={chipsClassNames} ref={containerRef} {...rest}>
			{children && Children.map(children, (child, idx) => {
                 const handleDelete = (ev) => {
                    ev.stopPropagation();
            
                    if (child.props.deleteButton && child.props.deleteButton.onDelete) {
                        child.props.deleteButton.onDelete(ev);
                        Spotlight.focus(containerRef.current);
                    }
                };
                if(isValidElement(child)) {
                    return cloneElement(child, {
                        handleDelete,
                        onButtonKeyDown,
                        ref: buttonRefs.current[idx],
                    });
                }
                return child;
            })}
		</div>
	);
};

ChipsBase.displayName = 'Chips';

ChipsBase.propTypes = /** @lends limestone/Chips.ChipsBase.prototype */ {
    /**
     * {@link limestone/Chips.Chip|Chip} to be rendered
     *
     * @type {Node}
     * @public
     */
	children: PropTypes.string.isRequired,

    /**
     * The layout orientation of the component.
     *
     * @type {('horizontal'|'vertical')}
     * @default 'vertical'
     * @public
     */
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

const ChipsDecorator = compose(
	SpotlightContainerDecorator({
        //defaultElement: `.${css.selected}`,
        enterTo: 'default-element',
        leaveFor: {up: '#right'}
    })
);

/**
 * A container that surrounds the chip.
 *
 * Usage:
 * ```
 * <Chips
 *   orientation="vertical"
 * >
 *  <Chip icon={icon}>label</Chip>
 *  <Chip icon={icon}> ... </Chip>
 *  <Chip icon={icon}>label</Chip>
 * </Chips>
 * ```
 *
 * @class Chips
 * @memberof limestone/Chips
 * @extends limestone/Chips.ChipsBase
 * @mixes limestone/Chips.ChipsDecorator
 * @mixes spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator
 * @see {@link limestone/Chips.ChipsBase}
 * @ui
 * @public
 */
const Chips = ChipsDecorator(ChipsBase);

export default Chips;
export {
	Chips,
	ChipsBase,
	ChipsDecorator
};
