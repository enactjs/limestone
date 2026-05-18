/**
 * Provides a Limestone-themed three-dot indeterminate progress indicator.
 *
 * @example
 * <DotSpinner>Loading...</DotSpinner>
 *
 * @module limestone/DotSpinner
 * @exports DotSpinner
 * @exports DotSpinnerBase
 * @exports DotSpinnerDecorator
 */
import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Marquee from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './DotSpinner.module.less';

/**
 * A component that renders three animated dots.
 *
 * @class DotSpinnerBase
 * @memberof limestone/DotSpinner
 * @ui
 * @public
 */
const DotSpinnerBase = kind({
	name: 'DotSpinner',

	propTypes: /** @lends limestone/DotSpinner.DotSpinnerBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `dotSpinner` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Pauses the animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		paused: PropTypes.bool,

		/**
		 * The size of the spinner.
		 *
		 * @type {('medium'|'small')}
		 * @default 'medium'
		 * @public
		 */
		size: PropTypes.oneOf(['medium', 'small']),

		/**
		 * Removes the background color (making it transparent).
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		transparent: PropTypes.bool
	},

	defaultProps: {
		paused: false,
		size: 'medium',
		transparent: false
	},

	styles: {
		css: componentCss,
		className: 'dotSpinner',
		publicClassNames: ['dotSpinner']
	},

	computed: {
		'aria-label': ({['aria-label']: aria, children}) => aria || (!children ? 'Loading' : undefined),
		className: ({children, paused, size, transparent, styler}) =>
			styler.append(size, {content: !!children, paused, transparent})
	},

	render: ({children, css, ...rest}) => {
		delete rest.paused;
		delete rest.size;
		delete rest.transparent;

		return (
			<div aria-live="off" role="alert" {...rest}>
				<div className={css.dots}>
					<div className={css.dot} />
					<div className={css.dot} />
					<div className={css.dot} />
				</div>
				{children ?
					<Marquee className={css.client} marqueeOn="render" alignment="center">
						{children}
					</Marquee> :
					null
				}
			</div>
		);
	}
});

/**
 * Limestone-specific DotSpinner behaviors.
 *
 * @hoc
 * @memberof limestone/DotSpinner
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const DotSpinnerDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A Limestone-styled three-dot Spinner.
 *
 * @class DotSpinner
 * @memberof limestone/DotSpinner
 * @extends limestone/DotSpinner.DotSpinnerBase
 * @mixes limestone/DotSpinner.DotSpinnerDecorator
 * @ui
 * @public
 */
const DotSpinner = DotSpinnerDecorator(DotSpinnerBase);

export default DotSpinner;
export {
	DotSpinner,
	DotSpinnerBase,
	DotSpinnerDecorator
};
