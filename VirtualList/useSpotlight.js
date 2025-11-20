import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/useScroll/utilDOM';
import {useEffect, useRef} from 'react';

const useSpotlightConfig = (props, instances) => {
	// Track dataSize to detect when lastFocusedIndex becomes invalid
	const lastDataSizeRef = useRef(props.dataSize);

	// Hooks

	useEffect(() => {
		// Clear lastFocusedIndex if it becomes out of range
		// This prevents Spotlight from trying to restore an invalid index
		const {dataSize} = props;
		const {spottable} = instances;

		if (dataSize !== lastDataSizeRef.current && spottable && spottable.current) {
			const lastFocusedIndex = spottable.current.lastFocusedIndex;

			if (lastFocusedIndex != null && lastFocusedIndex >= dataSize) {
				spottable.current.lastFocusedIndex = null;
			}

			lastDataSizeRef.current = dataSize;
		}

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

			// When no last focused element exists, return first visible index
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

			// If the specified index isn't found in the DOM, return the first visible spottable child to prevent focusing the VirtualList container
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
		// If flag is already false, don't do anything
		if (!mutableRef.current.restoreLastFocused) {
			return;
		}

		// Only restore focus when VirtualList gets focus
		const current = Spotlight.getCurrent();

		// Check if focus is already inside the VirtualList container
		const isFocusInContainer = current && scrollContentRef.current &&
			utilDOM.containsDangerously(scrollContentRef.current, current);

		// Check if user is entering via the placeholder element
		const isEnteringViaPlaceholder = current && current.dataset && 'vlPlaceholder' in current.dataset;

		// Only restore focus if:
		// 1. Focus is already inside the VirtualList container, OR
		// 2. User is explicitly entering via placeholder (intentional)
		if ((isFocusInContainer || isEnteringViaPlaceholder) &&
			mutableRef.current.preservedIndex >= firstIndex &&
			mutableRef.current.preservedIndex <= lastIndex) {
			restoreFocus();
		} else if (!isFocusInContainer && !isEnteringViaPlaceholder) {
			// Clear the flag when focus is outside VirtualList
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
