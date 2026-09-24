import classnames from 'classnames';
import PropTypes from 'prop-types';
import type {ReactNode} from 'react';

import Marquee from '../Marquee';

export interface TicksProps {
	className?: string;
	count?: number;
	css?: Record<string, string>;
	focused?: boolean;
	labels?: ReactNode[];
	orientation?: string;
}

/**
 * Renders equally spaced slider tick marks and optional labels.
 *
 * @private
 */
const Ticks = ({
	className,
	count = 0,
	css = {},
	focused,
	labels,
	orientation
}: TicksProps) => {
	const vertical = orientation === 'vertical';
	const marqueeOn = focused ? 'render' : 'hover';
	const positionProp = vertical ? 'bottom' : 'left';
	const hasTickMarks = count >= 3;

	return (
		<div
			className={classnames(css.ticks, className)}
			style={hasTickMarks ? {'--lime-slider-tick-count': count} as any : void 0}
		>
			{hasTickMarks ? Array.from({length: count}, (_, index) => {
				const label = labels && labels[index];

				return (
					<div
						aria-hidden="true"
						className={css.tick}
						key={index}
						style={{[positionProp]: `${(index / (count - 1)) * 100}%`} as any}
					>
						<span className={css.tickMark} />
						{!vertical && label != null && label !== '' ? (
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
		</div>
	);
};

interface SideLabelProps {
	alignment?: string;
	className?: string;
	focused?: boolean;
	value?: ReactNode;
}

const SideLabel = ({alignment, className, focused, value}: SideLabelProps) => (
	value != null && value !== '' ? (
		<Marquee
			alignment={alignment as any}
			className={className}
			marqueeOn={focused ? 'render' : 'hover'}
		>
			{value}
		</Marquee>
	) : null
);

export interface SliderExtrasProps {
	className?: string;
	count?: number;
	css?: Record<string, string>;
	endLabel?: ReactNode;
	focused?: boolean;
	labels?: ReactNode[];
	max?: number;
	min?: number;
	orientation?: string;
	showMinMax?: boolean;
	startLabel?: ReactNode;
}

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
	startLabel
}: SliderExtrasProps) => {
	const vertical = orientation === 'vertical';

	return (
		<div className={css.extras}>
			<SideLabel
				alignment={vertical ? 'center' : 'right'}
				className={css.startLabel}
				focused={focused}
				value={startLabel}
			/>
			{count && count >= 3 ? (
				<Ticks
					count={count}
					css={css}
					focused={focused}
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
	css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
	focused: PropTypes.bool,
	labels: PropTypes.arrayOf(PropTypes.node),
	orientation: PropTypes.string
};

SliderExtras.displayName = 'SliderExtras';

SliderExtras.propTypes = {
	className: PropTypes.string,
	count: PropTypes.number,
	css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
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
