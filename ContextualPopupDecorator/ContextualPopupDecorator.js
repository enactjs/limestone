/* global MutationObserver ResizeObserver */

/**
 * A higher-order component to add a Limestone styled popup to a component.
 *
 * @module limestone/ContextualPopupDecorator
 * @exports	ContextualPopup
 * @exports	ContextualPopupDecorator
 */

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {on, off} from '@enact/core/dispatcher';
import {handle, forProp, forKey, forward, forwardCustom, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {WithRef} from '@enact/core/internal/WithRef';
import {extractAriaProps, setDefaultProps} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import FloatingLayer from '@enact/ui/FloatingLayer';
import ri from '@enact/ui/resolution';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useRef, useState} from 'react';

import {ContextualPopup} from './ContextualPopup';
import HolePunchScrim from './HolePunchScrim';

import css from './ContextualPopupDecorator.module.less';

const PositionToDirection = {
	above: 'up',
	below: 'down',
	left: 'left',
	right: 'right'
};

/**
 * Default config for {@link limestone/ContextualPopupDecorator.ContextualPopupDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator
 */
const defaultConfig = {
	/**
	 * `ContextualPopup` without the arrow.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noArrow: false,

	/**
	 * Disables passing the `skin` prop to the wrapped component.
	 *
	 * @see {@link limestone/Skinnable.Skinnable.skin}
	 * @type {Boolean}
	 * @default false
	 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noSkin: false,

	/**
	 * The prop in which to pass the value of `open` state of ContextualPopupDecorator to the
	 * wrapped component.
	 *
	 * @type {String}
	 * @default 'selected'
	 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	openProp: 'selected'
};

const contextualPopupDecoratorDefaultProps = {
	'data-webos-voice-exclusive': true,
	direction: 'below center',
	noAutoDismiss: false,
	offset: 'small',
	open: false,
	scrimType: 'none',
	spotlightRestrict: 'self-first'
};

const ContextualPopupContainer = SpotlightContainerDecorator(
	{enterTo: 'default-element', preserveId: true},
	ContextualPopup
);

const Decorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noArrow, noSkin, openProp} = config;
	const WrappedWithRef = WithRef(Wrapped);

	// eslint-disable-next-line no-shadow
	const ContextualPopupDecorator = (props) => {
		const componentProps = setDefaultProps(props, contextualPopupDecoratorDefaultProps);

		const [activator, setActivator] = useState(null);
		const [arrowPosition, setArrowPosition] = useState({top: 0, left: 0});
		const [containerPosition, setContainerPosition] = useState({top: 0, left: 0, right: 0});
		const [direction, setDirection] = useState('');

		const adjustedDirection = useRef(componentProps.direction);
		const containerId = useRef(Spotlight.add(componentProps.popupSpotlightId));
		const containerNode = useRef(null);
		const clientSiblingRef = useRef(null);
		const overflow = useRef({});
		const mutationObserver = useRef(null);
		const prevProps = useRef(componentProps);
		const snapshot = useRef(null);
		const resizeObserver = useRef(null);

		const MARGIN = ri.scale(noArrow ? 0 : 12);
		const ARROW_WIDTH = noArrow ? 0 : ri.scale(60); // svg arrow width.
		const ARROW_OFFSET = noArrow ? 0 : ri.scale(36); // actual distance of the svg arrow displayed to offset overlaps with the container. Offset is when `noArrow` is false.
		const KEEPOUT = ri.scale(24); // keep out distance on the edge of the screen

		if (componentProps.setApiProvider) {
			componentProps.setApiProvider();
		}

		const generateId = useCallback(() => {
			return Math.random().toString(36).substring(2, 10);
		}, []);

		const id = useRef(generateId());

		const adjustRTL = useCallback((position) => {
			let pos = position;
			if (componentProps.rtl) {
				const tmpLeft = pos.left;
				pos.left = pos.right;
				pos.right = tmpLeft;
			}
			return pos;
		}, [componentProps]);

		const getContainerAdjustedPosition = useCallback(() => {
			const position = adjustedDirection.current;
			const arr = adjustedDirection.current.split(' ');
			// eslint-disable-next-line no-shadow
			let direction = null;
			let anchor = null;

			if (arr.length === 2) {
				[direction, anchor] = arr;
			} else {
				direction = position;
			}

			return {anchor, direction};
		}, []);

		// eslint-disable-next-line no-shadow
		const centerContainerPosition = useCallback((containerNode, clientNode) => {
			const pos = {};
			// eslint-disable-next-line no-shadow
			const {anchor, direction} = getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				if (overflow.current.isOverLeft) {
					// anchor to the left of the screen
					pos.left = KEEPOUT;
				} else if (overflow.current.isOverRight) {
					// anchor to the right of the screen
					pos.left = window.innerWidth - containerNode.width - KEEPOUT;
				} else if (anchor) {
					if (anchor === 'center') {
						// center horizontally
						pos.left = clientNode.left + (clientNode.width - containerNode.width) / 2;
					} else if (anchor === 'left') {
						// anchor to the left side of the activator
						pos.left = clientNode.left;
					} else {
						// anchor to the right side of the activator
						pos.left = clientNode.right - containerNode.width;
					}
				} else {
					// anchor to the left side of the activator, matching its width
					pos.left = clientNode.left;
					pos.width = clientNode.width;
				}

			} else if (direction === 'left' || direction === 'right') {
				if (overflow.current.isOverTop) {
					// anchor to the top of the screen
					pos.top = KEEPOUT;
				} else if (overflow.current.isOverBottom) {
					// anchor to the bottom of the screen
					pos.top = window.innerHeight - containerNode.height - KEEPOUT;
				} else if (anchor === 'middle') {
					// center vertically
					pos.top = clientNode.top - (containerNode.height - clientNode.height) / 2;
				} else if (anchor === 'top') {
					// anchor to the top of the activator
					pos.top = clientNode.top;
				} else {
					// anchor to the bottom of the activator
					pos.top = clientNode.bottom - containerNode.height;
				}
			}

			return pos;
		}, [KEEPOUT, getContainerAdjustedPosition]);

		const getContainerNodeWidth = useCallback(() => {
			return containerNode.current && containerNode.current.getBoundingClientRect().width || 0;
		}, []);

		// eslint-disable-next-line no-shadow
		const updateLeaveFor = useCallback((activator) => {
			Spotlight.set(containerId.current, {
				leaveFor: {
					up: activator,
					down: activator,
					left: activator,
					right: activator
				}
			});
		}, []);

		// eslint-disable-next-line no-shadow
		const getContainerPosition = useCallback((containerNode, clientNode) => {
			// eslint-disable-next-line no-shadow
			const position = centerContainerPosition(containerNode, clientNode);
			// eslint-disable-next-line no-shadow
			const {direction} = getContainerAdjustedPosition();

			switch (direction) {
				case 'above':
					position.top = clientNode.top - ARROW_OFFSET - containerNode.height - MARGIN;
					break;
				case 'below':
					position.top = clientNode.bottom + ARROW_OFFSET + MARGIN;
					break;
				case 'right':
					position.left = componentProps.rtl ? clientNode.left - containerNode.width - ARROW_OFFSET - MARGIN : clientNode.right + ARROW_OFFSET + MARGIN;
					break;
				case 'left':
					position.left = componentProps.rtl ? clientNode.right + ARROW_OFFSET + MARGIN : clientNode.left - containerNode.width - ARROW_OFFSET - MARGIN;
					break;
			}

			return adjustRTL(position);
		}, [ARROW_OFFSET, MARGIN, adjustRTL, centerContainerPosition, componentProps, getContainerAdjustedPosition]);

		// eslint-disable-next-line no-shadow
		const getArrowPosition = useCallback((containerNode, clientNode) => {
			const position = {};
			// eslint-disable-next-line no-shadow
			const {anchor, direction} = getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				if (overflow.current.isOverRight && !overflow.current.isOverLeft) {
					position.left = window.innerWidth - ((containerNode.width + ARROW_WIDTH) / 2) - KEEPOUT;
				} else if (!overflow.current.isOverRight && overflow.current.isOverLeft) {
					position.left = ((containerNode.width - ARROW_WIDTH) / 2) + KEEPOUT;
				} else if (anchor === 'left') {
					position.left = clientNode.left + (containerNode.width - ARROW_WIDTH) / 2;
				} else if (anchor === 'right') {
					position.left = clientNode.right - containerNode.width + (containerNode.width - ARROW_WIDTH) / 2;
				} else {
					position.left = clientNode.left + (clientNode.width - ARROW_WIDTH) / 2;
				}
			} else if (overflow.current.isOverBottom && !overflow.current.isOverTop) {
				position.top = window.innerHeight - ((containerNode.height + ARROW_WIDTH) / 2) - KEEPOUT;
			} else if (!overflow.current.isOverBottom && overflow.current.isOverTop) {
				position.top = ((containerNode.height - ARROW_WIDTH) / 2) + KEEPOUT;
			} else if (anchor === 'top') {
				position.top = clientNode.top + (containerNode.height - ARROW_WIDTH) / 2;
			} else if (anchor === 'bottom') {
				position.top = clientNode.bottom - containerNode.height + (containerNode.height - ARROW_WIDTH) / 2;
			} else {
				position.top = clientNode.top + (clientNode.height - ARROW_WIDTH) / 2;
			}

			switch (direction) {
				case 'above':
					position.top = clientNode.top - ARROW_WIDTH - MARGIN;
					break;
				case 'below':
					position.top = clientNode.bottom + MARGIN;
					break;
				case 'left':
					position.left = componentProps.rtl ? clientNode.left + clientNode.width + MARGIN : clientNode.left - ARROW_WIDTH - MARGIN;
					break;
				case 'right':
					position.left = componentProps.rtl ? clientNode.left - ARROW_WIDTH - MARGIN : clientNode.left + clientNode.width + MARGIN;
					break;
				default:
					return {};
			}

			return adjustRTL(position);
		}, [ARROW_WIDTH, KEEPOUT, MARGIN, adjustRTL, componentProps, getContainerAdjustedPosition]);

		const calcOverflow = useCallback((container, client) => {
			let containerHeight, containerWidth;
			// eslint-disable-next-line no-shadow
			const {anchor, direction} = getContainerAdjustedPosition();

			if (direction === 'above' || direction === 'below') {
				containerHeight = container.height;
				containerWidth = (container.width - client.width) / 2;
			} else {
				containerHeight = (container.height - client.height) / 2;
				containerWidth = container.width;
			}

			overflow.current = {
				isOverTop: anchor === 'top' && (direction === 'left' || direction === 'right') ?
					!(client.top > KEEPOUT) :
					client.top - containerHeight - ARROW_OFFSET - MARGIN - KEEPOUT < 0,
				isOverBottom: anchor === 'bottom' && (direction === 'left' || direction === 'right') ?
					client.bottom + KEEPOUT > window.innerHeight :
					client.bottom + containerHeight + ARROW_OFFSET + MARGIN + KEEPOUT > window.innerHeight,
				isOverLeft: anchor === 'left' && (direction === 'above' || direction === 'below') ?
					!(client.left > KEEPOUT) :
					client.left - containerWidth - ARROW_OFFSET - MARGIN - KEEPOUT < 0,
				isOverRight: anchor === 'right' && (direction === 'above' || direction === 'below') ?
					client.right + KEEPOUT > window.innerWidth :
					client.right + containerWidth + ARROW_OFFSET + MARGIN + KEEPOUT > window.innerWidth
			};
		}, [ARROW_OFFSET, KEEPOUT, MARGIN, getContainerAdjustedPosition]);

		const adjustDirection = useCallback(() => {
			// eslint-disable-next-line no-shadow
			const {anchor, direction} = getContainerAdjustedPosition();

			if (overflow.current.isOverTop && !overflow.current.isOverBottom && direction === 'above') {
				adjustedDirection.current = anchor ? `below ${anchor}` : 'below';
			} else if (overflow.current.isOverBottom && !overflow.current.isOverTop && direction === 'below') {
				adjustedDirection.current = anchor ? `above ${anchor}` : 'above';
			} else if (overflow.current.isOverLeft && !overflow.current.isOverRight && direction === 'left' && !componentProps.rtl) {
				adjustedDirection.current = anchor ? `right ${anchor}` : 'right';
			} else if (overflow.current.isOverRight && !overflow.current.isOverLeft && direction === 'right' && !componentProps.rtl) {
				adjustedDirection.current = anchor ? `left ${anchor}` : 'left';
			}
		}, [componentProps, getContainerAdjustedPosition]);

		/**
		 * Position the popup in relation to the activator.
		 *
		 * Position is based on the dimensions of the popup and its activator. If the popup does not
		 * fit in the specified direction, it will automatically flip to the opposite direction.
		 *
		 * @method
		 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
		 * @public
		 * @returns {undefined}
		 */
		const positionContextualPopup = useCallback(() => {
			if (containerNode.current && clientSiblingRef?.current) {
				const localContainerNode = containerNode.current.getBoundingClientRect();
				const {top, left, bottom, right, width, height} = clientSiblingRef.current.getBoundingClientRect();
				const clientNode = {top, left, bottom, right, width, height};

				clientNode.left = componentProps.rtl ? window.innerWidth - right : left;
				clientNode.right = componentProps.rtl ? window.innerWidth - left : right;

				calcOverflow(localContainerNode, clientNode);
				adjustDirection();

				const localArrowPosition = getArrowPosition(localContainerNode, clientNode),
					localContainerPosition = getContainerPosition(localContainerNode, clientNode);

				if ((direction !== adjustedDirection.current) ||
					(arrowPosition.left !== localArrowPosition.left) ||
					(arrowPosition.top !== localArrowPosition.top) ||
					(containerPosition.left !== localContainerPosition.left) ||
					(containerPosition.right !== localContainerPosition.right) ||
					(containerPosition.top !== localContainerPosition.top)
				) {
					setDirection(adjustedDirection.current);
					setArrowPosition(localArrowPosition);
					setContainerPosition(localContainerPosition);
				}
			}
		}, [adjustDirection, arrowPosition, componentProps, containerPosition, direction, getArrowPosition, getContainerPosition]);

		const getContainerNode = useCallback((node) => {
			containerNode.current = node;

			if (resizeObserver.current) {
				if (node) {
					// It is not easy to trigger changed position of activator,
					// so we chose to observe the `div` element's size that has the real size below the root of floatLayer.
					// This implementation is dependent on the current structure of FloatingLayer,
					// so if the structure have changed, below code needs to be changed accordingly.
					resizeObserver.current.observe(node?.parentElement?.parentElement);
				} else {
					resizeObserver.current.disconnect();
				}
			}

			if (mutationObserver.current) {
				if (node) {
					mutationObserver.current.observe(document.body, {attributes: false, childList: true, subtree: true});
				} else {
					mutationObserver.current.disconnect();
				}
			}
		}, []);

		const spotPopupContent = useCallback(() => {
			const spottableDescendants = Spotlight.getSpottableDescendants(containerId.current);
			if (componentProps.spotlightRestrict === 'self-only' && spottableDescendants.length && Spotlight.getCurrent()) {
				Spotlight.getCurrent().blur();
			}

			if (!Spotlight.focus(containerId.current)) {
				Spotlight.setActiveContainer(containerId.current);
			}
		}, [componentProps]);

		const handleKeyUp = useCallback(() => {
			return handle(
				forProp('open', true),
				forKey('enter'),
				() => Spotlight.getCurrent() === activator,
				stop,
				forwardCustom('onClose')
			)
		}, [activator]);

		const handleOpen = useCallback((ev) => {
			forward('onOpen', ev, componentProps);
			positionContextualPopup();
			const current = Spotlight.getCurrent();
			updateLeaveFor(current);
			setActivator(current);
			spotPopupContent();
		}, [componentProps, positionContextualPopup, spotPopupContent, updateLeaveFor]);

		const handleClose = useCallback(() => {
			updateLeaveFor(null);
			setActivator(null)
		}, [updateLeaveFor]);

		const handleDismiss = useCallback(() => {
			forwardCustom('onClose')(null, componentProps);
		}, [componentProps]);

		const handleDirectionalKey = useCallback((ev) => {
			// prevent default page scrolling
			ev.preventDefault();
			// stop propagation to prevent default spotlight behavior
			ev.stopPropagation();
			// set the pointer mode to false on keydown
			Spotlight.setPointerMode(false);
		}, []);

		// handle key event from outside (i.e. the activator) to the popup container
		const handleKeyDown = useCallback((ev) => {
			const current = Spotlight.getCurrent();
			// eslint-disable-next-line no-shadow
			const direction = getDirection(ev.keyCode);
			if (!direction) return;

			const hasSpottables = Spotlight.getSpottableDescendants(containerId.current).length > 0;
			const spotlessSpotlightModal = componentProps.spotlightRestrict === 'self-only' && !hasSpottables;
			const shouldSpotPopup = current === activator && direction === PositionToDirection[adjustedDirection.current.split(' ')[0]] && hasSpottables;

			if (shouldSpotPopup || spotlessSpotlightModal) {
				handleDirectionalKey(ev);

				// we guard against attempting a focus change by verifying the case where a
				// spotlightModal popup contains no spottable components
				if (!spotlessSpotlightModal && shouldSpotPopup) {
					spotPopupContent();
				}
			}
		}, [activator, componentProps, handleDirectionalKey, spotPopupContent]);

		// handle key event from contextual popup and closes the popup
		const handleContainerKeyDown = useCallback((ev) => {
			// Note: Container will be only rendered if `open`ed, therefore no need to check for `open`
			// eslint-disable-next-line no-shadow
			const direction = getDirection(ev.keyCode);

			if (!direction) return;

			handleDirectionalKey(ev);

			// if focus moves outside the popup's container, issue the `onClose` event
			if (Spotlight.move(direction) && !containerNode.current.contains(Spotlight.getCurrent())) {
				forwardCustom('onClose')(null, componentProps);
			}
		}, [componentProps, handleDirectionalKey]);

		// eslint-disable-next-line no-shadow
		const spotActivator = useCallback((activator) => {
			if (!Spotlight.getPointerMode() && activator && activator === Spotlight.getCurrent()) {
				activator.blur();
			}
			if (!Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		}, []);

		const getSnapshotBeforeUpdate = useCallback(() =>  {
			const localSnapshot = {
				containerWidth: getContainerNodeWidth()
			};

			if (!prevProps.current.open && componentProps.open) {
				const current = Spotlight.getCurrent();
				localSnapshot.shouldSpotActivator = (
					// isn't set
					!current ||
					// is on the activator, and we want to re-spot it so a11y read out can occur
					current === activator ||
					// is within the popup
					containerNode.current.contains(current)
				);
			}

			return localSnapshot;
		}, [activator, componentProps, getContainerNodeWidth]);

		useEffect(() => {
			if (componentProps.open) {
				on('keydown', handleKeyDown);
				on('keyup', handleKeyUp);
			}

			if (typeof ResizeObserver === 'function') {
				resizeObserver.current = new ResizeObserver(() => {
					positionContextualPopup();
				});
			}

			if (typeof MutationObserver === 'function') {
				mutationObserver.current = new MutationObserver(() => {
					positionContextualPopup();
				});
			}

			snapshot.current = getSnapshotBeforeUpdate();
		}, [componentProps, handleKeyDown, handleKeyUp, getSnapshotBeforeUpdate]);

		useEffect(() => {
			if (prevProps.current.direction !== componentProps.direction ||
				snapshot.current.containerWidth !== getContainerNodeWidth() ||
				(prevProps.current.open && componentProps.open)) {
				adjustedDirection.current = componentProps.direction;
				// NOTE: `setState` is called and will cause re-render
				positionContextualPopup();
			}

			if (componentProps.open && !prevProps.current.open) {
				on('keydown', handleKeyDown);
				on('keyup', handleKeyUp);
			} else if (!componentProps.open && prevProps.current.open) {
				off('keydown', handleKeyDown);
				off('keyup', handleKeyUp);
				if (snapshot.current && snapshot.current.shouldSpotActivator) {
					spotActivator(activator);
				}
			}

			prevProps.current = componentProps;
		}, [activator, componentProps, getContainerNodeWidth, getSnapshotBeforeUpdate, handleKeyDown, handleKeyUp, positionContextualPopup, spotActivator]);

		useEffect(() => {
			// eslint-disable-next-line no-shadow
			const id = containerId.current;

			return () => {
				if (componentProps.open) {
					off('keydown', handleKeyDown);
					off('keyup', handleKeyUp);
				}
				Spotlight.remove(id);

				if (resizeObserver.current) {
					resizeObserver.current.disconnect();
					resizeObserver.current = null;
				}

				if (mutationObserver.current) {
					mutationObserver.current.disconnect();
					mutationObserver.current = null;
				}
			};
		}, [componentProps, handleKeyDown, handleKeyUp]);

		const {'data-webos-voice-exclusive': voiceExclusive, popupComponent: PopupComponent, popupClassName, noAutoDismiss, open, offset, popupProps, skin, spotlightRestrict, ...rest} = componentProps;
		const idFloatLayer = `${id.current}_floatLayer`;
		let scrimType = rest.scrimType;
		delete rest.scrimType;

		// 'holepunch' scrimType is specific to this component, not supported by floating layer
		// so it must be swapped-out for one that FloatingLayer does support.
		const holepunchScrim = (scrimType === 'holepunch');
		if ((spotlightRestrict === 'self-only' && scrimType === 'none') || holepunchScrim) {
			scrimType = 'transparent';
		}

		const popupPropsRef = Object.assign({}, popupProps);
		const ariaProps = extractAriaProps(popupPropsRef);

		if (!noSkin) {
			rest.skin = skin;
		}

		let holeBounds;
		if (clientSiblingRef?.current && holepunchScrim) {
			holeBounds = clientSiblingRef.current.getBoundingClientRect();
		}

		delete rest.direction;
		delete rest.onClose;
		delete rest.onOpen;
		delete rest.popupSpotlightId;
		delete rest.rtl;
		delete rest.setApiProvider;

		if (openProp) rest[openProp] = open;

		return (
			<div aria-owns={idFloatLayer} className={css.contextualPopupDecorator}>
				<FloatingLayer
					id={idFloatLayer}
					noAutoDismiss={noAutoDismiss}
					onClose={handleClose}
					onDismiss={handleDismiss}
					onOpen={handleOpen}
					open={open}
					scrimType={scrimType}
				>
					<div>
						{holepunchScrim ? <HolePunchScrim holeBounds={holeBounds} /> : null}
						<ContextualPopupContainer
							{...ariaProps}
							className={popupClassName}
							onKeyDown={handleContainerKeyDown}
							direction={direction}
							arrowPosition={arrowPosition}
							containerPosition={containerPosition}
							containerRef={getContainerNode}
							data-webos-voice-exclusive={voiceExclusive}
							offset={noArrow ? offset : 'none'}
							showArrow={!noArrow}
							skin={skin}
							spotlightId={containerId.current}
							spotlightRestrict={spotlightRestrict}
						>
							<PopupComponent {...popupPropsRef} />
						</ContextualPopupContainer>
					</div>
				</FloatingLayer>
				<WrappedWithRef {...rest} outermostRef={clientSiblingRef} referrerName="ContextualPopup" />
			</div>
		);
	};

	ContextualPopupDecorator.displayName = 'ContextualPopupDecorator';

	ContextualPopupDecorator.propTypes = /** @lends limestone/ContextualPopupDecorator.ContextualPopupDecorator.prototype */ {
		/**
		 * The component rendered within the
		 * {@link limestone/ContextualPopupDecorator.ContextualPopup|ContextualPopup}.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		popupComponent: EnactPropTypes.component.isRequired,

		/**
		 * Limits the range of voice control to the popup.
		 *
		 * @memberof limestone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		'data-webos-voice-exclusive': PropTypes.bool,

		/**
		 * Direction of popup with respect to the wrapped component.
		 *
		 * @type {('above'|'above center'|'above left'|'above right'|'below'|'below center'|'below left'|'below right'|'left middle'|'left top'|'left bottom'|'right middle'|'right top'|'right bottom')}
		 * @default 'below center'
		 * @public
		 */
		direction: PropTypes.oneOf(['above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left middle', 'left top', 'left bottom', 'right middle', 'right top', 'right bottom']),

		/**
		 * Disables closing the popup when the user presses the cancel/back (e.g. `ESC`) key or taps outside the
		 * popup.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * Offset from the activator to apply to the position of the popup.
		 *
		 * Only applies when `noArrow` is `true`.
		 *
		 * @type {('none'|'overlap'|'small')}
		 * @default 'small'
		 * @public
		 */
		offset: PropTypes.oneOf(['none', 'overlap', 'small']),

		/**
		 * Called when the user has attempted to close the popup.
		 *
		 * This may occur either when the close button is clicked or when spotlight focus
		 * moves outside the boundary of the popup. Setting `spotlightRestrict` to `'self-only'`
		 * will prevent Spotlight focus from leaving the popup.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the popup is opened.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Displays the contextual popup.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * CSS class name to pass to the
		 * {@link limestone/ContextualPopupDecorator.ContextualPopup|ContextualPopup}.
		 *
		 * This is commonly used to set width and height of the popup.
		 *
		 * @type {String}
		 * @public
		 */
		popupClassName: PropTypes.string,

		/**
		 * An object containing properties to be passed to popup component.
		 *
		 * @type {Object}
		 * @public
		 */
		popupProps: PropTypes.object,

		/**
		 * The container ID to use with Spotlight.
		 *
		 * The spotlight container for the popup isn't created until it is open. To configure
		 * the container using `Spotlight.set()`, handle the `onOpen` event which is fired after
		 * the popup has been created and opened.
		 *
		 * @type {String}
		 * @public
		 */
		popupSpotlightId: PropTypes.string,

		/**
		 * Indicates the content's text direction is right-to-left.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Set the type of scrim to use
		 *
		 * @type {('holepunch'|'translucent'|'transparent'|'none')}
		 * @default 'none'
		 * @private
		 */
		scrimType: PropTypes.oneOf(['holepunch', 'translucent', 'transparent', 'none']),

		/**
		 * Registers the ContextualPopupDecorator component with an
		 * {@link core/internal/ApiDecorator.ApiDecorator|ApiDecorator}.
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

		/**
		 * The current skin for this component.
		 *
		 * When `noSkin` is set on the config object, `skin` will only be applied to the
		 * {@link limestone/ContextualPopupDecorator.ContextualPopup|ContextualPopup} and not
		 * to the popup's activator component.
		 *
		 * @see {@link limestone/Skinnable.Skinnable.skin}
		 * @type {String}
		 * @public
		 */
		skin: PropTypes.string,

		/**
		 * Restricts or prioritizes spotlight navigation.
		 *
		 * Allowed values are:
		 * * `'none'` - Spotlight can move freely within and beyond the popup
		 * * `'self-first'` - Spotlight should prefer components within the popup over
		 *   components beyond the popup, or
		 * * `'self-only'` - Spotlight can only be set within the popup
		 *
		 * @type {('none'|'self-first'|'self-only')}
		 * @default 'self-first'
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
	};

	return ContextualPopupDecorator;
});

/**
 * Adds support for positioning a
 * {@link limestone/ContextualPopupDecorator.ContextualPopup|ContextualPopup} relative to the
 * wrapped component.
 *
 * `ContextualPopupDecorator` may be used to show additional settings or actions rendered within a
 * small floating popup.
 *
 * Usage:
 * ```
 * const ButtonWithPopup = ContextualPopupDecorator(Button);
 * <ButtonWithPopup
 *   direction="above center"
 *   open={this.state.open}
 *   popupComponent={CustomPopupComponent}
 * >
 *   Open Popup
 * </ButtonWithPopup>
 * ```
 *
 * @hoc
 * @memberof limestone/ContextualPopupDecorator
 * @public
 */
const ContextualPopupDecorator = compose(
	ApiDecorator({api: ['positionContextualPopup']}),
	I18nContextDecorator({rtlProp: 'rtl'}),
	Decorator
);

export default ContextualPopupDecorator;
export {
	ContextualPopupDecorator,
	ContextualPopup
};
