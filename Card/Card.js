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

import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {Card as UiCard} from '@enact/ui/Card';
import {Cell, Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Icon from '../Icon';
import Image from '../Image';
import AsyncRenderChildren from '../internal/AsyncRenderChildren';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Card.module.less';

const getDefaultImageSize = (orientation) => {
	const sizes = {
		vertical: {width: 768, height: 432},
		horizontal: {width: 596, height: 336}
	};

	return sizes[orientation];
};

const getCardSize = (orientation, captionOverlay, imageSize) => {
	if (orientation === 'horizontal') {
		return {
			width: 1320,
			height: 336
		};
	} else if (orientation === 'vertical') {
		const defaultImageSize = getDefaultImageSize(orientation);
		const imageWidth = imageSize?.width ?? defaultImageSize.width;
		const imageHeight = imageSize?.height ?? defaultImageSize.height;

		if (captionOverlay) {
			return {
				width: imageWidth,
				height: imageHeight
			};
		}

		return {
			width: imageWidth,
			height: 'auto'
		};
	}
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
		 * The primary caption displayed with the image.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.string.isRequired,

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
		 * Determines whether the caption will be placed over the image or not.
		 * It only applies when `orientation` is `'vertical'`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		captionOverlay: PropTypes.bool,

		/**
		 * Centers the cations when `imageIconSrc` is not provided.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: PropTypes.bool,

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
		 * Set to `true` to display a container with background color.
		 * When `orientation` is `'horizontal'`, this prop is always `true` and provided value will be ignored.
		 *
		 * @type {Boolean}
		 * @public
		 */
		hasContainer: PropTypes.bool,

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
		 * The primary badge image source.
		 *
		 * @type {String|Object}
		 * @public
		 */
		primaryBadgeSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
		 * Applies a selected visual effect to the image.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool
	},
	defaultProps: {
		orientation: 'vertical'
	},

	styles: {
		css: componentCss,
		publicClassNames: true
	},

	computed: {
		'aria-label': ({children, label, secondaryLabel, selected}) => {
			return `${children || ''}${label ? ` ${label}` : ''}${secondaryLabel ? ` ${secondaryLabel}` : ''}${selected ? ' selected' : ''}`;
		},
		children: ({centered, children, css, 'data-index': index, imageIconSrc, label, orientation, secondaryLabel}) => {
			const hasImageIcon = imageIconSrc && orientation === 'vertical';
			const alignment = centered && !imageIconSrc ? {alignment: 'center'} : null;

			const captions = (
				<Row className={css.captions}>
					{hasImageIcon ? (
						<Cell
							className={css.imageIcon}
							component={Image}
							shrink
							src={imageIconSrc}
						/>
					) : null}
					<Cell>
						<Marquee {...alignment} className={css.caption} marqueeOn="hover">{children}</Marquee>
						{typeof label !== 'undefined' ? <Marquee {...alignment} className={css.label} marqueeOn="hover">{label}</Marquee> : null}
						{typeof secondaryLabel !== 'undefined' ? <Marquee {...alignment} className={css.label} marqueeOn="hover">{secondaryLabel}</Marquee> : null}
					</Cell>
				</Row>
			);

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
						{captions}
					</AsyncRenderChildren> :
					captions
			);
		},
		className: ({captionOverlay, roundedImage, hasContainer, orientation, styler}) => styler.append({
			captionOverlay: captionOverlay && orientation === 'vertical',
			roundedImage,
			hasContainer: (orientation === 'horizontal') || (hasContainer && !captionOverlay)
		})
	},

	render: ({css, imageSize, primaryBadgeSrc, secondaryBadgeSrc, style, ...rest}) => {
		delete rest.centered;
		delete rest.label;
		delete rest.secondaryLabel;
		delete rest.imageIconSrc;
		delete rest.hasContainer;
		delete rest.roundedImage;

		const defaultImageSize = getDefaultImageSize(rest.orientation);
		const cardSize = getCardSize(rest.orientation, rest.captionOverlay, imageSize);

		return (
			<UiCard
				{...rest}
				css={css}
				imageComponent={
					<Image>
						{primaryBadgeSrc ? (
							<Image className={css.primaryBadge} src={primaryBadgeSrc} />
						) : null}
						{secondaryBadgeSrc ? (
							<Image className={css.secondaryBadge} src={secondaryBadgeSrc} />
						) : null}
						<div className={css.selectionContainer}>
							<Icon className={css.selectionIcon}>check</Icon>
						</div>
					</Image>
				}
				style={{
					...style,
					'--card-image-height': ri.scaleToRem(imageSize?.height ?? defaultImageSize.height),
					'--card-image-width': ri.scaleToRem(imageSize?.width ?? defaultImageSize.width),
					'--card-width': ri.scaleToRem(cardSize.width),
					'--card-height': cardSize.height === 'auto' ? 'auto' : ri.scaleToRem(cardSize.height)
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
