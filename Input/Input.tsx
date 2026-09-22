/**
 * Provides Limestone-themed input components and behaviors.
 *
 * @module limestone/Input
 * @exports Input
 * @exports InputBase
 * @exports InputPopup
 * @exports InputPopupBase
 * @exports InputDecorator
 */

import {handle, forKey, forward, forwardCustom} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {extractAriaProps, mapAndFilterChildren} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import {spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import {useAnnounce} from '@enact/ui/AnnounceDecorator';
import Changeable from '@enact/ui/Changeable';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import Layout, {Cell} from '@enact/ui/Layout';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {cloneElement, Fragment} from 'react';
import type {ComponentType, ReactElement, ReactNode} from 'react';

import $L from '../internal/$L';
import Button from '../Button';
import Popup from '../Popup';
import Skinnable from '../Skinnable';
import Heading from '../Heading';

import NumberField from './NumberField';
import InputField from './InputField';
import {DEFAULT_LENGTH, calcAriaLabel, convertToPasswordFormat, extractInputFieldProps, limitNumberLength} from './util';

import componentCss from './Input.module.less';

const prepareInputEventPayload = (ev: any) => ({value: ev.target.value});
const isPasswordType = (type: string | undefined) => Boolean(type && type.includes('password'));

export type InputType = 'text' | 'password' | 'number' | 'passwordnumber' | 'url' | 'tel' | 'passwordtel';

export interface InputPopupBaseProps {
	announce?: (...args: any[]) => any;
	backButtonAriaLabel?: string;
	buttons?: ReactElement | ReactElement[];
	css?: Record<string, string>;
	defaultValue?: string | number;
	disabled?: boolean;
	inputFieldSpotlightId?: string;
	invalid?: boolean;
	invalidMessage?: string;
	length?: number;
	marqueeInputField?: boolean;
	maxLength?: number;
	minLength?: number;
	noBackButton?: boolean;
	noSubmitButton?: boolean;
	numberInputField?: 'auto' | 'separated' | 'joined' | 'field';
	onBeforeChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onClose?: (...args: any[]) => any;
	onComplete?: (...args: any[]) => any;
	onOpenPopup?: (...args: any[]) => any;
	onShow?: (...args: any[]) => any;
	open?: boolean;
	placeholder?: string;
	popupAriaLabel?: string;
	popupType?: 'fullscreen' | 'overlay';
	size?: 'small' | 'large';
	subtitle?: string;
	title?: string;
	type?: InputType;
	children?: ReactNode;
}

/**
 * Base component for providing text input in the form of a popup without button.
 *
 * @class InputPopupBase
 * @memberof limestone/Input
 * @ui
 * @public
 */
const InputPopupBase = kind({
	name: 'InputPopup',

	_propTypes: {} as InputPopupBaseProps,

	propTypes: /** @lends limestone/Input.InputPopupBase.prototype */ {
		announce: PropTypes.func,
		backButtonAriaLabel: PropTypes.string,
		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]) as PropTypes.Validator<ReactElement | ReactElement[] | undefined>,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) as PropTypes.Validator<string | number | undefined>,
		disabled: PropTypes.bool,
		inputFieldSpotlightId: PropTypes.string,
		invalid: PropTypes.bool,
		invalidMessage: PropTypes.string,
		length: PropTypes.number,
		marqueeInputField: PropTypes.bool,
		maxLength: PropTypes.number,
		minLength: PropTypes.number,
		noBackButton: PropTypes.bool,
		noSubmitButton: PropTypes.bool,
		numberInputField: PropTypes.oneOf(['auto', 'separated', 'joined', 'field']) as PropTypes.Validator<'auto' | 'separated' | 'joined' | 'field' | undefined>,
		onBeforeChange: PropTypes.func,
		onChange: PropTypes.func,
		onClose: PropTypes.func,
		onComplete: PropTypes.func,
		onOpenPopup: PropTypes.func,
		open: PropTypes.bool,
		placeholder: PropTypes.string,
		popupAriaLabel: PropTypes.string,
		popupType: PropTypes.oneOf(['fullscreen', 'overlay']) as PropTypes.Validator<'fullscreen' | 'overlay' | undefined>,
		size: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,
		subtitle: PropTypes.string,
		title: PropTypes.string,
		type: PropTypes.oneOf(['text', 'password', 'number', 'passwordnumber', 'url', 'tel', 'passwordtel']) as PropTypes.Validator<InputType | undefined>
	},

	defaultProps: {
		defaultValue: '',
		marqueeInputField: false,
		popupType: 'fullscreen',
		numberInputField: 'auto',
		size: 'small',
		subtitle: '',
		title: '',
		type: 'text'
	},

	styles: {
		css: componentCss,
		className: 'input',
		publicClassNames: ['textField']
	},

	handlers: {
		onShow: handle(
			forwardCustom('onShow'),
			(ev: any, {type}: any) => !type.includes('number'),
			() => Spotlight.setPointerMode(false)
		),
		onNumberComplete: handle(
			(ev: any, props: any) => {
				setTimeout(() => {
					forward('onComplete', ev, props);
					forward('onClose', ev, props);
				}, 250);
				return true;
			}
		),
		onInputKeyDown: handle(
			forKey('enter') as any,
			// Ensure that the source of the enter is the <input>
			({target}: any) => target.nodeName === 'INPUT',
			forwardCustom('onComplete', prepareInputEventPayload),
			forwardCustom('onClose')
		)
	},

	computed: {
		buttons: ({buttons}) => {
			return mapAndFilterChildren(buttons, (button: any, index: number) => (
				<Cell key={`button${index}`} shrink>
					{cloneElement(button, {css: componentCss})}
				</Cell>
			)) || null;
		},
		maxLength: ({length, maxLength}) => (length || maxLength),
		minLength: ({length, maxLength, minLength}) => {
			if (length) return length;
			if (minLength != null) return minLength;
			if (maxLength != null) return maxLength;
			return DEFAULT_LENGTH;
		},
		popupClassName: ({popupType, subtitle, title, type, styler}) => styler.join('inputPopup', popupType, type, {noTitle: !title, noSubtitle: !subtitle}),
		inputAreaClassName: ({buttons, styler}) => styler.join('inputArea', buttons ? 'withButtons' : '')
	},

	render: ({
		announce,
		backButtonAriaLabel,
		buttons,
		children,
		css,
		defaultValue,
		disabled,
		inputAreaClassName,
		inputFieldSpotlightId,
		marqueeInputField,
		noBackButton,
		noSubmitButton,
		numberInputField,
		onBeforeChange,
		onClose,
		onNumberComplete,
		onInputKeyDown,
		onShow,
		open,
		placeholder,
		popupAriaLabel,
		popupClassName,
		popupType,
		size,
		subtitle,
		title,
		type,
		maxLength,
		minLength,
		...rest
	}: any) => {
		const id = `inputPopup`;
		const ariaLabelledBy = popupAriaLabel ? null : `${id}_title ${id}_subtitle`;
		const restProps = rest as Record<string, any>;
		const {value, ...inputProps} = extractInputFieldProps({disabled, ...restProps});
		const numberMode = (numberInputField !== 'field') && (type === 'number' || type === 'passwordnumber');
		// Set up the back button
		const backButton = (!noBackButton ? (
			<Button
				aria-label={backButtonAriaLabel == null ? $L('go to previous') : backButtonAriaLabel}
				className={css!.back}
				css={css}
				disabled={disabled}
				icon="arrowhookleft"
				iconFlip="auto"
				onClick={onClose}
			/>
		) : null);
		const heading = <Heading id={`${id}_title`} size="title" marqueeOn="render" alignment="center" className={css!.title}>{title}</Heading>;

		delete restProps.length;
		delete restProps.onComplete;
		delete restProps.onOpenPopup;

		return (
			<div aria-owns={id} className={css!.inputPopupWrapper}>
				<Popup
					id={id}
					aria-label={popupAriaLabel}
					aria-labelledby={ariaLabelledBy ?? void 0}
					css={css}
					onClose={onClose}
					onShow={onShow}
					position={popupType === 'fullscreen' ? 'fullscreen' : 'center'}
					className={popupClassName}
					noAlertRole
					noAnimation
					open={open}
					role="region"
				>
					{popupType === 'fullscreen' ? backButton : null}
					<Layout orientation="vertical" className={css!.inputBody}>
						<Cell shrink className={css!.titles}>
							{popupType === 'fullscreen' ?
								heading :
								<>
									{backButton}
									{heading}
								</>
							}
							<Heading id={`${id}_subtitle`} size="subtitle" marqueeOn="render" alignment="center" className={css!.subtitle}>{subtitle}</Heading>
						</Cell>
						<Cell shrink className={inputAreaClassName}>
							{numberMode ?
								<NumberField
									{...inputProps}
									announce={announce}
									buttonSize={popupType === 'fullscreen' ? 'large' : 'small'}
									maxLength={limitNumberLength(popupType!, maxLength!)}
									minLength={limitNumberLength(popupType!, minLength!)}
									defaultValue={defaultValue || value}
									onBeforeChange={onBeforeChange}
									onComplete={onNumberComplete}
									showKeypad
									type={(type === 'passwordnumber') ? 'password' : 'number'}
									numberInputField={numberInputField}
									noSubmitButton={noSubmitButton}
								/> :
								<InputField
									{...(inputProps as any)}
									className={classnames(css!.textField, spotlightDefaultClass)}
									css={css}
									maxLength={maxLength}
									minLength={minLength}
									marqueeContent={marqueeInputField}
									size={size}
									autoFocus
									type={type}
									defaultValue={defaultValue || value}
									placeholder={placeholder}
									onBeforeChange={onBeforeChange}
									onKeyDown={onInputKeyDown}
									{...({spotlightId: inputFieldSpotlightId} as any)}
								/>
							}
							<Cell shrink className={css!.contentArea}>
								{children}
							</Cell>
						</Cell>
						{buttons ?
							<Cell shrink className={css!.buttonArea}>
								{buttons}
							</Cell> : null
						}
					</Layout>
				</Popup>
			</div>
		);
	}
});

export interface InputBaseProps {
	announce?: (...args: any[]) => any;
	disabled?: boolean;
	placeholder?: string;
	size?: 'small' | 'large';
	type?: InputType;
	value?: string | number;
}

/**
 * Base component for providing text input in the form of a button that opens a popup.
 *
 * @class InputBase
 * @memberof limestone/Input
 * @ui
 * @public
 */
const InputBase = kind({
	name: 'Input',

	_propTypes: {} as InputBaseProps,

	propTypes: /** @lends limestone/Input.InputBase.prototype */ {
		announce: PropTypes.func,
		disabled: PropTypes.bool,
		placeholder: PropTypes.string,
		size: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,
		type: PropTypes.oneOf(['text', 'password', 'number', 'passwordnumber', 'url', 'tel', 'passwordtel']) as PropTypes.Validator<InputType | undefined>,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) as PropTypes.Validator<string | number | undefined>
	},

	defaultProps: {
		placeholder: '-',
		type: 'text'
	},

	handlers: {
		onClick: handle(
			forward('onClick'),
			forward('onOpenPopup')
		)
	},

	computed: {
		buttonAriaLabel: ({placeholder, type, value}) => {
			if (value || value === 0) {
				const resolvedType = isPasswordType(type) ? 'password' : type;
				return calcAriaLabel('', resolvedType!, type === 'number' ? String(value).split('').join(',') : value.toString());
			}

			return calcAriaLabel('', null as any, placeholder);
		},
		buttonLabel: ({placeholder, type, value}) => {
			if (value || value === 0) {
				return isPasswordType(type) ? convertToPasswordFormat(value.toString()) : value.toString();
			} else {
				return placeholder;
			}
		}
	},

	render: ({announce, buttonAriaLabel, buttonLabel, type, size, disabled, value, placeholder, onClick, className, style, ...rest}: any) => {
		const ariaProps = extractAriaProps(rest);

		return (
			<Fragment>
				<InputPopupBase
					announce={announce}
					type={type}
					size={size}
					disabled={disabled}
					defaultValue={value}
					placeholder={placeholder}
					{...rest}
				/>
				<Button
					size={size}
					disabled={disabled}
					className={className}
					style={style}
					onClick={onClick}
					aria-label={buttonAriaLabel}
					{...ariaProps}
				>
					{buttonLabel}
				</Button>
			</Fragment>
		);
	}
});

// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
const AnnounceDecorator = (Wrapped: ComponentType<any>) => (function AnnounceDecorator (props: Record<string, any>) {
	const {announce, children} = useAnnounce();

	return (
		<Fragment>
			<Wrapped {...props} announce={announce} />
			{children}
		</Fragment>
	);
});

/**
 * Limestone specific item behaviors to apply to {@link limestone/Input.InputBase|Input}.
 *
 * @class InputDecorator
 * @hoc
 * @memberof limestone/Input
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/Changeable.Changeable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const InputDecorator = compose(
	Pure,
	Toggleable({activate: 'onOpenPopup', deactivate: 'onClose', prop: 'open'}),
	Slottable({slots: ['buttons']}),
	Changeable({change: 'onComplete'}),
	AnnounceDecorator,
	Skinnable
);

/**
 * Provides an input in the form of a popup.
 *
 * @class Input
 * @memberof limestone/Input
 * @extends limestone/Input.InputBase
 * @ui
 * @public
 */
const Input = InputDecorator(InputBase) as ComponentType<InputBaseProps & Omit<InputPopupBaseProps, 'type' | 'value' | 'disabled' | 'placeholder' | 'size' | 'announce'> & {defaultValue?: string | number}>;

/**
 * Provides an input popup without button.
 *
 * @class InputPopup
 * @memberof limestone/Input
 * @extends limestone/Input.InputPopupBase
 * @ui
 * @public
 */
const InputPopup = InputDecorator(InputPopupBase) as ComponentType<InputPopupBaseProps & {defaultValue?: string | number; value?: string | number}>;

export default Input;
export {
	Input,
	InputBase,
	InputPopup,
	InputPopupBase,
	InputDecorator
};
