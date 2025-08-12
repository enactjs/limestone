import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import Panels from '@enact/limestone/Panels';

import MainPanel from '../views/MainPanel';

import appColors from '../colorsConfig';

const App = kind({
	name: 'App',

	render: (props) => (
		<div style={appColors} {...props}>
			<Panels>
				<MainPanel />
			</Panels>
		</div>
	)
});

export default ThemeDecorator({style: 'style'}, App);
