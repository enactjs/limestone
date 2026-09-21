/**
 * Module augmentations for published Enact .d.ts files that are missing members used by this
 * package. These files MUST import the module first so TypeScript merges instead of replacing.
 */

import '@enact/core/dispatcher';
import '@enact/core/handle';
import '@enact/core/kind';
import '@enact/ui/FloatingLayer';
import '@enact/ui/Resizable';
import '@enact/ui/ViewManager';

declare module '@enact/core/dispatcher' {
	export function on (name: string, fn: Function, target?: any): void;
	export function off (name: string, fn: Function, target?: any): void;
}

declare module '@enact/core/handle' {
	export function forwardCustomWithPrevent (name: string, adapter?: any): any;
	export function forwardWithPrevent (name: string): any;
}

declare module '@enact/core/kind' {
	interface KindConfig {
		_propTypes?: object;
	}
}

declare module '@enact/ui/ViewManager' {
	export const shape: any;
	export function arrange (...args: any[]): any;
}

declare module '@enact/ui/FloatingLayer' {
	export function useFloatingLayer (...args: any[]): any;
}

declare module '@enact/ui/Resizable' {
	export const ResizeContext: any;
}
