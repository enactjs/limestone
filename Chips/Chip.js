import {setDefaultProps} from '@enact/core/util';
import Spotlight, {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import classnames from 'classnames';
import PropTypes, {checkPropTypes} from 'prop-types';
import compose from 'ramda/src/compose';
import {use, useCallback, useEffect, useRef} from 'react';

import Button from '../Button';
import Icon from '../Icon';
import Image from '../Image';
import $L from '../internal/$L';
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
	disabled: false,
	imageSize: 24
};

/**
 * Provides Limestone styled Chip component and behaviors.
 *
 * Usage:
 * ```
 * <Chip
 * 	deleteButton={{
 * 		icon: 'closex',
 * 		position: 'right'
 * 	}}
 * 	icon="check"
 * >
 *  Label
 * </Chip>
 * ```
 *
 * @class Chip
 * @memberof limestone/Chips
 * @ui
 * @public
 */
const ChipBase = (props) => {
	checkPropTypes(ChipBase.propTypes, props, 'prop', ChipBase.displayName);

	const {handleChipDelete, getNextTargetFromDeleteButton, registerChild} = use(ChipsContext);
	const chipProps = setDefaultProps(props, ChipDefaultProps);
	const {checked, children, className, deleteButton, disabled, icon, id, imageSize, isImage, onClick, ref, ...rest} = chipProps;

	const ariaLabel = children + ' ' + $L('Chip') + ' ' + $L('button');
	const buttonClassName = classnames(css.deleteButtonContainer, css[deleteButton?.position || 'right']);
	const chipClassName = classnames(className, deleteButton?.position);
	const containerRef = useRef(null);
	const clientRef = useRef(null);
	const deleteButtonRef = useRef(null);
	const chipRef = clientRef || ref;

	const isHovering = useRef(false);

	useEffect(() => {
		if (chipRef.current && registerChild) {
			registerChild(chipRef, id);
		}
	}, [chipRef, registerChild, id]);

	useEffect(() => {
		const handleDocumentClick = (ev) => {
			if (containerRef.current && !containerRef.current.contains(ev.target)) {
				deleteButtonRef.current?.classList.remove(css.focused);
			}
		};

		document.addEventListener('click', handleDocumentClick, true);
		return () => {
			document.removeEventListener('click', handleDocumentClick, true);
		};
	}, []);

	const handleKeyDown = useCallback((ev) => {
		const {keyCode, target} = ev;
		const direction = getDirection(keyCode);
		if (direction) {
			let nextTarget = null;
			if (target === deleteButtonRef.current.firstChild && getNextTargetFromDeleteButton) {
				nextTarget = getNextTargetFromDeleteButton(direction, id);
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
	}, [chipRef, getNextTargetFromDeleteButton, id]);

	const handleMouseLeave = useCallback((ev) => {
		if (containerRef.current.contains(ev.target)) {
			deleteButtonRef.current?.classList.remove(css.focused);
		}
	}, []);

	const handleFocus = useCallback((ev) => {
		if (ev.target === chipRef.current) {
			deleteButtonRef.current?.classList.add(css.focused);
		}
	}, [chipRef]);

	const handleBlur = useCallback(() => {
		if (Spotlight.getPointerMode() && !isHovering.current) {
			deleteButtonRef.current?.classList.remove(css.focused);
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
			handleChipDelete(ev, id);
		}
		if (deleteButton?.onDelete) {
			deleteButton.onDelete(ev);
		}
	}, [deleteButton, handleChipDelete, id]);

	const iconComponent = useCallback(({children: childComponent, ...iconProps}) => {
		return <>
			{checked && <Icon {...iconProps}>checkmark</Icon>}
			{isImage && <Image {...iconProps} src={childComponent} style={{borderRadius: '999px', width: `${imageSize}px`, height: `${imageSize}px`}} />}
			{!isImage && childComponent && (childComponent !== 'check') && (childComponent !== 'checkmark') && <Icon {...iconProps}>{childComponent}</Icon>}
		</>;
	}, [checked, imageSize, isImage]);

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
				aria-label={ariaLabel}
				aria-checked={checked}
				css={css}
				className={chipClassName}
				data-chip-index={id}
				disabled={disabled}
				icon={icon ? icon : ''}
				iconComponent={iconComponent}
				size="small"
				onFocus={handleFocus}
				onClick={onClick}
				ref={chipRef}
				role="checkbox"
				roundBorder
			>
				{children}
			</Button>
			{deleteButton &&
				<div className={buttonClassName} ref={deleteButtonRef}>
					<Button
						aria-label={children + ' ' + $L("Delete")}
						css={css}
						backgroundOpacity="transparent"
						disabled={disabled}
						icon={deleteButton?.icon || 'closex'}
						size="small"
						onClick={handleDelete}
						role="button"
						roundBorder
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
	 * Unique identifier for the chip.
	 *
	 * @type {String}
	 * @required
	 * @public
	 */
	id: PropTypes.string.isRequired,

	/**
	 * Sets the chip as `checked` if `true`
	 *
	 * @type {Boolean}
	 * @public
	 */
	checked: PropTypes.bool,

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
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

	/**
	 * Sets the size of the image passed to the component.
	 *
	 * @type {Number}
	 * @public
	 */
	imageSize: PropTypes.number,

	/**
	 * If `true` tells the component to use `Image` instead of `Icon` element inside `Chip`.
	 *
	 * @type {Boolean}
	 * @public
	 */
	isImage: PropTypes.bool
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
