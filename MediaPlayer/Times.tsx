import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import type DurationFmt from 'ilib/lib/DurationFmt';

import {onlyUpdateForProps} from '../internal/util';

import {secondsToPeriod, secondsToTime} from './util';

import css from './Times.module.less';

export interface TimesBaseProps {
	formatter: DurationFmt;
	current?: number;
	includeHour?: boolean;
	noCurrentTime?: boolean;
	noTotalTime?: boolean;
	total?: number;
}

/**
 * Limestone-styled formatted time component.
 *
 * @class Times
 * @memberof limestone/MediaPlayer
 * @ui
 * @public
 */
const TimesBase = kind({
	name: 'Times',

	_propTypes: {} as TimesBaseProps,

	propTypes: /** @lends limestone/MediaPlayer.Times.prototype */ {
		current: PropTypes.number,
		formatter: PropTypes.object.isRequired as PropTypes.Validator<DurationFmt>,
		includeHour: PropTypes.bool,
		noCurrentTime: PropTypes.bool,
		noTotalTime: PropTypes.bool,
		total: PropTypes.number
	},

	defaultProps: {
		current: 0,
		includeHour: false,
		total: 0
	},

	styles: {
		css,
		className: 'times'
	},

	computed: {
		currentPeriod:   ({current}) => secondsToPeriod(current!),
		currentReadable: ({current, formatter, includeHour}) => secondsToTime(current!, formatter, {includeHour}),
		noSeparator: ({noCurrentTime, noTotalTime}) => noCurrentTime || noTotalTime,
		totalPeriod:     ({total}) => secondsToPeriod(total!),
		totalReadable:   ({total, formatter, includeHour}) => secondsToTime(total!, formatter, {includeHour})
	},

	render: ({currentPeriod, currentReadable, noCurrentTime, noSeparator, noTotalTime, totalPeriod, totalReadable, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.current;
		delete restProps.formatter;
		delete restProps.includeHour;
		delete restProps.total;

		return (
			<div {...restProps}>
				{noCurrentTime ?
					null :
					<time className={css.currentTime} dateTime={currentPeriod}>{currentReadable}</time>
				}
				{noSeparator ?
					null :
					<span className={css.separator}>/</span>
				}
				{noTotalTime ?
					null :
					<time className={css.totalTime} dateTime={totalPeriod}>{totalReadable}</time>
				}
			</div>
		);
	}
});

const Times = onlyUpdateForProps(TimesBase, ['current', 'formatter', 'total']);

export default Times;
export {Times, TimesBase};
