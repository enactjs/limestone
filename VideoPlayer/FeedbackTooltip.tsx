import kind from '@enact/core/kind';
import ComponentOverride from '@enact/ui/ComponentOverride';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import type DurationFmt from 'ilib/lib/DurationFmt';

import Image from '../Image';
import {onlyUpdateForProps} from '../internal/util';
import Skinnable from '../Skinnable';

import FeedbackContent from './FeedbackContent';
import states from './FeedbackIcons';
import {secondsToTime} from '../MediaPlayer/';

import css from './FeedbackTooltip.module.less';

export interface FeedbackTooltipBaseProps {
	action?: 'focus' | 'blur' | 'idle';
	children?: number;
	duration?: number;
	formatter?: DurationFmt;
	hidden?: boolean;
	orientation?: string;
	playbackRate?: string | number;
	playbackState?: string;
	thumbnailComponent?: EnactPropTypeShapes.renderableOverride;
	thumbnailDeactivated?: boolean;
	thumbnailSrc?: string | Record<string, string>;
	visible?: boolean;
}

/**
 * FeedbackTooltip {@link limestone/VideoPlayer}. This displays the media's playback rate and
 * time information.
 *
 * @class FeedbackTooltip
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackTooltipBase = kind({
	name: 'FeedbackTooltip',

	_propTypes: {} as FeedbackTooltipBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.FeedbackTooltip.prototype */ {
		/**
		 * Invoke action to display or hide tooltip.
		 *
		 * @type {('focus'|'blur'|'idle')}
		 * @default 'idle'
		 */
		action: PropTypes.oneOf(['focus', 'blur', 'idle']) as PropTypes.Validator<'focus' | 'blur' | 'idle' | undefined>,

		/**
		 * Duration of the current media in seconds
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		duration: PropTypes.number,

		/**
		 * Instance of `NumFmt` to format the time
		 *
		 * @type {Object}
		 * @public
		 */
		formatter: PropTypes.object as PropTypes.Validator<DurationFmt | undefined>,

		/**
		 * If the current `playbackState` allows this component's visibility to be changed,
		 * this component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * `'rewind'`, `'fastForward'`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hidden: PropTypes.bool,

		/**
		 * Part of the API required by `ui/Slider` but not used by FeedbackTooltip which only
		 * supports horizontal orientation
		 *
		 * @type {String}
		 * @private
		 */
		orientation: PropTypes.string,

		/**
		 * Value of the feedback playback rate
		 *
		 * @type {String|Number}
		 * @public
		 */
		playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * Refers to one of the following possible media playback states.
		 * `'play'`, `'pause'`, `'rewind'`, `'fastForward'` ,
		 * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
		 *
		 * Each state understands where its related icon should be positioned, and whether it should
		 * respond to changes to the `visible` property.
		 *
		 * This string feeds directly into {@link limestone/FeedbackIcon.FeedbackIcon}.
		 *
		 * @type {('play'|'pause'|'rewind'|'fastForward'|'jumpBackward'|'jumpForward'|'jumpToStart'|'jumpToEnd'|'stop')}
		 * @public
		 */
		playbackState: PropTypes.oneOf(Object.keys(states)),

		/**
		 * This component will be used instead of the built-in version. The internal thumbnail style
		 * will be applied to this component. This component follows the same rules as the built-in
		 * version; hiding and showing according to the state of `action`.
		 *
		 * This can be a tag name as a string, a rendered DOM node, a component, or a component
		 * instance.
		 *
		 * @type {String|Component|Element}
		 * @public
		 */
		thumbnailComponent: EnactPropTypes.renderableOverride as PropTypes.Validator<EnactPropTypeShapes.renderableOverride | undefined>,

		/**
		 * `true` if Slider knob is scrubbing.
		 *
		 * @type {Boolean}
		 * @public
		 */
		thumbnailDeactivated: PropTypes.bool,

		/**
		 * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
		 * {@link limestone/Image} component so it supports all the same options for the `src`
		 * property. If no `thumbnailSrc` is set, no tooltip will display.
		 *
		 * @type {String|Object}
		 * @public
		 */
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,

		/**
		 * Required by the interface for limestone/Slider.tooltip but not used here
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		action: 'idle',
		thumbnailDeactivated: false,
		hidden: false
	},

	styles: {
		css,
		className: 'feedbackTooltip'
	},

	computed: {
		arrowContainerClassName: ({action, styler, thumbnailComponent, thumbnailSrc}) => {
			return styler.join(
				'arrowContainer',
				{hidden: action !== 'focus' || (!thumbnailComponent && !thumbnailSrc)}
			);
		},
		children: ({children, duration, formatter}: any) => {
			return secondsToTime(children * duration, formatter);
		},
		className: ({hidden, playbackState: s, thumbnailDeactivated, styler, action, thumbnailComponent, thumbnailSrc}: any) => {
			return styler.append({
				hidden: hidden && states[s] && states[s].allowHide,
				thumbnailDeactivated,
				shift: action === 'focus' && (thumbnailComponent || thumbnailSrc)
			});
		},
		feedbackVisible: ({action, playbackState}) => {
			return (action !== 'focus' || (action as any) === 'idle') && !(action === 'blur' && playbackState === 'play');
		},
		thumbnailComponent: ({action, thumbnailComponent, thumbnailSrc}) => {
			if (action === 'focus') {
				if (thumbnailComponent) {
					return <ComponentOverride
						component={thumbnailComponent as any}
						className={css.thumbnail}
						key="thumbnailComponent"
					/>;
				} else if (thumbnailSrc) {
					return (
						<div className={css.thumbnail} key="thumbnailComponent">
							<Image src={thumbnailSrc} className={css.image} />
						</div>
					);
				}
			}
		}
	},

	render: ({arrowContainerClassName, children, feedbackVisible, playbackState, playbackRate, thumbnailComponent, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.action;
		delete restProps.duration;
		delete restProps.formatter;
		delete restProps.hidden;
		delete restProps.orientation;
		delete restProps.thumbnailDeactivated;
		delete restProps.thumbnailSrc;
		delete restProps.visible;

		return (
			<div {...restProps}>
				<div className={css.alignmentContainer}>
					{thumbnailComponent}
					<FeedbackContent
						className={css.content}
						feedbackVisible={feedbackVisible}
						key="feedbackContent"
						playbackRate={playbackRate}
						playbackState={playbackState}
					>
						{children}
					</FeedbackContent>
					<div className={arrowContainerClassName}>
						<div className={css.arrow} />
					</div>
				</div>
			</div>
		);
	}
});

const FeedbackTooltip: any = onlyUpdateForProps(Skinnable(FeedbackTooltipBase),
	['action', 'children', 'hidden', 'playbackState', 'playbackRate', 'thumbnailComponent', 'thumbnailDeactivated', 'thumbnailSrc', 'visible']
);

FeedbackTooltip.defaultSlot = 'tooltip';

export default FeedbackTooltip;
export {
	FeedbackTooltip,
	FeedbackTooltipBase
};
