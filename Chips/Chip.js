/**
 * Provides Limestone styled chip components and behaviors.
 *
 * @example
 * <Chip
 *   deleteButton={{
 *     icon: 'closex',
 *     position: 'right'
 *   }}
 *   icon="check"
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
import Spotlight from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import {getPointerMode} from '@enact/spotlight/src/pointer';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useRef, useEffect} from 'react';

import Button from '../Button/Button';
import Skinnable from '../Skinnable/Skinnable';

import css from './Chip.module.less';
import ForwardRef from '@enact/ui/ForwardRef';

const ChipDefaultProps = {
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

let overComponent = false;

const ChipBase = (props) => {
	const chipProps = setDefaultProps(props, ChipDefaultProps);
	const {children, className, deleteButton, disabled, ref, icon, handleDelete, buttonRef, ...rest} = chipProps;

	const chipClassName = classnames(className, deleteButton?.position);
	const buttonClassName = classnames(css.deleteButtonContainer, css[deleteButton?.position || 'right']);
	//const buttonRef = useRef(null);
	const chipContainerRef = useRef(null);
	const clientRef = useRef(null);
	const chipRef = clientRef || ref;

	const handleKeyDown = useCallback((ev) => {
		const {keyCode, target} = ev;
		if (is('left', keyCode) || is('right', keyCode) || is('down', keyCode) || is('up', keyCode)) {
			const nextTarget = getTargetByDirectionFromElement(getDirection(keyCode), target);

			console.log('nextTarget', nextTarget)
			Spotlight.focus(nextTarget);
			ev.stopPropagation();

			if (nextTarget !== null && nextTarget !== buttonRef.current.firstChild) {
				buttonRef.current?.classList.remove(css.focused);
			}
		}
	}, [chipRef.current]);

	/*const handleDelete = (ev) => {
		ev.stopPropagation();

		if (props.deleteButton && props.deleteButton.onDelete) {
			props.deleteButton.onDelete(ev);
			console.log('spotlight focus', containerRef.current)
			Spotlight.focus(containerRef.current);
		}
	};*/

	const handleMouseLeave = useCallback((ev) => {
		if (buttonRef.current && chipContainerRef.current.contains(ev.target)) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleFocus = useCallback((ev) => {
		if (ev.target === chipRef.current) {
			chipRef.current.classList.add(css.selected);
			buttonRef.current.classList.add(css.focused);
		}
	}, [chipRef.current, buttonRef.current]);

	const handleBlur = useCallback(() => {
		if (buttonRef.current && getPointerMode() === true && !overComponent) {
			buttonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleMouseOver = useCallback(() => {
		overComponent = true;
	}, []);

	const handleMouseOut = useCallback(() => {
		overComponent = false;
	}, []);

	delete rest.deleteButton;

	return (
		<div
			{...rest}
			className={css.chip}
			onMouseLeave={handleMouseLeave}
			onBlur={handleBlur}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			onKeyDown={handleKeyDown}
			ref={chipContainerRef}
		>
			<Button
				css={css}
				className={chipClassName}
				disabled={disabled}
				focusEffect="static"
				icon={icon ? icon : null}
				size="small"
				onFocus={handleFocus}
				ref={chipRef}
			>
				{children}
			</Button>
			{deleteButton &&
				<div className={buttonClassName} ref={buttonRef}>
					<Button
						backgroundOpacity="transparent"
						css={css}
						disabled={disabled}
						icon={deleteButton?.icon || 'closex'}
						size="small"
						onClick={handleDelete}
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
	 * @required
	 * @public
	 */
	children: PropTypes.string.isRequired,

	/**
	 * Define the icon, delete handler, and position for the delete button.
	 *
	 * @type {Object.<{icon: (String|Object), onDelete: (Function), position: ('top'|'bottom'|'right')}>|Boolean}
	 * @public
	 */
	deleteButton: PropTypes.oneOf([
		PropTypes.shape({
			icon: PropTypes.string || PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
			onDelete: PropTypes.func,
			position: PropTypes.oneOf(['top', 'bottom', 'right'])}),
		PropTypes.bool]),

	/**
	 * Disables Chip and becomes non-interactive.
	 *
	 * @type {Boolean}
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
 * Limestone-specific Chip behaviors to apply to {@link limestone/Chip.Chip|Chip}.
 *
 * @hoc
 * @memberof limestone/Chip
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ChipDecorator = compose(
	Skinnable,
	ForwardRef({prop: 'buttonRef'})
);

/**
 * A limestone-styled chip.
 *
 * Usage:
 * ```
 * <Chip
 *   deleteButton={{
 *     icon: 'closex',
 *     position: 'right',
 *   }}
 *   icon="check"
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
