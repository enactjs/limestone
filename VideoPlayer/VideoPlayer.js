/**
 * Provides Limestone-themed video player components.
 *
 * @module limestone/VideoPlayer
 * @exports Video
 * @exports VideoPlayer
 * @exports VideoPlayerBase
 */

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {on, off} from '@enact/core/dispatcher';
import deprecate from '@enact/core/internal/deprecate';
import {memoize} from '@enact/core/util';

import {forKey, forward, forwardCustom, forwardWithPrevent, handle, preventDefault, stopImmediate, returnsTrue} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {checkPropTypes, perfNow, Job, setDefaultProps, shallowEqual} from '@enact/core/util';
import useHandlers from '@enact/core/useHandlers';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {toUpperCase} from '@enact/i18n/util';
import {getDirection, Spotlight} from '@enact/spotlight';
import {SpotlightContainerDecorator} from '@enact/spotlight/SpotlightContainerDecorator';
import {Spottable} from '@enact/spotlight/Spottable';
import Announce from '@enact/ui/AnnounceDecorator/Announce';
import ComponentOverride from '@enact/ui/ComponentOverride';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {FloatingLayerContext} from '@enact/ui/FloatingLayer/FloatingLayerDecorator';
import Media from '@enact/ui/Media';
import Slottable from '@enact/ui/Slottable';
import Touchable from '@enact/ui/Touchable';
import DurationFmt from 'ilib/lib/DurationFmt';
import PropTypes from 'prop-types';
import {cloneElement, isValidElement, memo, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';

import $L from '../internal/$L';
import Button from '../Button';
import Skinnable from '../Skinnable';
import Spinner from '../Spinner';
import {
	MediaControls,
	MediaSlider,
	secondsToTime,
	Times
} from '../MediaPlayer';

import Overlay from './Overlay';
import MediaTitle from './MediaTitle';
import FeedbackContent from './FeedbackContent';
import FeedbackTooltip from './FeedbackTooltip';
import Video from './Video';

import css from './VideoPlayer.module.less';

const isEnter = is('enter');
const isLeft = is('left');
const isRight = is('right');

const jumpBackKeyCode = 37;
const jumpForwardKeyCode = 39;
const controlsHandleAboveSelectionKeys = [13, 16777221, jumpBackKeyCode, jumpForwardKeyCode];
const getControlsHandleAboveHoldConfig = ({frequency, time}) => ({
	events: [
		{name: 'hold', time}
	],
	frequency
});
const shouldJump = ({disabled, no5WayJump}, {mediaControlsVisible, sourceUnavailable}) => (
	!no5WayJump && !mediaControlsVisible && !(disabled || sourceUnavailable)
);
const calcNumberValueOfPlaybackRate = (rate) => {
	const pbArray = String(rate).split('/');
	return (pbArray.length > 1) ? parseInt(pbArray[0]) / parseInt(pbArray[1]) : parseFloat(rate);
};

const RootComponent = (props) => {
	checkPropTypes(RootComponent, props);
	const {playerRef, ...rest} = props;
	return (<div ref={playerRef} {...rest} />);
};

RootComponent.propTypes = {
	/*
	 * Called with the reference to the mediaControls node.
	 *
	 * @type {Object|Function}
	 * @public
	 */
	playerRef: EnactPropTypes.ref
};

const SpottableDiv = Touchable(Spottable('div'));
const RootContainer = SpotlightContainerDecorator(
	{
		enterTo: 'default-element',
		defaultElement: [`.${css.controlsHandleAbove}`, `.${css.controlsFrame}`]
	},
	RootComponent
);

const ControlsContainer = SpotlightContainerDecorator(
	{
		enterTo: 'default-element',
		straightOnly: true
	},
	'div'
);

const memoGetDurFmt = memoize((/* locale */) => new DurationFmt({
	length: 'medium', style: 'clock', useNative: false
}));

const getDurFmt = (locale) => {
	if (typeof window === 'undefined') return null;

	return memoGetDurFmt(locale);
};

const forwardWithState = (type) => (ev, props, {addStateToEvent}) => forwardWithPrevent(type, addStateToEvent({type}), props);

const forwardToggleMore = forward('onToggleMore');

// provide forwarding of events on media controls
const forwardControlsAvailable = forwardCustom('onControlsAvailable');
const forwardPlay = forwardWithState('onPlay');
const forwardWillPlay = forwardWithState('onWillPlay');
const forwardPause = forwardWithState('onPause');
const forwardWillPause = forwardWithState('onWillPause');
const forwardRewind = forwardWithState('onRewind');
const forwardWillRewind = forwardWithState('onWillRewind');
const forwardFastForward = forwardWithState('onFastForward');
const forwardWillFastForward = forwardWithState('onWillFastForward');
const forwardJumpBackward = forwardWithState('onJumpBackward');
const forwardWillJumpBackward = forwardWithState('onWillJumpBackward');
const forwardJumpForward = forwardWithState('onJumpForward');
const forwardWillJumpForward = forwardWithState('onWillJumpForward');
const forwardPrevious = forwardWithState('onPrevious');
const forwardWillPrevious = forwardWithState('onWillPrevious');
const forwardNext = forwardWithState('onNext');
const forwardWillNext = forwardWithState('onWillNext');

const AnnounceState = {
	// Video is loaded but additional announcements have not been made
	READY: 0,

	// The title should be announced
	TITLE: 1,

	// The title has been announced
	TITLE_READ: 2,

	// The infoComponents should be announced
	INFO: 3,

	// All announcements have been made
	DONE: 4
};

let warnedOnJumpBackward = false;
let warnedOnJumpForward = false;
let warnedOnWillJumpBackward = false;
let warnedOnWillJumpForward = false;

/**
 * Every callback sent by {@link limestone/VideoPlayer|VideoPlayer} receives a status package,
 * which includes an object with the following key/value pairs as the first argument:
 *
 * @typedef {Object} videoStatus
 * @memberof limestone/VideoPlayer
 * @property {String} type - Type of event that triggered this callback
 * @property {Number} currentTime - Playback index of the media in seconds
 * @property {Number} duration - Media's entire duration in seconds
 * @property {Boolean} paused - Playing vs paused state. `true` means the media is paused
 * @property {Number} playbackRate - Current playback rate, as a number
 * @property {Number} proportionLoaded - A value between `0` and `1` representing the proportion of the media that has loaded
 * @property {Number} proportionPlayed - A value between `0` and `1` representing the proportion of the media that has already been shown
 *
 * @public
 */

/**
 * A set of playback rates when media fast forwards, rewinds, slow-forwards, or slow-rewinds.
 *
 * The number used for each operation is proportional to the normal playing speed, 1. If the rate
 * is less than 1, it will play slower than normal speed, and, if it is larger than 1, it will play
 * faster. If it is negative, it will play backward.
 *
 * The order of numbers represents the incremental order of rates that will be used for each
 * operation. Note that rates can be expressed as decimals, strings, and fractions.
 * (e.g.: `0.5`, `'0.5'`, `'1/2'`).
 *
 * @typedef {Object} playbackRateHash
 * @memberof limestone/VideoPlayer
 * @property {[]} fastForward - An array of playback rates when media fast forwards
 * @property {[]} rewind - An array of playback rates when media rewinds
 * @property {[]} slowForward - An array of playback rates when media slow-forwards
 * @property {[]} slowRewind - An array of playback rates when media slow-rewinds
 *
 * @public
 */

const videoPlayerBaseDefaultProps = {
	autoCloseTimeout: 5000,
	feedbackHideDelay: 3000,
	includeTimeHour: false,
	initialJumpDelay: 400,
	jumpBy: 30,
	jumpDelay: 200,
	mediaControlsComponent: MediaControls,
	miniFeedbackHideDelay: 2000,
	playbackRateHash: {
		fastForward: ['2', '4', '8', '16'],
		rewind: ['-2', '-4', '-8', '-16'],
		slowForward: ['1/4', '1/2'],
		slowRewind: ['-1/2', '-1']
	},
	spotlightId: 'videoPlayer',
	titleHideDelay: 5000,
	videoComponent: Media
};

// Methods exposed through the stable `api` object. Child components, jobs and listeners call these
// so they always run the latest committed version of each method.
const apiMethodNames = [
	'activityDetected',
	'addStateToEvent',
	'announceNow',
	'areControlsVisible',
	'doAutoClose',
	'fastForward',
	'getMediaState',
	'getVideoNode',
	'handleControlsHandleAboveDown',
	'handleControlsHandleAboveHold',
	'handleControlsHandleAboveKeyDown',
	'handleControlsHandleAboveKeyUp',
	'handleEvent',
	'handleKnobMove',
	'handleLoadStart',
	'handleMediaControlsClose',
	'handleSliderBlur',
	'handleSliderFocus',
	'handleSliderKeyDown',
	'handleToggleMore',
	'hideControls',
	'hideFeedback',
	'hideMiniFeedback',
	'hideTitle',
	'jump',
	'next',
	'onSliderChange',
	'onVideoClick',
	'pause',
	'play',
	'previous',
	'releaseSlider5WayPress',
	'renderBottomControls',
	'rewind',
	'rewindManually',
	'seek',
	'setPlaybackSpeed',
	'shouldShowMiniFeedback',
	'showControls',
	'showControlsFromPointer',
	'showFeedback',
	'startDelayedFeedbackHide',
	'toggleControls'
];

const generateId = () => {
	return Math.random().toString(36).substring(2, 10);
};

const getInitialState = ({noAutoPlay, playbackRateHash}) => ({
	announce: AnnounceState.READY,
	currentTime: 0,
	duration: 0,
	error: false,
	loading: false,
	paused: noAutoPlay,
	playbackRate: 1,
	titleOffsetHeight: 0,
	bottomOffsetHeight: 0,

	// Non-standard state computed from properties
	bottomControlsRendered: false,
	feedbackAction: 'idle',
	feedbackVisible: false,
	infoVisible: false,
	mediaControlsVisible: false,
	mediaSliderVisible: false,
	miniFeedbackVisible: false,
	proportionLoaded: 0,
	proportionPlayed: 0,
	sourceUnavailable: true,
	titleVisible: true,

	// Instance values that are also rendered. `setRenderedValues()` keeps them in sync with the
	// instance values used by the methods.
	playbackRates: playbackRateHash.fastForward,
	prevCommand: (noAutoPlay ? 'pause' : 'play'),
	pulsedPlaybackRate: null,
	pulsedPlaybackState: null,
	speedIndex: 0
});

// Event handlers created with `handle()`. Each receives `(ev, props, api)` from `useHandlers`.
const handlers = {
	handleBack: handle(forwardCustom('onBack')),

	handleFastForward: handle(
		forwardWillFastForward,
		(ev, props, {shouldShowMiniFeedback}) => shouldShowMiniFeedback(ev),
		(ev, props, {fastForward}) => fastForward(),
		forwardFastForward
	),

	handleGlobalKeyDown: handle(
		returnsTrue((ev, props, {activityDetected}) => activityDetected()),
		forKey('down'),
		(ev, props, {areControlsVisible}) => (
			!areControlsVisible() &&
			((!Spotlight.getCurrent() && Spotlight.getPointerMode()) || !Spotlight.getPointerMode()) &&
			!props.spotlightDisabled
		),
		preventDefault,
		stopImmediate,
		(ev, props, {showControlsFromPointer}) => showControlsFromPointer()
	),

	handlePause: handle(
		forwardWillPause,
		(ev, props, {shouldShowMiniFeedback}) => shouldShowMiniFeedback(ev),
		(ev, props, {pause}) => pause(),
		forwardPause
	),

	handlePlay: handle(
		forwardWillPlay,
		(ev, props, {shouldShowMiniFeedback}) => shouldShowMiniFeedback(ev),
		(ev, props, {play}) => play(),
		forwardPlay
	),

	handleRewind: handle(
		forwardWillRewind,
		(ev, props, {shouldShowMiniFeedback}) => shouldShowMiniFeedback(ev),
		(ev, props, {rewind}) => rewind(),
		forwardRewind
	),

	onJumpBackward: handle(
		forwardWillJumpBackward,
		(ev, props, {jump}) => jump(-1 * props.jumpBy),
		forwardJumpBackward
	),

	onJumpForward: handle(
		forwardWillJumpForward,
		(ev, props, {jump}) => jump(props.jumpBy),
		forwardJumpForward
	),

	onNext: handle(
		forwardWillNext,
		// (ev, props, {next}) => next(),
		forwardNext
	),

	onPrevious: handle(
		forwardWillPrevious,
		// (ev, props, {previous}) => previous(),
		forwardPrevious
	)
};

// Equivalent of the class's `shouldComponentUpdate()`. Returns `true` to skip re-rendering. `prev`
// holds the props and state of the last commit, like `this.props` and `this.state` in the class.
const isRenderSkippable = ({componentProps: prevProps, state: prevState}, {componentProps: nextProps, state: nextState}) => (
	// Use shallow props compare instead of source comparison to support possible changes
	// from mediaComponent.
	shallowEqual(prevProps, nextProps) &&
	!prevState.miniFeedbackVisible && prevState.miniFeedbackVisible === nextState.miniFeedbackVisible &&
	!prevState.mediaSliderVisible && prevState.mediaSliderVisible === nextState.mediaSliderVisible &&
	prevState.loading === nextState.loading && prevProps.loading === nextProps.loading &&
	(
		prevState.currentTime !== nextState.currentTime ||
		prevState.proportionPlayed !== nextState.proportionPlayed ||
		prevState.sliderTooltipTime !== nextState.sliderTooltipTime
	)
);

// Compares the next render with the last commit (not the last render of the view) so renders are
// skipped exactly when the class's `shouldComponentUpdate()` returned `false`
const isViewRenderSkippable = (prevViewProps, nextViewProps) => {
	const {lastCommit} = nextViewProps.instanceRef.current;

	return Boolean(lastCommit) && isRenderSkippable(lastCommit, nextViewProps);
};

const getControlsAriaProps = (announce, id) => {
	if (announce === AnnounceState.TITLE) {
		return {
			'aria-labelledby': `${id}_mediaTitle_title ${id}_mediaControls_actionGuide`,
			'aria-live': 'off',
			role: 'alert'
		};
	} else if (announce === AnnounceState.INFO) {
		return {
			'aria-labelledby': `${id}_mediaTitle_info`,
			role: 'region'
		};
	}

	return null;
};

// Renders the player. It is memoized with `isViewRenderSkippable()` to keep the class's
// `shouldComponentUpdate()` behavior.
const VideoPlayerView = memo(({api, componentProps, eventHandlers, hasNextHandler, hasPreviousHandler, id, playerRef, refCallbacks, state}) => {
	const {setAnnounceRef, setTitleRef, setVideoRef} = refCallbacks;
	const {
		backButtonAriaLabel,
		className,
		disabled,
		infoComponents,
		initialJumpDelay,
		jumpDelay,
		loading,
		locale,
		mediaControlsComponent,
		no5WayJump,
		noAutoPlay,
		noMiniFeedback,
		noSlider,
		noSpinner,
		selection,
		includeTimeHour,
		spotlightDisabled,
		spotlightId,
		style,
		thumbnailComponent,
		thumbnailSrc,
		title,
		videoComponent: VideoComponent,
		...mediaProps
	} = componentProps;

	delete mediaProps.announce;
	delete mediaProps.autoCloseTimeout;
	delete mediaProps.children;
	delete mediaProps.feedbackHideDelay;
	delete mediaProps.jumpBy;
	delete mediaProps.miniFeedbackHideDelay;
	delete mediaProps.noAutoShowMediaControls;
	delete mediaProps.noMediaSliderFeedback;
	delete mediaProps.onBack;
	delete mediaProps.onControlsAvailable;
	delete mediaProps.onFastForward;
	delete mediaProps.onJumpBackward;
	delete mediaProps.onJumpForward;
	delete mediaProps.onNext;
	delete mediaProps.onPause;
	delete mediaProps.onPlay;
	delete mediaProps.onPrevious;
	delete mediaProps.onRewind;
	delete mediaProps.onWillFastForward;
	delete mediaProps.onWillJumpBackward;
	delete mediaProps.onWillJumpForward;
	delete mediaProps.onWillNext;
	delete mediaProps.onWillPause;
	delete mediaProps.onWillPlay;
	delete mediaProps.onWillPrevious;
	delete mediaProps.onWillRewind;
	delete mediaProps.onScrub;
	delete mediaProps.onSeekFailed;
	delete mediaProps.onSeekOutsideSelection;
	delete mediaProps.onToggleMore;
	delete mediaProps.pauseAtEnd;
	delete mediaProps.playbackRateHash;
	delete mediaProps.seekDisabled;
	delete mediaProps.setApiProvider;
	delete mediaProps.thumbnailUnavailable;
	delete mediaProps.titleHideDelay;
	delete mediaProps.videoPath;

	mediaProps.autoPlay = !noAutoPlay;
	mediaProps.className = css.video;
	mediaProps.controls = false;
	mediaProps.mediaComponent = 'video';
	mediaProps.onLoadStart = api.handleLoadStart;
	mediaProps.onUpdate = api.handleEvent;
	mediaProps.ref = setVideoRef;

	const controlsAriaProps = getControlsAriaProps(state.announce, id);

	let proportionSelection = selection;
	if (proportionSelection != null && state.duration) {
		proportionSelection = selection.map(t => t / state.duration);
	}

	const durFmt = getDurFmt(locale);
	const controlsHandleAboveHoldConfig = getControlsHandleAboveHoldConfig({frequency: jumpDelay, time: initialJumpDelay});
	const playbackRate = state.playbackRates[state.speedIndex];

	return (
		<RootContainer
			className={css.videoPlayer + ' enact-fit' + (className ? ' ' + className : '')}
			onClick={api.activityDetected}
			playerRef={playerRef}
			spotlightDisabled={spotlightDisabled}
			spotlightId={spotlightId}
			style={style}
		>
			{/* Video Section */}
			{
				// Duplicating logic from <ComponentOverride /> until enzyme supports forwardRef
				VideoComponent && (
					(typeof VideoComponent === 'function' || typeof VideoComponent === 'string') && (
						<VideoComponent {...mediaProps} />
					) || isValidElement(VideoComponent) && (
						cloneElement(VideoComponent, mediaProps)
					)
				) || null
			}

			<Overlay
				bottomControlsVisible={state.mediaControlsVisible}
				onClick={api.onVideoClick}
			>
				{!noSpinner && (state.loading || loading) ? <Spinner centered /> : null}
			</Overlay>

			{state.bottomControlsRendered ?
				<div className={css.fullscreen} {...controlsAriaProps}>
					{
						state.mediaControlsVisible ?
							<Button
								aria-label={backButtonAriaLabel == null ? $L('go to previous') : backButtonAriaLabel}
								className={css.back}
								icon="arrowhookleft"
								iconFlip="auto"
								onClick={eventHandlers.handleBack}
								size="small"
							/> :
							null
					}
					<FeedbackContent
						className={css.miniFeedback}
						playbackRate={state.pulsedPlaybackRate || playbackRate}
						playbackState={state.pulsedPlaybackState || state.prevCommand}
						visible={state.miniFeedbackVisible && !noMiniFeedback}
					>
						{secondsToTime(state.sliderTooltipTime, durFmt, {includeHour: false})}
					</FeedbackContent>
					<ControlsContainer
						className={css.bottom + (state.mediaControlsVisible ? '' : ' ' + css.hidden) + (state.infoVisible ? ' ' + css.lift : '')}
						spotlightDisabled={spotlightDisabled || !state.mediaControlsVisible}
					>
						{/*
							Info Section: Title, Description, Times
							Only render when `state.mediaControlsVisible` is true in order for `Marquee`
							to make calculations correctly in `MediaTitle`.
						*/}
						{state.mediaSliderVisible ?
							<div className={css.infoFrame}>
								<MediaTitle
									id={`${id}_mediaTitle`}
									infoVisible={state.infoVisible}
									ref={setTitleRef}
									title={title}
									visible={state.titleVisible && state.mediaControlsVisible}
								>
									{infoComponents}
								</MediaTitle>
								{noSlider ?
									<Times current={state.currentTime} total={state.duration} formatter={durFmt} includeHour={includeTimeHour} /> :
									null
								}
							</div> :
							null
						}
						{noSlider ?
							null :
							<div className={css.sliderContainer}>
								{state.mediaSliderVisible ?
									<Times noTotalTime current={state.currentTime} formatter={durFmt} includeHour={includeTimeHour}  /> :
									null
								}
								<MediaSlider
									aria-valuetext=" "
									backgroundProgress={state.proportionLoaded}
									disabled={disabled || state.sourceUnavailable}
									forcePressed={state.slider5WayPressed}
									onBlur={api.handleSliderBlur}
									onChange={api.onSliderChange}
									onFocus={api.handleSliderFocus}
									onKeyDown={api.handleSliderKeyDown}
									onKnobMove={api.handleKnobMove}
									selection={proportionSelection}
									spotlightDisabled={spotlightDisabled || !state.mediaControlsVisible}
									value={state.proportionPlayed}
									visible={state.mediaSliderVisible}
								>
									<FeedbackTooltip
										action={state.feedbackAction}
										duration={state.duration}
										formatter={durFmt}
										hidden={!state.feedbackVisible || state.sourceUnavailable}
										playbackRate={playbackRate}
										playbackState={state.prevCommand}
										thumbnailComponent={thumbnailComponent}
										thumbnailDeactivated={componentProps.thumbnailUnavailable}
										thumbnailSrc={thumbnailSrc}
									/>
								</MediaSlider>
								{state.mediaSliderVisible ?
									<Times noCurrentTime total={state.duration} formatter={durFmt} includeHour={includeTimeHour} /> :
									null
								}
							</div>
						}
						<ComponentOverride
							component={mediaControlsComponent}
							id={`${id}_mediaControls`}
							initialJumpDelay={initialJumpDelay}
							jumpDelay={jumpDelay}
							mediaDisabled={disabled || state.sourceUnavailable}
							no5WayJump={no5WayJump}
							onClose={api.handleMediaControlsClose}
							onFastForward={eventHandlers.handleFastForward}
							onJumpBackwardButtonClick={eventHandlers.onJumpBackward}
							onJumpForwardButtonClick={eventHandlers.onJumpForward}
							onNextButtonClick={hasNextHandler ? eventHandlers.onNext : null}
							onPause={eventHandlers.handlePause}
							onPlay={eventHandlers.handlePlay}
							onPreviousButtonClick={hasPreviousHandler ? eventHandlers.onPrevious : null}
							onRewind={eventHandlers.handleRewind}
							onToggleMore={api.handleToggleMore}
							paused={state.paused}
							spotlightId={`${spotlightId}_mediaControls`}
							spotlightDisabled={!state.mediaControlsVisible || spotlightDisabled}
							visible={state.mediaControlsVisible}
						/>
					</ControlsContainer>
				</div> :
				null
			}
			<SpottableDiv
				// This captures spotlight focus for use with 5-way.
				// It's non-visible but lives at the top of the VideoPlayer.
				className={css.controlsHandleAbove}
				holdConfig={controlsHandleAboveHoldConfig}
				onDown={api.handleControlsHandleAboveDown}
				onHold={api.handleControlsHandleAboveHold}
				onKeyDown={api.handleControlsHandleAboveKeyDown}
				onKeyUp={api.handleControlsHandleAboveKeyUp}
				onSpotlightDown={api.showControls}
				selectionKeys={controlsHandleAboveSelectionKeys}
				spotlightDisabled={state.mediaControlsVisible || spotlightDisabled}
			/>
			<Announce ref={setAnnounceRef} />
		</RootContainer>
	);
}, isViewRenderSkippable);

VideoPlayerView.displayName = 'VideoPlayerView';

VideoPlayerView.propTypes = {
	api: PropTypes.object.isRequired,
	componentProps: PropTypes.object.isRequired,
	eventHandlers: PropTypes.object.isRequired,
	hasNextHandler: PropTypes.bool.isRequired,
	hasPreviousHandler: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	playerRef: PropTypes.object.isRequired,
	refCallbacks: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired
};

/**
 * A player for video {@link limestone/VideoPlayer.VideoPlayerBase}.
 *
 * @class VideoPlayerBase
 * @memberof limestone/VideoPlayer
 * @ui
 * @public
 */
const VideoPlayerBase = (rawProps) => {
	checkPropTypes(VideoPlayerBase, rawProps);

	const componentProps = setDefaultProps(rawProps, videoPlayerBaseDefaultProps);
	const floatingLayerContext = useContext(FloatingLayerContext);

	// Instance values. Equivalent of the class's instance fields.
	const instance = useRef({
		announceRef: null,
		firstPlayReadFlag: false,
		floatingLayerController: null,
		jumpKeyPressed: null,
		lastCommit: null,
		methods: null,
		playbackRate: 1,
		playbackRates: componentProps.playbackRateHash.fastForward,
		prevCommand: (componentProps.noAutoPlay ? 'pause' : 'play'),
		pulsedPlaybackRate: null,
		pulsedPlaybackState: null,
		rewindBeginTime: 0,
		showMiniFeedback: false,
		sliderKnobProportion: 0,
		sliderScrubbing: false,
		speedIndex: 0,
		titleRef: null,
		video: null,
		videoProxy: null
	});
	const playerRef = useRef(null);

	// Stable callbacks that call the latest committed methods
	const [api] = useState(() => {
		const result = {};
		apiMethodNames.forEach((name) => {
			result[name] = (...args) => instance.current.methods[name](...args);
		});
		return result;
	});

	const [jobs] = useState(() => ({
		announce: new Job(api.announceNow, 200),
		autoClose: new Job(api.doAutoClose),
		hideFeedback: new Job(api.hideFeedback),
		hideMiniFeedback: new Job(api.hideMiniFeedback),
		hideTitle: new Job(api.hideTitle),
		renderBottomControl: new Job(api.renderBottomControls),
		rewind: new Job(api.rewindManually, 100),
		slider5WayPress: new Job(api.releaseSlider5WayPress, 200)
	}));

	// Ref callbacks for the video, title and announce nodes
	const [refCallbacks] = useState(() => ({
		setVideoRef: (video) => {
			instance.current.video = video;
		},
		setTitleRef: (node) => {
			instance.current.titleRef = node;
		},
		setAnnounceRef: (node) => {
			instance.current.announceRef = node;
		}
	}));

	const [id] = useState(generateId);

	// The `onNext` and `onPrevious` handlers are only created when one of their callbacks is
	// provided on mount, matching the class's instance fields.
	const [hasNextHandler] = useState(() => Boolean(componentProps.onWillNext || componentProps.onNext));
	const [hasPreviousHandler] = useState(() => Boolean(componentProps.onWillPrevious || componentProps.onPrevious));

	const [state, setReactState] = useState(() => getInitialState(componentProps));

	const eventHandlers = useHandlers(handlers, componentProps, api);

	const mediaControlsSpotlightId = componentProps.spotlightId + '_mediaControls';

	// Merges a partial state (or the result of an updater) like the class's `setState()`.
	const setState = (update) => {
		setReactState((prevState) => {
			const partial = typeof update === 'function' ? update(prevState) : update;

			if (partial == null || Object.keys(partial).every(key => prevState[key] === partial[key])) {
				return prevState;
			}

			return {...prevState, ...partial};
		});
	};

	// Updates instance values that are also rendered
	const setRenderedValues = (values) => {
		Object.assign(instance.current, values);
		setState(values);
	};

	//
	// Internal Methods
	//

	const announceNow = (msg, clear) => (instance.current.announceRef && instance.current.announceRef.announce(msg, clear));

	const announce = (msg, clear) => {
		jobs.announce.start(msg, clear);
	};

	const startAutoCloseTimeout = () => {
		// If this.state.more is used as a reference for when this function should fire, timing for
		// detection of when "more" is pressed vs when the state is updated is mismatched. Using an
		// instance variable that's only set and used for this express purpose seems cleanest.
		if (componentProps.autoCloseTimeout && state.mediaControlsVisible) {
			jobs.autoClose.startAfter(componentProps.autoCloseTimeout);
		}
	};

	const activityDetected = () => {
		startAutoCloseTimeout();
	};

	const stopAutoCloseTimeout = () => {
		jobs.autoClose.stop();
	};

	const isTimeBeyondSelection = (time) => {
		const {selection} = componentProps;

		// if selection isn't set or only contains the starting value, there isn't a valid selection
		// with which to test the time
		if (selection != null && selection.length >= 2) {
			const [start, end] = selection;

			return time > end || time < start;
		}

		return false;
	};

	const preventTimeChange = (time) => {
		return (
			isTimeBeyondSelection(time) &&
			!forwardWithPrevent('onSeekOutsideSelection', {type: 'onSeekOutsideSelection', time}, componentProps)
		);
	};

	/**
	 * If the announce state is either ready to read the title or ready to read info, advance the
	 * state to "read".
	 *
	 * @returns {Boolean} Returns true to be used in event handlers
	 * @private
	 */
	const markAnnounceRead = () => {
		if (state.announce === AnnounceState.TITLE) {
			setState({announce: AnnounceState.TITLE_READ});
		} else if (state.announce === AnnounceState.INFO) {
			setState({announce: AnnounceState.DONE});
		}

		return true;
	};

	const startDelayedTitleHide = () => {
		if (componentProps.titleHideDelay) {
			jobs.hideTitle.startAfter(componentProps.titleHideDelay);
		}
	};

	const stopDelayedTitleHide = () => {
		jobs.hideTitle.stop();
	};

	const hideTitle = () => {
		setState({titleVisible: false});
	};

	const startDelayedFeedbackHide = () => {
		if (componentProps.feedbackHideDelay) {
			jobs.hideFeedback.startAfter(componentProps.feedbackHideDelay);
		}
	};

	const stopDelayedFeedbackHide = () => {
		jobs.hideFeedback.stop();
	};

	const startDelayedMiniFeedbackHide = (delay = componentProps.miniFeedbackHideDelay) => {
		if (delay) {
			jobs.hideMiniFeedback.startAfter(delay);
		}
	};

	const stopDelayedMiniFeedbackHide = () => {
		jobs.hideMiniFeedback.stop();
	};

	/**
	 * Shows media controls.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const showControls = () => {
		if (componentProps.disabled) {
			return;
		}

		startDelayedFeedbackHide();
		startDelayedTitleHide();

		setState(({announce: prevAnnounce}) => {
			let nextAnnounce = prevAnnounce;

			if (prevAnnounce === AnnounceState.READY) {
				// if we haven't read the title yet, do so this time
				nextAnnounce = AnnounceState.TITLE;
			} else if (prevAnnounce === AnnounceState.TITLE) {
				// if we have read the title, advance to INFO so title isn't read again
				nextAnnounce = AnnounceState.TITLE_READ;
			}

			return {
				announce: nextAnnounce,
				bottomControlsRendered: true,
				feedbackAction: 'idle',
				feedbackVisible: true,
				mediaControlsVisible: true,
				mediaSliderVisible: true,
				miniFeedbackVisible: false,
				titleVisible: true
			};
		});
	};

	/**
	 * Hides media controls.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const hideControls = () => {
		stopDelayedFeedbackHide();
		stopDelayedMiniFeedbackHide();
		stopDelayedTitleHide();
		stopAutoCloseTimeout();
		setState({
			feedbackAction: 'idle',
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: false,
			miniFeedbackVisible: false,
			infoVisible: false
		});
		markAnnounceRead();
	};

	/**
	 * Toggles the media controls.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const toggleControls = () => {
		if (state.mediaControlsVisible) {
			hideControls();
		} else {
			showControls();
		}
	};

	const doAutoClose = () => {
		stopDelayedFeedbackHide();
		stopDelayedTitleHide();
		setState(({mediaSliderVisible, miniFeedbackVisible}) => ({
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: mediaSliderVisible && miniFeedbackVisible,
			infoVisible: false
		}));
		markAnnounceRead();
	};

	const showFeedback = () => {
		if (state.mediaControlsVisible) {
			setState({
				feedbackVisible: true
			});
		} else {
			const shouldShowSlider = instance.current.pulsedPlaybackState !== null || calcNumberValueOfPlaybackRate(instance.current.playbackRate) !== 1;

			if (instance.current.showMiniFeedback && (!state.miniFeedbackVisible || state.mediaSliderVisible !== shouldShowSlider)) {
				setState(({loading, duration, error}) => ({
					mediaSliderVisible: shouldShowSlider && !componentProps.noMediaSliderFeedback,
					miniFeedbackVisible: !(loading || !duration || error)
				}));
			}
		}
	};

	const hideFeedback = () => {
		if (state.feedbackVisible && state.feedbackAction !== 'focus') {
			setState({
				feedbackVisible: false,
				feedbackAction: 'idle'
			});
		}
	};

	const hideMiniFeedback = () => {
		if (state.miniFeedbackVisible) {
			instance.current.showMiniFeedback = false;
			setState({
				mediaSliderVisible: false,
				miniFeedbackVisible: false
			});
		}
	};

	const showControlsFromPointer = () => {
		Spotlight.setPointerMode(false);
		showControls();
	};

	const clearPulsedPlayback = () => {
		setRenderedValues({
			pulsedPlaybackRate: null,
			pulsedPlaybackState: null
		});
	};

	// only show mini feedback if playback controls are invoked by a key event
	const shouldShowMiniFeedback = (ev) => {
		if (ev.type === 'keyup') {
			instance.current.showMiniFeedback = true;
		}
		return true;
	};

	//
	// Media Interaction Methods
	//

	/**
	 * Returns an object with the current state of the media including `currentTime`, `duration`,
	 * `paused`, `playbackRate`, `proportionLoaded`, and `proportionPlayed`.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @returns {Object}
	 * @public
	 */
	const getMediaState = () => {
		const {video} = instance.current;

		return {
			currentTime       : video.currentTime,
			duration          : state.duration,
			paused            : state.seekingMode ? (video.playbackRate !== 1 || video.paused) : video.paused,
			playbackRate      : video.playbackRate,
			proportionLoaded  : video.proportionLoaded,
			proportionPlayed  : video.proportionPlayed || 0
		};
	};

	/**
	 * The primary means of interacting with the `<video>` element.
	 *
	 * @param  {String} action The method to preform.
	 * @param  {Multiple} props  The arguments, in the format that the action method requires.
	 *
	 * @private
	 */
	const send = (action, props) => {
		clearPulsedPlayback();
		showFeedback();
		startDelayedFeedbackHide();
		instance.current.video[action](props);
	};

	/**
	 * Sets the playback rate type for video seeking (from the keys of {@link limestone/VideoPlayer.VideoPlayer.playbackRateHash|playbackRateHash}).
	 *
	 * @param {String} cmd - Key of the playback rate type.
	 * @private
	 */
	const selectPlaybackRates = (cmd) => {
		setRenderedValues({playbackRates: componentProps.playbackRateHash[cmd]});
	};

	/**
	 * Changes playbackRate to a valid value when initiating fast-forward or rewind.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @private
	 */
	const clampPlaybackRate = (idx) => {
		if (!instance.current.playbackRates) {
			return;
		}

		return idx % instance.current.playbackRates.length;
	};

	/**
	 * Retrieves the playback rate value.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @returns {Number|String} The playback rate value.
	 * @private
	 */
	const selectPlaybackRate = (idx) => {
		return instance.current.playbackRates[idx];
	};

	/**
	 * Starts rewind job.
	 *
	 * @private
	 */
	const startRewindJob = () => {
		instance.current.rewindBeginTime = perfNow();
		jobs.rewind.start();
	};

	/**
	 * Stops rewind job.
	 *
	 * @private
	 */
	const stopRewindJob = () => {
		jobs.rewind.stop();
	};

	/**
	 * Implements custom rewind functionality (until browsers support negative playback rate).
	 *
	 * @private
	 */
	const beginRewind = () => {
		send('pause');
		startRewindJob();
	};

	/**
	 * Sets playbackRate.
	 *
	 * @param {Number|String} rate - The desired playback rate.
	 * @private
	 */
	const setPlaybackRate = (rate) => {
		if (state.seekingMode) {
			// Stop rewind (if happening)
			stopRewindJob();
		}

		// Make sure rate is a string
		instance.current.playbackRate = String(rate);
		const pbNumber = calcNumberValueOfPlaybackRate(instance.current.playbackRate);

		if (platform.type !== 'webos') {
			// ReactDOM throws error for setting negative value for playbackRate
			instance.current.video.playbackRate = pbNumber < 0 ? 0 : pbNumber;

			if (state.seekingMode) {
				// For supporting cross browser behavior
				if (pbNumber < 0) {
					beginRewind();
				}
			}
		} else {
			// Set native playback rate
			instance.current.video.playbackRate = pbNumber;
		}
	};

	/**
	 * Programmatically plays the current media.
	 * If you call this function during fast forwarding or rewinding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const play = () => {
		if (state.sourceUnavailable) {
			return false;
		}

		if (state.seekingMode) {
			setPlaybackRate(1);
		}
		// must happen before send() to ensure feedback uses the right value
		// TODO: refactor into this.state member
		setRenderedValues({
			prevCommand: 'play',
			speedIndex: 0
		});
		send('play');
		announce($L('Play'));
		startDelayedMiniFeedbackHide(5000);

		return true;
	};

	/**
	 * Programmatically pauses the current media.
	 * If you call this function during fast forwarding or rewinding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const pause = () => {
		if (state.sourceUnavailable) {
			return false;
		}

		if (state.seekingMode) {
			setPlaybackRate(1);
		}
		// must happen before send() to ensure feedback uses the right value
		// TODO: refactor into this.state member
		setRenderedValues({
			prevCommand: 'pause',
			speedIndex: 0
		});
		send('pause');
		announce($L('Pause'));
		stopDelayedMiniFeedbackHide();

		return true;
	};

	/**
	 * Sets the media playback time index.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @param {Number} timeIndex - Time index to seek
	 * @public
	 */
	const seek = (timeIndex) => {
		if (!componentProps.seekDisabled && !isNaN(instance.current.video.duration) && !state.sourceUnavailable) {
			instance.current.video.currentTime = timeIndex;
		} else {
			forwardCustom('onSeekFailed')(null, componentProps);
		}
	};

	/**
	 * Step a given amount of time away from the current playback position.
	 * Like {@link limestone/VideoPlayer.VideoPlayerBase.seek|seek} but relative.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @param {Number} distance - Time value to jump
	 * @public
	 */
	const jump = (distance) => {
		if (state.sourceUnavailable) {
			return false;
		}

		setRenderedValues({
			pulsedPlaybackRate: toUpperCase(new DurationFmt({length: 'long'}).format({second: componentProps.jumpBy})),
			pulsedPlaybackState: distance > 0 ? 'jumpForward' : 'jumpBackward'
		});
		showFeedback();
		startDelayedFeedbackHide();
		seek(state.currentTime + distance);
		startDelayedMiniFeedbackHide();

		return true;
	};

	const next = () => {
		// next api will be implemented in 2.0.0.
		return true;
	};

	const previous = () => {
		// previous api will be implemented in 2.0.0.
		return true;
	};

	/**
	 * Fast forwards the current media for seeking.
	 * This function changes the playback rate.
	 * If you call `play` or `pause` during fast forwarding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const fastForward = () => {
		if (state.sourceUnavailable) {
			return false;
		}

		setState({seekingMode : true});
		let shouldResumePlayback = false;

		switch (instance.current.prevCommand) {
			case 'slowForward':
				if (instance.current.speedIndex === instance.current.playbackRates.length - 1) {
					// reached to the end of array => fastforward
					selectPlaybackRates('fastForward');
					setRenderedValues({
						prevCommand: 'fastForward',
						speedIndex: 0
					});
				} else {
					setRenderedValues({speedIndex: clampPlaybackRate(instance.current.speedIndex + 1)});
				}
				break;
			case 'pause':
				selectPlaybackRates('slowForward');
				if (state.paused) {
					shouldResumePlayback = true;
				}
				setRenderedValues({
					prevCommand: 'slowForward',
					speedIndex: 0
				});
				break;
			case 'fastForward':
				setRenderedValues({
					prevCommand: 'fastForward',
					speedIndex: clampPlaybackRate(instance.current.speedIndex + 1)
				});
				break;
			default:
				selectPlaybackRates('fastForward');
				setRenderedValues({
					prevCommand: 'fastForward',
					speedIndex: 0
				});
				if (state.paused) {
					shouldResumePlayback = true;
				}
				break;
		}

		setPlaybackRate(selectPlaybackRate(instance.current.speedIndex));

		if (shouldResumePlayback) send('play');

		stopDelayedFeedbackHide();
		stopDelayedMiniFeedbackHide();
		clearPulsedPlayback();
		showFeedback();

		return true;
	};

	/**
	 * Rewinds the current media for seeking.
	 * This function changes the playback rate.
	 * If you call `play` or `pause` during rewinding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const rewind = () => {
		if (state.sourceUnavailable) {
			return false;
		}

		setState({seekingMode: true});
		const rateForSlowRewind = componentProps.playbackRateHash['slowRewind'];
		let shouldResumePlayback = false,
			command = 'rewind';

		if (instance.current.video.currentTime === 0) {
			// Do not rewind if currentTime is 0. We're already at the beginning.
			return true;
		}

		switch (instance.current.prevCommand) {
			case 'slowRewind':
				if (instance.current.speedIndex === instance.current.playbackRates.length - 1) {
					// reached to the end of array => go to rewind
					selectPlaybackRates(command);
					setRenderedValues({
						prevCommand: command,
						speedIndex: 0
					});
				} else {
					setRenderedValues({speedIndex: clampPlaybackRate(instance.current.speedIndex + 1)});
				}
				break;
			case 'pause':
				// If it's possible to slowRewind, do it, otherwise just leave it as normal rewind : QEVENTSEVT-17386
				if (rateForSlowRewind && rateForSlowRewind.length >= 0) {
					command = 'slowRewind';
				}
				selectPlaybackRates(command);
				if (state.paused && state.duration > state.currentTime) {
					shouldResumePlayback = true;
				}
				setRenderedValues({
					prevCommand: command,
					speedIndex: 0
				});
				break;
			case 'rewind':
				setRenderedValues({
					prevCommand: command,
					speedIndex: clampPlaybackRate(instance.current.speedIndex + 1)
				});
				break;
			default:
				selectPlaybackRates(command);
				setRenderedValues({
					prevCommand: command,
					speedIndex: 0
				});
				break;
		}

		setPlaybackRate(selectPlaybackRate(instance.current.speedIndex));

		if (shouldResumePlayback) send('play');

		stopDelayedFeedbackHide();
		stopDelayedMiniFeedbackHide();
		clearPulsedPlayback();
		showFeedback();

		return true;
	};

	/**
	 * Sets the playback speed.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @param {Number} rate - The desired playback rate. This value is passed to the `playbackRate` property of `HTMLMediaElement`.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate|MDN playbackRate property}
	 * @returns {Boolean} Returns true if the speed changes successfully.
	 * @public
	 */
	const setPlaybackSpeed = (rate) => {
		if (state.sourceUnavailable) {
			return false;
		}

		setState({seekingMode: false});
		setPlaybackRate(rate);

		return true;
	};

	/**
	 * Returns a proxy to the underlying `<video>` node currently used by the VideoPlayer
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	const getVideoNode = () => {
		// Creates a proxy to the video node if Proxy is supported
		if (typeof Proxy === 'function' && !instance.current.videoProxy) {
			instance.current.videoProxy = new Proxy({}, {
				get: (target, name) => {
					let value = instance.current.video[name];

					if (typeof value === 'function') {
						value = value.bind(instance.current.video);
					}

					return value;
				},
				set: (target, name, value) => {
					return (instance.current.video[name] = value);
				}
			});
		}

		return instance.current.videoProxy || instance.current.video;
	};

	const areControlsVisible = () => {
		return state.mediaControlsVisible;
	};

	/**
	 * Calculates the time that has elapsed since. This is necessary for browsers until negative
	 * playback rate is directly supported.
	 *
	 * @private
	 */
	const rewindManually = () => {
		const now = perfNow(),
			distance = now - instance.current.rewindBeginTime,
			pbRate = calcNumberValueOfPlaybackRate(instance.current.playbackRate),
			adjustedDistance = (distance * pbRate) / 1000;

		jump(adjustedDistance);
		stopDelayedMiniFeedbackHide();
		clearPulsedPlayback();
		startRewindJob();	// Issue another rewind tick
	};

	const handleLoadStart = () => {
		instance.current.firstPlayReadFlag = true;
		setRenderedValues({
			prevCommand: componentProps.noAutoPlay ? 'pause' : 'play',
			speedIndex: 0
		});
		setState({
			announce: AnnounceState.READY,
			currentTime: 0,
			sourceUnavailable: true,
			proportionPlayed: 0,
			proportionLoaded: 0
		});

		if (!componentProps.noAutoShowMediaControls) {
			if (!state.bottomControlsRendered) {
				jobs.renderBottomControl.idle();
			} else {
				showControls();
			}
		}
	};

	const handleJump = ({keyCode}) => {
		if (componentProps.seekDisabled) {
			forwardCustom('onSeekFailed')(null, componentProps);
		} else {
			const jumpBy = (is('left', keyCode) ? -1 : 1) * componentProps.jumpBy;
			const time = Math.min(state.duration, Math.max(0, state.currentTime + jumpBy));

			if (preventTimeChange(time)) return;

			instance.current.showMiniFeedback = true;
			jump(jumpBy);
			jobs.announce.startAfter(500, secondsToTime(instance.current.video.currentTime, getDurFmt(componentProps.locale), {includeHour: true}));
		}
	};

	const handleControlsHandleAboveHold = () => {
		if (shouldJump(componentProps, state)) {
			handleJump({keyCode: instance.current.jumpKeyPressed === -1 ? jumpBackKeyCode : jumpForwardKeyCode});
		}
	};

	const handleControlsHandleAboveKeyDown = ({keyCode}) => {
		if (isEnter(keyCode)) {
			instance.current.jumpKeyPressed = 0;
		} else if (isLeft(keyCode)) {
			instance.current.jumpKeyPressed = -1;
		} else if (isRight(keyCode)) {
			instance.current.jumpKeyPressed = 1;
		}
	};

	const handleControlsHandleAboveKeyUp = ({keyCode}) => {
		if (isEnter(keyCode) || isLeft(keyCode) || isRight(keyCode)) {
			instance.current.jumpKeyPressed = null;
		}
	};

	const handleControlsHandleAboveDown = () => {
		const {jumpKeyPressed} = instance.current;

		if (jumpKeyPressed === 0) {
			showControls();
		} else if (jumpKeyPressed === -1 || jumpKeyPressed === 1) {
			const keyCode = jumpKeyPressed === -1 ? jumpBackKeyCode : jumpForwardKeyCode;

			if (shouldJump(componentProps, state)) {
				handleJump({keyCode});
			} else {
				Spotlight.move(getDirection(keyCode));
			}
		}
	};

	const handleEvent = () => {
		const el = instance.current.video;
		const updatedState = {
			// Standard media properties
			currentTime: el.currentTime,
			duration: el.duration,
			paused: state.seekingMode ? (el.playbackRate !== 1 || el.paused) : el.paused,
			playbackRate: el.playbackRate,

			// Non-standard state computed from properties
			error: el.error,
			loading: el.loading,
			proportionLoaded: el.proportionLoaded,
			proportionPlayed: el.proportionPlayed || 0,
			sliderTooltipTime: el.currentTime,
			// note: `el.loading && state.sourceUnavailable == false` is equivalent to `oncanplaythrough`
			sourceUnavailable: el.loading && state.sourceUnavailable || el.error
		};

		// If there's an error, we're obviously not loading, no matter what the readyState is.
		if (updatedState.error) updatedState.loading = false;

		const isRewind = instance.current.prevCommand === 'rewind' || instance.current.prevCommand === 'slowRewind';
		const isForward = instance.current.prevCommand === 'fastForward' || instance.current.prevCommand === 'slowForward';
		if (componentProps.pauseAtEnd && (el.currentTime === 0 && isRewind || el.currentTime === el.duration && isForward)) {
			pause();
		}

		setState(updatedState);
	};

	const renderBottomControls = () => {
		if (!state.bottomControlsRendered) {
			setState({bottomControlsRendered: true});
		}
	};

	//
	// Handled Media events
	//
	const addStateToEvent = (ev) => {
		return {
			// More props from `ev` may be added here as needed, but a full copy via `...ev`
			// overloads Storybook's Action Logger and likely has other perf fallout.
			type: ev.type,
			// Specific state variables are included in the outgoing callback payload, not all of them
			...getMediaState()
		};
	};

	//
	// Player Interaction events
	//
	const onVideoClick = () => {
		toggleControls();
	};

	const onSliderChange = ({value}) => {
		const time = value * state.duration;

		if (preventTimeChange(time)) return;

		seek(time);
		instance.current.sliderScrubbing = false;
	};

	const handleKnobMove = (ev) => {
		instance.current.sliderScrubbing = true;

		// prevent announcing repeatedly when the knob is detached from the progress.
		// TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
		if (instance.current.sliderKnobProportion !== ev.proportion) {
			instance.current.sliderKnobProportion = ev.proportion;
			const seconds = Math.floor(instance.current.sliderKnobProportion * instance.current.video.duration);

			if (!isNaN(seconds)) {
				const knobTime = secondsToTime(seconds, getDurFmt(componentProps.locale), {includeHour: true});

				forward('onScrub', {...ev, seconds, type: 'onScrub'}, componentProps);

				announce(`${$L('jump to')} ${knobTime}`, true);
			}
		}
	};

	const handleSliderFocus = () => {
		const seconds = Math.floor(instance.current.sliderKnobProportion * instance.current.video.duration);
		instance.current.sliderScrubbing = true;

		setState({
			feedbackAction: 'focus',
			feedbackVisible: true
		});
		stopDelayedFeedbackHide();

		if (!isNaN(seconds)) {
			const knobTime = secondsToTime(seconds, getDurFmt(componentProps.locale), {includeHour: true});

			forward('onScrub', {
				detached: instance.current.sliderScrubbing,
				proportion: instance.current.sliderKnobProportion,
				seconds,
				type: 'onScrub'
			},
			componentProps);

			announce(`${$L('jump to')} ${knobTime}`, true);
		}
	};

	const handleSliderBlur = () => {
		instance.current.sliderScrubbing = false;
		startDelayedFeedbackHide();
		setState(() => ({
			feedbackAction: 'blur',
			feedbackVisible: true
		}));
	};

	const releaseSlider5WayPress = () => {
		setState({slider5WayPressed: false});
	};

	const handleSliderKeyDown = (ev) => {
		const {keyCode} = ev;

		if (is('enter', keyCode)) {
			jobs.slider5WayPress.start();
			setState({
				slider5WayPressed: true
			});
		} else if (is('down', keyCode)) {
			Spotlight.setPointerMode(false);

			if (Spotlight.focus(mediaControlsSpotlightId)) {
				preventDefault(ev);
				stopImmediate(ev);
			}
		} else if (is('up', keyCode)) {
			Spotlight.setPointerMode(false);
		}
	};

	const handleToggleMore = (ev) => {
		const {showMoreComponents, liftDistance} = ev;

		forwardToggleMore(ev, componentProps);

		if (!showMoreComponents) {
			startAutoCloseTimeout();	// Restore the timer since we are leaving "more".
			// Restore the title-hide now that we're finished with "more".
			startDelayedTitleHide();
		} else {
			// Interrupt the title-hide since we don't want it hiding autonomously in "more".
			stopDelayedTitleHide();
		}

		playerRef.current.style.setProperty('--liftDistance', `${liftDistance}px`);
		setState(({announce: prevAnnounce}) => ({
			infoVisible: showMoreComponents,
			titleVisible: true,
			announce: prevAnnounce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
		}));
	};

	const handleMediaControlsClose = (ev) => {
		hideControls();
		ev.stopPropagation();
	};

	// Make the methods of this render available to `api` once it is committed
	useLayoutEffect(() => {
		instance.current.methods = {
			activityDetected,
			addStateToEvent,
			announceNow,
			areControlsVisible,
			doAutoClose,
			fastForward,
			getMediaState,
			getVideoNode,
			handleControlsHandleAboveDown,
			handleControlsHandleAboveHold,
			handleControlsHandleAboveKeyDown,
			handleControlsHandleAboveKeyUp,
			handleEvent,
			handleKnobMove,
			handleLoadStart,
			handleMediaControlsClose,
			handleSliderBlur,
			handleSliderFocus,
			handleSliderKeyDown,
			handleToggleMore,
			hideControls,
			hideFeedback,
			hideMiniFeedback,
			hideTitle,
			jump,
			next,
			onSliderChange,
			onVideoClick,
			pause,
			play,
			previous,
			releaseSlider5WayPress,
			renderBottomControls,
			rewind,
			rewindManually,
			seek,
			setPlaybackSpeed,
			shouldShowMiniFeedback,
			showControls,
			showControlsFromPointer,
			showFeedback,
			startDelayedFeedbackHide,
			toggleControls
		};
	});

	// Warn once about deprecated callbacks. The class did this during render.
	const {onJumpBackward, onJumpForward, onWillJumpBackward, onWillJumpForward} = componentProps;
	useEffect(() => {
		if (!warnedOnJumpBackward && onJumpBackward) {
			deprecate({name: '`onJumpBackward`', until: '2.0.0', message: 'Use `onPrevious` instead'});
			warnedOnJumpBackward = true;
		}
		if (!warnedOnJumpForward && onJumpForward) {
			deprecate({name: '`onJumpForward`', until: '2.0.0', message: 'Use `onNext` instead'});
			warnedOnJumpForward = true;
		}
		if (!warnedOnWillJumpBackward && onWillJumpBackward) {
			deprecate({name: '`onWillJumpBackward`', until: '2.0.0', message: 'Use `onWillPrevious` instead'});
			warnedOnWillJumpBackward = true;
		}
		if (!warnedOnWillJumpForward && onWillJumpForward) {
			deprecate({name: '`onWillJumpForward`', until: '2.0.0', message: 'Use `onWillPrevious` instead'});
			warnedOnWillJumpForward = true;
		}
	}, [onJumpBackward, onJumpForward, onWillJumpBackward, onWillJumpForward]);

	// Equivalent of the constructor's call to `setApiProvider`
	const {setApiProvider} = componentProps;
	useLayoutEffect(() => {
		if (setApiProvider) {
			setApiProvider(api);
		}
	}, [api, setApiProvider]);

	// Equivalent of componentDidMount and componentWillUnmount
	useLayoutEffect(() => {
		const {handleGlobalKeyDown} = eventHandlers;

		on('mousemove', api.activityDetected);
		if (platform.touchEvent) {
			on('touchmove', api.activityDetected);
		}
		document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
		document.addEventListener('wheel', api.activityDetected, {capture: true});
		api.startDelayedFeedbackHide();
		const floatingLayerController = floatingLayerContext && typeof floatingLayerContext === 'function' ?
			floatingLayerContext(() => {}) :
			null;
		instance.current.floatingLayerController = floatingLayerController;

		return () => {
			off('mousemove', api.activityDetected);
			if (platform.touchEvent) {
				off('touchmove', api.activityDetected);
			}
			document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
			document.removeEventListener('wheel', api.activityDetected, {capture: true});
			jobs.rewind.stop();
			jobs.autoClose.stop();
			jobs.hideTitle.stop();
			jobs.hideFeedback.stop();
			jobs.hideMiniFeedback.stop();
			jobs.announce.stop();
			jobs.renderBottomControl.stop();
			jobs.slider5WayPress.stop();
			if (floatingLayerController) {
				floatingLayerController.unregister();
			}
		};
	}, [api, eventHandlers, floatingLayerContext, jobs]);

	// Equivalent of componentDidUpdate
	useLayoutEffect(() => {
		const {lastCommit} = instance.current;
		instance.current.lastCommit = {componentProps, state};

		// componentDidUpdate does not run on mount or when `shouldComponentUpdate()` skipped the update
		if (!lastCommit || isRenderSkippable(lastCommit, {componentProps, state})) return;

		const prevState = lastCommit.state;

		if (
			!state.mediaControlsVisible && prevState.mediaControlsVisible !== state.mediaControlsVisible ||
			!state.mediaSliderVisible && prevState.mediaSliderVisible !== state.mediaSliderVisible
		) {
			instance.current.floatingLayerController.notify({action: 'closeAll'});
		}

		if (!state.mediaControlsVisible && prevState.mediaControlsVisible) {
			forwardControlsAvailable({available: false}, componentProps);
			stopAutoCloseTimeout();

			if (!componentProps.spotlightDisabled) {
				// If last focused item were in the media controls or slider, we need to explicitly
				// blur the element when MediaControls hide. See ENYO-5648
				const current = Spotlight.getCurrent();
				const bottomControls = document.querySelector(`.${css.bottom}`);
				if (current && bottomControls && bottomControls.contains(current)) {
					current.blur();
				}

				// when in pointer mode, the focus call below will only update the last focused for
				// the video player and not set the active container to the video player which will
				// cause focus to land back on the media controls button when spotlight restores
				// focus.
				if (Spotlight.getPointerMode()) {
					Spotlight.setActiveContainer(componentProps.spotlightId);
				}

				// Set focus to the hidden spottable control - maintaining focus on available spottable
				// controls, which prevents an additional 5-way attempt in order to re-show media controls
				Spotlight.focus(`.${css.controlsHandleAbove}`);
			}
		} else if (state.mediaControlsVisible && !prevState.mediaControlsVisible) {
			forwardControlsAvailable({available: true}, componentProps);
			startAutoCloseTimeout();

			if (!componentProps.spotlightDisabled) {
				const current = Spotlight.getCurrent();
				if (!current || playerRef.current.contains(current)) {
					// Set focus within media controls when they become visible.
					if (Spotlight.focus(mediaControlsSpotlightId) && instance.current.jumpKeyPressed === 0) {
						instance.current.jumpKeyPressed = null;
					}
				}
			}
		}

		// Once video starts loading it queues bottom control render until idle
		if (state.bottomControlsRendered && !prevState.bottomControlsRendered && !state.mediaControlsVisible) {
			showControls();
		}
	});

	return (
		<VideoPlayerView
			api={api}
			componentProps={componentProps}
			eventHandlers={eventHandlers}
			hasNextHandler={hasNextHandler}
			hasPreviousHandler={hasPreviousHandler}
			id={id}
			instanceRef={instance}
			playerRef={playerRef}
			refCallbacks={refCallbacks}
			state={state}
		/>
	);
};

VideoPlayerBase.displayName = 'VideoPlayerBase';

VideoPlayerBase.propTypes = /** @lends limestone/VideoPlayer.VideoPlayerBase.prototype */ {
	/**
	 * passed by AnnounceDecorator for accessibility
	 *
	 * @type {Function}
	 * @private
	 */
	announce: PropTypes.func,

	/**
	 * The time (in milliseconds) before the control buttons will hide.
	 *
	 * Setting this to 0 or `null` disables closing, requiring user input to open and close.
	 *
	 * @type {Number}
	 * @default 5000
	 * @public
	 */
	autoCloseTimeout: PropTypes.number,

	/**
	 * Sets the hint string read when focusing the back button.
	 *
	 * @type {String}
	 * @default 'go to previous'
	 * @public
	 */
	backButtonAriaLabel: PropTypes.string,

	/**
	 * Removes interactive capability from this component. This includes, but is not limited to,
	 * key-press events, most clickable buttons, and prevents the showing of the controls.
	 *
	 * @type {Boolean}
	 * @public
	 */
	disabled: PropTypes.bool,

	/**
	 * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
	 * tooltip will automatically hidden after the last action.
	 * Setting this to 0 or `null` disables feedbackHideDelay; feedback will always be present.
	 *
	 * @type {Number}
	 * @default 3000
	 * @public
	 */
	feedbackHideDelay: PropTypes.number,

	/**
	 * Checks if current time and total time should include the hour.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	includeTimeHour: PropTypes.bool,

	/**
	 * Components placed below the title.
	 *
	 * Typically, these will be media descriptor icons, like how many audio channels, what codec
	 * the video uses, but can also be a description for the video or anything else that seems
	 * appropriate to provide information about the video to the user.
	 *
	 * @type {Node}
	 * @public
	 */
	infoComponents: PropTypes.node,

	/**
	 * The number of milliseconds that the player will pause before firing the
	 * first jump event on a right or left pulse.
	 *
	 * @type {Number}
	 * @default 400
	 * @public
	 */
	initialJumpDelay: PropTypes.number,

	/**
	 * The number of seconds the player should skip forward or backward when a "jump" button is
	 * pressed.
	 *
	 * @type {Number}
	 * @default 30
	 * @public
	 */
	jumpBy: PropTypes.number,

	/**
	 * The number of milliseconds that the player will throttle before firing a
	 * jump event on a right or left pulse.
	 *
	 * @type {Number}
	 * @default 200
	 * @public
	 */
	jumpDelay: PropTypes.number,

	/**
	 * Manually set the loading state of the media, in case you have information that
	 * `VideoPlayer` does not have.
	 *
	 * @type {Boolean}
	 * @public
	 */
	loading: PropTypes.bool,

	/**
	 * The current locale as a
	 * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
	 *
	 * @type {String}
	 * @public
	 */
	locale: PropTypes.string,

	/**
	 * Overrides the default media control component to support customized behaviors.
	 *
	 * The provided component will receive the following props from `VideoPlayer`:
	 *
	 * * `initialJumpDelay` - Time (in ms) to wait before starting a jump
	 * * `jumpDelay` -  - Time (in ms) to wait between jumps
	 * * `mediaDisabled` - `true` when the media controls are not interactive
	 * * `no5WayJump` - `true` when 5-way jumping is disabled
	 * * `onClose` - Called when cancel key is pressed when the media controls are visible
	 * * `onFastForward` - Called when the media is fast forwarded via a key event
	 * * `onJump` - Called when the media jumps either forward or backward
	 * * `onJumpBackwardButtonClick` - Called when the jump backward button is pressed
	 * * `onJumpForwardButtonClick` - Called when the jump forward button is pressed
	 * * `onKeyDown` - Called when a key is pressed
	 * * `onNextButtonClick` - Called when the next button is pressed
	 * * `onPause` - Called when the media is paused via a key event
	 * * `onPlay` - Called when the media is played via a key event
	 * * `onPreviousButtonClick` - Called when the previous button is pressed
	 * * `onRewind` - Called when the media is rewound via a key event
	 * * `onToggleMore` - Called when the more components are hidden or shown
	 * * `paused` - `true` when the media is paused
	 * * `spotlightId` - The spotlight container Id for the media controls
	 * * `spotlightDisabled` - `true` when spotlight is disabled for the media controls
	 * * `visible` - `true` when the media controls should be displayed
	 *
	 * @type {Component|Element}
	 * @default limestone/MediaPlayer.MediaControls
	 * @public
	 */
	mediaControlsComponent: EnactPropTypes.componentOverride,

	/**
	 * Amount of time (in milliseconds), after the last user action, that the `miniFeedback`
	 * will automatically hide.
	 * Setting this to 0 or `null` disables `miniFeedbackHideDelay`; `miniFeedback` will always
	 * be present.
	 *
	 * @type {Number}
	 * @default 2000
	 * @public
	 */
	miniFeedbackHideDelay: PropTypes.number,

	/**
	 * Disable audio for this video.
	 *
	 * In a TV context, this is handled by the remote control, not programmatically in the
	 * VideoPlayer API.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	muted: PropTypes.bool,

	/**
	 * Prevents the default behavior of using left and right keys for seeking.
	 *
	 * @type {Boolean}
	 * @public
	 */
	no5WayJump: PropTypes.bool,

	/**
	 * Prevents the default behavior of playing a video immediately after it's loaded.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noAutoPlay: PropTypes.bool,

	/**
	 * Prevents the default behavior of showing media controls immediately after it's loaded.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noAutoShowMediaControls: PropTypes.bool,

	/**
	 * Hides media slider feedback when fast-forward or rewind while media controls are hidden.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noMediaSliderFeedback: PropTypes.bool,

	/**
	 * Removes the mini feedback.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noMiniFeedback: PropTypes.bool,

	/**
	 * Removes the media slider.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noSlider: PropTypes.bool,

	/**
	 * Removes spinner while loading.
	 *
	 * @type {Boolean}
	 * @public
	 */
	noSpinner: PropTypes.bool,

	/**
	 * Called when the back button is clicked.
	 *
	 * @type {Function}
	 * @public
	 */
	onBack: PropTypes.func,

	/**
	 * Called when the player's controls change availability, whether they are shown
	 * or hidden.
	 *
	 * The current status is sent as the first argument in an object with a key `available`
	 * which will be either `true` or `false`. (e.g.: `onControlsAvailable({available: true})`)
	 *
	 * @type {Function}
	 * @public
	 */
	onControlsAvailable: PropTypes.func,

	/**
	 * Called when the video has been fast forwarded.
	 *
	 * @type {Function}
	 * @public
	 */
	onFastForward: PropTypes.func,

	/**
	 * Called when the user clicks the JumpBackward button.
	 *
	 * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	 *
	 * @type {Function}
	 * @deprecated Will be removed in 2.0.0. Use `onPrevious` instead.
	 * @public
	 */
	onJumpBackward: PropTypes.func,

	/**
	 * Called when the user clicks the JumpForward button.
	 *
	 * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	 *
	 * @type {Function}
	 * @deprecated Will be removed in 2.0.0. Use `onNext` instead.
	 * @public
	 */
	onJumpForward: PropTypes.func,

	/**
	 * Called when the user clicks the next button.
	 *
	 * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	 *
	 * @type {Function}
	 * @public
	 */
	onNext: PropTypes.func,

	/**
	 * Called when the video has been paused.
	 *
	 * @type {Function}
	 * @public
	 */
	onPause: PropTypes.func,

	/**
	 * Called when the video has been played.
	 *
	 * @type {Function}
	 * @public
	 */
	onPlay: PropTypes.func,

	/**
	 * Called when the user clicks the previous button.
	 *
	 * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	 *
	 * @type {Function}
	 * @public
	 */
	onPrevious: PropTypes.func,

	/**
	 * Called when the video has been rewound.
	 *
	 * @type {Function}
	 * @public
	 */
	onRewind: PropTypes.func,

	/**
	 * Called when the user is moving the VideoPlayer's Slider knob independently of
	 * the current playback position.
	 *
	 * It is passed an object with a `seconds` key (float value) to indicate the current time
	 * index. It can be used to update the `thumbnailSrc` to reflect the current scrub
	 * position.
	 *
	 * @type {Function}
	 * @public
	 */
	onScrub: PropTypes.func,

	/**
	 * Called when seek is attempted while `seekDisabled` is true.
	 *
	 * @type {Function}
	 */
	onSeekFailed: PropTypes.func,

	/**
	 * Called when seeking outside of the current `selection` range.
	 *
	 * By default, the seek will still be performed. Calling `preventDefault()` on the event
	 * will prevent the seek operation.
	 *
	 * @type {Function}
	 * @public
	 */
	onSeekOutsideSelection: PropTypes.func,

	/**
	 * Called when the visibility of more components is changed
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onToggleMore'`
	 * * `showMoreComponents` - `true` when the components are visible`
	 * * `liftDistance` - The distance, in pixels, the component animates
	 *`
	 * @type {Function}
	 * @public
	 */
	onToggleMore: PropTypes.func,

	/**
	 * Called once before the video is forwarded.
	 *
	 * @type {Function}
	 * @public
	 */
	onWillFastForward: PropTypes.func,

	/**
	  * Called once before the video is jump backwarded.
	  *
	  * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	  *
	  * @type {Function}
	  * @deprecated Will be removed in 2.0.0. Use `onWillPrevious` instead.
	  * @public
	  */
	onWillJumpBackward: PropTypes.func,

	/**
	  * Called once before the video is jump forwarded.
	  *
	  * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	  *
	  * @type {Function}
	  * @deprecated Will be removed in 2.0.0. Use `onWillNext` instead.
	  * @public
	  */
	onWillJumpForward: PropTypes.func,

	/**
	  * Called once before playing the next video in the playlist.
	  *
	  * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	  *
	  * @type {Function}
	  * @public
	  */
	onWillNext: PropTypes.func,

	/**
	  * Called once before the video is paused.
	  *
	  * @type {Function}
	  * @public
	  */
	onWillPause: PropTypes.func,

	/**
	  * Called once before the video is played
	  *
	  * @type {Function}
	  * @public
	  */
	onWillPlay: PropTypes.func,

	/**
	  * Called once before playing the previous video in the playlist.
	  *
	  * Is passed a {@link limestone/VideoPlayer.videoStatus} as the first argument.
	  *
	  * @type {Function}
	  * @public
	  */
	onWillPrevious: PropTypes.func,

	/**
	  * Called once before the video is rewound.
	  *
	  * @type {Function}
	  * @public
	  */
	onWillRewind: PropTypes.func,

	/**
	 * Pauses the video when it reaches either the start or the end of the video during rewind,
	 * slow rewind, fast-forward, or slow forward.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	pauseAtEnd: PropTypes.bool,

	/**
	 * Mapping of playback rate names to playback rate values that may be set.
	 *
	 * @type {limestone/VideoPlayer.playbackRateHash}
	 * @default {
	 *	fastForward: ['2', '4', '8', '16'],
	 *	rewind: ['-2', '-4', '-8', '-16'],
	 *	slowForward: ['1/4', '1/2'],
	 *	slowRewind: ['-1/2', '-1']
	 * }
	 * @public
	 */
	playbackRateHash: PropTypes.shape({
		fastForward: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
		rewind: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
		slowForward: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
		slowRewind: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
	}),

	/**
	 * Disables seek function.
	 *
	 * Note that jump by arrow keys will also be disabled when `true`.
	 *
	 * @type {Boolean}
	 * @public
	 */
	seekDisabled: PropTypes.bool,

	/**
	 * A range of the video to display as selected.
	 *
	 * The value of `selection` may either be:
	 * * `null` or `undefined` for no selection,
	 * * a single-element array with the start time of the selection
	 * * a two-element array containing both the start and end time of the selection in seconds
	 *
	 * When the start time is specified, the media slider will show filled starting at that
	 * time to the current time.
	 *
	 * When the end time is specified, the slider's background will be filled between the two
	 * times.
	 *
	 * @type {Number[]}
	 * @public
	 */
	selection: PropTypes.arrayOf(PropTypes.number),

	/**
	 * Registers the VideoPlayer component with an
	 * {@link core/internal/ApiDecorator.ApiDecorator}.
	 *
	 * @type {Function}
	 * @private
	 */
	setApiProvider: PropTypes.func,

	/**
	 * The video source.
	 *
	 * Any children `<source>` tag elements of {@link limestone/VideoPlayer|VideoPlayer} will
	 * be sent directly to the `videoComponent` as video sources.
	 *
	 * @type {Node}
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
	 * @public
	 */
	source: PropTypes.node,

	/**
	 * Disables spotlight navigation into the component.
	 *
	 * @type {Boolean}
	 * @public
	 */
	spotlightDisabled: PropTypes.bool,

	/**
	 * The spotlight container ID for the player.
	 *
	 * @type {String}
	 * @public
	 * @default 'videoPlayer'
	 */
	spotlightId: PropTypes.string,

	/**
	 * The thumbnail component to be used instead of the built-in version.
	 *
	 * The internal thumbnail style will not be applied to this component. This component
	 * follows the same rules as the built-in version.
	 *
	 * @type {String|Component|Element}
	 * @public
	 */
	thumbnailComponent: EnactPropTypes.renderableOverride,

	/**
	 * Thumbnail image source to show on the slider knob.
	 *
	 * This is a standard {@link limestone/Image} component so it supports all the same
	 * options for the `src` property. If no `thumbnailComponent` and no `thumbnailSrc` is set,
	 * no tooltip will display.
	 *
	 * @type {String|Object}
	 * @public
	 */
	thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

	/**
	* Enables the thumbnail transition from opaque to translucent.
	*
	* @type {Boolean}
	* @public
	*/
	thumbnailUnavailable: PropTypes.bool,

	/**
	 * Title for the video being played.
	 *
	 * @type {String|Node}
	 * @public
	 */
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

	/**
	 * The time (in milliseconds) before the title disappears from the controls.
	 *
	 * Setting this to `0` disables hiding.
	 *
	 * @type {Number}
	 * @default 5000
	 * @public
	 */
	titleHideDelay: PropTypes.number,

	/**
	 * Video component to use.
	 *
	 * The default renders an `HTMLVideoElement`. Custom video components must have a similar
	 * API structure, exposing the following APIs:
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
	 * @type {Component|Element}
	 * @default {@link ui/Media.Media}
	 * @public
	 */
	videoComponent: EnactPropTypes.componentOverride
};

/**
 * A standard HTML5 video player for Limestone. It behaves, responds to, and operates like a
 * `<video>` tag in its support for `<source>`.  It also accepts custom tags such as
 * `<infoComponents>` for displaying additional information in the title area and `<MediaControls>`
 * for handling media playback controls and adding more controls.
 *
 * Example usage:
 * ```
 *	<VideoPlayer title="Hilarious Cat Video" poster="https://my.cat.videos/boots-poster.jpg">
 *		<source src="https://my.cat.videos/boots.mp4" type="video/mp4" />
 *		<infoComponents>A video about my cat Boots, wearing boots.</infoComponents>
 *		<MediaControls>
 *			<leftComponents><Button backgroundOpacity="translucent" icon="star" /></leftComponents>
 *			<rightComponents><Button backgroundOpacity="translucent" icon="notification" /></rightComponents>
 *
 *			<Button backgroundOpacity="translucent">Add To Favorites</Button>
 *			<Button backgroundOpacity="translucent" icon="search" />
 *		</MediaControls>
 *	</VideoPlayer>
 * ```
 *
 * To invoke methods (e.g.: `fastForward()`) or get the current state (`getMediaState()`), store a
 * ref to the `VideoPlayer` within your component:
 *
 * ```
 * 	...
 *
 * 	setVideoPlayer = (node) => {
 * 		this.videoPlayer = node;
 * 	}
 *
 * 	play () {
 * 		this.videoPlayer.play();
 * 	}
 *
 * 	render () {
 * 		return (
 * 			<VideoPlayer ref={this.setVideoPlayer} />
 * 		);
 * 	}
 * ```
 *
 * @class VideoPlayer
 * @memberof limestone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const VideoPlayer = ApiDecorator(
	{api: [
		'areControlsVisible',
		'fastForward',
		'getMediaState',
		'getVideoNode',
		'hideControls',
		'jump',
		'next',
		'pause',
		'play',
		'previous',
		'rewind',
		'seek',
		'setPlaybackSpeed',
		'showControls',
		'showFeedback',
		'toggleControls'
	]},
	I18nContextDecorator(
		{localeProp: 'locale'},
		Slottable(
			{slots: ['infoComponents', 'mediaControlsComponent', 'source', 'thumbnailComponent', 'videoComponent']},
			FloatingLayerDecorator(
				{floatLayerId: 'videoPlayerFloatingLayer'},
				Skinnable(
					VideoPlayerBase
				)
			)
		)
	)
);

export default VideoPlayer;
export {
	Video,
	VideoPlayer,
	VideoPlayerBase
};
