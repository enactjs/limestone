import classnames from 'classnames';
import handle, {forward} from '@enact/core/handle';
import useHandlers from "@enact/core/useHandlers";
import {mapAndFilterChildren, setDefaultProps, usePrevious} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Children, cloneElement, createContext, use, useCallback, useEffect, useLayoutEffect, useRef} from 'react';

import SharedStateDecorator, {SharedState} from '../SharedStateDecorator';

import {startCapture, stopCapture} from './captureKeys';
import {ContextAsDefaults} from './util';

import css from './Viewport.module.less';

const PanelsStateContext = createContext({});

const viewPortBaseDefaultProps = {
	index: 0,
	noAnimation: typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION
};

const viewPortBaseHandlers = {
	onTransition: handle(
		forward('onTransition'),
		(ev, props, {removeTransitioningClass}) => {
			removeTransitioningClass();
		},
		(ev, props, {resume}) => {
			resume();
		}
	),
	onWillTransition: handle(
		forward('onWillTransition'),
		(ev, props, {addTransitioningClass}) => {
			addTransitioningClass();
		},
		(ev, props, {pause}) => {
			pause();
		}
	)
};

const mapChildren = (childrenList, getSpotlightId, autoFocus, direction) => {
	return mapAndFilterChildren(childrenList, (child, dataIndex) => {
		const {spotlightId = getSpotlightId(dataIndex, 'panel-container', Spotlight.remove)} = child.props;
		const localProps = {
			spotlightId,
			'data-index': dataIndex
		};

		// Respect Panel-configured autoFocus if it is set
		if (child.props.autoFocus == null) {
			if (autoFocus) {
				// if not and Viewport-wide autoFocus is configured, use it
				localProps.autoFocus = autoFocus;
			} else if (direction === 'forward') {
				// Otherwise, only set autofocus when moving forward
				localProps.autoFocus = 'default-element';
			}
		}

		return cloneElement(child, localProps);
	});
};

/**
 * The container for a set of Panels
 *
 * @class Viewport
 * @memberof limestone/Panels
 * @private
 */
const ViewportBase = (componentProps) => {
	const props = setDefaultProps(componentProps, viewPortBaseDefaultProps);
	const {arranger, autoFocus, children, generateId, index, noAnimation, rtl, type, ...rest} = props;

	const context = use(SharedState);
	const prevIndex = usePrevious(index);
	const nodeRef = useRef();
	const paused = useRef(new Pause('Viewport'));

	const direction = prevIndex != null && prevIndex > index ? 'backward' : 'forward';
	const enteringProp = noAnimation ? null : 'hideChildren';
	const mappedChildren = mapChildren(children, generateId, autoFocus, direction);
	const className = classnames(css.viewport, rest.className);

	const count = Children.count(mappedChildren);
	invariant(
		index === 0 && count === 0 || index < count,
		`Panels index, ${index}, is invalid for number of children, ${count}`
	);

	// Relay each of the state-specific props to the context
	const panelsContext = {
		type,
		index,
		count
	};

	const pause = useCallback(() => {
		startCapture();
		paused.current.pause();
	}, []);

	const resume = useCallback(() => {
		stopCapture();
		paused.current.resume();
	}, []);

	const addTransitioningClass = useCallback(() => {
		if (nodeRef.current) {
			nodeRef.current.classList.add(css.transitioning);
		}

		return true;
	}, []);

	const removeTransitioningClass = useCallback(() => {
		if (nodeRef.current) {
			nodeRef.current.classList.remove(css.transitioning);
		}

		return true;
	}, []);

	const handlers = useHandlers(viewPortBaseHandlers, props, {addTransitioningClass, removeTransitioningClass, pause, resume});

	useLayoutEffect(() => {
		if (prevIndex != null && index !== prevIndex) {
			const current = Spotlight.getCurrent();
			// :scope refers to the current node and allows us to use the direct descendant '>'
			// selector to limit the results to views (and not other components with [data-index])
			const panel = nodeRef.current?.querySelector(`:scope > [data-index='${prevIndex}']`);

			if (current && panel && panel.contains(current)) {
				current.blur();
			}
		}
	}, [index, prevIndex]);

	useEffect(() => {
		if (prevIndex !== null) {
			for (let i = prevIndex; context && i > index; i--) {
				context.delete(i);
			}
		}
	}, [context, index, prevIndex]);

	useLayoutEffect(() => {
		return () => {
			resume();
		};
	}, [resume]);

	delete rest.className;
	return (
		<PanelsStateContext value={panelsContext}>
			<ViewManager
				{...rest}
				arranger={arranger}
				className={className}
				component="main"
				duration={250}
				enteringDelay={100} // TODO: Can we remove this?
				enteringProp={enteringProp}
				index={index}
				noAnimation={noAnimation}
				onTransition={handlers.handleTransition}
				onWillTransition={handlers.handleWillTransition}
				ref={nodeRef}
				rtl={rtl}
			>
				{mappedChildren}
			</ViewManager>
		</PanelsStateContext>
	);
};

ViewportBase.displayName = 'Viewport';
ViewportBase.propTypes = /** @lends limestone/Panels.Viewport.prototype */ {

	/**
	 * A function that generates a globally-unique identifier for a panel index
	 *
	 * @type {Function}
	 * @required
	 */
	generateId: PropTypes.func.isRequired,

	/**
	 * Set of functions that control how the panels are transitioned into and out of the
	 * viewport
	 *
	 * @type {Arranger}
	 */
	arranger: shape,

	/**
	 * Forwarded as `autoFocus` to each panel.
	 *
	 * If the `Panel` already has an `autoFocus` prop, it is maintained.
	 *
	 * Otherwise, if `autoFocus` is set, the value of this prop is added to the props. If it is
	 * unset, 'default-element' is passed when navigating to a higher index.
	 *
	 * @type {String}
	 */
	autoFocus: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the back button.
	 *
	 * @type {String}
	 */
	backButtonAriaLabel: PropTypes.string,

	/**
	 * The background opacity of the application back button.
	 *
	 * @type {('opaque'|'transparent')}
	 */
	backButtonBackgroundOpacity: PropTypes.oneOf(['opaque', 'transparent']),

	/**
	 * Panels to be rendered
	 *
	 * @type {Panel}
	 */
	children: PropTypes.node,

	/**
	 * Hint string read when focusing the application close button.
	 *
	 * @type {String}
	 */
	closeButtonAriaLabel: PropTypes.string,

	/**
	 * Background opacity of the application close button.
	 *
	 * @type {('opaque'|'transparent')}
	 */
	closeButtonBackgroundOpacity: PropTypes.oneOf(['opaque', 'transparent']),

	/**
	 * Index of the active panel
	 *
	 * @type {Number}
	 * @default 0
	 */
	index: PropTypes.number,

	/**
	 * Disable panel transitions
	 *
	 * @type {Boolean}
	 * @default false
	 */
	noAnimation: PropTypes.bool,

	/**
	 * Omits the back button.
	 *
	 * @type {Boolean}
	 */
	noBackButton: PropTypes.bool,

	/**
	 * Omits the close button.
	 *
	 * @type {Boolean}
	 */
	noCloseButton: PropTypes.bool,

	/**
	 * Called with cancel/back key events.
	 *
	 * @type {Function}
	 */
	onBack: PropTypes.func,

	/**
	 * Called when the app close button is clicked.
	 *
	 * @type {Function}
	 */
	onClose: PropTypes.func,

	/**
	 * Passed to `arranger` for use in determining how to animate.
	 *
	 * @type {Boolean}
	 */
	rtl: PropTypes.bool,

	type: PropTypes.string
};

const ViewportDecorator = compose(
	ContextAsDefaults,
	SharedStateDecorator,
	I18nContextDecorator({rtlProp: 'rtl'})
);

const Viewport = ViewportDecorator(ViewportBase);

export default Viewport;
export {
	PanelsStateContext,
	Viewport,
	ViewportBase,
	ViewportDecorator
};
