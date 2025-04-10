import spotlight from '@enact/spotlight';

import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<div {...props} style={{display: 'flex', flexDirection: 'row', overflow: 'hidden'}}>
		<TabLayout
			id="tabLayout"
			orientation="horizontal"
			tabSize={900}
		>
			{tabsForScroll}
		</TabLayout>
	</div>
);

export default ThemeDecorator(app);
