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

import {setDefaultProps} from '@enact/core/util';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import Spotlight from '@enact/spotlight';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React, {useRef, useEffect, useState, createRef, Children, cloneElement, isValidElement} from 'react';

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

    /*
    useEffect(() => {
        clientRefs.current.forEach((ref) => {
            if (ref && index) {
                ref.classList.add(css.selected);
            }
        })
    }, [index]);
    */

    /*useEffect(() => {
        console.log('buttonRefs after render: ', buttonRefs.current);
    }, [children]);
    */

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
                        ref: buttonRefs.current[idx]});
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
        enterTo: 'default-element'
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
