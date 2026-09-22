/**
 * Ambient declarations for third-party packages that ship no TypeScript typings of their own.
 * Public `@enact/core`, `@enact/i18n`, `@enact/spotlight`, `@enact/ui`, and `@enact/webos` entry
 * points that already ship `.d.ts` files are deliberately NOT redeclared here.
 *
 * The modules below are internals or untyped JS (spotlight/src, ui/useScroll, core/internal, etc.).
 * `ilib/lib/DateFactory` and `ilib/lib/IString` live in `types/ilib.d.ts`.
 */

declare module '@enact/core/internal/prop-types' {
	const EnactPropTypes: any;
	export default EnactPropTypes;
	export namespace EnactPropTypeShapes {
		type ref = any;
		type componentOverride = any;
		type renderable = any;
	}
}

declare module '@enact/core/internal/ApiDecorator' {
	const ApiDecorator: any;
	export default ApiDecorator;
}

declare module '@enact/core/internal/WithRef' {
	export const WithRef: any;
}

declare module '@enact/core/useHandlers' {
	const useHandlers: any;
	export default useHandlers;
}

declare module '@enact/core/useChainRefs' {
	const useChainRefs: any;
	export default useChainRefs;
}

declare module '@enact/core/usePublicClassNames' {
	export function usePublicClassNames (...args: any[]): any;
	export default usePublicClassNames;
}

declare module '@enact/spotlight/src/container';
declare module '@enact/spotlight/src/utils';
declare module '@enact/spotlight/src/pointer';
declare module '@enact/spotlight/src/target' {
	export function getTargetByDirectionFromElement (...args: any[]): any;
	export function getTargetByDirectionFromPosition (...args: any[]): any;
}

declare module '@enact/ui/useScroll' {
	export const constants: any;
	export function useScrollBase (...args: any[]): any;
	export function assignPropertiesOf (...args: any[]): any;
	const useScroll: any;
	export default useScroll;
}

declare module '@enact/ui/useScroll/Scrollbar' {
	export function useScrollbar (...args: any[]): any;
	const Scrollbar: any;
	export default Scrollbar;
}
declare module '@enact/ui/useScroll/utilDOM';
declare module '@enact/ui/useScroll/utilEvent';

declare module '@enact/ui/internal/IdProvider' {
	const IdProvider: any;
	export default IdProvider;
	export {IdProvider};
	export function useId (...args: any[]): any;
}

declare module '@enact/ui/internal/Pure' {
	const Pure: any;
	export default Pure;
}

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
