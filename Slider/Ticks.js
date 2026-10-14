import classnames from 'classnames';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

import Marquee from '../Marquee';
import {getFocusedTickIndex} from './utils';

// `marqueeDisabled` drops Marquee's alignment, so centering has to live in the style.
const tickLabelMarqueeStyle = {
	display: 'block',
	overflow: 'hidden',
	textAlign: 'center',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	width: '100%'
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

const SideLabel = ({alignment, className, focused, value}) => (
	value != null && value !== '' ? (
		<Marquee
			alignment={alignment}
			className={className}
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

	return (
		<div className={css.extras}>
			<SideLabel
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
