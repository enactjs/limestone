import Input, {InputBase, InputPopup, InputPopupBase} from '@enact/limestone/Input';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range, select, text} from '@enact/storybook-utils/addons/controls';

Input.displayName = 'Input';
const Config = mergeComponentMetadata('Input', InputPopupBase, InputBase, Input);
const ConfigPopup = mergeComponentMetadata('InputPopup', InputPopupBase, InputPopup);
const ConfigNumberPopup = mergeComponentMetadata('InputNumberTypePopup', InputPopupBase, InputPopup);

const prop = {
	numericKind: ['auto', 'joined', 'separated', 'field'],
	popupType: ['fullscreen', 'overlay'],
	size: ['small', 'large'],
	type: ['text', 'password', 'number', 'passwordnumber', 'url', 'tel', 'passwordtel'],
	backButtonAriaLabel: [null, 'Back']
};

export default {
	title: 'Limestone/Input',
	component: 'Input'
};

export const _Input = (args) => {
	const actions = {
		onBeforeChange: action('onBeforeChange'),
		onChange: action('onChange'),
		onClose: action('onClose'),
		onComplete: action('onComplete'),
		onOpenPopup: action('onOpenPopup')
	};

	const controls = {
		type: args['type'],
		popupType: args['popupType'],
		size: args['size'],
		invalid: args['invalid'],
		invalidMessage: args['invalidMessage'],
		placeholder: args['placeholder'],
		subtitle: args['subtitle'],
		title: args['title'],
		disabled: args['disabled'],
		'aria-label': args['aria-label'],
		popupAriaLabel: args['popupAriaLabel'],
		marqueeInputField: args['marqueeInputField'],
		noBackButton: args['noBackButton'],
		noSubmitButton: args['noSubmitButton'],
		backButtonAriaLabel: args['backButtonAriaLabel']
	};

	// Numeric specific props
	if (controls.type === 'number' || controls.type === 'passwordnumber') {
		controls.numberInputField = args['numberInputField'];

		const minMax = args['customize min/max'];
		if (minMax) {
			controls.maxLength = args['maxLength'];
			controls.minLength = args['minLength'];
		} else {
			controls.length = args['length'];
		}
	}

	// Modify a11y null strings
	if (!controls['aria-label']) {
		delete controls['aria-label'];
	} else if (!controls.popupAriaLabel) {
		delete controls.popupAriaLabel;
	}

	return (
		<div>
			<Input {...actions} {...controls} />
		</div>
	);
};

select('type', _Input, prop.type, ConfigPopup);
select('popupType', _Input, prop.popupType, ConfigPopup);
boolean('invalid', _Input, ConfigPopup);
text('invalidMessage', _Input, ConfigPopup, 'This is a bad value');
text('subtitle', _Input, ConfigPopup, 'Title Below Text');
text('title', _Input, ConfigPopup, 'Title Text');
text('aria-label', _Input, ConfigPopup, '');
text('popupAriaLabel', _Input, ConfigPopup, '');
boolean('marqueeInputField', _Input, ConfigPopup);
boolean('noBackButton', _Input, ConfigPopup);
boolean('noSubmitButton', _Input, ConfigPopup);
select('backButtonAriaLabel', _Input, prop.backButtonAriaLabel, ConfigPopup);
select('numberInputField', _Input, prop.numericKind, ConfigNumberPopup);
boolean('customize min/max', _Input, ConfigNumberPopup, false);
range('maxLength', _Input, ConfigNumberPopup, {min: 0, max: 20}, 4, {if: {arg:'customize min/max', truthy: true}});
range('minLength', _Input, ConfigNumberPopup, {min: 0, max: 20}, 0, {if: {arg:'customize min/max', truthy: true}});
range('length', _Input, ConfigNumberPopup, {min: 1, max: 20}, 4, {if: {arg:'customize min/max', truthy: false}});
select('size', _Input, prop.size, Config);
text('placeholder', _Input, Config, 'placeholder string');
boolean('disabled', _Input, Config);

_Input.storyName = 'Input';
_Input.parameters = {
	info: {
		text: 'Basic usage of Input'
	}
};
