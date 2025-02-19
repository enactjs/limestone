/**
 * Limestone styled labeled Heading components and behaviors
 *
 * @example
 * <Heading
 *   size="large"
 *   spacing="small"
 * >
 *   A Content Section Heading
 * </Heading>
 *
 * @module limestone/Heading
 * @exports Heading
 * @exports HeadingBase
 * @exports HeadingDecorator
 */

import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {HeadingBase as UiHeadingBase} from '@enact/ui/Heading';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Heading.module.less';

/**
 * A labeled Heading component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link limestone/Heading.Heading|Heading}.
 *
 * @class HeadingBase
 * @memberof limestone/Heading
 * @ui
 * @public
 */
const HeadingBase = kind({
	name: 'Heading',

	propTypes: /** @lends limestone/Heading.HeadingBase.prototype */ {
		css: PropTypes.object,

		/**
		 * Adds a horizontal-rule (line) under the component
		 *
		 * @type {Boolean}
		 * @public
		 */
		showLine: PropTypes.bool,

		/**
		 * The size for slotBefore and slotAfter.
		 * This size is used for remeasuring marquee metrics for Panels.Header.
		 *
		 * @type {String}
		 * @private
		 */
		slotSize: PropTypes.string,

		/**
		 * The size of the spacing around the Heading.
		 *
		 * Allowed values include:
		 * * `'auto'` - Value is based on the `size` prop for automatic usage.
		 * * `'large'` - Specifically assign the `'large'` spacing.
		 * * `'medium'` - Specifically assign the `'medium'` spacing.
		 * * `'small'` - Specifically assign the `'small'` spacing.
		 * * `'none'` - No spacing at all. Neighboring elements will directly touch the Heading.
		 *
		 * @type {('auto'|'large'|'medium'|'small'|'none')}
		 * @default 'small'
		 * @public
		 */
		spacing: PropTypes.oneOf(['auto', 'large', 'medium', 'small', 'none'])
	},

	defaultProps: {
		spacing: 'small'
	},

	styles: {
		css: componentCss,
		className: 'heading'
	},

	computed: {
		className: ({showLine, styler}) => styler.append({showLine})
	},

	render: ({css, ...rest}) => {
		delete rest.showLine;
		delete rest.slotSize;

		return UiHeadingBase.inline({css, ...rest});
	}
});

/**
 * Applies Limestone specific behaviors to {@link limestone/Heading.HeadingBase|HeadingBase}.
 *
 * @hoc
 * @memberof limestone/Heading
 * @mixes limestone/Marquee.MarqueeDecorator
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const HeadingDecorator = compose(
	Pure,
	MarqueeDecorator({invalidateProps: ['remeasure', 'slotSize']}),
	Skinnable
);

/**
 * A labeled Heading component, ready to use in Limestone applications.
 *
 * `Heading` may be used as a header to group related components.
 *
 * Usage:
 * ```
 * <Heading
 *   spacing="medium"
 * >
 *   Related Settings
 * </Heading>
 * <CheckboxItem>A Setting</CheckboxItem>
 * <CheckboxItem>A Second Setting</CheckboxItem>
 * ```
 *
 * @class Heading
 * @memberof limestone/Heading
 * @extends limestone/Heading.HeadingBase
 * @mixes limestone/Heading.HeadingDecorator
 * @ui
 * @public
 */
const Heading = HeadingDecorator(HeadingBase);

/**
 * Marquee animation trigger.
 *
 * Allowed values include:
 * * `'hover'` - Marquee begins when the pointer enters the component
 * * `'render'` - Marquee begins when the component is rendered
 *
 * @name marqueeOn
 * @type {('hover'|'render')}
 * @default 'render'
 * @memberof limestone/Heading.Heading.prototype
 * @see {@link limestone/Marquee.Marquee}
 * @public
 */

Heading.defaultProps = {
	marqueeOn: 'render'
};

export default Heading;
export {
	Heading,
	HeadingBase,
	HeadingDecorator
};
