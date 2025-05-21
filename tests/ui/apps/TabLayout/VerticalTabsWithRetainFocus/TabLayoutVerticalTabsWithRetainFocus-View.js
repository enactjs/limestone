import spotlight from '@enact/spotlight';

import Button from '../../../../../Button';
import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<div {...props} style={{display: 'flex', flexDirection: 'column'}}>
		<Button icon="arrowsmallleft" id="upButton" minWidth={false} size="small" />
		<TabLayout
			id="tabLayout"
			retainFocus
			tabSize={900}
		>
			{tabsForScroll}
		</TabLayout>
		<Button icon="arrowsmallright" id="downButton" minWidth={false} size="small" />
	</div>
);

export default ThemeDecorator(app);
