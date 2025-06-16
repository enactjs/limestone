import {setDefaultProps} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import {getAllContainerIds} from '@enact/spotlight/src/container';
import {getNearestTargetFromPosition} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {createContext, useCallback, useRef} from 'react';

import css from './Chips.module.less';

export const ChipsContext = createContext({});

const ChipsDefaultProps = {
	orientation: 'vertical'
};

/**
 * A container that surrounds the chips.
 *
 * Usage:
 * ```
 * <Chips>
 * 	{chips.map(({id, icon, children}) => {
 * 		return (
 * 			<Chip key={id} icon={icon} onClick={onClick}>
 * 				{children}
 * 			</Chip>
 * 		);
 * 	})}
 * </Chips>
 * ```
 *
 * @class ChipsBase
 * @memberof limestone/Chips
 * @ui
 * @public
 */
const ChipsBase = (props) => {
	const chipsProps = setDefaultProps(props, ChipsDefaultProps);
	const {children, className, orientation, ...rest} = chipsProps;
	const chipsClassName = classnames(css.chips, css[orientation], className);
	const childRefs = useRef([]);
	const containerRef = useRef(null);

	const getPreviousChip = useCallback((index) => {
		return childRefs.current
			.slice()
			.reverse()
			.find((child) => child.index < index);
	}, []);

	const getNextChip = useCallback((index) => {
		return childRefs.current.find((child) => child.index > index);
	}, []);

	const handleChipDelete = (ev, index) => {
		const prevNode = getPreviousChip(index);
		const nextNode = getNextChip(index);

		if (prevNode) {
			Spotlight.focus(prevNode.chipRef.current);
		} else if (nextNode) {
			Spotlight.focus(nextNode.chipRef.current);
		} else {
			const rect = ev.target.getBoundingClientRect();
			const position = {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
			const containerIds = getAllContainerIds();
			containerRef.current.dataset.spotlightContainerDisabled = true;

			for (const containerId of containerIds) {
				const nearestTarget = getNearestTargetFromPosition(position, containerId);
				if (nearestTarget) {
					Spotlight.focus(nearestTarget);
					break;
				}
			}

			containerRef.current.dataset.spotlightContainerDisabled = false;
		}

		childRefs.current = childRefs.current.filter((child) => child.index !== index);
	};

	const getNextTargetFromDeleteButton = useCallback((direction, index) => {
		let nextTarget = null;
		if ((orientation === 'vertical' && direction === 'up') || (orientation === 'horizontal' && direction === 'left')) {
			const prevChip = getPreviousChip(index);
			nextTarget = prevChip ? prevChip.chipRef.current : null;
		} else if ((orientation === 'vertical' && direction === 'down') || (orientation === 'horizontal' && direction === 'right')) {
			const nextChip = getNextChip(index);
			nextTarget = nextChip ? nextChip.chipRef.current : null;
		}

		return nextTarget;
	}, [getNextChip, getPreviousChip, orientation]);

	const registerChild = useCallback((chipRef) => {
		childRefs.current.push({chipRef, index: childRefs.current.length});
		return childRefs.current.length - 1;
	}, []);

	return (
		<div {...rest} className={chipsClassName} ref={containerRef}>
			<ChipsContext
				value={{
					getNextTargetFromDeleteButton,
					handleChipDelete,
					registerChild
				}}
			>
				{children}
			</ChipsContext>
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
	children: PropTypes.node,

	/**
	 * The layout orientation of the component.
	 *
	 * @type {('horizontal'|'vertical')}
	 * @default 'vertical'
	 * @public
	 */
	orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

/**
 * Applies Limestone specific behaviors to {@link limestone/Chips.Chips|Chips} components.
 *
 * @hoc
 * @memberof limestone/Chips
 * @mixes spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator
 * @public
 */
const ChipsDecorator = compose(
	SpotlightContainerDecorator({
		enterTo: 'default-element',
		leaveFor: {up: '#right'},
		navigableFilter: (node) => {
			if (!node) return false;
			const rects = node.getBoundingClientRect();
			return rects.width !== 0 && rects.height !== 0;
		}
	})
);

/**
 * A container that contains the basic behavior of {@link limestone/Chips.Chips|ChipsBase}.
 * @class Chips
 * @memberof limestone/Chips
 * @extends limestone/Chips.ChipsBase
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
