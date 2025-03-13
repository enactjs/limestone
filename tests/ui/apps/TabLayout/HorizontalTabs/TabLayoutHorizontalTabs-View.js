import spotlight from '@enact/spotlight';

import Button from '../../../../../Button';
import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<div {...props} style={{display: 'flex', flexDirection: 'row', overflow: 'scroll'}}>
		<Button>Button 1</Button>
		<TabLayout
			id="tabLayout"
			orientation="horizontal"
			tabSize={900}
		>
			{tabsForScroll}
		</TabLayout>
		<Button>2</Button>
	</div>
);

export default ThemeDecorator(app);
