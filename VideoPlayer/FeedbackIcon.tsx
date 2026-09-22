import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import Skinnable from '../Skinnable';

import Icon from '../Icon';
import iconMap from './FeedbackIcons';

import css from './Feedback.module.less';

export interface FeedbackIconBaseProps {
	children?: string;
}

/**
 * Feedback Icon for {@link limestone/VideoPlayer.Feedback}.
 *
 * @class FeedbackIcon
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackIconBase = kind({
	name: 'FeedbackIcon',

	_propTypes: {} as FeedbackIconBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.FeedbackIcon.prototype */ {
		children: PropTypes.oneOf(Object.keys(iconMap)) as PropTypes.Validator<string | undefined>
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		children: ({children}) => children && iconMap[children] && iconMap[children].icon
	},

	render: ({children, ...rest}) => {
		if (children) {
			return (
				<Icon {...rest} size="large">{children}</Icon>
			);
		}

		return null;
	}
});

const FeedbackIcon = Skinnable(FeedbackIconBase);

export default FeedbackIcon;
export {
	FeedbackIcon,
	FeedbackIconBase
};
