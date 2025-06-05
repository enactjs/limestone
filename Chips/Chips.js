import {setDefaultProps} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
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
 * @example
 *  <Chips orientation="vertical">
 *  	{chips.map(({id, icon, children}) => {
 *			return (
 *				<Chip key={id} icon={icon} deleteButton={deleteButton} onClick={onClick}>
 *					{children}
 *				</Chip>
 *     		);
 *		})}
 *  </Chips>
 *
 * @class ChipsBase
 * @memberof limestone/Chips
 * @ui
 * @public
 */
const ChipsBase = (props) => {
	const chipsProps = setDefaultProps(props, ChipsDefaultProps);
	const {children, orientation, ...rest} = chipsProps;
	const chipsClassName = classnames(css.chips, css[orientation]);
	const childRefs = useRef([]);

	const containerRef = useRef(null);

	const onChildDelete = (ev, index) => {
		/*ev.stopPropagation();

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
		}*/
	};

	const registerChild = useCallback((chipRef, buttonRef) => {
		childRefs.current.push({chipRef, buttonRef});
		return childRefs.current.length - 1;
	}, []);

	return (
		<div className={chipsClassName} ref={containerRef} {...rest}>
			 <ChipsContext
				value={{
					onChildDelete,
					registerChild,
					orientation
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
