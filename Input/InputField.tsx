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

const MarqueeText: any = MarqueeDecorator({css: {
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
		active: PropTypes.bool,
		announce: PropTypes.func,
		caretToEndOnFocus: PropTypes.bool,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		'data-webos-voice-group-label': PropTypes.string,
		'data-webos-voice-intent': PropTypes.string,
		'data-webos-voice-label': PropTypes.string,
		disabled: PropTypes.bool,
		dismissOnEnter: PropTypes.bool,
		iconAfter: PropTypes.string,
		iconBefore: PropTypes.string,
		invalid: PropTypes.bool,
		invalidMessage: PropTypes.string,
		marqueeContent: PropTypes.bool,
		onBeforeChange: PropTypes.func,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		onClick: PropTypes.func,
		onFocus: PropTypes.func,
		onKeyDown: PropTypes.func,
		placeholder: PropTypes.string,
		rtl: PropTypes.bool,
		size: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,
		type: PropTypes.string,
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

		return (
			<div
				{...restProps}
				aria-disabled={disabled}
				{...({disabled} as any)}
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

export default InputField;
export {
	InputField,
	InputFieldBase,
	InputFieldDecorator
};
