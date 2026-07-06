import {isValidElement, cloneElement} from 'react';

const withProps = (props, tests) => {
	return tests.map(t => {
		if (isValidElement(t)) {
			return cloneElement(t, props);
		}

		return {
			...t,
			component: cloneElement(t.component, props)
		};
	});
};

const withConfig = (config, tests) => {
	return tests.map(t => {
		if (isValidElement(t)) {
			return {
				...config,
				component: t
			};
		}

		return {
			...t,
			...config
		};
	});
};

/**
 * Default tallglyph locale for screenshot tests.
 *
 * `vi-VN` activates `.enact-locale-vi` tallglyph CSS (font-size, line-height).
 * It does not apply th/km/si rules — use {@link withConfig} with an explicit
 * locale for those (e.g. Button `km-KH`, Picker QWTC-2214 `th-TH`).
 */
const TALLGLYPH_LOCALES = ['vi-VN'];

/**
 * Applies every {@link TALLGLYPH_LOCALES} entry to screenshot test cases via {@link withConfig}.
 *
 * @param {Array} tests - Test elements or `{component, ...config}` objects.
 * @param {Object} [config={}] - Extra config merged with each locale (e.g. `{textSize: 'large'}`).
 * @returns {Array} Flattened test cases, one entry per locale in {@link TALLGLYPH_LOCALES}.
 *
 * @example
 * // All default tallglyph locales
 * ...withTallglyphLocale(tests)
 *
 * @example
 * // All default locales plus extra config
 * ...withTallglyphLocale(tests, {textSize: 'large'})
 */
const withTallglyphLocale = (tests, config = {}) =>
	TALLGLYPH_LOCALES.flatMap((locale) => withConfig({locale, ...config}, tests));

/**
 * QWTC tallglyph sample: tall glyphs from multiple scripts (th, ta) in one string.
 * Used with {@link withTallglyphLocale} to stress clipping/overflow; locale selects
 * which `.enact-locale-*` CSS applies, not which characters appear in the string.
 */
const TallglyphMultiScript = ' ฟิ้  ไั  ஒ  து';

/** Latin extended sample for vi tallglyph typography. */
const TallglyphLatin = 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ';

const LoremString =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat.';

const LongerLoremString = `Longer ${LoremString} ${LoremString} ${LoremString} ${LoremString}`;

export {
	LongerLoremString,
	LoremString,
	TallglyphLatin,
	TallglyphMultiScript,
	withConfig,
	withProps,
	withTallglyphLocale
};
