import {handle, forwardCustom, forwardCustomWithPrevent, returnsTrue} from '@enact/core/handle';
import kind from '@enact/core/kind';
import platform from '@enact/core/platform';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {isRtlText} from '@enact/i18n/util';
import {useAnnounce} from '@enact/ui/AnnounceDecorator';
import Changeable from '@enact/ui/Changeable';
import Pure from '@enact/ui/internal/Pure';
import {readAlert} from '@enact/webos/speech';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Fragment} from 'react';
import type {ComponentType} from 'react';

import $L from '../internal/$L';
import {MarqueeController, MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import Tooltip from '../TooltipDecorator/Tooltip';
import {extractVoiceProps} from '../internal/util';

import InputFieldDecoratorIcon from './InputFieldDecoratorIcon';
import InputFieldSpotlightDecorator from './InputFieldSpotlightDecorator';
import {calcAriaLabel, extractInputProps} from './util';

import componentCss from './InputField.module.less';

const MarqueeText: ComponentType<any> = MarqueeDecorator({css: {
	text: componentCss.marqueeTextInner,
	animate: componentCss.marqueeTextAnimate,
	willAnimate: componentCss.marqueeTextWillAnimate
}}, 'div');

export interface InputFieldBaseProps {
	active?: boolean;
	announce?: (...args: any[]) => any;
	caretToEndOnFocus?: boolean;
	css?: Record<string, string>;
	'data-webos-voice-group-label'?: string;
	'data-webos-voice-intent'?: string;
	'data-webos-voice-label'?: string;
	disabled?: boolean;
	dismissOnEnter?: boolean;
	iconAfter?: string;
	iconBefore?: string;
	invalid?: boolean;
	invalidMessage?: string;
	marqueeContent?: boolean;
	onBeforeChange?: (...args: any[]) => any;
	onBlur?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onClick?: (...args: any[]) => any;
	onFocus?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	placeholder?: string;
	rtl?: boolean;
	size?: 'small' | 'large';
	type?: string;
	value?: string | number;
}

/**
 * A Limestone styled input component.
 *
 * It supports start and end icons, but it does not support Spotlight. Apps should use
 * {@link limestone/Input.InputField}.
 *
 * @class InputFieldBase
 * @memberof limestone/Input
 * @ui
 * @public
 */
const InputFieldBase = kind({
	name: 'InputField',

	_propTypes: {} as InputFieldBaseProps,

	propTypes: /** @lends limestone/Input.InputFieldBase.prototype */ {
		/**
		 * Indicates the input is currently active/focused for editing
		 *
		 * @type {Boolean}
		 * @private
		 */
		active: PropTypes.bool,

		/**
		 * Passed by AnnounceDecorator for accessibility.
		 *
		 * @type {Function}
		 * @public
		 */
		announce: PropTypes.func,

		/**
		 * Moves the caret to the end of the text when the input receives focus.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		caretToEndOnFocus: PropTypes.bool,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `inputField` - The root class name
		 * * `input` - The <input> class name
		 * * `inputHighlight` - The class used to make input text appear highlighted when `.inputField` has focus, but not `.input`
		 * * `tooltip` - The "invalid" tooltip
		 * * `tooltipLabel` - The "invalid" tooltip's label
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		// TODO: Document voice control props and make public
		'data-webos-voice-group-label': PropTypes.string,
		'data-webos-voice-intent': PropTypes.string,
		'data-webos-voice-label': PropTypes.string,

		/**
		 * Disables InputField and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Blurs the input when the "enter" key is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		dismissOnEnter: PropTypes.bool,

		/**
		 * The icon to be placed at the end of the input.
		 *
		 * @see {@link limestone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconAfter: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link limestone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconBefore: PropTypes.string,

		/**
		 * Indicates {@link limestone/Input.InputFieldBase.value|value} is invalid and shows
		 * {@link limestone/Input.InputFieldBase.invalidMessage|invalidMessage}, if set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		invalid: PropTypes.bool,

		/**
		 * The tooltip text to be displayed when the input is
		 * {@link limestone/Input.InputFieldBase.invalid|invalid}.
		 *
		 * If this value is *falsy*, the tooltip will be shown with the default message.
		 *
		 * @type {String}
		 * @default 'Please enter a valid value.'
		 * @public
		 */
		invalidMessage: PropTypes.string,

		/**
		 * Wraps the input's value/placeholder display in a marquee.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		marqueeContent: PropTypes.bool,

		/**
		 * Called before the input value is changed.
		 *
		 * The change can be prevented by calling `preventDefault` on the event.
		 *
		 * @type {Function}
		 * @public
		 */
		onBeforeChange: PropTypes.func,

		/**
		 * Called when blurred.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onBlur: PropTypes.func,

		/**
		 * Called when the input value is changed.
		 *
		 * The event payload includes the current `value` as well as a `stopPropagation()` method
		 * which may be called to stop the original `onChange` event from the `<input>` from
		 * bubbling.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Called when clicked.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClick: PropTypes.func,

		/**
		 * Called when focused.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onFocus: PropTypes.func,

		/**
		 * Called when a key is pressed down.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onKeyDown: PropTypes.func,

		/**
		 * Text to display when {@link limestone/Input.InputFieldBase.value|value} is not set.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Indicates the content's text direction is right-to-left.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * The size of the input field.
		 *
		 * @type {('large'|'small')}
		 * @default 'small'
		 * @public
		 */
		size: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,

		/**
		 * The type of input.
		 *
		 * Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types|MDN input types doc}
		 * @default 'text'
		 * @public
		 */
		type: PropTypes.string,

		/**
		 * The value of the input.
		 *
		 * @type {String|Number}
		 * @public
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) as PropTypes.Validator<string | number | undefined>
	},

	defaultProps: {
		active: false,
		caretToEndOnFocus: false,
		disabled: false,
		dismissOnEnter: false,
		invalid: false,
		marqueeContent: false,
		placeholder: '',
		size: 'small',
		type: 'text'
	},

	styles: {
		css: componentCss,
		className: 'inputField',
		publicClassNames: ['bg', 'inputField', 'input', 'inputHighlight', 'inputWrapper', 'marqueeText', 'placeholderText', 'tooltip', 'tooltipLabel']
	},

	handlers: {
		onChange: handle(
			forwardCustomWithPrevent('onBeforeChange', (ev: any) => ({value: ev.target.value})),
			returnsTrue((ev: any, {announce, type}: any) => {
				if (type === 'passwordtel') {
					if (platform.type === 'webos') {
						readAlert($L('hidden'));
					} else {
						announce($L('hidden'));
					}
				}
			}),
			forwardCustom('onChange', (ev: any) => ({value: ev.target.value}))
		)
	},

	computed: {
		'aria-label': ({placeholder, type, value}) => {
			const title = (value == null || value === '') ? placeholder : '';
			return calcAriaLabel(title!, type!, value);
		},
		className: ({active, iconAfter, iconBefore, invalid, marqueeContent, size, styler}) => styler.append(
			{
				active,
				hasIconAfter: iconAfter,
				hasIconBefore: iconBefore,
				hasMarquee: marqueeContent,
				invalid
			},
			size
		),
		dir: ({value, placeholder}) => isRtlText(String(value || placeholder)) ? 'rtl' : 'ltr',
		invalidTooltip: ({css, invalid, invalidMessage = $L('Please enter a valid value.')}) => {
			if (invalid && invalidMessage) {
				return (
					<Tooltip css={css} marquee relative type="transparent">
						{invalidMessage}
					</Tooltip>
				);
			}
		},
		// ensure we have a value so the internal <input> is always controlled
		value: ({value}) => typeof value === 'number' ? value : (value || '')
	},

	render: ({css, dir, disabled, iconAfter, iconBefore, invalidTooltip, marqueeContent, onChange, placeholder, type, value, ...rest}) => {
		const restProps = rest as Record<string, any>;
		const inputProps = extractInputProps(restProps);
		const voiceProps = extractVoiceProps(restProps);
		const isPasswordtel = type === 'passwordtel';

		if (type === 'password' || type === 'passwordtel') {
			inputProps.spellCheck = false;
		}

		delete restProps.active;
		delete restProps.announce;
		delete restProps.caretToEndOnFocus;
		delete restProps.dismissOnEnter;
		delete restProps.invalid;
		delete restProps.invalidMessage;
		delete restProps.onBeforeChange;
		delete restProps.rtl;
		delete restProps.size;
		restProps.disabled = disabled;

		return (
			<div
				{...restProps}
				aria-disabled={disabled}
			>
				<div className={css!.bg} />
				<InputFieldDecoratorIcon className={css!.iconBefore} position="before" size="large">{iconBefore}</InputFieldDecoratorIcon>
				<span className={css!.inputHighlight}>{value ? value : placeholder}</span>
				<span className={css!.inputWrapper}>
					<input
						{...inputProps}
						{...voiceProps}
						aria-hidden={isPasswordtel}
						className={classnames(css!.input, {[css!.passwordtel]: isPasswordtel})}
						dir={dir}
						disabled={disabled}
						onChange={onChange}
						placeholder={placeholder}
						tabIndex={-1}
						type={isPasswordtel ? 'tel' : type}
						value={value}
					/>
					{marqueeContent ? (
						<MarqueeText
							className={classnames(css!.marqueeText, {
								[css!.passwordtel]: isPasswordtel || type === 'password',
								[css!.placeholderText]: value === ''
							})}
							disabled={disabled}
						>
							{value !== '' ? value : placeholder}
						</MarqueeText>
					) : null}
				</span>

				<InputFieldDecoratorIcon className={css!.iconAfter} position="after" size="large">{iconAfter}</InputFieldDecoratorIcon>
				{invalidTooltip}
			</div>
		);
	}
});

// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
const AnnounceDecorator = (Wrapped: ComponentType<any>) => function AnnounceDecorator (props: Record<string, any>) {
	const {announce, children} = useAnnounce();

	return (
		<Fragment>
			<Wrapped {...props} announce={announce} />
			{children}
		</Fragment>
	);
};

/**
 * Limestone specific item behaviors to apply to {@link limestone/Input.InputFieldBase|InputField}.
 *
 * @class InputFieldDecorator
 * @hoc
 * @memberof limestone/Input
 * @mixes ui/Changeable.Changeable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const InputFieldDecorator = compose(
	Pure,
	I18nContextDecorator({rtlProp: 'rtl'}),
	Changeable,
	InputFieldSpotlightDecorator,
	AnnounceDecorator,
	MarqueeController({marqueeOnFocus: true}),
	Skinnable
);

/**
 * A Spottable, Limestone styled input component with embedded icon support.
 *
 * By default, `InputField` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class InputField
 * @memberof limestone/Input
 * @extends limestone/Input.InputFieldBase
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @mixes limestone/Skinnable.Skinnable
 * @ui
 * @public
 */
const InputField = InputFieldDecorator(InputFieldBase) as ComponentType<InputFieldBaseProps & {defaultValue?: string | number; autoFocus?: boolean; onActivate?: (...args: any[]) => any; onDeactivate?: (...args: any[]) => any; onSpotlightDisappear?: (...args: any[]) => any; spotlightDisabled?: boolean}>;

/**
 * Focuses the internal input when the component gains 5-way focus.
 *
 * By default, the internal input is not editable when the component is focused via 5-way and must
 * be selected to become interactive. In pointer mode, the input will be editable when clicked.
 *
 * @name autoFocus
 * @memberof limestone/Input.InputField.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Applies a disabled style and prevents interacting with the component.
 *
 * @name disabled
 * @memberof limestone/Input.InputField.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Sets the initial value.
 *
 * @name defaultValue
 * @memberof limestone/Input.InputField.prototype
 * @type {String}
 * @public
 */

/**
 * Blurs the input when the "enter" key is pressed.
 *
 * @name dismissOnEnter
 * @memberof limestone/Input.InputField.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when the internal input is focused.
 *
 * @name onActivate
 * @memberof limestone/Input.InputField.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the internal input loses focus.
 *
 * @name onDeactivate
 * @memberof limestone/Input.InputField.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the component is removed when it had focus.
 *
 * @name onSpotlightDisappear
 * @memberof limestone/Input.InputField.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Disables spotlight navigation into the component.
 *
 * @name spotlightDisabled
 * @memberof limestone/Input.InputField.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

export default InputField;
export {
	InputField,
	InputFieldBase,
	InputFieldDecorator
};
