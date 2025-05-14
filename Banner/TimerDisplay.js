import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import css from './TimerDisplay.module.less';

const TimerDisplay = ({timerRef, label}) => {
	const [remainingTime, setRemainingTime] = useState(0);

	useEffect(() => {
		const updateRemainingTime = () => {
			if (!timerRef.current.expiry) {
				setRemainingTime(0);
				return;
			}

			const timeLeft = Math.max(0, Math.ceil((timerRef.current.expiry - Date.now()) / 1000));
			setRemainingTime(timeLeft);
		};

		updateRemainingTime();

		const interval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(interval);
	}, [timerRef]);

	return (
		<div className={css.timerDisplay}>
			{label}: {remainingTime > 0 ? `${remainingTime}s` : 'Reset'}
		</div>
	);
};

TimerDisplay.propTypes = {
	timerRef: PropTypes.shape({
		current: PropTypes.shape({
			expiry: PropTypes.number
		})
	}).isRequired,
	label: PropTypes.string
};

TimerDisplay.defaultProps = {
	label: 'Timer'
};

export default TimerDisplay;
