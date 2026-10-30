import {forward} from '@enact/core/handle';
import ForwardRef from '@enact/ui/ForwardRef';
import {Media, getKeyFromSource} from '@enact/ui/Media';
import EnactPropTypes from '@enact/core/internal/prop-types';
import Slottable from '@enact/ui/Slottable';
import compose from 'ramda/src/compose';
import {isValidElement, useCallback, useLayoutEffect, useRef, useState} from 'react';

import css from './VideoPlayer.module.less';

import PropTypes from 'prop-types';

const initialKeyState = {
	keys: ['media-1', 'media-2'],
	prevSourceKey: null,
	prevPreloadKey: null
};

// Returns the source and preload keys for the current props. If either the source or preload
// existed previously in the other "slot", the keys are swapped so the preload video becomes the
// active video and vice versa.
const getKeys = (source, preloadSource, {keys, prevSourceKey, prevPreloadKey}) => {
	const sourceKey = source && getKeyFromSource(source);
	let preloadKey = preloadSource && getKeyFromSource(preloadSource);

	// If the same source is used for both, clear the preload key to avoid rendering duplicate
	// video elements.
	if (sourceKey === preloadKey) {
		preloadKey = null;
	}

	const swap = (
		(sourceKey === prevPreloadKey && prevPreloadKey) ||
		(preloadKey === prevSourceKey && prevSourceKey)
	);

	return {
		keys: swap ? [keys[1], keys[0]] : keys,
		prevSourceKey: sourceKey,
		prevPreloadKey: preloadKey
	};
};

/**
 * Adds support for preloading a video source for `VideoPlayer`.
 *
 * @class VideoBase
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const VideoBase = (props) => {
	const {
		mediaComponent = 'video',
		preloadSource,
		setMedia,
		source,
		...rest
	} = props;

	const videoRef = useRef(null);
	const preloadVideoRef = useRef(null);
	const preloadLoadStartRef = useRef(null);
	const prevKeysRef = useRef(null);

	// The React keys of the source and preload videos, and the source keys they were last given
	// for. When a source moves between the two slots its key moves with it, so React keeps the
	// same video element. Updated during render only when the sources change.
	const [keyState, setKeyState] = useState(initialKeyState);
	const nextKeyState = getKeys(source, preloadSource, keyState);
	const keysChanged = (
		nextKeyState.prevSourceKey !== keyState.prevSourceKey ||
		nextKeyState.prevPreloadKey !== keyState.prevPreloadKey
	);

	if (keysChanged) {
		setKeyState(nextKeyState);
	}

	const {keys, prevPreloadKey: currentPreloadKey} = nextKeyState;

	// if preload is unset, clear the key so we don't render that media node at all
	const [sourceSlotKey, preloadSlotKey] = currentPreloadKey ? keys : keys.slice(0, 1);

	const handlePreloadLoadStart = useCallback((ev) => {
		// persist the event so we can cache it to re-emit when the preload becomes active
		ev.persist();
		preloadLoadStartRef.current = ev;

		// prevent the from bubbling to upstream handlers
		ev.stopPropagation();
	}, []);

	// Passes the active video node to `setMedia`. React calls this with `null` when the video is
	// removed or unmounted, and when `setMedia` changes, so the previous `setMedia` is always
	// cleared.
	const setVideoRef = useCallback((node) => {
		videoRef.current = node;

		if (setMedia) {
			setMedia(node);
		}
	}, [setMedia]);

	const setPreloadRef = useCallback((node) => {
		if (node) {
			node.load();
		}
		preloadVideoRef.current = node;
	}, []);

	// Responds to source changes: when the preload video becomes the source, re-emits its cached
	// `onLoadStart` and emits `onUpdate`; when the source changes, plays it if `autoPlay` is set;
	// when `preloadSource` changes, reloads the preload video. It is a layout effect so this runs
	// right after the swapped video elements are committed, before the browser paints, so
	// VideoPlayer receives these events and playback starts before the new frame is shown.
	useLayoutEffect(() => {
		const key = getKeyFromSource(source);
		const preloadKey = getKeyFromSource(preloadSource);
		const prevKeys = prevKeysRef.current;
		prevKeysRef.current = {key, preloadKey};

		// skip the initial mount; only react to changes
		if (!prevKeys) return;

		const {key: prevKey, preloadKey: prevPreloadKey} = prevKeys;

		const autoPlay = () => {
			if (!props.autoPlay) return;

			const playPromise = videoRef.current.play();

			if (playPromise) {
				playPromise.then(() => {
					// Autoplay started
				}).catch(() => {
					// Autoplay was prevented
				});
			}
		};

		if (source) {
			if (key === prevPreloadKey && preloadKey !== prevPreloadKey) {
				// if there's source and it was the preload source

				// if the preloaded video didn't error, notify VideoPlayer it is ready to reset
				if (preloadLoadStartRef.current) {
					forward('onLoadStart', preloadLoadStartRef.current, props);
				}

				// emit onUpdate to give VideoPlayer an opportunity to updates its internal state
				// since it won't receive the onLoadStart or onError event
				forward('onUpdate', {type: 'onUpdate'}, props);

				autoPlay();
			} else if (key !== prevKey) {
				// if there's source and it has changed.
				autoPlay();
			}
		}

		if (preloadSource && preloadKey !== prevPreloadKey) {
			preloadLoadStartRef.current = null;

			// In the case that the previous source equalled the previous preload (causing the
			// preload video node to not be created) and then the preload source was changed, we
			// need to guard against accessing the preloadVideo node.
			if (preloadVideoRef.current) {
				preloadVideoRef.current.load();
			}
		}
	});

	return (
		<>
			{sourceSlotKey ? (
				<Media
					{...rest}
					className={css.video}
					controls={false}
					key={sourceSlotKey}
					mediaComponent={mediaComponent}
					preload="none"
					ref={setVideoRef}
					source={isValidElement(source) ? source : (
						<source src={source} />
					)}
				/>
			) : null}
			{preloadSlotKey ? (
				<Media
					autoPlay={false}
					className={css.preloadVideo}
					controls={false}
					key={preloadSlotKey}
					mediaComponent={mediaComponent}
					onLoadStart={handlePreloadLoadStart}
					preload="none"
					ref={setPreloadRef}
					source={isValidElement(preloadSource) ? preloadSource : (
						<source src={preloadSource} />
					)}
				/>
			) : null}
		</>
	);
};

VideoBase.displayName = 'Video';

VideoBase.propTypes = /** @lends limestone/VideoPlayer.Video.prototype */ {
	/**
	 * Video plays automatically.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	autoPlay: PropTypes.bool,

	/**
	 * Video component to use.
	 *
	 * The default (`'video'`) renders an `HTMLVideoElement`. Custom video components must have
	 * a similar API structure, exposing the following APIs:
	 *
	 * Properties:
	 * * `currentTime` {Number} - Playback index of the media in seconds
	 * * `duration` {Number} - Media's entire duration in seconds
	 * * `error` {Boolean} - `true` if video playback has errored.
	 * * `loading` {Boolean} - `true` if video playback is loading.
	 * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
	 * * `playbackRate` {Number} - Current playback rate, as a number
	 * * `proportionLoaded` {Number} - A value between `0` and `1`
	 *	representing the proportion of the media that has loaded
	 * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
	 *	proportion of the media that has already been shown
	 *
	 * Events:
	 * * `onLoadStart` - Called when the video starts to load
	 * * `onPlay` - Sent when playback of the media starts after having been paused
	 * * `onUpdate` - Sent when any of the properties were updated
	 *
	 * Methods:
	 * * `play()` - play video
	 * * `pause()` - pause video
	 * * `load()` - load video
	 *
	 * The {@link limestone/VideoPlayer.Video.source|source} property is passed to
	 * the video component as a child node.
	 *
	 * @type {String|Component|Element}
	 * @default 'video'
	 * @public
	 */
	mediaComponent: EnactPropTypes.renderableOverride,

	/**
	 * The video source to be preloaded. Expects a `<source>` node.
	 *
	 * @type {Node}
	 * @public
	 */
	preloadSource:  PropTypes.node,

	/**
	 * Called with a reference to the active {@link ui/Media.Media|Media} component.
	 *
	 * @type {Function}
	 * @private
	 */
	setMedia: PropTypes.func,

	/**
	 * The video source to be played.
	 *
	 * Any children `<source>` elements will be sent directly to the `mediaComponent` as video
	 * sources.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
	 *
	 * @type {String|Node}
	 * @public
	 */
	source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

const VideoDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']})
);

/**
 * Provides support for more advanced video configurations for `VideoPlayer`.
 *
 * Custom Video Tag
 *
 * ```
 * <VideoPlayer>
 *   <Video mediaComponent="custom-video-element">
 *     <source src="path/to/source.mp4" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * Preload Video Source
 *
 * ```
 * <VideoPlayer>
 *   <Video>
 *     <source src="path/to/source.mp4" />
 *     <source src="path/to/preload-source.mp4" slot="preloadSource" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * @class Video
 * @mixes ui/Slottable.Slottable
 * @memberof limestone/VideoPlayer
 * @ui
 * @public
 */
const Video = VideoDecorator(VideoBase);
Video.defaultSlot = 'videoComponent';

export default Video;
export {
	Video
};
