import classnames from 'classnames';
import PropTypes from 'prop-types';

import Marquee from '../Marquee';

/**
 * Renders equally spaced slider tick marks and optional labels.
 *
 * @private
 */
const Ticks = ({
	className,
	count = 0,
	css = {},
	endLabel,
	focused,
	labels,
	orientation,
	startLabel
}) => {
	const vertical = orientation === 'vertical';
	const marqueeOn = focused ? 'render' : 'hover';
	const positionProp = vertical ? 'bottom' : 'left';
	const hasTickMarks = count >= 3;

	return (
		<div
			className={classnames(css.ticks, className)}
			style={hasTickMarks ? {'--lime-slider-tick-count': count} : null}
		>
			{startLabel != null && startLabel !== '' ? (
				<Marquee
					alignment={vertical ? 'center' : 'right'}
					className={css.startLabel}
					marqueeOn={marqueeOn}
				>
					{startLabel}
				</Marquee>
			) : null}
			{hasTickMarks ? Array.from({length: count}, (_, index) => {
				const label = labels && labels[index];

				return (
					<div
						aria-hidden="true"
						className={css.tick}
						key={index}
						style={{[positionProp]: `${(index / (count - 1)) * 100}%`}}
					>
						<span className={css.tickMark} />
						{label != null && label !== '' ? (
							<Marquee
								alignment="center"
								className={css.tickLabel}
								marqueeOn={marqueeOn}
							>
								{label}
							</Marquee>
						) : null}
					</div>
				);
			}) : null}
			{endLabel != null && endLabel !== '' ? (
				<Marquee
					alignment={vertical ? 'center' : 'left'}
					className={css.endLabel}
					marqueeOn={marqueeOn}
				>
					{endLabel}
				</Marquee>
			) : null}
		</div>
	);
};

/**
 * Combines tick marks, side labels, and min/max values as a single `minMaxComponent`.
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
	startLabel
}) => (
	<div className={css.extras}>
		{count >= 3 || startLabel != null || endLabel != null ? (
			<Ticks
				count={count}
				css={css}
				endLabel={endLabel}
				focused={focused}
				labels={labels}
				orientation={orientation}
				startLabel={startLabel}
			/>
		) : null}
		{showMinMax ? (
			<div className={className}>
				<div>{min}</div>
				<div>{max}</div>
			</div>
		) : null}
	</div>
);

Ticks.displayName = 'Ticks';

Ticks.propTypes = {
	className: PropTypes.string,
	count: PropTypes.number,
	css: PropTypes.object,
	endLabel: PropTypes.node,
	focused: PropTypes.bool,
	labels: PropTypes.arrayOf(PropTypes.node),
	orientation: PropTypes.string,
	startLabel: PropTypes.node
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
	startLabel: PropTypes.node
};

export default Ticks;
export {
	SliderExtras,
	Ticks
};
