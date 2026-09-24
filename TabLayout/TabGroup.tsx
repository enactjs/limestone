import handle, {forProp, forward, forwardCustom, not} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Group from '@enact/ui/Group';
import IdProvider from '@enact/ui/internal/IdProvider';
import {Layout} from '@enact/ui/Layout';
import Toggleable from '@enact/ui/Toggleable';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useMemo, useRef} from 'react';
import type {ComponentType, ReactNode} from 'react';

import $L from '../internal/$L';
import DebounceDecorator from '../internal/DebounceDecorator';
import Button from '../Button';
import Skinnable from '../Skinnable';
import {ScrollerBase} from '../Scroller';
import Sprite from '../Sprite';

import componentCss from './TabGroup.module.less';

interface TabBaseProps {
	buttonSize?: string;
	collapsed?: boolean;
	css?: Record<string, string>;
	icon?: string;
	index?: number;
	noIcons?: boolean;
	onFocusTab?: (...args: any[]) => any;
	onTabClick?: (...args: any[]) => any;
	orientation?: string;
	selected?: boolean;
	sprite?: Record<string, any>;
	stopped?: boolean;
	children?: ReactNode;
	primaryIndex?: number | null;
	primaryTabSpotlightId?: string;
	[key: string]: any;
}

const TabBase = kind<TabBaseProps>({
	name: 'Tab',

	_propTypes: {} as TabBaseProps,

	propTypes: {
		buttonSize: PropTypes.string,
		collapsed: PropTypes.bool,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		icon: PropTypes.string,
		index: PropTypes.number,
		noIcons: PropTypes.bool,
		onFocusTab: PropTypes.func,
		onTabClick: PropTypes.func,
		orientation: PropTypes.string,
		selected: PropTypes.bool,
		sprite: PropTypes.object,
		stopped: PropTypes.bool
	},

	defaultProps: {
		orientation: 'vertical'
	},

	styles: {
		css: componentCss,
		className: 'tab',
		publicClassNames: ['bg', 'button', 'client', 'icon', 'selected', 'tab', 'vertical']
	},

	handlers: {
		onClick: handle(
			forward('onClick'),
			not(forProp('disabled', true)),
			forwardCustom('onTabClick', (ev, {index}) => ({selected: index}))
		),
		onFocus: handle(
			forward('onFocus'),
			not(forProp('disabled', true)),
			() => !Spotlight.getPointerMode(),
			forwardCustom('onFocusTab', (ev, {index}) => ({selected: index}))
		)
	},

	computed: {
		className: ({collapsed, noIcons, orientation, styler}) => styler.append({collapsed, noIcons: noIcons}, orientation),
		iconComponent: ({sprite, stopped}) => {
			if (sprite) {
				return (<Sprite stopped={stopped} {...sprite} />);
			}
		}
	},

	render: ({buttonSize, index, children, collapsed, css, primaryIndex, primaryTabSpotlightId, orientation, ...rest}) => {
		delete rest.noIcons;
		delete rest.onFocusTab;
		delete rest.onTabClick;
		delete rest.stopped;
		delete rest.sprite;

		if (collapsed) children = null;
		if (orientation === 'horizontal') delete rest.icon;

		const commonProps = {
			backgroundOpacity: 'transparent',
			children,
			collapsable: true,
			css,
			focusEffect: 'static',
			minWidth: false,
			role: 'tab',
			spotlightId: index === primaryIndex ? primaryTabSpotlightId : null
		};

		switch (orientation) {
			// Horizontal Cell sizing can auto-size width or be set to a finite value, stretching the Button.
			case 'horizontal': {
				return (
					<Button
						size={buttonSize}
						{...(rest as any)}
						{...commonProps}
					/>
				);
			}
			case 'vertical': {
				// Vertical sizing depends on Button establishing the dimensions of the Cell.
				return (
					<Button
						{...(rest as any)}
						{...commonProps}
					/>
				);
			}
		}
	}
});

const Tab = Toggleable({prop: 'stopped', activate: 'onBlur', deactivate: 'onFocus'}, Skinnable(TabBase));

const spotlightContainerConfig = {
	// using default-element so we always land on the selected tab in order to avoid changing
	// the view when re-entering the tab group
	defaultElement: `.${componentCss.selected}`,
	enterTo: 'default-element',
	partition: true,
	// When swapping from unscrolled to scrolled tab group, the container config is lost so this
	// preserves it across unmounts / remounts
	preserveId: true
};

const Scroller = Skinnable(
	SpotlightContainerDecorator(
		{
			...spotlightContainerConfig,
			overflow: true
		} as any,
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollerBase
		)
	)
);

const GroupContainer = SpotlightContainerDecorator(spotlightContainerConfig, Group);

export interface TabData {
	icon?: string;
	title?: string;
	tabKey?: string | number;
	sprite?: Record<string, any>;
	disabled?: boolean;
	spotlightDisabled?: boolean;
	onTabClick?: (...args: any[]) => any;
	[key: string]: any;
}

export interface TabGroupBaseProps {
	tabs: TabData[];
	collapsed?: boolean;
	css?: Record<string, string>;
	id?: string;
	onBlur?: (...args: any[]) => any;
	onBlurList?: (...args: any[]) => any;
	onClick?: (...args: any[]) => any;
	onFocus?: (...args: any[]) => any;
	onFocusTab?: (...args: any[]) => any;
	onScrollStop?: (...args: any[]) => any;
	onSelect?: (...args: any[]) => any;
	orientation?: string;
	primaryIndex?: number | null;
	scrollPosition?: {x: number; y: number};
	selectedIndex?: number | null;
	size?: string;
	spotlightDisabled?: boolean;
	spotlightId?: string;
	scrollable?: boolean;
	children?: ReactNode;
	[key: string]: any;
}

/**
 * A group of tabs
 *
 * @class TabGroup
 * @memberof limestone/TabLayout
 * @ui
 * @private
 */
const TabGroupBase = kind<TabGroupBaseProps>({
	name: 'TabGroup',

	functional: true,

	_propTypes: {} as TabGroupBaseProps,

	propTypes: /** @lends limestone/TabGroup.TabGroup.prototype */ {
		tabs: PropTypes.array.isRequired,
		collapsed: PropTypes.bool,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		id: PropTypes.string,
		onBlur: PropTypes.func,
		onBlurList: PropTypes.func,
		onFocus: PropTypes.func,
		onFocusTab: PropTypes.func,
		onScrollStop: PropTypes.func,
		onSelect: PropTypes.func,
		orientation: PropTypes.string,
		scrollPosition: PropTypes.object as PropTypes.Validator<{x: number; y: number} | undefined>,
		selectedIndex: PropTypes.number,
		size: PropTypes.string,
		spotlightDisabled: PropTypes.bool,
		spotlightId: PropTypes.string
	},

	styles: {
		css: componentCss,
		className: 'tabGroup',
		publicClassNames: ['bg', 'button', 'client', 'icon', 'selected', 'tab', 'tabGroup', 'vertical']
	},

	computed: {
		className: ({collapsed, scrollable, orientation, styler}) => styler.append({collapsed, scrollable}, orientation),
		// check if there's no tab icons
		noIcons: ({collapsed, orientation, tabs}) => orientation === 'vertical' && collapsed && tabs.filter((tab: TabData) => (!tab.icon && !tab.sprite)).length,
		tabsDisabled: ({tabs}) => tabs.find((tab: TabData) => tab && !tab.disabled) == null,
		tabsSpotlightDisabled: ({spotlightDisabled, tabs}) => spotlightDisabled || tabs.find((tab: TabData) => tab && !tab.spotlightDisabled) == null
	},

	render: ({css, collapsed, scrollable, id, noIcons, onBlur, onBlurList, onFocus, onFocusTab, onScrollStop, onSelect, orientation, primaryIndex, scrollPosition, selectedIndex, size, spotlightId, spotlightDisabled, tabs, tabsDisabled, tabsSpotlightDisabled, ...rest}) => {
		delete rest.children;

		const primaryTabSpotlightId = `${spotlightId}-primary-tab`;
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const itemProps = useMemo(() => ({
			buttonSize: size,
			css,
			collapsed,
			orientation,
			primaryIndex: collapsed ? null : primaryIndex,
			primaryTabSpotlightId
		}), [css, collapsed, orientation, primaryIndex, primaryTabSpotlightId, size]);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const children = useMemo(() => tabs.map((tab: TabData) => {
			if (tab) {
				const {icon, title, tabKey, sprite, ...restTab} = tab;
				const key = tabKey || tabKey === 0 ? tabKey : `tabs_${title + (typeof icon === 'string' ? icon : '')}`;

				return {
					children: title,
					defaultStopped: Boolean(sprite),
					icon,
					key,
					onFocusTab,
					sprite,
					...restTab
				};
			} else {
				return null;
			}
		}).filter((tab: TabData | null) => tab != null), [onFocusTab, tabs]);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const scrollToRef = useRef<any>(null);

		const isHorizontal = orientation === 'horizontal';
		const groupComponent = (isHorizontal ? Layout : 'div'); // Only horizontal needs the arrangement capabilities of `Layout`

		const groupProps = scrollable ? null : {
			spotlightId,
			spotlightDisabled
		};
		const scrollerProps = scrollable ? {
			cbScrollTo: (scrollTo: any) => {
				scrollToRef.current = (collapsed ? scrollTo : null);
			},
			direction: isHorizontal ? 'horizontal' : 'vertical',
			horizontalScrollbar: 'hidden',
			hoverToScroll: !collapsed,
			noScrollByWheel: collapsed,
			onScrollStop,
			scrollbarTrackCss: componentCss,
			scrollToContentContainerOnFocus: false,
			spotlightDisabled,
			spotlightId,
			verticalScrollbar: collapsed ? 'hidden' : 'auto'
		} : null;
		const Component = (scrollable ? Scroller : 'div') as ComponentType<any> | 'div';
		const GroupComponent = (scrollable ? Group : GroupContainer) as ComponentType<any>;

		if (!scrollable) scrollToRef.current = null;
		if (!noIcons && scrollToRef.current) {
			scrollToRef.current({animate: false, position: scrollPosition});
		}

		return (
			<Component
				{...rest}
				onBlur={onBlur}
				onFocus={onFocus}
				{...scrollerProps}
			>
				{noIcons ? (
					<TabBase
						collapsed
						disabled={tabsDisabled}
						icon="list"
						noIcons
						onSpotlightDisappear={onBlurList}
						spotlightDisabled={tabsSpotlightDisabled}
					/>
				) : (
					<div role="region" aria-labelledby={`${id}_tabgroup`}>
						<GroupComponent
							id={`${id}_tabgroup`}
							childComponent={Tab}
							aria-label={`${new IString($L('{total} items in total')).format({'total': tabs.length})}`}
							className={componentCss.tabs}
							component={groupComponent}
							indexProp="index"
							itemProps={itemProps}
							onSelect={onSelect}
							orientation={orientation}
							role="tablist"
							select="radio"
							selected={selectedIndex}
							selectedProp="selected"
							{...groupProps}
						>
							{children as any}
						</GroupComponent>
					</div>
				)}
			</Component>
		);
	}
});

const TabGroupDecorator = (compose as any)(
	DebounceDecorator({cancel: 'onBlur', debounce: 'onFocusTab', delay: 300}),
	IdProvider({
		generateProp: null,
		prefix: 'tg_'
	})
);

// Only documenting TabGroup since base is not useful for extension as-is
const TabGroup = TabGroupDecorator(TabGroupBase) as ComponentType<TabGroupBaseProps>;

export default TabGroup;
export {
	TabGroup
};
