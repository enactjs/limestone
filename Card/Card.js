/**
 * Provides Limestone styled card components and behaviors.
 *
 * @example
 * <Card
 *   src="https://placehold.co/100x100/9037ab/ffffff/png?text=Image0"
 *   label="A secondary caption"
 * >
 *  The primary caption
 * </Card>
 *
 * @module limestone/Card
 * @exports Card
 * @exports CardBase
 * @exports CardDecorator
 */

import {forProp, forward, handle, not} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {mapAndFilterChildren} from '@enact/core/util';
import Spottable from '@enact/spotlight/Spottable';
import {Card as UiCard} from '@enact/ui/Card';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Touchable from '@enact/ui/Touchable';
import ri from '@enact/ui/resolution';
import {cloneElement} from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import Image from '../Image';
import $L from '../internal/$L';
import AsyncRenderChildren from '../internal/AsyncRenderChildren';
import {Marquee, MarqueeController} from '../Marquee';
import ProgressBar from '../ProgressBar';
import Skinnable from '../Skinnable';

import componentCss from './Card.module.less';

const getDefaultImageSize = (orientation) => {
	const sizes = {
		vertical: {width: 768, height: 432},
		horizontal: {width: 596, height: 336}
	};

	return sizes[orientation];
};

/**
 * A Limestone styled base component for {@link limestone/Card.Card|Card}.
 *
 * @class CardBase
 * @extends ui/Card.Card
 * @memberof limestone/Card
 * @ui
 * @public
 */
const CardBase = kind({
	name: 'Card',

	propTypes: /** @lends limestone/Card.CardBase.prototype */ {
		/**
		 * Source for the image.
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String|Object}
		 * @required
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

		/**
		 * The "aria-label" for the Card.
		 *
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * Determines whether the caption will be placed over the image or not.
		 * It only applies when `orientation` is `'vertical'`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		captionOverlay: PropTypes.bool,

		/**
		 * Determines whether the caption will be placed over the image and shown only on card focus.
		 * It only applies when `orientation` is `'vertical'`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		captionOverlayOnFocus: PropTypes.bool,

		/**
		 * Centers the captions when `imageIconSrc` is not provided.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * Centers the title and `imageIconSrc` horizontally and vertically.
		 * It only applies when `captionOverlay` or `captionOverlayOnFocus` is `true`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centeredTitle: PropTypes.bool,

		/**
		 * The primary caption displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Used internally to render `children` asynchronously.
		 *
		 * @type {Number}
		 * @private
		 */
		'data-index': PropTypes.number,

		/**
		 * Disables Card and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Fits the image to its height and width and positions it on the center of the Card.
		 *
		 * @type {Boolean}
		 * @public
		 */
		fitImage: PropTypes.bool,

		/**
		 * Set to `true` to display a container with background color.
		 * When `orientation` is `'horizontal'`, this prop is always `true` and provided value will be ignored.
		 *
		 * @type {Boolean}
		 * @public
		 */
		hasContainer: PropTypes.bool,

		/**
		 * Icon used when `selected` is `true`
		 *
		 * @type {String}
		 * @default 'check'
		 * @public
		 */
		icon: PropTypes.string,

		/**
		 * Source for the image icon.
		 *
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize. This prop is only used when `orientation` is `'vertical'`.
		 *
		 * @type {String|Object}
		 * @public
		 */
		imageIconSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * The size of the image.
		 *
		 * The following properties should be provided:
 		 * * `height` - The height of the image
		 * * `width` - The width of the image

  		 * @type {Object}
		 * @default {height: 432, width: 768}
		 * @public
		 */
		imageSize: PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		}),

		/**
		 * A secondary caption displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		label: PropTypes.string,

		/**
		 * Icons to be included with the secondary caption.
		 *
		 * Typically, up to 3 icons are used.
		 *
		 * @type {Element|Element[]}
		 * @public
		 */
		labelIcons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * The layout orientation of the component.
		 *
		 * @type {('horizontal'|'vertical')}
		 * @default 'vertical'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * A placeholder image to be displayed before the image is loaded.
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Indicates if the component is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		pressed: PropTypes.bool,

		/**
		 * The primary badge image source.
		 *
		 * @type {String|Object}
		 * @public
		 */
		primaryBadgeSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * The progress displayed inside the ProgressBar
		 *
		 * @type {Number}
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * Set to `true` to display the image with rounded corners.
		 *
		 * @type {Boolean}
		 * @public
		 */
		roundedImage: PropTypes.bool,

		/**
		 * The secondary badge image source.
		 *
		 * @type {String|Object}
		 * @public
		 */
		secondaryBadgeSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * A ternary caption displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		secondaryLabel: PropTypes.string,

		/**
		 * Icons to be included with the ternary caption.
		 *
		 * Typically, up to 3 icons are used.
		 *
		 * @type {Element|Element[]}
		 * @public
		 */
		secondaryLabelIcons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * Applies a selected visual effect to the image.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Activates the 'ProgressBar'.
		 *
		 * @type {Boolean}
		 * @public
		 */
		showProgressBar: PropTypes.bool,

		/**
		 * Splits the captions in two sections. This prop is only used when
		 * `captionOverlayOnFocus` or `captionOverlay` is `true` and `orientation` is `'vertical'`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		splitCaption: PropTypes.bool,

		/**
		 * Removes the marquee effect of caption and label text.
		 * @type {Boolean}
		 * @public
		 */
		withoutMarquee: PropTypes.bool
	},

	defaultProps: {
		icon: 'check',
		orientation: 'vertical',
		pressed: false,
		withoutMarquee: false
	},

	styles: {
		css: componentCss,
		publicClassNames: true
	},

	handlers: {
		onClick: handle(
			not(forProp('disabled', true)),
			forward('onClick')
		),
		onKeyDown: handle(
			not(forProp('disabled', true)),
			forward('onKeyDown')
		)
	},

	computed: {
		'aria-label': ({'aria-label': ariaLabel, children, label, secondaryLabel, selected}) => {
			return ariaLabel || `${children || ''}${label ? ` ${label}` : ''}${secondaryLabel ? ` ${secondaryLabel}` : ''}${selected ? ' ' + $L('Selected') : ''}`;
		},
		captionOverlay: ({captionOverlay, captionOverlayOnFocus}) => captionOverlay || captionOverlayOnFocus,
		children: ({captionOverlay, captionOverlayOnFocus, centered, centeredTitle, children, css, 'data-index': index, imageIconSrc, label, labelIcons, orientation, progress, secondaryLabel, secondaryLabelIcons, showProgressBar, splitCaption, withoutMarquee}) => {
			const isCenteredTitle = (captionOverlay || captionOverlayOnFocus) && orientation === 'vertical' && centeredTitle;
			const hasImageIcon = imageIconSrc && orientation === 'vertical';
			const alignment = (centered && !imageIconSrc) || isCenteredTitle ? {alignment: 'center'} : null;
			const CaptionsComponent = isCenteredTitle ? Column : Row;
			const getLabelIcons = (icons, key) => {
				return mapAndFilterChildren(icons, (labelIcon, idx) => (
					<Cell shrink key={`${key}${idx}`}>
						{cloneElement(labelIcon, {className: css.labelIcon})}
					</Cell>
				)) || null;
			};

			const captions = (
				<CaptionsComponent className={css.captions}>
					{hasImageIcon ? (
						<Cell
							className={css.imageIcon}
							component={Image}
							shrink
							src={imageIconSrc}
						/>
					) : null}
					{withoutMarquee ? (
						<Cell className={css.captionCell}>
							<div style={{textAlign: alignment?.alignment}} className={css.caption}>{children}</div>
							<Column className={css.labels}>
								{typeof label !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(labelIcons, 'labelIcons')}
										<div style={{textAlign: alignment?.alignment}} className={css.label}>{label}</div>
									</Row>
								) : null}
								{typeof secondaryLabel !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(secondaryLabelIcons, 'secondaryLabelIcons')}
										<div style={{textAlign: alignment?.alignment}} className={css.label}>{secondaryLabel}</div>
									</Row>
								) : null}
							</Column>
							{showProgressBar ? <ProgressBar progress={progress} /> : null}
						</Cell>
					) : (
						<Cell className={css.captionCell}>
							<Marquee {...alignment} className={css.caption} marqueeOn="hover">{children}</Marquee>
							<Column className={css.labels}>
								{typeof label !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(labelIcons, 'labelIcons')}
										<Cell align="center"><Marquee {...alignment} className={css.label} marqueeOn="hover">{label}</Marquee></Cell>
									</Row>
								) : null}
								{typeof secondaryLabel !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(secondaryLabelIcons, 'secondaryLabelIcons')}
										<Cell align="center"><Marquee {...alignment} className={css.label} marqueeOn="hover">{secondaryLabel}</Marquee></Cell>
									</Row>
								) : null}
							</Column>
							{(showProgressBar && !isCenteredTitle) ? <ProgressBar progress={progress} /> : null}
						</Cell>
					)}
				</CaptionsComponent>
			);

			const splitCaptions = (
				<>
					<Cell className={css.captions}>
						<Marquee {...alignment} className={css.caption} marqueeOn="hover">{children}</Marquee>
					</Cell>
					<Cell >
						{typeof label !== 'undefined' ? <Marquee {...alignment} className={css.label} marqueeOn="hover">{label}</Marquee> : null}
						{typeof secondaryLabel !== 'undefined' ? <Marquee {...alignment} className={css.label} marqueeOn="hover">{secondaryLabel}</Marquee> : null}
					</Cell>
				</>
			);

			const selectedCaptions = (captionOverlay || captionOverlayOnFocus) && splitCaption && orientation === 'vertical' ? splitCaptions : captions;

			return (
				typeof index !== 'undefined' ?
					<AsyncRenderChildren
						fallback={
							<Row className={css.captions}>
								{hasImageIcon ? <Cell className={css.imageIcon} /> : null}
								<Cell>
									<div className={css.caption} />
									{typeof label !== 'undefined' ? <div className={css.label} /> : null}
								</Cell>
							</Row>
						}
						index={index}
					>
						{selectedCaptions}
					</AsyncRenderChildren> :
					selectedCaptions
			);
		},
		className: ({captionOverlay, captionOverlayOnFocus, centeredTitle, icon, label, pressed, roundedImage, hasContainer, orientation, secondaryLabel, styler}) => styler.append({
			captionOverlay: captionOverlay && orientation === 'vertical',
			captionOverlayOnFocus: !captionOverlay && captionOverlayOnFocus && orientation === 'vertical',
			centeredTitle,
			pressed,
			roundedImage,
			hasContainer: (orientation === 'horizontal') || (hasContainer && !captionOverlay && !captionOverlayOnFocus),
			hasLabel: (orientation === 'vertical') && (label && secondaryLabel),
			isCheckIcon: icon === 'check'
		}),
		splitCaption: ({captionOverlay, captionOverlayOnFocus, splitCaption}) => (captionOverlay || captionOverlayOnFocus) && splitCaption
	},

	render: ({css, disabled, icon, imageSize, primaryBadgeSrc, secondaryBadgeSrc, style, ...rest}) => {
		delete rest.captionOverlayOnFocus;
		delete rest.centered;
		delete rest.label;
		delete rest.labelIcons;
		delete rest.progress;
		delete rest.secondaryLabel;
		delete rest.secondaryLabelIcons;
		delete rest.showProgressBar;
		delete rest.imageIconSrc;
		delete rest.hasContainer;
		delete rest.pressed;
		delete rest.roundedImage;
		delete rest.withoutMarquee;

		const defaultImageSize = getDefaultImageSize(rest.orientation);

		return (
			<UiCard
				{...rest}
				aria-disabled={disabled}
				css={css}
				data-webos-voice-intent="Select"
				disabled={disabled}
				imageComponent={
					<Image>
						{primaryBadgeSrc ? (
							<Image className={css.primaryBadge} src={primaryBadgeSrc} />
						) : null}
						{secondaryBadgeSrc ? (
							<Image className={css.secondaryBadge} src={secondaryBadgeSrc} />
						) : null}
						<div className={css.selectionContainer}>
							<Icon className={css.selectionIcon}>{icon}</Icon>
						</div>
					</Image>
				}
				style={{
					...style,
					'--card-image-height': ri.scaleToRem(imageSize?.height ?? defaultImageSize.height),
					'--card-image-width': ri.scaleToRem(imageSize?.width ?? defaultImageSize.width)
				}}
			/>
		);
	}
});

/**
 * Limestone-specific card behaviors to apply to
 * {@link limestone/Card.Card|Card}.
 *
 * @hoc
 * @memberof limestone/Card
 * @mixes limestone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const CardDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Touchable({activeProp: 'pressed'}),
	Spottable,
	Skinnable
);

/**
 * A Limestone-styled Card.
 *
 * Usage:
 * ```
 * <Card
 *   src="https://placehold.co/100x100/9037ab/ffffff/png?text=Image0"
 *   label="A secondary caption"
 * >
 *  The primary caption
 * </Card>
 * ```
 *
 * @class Card
 * @memberof limestone/Card
 * @extends limestone/Card.CardBase
 * @mixes limestone/Card.CardDecorator
 * @see {@link limestone/Card.CardBase}
 * @ui
 * @public
 */
const Card = CardDecorator(CardBase);

Card.displayName = 'Card';

export default Card;
export {
	Card,
	CardBase,
	CardDecorator
};
