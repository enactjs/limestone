/**
 * Limestone styled key guide component and behaviors.
 *
 * @example
 * <KeyGuide
 *		open
 * >
 * 	{[
 *		{icon: 'star', children: 'start label', key: 1},
 *		{icon: 'plus', children: 'plus label', key: 2},
 *		{icon: 'minus', children: 'minus label', key: 3}
 *	]}
 * </KeyGuide>
 *
 * @module limestone/KeyGuide
 * @exports KeyGuide
 * @exports KeyGuideBase
 * @exports KeyGuideDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import FloatingLayer from '@enact/ui/FloatingLayer';
import {Cell, Row} from '@enact/ui/Layout';
import Repeater from '@enact/ui/Repeater';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import BodyText from '../BodyText';
import Icon from '../Icon';
import Image from '../Image';
import {ItemBase} from '../Item';
import {MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './KeyGuide.module.less';

const colorKeys = ['red', 'green', 'yellow', 'blue'];

const ImageItemBase = ({children, src}) => {
	return (
		<div>
			<Row className={componentCss.imageItem}>
				<Cell shrink className={componentCss.image} src={src} component={Image} />
				<Cell shrink={false} className={componentCss.text}>
					<BodyText className={componentCss.bodyText}>{children}</BodyText>
				</Cell>
			</Row>
		</div>
	);
};

ImageItemBase.propTypes = {
	children: PropTypes.node,
	src: PropTypes.string
};

/**
 * A Key Guide component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link limestone/KeyGuide.KeyGuide|KeyGuide}.
 *
 * @class KeyGuideBase
 * @memberof limestone/KeyGuide
 * @ui
 * @public
 */
const KeyGuideBase = kind({
	name: 'KeyGuide',

	propTypes: /** @lends limestone/KeyGuide.KeyGuideBase.prototype */ {
		/**
		 * The direction of the arrow.
		 * If `'none'`, no arrow is shown.
		 * `'bottom'`, `'left'`, `'right'` and `'top'` can be used to position the arrow.
		 *
		 * @type {String}
		 * @public
		 * @default 'none'
		 */
		arrowPosition: PropTypes.oneOf(['bottom', 'left', 'right', 'top', 'none']),

		/**
		 * The items to be displayed in the `KeyGuide` when `open`.
		 *
		 * Takes an array of objects. The properties will be passed onto an `Item` component.
		 * The object requires `children`, and a unique `key` property. If the `icon` property is one
		 * of `'red'`, `'green'`, `'yellow'` or '`blue'`, a corresponding color bar is shown.
		 * The `icon` property is used only when `type` is `'icon'`.
		 * The `src` property is used only when `type` is `'image'`. It is the URL of the image.

		 * @type {Array.<{children: (String|Component), key: (Number|String), icon: (String|Object|'red'|'green'|'yellow'|'blue')}>}
		 * @public
		 */
		children: PropTypes.arrayOf(PropTypes.shape({
			children: EnactPropTypes.renderable.isRequired,
			key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
			src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
		})),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `keyGuide` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Controls the visibility of the KeyGuide.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The position of the KeyGuide.
		 * The object should contain `top` and `left` properties.
		 * Used only when `type` is `'image'`.
		 *
		 * @type {Object}
		 * @public
		 */
		position: PropTypes.object,

		/**
		 * The type of the KeyGuide.
		 * If `'icon'`, the KeyGuide will show icons.
		 * If `'image'`, the KeyGuide will show images.
		 *
		 * @type {String}
		 * @public
		 * @default 'icon'
		 */
		type: PropTypes.oneOf(['icon', 'image'])
	},

	defaultProps: {
		arrowPosition: 'none',
		position: {top: 0, left: 0}
	},

	computed: {
		children: ({children, css, type}) => {
			if (type === 'icon') {
				return children ? children.map(({icon, ...child}) => {
					const isColorKey = colorKeys.includes(icon);
					return {
						...child,
						slotBefore: isColorKey ? (
							<div className={css[icon]} />
						) : (
							<Icon className={css.icon}>{icon}</Icon>
						)
					};
				}) : [];
			} else if (type === 'image') {
				return children;
			}
		},
		className: ({arrowPosition, type, styler}) => styler.append(
			`${type}Guide`,
			arrowPosition === 'none' ? 'noArrow' : `${arrowPosition}Arrow`
		),
		open: ({children, open}) => (children && children.length > 0 && open)
	},

	styles: {
		css: componentCss,
		className: 'keyGuide',
		publicClassNames: ['keyGuide']
	},

	render: ({className, css, open, position, type, ...rest}) => {
		return (
			<FloatingLayer
				noAutoDismiss
				open={open}
				scrimType="none"
			>
				<Repeater
					{...rest}
					component="div"
					className={className}
					style={type === 'image' ? {top: position.top, left: position.left} : null}
					childComponent={type === 'image' ? ImageItemBase : ItemBase}
					itemProps={{css, marqueeOn: 'render'}}
				/>
			</FloatingLayer>
		);
	}
});

/**
 * Applies Limestone specific behaviors to {@link limestone/KeyGuide.KeyGuideBase|KeyGuide}.
 *
 * @hoc
 * @memberof limestone/KeyGuide
 * @mixes limestone/Marquee.MarqueeController
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const KeyGuideDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Pure,
	Skinnable
);

/**
 * A Key Guide component, ready to use in Limestone applications.
 *
 * `KeyGuide' may be used to display list of text with icons to describe key behavior.
 *
 * Usage:
 * ```
 * <KeyGuide
 *		open
 * >
 * 	{[
 *		{icon: 'star', children: 'start label', key: 1},
 *		{icon: 'plus', children: 'plus label', key: 2},
 *		{icon: 'minus', children: 'minus label', key: 3}
 *	]}
 * </KeyGuide>
 * ```
 *
 * @class KeyGuide
 * @memberof limestone/KeyGuide
 * @extends limestone/KeyGuide.KeyGuideBase
 * @mixes limestone/KeyGuide.KeyGuideDecorator
 * @ui
 * @public
 */
const KeyGuide = KeyGuideDecorator(KeyGuideBase);

export default KeyGuide;
export {
	KeyGuide,
	KeyGuideBase,
	KeyGuideDecorator
};
