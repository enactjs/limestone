import ThemeDecorator from '@enact/limestone/ThemeDecorator';

import MainPanel from '../views/MainPanel';

const App = (props) => (
	<div {...props}>
		<MainPanel />
	</div>
);

export default ThemeDecorator(App);
