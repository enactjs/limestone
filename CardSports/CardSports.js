/**
 * Provides a Limestone styled sports Card and a HoC that adds a sports match overlay to
 * {@link limestone/Card.Card|Card}. All props of Card are supported.
 *
 * @example
 * <CardSports
 *   captionImageIconsSrc={[src, src, src, src]}
 *   hasContainer
 *   roundedImage
 *   leftTeam={{backgroundColor: '#1b2a4a', logo: <Image src={teamLogoSrc} />, score: '0/0'}}
 *   rightTeam={{backgroundColor: '#e31c23', logo: <Image src={teamLogoSrc} />, score: '0/0'}}
 *   label="A secondary caption"
 * >
 *  The primary caption
 * </CardSports>
 *
 * @module limestone/CardSports
 * @exports CardSports
 * @exports CardSportsBase
 * @exports CardSportsDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import Card, {CardBase} from '../Card';
import {getBadge} from '../Card/utils';
import $L from '../internal/$L';

import cardCss from '../Card/Card.module.less';
import componentCss from './CardSports.module.less';

const TRANSPARENT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const teamShape = PropTypes.shape({
	backgroundColor: PropTypes.string,
	logo: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	logoSize: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			height: PropTypes.number,
			width: PropTypes.number
		})
	]),
	score: PropTypes.string
});

const formatTeamScore = (leftTeam, rightTeam) => {
	const leftScore = leftTeam?.score;
	const rightScore = rightTeam?.score;

	if (leftScore && rightScore) return `${leftScore} : ${rightScore}`;

	return leftScore || rightScore || null;
};

/**
 * Default config for {@link limestone/CardSports.CardSportsDecorator|CardSportsDecorator}.
 *
 * @memberof limestone/CardSports.CardSportsDecorator
 * @hocconfig
 */
const defaultConfig = {};

/**
 * A higher-order component that adds a sports match overlay to
 * {@link limestone/Card.Card|Card}.
 *
 * The wrapped component receives all of its original props, plus `leftTeam` and `rightTeam`.
 *
 * @class CardSportsDecorator
 * @memberof limestone/CardSports
 * @hoc
 * @public
 */
const CardSportsDecorator = hoc(defaultConfig, (_config, Wrapped) => {
	return kind({
		name: 'CardSports',

		propTypes: /** @lends limestone/CardSports.CardSportsBase.prototype */ {
			/**
			 * Configures the left team for the sports layout.
			 *
			 * The following properties should be provided:
			 * * `backgroundColor` - The color for this team's half of the image
			 * * `logo` - The team logo. Same type as
			 *   {@link limestone/Card.CardBase#primaryBadge|primaryBadge} (`Element` or `String`)
			 * * `logoSize` - The size of the logo. Same type as
			 *   {@link limestone/Card.CardBase#primaryBadgeSize|primaryBadgeSize}
			 * * `score` - The score text for this team
			 *
			 * @type {Object}
			 * @required
			 * @public
			 */
			leftTeam: teamShape.isRequired,

			/**
			 * Configures the right team for the sports layout.
			 *
			 * See {@link limestone/CardSports.CardSportsBase#leftTeam|leftTeam} for the object shape
			 * and behavior.
			 *
			 * @type {Object}
			 * @required
			 * @public
			 */
			rightTeam: teamShape.isRequired,

			/**
			 * The "aria-label" for the Card.
			 *
			 * If not provided, it is generated from the captions, the team score, and the selected
			 * state.
			 *
			 * @type {String}
			 * @public
			 */
			'aria-label': PropTypes.string,

			/**
			 * Sources for the caption image icons.
			 *
			 * An array of String values or Objects of values used to determine which image will appear
			 * on a specific screenSize. This prop is only used when `orientation` is `'vertical'`.
			 *
			 * Not shown when the caption is overlaid (`captionOverlay` or `captionOverlayOnFocus`).
			 *
			 * @type {String[]|Object[]}
			 * @see {@link limestone/Card.CardBase#captionImageIconsSrc}
			 * @public
			 */
			captionImageIconsSrc: PropTypes.arrayOf(
				PropTypes.oneOfType([PropTypes.string, PropTypes.object])
			),

			/**
			 * Customizes the component by mapping the supplied collection of CSS class names to the
			 * corresponding internal elements and states of this component.
			 *
			 * The following classes are supported:
			 *
			 * * `cardSports` - The root class name
			 * * `score` - The score pill
			 * * `sportsBackground` - The diagonal team-color gradient behind the image
			 * * `sportsOverlay` - The logos and score overlay
			 * * `teamLogo` - Applied to a team's logo
			 * * `teamSide` - Applied to each team's half of the overlay
			 *
			 * @type {Object}
			 * @public
			 */
			css: PropTypes.object,

			/**
			 * Additional overlay rendered inside the image, after the sports match overlay.
			 *
			 * @type {Node}
			 * @see {@link limestone/Card.CardBase#imageOverlay}
			 * @public
			 */
			imageOverlay: PropTypes.node,

			/**
			 * Source for the image.
			 *
			 * String value or Object of values used to determine which image will appear on
			 * a specific screenSize.
			 *
			 * Optional. When omitted, the image area uses the team colors as a diagonal gradient.
			 *
			 * @type {String|Object}
			 * @see {@link limestone/Card.CardBase#src}
			 * @public
			 */
			src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
		},

		styles: {
			css: componentCss,
			className: 'cardSports',
			publicClassNames: true
		},

		computed: {
			'aria-label': ({'aria-label': ariaLabel, children, label, leftTeam, rightTeam, secondaryLabel, selected}) => {
				if (ariaLabel) return ariaLabel;

				const score = formatTeamScore(leftTeam, rightTeam);
				return `${children || ''}${label ? ` ${label}` : ''}${secondaryLabel ? ` ${secondaryLabel}` : ''}${score ? ` ${score}` : ''}${selected ? ' ' + $L('Selected') : ''}`;
			},
			captionImageIconsSrc: ({captionImageIconsSrc, captionOverlay, captionOverlayOnFocus}) => (
				(captionOverlay || captionOverlayOnFocus) ? null : captionImageIconsSrc
			),
			className: ({styler}) => styler.append(cardCss.sports),
			imageOverlay: ({css, imageOverlay, leftTeam, rightTeam}) => {
				const teamScore = formatTeamScore(leftTeam, rightTeam);

				return (
					<>
						<div className={css.sportsBackground} />
						<div className={css.sportsOverlay}>
							<div className={css.teamSide}>
								{leftTeam?.logo ? (
									getBadge(leftTeam.logo, leftTeam.logoSize, css.teamLogo)
								) : null}
							</div>
							{teamScore ? (
								<div className={css.score}>{teamScore}</div>
							) : (
								<div />
							)}
							<div className={css.teamSide}>
								{rightTeam?.logo ? (
									getBadge(rightTeam.logo, rightTeam.logoSize, css.teamLogo)
								) : null}
							</div>
						</div>
						{imageOverlay}
					</>
				);
			},
			src: ({src}) => src || TRANSPARENT_PLACEHOLDER,
			style: ({leftTeam, rightTeam, style}) => ({
				...style,
				...(leftTeam?.backgroundColor && {'--card-left-team-color': leftTeam.backgroundColor}),
				...(rightTeam?.backgroundColor && {'--card-right-team-color': rightTeam.backgroundColor})
			})
		},

		render: ({...rest}) => {
			delete rest.css;
			delete rest.leftTeam;
			delete rest.rightTeam;

			return (
				<Wrapped {...rest} />
			);
		}
	});
});

/**
 * A Limestone styled sports Card without the typical Card behaviors applied.
 *
 * Supports all props of {@link limestone/Card.CardBase|CardBase}, plus `leftTeam` and `rightTeam`.
 *
 * @class CardSportsBase
 * @memberof limestone/CardSports
 * @extends limestone/Card.CardBase
 * @mixes limestone/CardSports.CardSportsDecorator
 * @see {@link limestone/Card.CardBase}
 * @ui
 * @public
 */
const CardSportsBase = CardSportsDecorator(CardBase);

/**
 * A Limestone-styled sports Card.
 *
 * Supports all props of {@link limestone/Card.Card|Card}, plus `leftTeam` and `rightTeam` for the
 * sports match layout. `src` is optional; when omitted, the image area uses the team colors as a
 * diagonal gradient.
 *
 * Usage:
 * ```
 * <CardSports
 *   captionImageIconsSrc={[src, src, src, src]}
 *   hasContainer
 *   leftTeam={{backgroundColor: '#1b2a4a', logo: <Image src={teamLogoSrc} />, score: '0/0'}}
 *   rightTeam={{backgroundColor: '#e31c23', logo: <Image src={teamLogoSrc} />, score: '0/0'}}
 *   label="A secondary caption"
 * >
 *  The primary caption
 * </CardSports>
 * ```
 *
 * @class CardSports
 * @memberof limestone/CardSports
 * @extends limestone/CardSports.CardSportsBase
 * @extends limestone/Card.Card
 * @mixes limestone/CardSports.CardSportsDecorator
 * @see {@link limestone/Card.CardBase}
 * @ui
 * @public
 */
const CardSports = CardSportsDecorator(Card);

CardSports.displayName = 'CardSports';

export default CardSports;
export {
	CardSports,
	CardSportsBase,
	CardSportsDecorator
};
