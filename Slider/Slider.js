/**
 * Provides Limestone-themed slider components and behaviors.
 *
 * @example
 * <Slider
 *   defaultValue={-30}
 *   max={100}
 *   min={-100}
 *   ticks={5}
 *   alignStepsWithTicks
 *   labels={['Low', 'Medium', 'High', 'Very High', 'Max']}
 *   tooltip
 * />
 *
 * @module limestone/Slider
 * @exports Slider
 * @exports SliderBase
 * @exports SliderDecorator
 * @exports SliderTooltip
 */

import {forKey, forProp, forward, forwardWithPrevent, handle, not} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import {usePublicClassNames} from '@enact/core/usePublicClassNames';
import Accelerator from '@enact/spotlight/Accelerator';
import Spottable from '@enact/spotlight/Spottable';
import Changeable from '@enact/ui/Changeable';
import ComponentOverride from '@enact/ui/ComponentOverride';
import ProgressBar from '@enact/ui/ProgressBar';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import UiSlider from '@enact/ui/Slider';
import Touchable from '@enact/ui/Touchable';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import {useEffect, useLayoutEffect, useMemo, useRef} from 'react';

import {ProgressBarTooltip} from '../ProgressBar';
import Skinnable from '../Skinnable';
import {validateSteppedOnce, warning} from '../internal/validators';

import SliderBehaviorDecorator from './SliderBehaviorDecorator';
import {
	getTickAlignedStep,
	getTickConfig,
	handleDecrement,
	handleDecrementByWheel,
	handleIncrement,
	handleIncrementByWheel,
	hueGradient
} from './utils';
import {SliderExtras} from './Ticks';

import componentCss from './Slider.module.less';

const sliderDefaultProps = {
	activateOnSelect: false,
	active: false,
	alignStepsWithTicks: false,
	automaticLabels: false,
	colorPicker: false,
	disabled: false,
	keyFrequency: [1],
	max: 100,
	min: 0,
	orientation: 'horizontal',
	pressed: false,
	step: 1,
	wheelInterval: 0
};

/**
 * Range-selection input component.
 *
 * @class SliderBase
 * @extends ui/Slider.SliderBase
 * @omit progressBarComponent
 * @memberof limestone/Slider
 * @ui
 * @public
 */
const SliderBase = (props) => {
	const sliderProps = setDefaultProps(props, sliderDefaultProps);
	checkPropTypes(SliderBase, sliderProps);

	const {
		active,
		alignStepsWithTicks,
		automaticLabels,
		className,
		colorPicker,
		css,
		disabled,
		focused,
		keyFrequency,
		labels,
		max,
		min,
		pressed,
		showAnchor,
		showMinMax,
		ticks,
		...rest
	} = sliderProps;

	validateSteppedOnce(p => p.knobStep, {
		component: 'Slider',
		stepName: 'knobStep',
		valueName: 'max'
	})(sliderProps);

	const providedStep = validateSteppedOnce(p => p.step, {
		component: 'Slider',
		valueName: 'max'
	})(sliderProps);

	const tickConfig = getTickConfig(ticks, labels, {
		alignStepsWithTicks,
		automaticLabels,
		max,
		min,
		step: providedStep
	});

	if (alignStepsWithTicks && !colorPicker && tickConfig.count < 3) {
		warning(true, 'Slider alignStepsWithTicks requires ticks or at least 3 labels.');
	}

	if (automaticLabels && !colorPicker && tickConfig.count < 3) {
		warning(true, 'Slider automaticLabels requires ticks.');
	}

	const alignedStep = !colorPicker && alignStepsWithTicks ?
		getTickAlignedStep(min, max, tickConfig.count) :
		null;
	const step = alignedStep == null ? providedStep : alignedStep;
	const handlerProps = alignedStep == null ? sliderProps : {...sliderProps, knobStep: null, step};

	const tooltip = sliderProps.tooltip === true ? ProgressBarTooltip : sliderProps.tooltip;

	const context = useMemo(() => ({lastWheelTimeStamp: 0}), []);

	const spotlightAccelerator = useRef();
	const ref = useRef();

	const handlers = useHandlers({
		onBlur: handle(
			forward('onBlur'),
			forProp('active', true),
			forward('onActivate')
		),

		onKeyDown: handle(
			forProp('disabled', false),
			forwardWithPrevent('onKeyDown'),
			anyPass([
				handleIncrement,
				handleDecrement
			])
		),

		onKeyUp: handle(
			forProp('disabled', false),
			forwardWithPrevent('onKeyUp'),
			forProp('activateOnSelect', true),
			forKey('enter'),
			forward('onActivate')
		)
	}, handlerProps, spotlightAccelerator);

	const nativeEventHandlers = useHandlers({
		onWheel: handle(
			forProp('disabled', false),
			not(forProp('noWheel', true)),
			forwardWithPrevent('onWheel'),
			anyPass([
				handleIncrementByWheel,
				handleDecrementByWheel
			])
		)
	}, handlerProps, context);

	// if the props includes a css map, merge them together
	let mergedCss = usePublicClassNames({componentCss, customCss: css, publicClassNames: true});

	const hasTicks = !colorPicker && tickConfig.count >= 3;
	const isVertical = rest.orientation === 'vertical';
	const hasTickLabels = hasTicks && !isVertical && tickConfig.tickLabels != null;
	const hasCustomSideLabels = !colorPicker && (tickConfig.startLabel != null || tickConfig.endLabel != null);
	const hasInlineMinMax = hasTicks && Boolean(showMinMax) && !hasTickLabels && !hasCustomSideLabels;
	const hasSideLabels = hasCustomSideLabels || hasInlineMinMax;
	const displayMinMax = Boolean(showMinMax) && !hasTickLabels && !hasSideLabels;

	const componentClassName = classnames(
		componentCss.slider,
		className,
		{
			[mergedCss.active]: active,
			[mergedCss.colorPicker]: colorPicker,
			[mergedCss.hasMinMax]: displayMinMax,
			[mergedCss.hasSideLabels]: hasSideLabels,
			[mergedCss.hasTickLabels]: hasTickLabels,
			[mergedCss.hasTicks]: hasTicks,
			[mergedCss.pressed]: pressed,
			[mergedCss.showAnchor]: showAnchor
		},
		css && css.slider
	);

	useEffect(() => {
		spotlightAccelerator.current = new Accelerator(keyFrequency);
	}, [keyFrequency]);

	useLayoutEffect(() => {
		const sliderRef = ref.current;

		if (sliderRef) {
			sliderRef.addEventListener('wheel', nativeEventHandlers.onWheel, {passive: false});
		}
		return () => {
			if (sliderRef) {
				sliderRef.removeEventListener('wheel', nativeEventHandlers.onWheel, {passive: false});
			}
		};

	}, [ref, nativeEventHandlers.onWheel]);

	delete rest.activateOnSelect;
	delete rest.knobStep;
	delete rest.noWheel;
	delete rest.onActivate;
	delete rest.step;
	delete rest.tooltip;
	delete rest.wheelInterval;

	const sliderMax = colorPicker ? 360 : max;
	const sliderMin = colorPicker ? 0 : min;
	const sliderStep = colorPicker ? 1 : step;

	const styleObject = {
		'--semantic-color-surface-default-handle': `hsla(${rest.value ? rest.value : 0}, 100%, 50%, 1)`,
		'--semantic-color-surface-default-focused': `hsla(${rest.value ? rest.value : 0}, 100%, 50%, 1)`
	};

	return (
		<UiSlider
			{...rest}
			{...handlers}
			aria-disabled={disabled}
			colorPicker={colorPicker}
			className={componentClassName}
			css={mergedCss}
			disabled={disabled}
			max={sliderMax}
			min={sliderMin}
			progressBarComponent={
				<ProgressBar css={mergedCss} style={{backgroundImage: colorPicker && hueGradient(rest.orientation)}} />
			}
			ref={ref}
			step={sliderStep}
			style={colorPicker && styleObject}
			tooltipComponent={
				<ComponentOverride
					component={tooltip}
					css={mergedCss}
					visible={focused}
				/>
			}
			minMaxComponent={hasTicks || hasSideLabels || displayMinMax ?
				<SliderExtras
					className={mergedCss.minMax}
					count={hasTicks ? tickConfig.count : 0}
					css={mergedCss}
					endLabel={hasCustomSideLabels ? tickConfig.endLabel : (hasInlineMinMax ? sliderMax : null)}
					focused={focused}
					labels={hasTickLabels ? tickConfig.tickLabels : null}
					max={sliderMax}
					min={sliderMin}
					orientation={rest.orientation}
					showMinMax={displayMinMax}
					startLabel={hasCustomSideLabels ? tickConfig.startLabel : (hasInlineMinMax ? sliderMin : null)}
				/> : null
			}
		/>
	);
};

SliderBase.displayName = 'Slider';

SliderBase.propTypes = /** @lends limestone/Slider.SliderBase.prototype */ {
	/**
	 * Activates the component when selected so that it may be manipulated via the directional
	 * input keys.
	 *
	 * @type {Boolean}
	 * @public
	 */
	activateOnSelect: PropTypes.bool,

	/**
	 * Sets the knob to selected state and allows it to move via 5-way controls.
	 *
	 * @type {Boolean}
	 * @public
	 */
	active: PropTypes.bool,

	/**
	 * Ignores `step` and snaps the knob to each tick mark.
	 *
	 * The increment becomes `(max - min) / (tickCount - 1)`. Requires `ticks` or at least three
	 * `labels`.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	alignStepsWithTicks: PropTypes.bool,

	/**
	 * Generates a numeric label for each tick from `min`, `max`, and the tick count.
	 *
	 * Shown on horizontal sliders only. When set, {@link limestone/Slider.SliderBase.labels|labels}
	 * is ignored. When `false` or unset, `labels` is used as provided.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	automaticLabels: PropTypes.bool,

	/**
	 * Indicates if this component will be used as a colorPicker.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	colorPicker: PropTypes.bool,

	/**
	 * Customizes the component by mapping the supplied collection of CSS class names to the
	 * corresponding internal elements and states of this component.
	 *
	 * The following classes are supported:
	 *
	 * * `slider` - The root component class
	 * * `ticks` - The tick marks container
	 * * `tickLabel` - A label displayed with a tick mark
	 *
	 * @type {Object}
	 * @public
	 */
	css: PropTypes.object,

	/**
	 * Disables component and does not generate events.
	 *
	 * @type {Boolean}
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * Indicates that the slider has gained focus and if the tooltip is present, it will be
	 * shown.
	 *
	 * @type {Boolean}
	 * @public
	 */
	focused: PropTypes.bool,

	/**
	 * Controls the keydown frequency with which the acceleration will "freeze".
	 * While frozen, the value of the slider is not changed via arrow key.
	 *
	 * To customize the key acceleration speed, pass an array for {@link spotlight/Accelerator.Accelerator|frequency}.
	 * Each number represents a number of an event for sampling.
	 * For example, 1 means to process all events while 3 means to process one of the three events.
	 * If the number is large, the slider value changes slowly.
	 * Example for accelerating:
	 * ```
	 * keyFrequency={[3, 3, 3, 2, 2, 2, 1]}
	 * ```
	 *
	 * @type {Number[]}
	 * @default [1]
	 * @public
	 */
	keyFrequency: PropTypes.arrayOf(PropTypes.number),

	/**
	 * The amount to increment or decrement the position of the knob via 5-way controls.
	 *
	 * It must evenly divide into the range designated by `min` and `max`. If not specified,
	 * `step` is used for the default value. Ignored when
	 * {@link limestone/Slider.SliderBase.alignStepsWithTicks|alignStepsWithTicks} is set.
	 *
	 * @type {Number}
	 * @public
	 */
	knobStep: PropTypes.number,

	/**
	 * Labels displayed with the slider.
	 *
	 * When two labels are provided, they are shown at the start and end of the track.
	 * When three or more labels are provided, each label is shown beneath its corresponding
	 * tick mark on a horizontal slider. Tick labels are not shown when `orientation` is
	 * `vertical`. If `ticks` is not set, tick marks are created to match the number of labels.
	 *
	 * Ignored when {@link limestone/Slider.SliderBase.automaticLabels|automaticLabels} is set.
	 *
	 * Labels are displayed on a single line. Overflowing text is marqueed.
	 *
	 * @type {Array<Node>}
	 * @public
	 */
	labels: PropTypes.arrayOf(PropTypes.node),

	/**
	 * The maximum value of the slider.
	 *
	 * The range between `min` and `max` should be evenly divisible by
	 * {@link limestone/Slider.SliderBase.step|step}.
	 *
	 * @type {Number}
	 * @default 100
	 * @public
	 */
	max: PropTypes.number,

	/**
	 * The minimum value of the slider.
	 *
	 * The range between `min` and `max` should be evenly divisible by
	 * {@link limestone/Slider.SliderBase.step|step}.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	min: PropTypes.number,

	/**
	 * Disable wheel event.
	 *
	 * @type {Boolean}
	 * @public
	 */
	noWheel: PropTypes.bool,

	/**
	 * The handler when the knob is activated or deactivated by selecting it via 5-way
	 *
	 * @type {Function}
	 * @public
	 */
	onActivate: PropTypes.func,

	/**
	 * Called when a key is pressed down while the slider is focused.
	 *
	 * When a directional key is pressed down and the knob is active (either by first
	 * pressing enter or when `activateOnSelect` is disabled), the Slider will increment or
	 * decrement the current value and emit an `onChange` event. This default behavior can be
	 * prevented by calling `preventDefault()` on the event passed to this callback.
	 *
	 * @type {Function}
	 * @public
	 */
	onKeyDown: PropTypes.func,

	/**
	 * Called when a key is released while the slider is focused.
	 *
	 * When the enter key is released and `activateOnSelect` is enabled, the slider will be
	 * activated to enable incrementing or decrementing the value via directional keys. This
	 * default behavior can be prevented by calling `preventDefault()` on the event passed to
	 * this callback.
	 *
	 * @type {Function}
	 * @public
	 */
	onKeyUp: PropTypes.func,

	/**
	 * Indicates if the component is pressed.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	pressed: PropTypes.bool,

	/**
	 * Displays an anchor at `progressAnchor`.
	 *
	 * @type {Boolean}
	 * @public
	 */
	showAnchor: PropTypes.bool,

	/**
	 * Displays the min and max values at the edges of the slider.
	 *
	 * On a slider with tick marks, the values are placed before and after the track, on the same
	 * line as the slider. Without ticks, they are shown beside or below the track.
	 *
	 * Ignored when {@link limestone/Slider.SliderBase.labels|labels} are provided, so the values
	 * do not overlap the tick labels.
	 *
	 * @type {Boolean}
	 * @public
	 */
	showMinMax: PropTypes.bool,

	/**
	 * The amount to increment or decrement the value.
	 *
	 * It must evenly divide into the range designated by `min` and `max`. Ignored when
	 * {@link limestone/Slider.SliderBase.alignStepsWithTicks|alignStepsWithTicks} is set.
	 *
	 * @type {Number}
	 * @default 1
	 * @public
	 */
	step: PropTypes.number,

	/**
	 * Displays equally spaced tick marks along the slider track.
	 *
	 * Tick marks overlay the track and indicate selectable points. The knob can rest on a tick when
	 * that position is a valid `step` value. A slider with tick marks must display at least
	 * three ticks, and the interval between every tick must be the same.
	 *
	 * * `true` - Displays one tick per `step` when there are 3-11 steps, otherwise five ticks
	 *   (or one per label when `labels` has three or more items)
	 * * `Number` - Displays that many tick marks (minimum 3). Use
	 *   {@link limestone/Slider.SliderBase.alignStepsWithTicks|alignStepsWithTicks} so the knob
	 *   snaps to every mark.
	 *
	 * @type {Boolean|Number}
	 * @public
	 */
	ticks: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),

	/**
	 * Enables the built-in tooltip
	 *
	 * To customize the tooltip, pass either a custom tooltip component or an instance of
	 * {@link limestone/Slider.SliderTooltip|SliderTooltip} with additional props configured.
	 *
	 * ```
	 * <Slider
	 *   tooltip={
	 *     <SliderTooltip percent side="after" />
	 *   }
	 * />
	 * ```
	 *
	 * The tooltip may also be passed as a child via the `"tooltip"` slot. See
	 * {@link ui/Slottable|Slottable} for more information on how slots can be used.
	 *
	 * ```
	 * <Slider>
	 *   <SliderTooltip percent side="after" />
	 * </Slider>
	 * ```
	 *
	 * If a custom tooltip is provided, it will receive the following props:
	 *
	 * * `children` - The `value` prop from the slider
	 * * `visible` - `true` if the tooltip should be displayed
	 * * `orientation` - The value of the `orientation` prop from the slider
	 * * `proportion` - A number between 0 and 1 representing the proportion of the `value` in
	 *   terms of `min` and `max`
	 *
	 * @type {Boolean|Element|Function}
	 * @public
	 */
	tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),

	/**
	 * The value of the slider.
	 *
	 * Defaults to the value of `min`.
	 *
	 * @type {Number}
	 * @public
	 */
	value: PropTypes.number,

	/**
	 * The interval (in milliseconds) between valid wheel events.
	 *
	 * For example, 200 means to ignore wheel events occurred within 200ms
	 * of the last processed wheel event while 0 means to process all wheel events.
	 * If the number is large, the slider value changes slowly.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	wheelInterval: PropTypes.number
};

/**
 * Limestone-specific slider behaviors to apply to {@link limestone/Slider.SliderBase|SliderBase}.
 *
 * @hoc
 * @memberof limestone/Slider
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @mixes limestone/Skinnable.Skinnable
 * @mixes ui/Slottable.Slottable
 * @mixes ui/Slider.SliderDecorator
 * @public
 */
const SliderDecorator = compose(
	Pure,
	Touchable({activeProp: 'pressed'}),
	Changeable,
	SliderBehaviorDecorator,
	Spottable,
	Slottable({slots: ['knob', 'tooltip']}),
	Skinnable
);

/**
 * Slider input with Limestone styling, {@link spotlight/Spottable.Spottable|Spottable},
 * {@link ui/Touchable|Touchable} and {@link limestone/Slider.SliderDecorator|SliderDecorator}
 * applied.
 *
 * By default, `Slider` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the
 * component, supply a value to `value` at creation time and update it in response to `onChange`
 * events.
 *
 * @class Slider
 * @memberof limestone/Slider
 * @mixes limestone/Slider.SliderDecorator
 * @ui
 * @public
 */

/**
 * Overrides the `aria-valuetext` for the slider.
 *
 * By default, `aria-valuetext` is set to the current value. This should only be used when
 * the parent controls the value of the slider directly through the props.
 *
 * @name aria-valuetext
 * @memberof limestone/Slider.Slider.prototype
 * @type {String|Number}
 * @public
 */

const Slider = SliderDecorator(SliderBase);

Slider.defaultPropValues = sliderDefaultProps;

/**
 * A {@link limestone/TooltipDecorator.Tooltip|Tooltip} specifically adapted for use with
 * {@link limestone/ProgressBar.ProgressBar|ProgressBar} or
 * {@link limestone/Slider.Slider|Slider}.
 *
 * @see {@link limestone/ProgressBar.ProgressBarTooltip}
 * @class SliderTooltip
 * @memberof limestone/Slider
 * @ui
 * @public
 */

export default Slider;
export {
	Slider,
	SliderBase,
	SliderDecorator,
	ProgressBarTooltip as SliderTooltip
};
