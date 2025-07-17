import spotlight from '@enact/spotlight';
import Layout from '@enact/ui/Layout';

import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<Layout {...props} orientation="vertical">
		<TabLayout
			id="tabLayout"
		>
			{tabsForScroll}
		</TabLayout>
	</Layout>
);

export default ThemeDecorator(app);
