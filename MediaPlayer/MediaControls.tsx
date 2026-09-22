import {on, off} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import deprecate from '@enact/core/internal/deprecate';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import Cancelable from '@enact/ui/Cancelable';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import {Component, createRef} from 'react';
import type {ComponentType, ReactNode} from 'react';

import ActionGuide from '../ActionGuide';
import Button from '../Button';
import $L from '../internal/$L';
import {compareChildren, onlyUpdateForProps} from '../internal/util';
import Skinnable from '../Skinnable';

import {countReactChildren} from './util';

import css from './MediaControls.module.less';

interface DivComponentProps {
	mediaControlsRef?: EnactPropTypeShapes.ref;
	[key: string]: any;
}

const DivComponent = ({mediaControlsRef, ...rest}: DivComponentProps) => (<div ref={mediaControlsRef as any} {...rest} />);

DivComponent.propTypes = {
	/*
	 * Called with the reference to the mediaControls node.
	 *
	 * @type {Object|Function}
	 * @public
	 */
	mediaControlsRef: EnactPropTypes.ref
};

const OuterContainer: any = SpotlightContainerDecorator({
	defaultElement: [
		`.${spotlightDefaultClass}`
	],
	leaveFor: {left: '', right: ''}
}, DivComponent);
const Container: any = SpotlightContainerDecorator({
	enterTo: 'default-element'
}, 'div');
const MediaButton: any = onlyUpdateForProps(Button, [
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

export interface MediaControlsBaseProps {
	id: string;
	actionGuideAriaLabel?: string;
	actionGuideButtonAriaLabel?: string;
	actionGuideDisabled?: boolean;
	actionGuideLabel?: string;
	bottomComponents?: ReactNode;
	children?: ReactNode;
	jumpBackwardAriaLabel?: string;
	jumpBackwardIcon?: string;
	jumpButtonsDisabled?: boolean;
	jumpForwardAriaLabel?: string;
	jumpForwardIcon?: string;
	mediaControlsRef?: EnactPropTypeShapes.ref;
	mediaDisabled?: boolean;
	moreComponentsRendered?: boolean;
	moreComponentsSpotlightId?: string;
	nextAriaLabel?: string;
	nextButtonDisabled?: boolean;
	nextIcon?: string;
	noJumpButtons?: boolean;
	noNextButton?: boolean;
	noPreviousButton?: boolean;
	onActionGuideClick?: (...args: any[]) => any;
	onClose?: (...args: any[]) => any;
	onJumpBackwardButtonClick?: (...args: any[]) => any;
	onJumpForwardButtonClick?: (...args: any[]) => any;
	onKeyDownFromMediaButtons?: (...args: any[]) => any;
	onNextButtonClick?: (...args: any[]) => any;
	onPlayButtonClick?: (...args: any[]) => any;
	onPreviousButtonClick?: (...args: any[]) => any;
	paused?: boolean;
	pauseIcon?: string;
	playIcon?: string;
	playPauseButtonDisabled?: boolean;
	previousAriaLabel?: string;
	previousButtonDisabled?: boolean;
	previousIcon?: string;
	showMoreComponents?: boolean;
	spotlightDisabled?: boolean;
	spotlightId?: string;
	visible?: boolean;
}

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
	_propTypes: {} as MediaControlsBaseProps,

	propTypes: /** @lends limestone/MediaPlayer.MediaControls.prototype */ {
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
	}: any) => {
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

export interface MediaControlsDecoratorProps {
	actionGuideLabel?: string;
	bottomComponents?: ReactNode;
	initialJumpDelay?: number;
	jumpDelay?: number;
	mediaDisabled?: boolean;
	moreActionDisabled?: boolean;
	no5WayJump?: boolean;
	onFastForward?: (...args: any[]) => any;
	onJump?: (...args: any[]) => any;
	onPause?: (...args: any[]) => any;
	onPlay?: (...args: any[]) => any;
	onRewind?: (...args: any[]) => any;
	onToggleMore?: (...args: any[]) => any;
	paused?: boolean;
	playPauseButtonDisabled?: boolean;
	rateChangeDisabled?: boolean;
	setApiProvider?: (...args: any[]) => any;
	visible?: boolean;
	[key: string]: any;
}

interface MediaControlsDecoratorState {
	showMoreComponents: boolean;
	moreComponentsRendered: boolean;
}

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
const MediaControlsDecorator = hoc((config, Wrapped: any) => {
	class MediaControlsDecoratorHOC extends Component<MediaControlsDecoratorProps, MediaControlsDecoratorState> {
		static displayName = 'MediaControlsDecorator';

		static propTypes = /** @lends limestone/MediaPlayer.MediaControlsDecorator.prototype */ {
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

		static defaultProps = {
			initialJumpDelay: 400,
			jumpDelay: 200
		};

		constructor (props: MediaControlsDecoratorProps) {
			super(props);
			this.mediaControlsNode = null;
			this.moreComponentsNode = null;

			this.actionGuideHeight = 0;
			this.animation = null;
			this.bottomComponentsHeight = 0;
			this.moreComponentsSpotlightId = 'moreComponents';
			this.keyLoop = null;
			this.pulsingKeyCode = null;
			this.pulsing = null;
			this.paused = new Pause('MediaPlayer');
			this.mediaControlsRef = createRef();

			this.state = {
				showMoreComponents: false,
				moreComponentsRendered: false
			};

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		static getDerivedStateFromProps (props: MediaControlsDecoratorProps) {
			if (!props.visible) {
				return {
					showMoreComponents: false
				};
			}
			return null;
		}

		componentDidMount () {
			on('keydown', this.handleKeyDown, document);
			on('keyup', this.handleKeyUp, document);
			on('blur', this.handleBlur, window);
		}

		componentDidUpdate (prevProps: MediaControlsDecoratorProps, prevState: MediaControlsDecoratorState) {
			// Need to render `moreComponents` to show it. For performance, render `moreComponents` if it is actually shown.
			if (!prevState.showMoreComponents && this.state.showMoreComponents && !this.state.moreComponentsRendered) {
				this.moreComponentsRenderingJob.startRafAfter();
			} else if (prevState.showMoreComponents && !this.state.showMoreComponents) {
				this.moreComponentsRenderingJob.stop();
			}

			if (!prevState.moreComponentsRendered && this.state.moreComponentsRendered ||
				this.state.moreComponentsRendered && prevProps.bottomComponents !== this.props.bottomComponents ||
				!compareChildren(this.props.children, prevProps.children)
			) {
				this.calculateMoreComponentsHeight();
			}

			if (this.state.showMoreComponents && !prevState.moreComponentsRendered && this.state.moreComponentsRendered ||
				this.state.moreComponentsRendered && prevState.showMoreComponents !== this.state.showMoreComponents
			) {
				forwardToggleMore({
					type: 'onToggleMore',
					showMoreComponents: this.state.showMoreComponents,
					liftDistance: this.bottomComponentsHeight - this.actionGuideHeight
				}, this.props);

				if (this.state.showMoreComponents) {
					this.moreComponentsNode = this.moreComponentsNode || this.mediaControlsNode.querySelector(`.${css.moreComponents}`);
					this.paused.pause();
					this.animation = this.moreComponentsNode.animate([
						{transform: 'none', opacity: 0, offset: 0},
						{transform: `translateY(${-this.actionGuideHeight}px)`, opacity: 1, offset: 1}
					], {
						duration: (typeof ENACT_PACK_NO_ANIMATION !== 'undefined' && ENACT_PACK_NO_ANIMATION) ? 0 : animationDuration,
						fill: 'forwards'
					});
					this.animation.onfinish = this.handleFinish;
					this.animation.oncancel = this.handleCancel;
				} else if (this.animation != null) {
					this.animation.cancel();
				}
			}

			// if media controls disabled, reset key loop
			if (!prevProps.mediaDisabled && this.props.mediaDisabled || !prevProps.visible && this.props.visible) {
				this.stopListeningForPulses();
				this.paused.resume();
			}
		}

		componentWillUnmount () {
			off('keydown', this.handleKeyDown, document);
			off('keyup', this.handleKeyUp, document);
			off('blur', this.handleBlur, window);
			this.stopListeningForPulses();
			this.moreComponentsRenderingJob.stop();
			if (this.animation) {
				this.animation.cancel();
			}
		}

		mediaControlsNode: any;
		moreComponentsNode: any;
		actionGuideHeight: number;
		animation: any;
		bottomComponentsHeight: number;
		moreComponentsSpotlightId: string;
		keyLoop: any;
		pulsingKeyCode: any;
		pulsing: any;
		paused: Pause;
		mediaControlsRef: any;

		moreComponentsRenderingJob = new Job(() => {
			this.setState({
				moreComponentsRendered: true
			});
		});

		calculateMoreComponentsHeight = () => {
			if (!this.mediaControlsNode) {
				this.bottomComponentsHeight = 0;
				return;
			}

			const bottomElement = this.mediaControlsNode.querySelector(`.${css.moreComponents}`);
			this.bottomComponentsHeight = bottomElement ? bottomElement.scrollHeight : 0;
		};

		handleKeyDown = (ev: any) => {
			const {
				mediaDisabled,
				no5WayJump,
				visible
			} = this.props;

			const current = Spotlight.getCurrent();

			if (!no5WayJump &&
					!visible &&
					!mediaDisabled &&
					!current &&
					(is('left', ev.keyCode) || is('right', ev.keyCode))) {
				this.paused.pause();
				this.startListeningForPulses(ev.keyCode);
			}
		};

		handleKeyUp = (ev: any) => {
			const {
				mediaDisabled,
				no5WayJump,
				rateChangeDisabled,
				playPauseButtonDisabled
			} = this.props;

			if (mediaDisabled) return;

			if (!playPauseButtonDisabled) {
				if (is('play', ev.keyCode)) {
					forward('onPlay', ev, this.props);
				} else if (is('pause', ev.keyCode)) {
					forward('onPause', ev, this.props);
				}
			}

			if (!no5WayJump && (is('left', ev.keyCode) || is('right', ev.keyCode))) {
				this.stopListeningForPulses();
				this.paused.resume();
			}

			if (!rateChangeDisabled) {
				if (is('rewind', ev.keyCode)) {
					forward('onRewind', ev, this.props);
				} else if (is('fastForward', ev.keyCode)) {
					forward('onFastForward', ev, this.props);
				}
			}
		};

		handleBlur = () => {
			this.stopListeningForPulses();
			this.paused.resume();
		};

		handleActionGuideClick = () => {
			if (!this.state.showMoreComponents) {
				this.showMoreComponents();
			}
		};

		startListeningForPulses = (keyCode: number) => {
			// Ignore new pulse calls if key code is same, otherwise start new series if we're pulsing
			if (this.pulsing && keyCode !== this.pulsingKeyCode) {
				this.stopListeningForPulses();
			}
			if (!this.pulsing) {
				this.pulsingKeyCode = keyCode;
				this.pulsing = true;
				this.keyLoop = setTimeout(this.handlePulse, this.props.initialJumpDelay);
				forward('onJump', {keyCode}, this.props);
			}
		};

		handlePulse = () => {
			forward('onJump', {keyCode: this.pulsingKeyCode}, this.props);
			this.keyLoop = setTimeout(this.handlePulse, this.props.jumpDelay);
		};

		handlePlayButtonClick = (ev: any) => {
			forward('onPlayButtonClick', ev, this.props);
			if (this.props.paused) {
				forward('onPlay', ev, this.props);
			} else {
				forward('onPause', ev, this.props);
			}
		};

		stopListeningForPulses () {
			this.pulsing = false;
			if (this.keyLoop) {
				clearTimeout(this.keyLoop);
				this.keyLoop = null;
			}
		}

		getMediaControls = (node: any) => {
			if (!node) {
				this.actionGuideHeight = 0;
				return;
			}
			this.mediaControlsNode = this.mediaControlsRef.current;

			const guideElement = this.mediaControlsNode.querySelector(`.${css.actionGuide}`);
			this.actionGuideHeight = guideElement ? guideElement.scrollHeight : 0;
		};

		areMoreComponentsAvailable = () => {
			return this.state.showMoreComponents;
		};

		showMoreComponents = () => {
			this.setState({showMoreComponents: true});
		};

		hideMoreComponents = () => {
			this.setState({showMoreComponents: false});
		};

		toggleMoreComponents () {
			this.setState((prevState) => {
				return {
					showMoreComponents: !prevState.showMoreComponents
				};
			});
		}

		handleClose = (ev: any) => {
			if (this.props.visible) {
				forward('onClose', ev, this.props);
			}
		};

		handleFinish = () => {
			if (this.state.showMoreComponents) {
				this.paused.resume();
				if (!Spotlight.getPointerMode()) {
					Spotlight.focus(this.moreComponentsSpotlightId);
				}
			}
		};

		handleCancel = () => {
			this.paused.resume();
		};

		render () {
			const props: any = Object.assign({}, this.props);
			delete props.initialJumpDelay;
			delete props.jumpDelay;
			delete props.moreActionDisabled;
			delete props.no5WayJump;
			delete props.onFastForward;
			delete props.onJump;
			delete props.onPause;
			delete props.onPlay;
			delete props.onRewind;
			delete props.onToggleMore;
			delete props.rateChangeDisabled;
			delete props.setApiProvider;

			return (
				<Wrapped
					{...props}
					mediaControlsRef={this.mediaControlsRef}
					actionGuideDisabled={this.props.moreActionDisabled}
					moreComponentsRendered={this.state.moreComponentsRendered}
					moreComponentsSpotlightId={this.moreComponentsSpotlightId}
					onActionGuideClick={this.handleActionGuideClick}
					onClose={this.handleClose}
					onPlayButtonClick={this.handlePlayButtonClick}
					ref={this.getMediaControls}
					showMoreComponents={this.state.showMoreComponents}
				/>
			);
		}
	}

	return Slottable({slots: ['bottomComponents']}, MediaControlsDecoratorHOC);
});

const handleCancel = (ev: any, {onClose}: any) => {
	if (onClose) {
		onClose(ev);
	}
};

/**
 * A set of components for controlling media playback and rendering additional components.
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
) as ComponentType<any>;

(MediaControls as any).defaultSlot = 'mediaControlsComponent';

export default MediaControls;
export {
	MediaControlsBase,
	MediaControls,
	MediaControlsDecorator
};
