/**
 * Provides Limestone styled chip components and behaviors.
 *
 * @example
 * <Chip
 *   icon="check"
 *   direction="right"
 *   deleteButton={{
 *     icon: 'closex',
 *     position: 'right'
 *   }}
 * >
 *  Label
 * </Chip>
 *
 * @module limestone/Chip
 * @exports Chip
 * @exports ChipBase
 * @exports ChipDecorator
 */

import {is} from '@enact/core/keymap';
import {setDefaultProps} from '@enact/core/util';
import {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useEffect, useRef} from 'react';

import Button from '../Button';
import Skinnable from '../Skinnable';

import css from './Chip.module.less';

const ChipDefaultProps = {
	icon: 'check',
	disabled: false
};

/**
 * A Limestone styled base component for {@link limestone/Chip.Chip|ChipBase}.
 *
 * @class ChipBase
 * @memberof limestone/Chip
 * @ui
 * @public
 */
const ChipBase = (props) => {
	const chipProps = setDefaultProps(props, ChipDefaultProps);
	const {icon, children, className, deleteButton, disabled, ...rest} = chipProps;
	const chipClassName = classnames(css.chip, className, deleteButton?.position);
	const buttonClassName = classnames(css.deleteButtonContainer, css.focused, css[deleteButton?.position || 'right']);
	const clientRef = useRef(null);
	const buttonRef = useRef(null);

	const handleKeyDown = useCallback((ev) => {
		const {keyCode, target} = ev;
		if (is('left', keyCode) || is('right', keyCode) || is('down', keyCode) || is('up', keyCode)) {
			const nextTarget = getTargetByDirectionFromElement(getDirection(keyCode), target);

			if (nextTarget !== null && nextTarget !== clientRef.current.firstChild && nextTarget !== buttonRef.current.firstChild) {
				buttonRef.current.classList.remove(css.focused);
			}
		}
	}, []);

	const handleMouseLeave = useCallback((ev) => {
		if (clientRef.current.contains(ev.target)) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleFocus = useCallback((ev) => {
		if (ev.target === clientRef.current.firstChild) {
			buttonRef.current.classList.add(css.focused);
		}
	}, []);

	useEffect(() => {
		if (buttonRef.current && deleteButton && Object.keys(deleteButton).length !== 0) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, [deleteButton]);

	delete rest.deleteButton;

	return (
		<div
			{...rest}
			className={chipClassName}
			disabled={disabled}
			ref={clientRef}
			onKeyDown={handleKeyDown}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
		>
			<Button icon={icon ? icon : 'check'} size="small" css={css}>{children}</Button>
			{deleteButton && Object.keys(deleteButton).length !== 0 &&
				<div ref={buttonRef} className={buttonClassName}>
					<Button
						backgroundOpacity="transparent"
						className={css.deleteButton}
						disabled={disabled}
						icon={deleteButton?.icon || 'closex'}
						size="small"
						onClick={deleteButton.onClick}
					/>
				</div>
			}
		</div>
	);
};

ChipBase.displayName = 'Chip';

ChipBase.propTypes = /** @lends limestone/Chip.ChipBase.prototype */ {
	/**
	 * A label displayed in the chip content.
	 *
	 * @type {String}
	 * @public
	 */
	children: PropTypes.string,

	/**
	 * Define the icon, click handler, and position to be placed in the delete button.
	 *
	 * @type {Object}
	 * @public
	 */
	deleteButton: PropTypes.shape({
		icon: PropTypes.string || PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		onClick: PropTypes.func,
		position: PropTypes.oneOf(['top', 'bottom', 'right'])
	}),

	/**
	 * Disables Chip and becomes non-interactive.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * The icon content in the chip content.
	 * If this is specified, {@link limestone/Icon.Icon|Icon} will be shown as the content.
	 *
	 * @see {@link ui/Icon.Icon.children}
	 * @type {String|Object}
	 * @public
	 */
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

/**
 * Limestone-specific Chip behaviors to apply to
 * {@link limestone/Chip.Chip|Chip}.
 *
 * @hoc
 * @memberof limestone/Chip
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ChipDecorator = compose(
	Skinnable
);

/**
 * A limestone-styled chip.
 *
 * Usage:
 * ```
 * <Chip
 *   icon="check"
 *   direction="right"
 *   deleteButton={{
 *     icon: 'closex',
 *     position: 'right',
 *   }}
 * >
 *  Label
 * </Chip>
 * ```
 *
 * @class Chip
 * @memberof limestone/Chip
 * @extends limestone/Chip.ChipBase
 * @mixes limestone/Chip.ChipDecorator
 * @see {@link limestone/Chip.ChipBase}
 * @ui
 * @public
 */
const Chip = ChipDecorator(ChipBase);

export default Chip;
export {
	Chip,
	ChipBase,
	ChipDecorator
};
