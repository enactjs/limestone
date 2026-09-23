import type {ComponentType, ReactNode, RefObject} from 'react';

export type ScrollDirection = 'vertical' | 'horizontal' | 'both';
export type ScrollMode = 'native' | 'translate';
export type ScrollbarVisibility = 'auto' | 'visible' | 'hidden';
export type FocusableScrollbar = boolean | 'byEnter';

export interface OverscrollEffectOn {
	arrowKey?: boolean;
	drag?: boolean;
	pageKey?: boolean;
	track?: boolean;
	wheel?: boolean;
}

export interface ScrollToOptions {
	position?: {x?: number; y?: number};
	align?: string;
	node?: HTMLElement;
	index?: number;
	focus?: boolean;
	animate?: boolean;
}

export interface ScrollInstances {
	scrollContainerRef: RefObject<any>;
	scrollContentRef: RefObject<any>;
	themeScrollContentHandle: RefObject<any>;
	scrollContainerHandle: RefObject<any>;
	scrollContentHandle?: RefObject<any>;
	spottable?: RefObject<any>;
	itemRefs?: RefObject<any[]>;
}

export interface ScrollInteractionParams {
	inputType: string;
	isForward: boolean;
	isPagination: boolean;
	isVerticalScrollBar: boolean;
}

export interface UseScrollReturn {
	scrollContentWrapper: ComponentType<any>;
	scrollContentHandle: RefObject<any>;
	isHorizontalScrollbarVisible: boolean;
	isVerticalScrollbarVisible: boolean;
	resizeContextProps?: Record<string, any>;
	scrollContainerProps?: Record<string, any>;
	scrollContentWrapperProps?: Record<string, any>;
	scrollContentProps?: Record<string, any>;
	horizontalScrollbarProps?: Record<string, any>;
	verticalScrollbarProps?: Record<string, any>;
	hoverToScrollProps?: Record<string, any>;
}

export interface ThemeScrollProps {
	direction?: ScrollDirection;
	scrollMode?: ScrollMode;
	overscrollEffectOn?: OverscrollEffectOn;
	scrollbarTrackCss?: Record<string, string>;
	scrollToContentContainerOnFocus?: boolean;
	'data-spotlight-container-disabled'?: boolean;
	id?: string;
	itemRenderer?: any;
	editable?: any;
	fadeOut?: boolean;
	focusableScrollbar?: FocusableScrollbar;
	className?: string;
	style?: Record<string, any>;
	'data-spotlight-container'?: boolean;
	'data-spotlight-id'?: string;
	'data-webos-voice-disabled'?: boolean;
	'data-webos-voice-focused'?: boolean;
	'data-webos-voice-group-label'?: string;
	noAffordance?: boolean;
	snapToCenter?: boolean;
	stickTo?: 'start';
	horizontalScrollThumbAriaLabel?: string;
	verticalScrollThumbAriaLabel?: string;
	[key: string]: any;
}

export interface ScrollEventPayload {
	scrollLeft?: number;
	scrollTop?: number;
	id?: string;
	[key: string]: any;
}

export interface ScrollbarBaseProps {
	'aria-label'?: string;
	cbAlertScrollbarTrack?: () => void;
	css?: Record<string, string>;
	focusableScrollbar?: FocusableScrollbar;
	minThumbSize?: number;
	onInteractionForScroll?: (params: ScrollInteractionParams) => void;
	rtl?: boolean;
	scrollbarTrackCss?: Record<string, string>;
	vertical?: boolean;
	[key: string]: any;
}

export interface ScrollbarTrackProps {
	'aria-label'?: string;
	cbAlertScrollbarTrack?: () => void;
	focusableScrollbar?: FocusableScrollbar;
	onInteractionForScroll?: (params: ScrollInteractionParams) => void;
	ref?: RefObject<any>;
	rtl?: boolean;
	scrollbarTrackCss?: Record<string, string>;
	vertical?: boolean;
	[key: string]: any;
}

export interface HoverToScrollBaseProps {
	direction: 'horizontal' | 'vertical';
	scrollContainerHandle: {current: any};
	scrollObserver?: {
		addObserverOnScroll: (fn: () => void) => void;
		removeObserverOnScroll: (fn: () => void) => void;
	};
	[key: string]: any;
}

export interface HoverToScrollProps {
	scrollContainerHandle?: {current: any};
	scrollObserver?: HoverToScrollBaseProps['scrollObserver'];
	[key: string]: any;
}

export interface SharedScrollProps {
	'aria-label'?: string;
	cbScrollTo?: (fn: (opt: ScrollToOptions) => void) => void;
	'data-spotlight-container'?: boolean;
	'data-spotlight-container-disabled'?: boolean;
	'data-spotlight-id'?: string;
	'data-webos-voice-disabled'?: boolean;
	'data-webos-voice-focused'?: boolean;
	'data-webos-voice-group-label'?: string;
	direction?: ScrollDirection;
	focusableScrollbar?: FocusableScrollbar;
	horizontalScrollbar?: ScrollbarVisibility;
	horizontalScrollThumbAriaLabel?: string;
	hoverToScroll?: boolean;
	id?: string;
	noScrollByDrag?: boolean;
	noScrollByWheel?: boolean;
	onScroll?: (ev: Record<string, any>) => void;
	onScrollStart?: (ev: Record<string, any>) => void;
	onScrollStop?: (ev: Record<string, any>) => void;
	overscrollEffectOn?: OverscrollEffectOn;
	scrollbarTrackCss?: Record<string, string>;
	scrollMode?: ScrollMode;
	scrollToContentContainerOnFocus?: boolean;
	stickTo?: 'start';
	verticalScrollbar?: ScrollbarVisibility;
	verticalScrollThumbAriaLabel?: string;
	children?: ReactNode;
	className?: string;
	style?: Record<string, any>;
	[key: string]: any;
}
