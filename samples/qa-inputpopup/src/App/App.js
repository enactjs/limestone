import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';

import MainView from '../views/MainView';

const App = kind({
	name: 'App',

	render: (props) => {
		return (
			<div {...props}>
				<MainView />
			</div>
		);
	}
});

export default ThemeDecorator(App);
