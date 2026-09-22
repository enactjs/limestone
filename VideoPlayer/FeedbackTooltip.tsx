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
		action: PropTypes.oneOf(['focus', 'blur', 'idle']) as PropTypes.Validator<'focus' | 'blur' | 'idle' | undefined>,
		duration: PropTypes.number,
		formatter: PropTypes.object as PropTypes.Validator<DurationFmt | undefined>,
		hidden: PropTypes.bool,
		orientation: PropTypes.string,
		playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		playbackState: PropTypes.oneOf(Object.keys(states)),
		thumbnailComponent: EnactPropTypes.renderableOverride as PropTypes.Validator<EnactPropTypeShapes.renderableOverride | undefined>,
		thumbnailDeactivated: PropTypes.bool,
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,
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
