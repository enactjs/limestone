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
import UiProgressBar from '@enact/ui/ProgressBar';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import UiSlider from '@enact/ui/Slider';
import Touchable from '@enact/ui/Touchable';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import type {ComponentType, ReactElement, ReactNode} from 'react';

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

export interface SliderBaseProps {
	activateOnSelect?: boolean;
	active?: boolean;
	alignStepsWithTicks?: boolean;
	automaticLabels?: boolean;
	className?: string;
	colorPicker?: boolean;
	css?: Record<string, string>;
	disabled?: boolean;
	focused?: boolean;
	keyFrequency?: number[];
	knobComponent?: ComponentType<any> | ReactElement;
	knobStep?: number | null;
	labels?: ReactNode[];
	max?: number;
	min?: number;
	noWheel?: boolean;
	onActivate?: (...args: any[]) => any;
	onBlur?: (...args: any[]) => any;
	onClick?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	onKeyUp?: (...args: any[]) => any;
	onSpotlightDown?: (...args: any[]) => any;
	onSpotlightLeft?: (...args: any[]) => any;
	onSpotlightRight?: (...args: any[]) => any;
	onSpotlightUp?: (...args: any[]) => any;
	orientation?: 'horizontal' | 'vertical';
	pressed?: boolean;
	showAnchor?: boolean;
	showMinMax?: boolean;
	step?: number;
	ticks?: boolean | number;
	tooltip?: boolean | ComponentType<any> | ReactElement;
	value?: number;
	wheelInterval?: number;
}

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
const SliderBase = (props: SliderBaseProps) => {
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

	validateSteppedOnce((p: any) => p.knobStep, {
		component: 'Slider',
		stepName: 'knobStep',
		valueName: 'max'
	})(sliderProps);

	const providedStep = validateSteppedOnce((p: any) => p.step, {
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
	const handlerProps: any = alignedStep == null ? sliderProps : {...sliderProps, knobStep: null, step};

	const tooltip = sliderProps.tooltip === true ? ProgressBarTooltip : sliderProps.tooltip;

	const context = useMemo(() => ({lastWheelTimeStamp: 0}), []);

	const spotlightAccelerator = useRef<any>(void 0);
	const ref = useRef<any>(void 0);

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
			forKey('enter') as any,
			forward('onActivate')
		)
	}, handlerProps, spotlightAccelerator);

	const nativeEventHandlers: any = useHandlers({
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
	let mergedCss: any = usePublicClassNames({componentCss, customCss: css, publicClassNames: true});

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

	const restProps = rest as Record<string, any>;
	delete restProps.activateOnSelect;
	delete restProps.knobStep;
	delete restProps.noWheel;
	delete restProps.onActivate;
	delete restProps.step;
	delete restProps.tooltip;
	delete restProps.wheelInterval;

	const sliderMax = colorPicker ? 360 : max;
	const sliderMin = colorPicker ? 0 : min;
	const sliderStep = colorPicker ? 1 : step;
	let sideStartLabel = null;
	let sideEndLabel = null;

	if (hasCustomSideLabels) {
		sideStartLabel = tickConfig.startLabel;
		sideEndLabel = tickConfig.endLabel;
	} else if (hasInlineMinMax) {
		sideStartLabel = sliderMin;
		sideEndLabel = sliderMax;
	}

	const styleObject = {
		'--semantic-color-surface-default-handle': `hsla(${restProps.value ? restProps.value : 0}, 100%, 50%, 1)`,
		'--semantic-color-surface-default-focused': `hsla(${restProps.value ? restProps.value : 0}, 100%, 50%, 1)`
	};

	return (
		<UiSlider
			{...restProps}
			{...handlers}
			aria-disabled={disabled}
			colorPicker={colorPicker}
			className={componentClassName}
			css={mergedCss}
			disabled={disabled}
			max={sliderMax}
			min={sliderMin}
			progressBarComponent={
				<UiProgressBar css={mergedCss} style={{backgroundImage: colorPicker ? hueGradient(restProps.orientation) : void 0} as any} />
			}
			ref={ref}
			step={sliderStep}
			style={colorPicker ? styleObject as any : void 0}
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
					endLabel={sideEndLabel}
					focused={focused}
					labels={hasTickLabels ? tickConfig.tickLabels ?? void 0 : void 0}
					max={sliderMax}
					min={sliderMin}
					orientation={restProps.orientation}
					showMinMax={displayMinMax}
					startLabel={sideStartLabel}
				/> : null
			}
		/>
	);
};

SliderBase.displayName = 'Slider';

SliderBase.propTypes = /** @lends limestone/Slider.SliderBase.prototype */ {
	activateOnSelect: PropTypes.bool,
	active: PropTypes.bool,
	alignStepsWithTicks: PropTypes.bool,
	automaticLabels: PropTypes.bool,
	colorPicker: PropTypes.bool,
	css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
	disabled: PropTypes.bool,
	focused: PropTypes.bool,
	keyFrequency: PropTypes.arrayOf(PropTypes.number),
	knobStep: PropTypes.number,
	labels: PropTypes.arrayOf(PropTypes.node),
	max: PropTypes.number,
	min: PropTypes.number,
	noWheel: PropTypes.bool,
	onActivate: PropTypes.func,
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
	pressed: PropTypes.bool,
	showAnchor: PropTypes.bool,
	showMinMax: PropTypes.bool,
	step: PropTypes.number,
	ticks: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]) as PropTypes.Validator<boolean | number | undefined>,
	tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]) as PropTypes.Validator<boolean | ComponentType<any> | ReactElement | undefined>,
	value: PropTypes.number,
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
 * @class Slider
 * @memberof limestone/Slider
 * @mixes limestone/Slider.SliderDecorator
 * @ui
 * @public
 */
const Slider = SliderDecorator(SliderBase) as ComponentType<SliderBaseProps & {defaultValue?: number; onChange?: (...args: any[]) => any}> & {defaultPropValues?: Record<string, any>};

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
