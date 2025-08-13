/**
 * Limestone styled modal Alert components.
 *
 * @module limestone/Alert
 * @exports Alert
 * @exports AlertBase
 * @exports AlertImage
 */

import kind from '@enact/core/kind';
import {mapAndFilterChildren} from '@enact/core/util';
import IdProvider from '@enact/ui/internal/IdProvider';
import Layout, {Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';

import BodyText from '../BodyText';
import Heading from '../Heading';
import Popup from '../Popup';

import AlertImage from './AlertImage';

import componentCss from './Alert.module.less';

/**
 * A modal Alert component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link limestone/Alert.Alert|Alert}.
 *
 * @class AlertBase
 * @memberof limestone/Alert
 * @ui
 * @public
 */
const AlertBase = kind({
	name: 'Alert',

	propTypes: /** @lends limestone/Alert.AlertBase.prototype */ {
		/**
		 * Buttons to be included under the component.
		 *
		 * Typically, up to 3 buttons are used.
		 *
		 * @type {Element|Element[]}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * The contents of the body of the component.
		 *
		 * Only shown when `type="overlay"`. If `children` is text-only, it will be wrapped with
		 * {@link limestone/BodyText|BodyText}.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `alert` - The root class name
		 * * `content` - The content component class
		 * * `fullscreen` - Applied to a `type='fullscreen'` alert
		 * * `overlay` - Applied to a `type='overlay'` alert
		 * * `title` - The title component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The `id` of Alert referred to when generating ids for `'title'` and `'buttons'`.
		 *
		 * @type {String}
		 * @private
		 */
		id: PropTypes.string,

		/**
		 * Image to be included in the Alert component.
		 *
		 * It is recommended to use the `AlertImage` component.
		 *
		 * @type {Element}
		 * @public
		 */
		image: PropTypes.element,

		/**
		 * Called when the user requests to close the Alert.
		 *
		 * This also includes pressing the cancel key.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called after the transition to hide the Alert has finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Opens the Alert.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Position of the Alert when type=`overlay`.
		 *
		 * There are five types:
		 *
		 * * `center` - Popup in the center of the screen
		 * * `bottom left` - Popup in the bottom left of the screen
		 * * `bottom right` - Popup in the bottom right of the screen
		 * * `top left` - Popup in the top left of the screen
		 * * `top right` - Popup in the top right of the screen
		 *
		 * @type {('bottom left'|'bottom right'|'center'|'top left'|'top right')}
		 * @default 'center'
		 * @public
		 */
		overlayPosition: PropTypes.oneOf(['bottom left', 'bottom right', 'center', 'top left', 'top right']),

		/**
		 * The primary text displayed.
		 *
		 * Only shown when `type="fullscreen"`.
		 *
		 * @type {String}
		 * @public
		 */
		title: PropTypes.string,

		/**
		 * Type of popup.
		 *
		 * There are two types:
		 *
		 * * `fullscreen` - Full screen popup
		 * * `overlay` - Popup in the center of the screen
		 *
		 * @type {('fullscreen'|'overlay')}
		 * @default 'fullscreen'
		 * @public
		 */
		type: PropTypes.oneOf(['fullscreen', 'overlay'])
	},

	defaultProps: {
		open: false,
		overlayPosition: 'center',
		type: 'fullscreen'
	},

	styles: {
		css: componentCss,
		className: 'alert',
		publicClassNames: ['alert', 'content', 'fullscreen', 'overlay', 'title']
	},

	computed: {
		buttons: ({buttons, css}) => {
			return mapAndFilterChildren(buttons, (button, index) => (
				<Cell className={css.buttonCell} key={`button${index}`} shrink>
					{button}
				</Cell>
			)) || null;
		},
		contentComponent: ({children}) => {
			if (typeof children === 'string' ||
				Array.isArray(children) && children.every(child => (child == null || typeof child === 'string'))
			) {
				return BodyText;
			}
		},
		className: ({image, type, styler}) => styler.append(
			{
				noImage: !image
			},
			type
		)
	},

	render: ({buttons, contentComponent, children, css, id, image, overlayPosition, title, type, ...rest}) => {
		const fullscreen = (type === 'fullscreen');
		const position = (type === 'overlay' ? overlayPosition : type);
		const showTitle = (fullscreen && title);
		const ariaLabelledBy = (showTitle ? `${id}_title ` : '') + `${id}_content ${id}_buttons`;

		return (
			<div aria-owns={id} className={css.alertWrapper}>
				<Popup
					{...rest}
					id={id}
					noAnimation
					aria-labelledby={ariaLabelledBy}
					css={css}
					position={position}
				>
					<Layout align="center center" orientation="vertical">
						{image ? <Cell shrink className={css.alertImage}>{image}</Cell> : null}
						{showTitle ? <Cell shrink><Heading size="title" alignment="center" className={css.title} id={`${id}_title`}>{title}</Heading></Cell> : null}
						<Cell shrink align={fullscreen ? 'center' : ''} component={contentComponent} className={css.content} id={`${id}_content`}>
							{children}
						</Cell>
						{buttons ?
							<Cell shrink className={css.buttonContainer}>
								<Layout align="center" orientation="vertical" id={`${id}_buttons`}>
									{buttons}
								</Layout>
							</Cell> : null
						}
					</Layout>
				</Popup>
			</div>
		);
	}
});

/**
 * A modal Alert component, ready to use in Limestone applications.
 *
 * `Alert` may be used to interrupt a workflow to receive feedback from the user.
 * The dialog consists of a title, a message, and an area for additional
 * {@link limestone/Alert.Alert.buttons|buttons}.
 *
 * Usage:
 * ```
 * <Alert
 *   open={this.state.open}
 *   title="An Important Alert"
 * >
 *   <image>
 *     <AlertImage src={this.state.src} type="thumbnail" />
 *   </image>
 *
 *   Body text for alert. Components may also be used here for greater customizability.
 *
 *   <buttons>
 *     <Button>Button 1</Button>
 *     <Button>Button 2</Button>
 *   </buttons>
 * </Alert>
 * ```
 *
 * @class Alert
 * @memberof limestone/Alert
 * @extends limestone/Alert.AlertBase
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Alert = IdProvider(
	{generateProp: null, prefix: 'a_'},
	Slottable(
		{slots: ['title', 'buttons', 'image']},
		AlertBase
	)
);

export default Alert;
export {
	Alert,
	AlertBase,
	AlertImage
};
