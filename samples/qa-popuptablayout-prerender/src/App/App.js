import ThemeDecorator from '@enact/limestone/ThemeDecorator';

import MainPanel from '../views/MainPanel';

import css from './App.module.less';

const App = (props) => (
	<div {...props} className={css.app}>
		<MainPanel />
	</div>
);

export default ThemeDecorator(App);
