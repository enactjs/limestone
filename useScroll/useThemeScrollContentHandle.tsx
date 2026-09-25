import {useRef} from 'react';

const useThemeScrollContentHandle = (): [ReturnType<typeof useRef<any>>, (handle: any) => void] => {
	// Mutable value

	const themeScrollContentHandle = useRef({
		calculatePositionOnFocus: null,
		focusByIndex: null,
		focusOnNode: null,
		getScrollBounds: null,
		pauseSpotlight: null,
		setContainerDisabled: null,
		setLastFocusedNode: null,
		shouldPreventOverscrollEffect: null,
		shouldPreventScrollByFocus: null
	});

	// Functions

	const setThemeScrollContentHandle = (handle: any) => {
		themeScrollContentHandle.current = handle;
	};

	// Return

	return [themeScrollContentHandle, setThemeScrollContentHandle];
};

export {
	useThemeScrollContentHandle
};
