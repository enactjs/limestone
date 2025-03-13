import spotlight from '@enact/spotlight';
import Layout from '@enact/ui/Layout';

import Button from '../../../../../Button';
import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<Layout {...props} orientation="vertical">
		<Button>Button 1</Button>
		<TabLayout
			id="tabLayout"
		>
			{tabsForScroll}
		</TabLayout>
		<Button>Button 2</Button>
	</Layout>
);

export default ThemeDecorator(app);
