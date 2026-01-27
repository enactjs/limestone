import {setDefaultProps} from '@enact/core/util';
import IString from 'ilib/lib/IString';
import Spotlight from '@enact/spotlight';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import {getAllContainerIds} from '@enact/spotlight/src/container';
import {getNearestTargetFromPosition} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {createContext, useCallback, useMemo, useRef} from 'react';

import $L from '../internal/$L';

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
	const ariaLabel = new IString($L('{total} items in total')).format({total: children?.length});
	const ariaId = useMemo(() => Math.random().toString(36).substring(2, 10), []);

	const getPreviousChip = useCallback((id) => {
		const currentIndex = childRefs.current.findIndex((child) => child.id === id);
		return currentIndex > 0 ? childRefs.current[currentIndex - 1] : null;
	}, []);

	const getNextChip = useCallback((id) => {
		const currentIndex = childRefs.current.findIndex((child) => child.id === id);
		return currentIndex >= 0 && currentIndex < childRefs.current.length - 1 ? childRefs.current[currentIndex + 1] : null;
	}, []);

	const handleChipDelete = (ev, id) => {
		const prevNode = getPreviousChip(id);
		const nextNode = getNextChip(id);

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

		childRefs.current = childRefs.current.filter((child) => child.id !== id);
	};

	const getNextTargetFromDeleteButton = useCallback((direction, id) => {
		let nextTarget = null;
		if ((orientation === 'vertical' && direction === 'up') || (orientation === 'horizontal' && direction === 'left')) {
			const prevChip = getPreviousChip(id);
			nextTarget = prevChip ? prevChip.chipRef.current : null;
		} else if ((orientation === 'vertical' && direction === 'down') || (orientation === 'horizontal' && direction === 'right')) {
			const nextChip = getNextChip(id);
			nextTarget = nextChip ? nextChip.chipRef.current : null;
		}

		return nextTarget;
	}, [getNextChip, getPreviousChip, orientation]);

	const registerChild = useCallback((chipRef, id) => {
		if (!childRefs.current.some(child => child.id === id)) {
			childRefs.current.push({chipRef, id});

			// Sort childRefs to match the order of children array
			const childrenArray = Array.isArray(children) ? children : [];
			const childrenIdOrder = childrenArray
				.map(child => child && child.props && child.props.id)
				.filter(Boolean); // Remove null, undefined

			childRefs.current.sort((a, b) => {
				const indexA = childrenIdOrder.indexOf(a.id);
				const indexB = childrenIdOrder.indexOf(b.id);

				// IDs not in children array go to the end
				if (indexA === -1 && indexB === -1) return 0;
				if (indexA === -1) return 1;
				if (indexB === -1) return -1;

				return indexA - indexB;
			});
		}
	}, [children]);

	return (
		<div role="region" aria-labelledby={`${ariaId}_chips`}>
			<div
				aria-label={ariaLabel}
				className={chipsClassName}
				id={`${ariaId}_chips`}
				ref={containerRef}
				role="group"
				{...rest}
			>
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
