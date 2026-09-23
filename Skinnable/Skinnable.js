/**
 * Exports the {@link limestone/Skinnable.Skinnable} higher-order component (HOC).
 *
 * @module limestone/Skinnable
 * @exports Skinnable
 */

import hoc from '@enact/core/hoc';
import SkinnableBase from '@enact/ui/Skinnable';
import classnames from 'classnames';
import {createContext, use, useMemo} from 'react';

/**
 * Propagates the animation tier value down the component tree.
 *
 * @private
 */
const TierContext = createContext(null);

const defaultConfig = {
	skins: {
		neutral: 'neutral',
		light: 'light',
		game: 'game'
	},
	allowedVariants: ['focusRing', 'highContrast', 'largeText', 'grayscale'],
	defaultVariants: null,
	defaultTier: 'high'
};

/**
 * This higher-order component is based on {@link ui/Skinnable.Skinnable|ui/Skinnable}.
 *
 * `Skinnable` comes pre-configured for Limestone's supported skins: "neutral" (default) and "light".
 * It is used to apply the relevant skinning classes to each component and has been used to
 * pre-select specific skins for some components.
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class Skinnable
 * @memberof limestone/Skinnable
 * @extends ui/Skinnable.Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, (config, Wrapped) => {
	const {defaultTier, ...skinnableConfig} = config;
	const SkinnedBase = SkinnableBase(skinnableConfig, Wrapped);

	// eslint-disable-next-line no-shadow
	const Skinnable = ({className, animationTier, ...rest}) => {
		const parentTier = use(TierContext);
		const effectiveTier = animationTier || parentTier || defaultTier;
		const value = useMemo(() => effectiveTier, [effectiveTier]);
		const tierClassName = classnames(className, `animationTier-${effectiveTier}`);

		return (
			<TierContext value={value}>
				<SkinnedBase {...rest} className={tierClassName} />
			</TierContext>
		);
	};

	return Skinnable;
});

/**
 * Select a skin by name by specifying this property.
 *
 * Available Limestone skins are `"neutral"` (default) and `"light"`. This may be changed at runtime.
 * All components already use their defaults, but a skin may be changed via this prop or by using
 * `Skinnable` directly and a config object.
 *
 * Example:
 * ```
 * <Button skin="light">
 * ```
 *
 * @name skin
 * @type {String}
 * @default 'neutral'
 * @memberof limestone/Skinnable.Skinnable
 * @instance
 * @public
 */

/**
 * Sets the animation tier for this component and its descendants.
 *
 * Flows down the tree like a skin. When unset, inherits from an ancestor or falls back to the
 * `defaultTier` config ("high").
 *
 * @name animationTier
 * @type {String}
 * @memberof limestone/Skinnable.Skinnable
 * @instance
 * @public
 */

export default Skinnable;
export {
	Skinnable,
	TierContext
};
