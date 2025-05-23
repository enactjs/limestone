import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import Heading from '../../Heading';

import componentCss from './DateTime.module.less';

/**
 * {@link limestone/internal/DateTime.DateTime} provides the surrounding
 * markup and styling for a {@link limestone/DatePicker} and
 * {@link limestone/TimePicker}.
 *
 * @class DateTime
 * @memberof limestone/internal/DateTime
 * @ui
 * @private
 */
const DateTimeBase = kind({
	name: 'DateTime',

	propTypes:  /** @lends limestone/internal/DateTime.DateTime.prototype */ {
		css: PropTypes.object,

		/**
		 * The label to display above the picker
		 *
		 * @type {String}
		 */
		label: PropTypes.string,

		/**
		 * Aligns the `title` horizontally within the component.
		 *
		 * @type {('center'|'left')}
		 * @default 'center'
		 * @public
		 */
		titleAlignment: PropTypes.oneOf(['center', 'left'])
	},

	defaultProps: {
		titleAlignment: 'center'
	},

	styles: {
		css: componentCss,
		className: 'dateTime',
		publicClassNames: ['dateTime', 'pickers']
	},

	computed: {
		className: ({titleAlignment, styler}) => styler.append(titleAlignment)
	},

	render: ({children, css, label, ...rest}) => {
		delete rest.titleAlignment;

		return (
			<div {...rest}>
				{label ? <Heading className={css.heading} size="tiny">{label}</Heading> : null}
				<div className={css.pickers}>
					{children}
				</div>
			</div>
		);
	}
});

export default DateTimeBase;
export {
	DateTimeBase,
	DateTimeBase as DateTime
};
