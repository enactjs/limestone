import classnames from 'classnames';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

import Marquee from '../Marquee';
import {getFocusedTickIndex} from './utils';

const labelMarqueeStyle = {
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	width: '100%'
};

// `marqueeDisabled` drops Marquee's alignment, so the same alignment has to live in the style.
const tickLabelMarqueeStyle = {
	...labelMarqueeStyle,
	textAlign: 'center'
};

/**
 * Renders equally spaced slider tick marks and optional labels.
 *
 * Only one label marquees: the hovered label, or, while the slider is focused, the label of the
 * tick closest to the knob.
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
	const vertical = orientation === 'vertical';
	const positionProp = vertical ? 'bottom' : 'left';
	const hasTickMarks = count >= 3;
	const activeIndex = hoveredIndex >= 0 ? hoveredIndex : focusedIndex;
	const handleTicksOver = useCallback((ev) => {
		const tick = ev.target.closest('[data-tick-index]');

		if (!tick || !ev.currentTarget.contains(tick)) {
			return;
		}

		const index = Number(tick.dataset.tickIndex);
		setHoveredIndex((current) => current === index ? current : index);
	}, []);
	const handleTicksLeave = useCallback((ev) => {
		const next = ev.relatedTarget;

		if (next && typeof next.nodeType === 'number' && ev.currentTarget.contains(next)) {
			return;
		}

		setHoveredIndex(-1);
	}, []);

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
							<div
								className={css.tickLabel}
							>
								<Marquee
									alignment="center"
									marqueeDisabled={activeIndex !== index}
									marqueeOn="render"
									style={tickLabelMarqueeStyle}
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

const SideLabel = ({active, alignment, className, onMouseEnter, onMouseLeave, value, ...rest}) => (
	value != null && value !== '' ? (
		<div {...rest} className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Marquee
				alignment={alignment}
				marqueeDisabled={!active}
				marqueeOn="render"
				style={{...labelMarqueeStyle, textAlign: alignment}}
			>
				{value}
			</Marquee>
		</div>
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
	const [hoveredKey, setHoveredKey] = useState(null);
	const vertical = orientation === 'vertical';
	const currentValue = Number.isFinite(value) ? value : min;
	// Two labels sit on the ends of the track; three or more sit on the tick marks.
	const labelPositions = count >= 3 ? count : 2;
	const focusedIndex = focused ? getFocusedTickIndex(currentValue, min, max, labelPositions) : -1;
	const activeKey = hoveredKey != null ? hoveredKey : focusedIndex;
	const handleSideEnter = useCallback((ev) => setHoveredKey(Number(ev.currentTarget.dataset.sliderSide)), []);
	const handleSideLeave = useCallback((ev) => {
		const next = ev.relatedTarget;

		// Moving from one end label to the other should not fall back to the knob tick in between.
		if (next && typeof next.nodeType === 'number' && next.closest('[data-slider-side]')) {
			return;
		}

		setHoveredKey(null);
	}, []);

	return (
		<div className={css.extras}>
			<SideLabel
				active={activeKey === 0}
				alignment={vertical ? 'center' : 'right'}
				className={css.startLabel}
				data-slider-side={0}
				onMouseEnter={handleSideEnter}
				onMouseLeave={handleSideLeave}
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
				active={activeKey === labelPositions - 1}
				alignment={vertical ? 'center' : 'left'}
				className={css.endLabel}
				data-slider-side={labelPositions - 1}
				onMouseEnter={handleSideEnter}
				onMouseLeave={handleSideLeave}
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
