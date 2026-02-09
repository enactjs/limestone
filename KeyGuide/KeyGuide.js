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
import {checkPropTypes} from '@enact/core/util';
import FloatingLayer from '@enact/ui/FloatingLayer';
import Pure from '@enact/ui/internal/Pure';
import {Cell, Row} from '@enact/ui/Layout';
import Repeater from '@enact/ui/Repeater';
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

const ImageItemBase = (props) => {
	checkPropTypes(ImageItemBase, props);
	const {children, imageSrc} = props;

	return (
		<Row className={componentCss.imageItem}>
			<Cell shrink className={componentCss.image} src={imageSrc} component={Image} />
			<Cell shrink={false} className={componentCss.text}>
				<BodyText className={componentCss.bodyText}>{children}</BodyText>
			</Cell>
		</Row>
	);
};

ImageItemBase.propTypes = {
	children: PropTypes.node,
	imageSrc: PropTypes.string
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
		 * `'bottom'`, `'left'`, `'right'`, and `'top'` can be used to position the arrow.
		 * Arrow is only displayed in image-based guides.
		 *
		 * @type {String}
		 * @public
		 * @default 'none'
		 */
		arrowPosition: PropTypes.oneOf(['bottom', 'left', 'right', 'top', 'none']),

		/**
		 * The items to be displayed in the `KeyGuide` when `open`.
		 *
		 * For icon-based guides, it takes an array of objects. The properties will be passed onto an `Item` component.
		 * The object requires `children` and a unique `key` property. If the `icon` property is one
		 * of `'red'`, `'green'`, `'yellow'` or '`blue'`, a corresponding color bar is shown.
		 *
		 * For image-based guides, it takes an object. The object requires `children` and `imageSrc` properties.
		 * The `children` property is the text to be displayed and the `imageSrc` property is the path to the image to display.

		 * @type {Array.<{children: (String|Component), key: (Number|String), icon: (String|Object|'red'|'green'|'yellow'|'blue')}>|Object.<{children: (String|Component), imageSrc: (String|Object)}>}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.shape({
				children: EnactPropTypes.renderable.isRequired,
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
				icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
			})),
			PropTypes.shape({
				children: EnactPropTypes.renderable.isRequired,
				imageSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
			})
		]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `keyGuide` - The root component class
		 * * `imageGuide` - Applied to an image-based keyGuide
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
		open: PropTypes.bool
	},

	defaultProps: {
		arrowPosition: 'none'
	},

	computed: {
		children: ({children, css}) => {
			if (children?.imageSrc) {
				return children;
			} else {
				return children ? children.map(({icon, ...child}) => {
					const isColorKey = colorKeys.includes(icon);
					return {
						...child,
						slotBefore: isColorKey ? (
							<div className={css[icon]} />
						) : <Icon className={css.icon} size="large" >{icon}</Icon>
					};
				}) : [];
			}
		},
		className: ({arrowPosition, children, styler}) => styler.append(
			Array.isArray(children) ? 'iconGuide' : 'imageGuide',
			arrowPosition === 'none' || Array.isArray(children) ? 'noArrow' : `${arrowPosition}Arrow`
		),
		open: ({children, open}) => (children && (children.imageSrc || children.length > 0) && open)
	},

	styles: {
		css: componentCss,
		className: 'keyGuide',
		publicClassNames: ['keyGuide', 'imageGuide']
	},

	render: ({className, css, children, open, ...rest}) => {
		delete rest.arrowPosition;

		return (
			<FloatingLayer
				noAutoDismiss
				open={open}
				scrimType="none"
			>
				{Array.isArray(children) ? (
					<Repeater
						{...rest}
						component="div"
						className={className}
						childComponent={ItemBase}
						itemProps={{css, marqueeOn: 'render'}}
					>
						{children}
					</Repeater>
				) : (
					<div {...rest} className={className}>
						<ImageItemBase {...children} />
					</div>
				)}
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
