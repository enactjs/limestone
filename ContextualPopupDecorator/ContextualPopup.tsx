import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {CSSProperties, ReactNode} from 'react';

import Skinnable from '../Skinnable';

import css from './ContextualPopup.module.less';

type ContextualPopupArrowDirection = 'above' | 'below' | 'left' | 'right';

export type ContextualPopupDirection =
	| 'above'
	| 'above center'
	| 'above left'
	| 'above right'
	| 'below'
	| 'below center'
	| 'below left'
	| 'below right'
	| 'left middle'
	| 'left top'
	| 'left bottom'
	| 'right middle'
	| 'right top'
	| 'right bottom';

export interface ContextualPopupArrowProps {
	direction?: ContextualPopupArrowDirection;
	style?: CSSProperties;
	[key: string]: any;
}

/**
 * An SVG arrow for {@link limestone/ContextualPopupDecorator/ContextualPopup.ContextualPopup}.
 *
 * @class ContextualPopupArrow
 * @memberof limestone/ContextualPopupDecorator
 * @ui
 * @private
 */
const ContextualPopupArrow = kind<ContextualPopupArrowProps>({
	name: 'ContextualPopupArrow',

	_propTypes: {} as ContextualPopupArrowProps,

	propTypes: /** @lends limestone/ContextualPopupDecorator.ContextualPopupArrow.prototype */ {
		direction: PropTypes.oneOf(['above', 'below', 'left', 'right'])
	},

	defaultProps: {
		direction: 'below'
	},

	styles: {
		css,
		className: 'arrow'
	},

	computed: {
		className: ({direction, styler}: Record<string, any>) => styler.append(direction, css.arrow)
	},

	render: (props: Record<string, any>) => (
		<svg {...props} viewBox="0 0 30 30">
			<path d="M0 20 L15 2 L30 20" className={css.arrowFill} />
		</svg>
	)
});

const ContextualPopupRoot = Skinnable('div');

export interface ContextualPopupBaseProps {
	children: ReactNode;
	arrowPosition?: CSSProperties;
	containerPosition?: CSSProperties & {width?: number};
	containerRef?: EnactPropTypeShapes.ref;
	direction?: ContextualPopupDirection;
	offset?: 'none' | 'overlap' | 'small' | 'large';
	showArrow?: boolean;
}

/**
 * A popup component used by
 * {@link limestone/ContextualPopupDecorator.ContextualPopupDecorator|ContextualPopupDecorator} to
 * wrap its {@link limestone/ContextualPopupDecorator.ContextualPopupDecorator.popupComponent|popupComponent}.
 *
 * `ContextualPopup` is usually not used directly but is made available for unique application use
 * cases.
 *
 * @class ContextualPopup
 * @memberof limestone/ContextualPopupDecorator
 * @ui
 * @public
 */
const ContextualPopupBase = kind({
	name: 'ContextualPopup',

	_propTypes: {} as ContextualPopupBaseProps,

	propTypes: /** @lends limestone/ContextualPopupDecorator.ContextualPopup.prototype */ {
		/**
		 * The contents of the popup.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Style object for arrow position.
		 *
		 * @type {Object}
		 * @public
		 */
		arrowPosition: PropTypes.shape({
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number
		}),

		/**
		 * Style object for container position.
		 *
		 * @type {Object}
		 * @public
		 */
		containerPosition: PropTypes.shape({
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number,
			width: PropTypes.number
		}),

		/**
		 * Called with the reference to the container node.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		containerRef: EnactPropTypes.ref,

		/**
		 * Direction of ContextualPopup.
		 *
		 * @type {('above'|'above center'|'above left'|'above right'|'below'|'below center'|'below left'|'below right'|'left middle'|'left top'|'left bottom'|'right middle'|'right top'|'right bottom')}
		 * @default 'below'
		 * @public
		 */
		direction: PropTypes.oneOf(['above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left middle', 'left top', 'left bottom', 'right middle', 'right top', 'right bottom']),

		/**
		 * Offset from the activator to apply to the position of the popup.
		 *
		 * @type {('none'|'overlap'|'small'|'large')}
		 * @default 'small'
		 * @public
		 */
		offset: PropTypes.oneOf(['none', 'overlap', 'small', 'large']),

		/**
		 * Shows the arrow.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showArrow: PropTypes.bool
	},

	defaultProps: {
		direction: 'below center',
		offset: 'small'
	},

	styles: {
		css,
		className: 'container'
	},

	computed: {
		arrowDirection: ({direction}: Record<string, any>) => {
			const [arrowDirection] = direction.split(' ');
			return arrowDirection;
		},
		className: ({direction, offset, styler}: Record<string, any>) => styler.append(
			{
				fixedSize: direction === 'above' || direction === 'below'
			},
			direction.split(' '),
			offset,
			css.outline
		)
	},

	render: ({arrowDirection, arrowPosition, className, containerPosition, containerRef, children, showArrow, ...rest}: Record<string, any>) => {
		delete rest.direction;

		return (
			<ContextualPopupRoot aria-live="off" role="alert" {...rest} className={css.contextualPopup}>
				<div className={className} style={containerPosition} ref={containerRef}>
					{children}
				</div>
				{showArrow ? <ContextualPopupArrow direction={arrowDirection as ContextualPopupArrowDirection} style={arrowPosition} /> : null}
			</ContextualPopupRoot>
		);
	}
});

export default ContextualPopupBase;
export {
	ContextualPopupBase as ContextualPopup,
	ContextualPopupBase
};
