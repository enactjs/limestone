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

import {adaptEvent, call, forKey, forward, forwardCustom, forwardWithPrevent, handle, preventDefault, stopImmediate, returnsTrue} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import {checkPropTypes, perfNow, Job, shallowEqual} from '@enact/core/util';
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
import {cloneElement, Component, createRef, isValidElement} from 'react';
import type {ComponentType, ReactElement, ReactNode} from 'react';

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
const getControlsHandleAboveHoldConfig = ({frequency, time}: any) => ({
	events: [
		{name: 'hold', time}
	],
	frequency
});
const shouldJump = ({disabled, no5WayJump}: any, {mediaControlsVisible, sourceUnavailable}: any) => (
	!no5WayJump && !mediaControlsVisible && !(disabled || sourceUnavailable)
);
const calcNumberValueOfPlaybackRate = (rate: string | number) => {
	const pbArray = String(rate).split('/');
	return (pbArray.length > 1) ? parseInt(pbArray[0]) / parseInt(pbArray[1]) : parseFloat(rate as string);
};

interface RootComponentProps {
	playerRef?: EnactPropTypeShapes.ref;
	[key: string]: any;
}

const RootComponent = (props: RootComponentProps) => {
	checkPropTypes(RootComponent, props);
	const {playerRef, ...rest} = props;
	return (<div ref={playerRef as any} {...rest} />);
};

RootComponent.propTypes = {
	playerRef: EnactPropTypes.ref
};

const SpottableDiv: any = Touchable(Spottable('div'));
const RootContainer: any = SpotlightContainerDecorator(
	{
		enterTo: 'default-element',
		defaultElement: [`.${css.controlsHandleAbove}`, `.${css.controlsFrame}`]
	},
	RootComponent
);

const ControlsContainer: any = SpotlightContainerDecorator(
	{
		enterTo: 'default-element',
		straightOnly: true
	},
	'div'
);

const memoGetDurFmt = memoize((/* locale */) => new DurationFmt({
	length: 'medium', style: 'clock', useNative: false
}));

const getDurFmt = (locale: string) => {
	if (typeof window === 'undefined') return null;

	return memoGetDurFmt(locale);
};

const forwardWithState = (type: string) => adaptEvent(() => ({type}), handle(adaptEvent(call('addStateToEvent'), forwardWithPrevent(type))));

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

export interface PlaybackRateHash {
	fastForward?: (string | number)[];
	rewind?: (string | number)[];
	slowForward?: (string | number)[];
	slowRewind?: (string | number)[];
}

export interface VideoPlayerBaseProps {
	announce?: (...args: any[]) => any;
	autoCloseTimeout?: number;
	backButtonAriaLabel?: string;
	children?: ReactNode;
	disabled?: boolean;
	feedbackHideDelay?: number;
	includeTimeHour?: boolean;
	infoComponents?: ReactNode;
	initialJumpDelay?: number;
	jumpBy?: number;
	jumpDelay?: number;
	loading?: boolean;
	locale?: string;
	mediaControlsComponent?: EnactPropTypeShapes.componentOverride;
	miniFeedbackHideDelay?: number;
	muted?: boolean;
	no5WayJump?: boolean;
	noAutoPlay?: boolean;
	noAutoShowMediaControls?: boolean;
	noMediaSliderFeedback?: boolean;
	noMiniFeedback?: boolean;
	noSlider?: boolean;
	noSpinner?: boolean;
	onBack?: (...args: any[]) => any;
	onControlsAvailable?: (...args: any[]) => any;
	onFastForward?: (...args: any[]) => any;
	onJumpBackward?: (...args: any[]) => any;
	onJumpForward?: (...args: any[]) => any;
	onNext?: (...args: any[]) => any;
	onPause?: (...args: any[]) => any;
	onPlay?: (...args: any[]) => any;
	onPrevious?: (...args: any[]) => any;
	onRewind?: (...args: any[]) => any;
	onScrub?: (...args: any[]) => any;
	onSeekFailed?: (...args: any[]) => any;
	onSeekOutsideSelection?: (...args: any[]) => any;
	onToggleMore?: (...args: any[]) => any;
	onWillFastForward?: (...args: any[]) => any;
	onWillJumpBackward?: (...args: any[]) => any;
	onWillJumpForward?: (...args: any[]) => any;
	onWillNext?: (...args: any[]) => any;
	onWillPause?: (...args: any[]) => any;
	onWillPlay?: (...args: any[]) => any;
	onWillPrevious?: (...args: any[]) => any;
	onWillRewind?: (...args: any[]) => any;
	pauseAtEnd?: boolean;
	playbackRateHash?: PlaybackRateHash;
	seekDisabled?: boolean;
	selection?: number[];
	setApiProvider?: (...args: any[]) => any;
	source?: ReactNode;
	spotlightDisabled?: boolean;
	spotlightId?: string;
	thumbnailComponent?: EnactPropTypeShapes.renderableOverride;
	thumbnailSrc?: string | Record<string, string>;
	thumbnailUnavailable?: boolean;
	title?: string | ReactNode;
	titleHideDelay?: number;
	videoComponent?: EnactPropTypeShapes.componentOverride;
	[key: string]: any;
}

/**
 * A player for video {@link limestone/VideoPlayer.VideoPlayerBase}.
 *
 * @class VideoPlayerBase
 * @memberof limestone/VideoPlayer
 * @ui
 * @public
 */
const VideoPlayerBase = class extends Component<VideoPlayerBaseProps, Record<string, any>> {
	static displayName = 'VideoPlayerBase';

	static propTypes = /** @lends limestone/VideoPlayer.VideoPlayerBase.prototype */ {
		announce: PropTypes.func,
		autoCloseTimeout: PropTypes.number,
		backButtonAriaLabel: PropTypes.string,
		disabled: PropTypes.bool,
		feedbackHideDelay: PropTypes.number,
		includeTimeHour: PropTypes.bool,
		infoComponents: PropTypes.node,
		initialJumpDelay: PropTypes.number,
		jumpBy: PropTypes.number,
		jumpDelay: PropTypes.number,
		loading: PropTypes.bool,
		locale: PropTypes.string,
		mediaControlsComponent: EnactPropTypes.componentOverride,
		miniFeedbackHideDelay: PropTypes.number,
		muted: PropTypes.bool,
		no5WayJump: PropTypes.bool,
		noAutoPlay: PropTypes.bool,
		noAutoShowMediaControls: PropTypes.bool,
		noMediaSliderFeedback: PropTypes.bool,
		noMiniFeedback: PropTypes.bool,
		noSlider: PropTypes.bool,
		noSpinner: PropTypes.bool,
		onBack: PropTypes.func,
		onControlsAvailable: PropTypes.func,
		onFastForward: PropTypes.func,
		onJumpBackward: PropTypes.func,
		onJumpForward: PropTypes.func,
		onNext: PropTypes.func,
		onPause: PropTypes.func,
		onPlay: PropTypes.func,
		onPrevious: PropTypes.func,
		onRewind: PropTypes.func,
		onScrub: PropTypes.func,
		onSeekFailed: PropTypes.func,
		onSeekOutsideSelection: PropTypes.func,
		onToggleMore: PropTypes.func,
		onWillFastForward: PropTypes.func,
		onWillJumpBackward: PropTypes.func,
		onWillJumpForward: PropTypes.func,
		onWillNext: PropTypes.func,
		onWillPause: PropTypes.func,
		onWillPlay: PropTypes.func,
		onWillPrevious: PropTypes.func,
		onWillRewind: PropTypes.func,
		pauseAtEnd: PropTypes.bool,
		playbackRateHash: PropTypes.shape({
			fastForward: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
			rewind: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
			slowForward: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
			slowRewind: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
		}),
		seekDisabled: PropTypes.bool,
		selection: PropTypes.arrayOf(PropTypes.number),
		setApiProvider: PropTypes.func,
		source: PropTypes.node,
		spotlightDisabled: PropTypes.bool,
		spotlightId: PropTypes.string,
		thumbnailComponent: EnactPropTypes.renderableOverride,
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		thumbnailUnavailable: PropTypes.bool,
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
		titleHideDelay: PropTypes.number,
		videoComponent: EnactPropTypes.componentOverride
	};

	static defaultProps = {
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

	static contextType = FloatingLayerContext;

	constructor (props: VideoPlayerBaseProps) {
		super(props);

		// Internal State
		this.video = null;
		this.pulsedPlaybackRate = null;
		this.pulsedPlaybackState = null;
		this.prevCommand = (props.noAutoPlay ? 'pause' : 'play');
		this.showMiniFeedback = false;
		this.speedIndex = 0;
		this.seekingMode = true;
		this.id = this.generateId();
		this.selectPlaybackRates('fastForward');
		this.sliderKnobProportion = 0;
		this.mediaControlsSpotlightId = props.spotlightId + '_mediaControls';
		this.jumpKeyPressed = null;
		this.playerRef = createRef();
		this.playbackRate = 1;

		// Re-render-necessary State
		this.state = {
			announce: AnnounceState.READY,
			currentTime: 0,
			duration: 0,
			error: false,
			loading: false,
			paused: props.noAutoPlay,
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
			titleVisible: true
		};

		if (props.setApiProvider) {
			props.setApiProvider(this);
		}
	}

	componentDidMount () {
		on('mousemove', this.activityDetected);
		if (platform.touchEvent) {
			on('touchmove', this.activityDetected);
		}
		document.addEventListener('keydown', this.handleGlobalKeyDown as any, {capture: true});
		document.addEventListener('wheel', this.activityDetected, {capture: true});
		this.startDelayedFeedbackHide();
		if (this.context && typeof this.context === 'function') {
			this.floatingLayerController = (this.context as any)(() => {});
		}
	}

	shouldComponentUpdate (nextProps: VideoPlayerBaseProps, nextState: any) {
		if (
			// Use shallow props compare instead of source comparison to support possible changes
			// from mediaComponent.
			shallowEqual(this.props, nextProps) &&
			!this.state.miniFeedbackVisible && this.state.miniFeedbackVisible === nextState.miniFeedbackVisible &&
			!this.state.mediaSliderVisible && this.state.mediaSliderVisible === nextState.mediaSliderVisible &&
			this.state.loading === nextState.loading && this.props.loading === nextProps.loading &&
			(
				this.state.currentTime !== nextState.currentTime ||
				this.state.proportionPlayed !== nextState.proportionPlayed ||
				this.state.sliderTooltipTime !== nextState.sliderTooltipTime
			)
		) {
			return false;
		}

		return true;
	}

	componentDidUpdate (prevProps: VideoPlayerBaseProps, prevState: any) {
		if (
			!this.state.mediaControlsVisible && prevState.mediaControlsVisible !== this.state.mediaControlsVisible ||
			!this.state.mediaSliderVisible && prevState.mediaSliderVisible !== this.state.mediaSliderVisible
		) {
			this.floatingLayerController.notify({action: 'closeAll'});
		}

		if (this.props.spotlightId !== prevProps.spotlightId) {
			this.mediaControlsSpotlightId = this.props.spotlightId + '_mediaControls';
		}

		if (!this.state.mediaControlsVisible && prevState.mediaControlsVisible) {
			(forwardControlsAvailable as any)({available: false}, this.props);
			this.stopAutoCloseTimeout();

			if (!this.props.spotlightDisabled) {
				// If last focused item were in the media controls or slider, we need to explicitly
				// blur the element when MediaControls hide. See ENYO-5648
				const current: any = Spotlight.getCurrent();
				const bottomControls = document.querySelector(`.${css.bottom}`);
				if (current && bottomControls && bottomControls.contains(current)) {
					current.blur();
				}

				// when in pointer mode, the focus call below will only update the last focused for
				// the video player and not set the active container to the video player which will
				// cause focus to land back on the media controls button when spotlight restores
				// focus.
				if (Spotlight.getPointerMode()) {
					Spotlight.setActiveContainer(this.props.spotlightId);
				}

				// Set focus to the hidden spottable control - maintaining focus on available spottable
				// controls, which prevents an additional 5-way attempt in order to re-show media controls
				Spotlight.focus(`.${css.controlsHandleAbove}`);
			}
		} else if (this.state.mediaControlsVisible && !prevState.mediaControlsVisible) {
			(forwardControlsAvailable as any)({available: true}, this.props);
			this.startAutoCloseTimeout();

			if (!this.props.spotlightDisabled) {
				const current = Spotlight.getCurrent();
				if (!current || this.playerRef.current.contains(current)) {
					// Set focus within media controls when they become visible.
					if (Spotlight.focus(this.mediaControlsSpotlightId) && this.jumpKeyPressed === 0) {
						this.jumpKeyPressed = null;
					}
				}
			}
		}

		// Once video starts loading it queues bottom control render until idle
		if (this.state.bottomControlsRendered && !prevState.bottomControlsRendered && !this.state.mediaControlsVisible) {
			this.showControls();
		}
	}

	componentWillUnmount () {
		off('mousemove', this.activityDetected);
		if (platform.touchEvent) {
			off('touchmove', this.activityDetected);
		}
		document.removeEventListener('keydown', this.handleGlobalKeyDown as any, {capture: true});
		document.removeEventListener('wheel', this.activityDetected, {capture: true});
		this.stopRewindJob();
		this.stopAutoCloseTimeout();
		this.stopDelayedTitleHide();
		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.announceJob.stop();
		this.renderBottomControl.stop();
		this.slider5WayPressJob.stop();
		if (this.floatingLayerController) {
			this.floatingLayerController.unregister();
		}
	}

	video: any;
	pulsedPlaybackRate: any;
	pulsedPlaybackState: any;
	prevCommand: string;
	showMiniFeedback: boolean;
	speedIndex: number;
	seekingMode: boolean;
	id: string;
	sliderKnobProportion: number;
	mediaControlsSpotlightId: string;
	jumpKeyPressed: any;
	playerRef: any;
	playbackRate: number;
	floatingLayerController: any;

	//
	// Internal Methods
	//

	announceRef: any;

	announceJob = new Job((msg: any, clear: any) => (this.announceRef && this.announceRef.announce(msg, clear)), 200);

	announce = (msg: any, clear?: any) => {
		this.announceJob.start(msg, clear);
	};

	activityDetected = () => {
		this.startAutoCloseTimeout();
	};

	startAutoCloseTimeout = () => {
		// If this.state.more is used as a reference for when this function should fire, timing for
		// detection of when "more" is pressed vs when the state is updated is mismatched. Using an
		// instance variable that's only set and used for this express purpose seems cleanest.
		if (this.props.autoCloseTimeout && this.state.mediaControlsVisible) {
			this.autoCloseJob.startAfter(this.props.autoCloseTimeout);
		}
	};

	stopAutoCloseTimeout = () => {
		this.autoCloseJob.stop();
	};

	generateId = () => {
		return Math.random().toString(36).substring(2, 10);
	};

	isTimeBeyondSelection (time: number) {
		const {selection} = this.props;

		// if selection isn't set or only contains the starting value, there isn't a valid selection
		// with which to test the time
		if (selection != null && selection.length >= 2) {
			const [start, end] = selection;

			return time > end || time < start;
		}

		return false;
	}

	preventTimeChange (time: number) {
		return (
			this.isTimeBeyondSelection(time) &&
			!forwardWithPrevent('onSeekOutsideSelection', {type: 'onSeekOutsideSelection', time}, this.props)
		);
	}

	/**
	 * If the announce state is either ready to read the title or ready to read info, advance the
	 * state to "read".
	 *
	 * @returns {Boolean} Returns true to be used in event handlers
	 * @private
	 */
	markAnnounceRead = () => {
		if (this.state.announce === AnnounceState.TITLE) {
			this.setState({announce: AnnounceState.TITLE_READ});
		} else if (this.state.announce === AnnounceState.INFO) {
			this.setState({announce: AnnounceState.DONE});
		}

		return true;
	};

	/**
	 * Shows media controls.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	showControls = () => {
		if (this.props.disabled) {
			return;
		}

		this.startDelayedFeedbackHide();
		this.startDelayedTitleHide();

		this.setState(({announce}: any) => {
			if (announce === AnnounceState.READY) {
				// if we haven't read the title yet, do so this time
				announce = AnnounceState.TITLE;
			} else if (announce === AnnounceState.TITLE) {
				// if we have read the title, advance to INFO so title isn't read again
				announce = AnnounceState.TITLE_READ;
			}

			return {
				announce,
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
	hideControls = () => {
		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.stopDelayedTitleHide();
		this.stopAutoCloseTimeout();
		this.setState({
			feedbackAction: 'idle',
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: false,
			miniFeedbackVisible: false,
			infoVisible: false
		});
		this.markAnnounceRead();
	};

	/**
	 * Toggles the media controls.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	toggleControls = () => {
		if (this.state.mediaControlsVisible) {
			this.hideControls();
		} else {
			this.showControls();
		}
	};

	doAutoClose = () => {
		this.stopDelayedFeedbackHide();
		this.stopDelayedTitleHide();
		this.setState(({mediaSliderVisible, miniFeedbackVisible}: any) => ({
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: mediaSliderVisible && miniFeedbackVisible,
			infoVisible: false
		}));
		this.markAnnounceRead();
	};

	autoCloseJob = new Job(this.doAutoClose);

	startDelayedTitleHide = () => {
		if (this.props.titleHideDelay) {
			this.hideTitleJob.startAfter(this.props.titleHideDelay);
		}
	};

	stopDelayedTitleHide = () => {
		this.hideTitleJob.stop();
	};

	hideTitle = () => {
		this.setState({titleVisible: false});
	};

	hideTitleJob = new Job(this.hideTitle);

	startDelayedFeedbackHide = () => {
		if (this.props.feedbackHideDelay) {
			this.hideFeedbackJob.startAfter(this.props.feedbackHideDelay);
		}
	};

	stopDelayedFeedbackHide = () => {
		this.hideFeedbackJob.stop();
	};

	showFeedback = () => {
		if (this.state.mediaControlsVisible) {
			this.setState({
				feedbackVisible: true
			});
		} else {
			const shouldShowSlider = this.pulsedPlaybackState !== null || calcNumberValueOfPlaybackRate(this.playbackRate) !== 1;

			if (this.showMiniFeedback && (!this.state.miniFeedbackVisible || this.state.mediaSliderVisible !== shouldShowSlider)) {
				this.setState(({loading, duration, error}: any) => ({
					mediaSliderVisible: shouldShowSlider && !this.props.noMediaSliderFeedback,
					miniFeedbackVisible: !(loading || !duration || error)
				}));
			}
		}
	};

	hideFeedback = () => {
		if (this.state.feedbackVisible && this.state.feedbackAction !== 'focus') {
			this.setState({
				feedbackVisible: false,
				feedbackAction: 'idle'
			});
		}
	};

	hideFeedbackJob = new Job(this.hideFeedback);

	startDelayedMiniFeedbackHide = (delay = this.props.miniFeedbackHideDelay) => {
		if (delay) {
			this.hideMiniFeedbackJob.startAfter(delay);
		}
	};

	stopDelayedMiniFeedbackHide = () => {
		this.hideMiniFeedbackJob.stop();
	};

	hideMiniFeedback = () => {
		if (this.state.miniFeedbackVisible) {
			this.showMiniFeedback = false;
			this.setState({
				mediaSliderVisible: false,
				miniFeedbackVisible: false
			});
		}
	};

	hideMiniFeedbackJob = new Job(this.hideMiniFeedback);

	handle = handle.bind(this);

	showControlsFromPointer = () => {
		Spotlight.setPointerMode(false);
		this.showControls();
	};

	clearPulsedPlayback = () => {
		this.pulsedPlaybackRate = null;
		this.pulsedPlaybackState = null;
	};

	// only show mini feedback if playback controls are invoked by a key event
	shouldShowMiniFeedback = (ev: any) => {
		if (ev.type === 'keyup') {
			this.showMiniFeedback = true;
		}
		return true;
	};


	firstPlayReadFlag: any;

	handleLoadStart = () => {
		this.firstPlayReadFlag = true;
		this.prevCommand = this.props.noAutoPlay ? 'pause' : 'play';
		this.speedIndex = 0;
		this.setState({
			announce: AnnounceState.READY,
			currentTime: 0,
			sourceUnavailable: true,
			proportionPlayed: 0,
			proportionLoaded: 0
		});

		if (!this.props.noAutoShowMediaControls) {
			if (!this.state.bottomControlsRendered) {
				this.renderBottomControl.idle();
			} else {
				this.showControls();
			}
		}
	};

	handlePlay = this.handle(
		forwardWillPlay,
		this.shouldShowMiniFeedback,
		() => this.play(),
		forwardPlay
	);

	handlePause = this.handle(
		forwardWillPause,
		this.shouldShowMiniFeedback,
		() => this.pause(),
		forwardPause
	);

	handleRewind = this.handle(
		forwardWillRewind,
		this.shouldShowMiniFeedback,
		() => this.rewind(),
		forwardRewind
	);

	handleFastForward = this.handle(
		forwardWillFastForward,
		this.shouldShowMiniFeedback,
		() => this.fastForward(),
		forwardFastForward
	);

	handleJump = ({keyCode}: any) => {
		if (this.props.seekDisabled) {
			forwardCustom('onSeekFailed')(null, this.props);
		} else {
			const jumpBy = (is('left', keyCode) ? -1 : 1) * this.props.jumpBy!;
			const time = Math.min(this.state.duration, Math.max(0, this.state.currentTime + jumpBy));

			if (this.preventTimeChange(time)) return;

			this.showMiniFeedback = true;
			this.jump(jumpBy);
			this.announceJob.startAfter(500, secondsToTime(this.video.currentTime, getDurFmt(this.props.locale!) as any, {includeHour: true}));
		}
	};

	handleGlobalKeyDown = this.handle(
		returnsTrue(this.activityDetected),
		forKey('down') as any,
		() => (
			!this.state.mediaControlsVisible &&
			((!Spotlight.getCurrent() && Spotlight.getPointerMode()) || !Spotlight.getPointerMode()) &&
			!this.props.spotlightDisabled
		),
		preventDefault,
		stopImmediate,
		this.showControlsFromPointer
	);

	handleControlsHandleAboveHold = () => {
		if (shouldJump(this.props, this.state)) {
			this.handleJump({keyCode: this.jumpKeyPressed === -1 ? jumpBackKeyCode : jumpForwardKeyCode});
		}
	};

	handleControlsHandleAboveKeyDown = ({keyCode}: any) => {
		if (isEnter(keyCode)) {
			this.jumpKeyPressed = 0;
		} else if (isLeft(keyCode)) {
			this.jumpKeyPressed = -1;
		} else if (isRight(keyCode)) {
			this.jumpKeyPressed = 1;
		}
	};

	handleControlsHandleAboveKeyUp = ({keyCode}: any) => {
		if (isEnter(keyCode) || isLeft(keyCode) || isRight(keyCode)) {
			this.jumpKeyPressed = null;
		}
	};

	handleControlsHandleAboveDown = () => {
		if (this.jumpKeyPressed === 0) {
			this.showControls();
		} else if (this.jumpKeyPressed === -1 || this.jumpKeyPressed === 1) {
			const keyCode = this.jumpKeyPressed === -1 ? jumpBackKeyCode : jumpForwardKeyCode;

			if (shouldJump(this.props, this.state)) {
				this.handleJump({keyCode});
			} else {
				Spotlight.move(getDirection(keyCode) as any);
			}
		}
	};

	//
	// Media Interaction Methods
	//
	handleEvent = () => {
		const el = this.video;
		const updatedState: any = {
			// Standard media properties
			currentTime: el.currentTime,
			duration: el.duration,
			paused: this.state.seekingMode ? (el.playbackRate !== 1 || el.paused) : el.paused,
			playbackRate: el.playbackRate,

			// Non-standard state computed from properties
			error: el.error,
			loading: el.loading,
			proportionLoaded: el.proportionLoaded,
			proportionPlayed: el.proportionPlayed || 0,
			sliderTooltipTime: el.currentTime,
			// note: `el.loading && this.state.sourceUnavailable == false` is equivalent to `oncanplaythrough`
			sourceUnavailable: el.loading && this.state.sourceUnavailable || el.error
		};

		// If there's an error, we're obviously not loading, no matter what the readyState is.
		if (updatedState.error) updatedState.loading = false;

		const isRewind = this.prevCommand === 'rewind' || this.prevCommand === 'slowRewind';
		const isForward = this.prevCommand === 'fastForward' || this.prevCommand === 'slowForward';
		if (this.props.pauseAtEnd && (el.currentTime === 0 && isRewind || el.currentTime === el.duration && isForward)) {
			this.pause();
		}

		this.setState(updatedState);
	};

	renderBottomControl = new Job(() => {
		if (!this.state.bottomControlsRendered) {
			this.setState({bottomControlsRendered: true});
		}
	});

	/**
	 * Returns an object with the current state of the media including `currentTime`, `duration`,
	 * `paused`, `playbackRate`, `proportionLoaded`, and `proportionPlayed`.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @returns {Object}
	 * @public
	 */
	getMediaState = () => {
		return {
			currentTime       : this.video.currentTime,
			duration          : this.state.duration,
			paused            : this.state.seekingMode ? (this.video.playbackRate !== 1 || this.video.paused) : this.video.paused,
			playbackRate      : this.video.playbackRate,
			proportionLoaded  : this.video.proportionLoaded,
			proportionPlayed  : this.video.proportionPlayed || 0
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
	send = (action: string, props?: any) => {
		this.clearPulsedPlayback();
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.video[action](props);
	};

	/**
	 * Programmatically plays the current media.
	 * If you call this function during fast forwarding or rewinding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	play = () => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		if (this.state.seekingMode) {
			this.setPlaybackRate(1);
		}
		this.speedIndex = 0;
		// must happen before send() to ensure feedback uses the right value
		// TODO: refactor into this.state member
		this.prevCommand = 'play';
		this.send('play');
		this.announce($L('Play'));
		this.startDelayedMiniFeedbackHide(5000);

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
	pause = () => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		if (this.state.seekingMode) {
			this.setPlaybackRate(1);
		}
		this.speedIndex = 0;
		// must happen before send() to ensure feedback uses the right value
		// TODO: refactor into this.state member
		this.prevCommand = 'pause';
		this.send('pause');
		this.announce($L('Pause'));
		this.stopDelayedMiniFeedbackHide();

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
	seek = (timeIndex: number) => {
		if (!this.props.seekDisabled && !isNaN(this.video.duration) && !this.state.sourceUnavailable) {
			this.video.currentTime = timeIndex;
		} else {
			forwardCustom('onSeekFailed')(null, this.props);
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
	jump = (distance: number) => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		this.pulsedPlaybackRate = toUpperCase(new DurationFmt({length: 'long'}).format({second: this.props.jumpBy}) as any);
		this.pulsedPlaybackState = distance > 0 ? 'jumpForward' : 'jumpBackward';
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.seek(this.state.currentTime + distance);
		this.startDelayedMiniFeedbackHide();

		return true;
	};

	next = () => {
		// next api will be implemented in 2.0.0.
		return true;
	};

	previous = () => {
		// previous api will be implemented in 2.0.0.
		return true;
	};

	playbackRates: any[] = [];

	/**
	 * Fast forwards the current media for seeking.
	 * This function changes the playback rate.
	 * If you call `play` or `pause` during fast forwarding, the playback speed will be set to normal.
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	fastForward = () => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		this.setState({seekingMode : true});
		let shouldResumePlayback = false;

		switch (this.prevCommand) {
			case 'slowForward':
				if (this.speedIndex === this.playbackRates.length - 1) {
					// reached to the end of array => fastforward
					this.selectPlaybackRates('fastForward');
					this.speedIndex = 0;
					this.prevCommand = 'fastForward';
				} else {
					this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1) as number;
				}
				break;
			case 'pause':
				this.selectPlaybackRates('slowForward');
				if (this.state.paused) {
					shouldResumePlayback = true;
				}
				this.speedIndex = 0;
				this.prevCommand = 'slowForward';
				break;
			case 'fastForward':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1) as number;
				this.prevCommand = 'fastForward';
				break;
			default:
				this.selectPlaybackRates('fastForward');
				this.speedIndex = 0;
				this.prevCommand = 'fastForward';
				if (this.state.paused) {
					shouldResumePlayback = true;
				}
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');

		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
		this.showFeedback();

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
	rewind = () => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		this.setState({seekingMode: true});
		const rateForSlowRewind = (this.props.playbackRateHash as any)['slowRewind'];
		let shouldResumePlayback = false,
			command = 'rewind';

		if (this.video.currentTime === 0) {
			// Do not rewind if currentTime is 0. We're already at the beginning.
			return true;
		}

		switch (this.prevCommand) {
			case 'slowRewind':
				if (this.speedIndex === this.playbackRates.length - 1) {
					// reached to the end of array => go to rewind
					this.selectPlaybackRates(command);
					this.speedIndex = 0;
					this.prevCommand = command;
				} else {
					this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1) as number;
				}
				break;
			case 'pause':
				// If it's possible to slowRewind, do it, otherwise just leave it as normal rewind : QEVENTSEVT-17386
				if (rateForSlowRewind && rateForSlowRewind.length >= 0) {
					command = 'slowRewind';
				}
				this.selectPlaybackRates(command);
				if (this.state.paused && this.state.duration > this.state.currentTime) {
					shouldResumePlayback = true;
				}
				this.speedIndex = 0;
				this.prevCommand = command;
				break;
			case 'rewind':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1) as number;
				this.prevCommand = command;
				break;
			default:
				this.selectPlaybackRates(command);
				this.speedIndex = 0;
				this.prevCommand = command;
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');

		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
		this.showFeedback();

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
	setPlaybackSpeed = (rate: number) => {
		if (this.state.sourceUnavailable) {
			return false;
		}

		this.setState({seekingMode: false});
		this.setPlaybackRate(rate);

		return true;
	};

	// Creates a proxy to the video node if Proxy is supported
	videoProxy: any = typeof Proxy !== 'function' ? null : new Proxy({}, {
		get: (target: any, name: any) => {
			let value = this.video[name];

			if (typeof value === 'function') {
				value = value.bind(this.video);
			}

			return value;
		},
		set: (target: any, name: any, value: any) => {
			return (this.video[name] = value);
		}
	});

	/**
	 * Returns a proxy to the underlying `<video>` node currently used by the VideoPlayer
	 *
	 * @function
	 * @memberof limestone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	getVideoNode = () => {
		return this.videoProxy || this.video;
	};

	areControlsVisible = () => {
		return this.state.mediaControlsVisible;
	};

	/**
	 * Sets the playback rate type for video seeking (from the keys of {@link limestone/VideoPlayer.VideoPlayer.playbackRateHash|playbackRateHash}).
	 *
	 * @param {String} cmd - Key of the playback rate type.
	 * @private
	 */
	selectPlaybackRates = (cmd: string) => {
		this.playbackRates = (this.props.playbackRateHash as any)[cmd];
	};

	/**
	 * Changes playbackRate to a valid value when initiating fast-forward or rewind.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @private
	 */
	clampPlaybackRate = (idx: number): number | undefined => {
		if (!this.playbackRates) {
			return;
		}

		return idx % this.playbackRates.length;
	};

	/**
	 * Retrieves the playback rate value.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @returns {Number|String} The playback rate value.
	 * @private
	 */
	selectPlaybackRate = (idx: number) => {
		return this.playbackRates[idx];
	};

	/**
	 * Sets playbackRate.
	 *
	 * @param {Number|String} rate - The desired playback rate.
	 * @private
	 */
	setPlaybackRate = (rate: string | number) => {
		if (this.state.seekingMode) {
			// Stop rewind (if happening)
			this.stopRewindJob();
		}

		// Make sure rate is a string
		this.playbackRate = String(rate) as any;
		const pbNumber = calcNumberValueOfPlaybackRate(this.playbackRate);

		if (platform.type !== 'webos') {
			// ReactDOM throws error for setting negative value for playbackRate
			this.video.playbackRate = pbNumber < 0 ? 0 : pbNumber;

			if (this.state.seekingMode) {
				// For supporting cross browser behavior
				if (pbNumber < 0) {
					this.beginRewind();
				}
			}
		} else {
			// Set native playback rate
			this.video.playbackRate = pbNumber;
		}
	};

	rewindBeginTime: number = 0;

	/**
	 * Calculates the time that has elapsed since. This is necessary for browsers until negative
	 * playback rate is directly supported.
	 *
	 * @private
	 */
	rewindManually = () => {
		const now = perfNow(),
			distance = now - this.rewindBeginTime,
			pbRate = calcNumberValueOfPlaybackRate(this.playbackRate),
			adjustedDistance = (distance * pbRate) / 1000;

		this.jump(adjustedDistance);
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
		this.startRewindJob();	// Issue another rewind tick
	};

	rewindJob = new Job(this.rewindManually, 100);

	/**
	 * Starts rewind job.
	 *
	 * @private
	 */
	startRewindJob = () => {
		this.rewindBeginTime = perfNow();
		this.rewindJob.start();
	};

	/**
	 * Stops rewind job.
	 *
	 * @private
	 */
	stopRewindJob = () => {
		this.rewindJob.stop();
	};

	/**
	 * Implements custom rewind functionality (until browsers support negative playback rate).
	 *
	 * @private
	 */
	beginRewind = () => {
		this.send('pause');
		this.startRewindJob();
	};

	//
	// Handled Media events
	//
	addStateToEvent = (ev: any) => {
		return {
			// More props from `ev` may be added here as needed, but a full copy via `...ev`
			// overloads Storybook's Action Logger and likely has other perf fallout.
			type: ev.type,
			// Specific state variables are included in the outgoing callback payload, not all of them
			...this.getMediaState()
		};
	};

	//
	// Player Interaction events
	//
	onVideoClick = () => {
		this.toggleControls();
	};

	sliderScrubbing: boolean = false;

	onSliderChange = ({value}: any) => {
		const time = value * this.state.duration;

		if (this.preventTimeChange(time)) return;

		this.seek(time);
		this.sliderScrubbing = false;
	};

	handleBack = this.handle(forwardCustom('onBack'));

	handleKnobMove = (ev: any) => {
		this.sliderScrubbing = true;

		// prevent announcing repeatedly when the knob is detached from the progress.
		// TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
		if (this.sliderKnobProportion !== ev.proportion) {
			this.sliderKnobProportion = ev.proportion;
			const seconds = Math.floor(this.sliderKnobProportion * this.video.duration);

			if (!isNaN(seconds)) {
				const knobTime = secondsToTime(seconds, getDurFmt(this.props.locale!) as any, {includeHour: true});

				forward('onScrub', {...ev, seconds, type: 'onScrub'}, this.props);

				this.announce(`${$L('jump to')} ${knobTime}`, true);
			}
		}
	};

	handleSliderFocus = () => {
		const seconds = Math.floor(this.sliderKnobProportion * this.video.duration);
		this.sliderScrubbing = true;

		this.setState({
			feedbackAction: 'focus',
			feedbackVisible: true
		});
		this.stopDelayedFeedbackHide();

		if (!isNaN(seconds)) {
			const knobTime = secondsToTime(seconds, getDurFmt(this.props.locale!) as any, {includeHour: true});

			forward('onScrub', {
				detached: this.sliderScrubbing,
				proportion: this.sliderKnobProportion,
				seconds,
				type: 'onScrub'
			},
			this.props);

			this.announce(`${$L('jump to')} ${knobTime}`, true);
		}
	};

	handleSliderBlur = () => {
		this.sliderScrubbing = false;
		this.startDelayedFeedbackHide();
		this.setState(() => ({
			feedbackAction: 'blur',
			feedbackVisible: true
		}));
	};

	slider5WayPressJob = new Job(() => {
		this.setState({slider5WayPressed: false});
	}, 200);

	handleSliderKeyDown = (ev: any) => {
		const {keyCode} = ev;

		if (is('enter', keyCode)) {
			this.setState({
				slider5WayPressed: true
			}, this.slider5WayPressJob.start() as any);
		} else if (is('down', keyCode)) {
			Spotlight.setPointerMode(false);

			if (Spotlight.focus(this.mediaControlsSpotlightId)) {
				preventDefault(ev);
				stopImmediate(ev);
			}
		} else if (is('up', keyCode)) {
			Spotlight.setPointerMode(false);
		}
	};

	onJumpBackward = this.handle(
		forwardWillJumpBackward,
		() => this.jump(-1 * this.props.jumpBy!),
		forwardJumpBackward
	);

	onJumpForward = this.handle(
		forwardWillJumpForward,
		() => this.jump(this.props.jumpBy!),
		forwardJumpForward
	);

	onNext: any = this.props.onWillNext || this.props.onNext ? this.handle(
		forwardWillNext,
		// () => this.next(),
		forwardNext
	) : null;

	onPrevious: any = this.props.onWillPrevious || this.props.onPrevious ? this.handle(
		forwardWillPrevious,
		// () => this.previous(),
		forwardPrevious
	) : null;

	handleToggleMore = (ev: any) => {
		const {showMoreComponents, liftDistance} = ev;

		forwardToggleMore(ev, this.props);

		if (!showMoreComponents) {
			this.startAutoCloseTimeout();	// Restore the timer since we are leaving "more".
			// Restore the title-hide now that we're finished with "more".
			this.startDelayedTitleHide();
		} else {
			// Interrupt the title-hide since we don't want it hiding autonomously in "more".
			this.stopDelayedTitleHide();
		}

		this.playerRef.current.style.setProperty('--liftDistance', `${liftDistance}px`);
		this.setState(({announce}: any) => ({
			infoVisible: showMoreComponents,
			titleVisible: true,
			announce: announce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
		}));
	};

	handleMediaControlsClose = (ev: any) => {
		this.hideControls();
		ev.stopPropagation();
	};

	setVideoRef = (video: any) => {
		this.video = video;
	};

	titleRef: any;

	setTitleRef = (node: any) => {
		this.titleRef = node;
	};

	setAnnounceRef = (node: any) => {
		this.announceRef = node;
	};

	getControlsAriaProps () {
		if (this.state.announce === AnnounceState.TITLE) {
			return {
				'aria-labelledby': `${this.id}_mediaTitle_title ${this.id}_mediaControls_actionGuide`,
				'aria-live': 'off',
				role: 'alert'
			};
		} else if (this.state.announce === AnnounceState.INFO) {
			return {
				'aria-labelledby': `${this.id}_mediaTitle_info`,
				role: 'region'
			};
		}

		return null;
	}

	render () {
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
			...mediaPropsSrc
		} = this.props;

		const mediaProps = mediaPropsSrc as unknown as Record<string, any>;

		if (!warnedOnJumpBackward && mediaProps.onJumpBackward) {
			deprecate({name: '`onJumpBackward`', until: '2.0.0', message: 'Use `onPrevious` instead'});
			warnedOnJumpBackward = true;
		}
		if (!warnedOnJumpForward && mediaProps.onJumpForward) {
			deprecate({name: '`onJumpForward`', until: '2.0.0', message: 'Use `onNext` instead'});
			warnedOnJumpForward = true;
		}
		if (!warnedOnWillJumpBackward && mediaProps.onWillJumpBackward) {
			deprecate({name: '`onWillJumpBackward`', until: '2.0.0', message: 'Use `onWillPrevious` instead'});
			warnedOnWillJumpBackward = true;
		}
		if (!warnedOnWillJumpForward && mediaProps.onWillJumpForward) {
			deprecate({name: '`onWillJumpForward`', until: '2.0.0', message: 'Use `onWillPrevious` instead'});
			warnedOnWillJumpForward = true;
		}

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
		mediaProps.onLoadStart = this.handleLoadStart;
		mediaProps.onUpdate = this.handleEvent;
		mediaProps.ref = this.setVideoRef;

		const controlsAriaProps = this.getControlsAriaProps();

		let proportionSelection: number[] | undefined = selection;
		if (proportionSelection != null && this.state.duration) {
			proportionSelection = selection!.map((t: number) => t / this.state.duration);
		}

		const durFmt = getDurFmt(locale as string) as any;
		const controlsHandleAboveHoldConfig = getControlsHandleAboveHoldConfig({frequency: jumpDelay, time: initialJumpDelay});

		return (
			<RootContainer
				className={css.videoPlayer + ' enact-fit' + (className ? ' ' + className : '')}
				onClick={this.activityDetected}
				playerRef={this.playerRef}
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
							cloneElement(VideoComponent as ReactElement, mediaProps)
						)
					) || null
				}

				<Overlay
					bottomControlsVisible={this.state.mediaControlsVisible}
					onClick={this.onVideoClick}
				>
					{!noSpinner && (this.state.loading || loading) ? <Spinner centered /> : null}
				</Overlay>

				{this.state.bottomControlsRendered ?
					<div className={css.fullscreen} {...(controlsAriaProps as any)}>
						{
							this.state.mediaControlsVisible ?
								<Button
									aria-label={backButtonAriaLabel == null ? $L('go to previous') : backButtonAriaLabel}
									className={css.back}
									icon="arrowhookleft"
									iconFlip="auto"
									onClick={this.handleBack}
									size="small"
								/> :
								null
						}
						<FeedbackContent
							className={css.miniFeedback}
							playbackRate={this.pulsedPlaybackRate || this.selectPlaybackRate(this.speedIndex)}
							playbackState={this.pulsedPlaybackState || this.prevCommand}
							visible={this.state.miniFeedbackVisible && !noMiniFeedback}
						>
							{secondsToTime(this.state.sliderTooltipTime, durFmt, {includeHour: false})}
						</FeedbackContent>
						<ControlsContainer
							className={css.bottom + (this.state.mediaControlsVisible ? '' : ' ' + css.hidden) + (this.state.infoVisible ? ' ' + css.lift : '')}
							spotlightDisabled={spotlightDisabled || !this.state.mediaControlsVisible}
						>
							{/*
								Info Section: Title, Description, Times
								Only render when `this.state.mediaControlsVisible` is true in order for `Marquee`
								to make calculations correctly in `MediaTitle`.
							*/}
							{this.state.mediaSliderVisible ?
								<div className={css.infoFrame}>
									<MediaTitle
										id={`${this.id}_mediaTitle`}
										infoVisible={this.state.infoVisible}
										ref={this.setTitleRef}
										title={title}
										visible={this.state.titleVisible && this.state.mediaControlsVisible}
									>
										{infoComponents}
									</MediaTitle>
									{noSlider ?
										<Times current={this.state.currentTime} total={this.state.duration} formatter={durFmt} includeHour={includeTimeHour} /> :
										null
									}
								</div> :
								null
							}
							{noSlider ?
								null :
								<div className={css.sliderContainer}>
									{this.state.mediaSliderVisible ?
										<Times noTotalTime current={this.state.currentTime} formatter={durFmt} includeHour={includeTimeHour}  /> :
										null
									}
									<MediaSlider
										aria-valuetext=" "
										backgroundProgress={this.state.proportionLoaded}
										disabled={disabled || this.state.sourceUnavailable}
										forcePressed={this.state.slider5WayPressed}
										onBlur={this.handleSliderBlur}
										onChange={this.onSliderChange}
										onFocus={this.handleSliderFocus}
										onKeyDown={this.handleSliderKeyDown}
										onKnobMove={this.handleKnobMove}
										selection={proportionSelection}
										spotlightDisabled={spotlightDisabled || !this.state.mediaControlsVisible}
										value={this.state.proportionPlayed}
										visible={this.state.mediaSliderVisible}
									>
										<FeedbackTooltip
											action={this.state.feedbackAction}
											duration={this.state.duration}
											formatter={durFmt}
											hidden={!this.state.feedbackVisible || this.state.sourceUnavailable}
											playbackRate={this.selectPlaybackRate(this.speedIndex)}
											playbackState={this.prevCommand}
											thumbnailComponent={thumbnailComponent}
											thumbnailDeactivated={this.props.thumbnailUnavailable}
											thumbnailSrc={thumbnailSrc}
										/>
									</MediaSlider>
									{this.state.mediaSliderVisible ?
										<Times noCurrentTime total={this.state.duration} formatter={durFmt} includeHour={includeTimeHour} /> :
										null
									}
								</div>
							}
							<ComponentOverride
								component={mediaControlsComponent as any}
								id={`${this.id}_mediaControls`}
								initialJumpDelay={initialJumpDelay}
								jumpDelay={jumpDelay}
								mediaDisabled={disabled || this.state.sourceUnavailable}
								no5WayJump={no5WayJump}
								onClose={this.handleMediaControlsClose}
								onFastForward={this.handleFastForward}
								onJumpBackwardButtonClick={this.onJumpBackward}
								onJumpForwardButtonClick={this.onJumpForward}
								onNextButtonClick={this.onNext}
								onPause={this.handlePause}
								onPlay={this.handlePlay}
								onPreviousButtonClick={this.onPrevious}
								onRewind={this.handleRewind}
								onToggleMore={this.handleToggleMore}
								paused={this.state.paused}
								spotlightId={this.mediaControlsSpotlightId}
								spotlightDisabled={!this.state.mediaControlsVisible || spotlightDisabled}
								visible={this.state.mediaControlsVisible}
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
					onDown={this.handleControlsHandleAboveDown}
					onHold={this.handleControlsHandleAboveHold}
					onKeyDown={this.handleControlsHandleAboveKeyDown}
					onKeyUp={this.handleControlsHandleAboveKeyUp}
					onSpotlightDown={this.showControls}
					selectionKeys={controlsHandleAboveSelectionKeys}
					spotlightDisabled={this.state.mediaControlsVisible || spotlightDisabled}
				/>
				<Announce ref={this.setAnnounceRef} />
			</RootContainer>
		);
	}
};

/**
 * A standard HTML5 video player for Limestone. It behaves, responds to, and operates like a
 * `<video>` tag in its support for `<source>`.  It also accepts custom tags such as
 * `<infoComponents>` for displaying additional information in the title area and `<MediaControls>`
 * for handling media playback controls and adding more controls.
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
) as ComponentType<any>;

export default VideoPlayer;
export {
	Video,
	VideoPlayer,
	VideoPlayerBase
};
