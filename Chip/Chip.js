/**
 * Provides Limestone styled chip components and behaviors.
 *
 * @example
 * <Chip
 *   label="Label"
 *   icon="usb"
 *   direction="top"
 * 	 hasDeleteButton={true}
 * />
 *
 * @module limestone/Chip
 * @exports Chip
 * @exports ChipBase
 * @exports ChipDecorator
 * @public
 */

import {is} from '@enact/core/keymap';
import {setDefaultProps} from '@enact/core/util';
import {getDirection} from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useEffect, useState, useRef} from 'react';

import Button from '../Button';
import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './Chip.module.less';

const ChipDefaultProps = {
	direction: 'right',
	label: 'chip',
	hasDeleteButton: false,
	disabled: false
};

/**
 * A Limestone styled base component for {@link limestone/Chip.Chip|ChipBase}.
 *
 * @class ChipBase
 * @memberof limestone/ChipBase
 * @ui
 * @public
 */
const ChipBase = (props) => {
	const chipProps = setDefaultProps(props, ChipDefaultProps);
	const {icon, className, label, direction, disabled, hasDeleteButton, onDeleteClick, ...rest} = chipProps;
	const [position, setPosition] = useState({top: 0, left: 0});
	const chipClassName = classnames(css.chip, className, direction);
	const buttonClassName = classnames(css.deleteButtonContainer, css.focused);
	const clientRef = useRef(null);
	const buttonRef = useRef(null);

	const getPosition = (clientNode, buttonDirection) => {
		let buttonPosition = {};

		switch (buttonDirection) {
			case 'top':
				buttonPosition.top = (-clientNode.height * 2);
				buttonPosition.left = clientNode.width / 3.5;
				break;
			case 'bottom':
				buttonPosition.left = clientNode.width / 3.5;
				break;
			case 'right':
				buttonPosition.top = (-clientNode.height);
				buttonPosition.left = clientNode.width;
				break;
		}
		return buttonPosition;
	};

	const handleKeyDown = useCallback((ev) => {
		const {keyCode, target} = ev;
		if (is('left', keyCode) || is('right', keyCode) || is('down', keyCode) || is('up', keyCode)) {
			const nextTarget = getTargetByDirectionFromElement(getDirection(keyCode), target);

			if (nextTarget !== clientRef.current && !nextTarget.classList.contains(css.deleteButton)) {
				buttonRef.current.classList.remove(css.focused);
			}
		}
	}, []);

	const handleMouseLeave = useCallback((ev) => {
		if (ev.target.classList[0].includes('Chip')) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleFocus = useCallback((ev) => {
		if (ev.target === clientRef.current) {
			buttonRef.current.classList.add(css.focused);
		}
	}, []);

	useEffect(() => {
		if (!clientRef.current) return;

		const clientNode = clientRef.current.getBoundingClientRect();
		const buttonPosition = getPosition(clientNode, direction);

		setPosition(buttonPosition);
	}, [direction, hasDeleteButton]);

	useEffect(() => {
		if (buttonRef.current && hasDeleteButton) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, [hasDeleteButton]);

	delete rest.hasDeleteButton;

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
			<div className={css.chip} >
				<div className={css.bg} />
				<div className={css.content}>
					{icon && <Icon className={css.icon} size="large">{icon}</Icon>}
					<div className={css.labelContainer}>{label}</div>
				</div>
			</div>
			{hasDeleteButton &&
				<div ref={buttonRef} className={buttonClassName}>
					<Button
						backgroundOpacity="transparent"
						className={css.deleteButton}
						disabled={disabled}
						icon="closex"
						size="small"
						style={position}
						onClick={onDeleteClick}
					/>
				</div>
			}
		</div>
	);
};

ChipBase.propTypes = /** @lends limestone/Chip.ChipBase.prototype */ {
	/**
	 * Direction of the delete button.
	 *
	 * @type {('top'|'bottom'|'right')}
	 * @default 'right'
	 * @public
	 */
	direction: PropTypes.oneOf(['top', 'bottom', 'right']),

	/**
	 * Disables Chip and becomes non-interactive.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * Whether it has a delete button.
	 *
	 * @type {Boolean}
	 * @public
	 */
	hasDeleteButton: PropTypes.bool,

	/**
	 * The icon content in the chip content.
	 * If this is specified, {@link limestone/Icon.Icon|Icon} will be shown as the content.
	 *
	 * @see {@link ui/Icon.Icon.children}
	 * @type {String|Object}
	 * @public
	 */
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

	/**
	 * A label displayed in the chip content.
	 *
	 * @type {String}
	 * @public
	 */
	label: PropTypes.string,

	/**
	 * Called when the delete button clicked.
	 *
	 * @type {Function}
	 * @public
	 */
	onDeleteClick: PropTypes.func
};

/**
 * Limestone-specific Chip behaviors to apply to
 * {@link limestone/Chip.Chip|Chip}.
 *
 * @hoc
 * @memberof limestone/Chip
 * @mixes spotlight/Spottable.Spottable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ChipDecorator = compose(
	Spottable,
	Skinnable
);

/**
 * A limestone-styled chip and Spottable applied.
 *
 * Usage:
 * ```
 * <Chip
 *   label="Label"
 *   icon="usb"
 *   direction="top"
 * 	 hasDeleteButton={true}
 * />
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

Chip.displayName = 'Chip';

export default Chip;
export {
	Chip,
	ChipBase,
	ChipDecorator
};
