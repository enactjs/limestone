import Spotlight from '@enact/spotlight';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {InputField} from '../';

const isPaused = () => Spotlight.isPaused() ? 'paused' : 'not paused';

describe('InputField Specs', () => {
	test('should have an input element', () => {
		render(<InputField />);
		const inputField = screen.getByLabelText('Input field');

		expect(inputField).toBeInTheDocument();
	});

	test('should include a placeholder if specified', () => {
		render(<InputField placeholder="hello" />);
		const inputField = screen.getByLabelText('hello Input field');

		const expected = 'hello';
		const actual = inputField.textContent;

		expect(actual).toContain(expected);
	});

	test('should callback onChange with `onChange` type when the text changes', async () => {
		const handleChange = jest.fn();
		const value = 'blah';
		const user = userEvent.setup();
		render(<InputField onChange={handleChange} />);
		const inputField = screen.getByPlaceholderText('');

		await user.type(inputField, value);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(handleChange).toHaveBeenCalled();
		expect(actual).toMatchObject(expected);
	});

	test('should forward an event with a stopPropagation method from onChange handler', () => {
		const handleChange = jest.fn();
		const value = 'blah';
		const evt = {
			target: {value},
			stopPropagation: jest.fn()
		};

		render(<InputField onChange={handleChange} />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.change(inputField, evt);

		const actual = typeof handleChange.mock.calls[0][0].stopPropagation === 'function';

		expect(actual).toBeTruthy();
	});

	test('should not bubble the native event when stopPropagation from onChange is called', async () => {
		const handleChange = jest.fn();
		const value = 'smt';
		function stop (ev) {
			ev.stopPropagation();
		}
		const user = userEvent.setup();

		render(
			<div onChange={handleChange}>
				<InputField onChange={stop} />
			</div>
		);
		const inputField = screen.getByPlaceholderText('');

		await user.type(inputField, value);

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should callback onBeforeChange with `onBeforeChange` type before the text changes', async () => {
		const handleBeforeChange = jest.fn();
		const value = 'blah';
		const user = userEvent.setup();
		render(<InputField onBeforeChange={handleBeforeChange} />);
		const inputField = screen.getByPlaceholderText('');

		await user.type(inputField, value);

		const expected = {type: 'onBeforeChange'};
		const actual = handleBeforeChange.mock.calls.length && handleBeforeChange.mock.calls[0][0];

		expect(handleBeforeChange).toHaveBeenCalled();
		expect(actual).toMatchObject(expected);
	});

	test('should prevent onChange if onBeforeChange prevents', async () => {
		const handleBeforeChange = jest.fn(ev => ev.preventDefault());
		const handleChange = jest.fn();
		const value = 'blah';
		const user = userEvent.setup();
		render(<InputField onBeforeChange={handleBeforeChange} onChange={handleChange} />);
		const inputField = screen.getByPlaceholderText('');

		await user.type(inputField, value);

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should blur input on enter if dismissOnEnter', () => {
		const handleChange = jest.fn();

		render(<InputField onBlur={handleChange} dismissOnEnter />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.mouseDown(inputField);
		fireEvent.keyUp(inputField, {which: 13, keyCode: 13, code: 13});

		expect(handleChange).toHaveBeenCalled();
	});

	test('should activate input on enter', () => {
		const handleChange = jest.fn();

		render(<InputField onActivate={handleChange} />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.keyDown(inputField, {which: 13, keyCode: 13, code: 13});
		fireEvent.keyUp(inputField, {which: 13, keyCode: 13, code: 13});


		expect(handleChange).toHaveBeenCalled();
	});

	test('should not activate input on enter when disabled', () => {
		const handleChange = jest.fn();

		render(<InputField disabled onActivate={handleChange} />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.keyDown(inputField, {which: 13, keyCode: 13, code: 13});
		fireEvent.keyUp(inputField, {which: 13, keyCode: 13, code: 13});


		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should be able to be disabled', () => {
		render(<InputField disabled />);

		const actual = screen.getByLabelText('Input field');
		const expected = 'disabled';

		expect(actual).toHaveAttribute(expected);
	});

	test('should reflect the value if specified', () => {
		render(<InputField value="hello" />);

		const inputField = screen.getByLabelText('hello Input field');
		const actual = inputField.textContent;
		const expected = 'hello';

		expect(actual).toContain(expected);
	});

	test('should have dir equal to rtl when there is rtl text', () => {
		render(<InputField value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />);
		const inputField = screen.getByPlaceholderText('');

		const expectedAttribute = 'dir';
		const expectedValue = 'rtl';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should have dir equal to ltr when there is ltr text', () => {
		render(<InputField value="content" />);
		const inputField = screen.getByPlaceholderText('');

		const expectedAttribute = 'dir';
		const expectedValue = 'ltr';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should have dir equal to rtl when there is rtl text in the placeholder', () => {
		render(<InputField placeholder="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />);
		const inputField = screen.getByPlaceholderText('שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי');

		const expectedAttribute = 'dir';
		const expectedValue = 'rtl';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should have dir equal to ltr when there is ltr text in the placeholder', () => {
		render(<InputField placeholder="content" />);
		const inputField = screen.getByPlaceholderText('content');

		const expectedAttribute = 'dir';
		const expectedValue = 'ltr';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should have dir equal to rtl when there is ltr text in the placeholder, but rtl text in value', () => {
		render(
			<InputField
				placeholder="content"
				value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי"
			/>
		);
		const inputField = screen.getByPlaceholderText('content');

		const expectedAttribute = 'dir';
		const expectedValue = 'rtl';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should have dir equal to ltr when there is rtl text in the placeholder, but ltr text in value', () => {
		const placeholder = 'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי';
		render(
			<InputField
				placeholder={placeholder}
				value="content"
			/>
		);
		const inputField = screen.getByPlaceholderText(placeholder);

		const expectedAttribute = 'dir';
		const expectedValue = 'ltr';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should pause spotlight when input has focus', () => {
		render(<InputField />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.mouseDown(inputField);

		const expected = 'paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).toBe(expected);
	});

	test('should resume spotlight on unmount', () => {
		const {unmount} = render(<InputField />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.mouseDown(inputField);

		unmount();

		const expected = 'not paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).toBe(expected);
	});

	test('should display invalid message if it invalid and invalid message exists', () => {
		render(<InputField invalid invalidMessage="invalid message" />);
		const invalidText = screen.getByText('invalid message').parentElement.parentElement.parentElement;

		const expected = 'tooltipLabel';

		expect(invalidText).toBeInTheDocument();
		expect(invalidText).toHaveClass(expected);
	});

	test('should not display invalid message if it is valid', () => {
		render(<InputField invalidMessage="invalid message" />);

		const actual = screen.queryByText('invalid message');

		expect(actual).toBeNull();
	});

	test('should set voice intent if specified', () => {
		render(<InputField data-webos-voice-intent="Select" />);
		const inputField = screen.getByPlaceholderText('');

		const expectedAttribute = 'data-webos-voice-intent';
		const expectedValue = 'Select';

		expect(inputField).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should set voice label if specified', () => {
		const customLabel = 'input label';
		render(<InputField data-webos-voice-label={customLabel} />);
		const inputField = screen.getByPlaceholderText('');

		const expectedAttribute = 'data-webos-voice-label';

		expect(inputField).toHaveAttribute(expectedAttribute, customLabel);
	});

	test('should callback onKeyDown with `keydown` type when key is pressed', async () => {
		const handleKeyDown = jest.fn();
		render(<InputField onKeyDown={handleKeyDown} />);
		const inputField = screen.getByPlaceholderText('');

		fireEvent.mouseDown(inputField);
		fireEvent.keyDown(inputField, {which: 37, keyCode: 37, code: 37});

		const {key} = handleKeyDown.mock.calls[0][0];
		const expected = {type: 'keydown'};
		const actual = handleKeyDown.mock.calls.length && handleKeyDown.mock.calls[0][0];

		expect(handleKeyDown).toHaveBeenCalled();
		expect(key).toBe('ArrowLeft');
		expect(actual).toMatchObject(expected);
	});

	describe('marqueeContent', () => {
		test('should not render a marquee node by default', () => {
			const {baseElement} = render(<InputField value="hello" />);
			const marqueeText = baseElement.querySelector('.marqueeText');

			expect(marqueeText).toBeNull();
		});

		test('should render a marquee node when marqueeContent is true', () => {
			const {baseElement} = render(<InputField marqueeContent value="hello" />);
			const marqueeText = baseElement.querySelector('.marqueeText');

			expect(marqueeText).not.toBeNull();
			expect(marqueeText.querySelector('.marquee')).not.toBeNull();
		});
	});

	describe('moveCaretToEnd', () => {
		test('should move caret to end of value on mouse focus when caretToEndOnFocus is true', () => {
			jest.useFakeTimers();
			const value = 'hello';
			render(<InputField caretToEndOnFocus value={value} />);
			const inputField = screen.getByPlaceholderText('');
			const setSelectionRange = jest.spyOn(inputField, 'setSelectionRange');

			fireEvent.mouseDown(inputField);
			act(() => jest.runOnlyPendingTimers());

			expect(setSelectionRange).toHaveBeenCalledWith(value.length, value.length);

			jest.useRealTimers();
		});

		test('should set scrollLeft to scrollWidth for LTR input when caretToEndOnFocus is true', () => {
			jest.useFakeTimers();
			const value = 'hello';
			render(<InputField caretToEndOnFocus value={value} />);
			const inputField = screen.getByPlaceholderText('');

			let scrollLeft = 0;
			Object.defineProperty(inputField, 'scrollLeft', {
				get: () => scrollLeft,
				set: (v) => {
					scrollLeft = v;
				},
				configurable: true
			});
			Object.defineProperty(inputField, 'scrollWidth', {get: () => 200, configurable: true});

			fireEvent.mouseDown(inputField);
			act(() => jest.runOnlyPendingTimers());

			expect(scrollLeft).toBe(200);

			jest.useRealTimers();
		});

		test('should set scrollLeft to 0 for RTL input when caretToEndOnFocus is true', () => {
			jest.useFakeTimers();
			const rtlValue = 'שועל החום הזריז';
			render(<InputField caretToEndOnFocus value={rtlValue} />);
			const inputField = screen.getByPlaceholderText('');

			let scrollLeft = 999;
			Object.defineProperty(inputField, 'scrollLeft', {
				get: () => scrollLeft,
				set: (v) => {
					scrollLeft = v;
				},
				configurable: true
			});
			Object.defineProperty(inputField, 'scrollWidth', {get: () => 200, configurable: true});

			fireEvent.mouseDown(inputField);
			act(() => jest.runOnlyPendingTimers());

			expect(scrollLeft).toBe(0);

			jest.useRealTimers();
		});

		test('should not move caret when caretToEndOnFocus is not set', () => {
			jest.useFakeTimers();
			render(<InputField value="hello" />);
			const inputField = screen.getByPlaceholderText('');
			const setSelectionRange = jest.spyOn(inputField, 'setSelectionRange');

			fireEvent.mouseDown(inputField);
			act(() => jest.runOnlyPendingTimers());

			expect(setSelectionRange).not.toHaveBeenCalled();

			jest.useRealTimers();
		});
	});

	describe('decorator icons', () => {
		test('should render iconBefore and iconAfter with data-input-icon attribute', () => {
			render(<InputField iconBefore="plus" iconAfter="minus" />);

			const icons = document.querySelectorAll('[data-input-icon]');

			expect(icons).toHaveLength(2);
		});

		test('should not activate the input when iconBefore is clicked', () => {
			render(<InputField iconBefore="plus" value="hello" />);

			const inputField = screen.getByPlaceholderText('');
			const icon = document.querySelector('[data-input-icon]');
			const focusSpy = jest.spyOn(inputField, 'focus');

			fireEvent.mouseDown(icon);

			expect(focusSpy).not.toHaveBeenCalled();
		});

		test('should not activate the input when iconAfter is clicked', () => {
			render(<InputField iconAfter="minus" value="hello" />);

			const inputField = screen.getByPlaceholderText('');
			const icon = document.querySelector('[data-input-icon]');
			const focusSpy = jest.spyOn(inputField, 'focus');

			fireEvent.mouseDown(icon);

			expect(focusSpy).not.toHaveBeenCalled();
		});
	});

	describe('5-way keys while the input is active', () => {
		afterEach(() => {
			jest.restoreAllMocks();
			Spotlight.resume();
		});

		const activate = (props) => {
			render(<InputField {...props} />);
			const input = screen.getByPlaceholderText('');
			fireEvent.mouseDown(input);

			return input;
		};

		test('should leave and deactivate the input when focus moves away with 5-way', () => {
			const handleDeactivate = jest.fn();
			const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);
			const input = activate({onDeactivate: handleDeactivate});

			fireEvent.keyDown(input, {keyCode: 40});

			expect(moveSpy).toHaveBeenCalledWith('down');
			expect(handleDeactivate).toHaveBeenCalled();
		});

		test('should deactivate the input but keep focus on the field when there is nowhere to move', () => {
			const handleDeactivate = jest.fn();
			jest.spyOn(Spotlight, 'move').mockReturnValue(false);
			const input = activate({onDeactivate: handleDeactivate});

			fireEvent.keyDown(input, {keyCode: 38});

			expect(handleDeactivate).toHaveBeenCalled();
			expect(input.closest('.spottable')).toHaveFocus();
		});

		test('should keep moving the caret with left when it is not at the start of the text', () => {
			const moveSpy = jest.spyOn(Spotlight, 'move');
			const input = activate({value: 'abc'});
			input.setSelectionRange(1, 1);

			fireEvent.keyDown(input, {keyCode: 37});

			expect(moveSpy).not.toHaveBeenCalled();
		});

		test('should move focus with left when the caret is at the start of the text', () => {
			const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);
			const input = activate({value: 'abc'});
			input.setSelectionRange(0, 0);

			fireEvent.keyDown(input, {keyCode: 37});

			expect(moveSpy).toHaveBeenCalledWith('left');
		});

		test('should move focus with left in a number field regardless of the caret', () => {
			const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);
			const input = activate({type: 'number', value: '123'});

			fireEvent.keyDown(input, {keyCode: 37});

			expect(moveSpy).toHaveBeenCalledWith('left');
		});

		test('should not let up and down change the value of a number field', () => {
			jest.spyOn(Spotlight, 'move').mockReturnValue(true);
			const input = activate({type: 'number', value: '5'});

			const notPrevented = fireEvent.keyDown(input, {keyCode: 38});

			expect(notPrevented).toBe(false);
		});

		test('should fire `onSpotlightDisappear` when unmounted while the input is active', () => {
			const handleSpotlightDisappear = jest.fn();
			const {unmount} = render(<InputField onSpotlightDisappear={handleSpotlightDisappear} />);
			fireEvent.mouseDown(screen.getByPlaceholderText(''));

			unmount();

			expect(handleSpotlightDisappear).toHaveBeenCalled();
		});

		test('should not fire `onSpotlightDisappear` when unmounted while the input is not active', () => {
			const handleSpotlightDisappear = jest.fn();
			const {unmount} = render(<InputField onSpotlightDisappear={handleSpotlightDisappear} />);

			unmount();

			expect(handleSpotlightDisappear).not.toHaveBeenCalled();
		});
	});

	describe('autoFocus', () => {
		afterEach(() => {
			Spotlight.resume();
		});

		test('should activate the input as soon as the field gets focus', () => {
			const handleActivate = jest.fn();
			render(<InputField autoFocus onActivate={handleActivate} />);
			const field = screen.getByPlaceholderText('').closest('.spottable');

			fireEvent.focus(field);

			expect(handleActivate).toHaveBeenCalled();
			expect(screen.getByPlaceholderText('')).toHaveFocus();
		});

		test('should deactivate and forward `onBlur` when the active input loses focus to another element', () => {
			const handleBlur = jest.fn();
			const handleDeactivate = jest.fn();
			render(<InputField autoFocus onBlur={handleBlur} onDeactivate={handleDeactivate} />);
			const input = screen.getByPlaceholderText('');
			fireEvent.focus(input.closest('.spottable'));

			fireEvent.blur(input, {relatedTarget: document.body});

			expect(handleDeactivate).toHaveBeenCalled();
			expect(handleBlur).toHaveBeenCalled();
		});
	});

	describe('blurring the active input', () => {
		afterEach(() => {
			jest.restoreAllMocks();
			Spotlight.resume();
		});

		test('should deactivate and forward `onBlur` when the input loses focus in pointer mode', () => {
			const handleBlur = jest.fn();
			const handleDeactivate = jest.fn();
			jest.spyOn(Spotlight, 'getPointerMode').mockReturnValue(true);
			render(<InputField onBlur={handleBlur} onDeactivate={handleDeactivate} />);
			const input = screen.getByPlaceholderText('');
			fireEvent.mouseDown(input);

			fireEvent.blur(input);

			expect(handleDeactivate).toHaveBeenCalled();
			expect(handleBlur).toHaveBeenCalled();
		});

		test('should not forward `onBlur` when the input loses focus outside pointer mode', () => {
			const handleBlur = jest.fn();
			jest.spyOn(Spotlight, 'getPointerMode').mockReturnValue(false);
			render(<InputField onBlur={handleBlur} />);
			const input = screen.getByPlaceholderText('');
			fireEvent.mouseDown(input);

			fireEvent.blur(input);

			expect(handleBlur).not.toHaveBeenCalled();
		});

		test('should not forward `onBlur` when an autoFocus input blurs to its own field', () => {
			const handleBlur = jest.fn();
			render(<InputField autoFocus onBlur={handleBlur} />);
			const input = screen.getByPlaceholderText('');
			const field = input.closest('.spottable');
			fireEvent.focus(field);

			fireEvent.blur(input, {relatedTarget: field});

			expect(handleBlur).not.toHaveBeenCalled();
		});
	});

});
