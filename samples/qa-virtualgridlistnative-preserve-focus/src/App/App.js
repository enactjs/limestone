/* eslint-disable react/jsx-no-bind */

import {Panels} from '@enact/limestone/Panels';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import {use} from 'react';

import {
	decreaseIndex as decreaseAction,
	increaseIndex as increaseAction,
	IndexContext,
	IndexDispatchContext
} from '../context/IndexContext';
import MainPanel from '../views/MainPanel';

const App = (props) => {
	const dispatch = use(IndexDispatchContext);
	const {index} = use(IndexContext);
	const pushPanel = () => dispatch(increaseAction());
	const popPanel = () => dispatch(decreaseAction());

	return (
		<Panels {...props} onBack={popPanel} index={index}>
			<MainPanel title="First" onClick={pushPanel} />
			<MainPanel title="Second" onClick={pushPanel} />
			<MainPanel title="Third" onClick={pushPanel} />
			<MainPanel title="Fourth" />
		</Panels>
	);
};

export default ThemeDecorator(App);
