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
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `heading` - The root component class
		 * * `title` - Applied when `size` is set to "title"
		 * * `subtitle` - Applied when `size` is set to "subtitle"
		 * * `large` - Applied when `size` is set to "large"
		 * * `medium` - Applied when `size` is set to "medium"
		 * * `small` - Applied when `size` is set to "small"
		 * * `tiny` - Applied when `size` is set to "tiny"
		 * * `largeSpacing` - Applied when `spacing` is set to "large"
		 * * `mediumSpacing` - Applied when `spacing` is set to "medium"
		 * * `smallSpacing` - Applied when `spacing` is set to "small"
		 * * `noneSpacing` - Applied when `spacing` is set to "none"
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Adds a horizontal-rule (line) under the component
		 *
		 * @type {Boolean}
		 * @public
		 */
		showLine: PropTypes.bool,

		/**
		 * Set the size of the component.
		 *
		 * If the `spacing` prop is not set (defaulting to "auto"), these values automatically set
		 * the spacing to the correlated names.
		 *
		 * @type {('large'|'medium'|'small'|'tiny'|'title'|'subtitle')}
		 * @default 'tiny'
		 * @public
		 */
		size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny', 'title', 'subtitle']),

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
		 * @default 'none'
		 * @public
		 */
		spacing: PropTypes.oneOf(['auto', 'large', 'medium', 'small', 'none'])
	},

	defaultProps: {
		size: 'tiny',
		spacing: 'none'
	},

	styles: {
		css: componentCss,
		className: 'heading',
		publicClassNames: true
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
