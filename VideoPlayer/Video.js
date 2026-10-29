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
	const prevPropsRef = useRef(null);

	// Keys from the previous render. They replace the instance fields the class mutated in
	// `getKeys()`. State is only updated during render when the sources change.
	const [keyState, setKeyState] = useState(initialKeyState);
	const nextKeyState = getKeys(source, preloadSource, keyState);
	const keysChanged = (
		nextKeyState.prevSourceKey !== keyState.prevSourceKey ||
		nextKeyState.prevPreloadKey !== keyState.prevPreloadKey
	);

	if (keysChanged) {
		// cache the previous keys so we know if the sources change the next time
		setKeyState(nextKeyState);
	}

	const {keys, prevPreloadKey: currentPreloadKey} = keysChanged ? nextKeyState : keyState;

	// if preload is unset, clear the key so we don't render that media node at all
	const [sourceKey, preloadKey] = currentPreloadKey ? keys : keys.slice(0, 1);

	const handlePreloadLoadStart = useCallback((ev) => {
		// persist the event so we can cache it to re-emit when the preload becomes active
		ev.persist();
		preloadLoadStartRef.current = ev;

		// prevent the from bubbling to upstream handlers
		ev.stopPropagation();
	}, []);

	// React calls the ref callback with `null` when the video is removed or unmounted, and when
	// `setMedia` changes, so the previous `setMedia` is always cleared, as `componentDidUpdate` and
	// `componentWillUnmount` did.
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

	// Equivalent of componentDidUpdate. A layout effect keeps the class timing.
	useLayoutEffect(() => {
		const prevProps = prevPropsRef.current;
		prevPropsRef.current = {source, preloadSource};

		// componentDidUpdate does not run on mount
		if (!prevProps) return;

		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = getKeyFromSource(source);
		const prevKey = getKeyFromSource(prevSource);
		const preloadKeyFromSource = getKeyFromSource(preloadSource);
		const prevPreloadKey = getKeyFromSource(prevPreloadSource);

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
			if (key === prevPreloadKey && preloadKeyFromSource !== prevPreloadKey) {
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

		if (preloadSource && preloadKeyFromSource !== prevPreloadKey) {
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
			{sourceKey ? (
				<Media
					{...rest}
					className={css.video}
					controls={false}
					key={sourceKey}
					mediaComponent={mediaComponent}
					preload="none"
					ref={setVideoRef}
					source={isValidElement(source) ? source : (
						<source src={source} />
					)}
				/>
			) : null}
			{preloadKey ? (
				<Media
					autoPlay={false}
					className={css.preloadVideo}
					controls={false}
					key={preloadKey}
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
