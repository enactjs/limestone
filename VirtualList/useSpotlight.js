import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/useScroll/utilDOM';
import {useEffect, useRef} from 'react';

const useSpotlightConfig = (props, instances) => {
	// Hooks

	useEffect(() => {
		function lastFocusedPersist () {
			const {spottable: {current: {lastFocusedIndex}}} = instances;
			const {scrollContentHandle} = instances;

			if (lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: lastFocusedIndex
				};
			}

			// CRITICAL FIX: When no last focused element exists, return first visible index
			// This ensures lastFocusedRestore is called with key: 0 instead of undefined
			// Prevents the container from being focused
			if (scrollContentHandle.current && scrollContentHandle.current.state) {
				const {firstVisibleIndex} = scrollContentHandle.current.state;
				if (firstVisibleIndex != null && firstVisibleIndex >= 0) {
					return {
						container: false,
						element: true,
						key: firstVisibleIndex
					};
				}
			}

			// Fallback to index 0 if we can't determine first visible
			return {
				container: false,
				element: true,
				key: 0
			};
		}

		function lastFocusedRestore ({key}, all) {
			const placeholder = all.find(el => 'vlPlaceholder' in el.dataset);
console.log("last focus restore");
			if (placeholder) {
				placeholder.dataset.index = key;

				return placeholder;
			}

			// Try to find the element with the matching key
			const foundByKey = all.reduce((focused, node) => {
				return focused || Number(node.dataset.index) === key && node;
			}, null);

			if (foundByKey) {
				return foundByKey;
			}

			// FALLBACK: If the specified index isn't found in the DOM
			// Return the first visible spottable child to prevent focusing the container
			if (!foundByKey && all.length > 0) {
				// Find the first element with a valid data-index attribute
				const firstVisibleItem = all.find(node =>
					node.dataset &&
					node.dataset.index != null &&
					!node.dataset.vlPlaceholder
				);

				if (firstVisibleItem) {
					return firstVisibleItem;
				}
			}

			return null;
		}

		function configureSpotlight () {
			const {cbScrollTo, spacing, spotlightId} = props;

			Spotlight.set(spotlightId, {
				enterTo: 'last-focused',
				/*
				 * Returns the data-index as the key for last focused
				 */
				lastFocusedPersist,

				/*
				 * Restores the data-index into the placeholder if it's the only element. Tries to find a
				 * matching child otherwise.
				 */
				lastFocusedRestore,

				/*
				 * Directs spotlight focus to favor straight elements that are within range of `spacing`
				 * over oblique elements, like scroll buttons.
				 */
				obliqueMultiplier: spacing > 0 ? spacing : 1
			});

			// Add restoration callback for items scrolled out of view
			const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
			const {scrollContainerRef} = props;
			if (containerNode && cbScrollTo) {
				/*
				 * Called by Spotlight when trying to restore focus to an element
				 * that's not currently in the DOM (scrolled out of view)
				 *
				 * @param {String} spotlightId - The spotlight ID of the element to restore
				 * @returns {Boolean} - true if restoration was initiated
				 */
				containerNode.restoreSpotlightChild = (elementSpotlightId) => {
					// restore if focus is coming from outside the container
					const currentFocus = Spotlight.getCurrent();
					if (currentFocus && scrollContainerRef.current?.contains(currentFocus)) {
						// Focus is already inside VirtualList, don't restore
						return false;
					}

					const match = elementSpotlightId.match(/-(\d+)$/);
					if (!match) {
						return false;
					}

					const index = parseInt(match[1]);
					const {dataSize} = props;

					if (index < 0 || index >= dataSize) {
						return false;
					}

					// Check if item is already in DOM
					const existingElement = document.querySelector(`[data-spotlight-id="${elementSpotlightId}"]`);
					if (existingElement) {
						return true;
					}

					const {spottable} = instances;

					if (spottable && spottable.current) {
						spottable.current.lastFocusedIndex = index;
					}

					cbScrollTo({
						index,
						animate: props.wrap !== 'noAnimation',
						focus: true,
						stickTo: 'center'
					});

					return true;
				};
			}
		}

		configureSpotlight();

		return () => {
			const {spotlightId} = props;
			const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
			if (containerNode && containerNode.restoreSpotlightChild) {
				delete containerNode.restoreSpotlightChild;
			}
		};
	}, [props, instances]);
};

const getNumberValue = (index) => {
	// using '+ operator' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	let number = +index;
	// should return -1 if index is not a number or a negative value
	return number >= 0 ? number : -1;
};

const useSpotlightRestore = (props, instances, context) => {
	const {scrollContentRef, spottable} = instances;
	const {focusByIndex, getItemNode} = context;

	// Mutable value

	const mutableRef = useRef({
		preservedIndex: false,
		lastSpotlightDirection: null,
		restoreLastFocused: false
	});

	// Hooks

	useEffect(restoreFocus);

	// Functions

	function handlePlaceholderFocus (ev) {
		const placeholder = ev.currentTarget;

		if (placeholder) {
			const index = placeholder.dataset.index;

			if (index) {
				mutableRef.current.preservedIndex = getNumberValue(index);
				mutableRef.current.lastSpotlightDirection = null;
				mutableRef.current.restoreLastFocused = true;
			}
		}
	}

	function isPlaceholderFocused () {
		const current = Spotlight.getCurrent();

		if (current && current.dataset.vlPlaceholder && utilDOM.containsDangerously(scrollContentRef.current, current)) {
			return true;
		}

		return false;
	}

	function restoreFocus () {
		if (
			mutableRef.current.restoreLastFocused &&
			!isPlaceholderFocused()
		) {
			const
				{spotlightId} = props,
				itemNode = getItemNode(mutableRef.current.preservedIndex);

			if (itemNode) {
				// if we're supposed to restore focus and virtual list has positioned a set of items
				// that includes lastFocusedIndex, clear the indicator
				mutableRef.current.restoreLastFocused = false;

				// try to focus the last focused item
				spottable.current.isScrolledByJump = true;
				const foundLastFocused = focusByIndex(mutableRef.current.preservedIndex, mutableRef.current.lastSpotlightDirection);
				spottable.current.isScrolledByJump = false;

				// but if that fails (because it isn't found or is disabled), focus the container so
				// spotlight isn't lost
				if (!foundLastFocused) {
					mutableRef.current.restoreLastFocused = true;
					Spotlight.focus(spotlightId);
				}
			}
		}
	}

	function handleRestoreLastFocus ({firstIndex, lastIndex}) {
		// CRITICAL FIX: Only restore focus when appropriate
		// Prevents VirtualList from "stealing" focus when user is navigating between buttons
		const current = Spotlight.getCurrent();

		// Check if focus is already inside the VirtualList container
		const isFocusInContainer = current && scrollContentRef.current &&
			utilDOM.containsDangerously(scrollContentRef.current, current);
console.log("handle restore", isFocusInContainer);
		// Check if user is entering via the placeholder element (intentional navigation)
		const isEnteringViaPlaceholder = current && current.dataset && 'vlPlaceholder' in current.dataset;

		// Only restore focus if:
		// 1. Focus is already inside the VirtualList container, OR
		// 2. User is explicitly entering via placeholder (intentional)
		if ((isFocusInContainer || isEnteringViaPlaceholder) &&
			mutableRef.current.restoreLastFocused &&
			mutableRef.current.preservedIndex >= firstIndex &&
			mutableRef.current.preservedIndex <= lastIndex) {
			console.log("is restoring focus", current, scrollContentRef.current)
			restoreFocus();
		} else if (mutableRef.current.restoreLastFocused &&
			!isFocusInContainer &&
			!isEnteringViaPlaceholder) {
			console.log("else")
			// CRITICAL: Clear the flag UNCONDITIONALLY when focus is outside
			// Don't check if preservedIndex is in range - just clear it
			// This prevents stale flags from causing restoration later
			mutableRef.current.restoreLastFocused = false;
		}
	}

	function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
		return (mutableRef.current.restoreLastFocused && numOfItems > 0 && mutableRef.current.preservedIndex < dataSize && (
			mutableRef.current.preservedIndex < moreInfo.firstVisibleIndex || mutableRef.current.preservedIndex > moreInfo.lastVisibleIndex
		));
	}

	function setPreservedIndex (index, direction = null) {
		mutableRef.current.preservedIndex = index;
		mutableRef.current.lastSpotlightDirection = direction;
		mutableRef.current.restoreLastFocused = true;
	}

	// Return

	return {
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		setPreservedIndex,
		updateStatesAndBounds
	};
};

export {
	useSpotlightConfig,
	useSpotlightRestore
};