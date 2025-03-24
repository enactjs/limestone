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
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';
import {Card as UiCard} from '@enact/ui/Card';
import {Cell, Row} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
import Icon from '../Icon';
import Image from '../Image';
import Skinnable from '../Skinnable';
import {Marquee, MarqueeController} from '../Marquee';

import componentCss from './Card.module.less';

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
		 * Determines whether the caption will be placed over the image or not.
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
		 * Disable Card and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Set to `true` to display the image with a base color overlay.
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
		 * This prop is only used when `hasContainer` is `false` .
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
		 * Applies a selected visual effect to the image, but ony if `showSelection` is also `true`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Shows a selection icon. When `true`, a checkmark is displayed on the image.
		 *
		 * @type {Boolean}
		 * @public
		 */
		showSelection: PropTypes.bool,

		/**
		 * Source for the image.
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},
	defaultProps: {
		orientation: 'vertical'
	},

	styles: {
		css: componentCss,
		publicClassNames: true
	},

	computed: {
		children: ({centered, children, css, label, imageIconSrc, orientation}) => {
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
						<Marquee {...alignment} marqueeOn="hover">{children}</Marquee>
						{typeof label !== 'undefined' ? <Marquee {...alignment} marqueeOn="hover">{label}</Marquee> : null}
					</Cell>
				</Row>

			);
			return captions;
		},
		className: ({captionOverlay, roundedImage, hasContainer, orientation, styler}) => styler.append({
			captionOverlay: captionOverlay && orientation === 'vertical',
			roundedImage: roundedImage || captionOverlay,
			hasContainer: hasContainer && !captionOverlay
		})
	},

	render: ({css, primaryBadgeSrc, secondaryBadgeSrc, showSelection, ...rest}) => {
		delete rest.label;
		delete rest.imageIconSrc;
		delete rest.hasContainer;
		delete rest.roundedImage;

		if (showSelection) {
			rest['role'] = 'checkbox';
			rest['aria-checked'] = rest.selected;
		}

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
						{showSelection ? (
							<div className={css.selectionContainer}>
								<Icon className={css.selectionIcon}>check</Icon>
							</div>
						) : null}
					</Image>
				}
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
 * 	 src="https://placehold.co/100x100/9037ab/ffffff/png?text=Image0"
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
