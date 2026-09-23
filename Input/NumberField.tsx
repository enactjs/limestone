import {handle, adaptEvent, forwardCustom, forwardCustomWithPrevent, returnsTrue} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Changeable from '@enact/ui/Changeable';
import Layout, {Cell} from '@enact/ui/Layout';
import Repeater from '@enact/ui/Repeater';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Fragment} from 'react';
import type {ComponentType} from 'react';

import Button from '../Button';
import Icon from '../Icon';
import $L from '../internal/$L';
import Tooltip from '../TooltipDecorator/Tooltip';

import Keypad from './Keypad';
import {DEFAULT_LENGTH, SEPARATE_DIGITS_LIMIT, convertToPasswordFormat} from './util';

import componentCss from './Input.module.less';

const getSeparated = (prefer: string, max: number) => (prefer === 'separated' || (prefer === 'auto' && max <= SEPARATE_DIGITS_LIMIT));

const normalizeValue = (value: string | number | null | undefined, maxLength?: number) => ((value != null) ? value.toString().replace(/\D/g, '').substring(0, maxLength) : '');

const normalizeValueProp = ({value, maxLength}: Record<string, any>) => normalizeValue(value, maxLength);

export interface NumberCellProps {
	active?: boolean;
	children?: string;
	disabled?: boolean;
	password?: boolean;
	passwordIcon?: string;
}

const NumberCell = kind({
	name: 'NumberCell',

	_propTypes: {} as NumberCellProps,

	propTypes: /** @lends limestone/Input.NumberCell.prototype */ {
		active: PropTypes.bool,
		children: PropTypes.string,
		disabled: PropTypes.bool,
		password: PropTypes.bool,
		passwordIcon: PropTypes.string
	},

	defaultProps: {
		password: false,
		passwordIcon: 'circle'
	},

	styles: {
		css: componentCss,
		className: 'numberCell'
	},

	computed: {
		className: ({active, password, styler}) => styler.append({active, password})
	},

	render: ({children, password, passwordIcon, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.active;

		return (
			<Icon
				size="large"
				{...restProps}
			>
				{(password && children) ? passwordIcon : children}
			</Icon>
		);
	}
});

export interface NumberFieldBaseProps {
	announce?: (...args: any[]) => any;
	buttonSize?: 'small' | 'large';
	css?: Record<string, string>;
	disabled?: boolean;
	invalid?: boolean;
	invalidMessage?: string;
	maxLength?: number;
	minLength?: number;
	noSubmitButton?: boolean;
	numberInputField?: string;
	onBeforeChange?: (...args: any[]) => any;
	onComplete?: (...args: any[]) => any;
	rtl?: boolean;
	showKeypad?: boolean;
	type?: 'number' | 'password';
	value?: string | number;
}

const NumberFieldBase = kind({
	name: 'NumberField',

	_propTypes: {} as NumberFieldBaseProps,

	propTypes: {
		announce: PropTypes.func,
		buttonSize: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		disabled: PropTypes.bool,
		invalid: PropTypes.bool,
		invalidMessage: PropTypes.string,
		maxLength: PropTypes.number,
		minLength: PropTypes.number,
		noSubmitButton: PropTypes.bool,
		numberInputField: PropTypes.string,
		onBeforeChange: PropTypes.func,
		onComplete: PropTypes.func,
		rtl: PropTypes.bool,
		showKeypad: PropTypes.bool,
		type: PropTypes.oneOf(['number', 'password']) as PropTypes.Validator<'number' | 'password' | undefined>,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) as PropTypes.Validator<string | number | undefined>
	},

	defaultProps: {
		buttonSize: 'large',
		maxLength: DEFAULT_LENGTH,
		minLength: 0,
		numberInputField: 'auto',
		type: 'number'
	},

	styles: {
		css: componentCss,
		className: 'numberField'
	},

	handlers: {
		onAdd: handle(
			adaptEvent(
				({key}: any, {maxLength, value}: any) => ({value: normalizeValue(`${value}${key}`, maxLength)}),
				handle(
					returnsTrue(({value}: any, {announce, type}: any) => {
						announce(type === 'password' ? $L('hidden') : String(value).slice(-1));
					}),
					// In case onAdd was run in the short period between the last onComplete and this invocation, just bail out
					({value: updatedValue}: any, {maxLength, value}: any) => (normalizeValue(updatedValue, maxLength) !== normalizeValue(value, maxLength)),
					forwardCustomWithPrevent('onBeforeChange', ({value}: any) => ({value})),
					forwardCustom('onChange', (ev: any) => (ev)),
					// Check the length of the new value and return true (pass/proceed) if it is at or above max-length
					({value: updatedValue}: any, {maxLength, minLength, noSubmitButton, numberInputField}: any) => {
						const
							updatedLength = normalizeValue(updatedValue, maxLength).length,
							// Auto-submit only when the submit button is omitted for separated equal-length fields
							autoSubmit = noSubmitButton && getSeparated(numberInputField, maxLength) && minLength === maxLength;
						return autoSubmit && updatedLength >= maxLength;
					},
					forwardCustom('onComplete', (ev: any) => (ev))
				)
			)
		),
		onRemove: handle(
			returnsTrue((ev: any, {announce}: any) => announce($L('backspace'))),
			adaptEvent(
				(ev: any, {maxLength, value}: any) => ({value: normalizeValue(value, maxLength).toString().slice(0, -1)}),
				handle(
					forwardCustomWithPrevent('onBeforeChange', ({value}: any) => ({value})),
					forwardCustom('onChange', (ev: any) => (ev))
				)
			)
		),
		onSubmit: handle(
			adaptEvent(
				(ev: any, {maxLength, value}: any) => ({value: normalizeValue(value, maxLength)}),
				forwardCustom('onComplete', (ev: any) => (ev))
			)
		)
	},

	computed: {
		className: ({maxLength, numberInputField, type, styler}) => {
			const numberFieldStyle = getSeparated(numberInputField!, maxLength!) ? 'separated' : 'joined';
			return styler.append(type, numberFieldStyle);
		},
		// Normalize the value, also prune out any non-digit characters
		value: normalizeValueProp,
		invalidTooltip: ({css, invalid, invalidMessage = $L('Please enter a valid value.')}) => {
			if (invalid && invalidMessage) {
				return (
					<Tooltip css={css} marquee relative type="transparent">
						{invalidMessage}
					</Tooltip>
				);
			}
		},
		submitButton: ({buttonSize, css, disabled, invalid, maxLength, minLength, noSubmitButton, onSubmit, value}: any) => {
			const isDisabled = disabled || invalid || (normalizeValue(value, maxLength).toString().length < minLength!);

			if (!noSubmitButton) {
				return <Button className={css!.submitButton} disabled={isDisabled} onClick={onSubmit} size={buttonSize}>{$L('Submit')}</Button>;
			} else {
				return null;
			}
		},
		style: ({maxLength, style}: any) => {
			return {
				...style,
				'--input-max-number-length': maxLength
			};
		}
	},

	render: ({css, disabled, invalidTooltip, maxLength, numberInputField, onAdd, onRemove, showKeypad, submitButton, type, value, ...rest}: any) => {
		const password = (type === 'password');
		const restProps = rest as Record<string, any>;
		delete restProps.announce;
		delete restProps.buttonSize;
		delete restProps.invalid;
		delete restProps.invalidMessage;
		delete restProps.minLength;
		delete restProps.noSubmitButton;
		delete restProps.onBeforeChange;
		delete restProps.onComplete;
		delete restProps.onSubmit;
		delete restProps.rtl;

		const separated = getSeparated(numberInputField!, maxLength!);

		let field;
		if (separated) {
			const stringValue = String(value);
			const values = stringValue.split('');
			const items = new Array(maxLength).fill('');
			const repeaterProps: any = {
				...restProps,
				component: Layout,
				childComponent: Cell,
				inline: true
			};
			field = (
				<Repeater
					{...repeaterProps}
				>
					{items.map((_, index) => ({
						active: index === stringValue.length,
						children: values[index],
						component: NumberCell,
						disabled,
						key: `key-${index}`,
						password,
						shrink: true
					}))}
				</Repeater>
			);
		} else {
			field = (
				<div {...restProps} disabled={disabled} {...({} as any)}>
					{password ? convertToPasswordFormat(String(value), '●') : value}
				</div>
			);
		}

		return (
			<Fragment>
				<div className={css!.fieldWrapper}>
					{field}
					{invalidTooltip}
				</div>
				<br />
				{showKeypad ? <Keypad aria-label=" " disabled={disabled} onAdd={onAdd} onRemove={onRemove} /> : null}
				{submitButton}
			</Fragment>
		);
	}
});

const NumberFieldDecorator = compose(
	Changeable,
	I18nContextDecorator({rtlProp: 'rtl'})
);

const NumberField = NumberFieldDecorator(NumberFieldBase) as ComponentType<NumberFieldBaseProps & {defaultValue?: string | number}>;

export default NumberField;
