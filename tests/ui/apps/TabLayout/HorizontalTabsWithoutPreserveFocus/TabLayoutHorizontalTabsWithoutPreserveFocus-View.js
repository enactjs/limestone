import spotlight from '@enact/spotlight';

import Button from '../../../../../Button';
import TabLayout from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

import {tabsForScroll} from '../TabComponents';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<div {...props} style={{display: 'flex', flexDirection: 'row'}}>
		<Button icon="arrowsmallleft" id="leftButton" minWidth={false} size="small" />
		<TabLayout
			id="tabLayout"
			orientation="horizontal"
			style={{width: '90%'}}
			tabSize={900}
		>
			{tabsForScroll}
		</TabLayout>
		<Button icon="arrowsmallright" id="rightButton" minWidth={false} size="small" />
	</div>
);

export default ThemeDecorator(app);
