import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import {onlyUpdateForProps} from '../internal/util';
import $L from '../internal/$L';

import FeedbackIcon from './FeedbackIcon';
import states from './FeedbackIcons';

import css from './Feedback.module.less';

export interface FeedbackBaseProps {
	children?: string | number;
	playbackState?: string;
	visible?: boolean;
}

/**
 * Feedback {@link limestone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class Feedback
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackBase = kind({
	name: 'Feedback',

	_propTypes: {} as FeedbackBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.Feedback.prototype */ {
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		playbackState: PropTypes.oneOf(Object.keys(states)),
		visible: PropTypes.bool
	},

	defaultProps: {
		visible: true
	},

	styles: {
		css,
		className: 'feedback'
	},

	computed: {
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		children: ({children, playbackState: s}: any) => {
			if (states[s]) {
				// Working with a known state, treat `children` as playbackRate
				if (states[s].message && children !== 1) {	// `1` represents a playback rate of 1:1
					return children.toString().replace(/^-/, '') + states[s].message;
				} else if (s === 'pause') {
					return $L('Pause');

				}
			} else {
				// Custom Message
				return children;
			}
		}
	},

	render: ({children, playbackState, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.visible;
		const state = playbackState as string;
		return (
			<div {...restProps}>
				{states[state] && states[state].position === 'before' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
				{children ? <div className={css.message}>{children}</div> : null}
				{states[state] && states[state].position === 'after' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
			</div>
		);
	}
});

const Feedback = onlyUpdateForProps(FeedbackBase, ['children', 'playbackState', 'visible']);

export default Feedback;
export {
	Feedback,
	FeedbackBase
};
