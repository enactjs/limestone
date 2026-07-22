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
import {Children, cloneElement, useLayoutEffect} from 'react';

const FittedContentCell = ({children, component, fullscreen, id, ...rest}) => {
	useLayoutEffect(() => {
		const contentElement = document.getElementById(id);
		if (!contentElement) return;

		contentElement.style.width = '';
		const range = document.createRange();
		range.selectNodeContents(contentElement);
		const rects = Array.from(range.getClientRects());
		if (rects.length === 0) return;

		const minLeft = Math.min(...rects.map(r => r.left));
		const maxRight = Math.max(...rects.map(r => r.right));
		contentElement.style.width = Math.ceil(maxRight - minLeft) + 'px';
	});

	return (
		<Cell shrink align={component || fullscreen ? 'center' : 'stretch'} component={component} id={id} {...rest}>
			{children}
		</Cell>
	);
};

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
		 * Sets the buttons layout direction.
		 *
		 * In `auto` mode, button direction follows UX defaults:
		 * * `overlay` - horizontal when there are exactly 2 buttons
		 * * `fullscreen` - horizontal when there are less than 3 buttons
		 * * otherwise vertical
		 *
		 * @type {('auto'|'horizontal'|'vertical')}
		 * @default 'auto'
		 * @public
		 */
		buttonDirection: PropTypes.oneOf(['auto', 'horizontal', 'vertical']),

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
		 * Size of the Alert when `type="overlay"`.
		 *
		 * * `small` - narrow width
		 * * `medium` - medium width
		 * * `large` - wide width, supports title
		 *
		 * When omitted, defaults to `medium` when there are exactly 2 buttons, otherwise `small`.
		 *
		 * @type {('small'|'medium'|'large')}
		 * @public
		 */
		size: PropTypes.oneOf(['small', 'medium', 'large']),

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
		buttonDirection: 'auto',
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
					{cloneElement(button, {css: css})}
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
		className: ({buttons, buttonDirection, image, size, type, styler}) => {
			const buttonCount = Children.toArray(buttons).filter(Boolean).length;
			const resolvedSize = size || (buttonDirection !== 'vertical' && buttonCount === 2 ? 'medium' : 'small');
			let resolvedButtonDirection = buttonDirection;
			if (buttonDirection === 'auto') {
				const useHorizontal = (type === 'overlay' && buttonCount === 2) || (type === 'fullscreen' && buttonCount < 4);
				resolvedButtonDirection = useHorizontal ? 'horizontal' : 'vertical';
			}
			return styler.append({noImage: !image}, resolvedSize, type, resolvedButtonDirection);
		},
		size: ({buttons, buttonDirection, size}) => size || (
			buttonDirection !== 'vertical' && Children.toArray(buttons).filter(Boolean).length === 2 ? 'medium' : 'small'
		)
	},

	render: ({buttonDirection, buttons, contentComponent, children, css, id, image, overlayPosition, size, title, type, style, ...rest}) => {
		const fullscreen = (type === 'fullscreen');
		const position = (type === 'overlay' ? overlayPosition : type);
		const buttonCount = Children.toArray(buttons).filter(Boolean).length;
		const showTitle = ((fullscreen || size === 'large') && title);
		let resolvedButtonDirection = buttonDirection;
		if (buttonDirection === 'auto') {
			const useHorizontal = (type === 'overlay' && buttonCount === 2) || (type === 'fullscreen' && buttonCount < 4);
			resolvedButtonDirection = useHorizontal ? 'horizontal' : 'vertical';
		}
		const overlayHorizontalButtons = (
			type === 'overlay' &&
			resolvedButtonDirection === 'horizontal'
		);
		let popupStyle = style;
		if (overlayHorizontalButtons) {
			const overlayHorizontalButtonCount = Math.max(1, Math.min(buttonCount, 4));
			popupStyle = {
				...style,
				'--alert-overlay-horizontal-button-count': overlayHorizontalButtonCount
			};
		}
		const ariaLabelledBy = (showTitle ? `${id}_title ` : '') + `${id}_content ${id}_buttons`;
		const resolvedImage = image?.props.type === "thumbnail" ? cloneElement(image, {iconSize:  !fullscreen && size === 'large' ? 'large' : 'small'}) : null;
		return (
			<div aria-owns={id} className={css.alertWrapper}>
				<Popup
					{...rest}
					id={id}
					noAnimation
					aria-labelledby={ariaLabelledBy}
					css={css}
					position={position}
					style={popupStyle}
				>
					<Layout align="center center" orientation="vertical">
						{showTitle && !fullscreen ? <Cell shrink align="stretch"><Heading size="title" className={css.title} id={`${id}_title`}>{title}</Heading></Cell> : null}
						{resolvedImage || image ? <Cell shrink className={css.alertImage}>{resolvedImage || image}</Cell> : null}
						{showTitle && fullscreen ? <Cell shrink><Heading size="title" alignment="center" className={css.title} id={`${id}_title`}>{title}</Heading></Cell> : null}
						<FittedContentCell component={contentComponent} fullscreen={fullscreen} className={css.content} id={`${id}_content`}>
							{children}
						</FittedContentCell>
						{buttons ?
							<Cell shrink className={css.buttonContainer}>
								<Layout
									align="center center"
									orientation={resolvedButtonDirection}
									id={`${id}_buttons`}
								>
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
