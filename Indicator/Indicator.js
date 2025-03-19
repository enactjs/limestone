/**
 * Provides Limestone styled component to indicate progress along a continuum. The component has 2 types.
 *
 * In the first example we use dots, 6 total steps will be displayed with the current step being the 3rd
 * step, having passed the previous 2 steps, with 3 more to go.
 *
 * In the second example we use numbers, the indicator will display `< 3 / 6 >`.
 *
 * @example
 * <Indicator current={3} total={6} />
 * <Indicator current={3} total={6} type="numbers" />
 *
 * @module limestone/Indicator
 * @exports Indicator
 * @exports IndicatorBase
 * @exports IndicatorDecorator
 */

import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import Repeater from '@enact/ui/Repeater';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback} from 'react';

import Button from '../Button';
import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Indicator.module.less';

const PageIndicator = ({className, current, hideButtons, onChange = null, total, ...rest}) => {
	const mergedClasses = classNames(componentCss.pageIndicator, className);

	const handleDecrement = useCallback(() => {
		if (onChange && current > 1) onChange({type: 'decrement', value: current - 1});
	}, [current, onChange]);

	const handleIncrement = useCallback(() => {
		if (onChange && current < total) onChange({type: 'increment', value: current + 1});
	}, [current, onChange, total]);

	return (
		<Row className={mergedClasses} {...rest}>
			{!hideButtons && <Button className={componentCss.iconButton} iconOnly icon="arrowsmallleft" onClick={handleDecrement} />}
			<div className={componentCss.numberIndicator}>
				{current}
				<div className={componentCss.divider}> / </div>
				{total}
			</div>
			{!hideButtons && <Button className={componentCss.iconButton} iconOnly icon="arrowsmallright" onClick={handleIncrement} />}
		</Row>
	);
};

PageIndicator.propTypes = {
	/*
	 * Indicates the current step.
	 *
	 * This is 1-based, not 0-based; as in the first step is `1`.
	 *
	 * @type {Number}
	 * @default 1
	 * @public
	 */
	current: PropTypes.number,

	/*
	 * Indicates if `PageIndicator` displays buttons.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	hideButtons: PropTypes.bool,

	/*
	 * Function called when the navigation buttons are pressed.
	 *
	 * @type {Function}
	 * @public
	 */
	onChange: PropTypes.func,

	/*
	 * Indicate the total number of steps.
	 *
	 * @type {Number}
	 * @default 2
	 * @public
	 */
	total: PropTypes.number
};

/**
 * Renders a limestone-styled indicator component only basic behavior.
 *
 * @class IndicatorBase
 * @memberof limestone/Indicator
 * @ui
 * @public
 */
const IndicatorBase = kind({
	name: 'Indicator',

	propTypes: /** @lends limestone/Indicator.IndicatorBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `indicator` - The root class name
		 * * `step` - Applied to each individual step
		 * * `current` - Applied to the current step
		 * * `inactive` - Applied to the all steps that are not current
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Indicates the current step.
		 *
		 * This is 1-based, not 0-based; as in the first step is `1`.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		current: PropTypes.number,

		/**
		 * Indicates if `PageIndicator` displays buttons.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hideButtons: PropTypes.bool,

		/**
		 * Function called when the navigation buttons are pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Indicate the total number of steps.
		 *
		 * @type {Number}
		 * @default 2
		 * @public
		 */
		total: PropTypes.number,

		/**
		 *
		 */
		type: PropTypes.oneOf(['dots', 'numbers'])
	},

	defaultProps: {
		current: 1,
		hideButtons: false,
		total: 2,
		type: 'dots'
	},

	styles: {
		css: componentCss,
		className: 'indicator',
		publicClassNames: ['indicator', 'step', 'inactive', 'current']
	},

	computed: {
		steps: ({current, total, styler}) => {
			return Array.from(Array(total)).map((el, index) => {
				const stepNum = index + 1;
				const present = (stepNum === current);
				const children = 'circle';
				const size = present ? 24 : 18;

				return {
					children,
					className: styler.join('step', {current: present, inactive: !present}),
					key: `step${stepNum}`,
					size
				};
			});
		}
	},

	render: ({current, hideButtons, onChange, steps, total, type, ...rest}) => {
		return (
			<>
				{type === 'dots' ?
					<Repeater
						{...rest}
						component="div"
						childComponent={Icon}
					>
						{steps}
					</Repeater> :
					<PageIndicator current={current} hideButtons={hideButtons} total={total} onChange={onChange} {...rest} />
				}

			</>

		);
	}
});

/**
 * Limestone-specific behaviors to apply to {@link limestone/Indicator.IndicatorBase|IndicatorBase}.
 *
 * @hoc
 * @memberof limestone/Indicator
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const IndicatorDecorator = compose(
	Skinnable
);

/**
 * A full-featured Limestone-styled indicator component.
 *
 * @class Indicator
 * @memberof limestone/Indicator
 * @extends limestone/Indicator.IndicatorBase
 * @mixes limestone/Indicator.IndicatorDecorator
 * @ui
 * @public
 */
const Indicator = IndicatorDecorator(IndicatorBase);

export default Indicator;
export {
	Indicator,
	IndicatorBase,
	IndicatorDecorator
};
