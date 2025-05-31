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
import {Children, cloneElement, createRef, isValidElement, useCallback, useRef} from 'react';

import css from './Chips.module.less';

const ChipsDefaultProps = {
	orientation: 'vertical'
};

/**
 * A container that contains the basic behavior of {@link limestone/Chips.Chips|ChipsBase}.
 *
 * @class Chips
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

	const onButtonKeyDown = useCallback((ev, focused) => {
		const {keyCode, target} = ev;

		const containerId = containerRef.current.dataset.spotlightId;
		const candidate = Spotlight.getSpottableDescendants(containerId);
		const buttons = candidate.filter((_, index) => index % 2 === 1);
		const chips = candidate.filter((_, index) => index % 2 === 0);
		const currentIndex = buttons.findIndex((element) => target === element);

		let nextIndex = currentIndex;
		let shouldStopPropagation = false;

		const isVertical = orientation === 'vertical';
		const isHorizontal = orientation === 'horizontal';

		if (isVertical) {
			if (is('up', keyCode)) {
				nextIndex = Math.max(0, currentIndex - 1);
				shouldStopPropagation = true;
			} else if (is('down', keyCode)) {
				nextIndex = Math.min(buttons.length - 1, currentIndex + 1);
				shouldStopPropagation = true;
			}
		} else if (isHorizontal) {
			if (is('left', keyCode)) {
				nextIndex = Math.max(0, currentIndex - 1);
				shouldStopPropagation = true;
			} else if (is('right', keyCode)) {
				nextIndex = Math.min(buttons.length - 1, currentIndex + 1);
				shouldStopPropagation = true;
			}
		}

		if (shouldStopPropagation) {
			Spotlight.focus(chips[nextIndex]);
			ev.stopPropagation();
			buttonRefs.current[currentIndex].current.classList.remove(focused);
		}
	}, [buttonRefs, orientation]);

	return (
		<div className={chipsClassNames} ref={containerRef} {...rest}>
			{children && Children.map(children, (child, idx) => {
				const handleDelete = (ev) => {
					ev.stopPropagation();

					if (child.props.deleteButton && child.props.deleteButton.onDelete) {
						child.props.deleteButton.onDelete(ev);

						const containerId = containerRef.current.dataset.spotlightId;
						const candidate = Spotlight.getSpottableDescendants(containerId);
						const buttons = candidate.filter((_, index) => index % 2 === 1);
						const chips = candidate.filter((_, index) => index % 2 === 0);
						const currentIndex = buttons.findIndex((element) => ev.target === element);

						let nextIndex = currentIndex;
						let shouldStopPropagation = false;

						if (currentIndex > 0) {
							nextIndex = Math.max(0, currentIndex - 1);
							shouldStopPropagation = true;
						} else {
							nextIndex = Math.min(chips.length - 1, currentIndex + 1);
							shouldStopPropagation = true;
						}

						if (shouldStopPropagation) {
							Spotlight.focus(chips[nextIndex]);
							ev.stopPropagation();
						}
					}
				};
				if (isValidElement(child)) {
					return cloneElement(child, {
						handleDelete,
						onButtonKeyDown,
						ref: buttonRefs.current[idx]
					});
				}
				return child;
			})}
		</div>
	);
};

ChipsBase.displayName = 'Chips';

ChipsBase.propTypes = /** @lends limestone/Chips.Chips.prototype */ {
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
	orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

const ChipsDecorator = compose(
	SpotlightContainerDecorator({
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
 * @extends limestone/Chips.Chips
 * @mixes limestone/Chips.ChipsDecorator
 * @mixes spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator
 * @see {@link limestone/Chips.Chips}
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
