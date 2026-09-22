import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {ReactNode} from 'react';

import {onlyUpdateForProps} from '../internal/util';

import Feedback from './Feedback';
import states from './FeedbackIcons';

export interface FeedbackContentBaseProps {
	children?: ReactNode;
	className?: string;
	feedbackVisible?: boolean;
	playbackRate?: string | number;
	playbackState?: string;
	visible?: boolean;
}

/**
 * FeedbackContent {@link limestone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class FeedbackContent
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackContentBase = kind({
	name: 'FeedbackContent',

	_propTypes: {} as FeedbackContentBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.Feedback.prototype */ {
		feedbackVisible: PropTypes.bool,
		playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		playbackState: PropTypes.oneOf(Object.keys(states)),
		visible: PropTypes.bool
	},

	defaultProps: {
		feedbackVisible: true,
		visible: true
	},

	render: ({children, playbackRate, playbackState, feedbackVisible, visible, ...rest}) => {
		return (
			<div {...rest} style={!visible ? {display: 'none'} : void 0}>
				<Feedback
					playbackState={playbackState}
					visible={feedbackVisible}
				>
					{playbackRate}
				</Feedback>
				{children}
			</div>
		);
	}
});

const FeedbackContent = onlyUpdateForProps(FeedbackContentBase, ['children', 'feedbackVisible', 'playbackRate', 'playbackState', 'visible']);

export default FeedbackContent;
export {
	FeedbackContent,
	FeedbackContentBase
};
