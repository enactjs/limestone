/**
 * Provides a floating component suitable for grouping collections of managed views.
 *
 * @module limestone/PopupTabLayout
 * @exports PopupTabLayout
 * @exports Tab
 * @exports TabPanels
 * @exports TabPanelsBase
 * @exports TabPanel
 */

import {forKey, forProp, forward, forwardCustom, handle, preventDefault, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import useHandlers from '@enact/core/useHandlers';
import {cap, checkPropTypes} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {getContainersForNode, getContainerNode} from '@enact/spotlight/src/container';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import {IdProvider} from '@enact/ui/internal/IdProvider';
import PropTypes from 'prop-types';
import {Component, use, useEffect} from 'react';
import compose from 'ramda/src/compose';

import Skinnable from '../Skinnable';
import Panels, {Panel} from '../Panels';
import TabLayout, {TabLayoutContext, Tab} from '../TabLayout';
import Popup from '../Popup';

import {PopupTabLayoutStateContext} from './PopupTabLayoutStateContext';

import componentCss from './PopupTabLayout.module.less';

// List all the props from PopupTabLayout that we want to move from this component's root onto PopupTabLayout.
const popupPropList = ['noAutoDismiss', 'onHide', 'onKeyDown', 'onShow', 'open',
	'position', 'prerender', 'scrimType', 'spotlightId', 'spotlightRestrict', 'id', 'className',
	'style', 'noAnimation', 'onClose'];

const OptimizedContainer = SpotlightContainerDecorator(
	{enterTo: 'default-element', preserveId: true},
	'div'
);

/**
 * Tabbed Layout component in a floating Popup.
 *
 * @class PopupTabLayoutBase
 * @memberof limestone/PopupTabLayout
 * @extends limestone/Popup.Popup
 * @extends limestone/TabLayout.TabLayout
 * @ui
 * @public
 */
const PopupTabLayoutBase = kind({
	name: 'PopupTabLayout',

	propTypes: /** @lends limestone/PopupTabLayout.PopupTabLayoutBase.prototype */ {
		/**
		 * Collection of {@link limestone/PopupTabLayout.Tab|Tabs} to render.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Collapses the vertical tab list into icons only.
		 *
		 * Only applies to `orientation="vertical"`.  If the tabs do not include icons, a single
		 * collapsed icon will be shown.
		 *
		 * @type {Boolean}
		 * @public
		 */
		collapsed: PropTypes.bool,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		 * Specify dimensions for the layout areas.
		 *
		 * All 4 combinations must be supplied: each of the elements, tabs and content in both
		 * collapsed and expanded state.
		 *
		 * @type {{tabs: {collapsed: Number, normal: Number}, content: {expanded: number, normal: number}}}
		 * @default {
		 * 	tabs: {
		 * 		collapsed: 236,
		 * 		normal: 660
		 * 	},
		 * 	content: {
		 * 		expanded: 1320,
		 * 		normal: 1320
		 * 	}
		 * }
		 * @private
		 */
		dimensions: PropTypes.shape({
			content: PropTypes.shape({
				expanded: PropTypes.number.isRequired,
				normal: PropTypes.number.isRequired
			}).isRequired,
			tabs: PropTypes.shape({
				collapsed: PropTypes.number.isRequired,
				normal: PropTypes.number.isRequired
			}).isRequired
		}),

		/**
		 * The currently selected tab.
		 *
		 * @type {Number}
		 * @public
		 */
		index: PropTypes.number,

		/**
		 * Disables transition animation.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Called when the tabs are collapsed.
		 *
		 * @type {Function}
		 * @public
		 */
		onCollapse: PropTypes.func,

		/**
		 * Called when the tabs are expanded.
		 *
		 * @type {Function}
		 * @public
		 */
		onExpand: PropTypes.func,

		/**
		 * Called after the popup's "hide" transition finishes.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Called when a tab is selected
		 *
		 * @type {Function}
		 * @public
		*/
		onSelect: PropTypes.func,

		/**
		 * Called after the popup's "show" transition finishes.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

		/**
		 * Called when the tab collapse or expand animation completes.
		 *
		 * Event payload includes:
		 * * `type` - Always set to "onTabAnimationEnd"
		 * * `collapsed` - `true` when the tabs are collapsed
		 *
		 * @type {Function}
		 * @public
		 */
		onTabAnimationEnd: PropTypes.func,

		/**
		 * Controls the visibility of the Popup.
		 *
		 * By default, the Popup and its contents are not rendered until `open`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Optimizes PopupTabLayout without Popup when true.
		 *
		 * @type {Boolean}
		 * @public
		 */
		optimized: PropTypes.bool,

		/**
		 * Orientation of the tabs.
		 *
		 * @type {('vertical')}
		 * @private
		 */
		orientation: PropTypes.oneOf(['vertical']),

		/**
		 * Position of the Popup on the screen.
		 *
		 * @type {'left'}
		 * @default 'left'
		 * @private
		 */
		position: PropTypes.oneOf(['left']),

		/**
		 * Enables prerendering support.
		 *
		 * When `true`, the popup content is rendered inline on the first render and relocated into
		 * the floating layer via a portal once mounted, so the `PopupTabLayout` can be captured in
		 * prerendered HTML and hydrate without a mismatch. Unlike `optimized`, this keeps the full
		 * {@link limestone/Popup.Popup|Popup}/`FloatingLayer` behavior.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		prerender: PropTypes.bool,

		/**
		 * Scrim type.
		 *
		 * * Values: `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * `'none'` is not compatible with `spotlightRestrict` of `'self-only'`, use a transparent scrim
		 * to prevent mouse focus when using popup.
		 *
		 * @type {('transparent'|'translucent'|'none')}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),

		/**
		 * The container id for {@link spotlight/SpotlightContainerDecorator/#SpotlightContainerDecorator.spotlightId|Spotlight container}.
		 *
		 * @type {String}
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * Restricts or prioritizes navigation when focus attempts to leave the popup.
		 *
		 * It can be either `'none'`, `'self-first'`, or `'self-only'`.
		 *
		 * Note: The ready-to-use {@link limestone/Popup.Popup|Popup} component only supports
		 * `'self-first'` and `'self-only'`.
		 *
		 * @type {('none'|'self-first'|'self-only')}
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
	},

	defaultProps: {
		dimensions: {
			tabs: {
				collapsed: 216,
				normal: 660
			},
			content: {
				expanded: 1320,
				normal: 1320
			}
		},
		orientation: 'vertical',
		position: 'left',
		scrimType: 'translucent'
	},

	styles: {
		css: componentCss,
		className: 'popupTabLayout',
		publicClassNames: ['bg', 'button', 'collapsed', 'content', 'panels', 'popupTabLayout', 'scrimTranslucent', 'selected', 'tab', 'tabGroup', 'tabLayout', 'tabs', 'tabsExpanded', 'vertical']
	},

	computed: {
		className: ({collapsed, optimized, scrimType, styler}) => styler.append({collapsed, optimized}, `scrim${cap(scrimType)}`),
		noAnimation: ({noAnimation}) => (typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) || noAnimation,
		PopupComponent: ({optimized}) => optimized ? OptimizedContainer : Popup
	},

	render: ({children, css, optimized, PopupComponent, ...rest}) => {
		// Extract all relevant popup props
		const popupProps = {};
		for (const prop in rest) {
			if (popupPropList.indexOf(prop) >= 0) {
				popupProps[prop] = rest[prop];
				delete rest[prop];
			}
		}

		if (!optimized) {
			popupProps.noAlertRole = true;
			popupProps.noOutline = true;
			popupProps.css = css;
		} else {
			delete popupProps.noAnimation;
			delete popupProps.noAutoDismiss;
			delete popupProps.onHide;
			delete popupProps.onShow;
			delete popupProps.prerender;
			delete popupProps.scrimType;
		}

		return (
			<PopupTabLayoutStateContext value={{type: 'popupTabLayout'}}>
				<PopupComponent {...popupProps}>
					<TabLayout
						{...rest}
						css={css}
						align="start"
						anchorTo="left"
						type="popup"
					>
						{children}
					</TabLayout>
				</PopupComponent>
			</PopupTabLayoutStateContext>
		);
	}
});

const OptimizedFocusDecorator = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'OptimizedFocusDecorator';

		static propTypes = /** @lends limestone/PopupTabLayout.OptimizedFocusDecorator.prototype */ {
			/**
			 * Controls the visibility of the PopupTabLayout.
			 *
			 * @type {Boolean}
			 * @private
			 */
			open: PropTypes.bool,

			/**
			 * Optimizes PopupTabLayout without Popup when true.
			 *
			 * @type {Boolean}
			 * @public
			 */
			optimized: PropTypes.bool,

			/**
			 * The container id.
			 *
			 * @type {String}
			 * @private
			 */
			spotlightId: PropTypes.string
		};

		constructor (props) {
			super(props);
			if (props.optimized) {
				this.paused = new Pause('PopupTabLayout');
				if (props.open) {
					this.paused.pause();
				}
			}
		}

		componentDidMount () {
			if (this.props.optimized && this.props.open) {
				this.paused.resume();
				Spotlight.focus(this.props.spotlightId);
			}
		}

		componentDidUpdate (prevProps) {
			if (this.props.optimized && this.props.open !== prevProps.open) {
				if (this.props.open) {
					Spotlight.focus(this.props.spotlightId);
				}
			}
		}

		render () {
			if (this.props.optimized) {
				return <Wrapped {...this.props} style={!this.props.open ? {display: 'none'} : null} />;
			} else {
				return <Wrapped {...this.props} />;
			}
		}
	};
});


/**
 * Add behaviors to PopupTabLayout.
 *
 * @class PopupTabLayoutDecorator
 * @memberof limestone/PopupTabLayout
 * @mixes limestone/Skinnable.Skinnable
 * @hoc
 * @public
 */
const PopupTabLayoutDecorator = compose(
	IdProvider({idProp: 'spotlightId', prefix: 'lime-popuptablayout-', generateProp: null}),
	OptimizedFocusDecorator,
	Skinnable
);

/**
 * An instance of {@link limestone/Popup.Popup|Popup} which restricts the `TabLayout` content to
 * the left side of the screen. The content of `TabLayout` can flex vertically, but not horizontally
 * (fixed width). This is typically used to switch between several collections of managed views
 * (`TabPanels` and `TabPanel`, also exported from this module).
 *
 * Example:
 *
 * ```jsx
 * 	<PopupTabLayout>
 * 		<Tab title="Tab One">
 * 			<TabPanels>
 * 				<TabPanel>
 * 					<Header title="First Panel" type="compact" />
 * 					<Item>Item 1 in Panel 1</Item>
 * 					<Item>Item 2 in Panel 1</Item>
 * 				</TabPanel>
 * 				<TabPanel>
 * 					<Header title="Second Panel" type="compact" />
 * 					<Item>Item 1 in Panel 2</Item>
 * 					<Item>Item 2 in Panel 2</Item>
 * 				</TabPanel>
 * 			</TabPanels>
 * 		</Tab>
 * 		<Tab title="Tab Two">
 * 			<Item>Goodbye</Item>
 * 		</Tab>
 * 	</PopupTabLayout>
 * ```
 *
 * @class PopupTabLayout
 * @memberof limestone/PopupTabLayout
 * @ui
 * @public
 */
const PopupTabLayout = PopupTabLayoutDecorator(PopupTabLayoutBase);

/**
 * A shortcut to access {@link limestone/PopupTabLayout.Tab}
 *
 * @name Tab
 * @type {limestone/PopupTabLayout.Tab}
 * @memberof limestone/PopupTabLayout.PopupTabLayout
 * @extends limestone/TabLayout.Tab
 */
PopupTabLayout.Tab = Tab;

/**
 * A Tab for use inside this component.
 *
 * @class Tab
 * @memberof limestone/PopupTabLayout
 * @extends limestone/TabLayout.Tab
 * @ui
 */

const tabPanelsHandlers = {
	onTransition: handle(
		forward('onTransition'),
		(ev, props, {onTransition}) => {
			onTransition(ev);
		}
	),
	onKeyDown: handle(
		forward('onKeyDown'),
		({target}) => (target.tagName !== 'INPUT'),
		forProp('rtl', false),
		forKey('left'),
		(ev, {index}) => (index > 0),
		({target}) => {
			const next = getTargetByDirectionFromElement('left', target);
			if (next === null || (next && !getContainerNode(getContainersForNode(target).pop()).contains(next))) {
				return true;
			}
			return false;
		},
		(ev) => {
			if (getContainerNode(getContainersForNode(ev.target).pop()).tagName === 'HEADER') {
				ev.stopPropagation();
				return false;
			}
			return document.querySelector(`section.${componentCss.body}`).contains(ev.target);
		},
		forwardCustom('onBack'),
		() => {
			Spotlight.setPointerMode(false);
			return true;
		},
		preventDefault,
		stop
	)
};

/**
 * A base component for {@link limestone/PopupTabLayout.TabPanels|TabPanels} which has
 * left key handler to navigate panels.
 *
 * @class TabPanelsBase
 * @memberof limestone/PopupTabLayout
 * @extends limestone/Panels.Panels
 * @ui
 * @public
 */
const TabPanelsBase = (props) => {
	checkPropTypes(TabPanelsBase, props);
	const {rtl, ...rest} = props;

	const onTransition = use(TabLayoutContext);
	const handlers = useHandlers(tabPanelsHandlers, {rtl, ...rest}, {onTransition});

	return <Panels noCloseButton {...rest} css={componentCss} {...handlers} />;
};

TabPanelsBase.propTypes = {
	rtl: PropTypes.bool
};

/**
 * A customized version of Panels for use inside this component.
 *
 * @class TabPanels
 * @memberof limestone/PopupTabLayout
 * @extends limestone/PopupTabLayout.TabPanelsBase
 * @ui
 * @public
 */
const TabPanels = I18nContextDecorator(
	{rtlProp: 'rtl'},
	TabPanelsBase
);

/**
 * Omits the close button.
 *
 * Unlike most components, this prop defaults to `true`. To show the close button, the prop must
 * explicitly set it to `false`:
 *
 * ```
 * <TabPanels noCloseButton={false} />
 * ```
 *
 * @name noCloseButton
 * @memberof limestone/PopupTabLayout.TabPanels.prototype
 * @type {Boolean}
 * @default true
 * @public
 */

/**
 * A customized version of Panel for use inside this component.
 *
 * @class TabPanel
 * @memberof limestone/PopupTabLayout
 * @extends limestone/Panels.Panel
 * @ui
 * @public
 */
const TabPanel = (props) => {
	checkPropTypes(TabPanel, props);
	const {spotlightId, ...rest} = props;

	useEffect(() => {
		Spotlight.set(spotlightId, {partition: true});
	}, [spotlightId]);

	return (
		<Panel {...rest} css={componentCss} hideChildren={false} spotlightId={spotlightId} />
	);
};

TabPanel.propTypes = {
	/**
	 * The container id for {@link spotlight/SpotlightContainerDecorator/#SpotlightContainerDecorator.spotlightId|Spotlight container}.
	 *
	 * @type {String}
	 * @private
	 */
	spotlightId: PropTypes.string
};


export default PopupTabLayout;
export {
	PopupTabLayout,
	PopupTabLayoutBase,
	PopupTabLayoutDecorator,
	Tab,
	TabPanels,
	TabPanelsBase,
	TabPanel
};
