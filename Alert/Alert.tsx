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
import type {ComponentType, ReactElement, ReactNode} from 'react';

import BodyText from '../BodyText';
import Heading from '../Heading';
import Popup from '../Popup';

import AlertImage from './AlertImage';

import componentCss from './Alert.module.less';

const measure = (contentId: string) => {
	const contentElement = document.getElementById(contentId);
	if (!contentElement) return;

	contentElement.style.width = '';
	const range = document.createRange();
	range.selectNodeContents(contentElement);
	if (typeof range.getClientRects !== 'function') return;

	const rects = Array.from(range.getClientRects());
	if (rects.length === 0) return;

	const minLeft = Math.min(...rects.map(r => r.left));
	const maxRight = Math.max(...rects.map(r => r.right));
	contentElement.style.width = Math.ceil(maxRight - minLeft) + 'px';
};

interface FittedContentCellProps {
	children?: ReactNode;
	component?: ComponentType<any>;
	fullscreen?: boolean;
	id?: string;
	[key: string]: any;
}

const FittedContentCell = ({children, component, fullscreen, id, ...rest}: FittedContentCellProps) => {
	const contentId = id ? `${id}_content` : null;
	const fitted = component || fullscreen;

	useLayoutEffect(() => {
		if (contentId && fitted) measure(contentId);
	});

	useLayoutEffect(() => {
		if (!contentId || !fitted) return;

		const handleResize = () => measure(contentId);
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, [contentId, fitted]);

	return (
		<Cell shrink align={fitted ? 'center' : 'stretch'} component={component} id={contentId ?? void 0} {...rest}>
			{children}
		</Cell>
	);
};

export interface AlertBaseProps {
	buttonDirection?: 'auto' | 'horizontal' | 'vertical';
	buttons?: ReactElement | ReactElement[];
	children?: ReactNode;
	css?: Record<string, string>;
	id?: string;
	image?: ReactElement;
	onClose?: (...args: any[]) => any;
	onHide?: (...args: any[]) => any;
	open?: boolean;
	overlayPosition?: 'bottom left' | 'bottom right' | 'center' | 'top left' | 'top right';
	size?: 'small' | 'medium' | 'large';
	style?: Record<string, any>;
	title?: string;
	type?: 'fullscreen' | 'overlay';
}

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

	_propTypes: {} as AlertBaseProps,

	propTypes: /** @lends limestone/Alert.AlertBase.prototype */ {
		buttonDirection: PropTypes.oneOf(['auto', 'horizontal', 'vertical']) as PropTypes.Validator<'auto' | 'horizontal' | 'vertical' | undefined>,

		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]) as PropTypes.Validator<ReactElement | ReactElement[] | undefined>,

		children: PropTypes.node,

		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		id: PropTypes.string,

		image: PropTypes.element as PropTypes.Validator<ReactElement | undefined>,

		onClose: PropTypes.func,

		onHide: PropTypes.func,

		open: PropTypes.bool,

		overlayPosition: PropTypes.oneOf(['bottom left', 'bottom right', 'center', 'top left', 'top right']) as PropTypes.Validator<'bottom left' | 'bottom right' | 'center' | 'top left' | 'top right' | undefined>,

		size: PropTypes.oneOf(['small', 'medium', 'large']) as PropTypes.Validator<'small' | 'medium' | 'large' | undefined>,

		title: PropTypes.string,

		type: PropTypes.oneOf(['fullscreen', 'overlay']) as PropTypes.Validator<'fullscreen' | 'overlay' | undefined>
	},

	defaultProps: {
		buttonDirection: 'auto',
		open: false,
		overlayPosition: 'center',
		size: 'medium',
		type: 'fullscreen'
	},

	styles: {
		css: componentCss,
		className: 'alert',
		publicClassNames: ['alert', 'content', 'fullscreen', 'overlay', 'title']
	},

	computed: {
		buttons: ({buttons, css}) => {
			return mapAndFilterChildren(buttons, (button: any, index: number) => (
				<Cell className={css!.buttonCell} key={`button${index}`} shrink>
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
				const useHorizontal = (type === 'overlay' && buttonCount === 2 && resolvedSize !== 'small') || (type === 'fullscreen' && buttonCount < 4);
				resolvedButtonDirection = useHorizontal ? 'horizontal' : 'vertical';
			}
			return styler.append({noImage: !image}, resolvedSize, type, resolvedButtonDirection);
		}
	},

	render: ({buttonDirection, buttons, contentComponent, children, css, id, image, overlayPosition, size, title, type, style, ...rest}) => {
		const fullscreen = (type === 'fullscreen');
		const position = (type === 'overlay' ? overlayPosition : type);
		const buttonCount = Children.toArray(buttons).filter(Boolean).length;
		const showTitle = ((fullscreen || size === 'large') && title);
		let resolvedButtonDirection = buttonDirection;
		if (buttonDirection === 'auto') {
			const useHorizontal = (type === 'overlay' && buttonCount === 2 && size !== 'small') || (type === 'fullscreen' && buttonCount < 4);
			resolvedButtonDirection = useHorizontal ? 'horizontal' : 'vertical';
		}
		const overlayHorizontalButtons = (
			type === 'overlay' &&
			resolvedButtonDirection === 'horizontal'
		);
		let popupStyle: any = style;
		if (overlayHorizontalButtons) {
			const overlayHorizontalButtonCount = Math.max(1, Math.min(buttonCount, 4));
			popupStyle = {
				...style,
				'--alert-overlay-horizontal-button-count': overlayHorizontalButtonCount
			};
		}
		const ariaLabelledBy = (showTitle ? `${id}_title ` : '') + `${id}_content ${id}_buttons`;
		const resolvedImage = (image?.props as any)?.type === "thumbnail" ? cloneElement(image as ReactElement, {iconSize:  !fullscreen && size === 'large' ? 'large' : 'small'} as any) : null;
		return (
			<div aria-owns={id} className={css!.alertWrapper}>
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
						{showTitle && !fullscreen ? <Cell shrink align="stretch"><Heading size="title" className={css!.title} id={`${id}_title`}>{title}</Heading></Cell> : null}
						{resolvedImage || image ? <Cell shrink className={css!.alertImage}>{resolvedImage || image}</Cell> : null}
						{showTitle && fullscreen ? <Cell shrink><Heading size="title" alignment="center" className={css!.title} id={`${id}_title`}>{title}</Heading></Cell> : null}
						<FittedContentCell component={contentComponent} fullscreen={fullscreen} className={css!.content} id={id}>
							{children}
						</FittedContentCell>
						{buttons ?
							<Cell shrink className={css!.buttonContainer}>
								<Layout
									align="center center"
									orientation={resolvedButtonDirection as 'horizontal' | 'vertical'}
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
) as ComponentType<AlertBaseProps>;

export default Alert;
export {
	Alert,
	AlertBase,
	AlertImage
};
