/**
 * Provides a Limestone-themed pill-shaped toggle switch component.
 *
 * @example
 * <Switch />
 *
 * @module limestone/Switch
 * @exports Switch
 * @exports SwitchBase
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useState} from 'react';

import Spottable from '@enact/spotlight/Spottable';
import Touchable from '@enact/ui/Touchable';
import Toggleable from '@enact/ui/Toggleable';

import Skinnable from '../Skinnable';

import componentCss from './Switch.module.less';

/**
 * Renders the base level DOM structure of the component.
 *
 * @class SwitchBase
 * @memberof limestone/Switch
 * @ui
 * @public
 */
const SwitchBase = kind({
	name: 'Switch',

	propTypes: /** @lends limestone/Switch.SwitchBase.prototype */ {
		/**
		 * Applies the bounce animation to the switch handle.
		 *
		 * This is set only for the render that follows an `off`-to-`on` toggle, so the handle
		 * bounces when the user turns the switch on but not when a selected switch merely mounts
		 * or re-mounts. It is managed by {@link limestone/Switch.BounceOnToggle|BounceOnToggle}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		bouncing: PropTypes.bool,

		css: PropTypes.object,

		/**
		 * Disables Switch and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Disables animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Sets whether this control is in the 'on' or 'off' state. `true` for 'on', `false` for 'off'.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool
	},

	defaultProps: {
		bouncing: false,
		noAnimation: typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION,
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'switch',
		publicClassNames: ['switch', 'selected', 'client']
	},

	computed: {
		className: ({bouncing, noAnimation, selected, styler}) => styler.append({
			animated: !noAnimation,
			bouncing: bouncing && !noAnimation,
			selected
		})
	},

	render: ({css, disabled, selected, ...rest}) => {
		delete rest.bouncing;
		delete rest.noAnimation;

		return (
			<div
				{...rest}
				aria-pressed={selected}
				aria-disabled={disabled}
				disabled={disabled}
				role="button"
			>
				<div className={css.bg} />
				<div className={css.client}>
					<div className={css.icon} />
				</div>
			</div>
		);
	}
});

/**
 * Plays the handle bounce animation only when `selected` transitions from `false` to `true`.
 *
 * The bounce is a CSS `animation`, which the browser replays every time the animated element is
 * mounted (or revealed from `display: none`). A `selected` switch that re-mounts — e.g. when a
 * panel it lives in is navigated away from and back — would therefore bounce even though the user
 * never toggled it (QEVENTTH-15000). This decorator tracks the previous `selected` value and sets
 * the `bouncing` prop for the single render that follows an `off`-to-`on` toggle, clearing it once
 * the animation ends, so the bounce plays on a real toggle but never on mount or re-mount.
 *
 * @class BounceOnToggle
 * @memberof limestone/Switch
 * @hoc
 * @private
 */
const BounceOnToggle = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function BounceOnToggle ({selected = false, ...rest}) {
		// Track the previous `selected` as state (not a ref) so the transition can be detected
		// during render — the React-recommended "adjust state while rendering" pattern — which
		// keeps the bounce class present on the first render after a toggle and absent on the
		// initial mount or a re-mount. (`core/util.usePrevious` can't be used here: it holds the
		// pre-change value until the *next* change, so it would re-trigger the bounce after the
		// animation ends while `selected` stays on.)
		const [prevSelected, setPrevSelected] = useState(selected);
		const [bouncing, setBouncing] = useState(false);

		if (selected !== prevSelected) {
			setPrevSelected(selected);
			// Bounce only on the off-to-on transition.
			setBouncing(selected);
		}

		const handleAnimationEnd = useCallback((ev) => {
			setBouncing(false);
			if (rest.onAnimationEnd) {
				rest.onAnimationEnd(ev);
			}
		}, [rest]);

		return (
			<Wrapped
				{...rest}
				bouncing={bouncing}
				onAnimationEnd={handleAnimationEnd}
				selected={selected}
			/>
		);
	}

	BounceOnToggle.propTypes = /** @lends limestone/Switch.BounceOnToggle.prototype */ {
		onAnimationEnd: PropTypes.func,
		selected: PropTypes.bool
	};

	return BounceOnToggle;
});

/**
 * Adds interactive functionality to `Switch`.
 *
 * @class SwitchDecorator
 * @memberof limestone/Switch
 * @mixes ui/Toggleable.Toggleable
 * @mixes spotlight/Spottable.Spottable
 * @hoc
 * @public
 */
const SwitchDecorator = compose(
	Toggleable({toggleProp: 'onClick'}),
	Touchable,
	Spottable,
	Skinnable,
	BounceOnToggle
);

/**
 * A Limestone-styled component that looks like a toggle switch.
 *
 * `Switch` will manage its `selected` state via {@link ui/Toggleable|Toggleable} unless set
 * directly.
 *
 * @class Switch
 * @memberof limestone/Switch
 * @extends limestone/Switch.SwitchBase
 * @mixes limestone/Switch.SwitchDecorator
 * @ui
 * @public
 */
const Switch = SwitchDecorator(SwitchBase);

export default Switch;
export {
	BounceOnToggle,
	Switch,
	SwitchBase,
	SwitchDecorator
};
