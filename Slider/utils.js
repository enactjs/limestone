import {forKey, forProp, forwardCustom, handle, oneOf, preventDefault, stop} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {clamp} from '@enact/core/util';
import {calcProportion, hslToHex} from '@enact/ui/Slider/utils';

import {warning} from '../internal/validators';

const MIN_TICK_COUNT = 3;
const DEFAULT_TICK_COUNT = 5;
const MAX_STEP_TICK_COUNT = 11;

/**
 * Number of selectable values from `min` to `max` using `step`.
 *
 * @private
 */
const getStepStopCount = (min = 0, max = 100, step = 1) => {
	const range = max - min;
	const stepSize = step || 1;

	if (!(range > 0) || !(stepSize > 0)) {
		return 0;
	}

	return Math.round(range / stepSize) + 1;
};

/**
 * Resolves tick count and label placement from the `ticks` and `labels` props.
 *
 * Tick marks require at least three equally spaced points. Two labels are treated as start/end
 * labels; three or more labels are shown under each tick.
 *
 * When `ticks` is `true` and there is no per-tick label list, the tick count follows the number of
 * `step` stops so the knob can rest on each mark (capped so dense ranges still use five ticks).
 * If `alignStepsWithTicks` is set, `ticks={true}` uses five ticks instead of deriving from `step`.
 *
 * @param {Boolean|Number} ticks  `true` for the default count, or an explicit tick count
 * @param {Array}          labels Label values for start/end or per-tick display
 * @param {Object}         [range] Slider range used to match ticks to `step`
 * @param {Boolean}        [range.alignStepsWithTicks]
 * @param {Number}         [range.min]
 * @param {Number}         [range.max]
 * @param {Number}         [range.step]
 *
 * @returns {Object} Tick render configuration
 * @private
 */
const getTickConfig = (ticks, labels, {alignStepsWithTicks, min = 0, max = 100, step = 1} = {}) => {
	const labelList = Array.isArray(labels) ? labels : [];
	const labelCount = labelList.length;
	const useTickLabels = labelCount >= MIN_TICK_COUNT;
	const useSideLabels = labelCount === 2;

	let count = 0;
	if (typeof ticks === 'number' && ticks > 0) {
		count = ticks;
	} else if (ticks === true) {
		if (useTickLabels) {
			count = labelCount;
		} else if (alignStepsWithTicks) {
			count = DEFAULT_TICK_COUNT;
		} else {
			const stepStops = getStepStopCount(min, max, step);
			count = (stepStops >= MIN_TICK_COUNT && stepStops <= MAX_STEP_TICK_COUNT) ?
				stepStops :
				DEFAULT_TICK_COUNT;
		}
	} else if (useTickLabels) {
		count = labelCount;
	}

	if (count > 0 && count < MIN_TICK_COUNT) {
		warning(true, `Slider ticks must be 3 or more. Received ${count}.`);
		count = 0;
	}

	return {
		count,
		tickLabels: useTickLabels ? labelList : null,
		startLabel: useSideLabels ? labelList[0] : null,
		endLabel: useSideLabels ? labelList[1] : null
	};
};

/**
 * Step size that places the knob on each tick mark.
 *
 * @param {Number} min
 * @param {Number} max
 * @param {Number} tickCount
 *
 * @returns {Number|null} Aligned step, or `null` when ticks are not available
 * @private
 */
const getTickAlignedStep = (min, max, tickCount) => {
	if (tickCount < MIN_TICK_COUNT) {
		return null;
	}

	const range = max - min;
	const intervals = tickCount - 1;

	if (!(range > 0) || intervals <= 0) {
		return null;
	}

	return range / intervals;
};

const hueGradient = (orientation) =>  `linear-gradient(${orientation === 'horizontal' ? 'to right' : 'to top'}, 
	hsla(0, 100%, 50%, 1),
	hsla(10, 100%, 50%, 1),
	hsla(20, 100%, 50%, 1),
	hsla(30, 100%, 50%, 1),
	hsla(40, 100%, 50%, 1),
	hsla(50, 100%, 50%, 1),
	hsla(60, 100%, 50%, 1),
	hsla(70, 100%, 50%, 1),
	hsla(80, 100%, 50%, 1),
	hsla(90, 100%, 50%, 1),
	hsla(100, 100%, 50%, 1),
	hsla(110, 100%, 50%, 1),
	hsla(120, 100%, 50%, 1),
	hsla(130, 100%, 50%, 1),
	hsla(140, 100%, 50%, 1),
	hsla(150, 100%, 50%, 1),
	hsla(160, 100%, 50%, 1),
	hsla(170, 100%, 50%, 1),
	hsla(180, 100%, 50%, 1),
	hsla(190, 100%, 50%, 1),
	hsla(200, 100%, 50%, 1),
	hsla(210, 100%, 50%, 1),
	hsla(220, 100%, 50%, 1),
	hsla(230, 100%, 50%, 1),
	hsla(240, 100%, 50%, 1),
	hsla(250, 100%, 50%, 1),
	hsla(260, 100%, 50%, 1),
	hsla(270, 100%, 50%, 1),
	hsla(280, 100%, 50%, 1),
	hsla(290, 100%, 50%, 1),
	hsla(300, 100%, 50%, 1),
	hsla(310, 100%, 50%, 1),
	hsla(320, 100%, 50%, 1),
	hsla(330, 100%, 50%, 1),
	hsla(340, 100%, 50%, 1),
	hsla(350, 100%, 50%, 1),
	hsla(360, 100%, 50%, 1))`;

const nop = () => {};

const handleAcceleratedKeyDown = (ev, prop, {current: spotlightAccelerator}) => {
	if (!spotlightAccelerator) {
		return true;
	}

	if (!ev.repeat) {
		spotlightAccelerator.reset();
	}

	if (spotlightAccelerator.processKey(ev, nop)) {
		return false;
	}

	return true;
};

const calcStep = (knobStep, step) => {
	let s;

	if (knobStep != null) {
		s = knobStep;
	} else if (step != null) {
		s = step;
	}

	// default to a step of 1 if neither are set or are set to 0
	// otherwise, increment/decrement would be no-ops
	return s || 1;
};

const isIncrementByWheel = ({deltaY}) => {
	return deltaY < 0;
};

const isDecrementByWheel = ({deltaY}) => {
	return deltaY > 0;
};

const isIncrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('up', keyCode) : is('right', keyCode);
};

const isDecrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('down', keyCode) : is('left', keyCode);
};

const isNotMax = (ev, {value, max}) => {
	return value !== max;
};

const isNotMin = (ev, {min, value = min}) => {
	return value !== min;
};

const checkInterval = (ev, {wheelInterval}, context) => {
	if (ev.timeStamp - context.lastWheelTimeStamp < wheelInterval) {
		return false;
	}
	context.lastWheelTimeStamp = ev.timeStamp;
	return true;
};

const emitChange = (direction) => forwardCustom(
	'onChange',
	(ev, {colorPicker, knobStep, max, min, step, value = min}) => {

		if (colorPicker) {
			const newValue = clamp(0, 360, value + (calcStep(knobStep, step) * direction));

			return {
				value: newValue,
				proportion: calcProportion(min, max, newValue),
				color: {
					hex: hslToHex(value),
					hsl: `hsla(${value}, 100%, 50%, 1)`
				}
			};
		} else {
			const newValue = clamp(min, max, value + (calcStep(knobStep, step) * direction));

			return {
				value: newValue,
				proportion: calcProportion(min, max, newValue)
			};
		}
	}
);

const isActive = (ev, props) => {
	return props.active || !props.activateOnSelect;
};

const handleIncrement = handle(
	isActive,
	isIncrement,
	preventDefault,
	stop,
	handleAcceleratedKeyDown,
	isNotMax,
	emitChange(1)
);

const handleDecrement = handle(
	isActive,
	isDecrement,
	preventDefault,
	stop,
	handleAcceleratedKeyDown,
	isNotMin,
	emitChange(-1)
);

const handleIncrementByWheel = handle(
	isActive,
	isIncrementByWheel,
	preventDefault,
	stop,
	isNotMax,
	checkInterval,
	emitChange(1)
);

const handleDecrementByWheel = handle(
	isActive,
	isDecrementByWheel,
	preventDefault,
	stop,
	isNotMin,
	checkInterval,
	emitChange(-1)
);

const either = (a, b) => (...args) => a(...args) || b(...args);
const atMinimum = (ev, {min, value = min}) => value <= min;
const atMaximum = (ev, {max, min, value = min}) => value >= max;

const forwardSpotlightEvents = oneOf(
	[forKey('left'), handle(
		either(forProp('orientation', 'vertical'), atMinimum),
		forwardCustom('onSpotlightLeft')
	)],
	[forKey('right'), handle(
		either(forProp('orientation', 'vertical'), atMaximum),
		forwardCustom('onSpotlightRight')
	)],
	[forKey('down'), handle(
		either(forProp('orientation', 'horizontal'), atMinimum),
		forwardCustom('onSpotlightDown')
	)],
	[forKey('up'), handle(
		either(forProp('orientation', 'horizontal'), atMaximum),
		forwardCustom('onSpotlightUp')
	)]
);

export {
	DEFAULT_TICK_COUNT,
	forwardSpotlightEvents,
	emitChange,
	getTickAlignedStep,
	getTickConfig,
	handleDecrement,
	handleIncrement,
	handleDecrementByWheel,
	handleIncrementByWheel,
	hueGradient,
	MIN_TICK_COUNT
};
