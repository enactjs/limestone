import {setDefaultProps} from '@enact/core/util';
import Spotlight, {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {use, useCallback, useEffect, useRef, useState} from 'react';

import Button from '../Button';
import Skinnable from '../Skinnable';

import {ChipsContext} from './Chips';

import css from './Chip.module.less';

/**
 * The shape of the chip delete button for {@link limestone/Chips.Chip|Chip}.
 *
 * @typedef {Object} chipDeleteButtonShape
 * @memberof limestone/Chips
 * @property {String|Object} icon The icon to display in the delete button.
 * @property {Function} onDelete The function to call when the delete button is clicked.
 * @property {('top'|'bottom'|'right')} position The position of the delete button relative to the chip.
 * @public
 */
const chipDeleteButtonShape = PropTypes.shape({
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	onDelete: PropTypes.func,
	position: PropTypes.oneOf(['top', 'bottom', 'right'])
});

const ChipDefaultProps = {
	disabled: false
};

/**
 * Provides Limestone styled Chip component and behaviors.
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
 * @class Chip
 * @memberof limestone/Chips
 * @ui
 * @public
 */
const ChipBase = (props) => {
	const {handleChipDelete, getNextTargetFromDeleteButton, registerChild} = use(ChipsContext);
	const chipProps = setDefaultProps(props, ChipDefaultProps);
	const {children, className, deleteButton, disabled, icon, ref, ...rest} = chipProps;

	const chipClassName = classnames(className, deleteButton?.position);
	const buttonClassName = classnames(css.deleteButtonContainer, css[deleteButton?.position || 'right']);

	const containerRef = useRef(null);
	const clientRef = useRef(null);
	const deleteButtonRef = useRef(null);
	const chipRef = clientRef || ref;

	const isHovering = useRef(false);

	const [index, setIndex] = useState(-1);

	useEffect(() => {
		if (chipRef.current && registerChild) {
			setIndex(registerChild(chipRef));
		}
	}, [chipRef, registerChild]);

	const handleKeyDown = useCallback((ev) => {
		const {keyCode, target} = ev;
		const direction = getDirection(keyCode);
		if (direction) {
			let nextTarget = null;
			if (target === deleteButtonRef.current.firstChild) {
				nextTarget = getNextTargetFromDeleteButton(direction, index);
			}

			if (nextTarget === null) {
				nextTarget = getTargetByDirectionFromElement(direction, target);
			}

			if (nextTarget === null) {
				return;
			}

			Spotlight.focus(nextTarget);
			ev.stopPropagation();

			if (nextTarget !== null && nextTarget !== deleteButtonRef.current.firstChild && nextTarget !== chipRef.current) {
				deleteButtonRef.current?.classList.remove(css.focused);
			}
		}
	}, [chipRef, getNextTargetFromDeleteButton, index]);

	const handleMouseLeave = useCallback((ev) => {
		if (containerRef.current.contains(ev.target)) {
			deleteButtonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleFocus = useCallback((ev) => {
		if (ev.target === chipRef.current) {
			deleteButtonRef.current.classList.add(css.focused);
		}
	}, [chipRef]);

	const handleBlur = useCallback(() => {
		if (Spotlight.getPointerMode() && !isHovering.current) {
			deleteButtonRef.current.classList.remove(css.focused);
		}
	}, []);

	const handleMouseOver = useCallback(() => {
		isHovering.current = true;
	}, []);

	const handleMouseOut = useCallback(() => {
		isHovering.current = false;
	}, []);

	const handleDelete = useCallback((ev) => {
		if (handleChipDelete) {
			handleChipDelete(ev, index);
		}
		if (deleteButton?.onDelete) {
			deleteButton.onDelete(ev);
		}
	}, [deleteButton, handleChipDelete, index]);

	return (
		<div
			{...rest}
			className={css.chip}
			onMouseLeave={handleMouseLeave}
			onBlur={handleBlur}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			onKeyDown={handleKeyDown}
			ref={containerRef}
		>
			<Button
				css={css}
				className={chipClassName}
				data-chip-index={index}
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
				<div className={buttonClassName} ref={deleteButtonRef}>
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

ChipBase.propTypes = /** @lends limestone/Chips.Chip.prototype */ {
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
	 * @type {limestone/Chips.chipDeleteButtonShape|Boolean}
	 * @public
	 */
	deleteButton: PropTypes.oneOfType([
		chipDeleteButtonShape,
		PropTypes.bool
	]),

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
 * Limestone-specific Chip behaviors to apply to {@link limestone/Chips.Chip|Chip}.
 *
 * @hoc
 * @memberof limestone/Chips
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ChipDecorator = compose(
	Skinnable
);

const Chip = ChipDecorator(ChipBase);

export default Chip;
export {
	Chip,
	ChipBase,
	ChipDecorator,
	chipDeleteButtonShape
};
