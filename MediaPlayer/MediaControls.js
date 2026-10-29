
import {on, off} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import deprecate from '@enact/core/internal/deprecate';
import {is} from '@enact/core/keymap';
import {checkPropTypes, Job, setDefaultProps} from '@enact/core/util';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import EnactPropTypes from '@enact/core/internal/prop-types';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import Cancelable from '@enact/ui/Cancelable';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';

import ActionGuide from '../ActionGuide';
import Button from '../Button';
import $L from '../internal/$L';
import {compareChildren, onlyUpdateForProps} from '../internal/util';
import Skinnable from '../Skinnable';

import {countReactChildren} from './util';

import css from './MediaControls.module.less';

const DivComponent = ({mediaControlsRef, ...rest}) => (<div ref={mediaControlsRef} {...rest} />);

DivComponent.propTypes = {
	/*
	 * Called with the reference to the mediaControls node.
	 *
	 * @type {Object|Function}
	 * @public
	 */
	mediaControlsRef: EnactPropTypes.ref
};

const OuterContainer = SpotlightContainerDecorator({
	defaultElement: [
		`.${spotlightDefaultClass}`
	],
	leaveFor: {left: '', right: ''}
}, DivComponent);
const Container = SpotlightContainerDecorator({
	enterTo: 'default-element'
}, 'div');
const MediaButton = onlyUpdateForProps(Button, [
	'children',
	'className',
	'disabled',
	'icon',
	'onClick',
	'spotlightDisabled'
]);

const forwardToggleMore = forward('onToggleMore');

const animationDuration = 300;

let warnedJumpBackwardAriaLabel = false;
let warnedJumpBackwardIcon = false;
let warnedJumpButtonsDisabled = false;
let warnedJumpForwardAriaLabel = false;
let warnedJumpForwardIcon = false;
let warnedNoJumpButtons = false;
let warnedOnJumpBackwardButtonClick = false;
let warnedOnJumpForwardButtonClick = false;

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * @class MediaControlsBase
 * @memberof limestone/MediaPlayer
 * @ui
 * @private
 */
const MediaControlsBase = kind({
	name: 'MediaControls',

	// intentionally assigning these props to MediaControls instead of Base (which is private)
	propTypes: /** @lends limestone/MediaPlayer.MediaControls.prototype */ {
		/**
		 * DOM id for the component.
		 *
		 * This child component `ActionGuide`'s id is generated from the id.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		id: PropTypes.string.isRequired,

		/**
		 * The `aria-label` for the action guide.
		 *
		 * When the media has been loaded first, this aria-label is read after media title.
		 * You can use this aria-label to guide the user to find the action guide button for more controls.
		 *
		 * @type {String}
		 * @public
		 */
		actionGuideAriaLabel: PropTypes.string,

		/**
		 * The `aria-label` for the action guide button.
		 *
		 * This aria-label is read when the action guide button is focused.
		 *
		 * @type {String}
		 * @public
		 */
		actionGuideButtonAriaLabel: PropTypes.string,

		/**
		 * Disables the ActionGuide.
		 *
		 * @type {Boolean}
		 * @public
		 */
		actionGuideDisabled: PropTypes.bool,

		/**
		 * The label for the action guide.
		 *
		 * @type {String}
		 * @public
		 */
		actionGuideLabel: PropTypes.string,

		/**
		 * These components are placed below the action guide. Typically, these will be media playlist controls.
		 *
		 * @type {Node}
		 * @public
		 */
		bottomComponents: PropTypes.node,

		/**
		 * The `aria-label` for the jumpBackward button.
		 *
		 * @type {String}
		 * @deprecated Will be removed in 2.0.0. Use `previousAriaLabel` instead.
		 * @public
		 */
		jumpBackwardAriaLabel: PropTypes.string,

		/**
		 * Jump backward {@link limestone/Icon.Icon|icon} name. Accepts any
		 * {@link limestone/Icon.Icon|icon} component type.
		 *
		 * @type {String}
		 * @default 'jumpbackward'
		 * @deprecated Will be removed in 2.0.0. Use `previousIcon` instead.
		 * @public
		 */
		jumpBackwardIcon: PropTypes.string,

		/**
		 * Disables state on the media "jump" buttons; the outer pair.
		 *
		 * @type {Boolean}
		 * @deprecated Will be removed in 2.0.0. Use `previousButtonDisabled` and `nextButtonDisabled` instead.
		 * @public
		 */
		jumpButtonsDisabled: PropTypes.bool,

		/**
		 * The `aria-label` for the jumpForward button.
		 *
		 * @type {String}
		 * @deprecated Will be removed in 2.0.0. Use `nextAriaLabel` instead.
		 * @public
		 */
		jumpForwardAriaLabel: PropTypes.string,

		/**
		 * Jump forward {@link limestone/Icon.Icon|icon} name. Accepts any
		 * {@link limestone/Icon.Icon|icon} component type.
		 *
		 * @type {String}
		 * @default 'jumpforward'
		 * @deprecated Will be removed in 2.0.0. Use `nextIcon` instead.
		 * @public
		 */
		jumpForwardIcon: PropTypes.string,

		/**
		 * Called with the reference to the mediaControls node.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		mediaControlsRef: EnactPropTypes.ref,

		/**
		 * Disables the media buttons.
		 *
		 * @type {Boolean}
		 * @public
		 */
		mediaDisabled: PropTypes.bool,

		/**
		 * When `true`, more components are rendered. This does not indicate the visibility of more components.
		 *
		 * @type {Boolean}
		 * @public
		 */
		moreComponentsRendered: PropTypes.bool,

		/**
		 * The spotlight ID for the moreComponent container.
		 *
		 * @type {String}
		 * @public
		 * @default 'moreComponents'
		 */
		moreComponentsSpotlightId: PropTypes.string,

		/**
		 * The `aria-label` for the next button.
		 *
		 * @type {String}
		 * @public
		 */
		nextAriaLabel: PropTypes.string,

		/**
		 * Disables the next button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		nextButtonDisabled: PropTypes.bool,

		/**
		 * Next {@link limestone/Icon.Icon|icon} name. Accepts any
		 * {@link limestone/Icon.Icon|icon} component type.
		 *
		 * @type {String}
		 * @default 'next'
		 * @public
		 */
		nextIcon: PropTypes.string,

		/**
		 * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
		 *
		 * @type {Boolean}
		 * @deprecated Will be removed in 2.0.0. Use `noPreviousButton` and `noNextButton` instead.
		 * @public
		 */
		noJumpButtons: PropTypes.bool,

		/**
		 * Removes the next button. The button that plays the next video of the playlist.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noNextButton: PropTypes.bool,

		/**
		 * Removes the previous button. The button that plays the previous video of the playlist.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noPreviousButton: PropTypes.bool,

		/**
		 * Called when the button in ActionGuide is clicked.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onActionGuideClick: PropTypes.func,

		/**
		 * Called when cancel/back key events are fired.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the user clicks the JumpBackward button
		 *
		 * @type {Function}
		 * @deprecated Will be removed in 2.0.0. Use `onPreviousButtonClick` instead.
		 * @public
		 */
		onJumpBackwardButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the JumpForward button.
		 *
		 * @type {Function}
		 * @deprecated Will be removed in 2.0.0. Use `onNextButtonClick` instead.
		 * @public
		 */
		onJumpForwardButtonClick: PropTypes.func,

		/**
		 * Called when the user presses a media control button.
		 *
		 * @type {Function}
		 * @public
		 */
		onKeyDownFromMediaButtons: PropTypes.func,

		/**
		 * Called when the user clicks the next button.
		 *
		 * If this function is not set, the button will work as the default jumpForward button.
		 * Next button will be the default in 2.0.0.
		 *
		 * @type {Function}
		 * @public
		 */
		onNextButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the Play button.
		 *
		 * @type {Function}
		 * @public
		 */
		onPlayButtonClick: PropTypes.func,

		/**
		 * Called when the user clicks the previous button
		 *
		 * If this function is not set, the button will work as the default jumpBackward button.
		 * Previous button will be the default in 2.0.0.
		 *
		 * @type {Function}
		 * @public
		 */
		onPreviousButtonClick: PropTypes.func,

		/**
		 * `true` when the video is paused.
		 *
		 * @type {Boolean}
		 * @public
		 */
		paused: PropTypes.bool,

		/**
		 * A string which is sent to the `pause` icon of the player controls. This can be
		 * anything that is accepted by {@link limestone/Icon.Icon|Icon}. This will be temporarily replaced by
		 * the {@link limestone/MediaPlayer.MediaControls.playIcon|playIcon} when the
		 * {@link limestone/MediaPlayer.MediaControls.paused|paused} boolean is `false`.
		 *
		 * @type {String}
		 * @default 'pause'
		 * @public
		 */
		pauseIcon: PropTypes.string,

		/**
		 * A string which is sent to the `play` icon of the player controls. This can be
		 * anything that is accepted by {@link limestone/Icon.Icon}. This will be temporarily replaced by
		 * the {@link limestone/MediaPlayer.MediaControls.pauseIcon|pauseIcon} when the
		 * {@link limestone/MediaPlayer.MediaControls.paused|paused} boolean is `true`.
		 *
		 * @type {String}
		 * @default 'play'
		 * @public
		 */
		playIcon: PropTypes.string,

		/**
		 * Disables the media "play"/"pause" button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		playPauseButtonDisabled: PropTypes.bool,

		/**
		 * The `aria-label` for the previous button.
		 *
		 * @type {String}
		 * @public
		 */
		previousAriaLabel: PropTypes.string,

		/**
		 * Disables the previous button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		previousButtonDisabled: PropTypes.bool,

		/**
		 * Previous {@link limestone/Icon.Icon|icon} name. Accepts any
		 * {@link limestone/Icon.Icon|icon} component type.
		 *
		 * @type {String}
		 * @default 'previous'
		 * @public
		 */
		previousIcon: PropTypes.string,

		/**
		 * When `true`, more components are visible.
		 *
		 * @type {Boolean}
		 * @private
		 */
		showMoreComponents: PropTypes.bool,

		/**
		 * `true` controls are disabled from Spotlight.
		 *
		 * @type {Boolean}
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * The spotlight ID for the media controls container.
		 *
		 * @type {String}
		 * @public
		 * @default 'mediaControls'
		 */
		spotlightId: PropTypes.string,

		/**
		 * The visibility of the component. When `false`, the component will be hidden.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		jumpBackwardIcon: 'jumpbackward',
		jumpForwardIcon: 'jumpforward',
		moreComponentsSpotlightId: 'moreComponents',
		nextIcon: 'next',
		spotlightId: 'mediaControls',
		pauseIcon: 'pause',
		playIcon: 'play',
		previousIcon: 'previous',
		visible: true
	},

	styles: {
		css,
		className: 'controlsFrame'
	},

	computed: {
		actionGuideClassName: ({styler, showMoreComponents}) => styler.join({hidden: showMoreComponents}),
		actionGuideShowing: ({bottomComponents, children}) => countReactChildren(children) || bottomComponents,
		className: ({visible, styler}) => styler.append({hidden: !visible}),
		moreButtonsClassName: ({styler}) => styler.join('mediaControls', 'moreButtonsComponents'),
		moreComponentsClassName: ({styler, showMoreComponents}) => styler.join({hidden: !showMoreComponents}, 'moreComponents'),
		moreComponentsRendered: ({showMoreComponents, moreComponentsRendered}) => showMoreComponents || moreComponentsRendered
	},

	render: deprecate(({
		actionGuideAriaLabel,
		actionGuideButtonAriaLabel,
		actionGuideDisabled,
		actionGuideLabel,
		actionGuideShowing,
		children,
		id,
		jumpBackwardAriaLabel,
		jumpBackwardIcon,
		jumpButtonsDisabled,
		jumpForwardAriaLabel,
		jumpForwardIcon,
		bottomComponents,
		mediaControlsRef,
		mediaDisabled,
		moreComponentsSpotlightId,
		nextAriaLabel,
		nextButtonDisabled,
		nextIcon,
		noJumpButtons,
		noNextButton,
		noPreviousButton,
		onActionGuideClick,
		onJumpBackwardButtonClick,
		onJumpForwardButtonClick,
		onKeyDownFromMediaButtons,
		onNextButtonClick,
		onPlayButtonClick,
		onPreviousButtonClick,
		paused,
		pauseIcon,
		playIcon,
		playPauseButtonDisabled,
		previousAriaLabel,
		previousButtonDisabled,
		previousIcon,
		showMoreComponents,
		moreComponentsRendered,
		moreButtonsClassName,
		moreComponentsClassName,
		actionGuideClassName,
		spotlightDisabled,
		spotlightId,
		...rest
	}) => {
		delete rest.onClose;
		delete rest.visible;

		if (!warnedJumpBackwardAriaLabel && jumpBackwardAriaLabel) {
			deprecate({name: '`jumpBackwardAriaLabel`', until: '2.0.0', message: 'Use `previousAriaLabel` instead'});
			warnedJumpBackwardAriaLabel = true;
		}
		if (!warnedJumpBackwardIcon && jumpBackwardIcon !== 'jumpbackward') {
			deprecate({name: '`jumpBackwardIcon`', until: '2.0.0', message: 'Use `previousIcon` instead'});
			warnedJumpBackwardIcon = true;
		}
		if (!warnedJumpButtonsDisabled && jumpButtonsDisabled) {
			deprecate({name: '`jumpButtonsDisabled`', until: '2.0.0', message: 'Use `previousButtonDisabled` and `nextButtonDisabled` instead'});
			warnedJumpButtonsDisabled = true;
		}
		if (!warnedJumpForwardAriaLabel && jumpForwardAriaLabel) {
			deprecate({name: '`jumpForwardAriaLabel`', until: '2.0.0', message: 'Use `nextAriaLabel` instead'});
			warnedJumpForwardAriaLabel = true;
		}
		if (!warnedJumpForwardIcon && jumpForwardIcon !== 'jumpforward') {
			deprecate({name: '`jumpForwardIcon`', until: '2.0.0', message: 'Use `nextIcon` instead'});
			warnedJumpForwardIcon = true;
		}
		if (!warnedNoJumpButtons && noJumpButtons) {
			deprecate({name: '`noJumpButtons`', until: '2.0.0', message: 'Use `noPreviousButton` and `noNextButton` instead'});
			warnedNoJumpButtons = true;
		}
		if (!warnedOnJumpBackwardButtonClick && onJumpBackwardButtonClick) {
			deprecate({name: '`onJumpBackwardButtonClick`', until: '2.0.0', message: 'Use `onPreviousButtonClick` instead'});
			warnedOnJumpBackwardButtonClick = true;
		}
		if (!warnedOnJumpForwardButtonClick && onJumpForwardButtonClick) {
			deprecate({name: '`onJumpForwardButtonClick`', until: '2.0.0', message: 'Use `onNextButtonClick` instead'});
			warnedOnJumpForwardButtonClick = true;
		}

		return (
			<OuterContainer {...rest} id={id} mediaControlsRef={mediaControlsRef} spotlightId={spotlightId}>
				<Container className={css.mediaControls} spotlightDisabled={spotlightDisabled} onKeyDown={onKeyDownFromMediaButtons}>
					{(noPreviousButton || noJumpButtons) ? null : <MediaButton aria-label={previousAriaLabel || jumpBackwardAriaLabel || $L('Previous')} backgroundOpacity="transparent" css={css} disabled={mediaDisabled || previousButtonDisabled || jumpButtonsDisabled} icon={previousIcon !== 'previous' ? previousIcon : jumpBackwardIcon} onClick={onPreviousButtonClick || onJumpBackwardButtonClick} size="large" spotlightDisabled={spotlightDisabled} />}
					<MediaButton aria-label={paused ? $L('Play') : $L('Pause')} className={spotlightDefaultClass} backgroundOpacity="transparent" css={css} disabled={mediaDisabled || playPauseButtonDisabled} icon={paused ? playIcon : pauseIcon} onClick={onPlayButtonClick} size="large" spotlightDisabled={spotlightDisabled} />
					{(noNextButton || noJumpButtons) ? null : <MediaButton aria-label={nextAriaLabel || jumpForwardAriaLabel || $L('Next')} backgroundOpacity="transparent" css={css} disabled={mediaDisabled || nextButtonDisabled || jumpButtonsDisabled} icon={nextIcon !== 'next' ? nextIcon : jumpForwardIcon} onClick={onNextButtonClick || onJumpForwardButtonClick} size="large" spotlightDisabled={spotlightDisabled} />}
				</Container>
				{actionGuideShowing ?
					<ActionGuide id={`${id}_actionGuide`} aria-label={actionGuideAriaLabel != null ? actionGuideAriaLabel : null} buttonAriaLabel={actionGuideButtonAriaLabel} css={css} className={actionGuideClassName} icon="arrowsmalldown" onClick={onActionGuideClick} disabled={actionGuideDisabled}>{actionGuideLabel}</ActionGuide> :
					null
				}
				{moreComponentsRendered ?
					<Container spotlightId={moreComponentsSpotlightId} className={moreComponentsClassName} spotlightDisabled={!showMoreComponents || spotlightDisabled}>
						<Container className={moreButtonsClassName} >
							{children}
						</Container>
						<div>
							{bottomComponents}
						</div>
					</Container> :
					null
				}
			</OuterContainer>
		);
	}, {
		name: 'features related to `jumpBackward` and `jumpForward` buttons',
		until: '2.0.0',
		message: 'Will be replaced with features related to `previous` and `next` buttons that play previous/next video of the playlist'
	})
});

const mediaControlsDecoratorDefaultProps = {
	initialJumpDelay: 400,
	jumpDelay: 200
};

const mediaControlsDecoratorPropTypes = /** @lends limestone/MediaPlayer.MediaControlsDecorator.prototype */ {
	/**
	 * The label for the action guide.
	 *
	 * @type {String}
	 * @public
	 */
	actionGuideLabel: PropTypes.string,

	/**
	 * These components are placed below the children. Typically, these will be media playlist items.
	 *
	 * @type {Node}
	 * @public
	 */
	bottomComponents: PropTypes.node,

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
	 * The number of milliseconds that the player will throttle before firing a
	 * jump event on a right or left pulse.
	 *
	 * @type {Number}
	 * @default 200
	 * @public
	 */
	jumpDelay: PropTypes.number,

	/**
	 * Disables the media buttons.
	 *
	 * @type {Boolean}
	 * @public
	 */
	mediaDisabled: PropTypes.bool,

	/**
	 * Disables showing more components.
	 *
	 * @type {Boolean}
	 * @public
	 */
	moreActionDisabled: PropTypes.bool,

	/**
	 * Setting this to `true` will disable left and right keys for seeking.
	 *
	 * @type {Boolean}
	 * @public
	 */
	no5WayJump: PropTypes.bool,

	/**
	 * Called when media fast forwards.
	 *
	 * @type {Function}
	 * @public
	 */
	onFastForward: PropTypes.func,

	/**
	 * Called when media jumps.
	 *
	 * @type {Function}
	 * @public
	 */
	onJump: PropTypes.func,

	/**
	 * Called when media gets paused.
	 *
	 * @type {Function}
	 * @public
	 */
	onPause: PropTypes.func,

	/**
	 * Called when media starts playing.
	 *
	 * @type {Function}
	 * @public
	 */
	onPlay: PropTypes.func,

	/**
	 * Called when media rewinds.
	 *
	 * @type {Function}
	 * @public
	 */
	onRewind: PropTypes.func,

	/**
	 * Called when the visibility of more components is changed
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onToggleMore'`
	 * * `showMoreComponents` - `true` when the components are visible`
	 * * `liftDistance` - The distance, in pixels, the component animates
	 *
	 * @type {Function}
	 * @public
	 */
	onToggleMore: PropTypes.func,

	/**
	 * The video pause state.
	 *
	 * @type {Boolean}
	 * @public
	 */
	paused: PropTypes.bool,

	/**
	 * Disables state on the media "play"/"pause" button
	 *
	 * @type {Boolean}
	 * @public
	 */
	playPauseButtonDisabled: PropTypes.bool,

	/**
	 * Disables the media playback-rate control via rewind and fast-forward keys
	 *
	 * @type {Boolean}
	 * @public
	 */
	rateChangeDisabled: PropTypes.bool,

	/**
	 * Registers the MediaControls component with an
	 * {@link core/internal/ApiDecorator.ApiDecorator|ApiDecorator}.
	 *
	 * @type {Function}
	 * @private
	 */
	setApiProvider: PropTypes.func,

	/**
	 * The visibility of the component. When `false`, the component will be hidden.
	 *
	 * @type {Boolean}
	 * @public
	 */
	visible: PropTypes.bool
};

/**
 * Media control behaviors to apply to {@link limestone/MediaPlayer.MediaControlsBase|MediaControlsBase}.
 * Provides built-in support for showing more components and key handling for basic playback
 * controls.
 *
 * @class MediaControlsDecorator
 * @memberof limestone/MediaPlayer
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @private
 */
const useMediaControlsDecorator = (componentProps) => {
	const [showMore, setShowMore] = useState(false);
	const [moreComponentsRendered, setMoreComponentsRendered] = useState(false);
	const showMoreActive = componentProps.visible ? showMore : false;

	// `visible={false}` forces the more-components panel closed, matching getDerivedStateFromProps.
	if (!componentProps.visible && showMore) {
		setShowMore(false);
	}

	const actionGuideHeightRef = useRef(0);
	const animationRef = useRef(null);
	const bottomComponentsHeightRef = useRef(0);
	const committedRef = useRef(null);
	const keyLoopRef = useRef(null);
	const mediaControlsNodeRef = useRef(null);
	const mediaControlsRef = useRef(null);
	const moreComponentsNodeRef = useRef(null);
	const propsRef = useRef(componentProps);
	const handlePulseRef = useRef(null);
	const pulsingKeyCodeRef = useRef(null);
	const pulsingRef = useRef(null);
	const showMoreRef = useRef(showMoreActive);

	const paused = useMemo(() => new Pause('MediaPlayer'), []);
	const moreComponentsRenderingJob = useMemo(() => new Job(() => {
		setMoreComponentsRendered(true);
	}), [setMoreComponentsRendered]);

	const moreComponentsSpotlightId = 'moreComponents';

	const stopListeningForPulses = useCallback(() => {
		pulsingRef.current = false;
		if (keyLoopRef.current) {
			clearTimeout(keyLoopRef.current);
			keyLoopRef.current = null;
		}
	}, []);

	const handlePulse = useCallback(() => {
		forward('onJump', {keyCode: pulsingKeyCodeRef.current}, propsRef.current);
		keyLoopRef.current = setTimeout(() => handlePulseRef.current(), propsRef.current.jumpDelay);
	}, []);

	const startListeningForPulses = useCallback((keyCode) => {
		// Ignore new pulse calls if key code is same, otherwise start new series if we're pulsing
		if (pulsingRef.current && keyCode !== pulsingKeyCodeRef.current) {
			stopListeningForPulses();
		}
		if (!pulsingRef.current) {
			pulsingKeyCodeRef.current = keyCode;
			pulsingRef.current = true;
			keyLoopRef.current = setTimeout(handlePulse, propsRef.current.initialJumpDelay);
			forward('onJump', {keyCode}, propsRef.current);
		}
	}, [handlePulse, stopListeningForPulses]);

	const handleKeyDown = useCallback((ev) => {
		const {
			mediaDisabled,
			no5WayJump,
			visible
		} = propsRef.current;

		const current = Spotlight.getCurrent();

		if (!no5WayJump &&
				!visible &&
				!mediaDisabled &&
				!current &&
				(is('left', ev.keyCode) || is('right', ev.keyCode))) {
			paused.pause();
			startListeningForPulses(ev.keyCode);
		}
	}, [paused, startListeningForPulses]);

	const handleKeyUp = useCallback((ev) => {
		const {
			mediaDisabled,
			no5WayJump,
			rateChangeDisabled,
			playPauseButtonDisabled
		} = propsRef.current;

		if (mediaDisabled) return;

		if (!playPauseButtonDisabled) {
			if (is('play', ev.keyCode)) {
				forward('onPlay', ev, propsRef.current);
			} else if (is('pause', ev.keyCode)) {
				forward('onPause', ev, propsRef.current);
			}
		}

		if (!no5WayJump && (is('left', ev.keyCode) || is('right', ev.keyCode))) {
			stopListeningForPulses();
			paused.resume();
		}

		if (!rateChangeDisabled) {
			if (is('rewind', ev.keyCode)) {
				forward('onRewind', ev, propsRef.current);
			} else if (is('fastForward', ev.keyCode)) {
				forward('onFastForward', ev, propsRef.current);
			}
		}
	}, [paused, stopListeningForPulses]);

	const handleBlur = useCallback(() => {
		stopListeningForPulses();
		paused.resume();
	}, [paused, stopListeningForPulses]);

	const showMoreComponents = useCallback(() => {
		setShowMore(true);
	}, []);

	const hideMoreComponents = useCallback(() => {
		setShowMore(false);
	}, []);

	const areMoreComponentsAvailable = useCallback(() => showMoreRef.current, []);

	const handleActionGuideClick = useCallback(() => {
		if (!showMoreRef.current) {
			showMoreComponents();
		}
	}, [showMoreComponents]);

	const handlePlayButtonClick = useCallback((ev) => {
		forward('onPlayButtonClick', ev, propsRef.current);
		if (propsRef.current.paused) {
			forward('onPlay', ev, propsRef.current);
		} else {
			forward('onPause', ev, propsRef.current);
		}
	}, []);

	const handleClose = useCallback((ev) => {
		if (propsRef.current.visible) {
			forward('onClose', ev, propsRef.current);
		}
	}, []);

	const getMediaControls = useCallback((node) => {
		if (!node) {
			actionGuideHeightRef.current = 0;
			return;
		}
		mediaControlsNodeRef.current = mediaControlsRef.current;

		const guideElement = mediaControlsNodeRef.current.querySelector(`.${css.actionGuide}`);
		actionGuideHeightRef.current = guideElement ? guideElement.scrollHeight : 0;
	}, []);

	const calculateMoreComponentsHeight = () => {
		if (!mediaControlsNodeRef.current) {
			bottomComponentsHeightRef.current = 0;
			return;
		}

		const bottomElement = mediaControlsNodeRef.current.querySelector(`.${css.moreComponents}`);
		bottomComponentsHeightRef.current = bottomElement ? bottomElement.scrollHeight : 0;
	};

	useLayoutEffect(() => {
		on('keydown', handleKeyDown, document);
		on('keyup', handleKeyUp, document);
		on('blur', handleBlur, window);

		return () => {
			off('keydown', handleKeyDown, document);
			off('keyup', handleKeyUp, document);
			off('blur', handleBlur, window);
			stopListeningForPulses();
			moreComponentsRenderingJob.stop();
			if (animationRef.current) {
				animationRef.current.cancel();
			}
		};
	}, [handleBlur, handleKeyDown, handleKeyUp, moreComponentsRenderingJob, stopListeningForPulses]);

	useLayoutEffect(() => {
		propsRef.current = componentProps;
		showMoreRef.current = showMoreActive;
		handlePulseRef.current = handlePulse;

		if (componentProps.setApiProvider) {
			componentProps.setApiProvider({
				areMoreComponentsAvailable,
				showMoreComponents,
				hideMoreComponents
			});
		}

		const prev = committedRef.current;
		const next = {
			bottomComponents: componentProps.bottomComponents,
			children: componentProps.children,
			mediaDisabled: componentProps.mediaDisabled,
			moreComponentsRendered,
			showMore: showMoreActive,
			visible: componentProps.visible
		};

		if (prev) {
			// Need to render `moreComponents` to show it. For performance, render `moreComponents` if it is actually shown.
			if (!prev.showMore && next.showMore && !next.moreComponentsRendered) {
				moreComponentsRenderingJob.startRafAfter();
			} else if (prev.showMore && !next.showMore) {
				moreComponentsRenderingJob.stop();
			}

			if ((!prev.moreComponentsRendered && next.moreComponentsRendered) ||
				(next.moreComponentsRendered && prev.bottomComponents !== next.bottomComponents) ||
				!compareChildren(next.children, prev.children)
			) {
				calculateMoreComponentsHeight();
			}

			if ((next.showMore && !prev.moreComponentsRendered && next.moreComponentsRendered) ||
				(next.moreComponentsRendered && prev.showMore !== next.showMore)
			) {
				forwardToggleMore({
					type: 'onToggleMore',
					showMoreComponents: next.showMore,
					liftDistance: bottomComponentsHeightRef.current - actionGuideHeightRef.current
				}, componentProps);

				if (next.showMore) {
					moreComponentsNodeRef.current = moreComponentsNodeRef.current || mediaControlsNodeRef.current.querySelector(`.${css.moreComponents}`);
					paused.pause();
					animationRef.current = moreComponentsNodeRef.current.animate([
						{transform: 'none', opacity: 0, offset: 0},
						{transform: `translateY(${-actionGuideHeightRef.current}px)`, opacity: 1, offset: 1}
					], {
						duration: (typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) ? 0 : animationDuration,
						fill: 'forwards'
					});
					animationRef.current.onfinish = () => {
						if (showMoreRef.current) {
							paused.resume();
							if (!Spotlight.getPointerMode()) {
								Spotlight.focus(moreComponentsSpotlightId);
							}
						}
					};
					animationRef.current.oncancel = () => {
						paused.resume();
					};
				} else if (animationRef.current != null) {
					animationRef.current.cancel();
				}
			}

			// if media controls disabled, reset key loop
			if (!prev.mediaDisabled && next.mediaDisabled || !prev.visible && next.visible) {
				stopListeningForPulses();
				paused.resume();
			}
		}

		committedRef.current = next;
	});

	return {
		getMediaControls,
		handleActionGuideClick,
		handleClose,
		handlePlayButtonClick,
		mediaControlsRef,
		moreComponentsRendered,
		moreComponentsSpotlightId,
		showMoreActive
	};
};

const MediaControlsDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	const MediaControlsDecorator = (props) => {
		const componentProps = setDefaultProps(props, mediaControlsDecoratorDefaultProps);
		checkPropTypes(MediaControlsDecorator, componentProps);
		const {
			getMediaControls,
			handleActionGuideClick,
			handleClose,
			handlePlayButtonClick,
			mediaControlsRef,
			moreComponentsRendered,
			moreComponentsSpotlightId,
			showMoreActive
		} = useMediaControlsDecorator(componentProps);

		const wrappedProps = Object.assign({}, componentProps);
		delete wrappedProps.initialJumpDelay;
		delete wrappedProps.jumpDelay;
		delete wrappedProps.moreActionDisabled;
		delete wrappedProps.no5WayJump;
		delete wrappedProps.onFastForward;
		delete wrappedProps.onJump;
		delete wrappedProps.onPause;
		delete wrappedProps.onPlay;
		delete wrappedProps.onRewind;
		delete wrappedProps.onToggleMore;
		delete wrappedProps.rateChangeDisabled;
		delete wrappedProps.setApiProvider;

		return (
			<Wrapped
				{...wrappedProps}
				mediaControlsRef={mediaControlsRef}
				actionGuideDisabled={componentProps.moreActionDisabled}
				moreComponentsRendered={moreComponentsRendered}
				moreComponentsSpotlightId={moreComponentsSpotlightId}
				onActionGuideClick={handleActionGuideClick}
				onClose={handleClose}
				onPlayButtonClick={handlePlayButtonClick}
				ref={getMediaControls}
				showMoreComponents={showMoreActive}
			/>
		);
	};

	MediaControlsDecorator.displayName = 'MediaControlsDecorator';
	MediaControlsDecorator.propTypes = mediaControlsDecoratorPropTypes;

	return Slottable({slots: ['bottomComponents']}, MediaControlsDecorator);
});

const handleCancel = (ev, {onClose}) => {
	if (onClose) {
		onClose(ev);
	}
};

/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * This uses {@link ui/Slottable|Slottable} to accept the custom tags, `<bottomComponents>`
 * to add components to the bottom of the media controls. Any additional children will be
 * rendered into the "more" controls area. Showing the additional components is handled by
 * `MediaControls` when the user navigates down from the media buttons.
 *
 * @class MediaControls
 * @memberof limestone/MediaPlayer
 * @mixes ui/Cancelable.Cancelable
 * @mixes limestone/Skinnable.Skinnable
 * @ui
 * @public
 */
const MediaControls = ApiDecorator(
	{api: [
		'areMoreComponentsAvailable',
		'showMoreComponents',
		'hideMoreComponents'
	]},
	MediaControlsDecorator(
		Cancelable({modal: true, onCancel: handleCancel},
			Skinnable(
				MediaControlsBase
			)
		)
	)
);

MediaControls.defaultSlot = 'mediaControlsComponent';

export default MediaControls;
export {
	MediaControlsBase,
	MediaControls,
	MediaControlsDecorator
};
