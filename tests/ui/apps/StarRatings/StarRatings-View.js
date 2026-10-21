import spotlight from '@enact/spotlight';
import {useCallback, useState} from 'react';

import StarRatings from '../../../../StarRatings';
import ThemeDecorator from '../../../../ThemeDecorator';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const App = (props) => {
	const [lastChange, setLastChange] = useState('none');

	const handleChange = useCallback(({value}) => {
		setLastChange(String(value));
	}, []);

	return (
		<div {...props}>
			<div>
				<StarRatings
					id="starRatingsDefault"
					onChange={handleChange}
				/>
			</div>
			<div>
				<StarRatings
					id="starRatingsReadOnly"
					onChange={handleChange}
					readOnly
					value={3.5}
				/>
			</div>
			<div>
				<StarRatings
					defaultValue={2}
					disabled
					id="starRatingsDisabled"
					onChange={handleChange}
				/>
			</div>
			<div id="lastChange">{lastChange}</div>
		</div>
	);
};

export default ThemeDecorator(App);
