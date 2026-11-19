import classnames from 'classnames';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

import Marquee from '../Marquee';
import {getFocusedTickIndex} from './utils';

/**
 * Renders equally spaced slider tick marks and optional labels.
 *
 * While a tick is focused, only that label marquees. Hover applies only when no tick is focused,
 * because the tick boxes cover the track and a hidden pointer may not emit mouseleave.
 *
 * @private
 */
const Ticks = ({
	className,
	count = 0,
	css = {},
	focusedIndex = -1,
	labels,
	orientation
}) => {
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [seenFocus, setSeenFocus] = useState(focusedIndex);
	const vertical = orientation === 'vertical';
	const positionProp = vertical ? 'bottom' : 'left';
	const hasTickMarks = count >= 3;
	let resolvedHover = hoveredIndex;

	// Drop a hover that survived a hidden pointer when focus or the focused tick changes.
	if (seenFocus !== focusedIndex) {
		setSeenFocus(focusedIndex);
		setHoveredIndex(-1);
		resolvedHover = -1;
	}

	const activeIndex = focusedIndex >= 0 ? focusedIndex : resolvedHover;
	const handleTicksOver = useCallback((ev) => {
		const index = Number(ev.target.closest('[data-tick-index]')?.dataset.tickIndex);

		if (!Number.isNaN(index)) {
			setHoveredIndex(index);
		}
	}, []);
	const handleTicksLeave = useCallback(() => setHoveredIndex(-1), []);

	return (
		<div
			className={classnames(css.ticks, className)}
			onMouseLeave={handleTicksLeave}
			onMouseOver={handleTicksOver}
			style={hasTickMarks ? {'--lime-slider-tick-count': count} : null}
		>
			{hasTickMarks ? Array.from({length: count}, (_, index) => {
				const label = labels && labels[index];

				return (
					<div
						aria-hidden="true"
						className={css.tick}
						data-tick-index={index}
						key={index}
						style={{[positionProp]: `${(index / (count - 1)) * 100}%`}}
					>
						<span className={css.tickMark} />
						{!vertical && label != null && label !== '' ? (
							<div className={css.tickLabel}>
								<Marquee
									alignment="center"
									className={css.tickLabelMarquee}
									marqueeDisabled={activeIndex !== index}
									marqueeOn="render"
								>
									{label}
								</Marquee>
							</div>
						) : null}
					</div>
				);
			}) : null}
		</div>
	);
};

const SideLabel = ({active, alignment, className, focused, value}) => (
	value != null && value !== '' ? (
		<Marquee
			alignment={alignment}
			className={className}
			marqueeDisabled={focused && !active}
			marqueeOn={focused ? 'render' : 'hover'}
		>
			{value}
		</Marquee>
	) : null
);

/**
 * Combines tick marks, side labels, and min/max values as a single `minMaxComponent`.
 *
 * Side labels are siblings of the tick overlay so they can sit on the slider's start/end,
 * on the same line as the track.
 *
 * @private
 */
const SliderExtras = ({
	className,
	count,
	css = {},
	endLabel,
	focused,
	labels,
	max,
	min,
	orientation,
	showMinMax,
	startLabel,
	value
}) => {
	const vertical = orientation === 'vertical';
	const currentValue = Number.isFinite(value) ? value : min;
	const focusedIndex = focused && count >= 3 ? getFocusedTickIndex(currentValue, min, max, count) : -1;
	const sideIndex = focused ? getFocusedTickIndex(currentValue, min, max, 2) : -1;

	return (
		<div className={css.extras}>
			<SideLabel
				active={sideIndex === 0}
				alignment={vertical ? 'center' : 'right'}
				className={css.startLabel}
				focused={focused}
				value={startLabel}
			/>
			{count >= 3 ? (
				<Ticks
					count={count}
					css={css}
					focusedIndex={focusedIndex}
					labels={labels}
					orientation={orientation}
				/>
			) : null}
			<SideLabel
				active={sideIndex === 1}
				alignment={vertical ? 'center' : 'left'}
				className={css.endLabel}
				focused={focused}
				value={endLabel}
			/>
			{showMinMax ? (
				<div className={className}>
					<div>{min}</div>
					<div>{max}</div>
				</div>
			) : null}
		</div>
	);
};

Ticks.displayName = 'Ticks';

Ticks.propTypes = {
	className: PropTypes.string,
	count: PropTypes.number,
	css: PropTypes.object,
	focusedIndex: PropTypes.number,
	labels: PropTypes.arrayOf(PropTypes.node),
	orientation: PropTypes.string
};

SliderExtras.displayName = 'SliderExtras';

SliderExtras.propTypes = {
	className: PropTypes.string,
	count: PropTypes.number,
	css: PropTypes.object,
	endLabel: PropTypes.node,
	focused: PropTypes.bool,
	labels: PropTypes.arrayOf(PropTypes.node),
	max: PropTypes.number,
	min: PropTypes.number,
	orientation: PropTypes.string,
	showMinMax: PropTypes.bool,
	startLabel: PropTypes.node,
	value: PropTypes.number
};

export default Ticks;
export {
	SliderExtras,
	Ticks
};
