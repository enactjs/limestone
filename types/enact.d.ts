/**
 * Ambient declarations for third-party packages that ship no TypeScript typings of their own.
 * `@enact/core/*`, `@enact/i18n/*`, `@enact/spotlight/*`, and `@enact/webos/*` are deliberately NOT
 * declared here -- they resolve against their real TypeScript sources so this package type-checks
 * against the actual API surface rather than a hand-guessed approximation (see the `ui` package
 * migration for why: several early guesses at `@enact/core`'s API diverged from reality in ways
 * that only surfaced once the real sources were available for comparison).
 *
 * `classnames`, `prop-types`, and `invariant` already ship or have real `@types/*` packages, so
 * they're not declared here either. `ilib/lib/DateFactory` has its own file (`types/ilib.d.ts`),
 * derived from reading the real installed `ilib` source rather than guessed.
 */

declare module '*.module.less' {
	const classNames: {[key: string]: string};
	export default classNames;
}

declare module '*.less' {
	const content: {[key: string]: string};
	export default content;
}

/** Compile-time constant injected by the consuming app's bundler (e.g. webpack `DefinePlugin`). */
declare const __DEV__: boolean;

/** Compile-time constant injected by the consuming app's bundler, indicating animations should be disabled (e.g. for testing or reduced-motion environments). */
declare const ENACT_PACK_NO_ANIMATION: boolean;

/** Compile-time constant injected by the consuming app's bundler, overriding the base path ilib uses to load Limestone's own locale resource files. */
declare const ILIB_LIMESTONE_PATH: string;
