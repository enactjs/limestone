import kind from '@enact/core/kind';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {WithRef} from '@enact/core/internal/WithRef';
import {checkPropTypes} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import IdProvider from '@enact/ui/internal/IdProvider';
import ri from '@enact/ui/resolution';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useEffect, useReducer, useRef} from 'react';
import type {ComponentType, ReactNode} from 'react';

import $L from '../internal/$L';
import {compareChildren} from '../internal/util';
import Icon from '../Icon';
import Item from '../Item';
import Skinnable from '../Skinnable';
import VirtualList from '../VirtualList';

import css from './Dropdown.module.less';

const ReadyState = {
	// Initial state. Scrolling and focusing pending
	INIT: 0,
	// Scroll requested
	SCROLLED: 1,
	// Focus completed or not required
	DONE: 2
};

type DropdownListChildObject = {
	children: ReactNode;
	key: string | number;
	[key: string]: any;
};

type DropdownListChildren = string[] | DropdownListChildObject[];

type DropdownListProps = {
	children?: DropdownListChildren;
	selected?: number;
};

type DropdownListState = {
	prevChildren?: DropdownListChildren;
	prevFocused?: number | null;
	prevSelected?: number;
	prevSelectedKey?: string | number;
	ready: number;
};

type DropdownListStateAction = {
	adjustedFocusIndex?: number | null;
	props?: DropdownListProps;
	type: number;
};

const isSelectedValid = ({children, selected}: DropdownListProps) => Array.isArray(children) && children[selected!] != null;

const getKey = ({children, selected}: DropdownListProps) => {
	if (isSelectedValid({children, selected})) {
		return (children as DropdownListChildObject[])[selected!].key;
	}
};

const indexFromKey = (children: DropdownListChildObject[] | undefined, key: string | number) => {
	let index = -1;
	if (children) {
		index = children.findIndex(child => child.key === key);
	}

	return index;
};

const stateReducer = (prevState: DropdownListState, {adjustedFocusIndex, props, type}: DropdownListStateAction) => {
	switch (type) {
		case ReadyState.INIT:
			return {
				prevChildren: props!.children,
				prevFocused: adjustedFocusIndex,
				prevSelected: props!.selected,
				prevSelectedKey: getKey(props!),
				ready: ReadyState.INIT
			};
		case ReadyState.SCROLLED:
			return {...prevState, ready: ReadyState.SCROLLED};
		case ReadyState.DONE:
			return {...prevState, ready: ReadyState.DONE};
		default:
			return prevState;
	}
};

export interface DropdownListBaseProps {
	children?: DropdownListChildren;
	id?: string;
	onSelect?: (...args: any[]) => any;
	scrollTo?: (...args: any[]) => any;
	selected?: number;
	skinVariants?: Record<string, any>;
	width?: 'tiny' | 'small' | 'medium' | 'large' | 'x-large' | 'huge' | number;
	[key: string]: any;
}

const DropdownListBase = kind({
	name: 'DropdownListBase',

	_propTypes: {} as DropdownListBaseProps,

	propTypes: {
		/*
		 * The selections for Dropdown
		 *
		 * @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				children: EnactPropTypes.renderable.isRequired,
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
			}))
		]),

		/**
		 * The `id` of DropdownList referred to when setting aria-labelledby
		 *
		 * @type {String}
		 * @private
		 */
		id: PropTypes.string,

		/*
		 * Called when an item is selected.
		 *
		 * @type {Function}
		 */
		onSelect: PropTypes.func,

		/*
		 * Callback function that will receive the scroller's scrollTo() method
		 *
		 * @type {Function}
		 */
		scrollTo: PropTypes.func,

		/*
		 * Index of the selected item.
		 *
		 * @type {Number}
		 */
		selected: PropTypes.number,

		/*
		 * State of possible skin variants.
		 *
		 * Used to scale the `itemSize` of the `VirtualList` based on large-text mode
		 *
		 * @type {Object}
		 */
		skinVariants: PropTypes.object,

		/*
		 * The width of DropdownList.
		 *
		 * @type {('huge'|'x-large'|'large'|'medium'|'small'|'tiny')|number}
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'x-large', 'huge']),
			PropTypes.number
		])
	},

	styles: {
		css,
		className: 'dropdownList'
	},

	handlers: {
		itemRenderer: ({index, ...rest}: Record<string, any>, props: Record<string, any>) => {
			const {children, selected} = props;
			const isSelected = index === selected;
			const slotAfter = isSelected ? (<Icon>check</Icon>) : null;

			let child = children[index];
			if (typeof child === 'string') {
				child = {children: child};
			}
			const data = child.children;
			const {key, ...restChild} = {...child};

			return (
				<Item
					{...rest}
					{...restChild}
					css={css}
					key={key}
					slotAfter={slotAfter}
					data-selected={isSelected}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={() => forward('onSelect', {data, selected: index}, props)}
					size="large"
				/>
			);
		}
	},

	computed: {
		className: ({children, styler, width}: Record<string, any>) => styler.append(
			typeof width === 'string' ? width : null,
			{verticalScrollbar: children?.length > 5}
		),
		dataSize: ({children}: Record<string, any>) => children ? children.length : 0,
		// Note: Retaining this in case we need to support different item sizes for large text mode:
		// itemSize: ({skinVariants}) => ri.scale(skinVariants && skinVariants.largeText ? 156 : 156)
		itemSize: () => 156,
		maxItems: ({children}: Record<string, any>) => children?.length > 5
	},

	render: ({dataSize, id, itemSize, maxItems, scrollTo, width, ...rest}: Record<string, any>) => {
		delete rest.children;
		delete rest.onSelect;
		delete rest.selected;
		delete rest.skinVariants;
		delete rest.width;

		return (
			<div role="region" aria-labelledby={`${id}_dropdownlist`}>
				<div id={`${id}_dropdownlist`} aria-label={`${$L('Dropdown list opened')} ${new IString($L('{total} items in total')).format({total: dataSize})}`} />
				<VirtualList
					{...rest}
					cbScrollTo={scrollTo}
					dataSize={dataSize}
					itemSize={ri.scale(itemSize)}
					role="group"
					scrollbarTrackCss={css}
					style={{
						backgroundColor: 'transparent',
						height: !maxItems ? ri.scaleToRem((itemSize * dataSize) + 36) : null,
						width: typeof width === 'number' ? ri.scaleToRem(width) : null
					}}
				/>
			</div>
		);
	}
});

interface DropdownListSpotlightDecoratorProps extends DropdownListBaseProps {
	handleSpotlightPause?: (paused: boolean) => boolean;
	onFocus?: (ev: any) => void;
}

const DropdownListSpotlightDecorator = (hoc as any)((config: Record<string, any>, Wrapped: ComponentType<any>) => {
	const WrappedWithRef = WithRef(Wrapped);

	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
	const DropdownListSpotlightDecorator = (props: DropdownListSpotlightDecoratorProps) => {
		checkPropTypes(DropdownListSpotlightDecorator, props);

		const clientSiblingRef = useRef<any>(null);
		const [state, dispatch] = useReducer(stateReducer, {
			prevChildren: props.children,
			prevFocused: null,
			prevSelected: props.selected,
			prevSelectedKey: getKey(props),
			ready: isSelectedValid(props) ? ReadyState.INIT : ReadyState.DONE
		});
		const scrollToRef = useRef<any>(() => {});
		const lastFocusedKey = useRef<string | number | null>(null);

		useEffect(() => {
			if (props.handleSpotlightPause) {
				props.handleSpotlightPause(false);
			}
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		const focusSelected = () => {
			dispatch({type: ReadyState.DONE});
		};

		const resetFocus = useCallback((keysDiffer: boolean) => {
			let adjustedFocusIndex;

			if (!keysDiffer && lastFocusedKey.current) {
				const targetIndex = indexFromKey(props.children as DropdownListChildObject[] | undefined, lastFocusedKey.current);
				if (targetIndex >= 0) {
					adjustedFocusIndex = targetIndex;
				}
			}

			dispatch({adjustedFocusIndex: adjustedFocusIndex, props: props, type: ReadyState.INIT});
		}, [props]);

		const scrollIntoView = useCallback(() => {
			let {selected} = props;

			if (state.prevFocused == null && !isSelectedValid(props)) {
				selected = 0;
			} else if (state.prevFocused != null) {
				selected = state.prevFocused;
			}

			scrollToRef.current({
				animate: false,
				focus: true,
				index: selected,
				offset: ri.scale(156 * 2), // @lime-item-small-height * 2 (TODO: large text mode not supported!)
				stickTo: 'start' // offset from the top of the dropdown
			});

			dispatch({type: ReadyState.SCROLLED});
		}, [props, state.prevFocused]);

		useEffect(() => {
			if (state.ready === ReadyState.INIT) {
				scrollIntoView();
			} else if (state.ready === ReadyState.SCROLLED) {
				focusSelected();
			} else {
				const key = getKey(props);
				const keysDiffer = key && state.prevSelectedKey && key !== state.prevSelectedKey;

				if (keysDiffer ||
					((!key || !state.prevSelectedKey) && state.prevSelected !== props.selected) ||
					!compareChildren(state.prevChildren, props.children)
				) {
					resetFocus(!!keysDiffer);
				}
			}
		}, [props, resetFocus, scrollIntoView, state]);

		const setScrollTo = useCallback((scrollTo: (...args: any[]) => any) => {
			scrollToRef.current = scrollTo;
		}, []);

		const handleFocus = useCallback((ev: any) => {
			const current = ev.target;
			const dropdownListNode = clientSiblingRef?.current;

			if (state.ready === ReadyState.DONE && !Spotlight.getPointerMode() &&
				current.dataset['index'] != null && dropdownListNode.contains(current)
			) {
				const focusedIndex = Number(current.dataset['index']);
				lastFocusedKey.current = getKey({children: props.children, selected: focusedIndex}) ?? null;
			}

			if (props.onFocus) {
				props.onFocus(ev);
			}
		}, [props, state.ready]);

		const wrappedComponentProps = Object.assign({}, props);
		delete wrappedComponentProps.handleSpotlightPause;

		return (
			<WrappedWithRef {...wrappedComponentProps} onFocus={handleFocus} outermostRef={clientSiblingRef} referrerName="DropdownList" scrollTo={setScrollTo} />
		);
	};

	DropdownListSpotlightDecorator.displayName = 'DropdownListSpotlightDecorator';

	DropdownListSpotlightDecorator.propTypes = {
		/*
         * Passed by DropdownBase to resume Spotlight
         *
         * @type {Function}
         */
		handleSpotlightPause: PropTypes.func,

		/*
         * Called when an item receives focus.
         *
         * @type {Function}
         */
		onFocus: PropTypes.func,

		/*
         * Index of the selected item.
         *
         * @type {Number}
         */
		selected: PropTypes.number
	};

	return DropdownListSpotlightDecorator;
});

const DropdownListDecorator = (compose as any)(
	DropdownListSpotlightDecorator,
	(IdProvider as any)({
		generateProp: null,
		prefix: 'dl_'
	}),
	(Skinnable as any)({variantsProp: 'skinVariants'})
);

const DropdownList = DropdownListDecorator(DropdownListBase);

export default DropdownList;
export {
	DropdownList,
	DropdownListBase,
	isSelectedValid
};
