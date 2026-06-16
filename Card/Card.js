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
import {cloneElement, isValidElement} from 'react';
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

const formatDuration = (duration) => {
	if (duration < 0) return "00:00";

	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;

	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');

	if (hours > 0) {
		const hh = String(hours).padStart(2, '0');
		return `${hh}:${mm}:${ss}`;
	}

	return `${mm}:${ss}`;
};

const getBadge = (badge, size, className) => {
	let element = <div>{badge}</div>;
	let elementSize = {};

	if (isValidElement(badge)) element = badge;
	if (size) {
		elementSize = typeof size === 'object' ? {
			width: ri.scaleToRem(size.width), height: ri.scaleToRem(size.height)
		} : {
			fontSize: ri.scaleToRem(size)
		};
	}

	return cloneElement(element, {className: className, style: {...elementSize}});
};

const getCaptionImageIcons = (imageSrc, key) => {
	return imageSrc.map((src, idx) => (
		<Cell
			key={`${key}${idx}`}
			className={componentCss.captionImageIcon}
			component={Image}
			shrink
			src={src}
		/>
	)) || null;
};

const getDefaultImageSize = (orientation) => {
	const sizes = {
		vertical: {width: 768, height: 432},
		horizontal: {width: 596, height: 336}
	};

	return sizes[orientation];
};

const getLabelIcons = (icons, key, className) => {
	if (!icons) return null;

	return icons.map((labelIcon, index) => {
		return (
			<Cell shrink key={`${key}${index}`}>
				{cloneElement(labelIcon, {className})}
			</Cell>
		)
	}) || null;
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
		 * Sources for the image icon.
		 *
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize. This prop is only used when `orientation` is `'vertical'`.
		 *
		 * @type {String|Object}
		 * @public
		 */
		captionImageIconsSrc: PropTypes.arrayOf(
			PropTypes.oneOfType([PropTypes.string, PropTypes.object])
		),

		/**
		 * The size of the caption images.
		 *
		 * The following properties should be provided:
		 * * `height` - The height of the image
		 * * `width` - The width of the image

		 * @type {Object}
		 * @default {height: 432, width: 768}
		 * @public
		 */
		captionImageSize: PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		}),

		/**
		 * Determines whether the caption will overflow the card container or not.
		 * It only applies when `orientation` is `'vertical'` and `captionOverlay` and `captionOverlayOnFocus` is `false`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		captionOverflow: PropTypes.bool,

		/**
		 * Determines whether the caption will overflow the card container and show only on card focus.
		 * It only applies when `orientation` is `'vertical'` and `captionOverlay` and `captionOverlayOnFocus` is `false`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		captionOverflowOnFocus: PropTypes.bool,

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
		 * Media's entire duration in seconds.
		 *
		 * @type {Number}
		 * @public
		 */
		duration: PropTypes.number,

		/**
		 * Determines whether the `Duration` will be placed over the image or not.
		 *
		 * @type {Boolean}
		 * @public
		 */
		durationOverlay: PropTypes.bool,

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
		 * The primary badge.
		 *
		 * @type {Element|String}
		 * @public
		 */
		primaryBadge: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

		/**
		 * The size of the primary badge. Can be a number or an object with specific dimensions.
		 * The following properties should be provided for the object:
		 * * `height` - The height of the badge
		 * * `width` - The width of the badge
		 *
		 * @type {Object|Number}
		 * @default {width: 108, height: 108}
		 * @public
		 */
		primaryBadgeSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.shape({
				height: PropTypes.number,
				width: PropTypes.number
			})
		]),

		/**
		 * The progress displayed inside the ProgressBar
		 *
		 * @type {Number}
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * Determines whether the `ProgressBar` will be placed over the image or not.
		 *
		 * @type {Boolean}
		 * @public
		 */
		progressBarOverlay: PropTypes.bool,

		/**
		 * Set to `true` to display the image with rounded corners.
		 *
		 * @type {Boolean}
		 * @public
		 */
		roundedImage: PropTypes.bool,

		/**
		 * The secondary badge.
		 *
		 * @type {Element|String}
		 * @public
		 */
		secondaryBadge: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

		/**
		 * The size of the secondary badge. Can be a number or an object with specific dimensions.
		 * The following properties should be provided for the object:
		 * * `height` - The height of the badge
		 * * `width` - The width of the badge
		 *
		 * @type {Object|Number}
		 * @default {width: 108, height: 108}
		 * @public
		 */
		secondaryBadgeSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.shape({
				height: PropTypes.number,
				width: PropTypes.number
			})
		]),

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
		 * Activates the 'Duration'.
		 *
		 * @type {Boolean}
		 * @public
		 */
		showDuration: PropTypes.bool,

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
		children: ({captionImageIconsSrc, captionOverlay, captionOverlayOnFocus, centered, centeredTitle, children, css, duration, durationOverlay, 'data-index': index, imageIconSrc, label, labelIcons, orientation, progress, progressBarOverlay, secondaryLabel, secondaryLabelIcons, showDuration, showProgressBar, splitCaption, withoutMarquee}) => {
			const isCenteredTitle = (captionOverlay || captionOverlayOnFocus) && orientation === 'vertical' && centeredTitle;
			const hasImageIcon = imageIconSrc && orientation === 'vertical';
			const hasCaptionImageIcons = captionImageIconsSrc && (captionImageIconsSrc.filter(Boolean).length && orientation === 'vertical');
			const alignment = (centered && !imageIconSrc) || isCenteredTitle ? {alignment: 'center'} : null;
			const CaptionsComponent = isCenteredTitle ? Column : Row;

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
										{getLabelIcons(labelIcons, 'labelIcons', css.labelIcon)}
										<Cell><div style={{textAlign: alignment?.alignment}} className={css.label}>{label}</div></Cell>
									</Row>
								) : null}
								{typeof secondaryLabel !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(secondaryLabelIcons, 'secondaryLabelIcons', css.labelIcon)}
										<Cell><div style={{textAlign: alignment?.alignment}} className={css.label}>{secondaryLabel}</div></Cell>
									</Row>
								) : null}
								{hasCaptionImageIcons ? (
									<Row className={css.captionImageIconsContainer}>
										{getCaptionImageIcons(captionImageIconsSrc, 'captionImageIcons')}
									</Row>
								) : null}
							</Column>
							{(showProgressBar && !progressBarOverlay && !isCenteredTitle) ? <ProgressBar progress={progress} /> : null}
							{(showDuration && !durationOverlay && !showProgressBar) ? (
								<div className={css.duration}>{formatDuration(duration)}</div>
							) : null}
						</Cell>
					) : (
						<Cell className={css.captionCell}>
							<Marquee {...alignment} className={css.caption} marqueeOn="hover">{children}</Marquee>
							<Column className={css.labels}>
								{typeof label !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(labelIcons, 'labelIcons', css.labelIcon)}
										<Cell><Marquee {...alignment} className={css.label} marqueeOn="hover">{label}</Marquee></Cell>
									</Row>
								) : null}
								{typeof secondaryLabel !== 'undefined' ? (
									<Row className={css.labelContainer}>
										{getLabelIcons(secondaryLabelIcons, 'secondaryLabelIcons', css.labelIcon)}
										<Cell><Marquee {...alignment} className={css.label} marqueeOn="hover">{secondaryLabel}</Marquee></Cell>
									</Row>
								) : null}
								{hasCaptionImageIcons ? (
									<Row className={css.captionImageIconsContainer}>
										{getCaptionImageIcons(captionImageIconsSrc, 'captionImageIcons')}
									</Row>
								) : null}
							</Column>
							{(showProgressBar && !progressBarOverlay && !isCenteredTitle) ? <ProgressBar progress={progress} /> : null}
							{(showDuration && !durationOverlay && !showProgressBar) ? (
								<div className={css.duration}>{formatDuration(duration)}</div>
							) : null}
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
		className: ({captionOverflow, captionOverflowOnFocus, captionOverlay, captionOverlayOnFocus, centeredTitle, durationOverlay, icon, label, pressed, progressBarOverlay, roundedImage, hasContainer, orientation, secondaryLabel, styler}) => styler.append({
			captionOverflow: captionOverflow && orientation === 'vertical' && !captionOverlay && !captionOverlayOnFocus,
			captionOverflowOnFocus: !captionOverflow && captionOverflowOnFocus && orientation === 'vertical' && !captionOverlay && !captionOverlayOnFocus,
			captionOverlay: captionOverlay && orientation === 'vertical',
			captionOverlayOnFocus: !captionOverlay && captionOverlayOnFocus && orientation === 'vertical',
			centeredTitle,
			durationOverlay,
			pressed,
			roundedImage,
			hasContainer: (orientation === 'horizontal') || (hasContainer && !captionOverlay && !captionOverlayOnFocus),
			hasLabel: (orientation === 'vertical') && (label && secondaryLabel),
			isCheckIcon: icon === 'check',
			progressBarOverlay
		}),
		showDuration: ({showDuration, showProgressBar, durationOverlay}) => showDuration && durationOverlay && !showProgressBar,
		showProgressBar: ({showProgressBar, progressBarOverlay}) => showProgressBar && progressBarOverlay,
		splitCaption: ({captionOverlay, captionOverlayOnFocus, splitCaption}) => (captionOverlay || captionOverlayOnFocus) && splitCaption
	},

	render: ({captionImageSize, css, disabled, icon, imageSize, primaryBadge, primaryBadgeSize, secondaryBadge, secondaryBadgeSize, showDuration, duration, progress, showProgressBar, style, ...rest}) => {
		delete rest.captionImageIconsSrc;
		delete rest.captionOverflow;
		delete rest.captionOverflowOnFocus;
		delete rest.captionOverlayOnFocus;
		delete rest.centered;
		delete rest.centeredTitle;
		delete rest.durationOverlay;
		delete rest.hasContainer;
		delete rest.imageIconSrc;
		delete rest.label;
		delete rest.labelIcons;
		delete rest.pressed;
		delete rest.progressBarOverlay;
		delete rest.roundedImage;
		delete rest.secondaryLabel;
		delete rest.secondaryLabelIcons;
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
						{primaryBadge ? (
							getBadge(primaryBadge, primaryBadgeSize, css.primaryBadge)
						) : null}
						{secondaryBadge ? (
							getBadge(secondaryBadge, secondaryBadgeSize, css.secondaryBadge)
						) : null}
						<div className={css.selectionContainer}>
							<Icon className={css.selectionIcon}>{icon}</Icon>
						</div>
						{showDuration ? (
							<div className={css.duration}>{formatDuration(duration)}</div>
						) : null}
						{showProgressBar ? (
							<ProgressBar className={css.progress} progress={progress} />
						) : null}
					</Image>
				}
				style={{
					...style,
					'--card-image-height': ri.scaleToRem(imageSize?.height ?? defaultImageSize.height),
					'--card-image-width': ri.scaleToRem(imageSize?.width ?? defaultImageSize.width),
					...(captionImageSize?.height && {'--caption-image-height': ri.scaleToRem(captionImageSize.height)}),
					...(captionImageSize?.width && {'--caption-image-width': ri.scaleToRem(captionImageSize.width)})
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
