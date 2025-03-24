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

const CardBase = kind({
	name: 'Card',
	propTypes: {
		captionOverlay: PropTypes.bool,
		centered: PropTypes.bool,
		children: PropTypes.string,
		css: PropTypes.object,
		disabled: PropTypes.bool,
		hasContainer: PropTypes.bool,
		imageIconSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		label: PropTypes.string,
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),
		placeholder: PropTypes.string,
		primaryBadgeSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		roundedImage: PropTypes.bool,
		secondaryBadgeSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		selected: PropTypes.bool,
		showSelection: PropTypes.bool,
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
		children: ({children, css, label, imageIconSrc, orientation}) => {
			const hasImageIcon = imageIconSrc && orientation === 'vertical';

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
						<Marquee>{children}</Marquee>
						<Marquee>{label}</Marquee>
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

const CardDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Skinnable
);

const Card = CardDecorator(CardBase);

Card.displayName = 'Card';

export default Card;
export {
	Card,
	CardBase,
	CardDecorator
};
