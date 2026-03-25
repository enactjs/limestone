import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import {useCallback} from 'react';

import MainPanel from '../views/MainPanel';


const config = {
	ri: {
		linearScaling: {
			active: true,
			type: 'full'
		}
	}
};

const App = ({...rest}) => {
	const onClickCheckbox = useCallback((ev) => {
		config.ri.linearScaling.active = !!ev;
		if (ev) config.ri.linearScaling.type = ev.currentTarget.id;
	}, []);

	return (
		<div {...rest}>
			<MainPanel onClickCheckbox={onClickCheckbox} />
		</div>
	);
};

export default ThemeDecorator(config, App);
