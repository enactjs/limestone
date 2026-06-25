/**
 * Provides Limestone styled image item components and behaviors.
 *
 * @example
 * <ImageItem
 *   src="https://placehold.co/100x100/9037ab/ffffff/png?text=Image0"
 *   label="A secondary caption"
 * >
 * 	The primary caption for the image
 * </ImageItem>
 *
 * @module limestone/ImageItem
 * @exports ImageItem
 * @exports ImageItemBase
 * @exports ImageItemDecorator
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {ImageItem as UiImageItem} from '@enact/ui/ImageItem';
import {Cell, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import $L from '../internal/$L';
import Icon from '../Icon';
import Image from '../Image';
import AsyncRenderChildren from '../internal/AsyncRenderChildren';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './ImageItem.module.less';

const
	defaultPlaceholder =
		'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

/**
 * A Limestone styled base component for {@link limestone/ImageItem.ImageItem|ImageItem}.
 *
 * @class ImageItemBase
 * @extends ui/ImageItem.ImageItem
 * @memberof limestone/ImageItem
 * @ui
 * @public
 */
const ImageItemBase = kind({
	name: 'ImageItem',

	propTypes: /** @lends limestone/ImageItem.ImageItemBase.prototype */ {
		/**
		 * Centers the primary caption and label in vertical orientation.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * The primary caption displayed with the image.
		 *
		 * @type {String|Node}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `caption` - The caption component class
		 * * `fullImage` - Applied when `orientation` prop is `vertical` without `label` and `children`
		 * * `horizontal` - Applied when `orientation` prop is `horizontal`
		 * * `image` - The image component class
		 * * `imageIcon` - The image icon component class
		 * * `imageItem` - The image item component class
		 * * `label` - The secondary caption component class
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `selectionIcon` - The icon component class for default selection component
		 * * `vertical` - Applied when `orientation` prop is `vertical`
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
		 * The voice control intent.
		 *
		 * @type {String}
		 * @default 'Select'
		 * @memberof limestone/ImageItem.ImageItemBase.prototype
		 * @public
		 */
		'data-webos-voice-intent': PropTypes.string,

		/**
		 * Disable ImageItem and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The component used to render the image icon component.
		 *
		 * @type {Component}
		 * @default limestone/Image.Image
		 * @private
		 */
		imageIconComponent: EnactPropTypes.component,

		/**
		 * Source for the image icon.
		 *
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize. This feature is only valid when `orientation` is `'vertical'`.
		 *
		 * @type {String|Object}
		 * @private
		 */
		imageIconSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * A secondary caption displayed with the image.
		 *
		 * @type {String|Node}
		 * @public
		 */
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * The layout orientation of the component.
		 *
		 * @type {('horizontal'|'vertical')}
		 * @default 'vertical'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Placeholder image used while {@link limestone/ImageItem.ImageItemBase.src|src}
		 * is loaded.
		 *
		 * @type {String}
		 * @default 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
		 * '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
		 * 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
		 * '4NCg=='
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Applies a selected visual effect to the image, but only if `showSelection`
		 * is also `true`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The custom selection component to render. A component can be a stateless functional
		 * component, `kind()` or React component. The following is an example with custom selection
		 * kind.
		 *
		 * Usage:
		 * ```
		 * const SelectionComponent = kind({
		 * 	render: () => <div>custom selection component</div>
		 * });
		 *
		 * <ImageItem selectionComponent={SelectionComponent} />
		 * ```
		 *
		 * @type {Function}
		 * @public
		 */
		selectionComponent: PropTypes.func,

		/**
		 * Shows a selection component with a centered icon. When `selected` is true, a check mark is shown.
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
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Changes the image from a scale `1:1` to `16:9` in horizontal orientation.
		 *
		 * @type {Boolean}
		 * @default 'false'
		 * @public
		 */
		wideImage: PropTypes.bool
	},

	defaultProps: {
		'data-webos-voice-intent': 'Select',
		imageIconComponent: Image,
		orientation: 'vertical',
		placeholder: defaultPlaceholder
	},

	styles: {
		css: componentCss,
		publicClassNames: ['imageItem', 'caption', 'fullImage', 'horizontal', 'image', 'imageIcon', 'label', 'selected', 'selectionIcon', 'vertical']
	},

	computed: {
		'aria-label': ({'aria-label': customAriaLabel, children, label, selected, showSelection}) => {
			const defaultAriaLabel = `${children || ''}${label ? ` ${label}` : ''}`;
			return `${customAriaLabel || defaultAriaLabel}${selected && showSelection ? ' ' + $L('Selected') : ''}`;
		},
		children: ({centered, children, css, 'data-index': index, imageIconComponent, imageIconSrc, label, orientation}) => {
			const hasImageIcon = imageIconSrc && orientation === 'vertical';

			if (!hasImageIcon && !children && !label) return;

			const alignment = orientation === 'vertical' && centered ? {alignment: 'center'} : null;
			const captions = (
				<Row className={css.captions}>
					{hasImageIcon ? (
						<Cell
							className={css.imageIcon}
							component={imageIconComponent}
							shrink
							src={imageIconSrc}
						/>
					) : null}
					<Cell>
						<Marquee {...alignment} className={css.caption} marqueeOn="hover">{children}</Marquee>
						{typeof label !== 'undefined' ? <Marquee {...alignment} className={css.label} marqueeOn="hover">{label}</Marquee> : null}
					</Cell>
				</Row>
			);

			return (
				typeof index !== 'undefined' ?
					<AsyncRenderChildren
						fallback={<>
							<div className={css.placeholderCaption} />
							{typeof label !== 'undefined' ? <div className={css.placeholderLabel} /> : null}
						</>}
						index={index}
					>
						{captions}
					</AsyncRenderChildren> :
					captions
			);
		},
		className: ({children, imageIconSrc, label, orientation, showSelection, styler, wideImage}) => styler.append({
			fullImage: orientation === 'vertical' && !children && !label && !imageIconSrc,
			showSelection,
			wideImage: orientation === 'horizontal' && wideImage
		}),
		selectionComponent: ({css, selectionComponent : SelectionComponent}) => {
			if (SelectionComponent) {
				return <SelectionComponent />;
			} else {
				return <Icon className={css.selectionIcon}>checkmark</Icon>;
			}
		}
	},

	render: ({css, disabled, orientation, selectionComponent: SelectionComponent, showSelection, ...rest}) => {
		delete rest.centered;
		delete rest.imageIconComponent;
		delete rest.imageIconSrc;
		delete rest.label;
		delete rest.wideImage;

		return (
			<UiImageItem
				{...rest}
				aria-disabled={disabled}
				css={css}
				disabled={disabled}
				orientation={orientation}
				imageComponent={
					<Image>
						{showSelection ? (
							<div className={css.selectionContainer}>
								{SelectionComponent}
							</div>
						) : null}
					</Image>
				}
			/>
		);
	}
});

/**
 * Limestone-specific ImageItem behaviors to apply to
 * {@link limestone/ImageItem.ImageItem|ImageItem}.
 *
 * @hoc
 * @memberof limestone/ImageItem
 * @mixes limestone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ImageItemDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Skinnable
);

/**
 * A limestone-styled image item, Marquee and Spottable applied.
 *
 * Usage:
 * ```
 * <ImageItem
 *   src="https://placehold.co/100x100/9037ab/ffffff/png?text=Image0"
 *   label="A secondary caption"
 * >
 * 	The primary caption for the image
 * </ImageItem>
 * ```
 *
 * @class ImageItem
 * @memberof limestone/ImageItem
 * @extends limestone/ImageItem.ImageItemBase
 * @mixes limestone/ImageItem.ImageItemDecorator
 * @see {@link limestone/ImageItem.ImageItemBase}
 * @ui
 * @public
 */
const ImageItem = ImageItemDecorator(ImageItemBase);
ImageItem.displayName = 'ImageItem';

export default ImageItem;
export {
	ImageItem,
	ImageItemBase,
	ImageItemDecorator
};
