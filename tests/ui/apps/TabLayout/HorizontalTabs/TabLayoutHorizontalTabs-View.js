import spotlight from '@enact/spotlight';

import Button from '../../../../../Button';
import TabLayout, {Tab} from '../../../../../TabLayout';
import ThemeDecorator from '../../../../../ThemeDecorator';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<TabLayout
		{...props}
		id="tabLayout"
		orientation="horizontal"
		tabSize={900}
	>
		<Tab title="One">
			<div id="view1">
				View One
				<Button id="button1">Button One</Button>
			</div>
		</Tab>
		<Tab title="Two">
			<div id="view2"><Button id="button2">Button Two</Button></div>
		</Tab>
		<Tab title="Three">
			<div id="view3">View Three</div>
		</Tab>
		<Tab title="Four">
			<div id="view4"><Button id="button4">Button Four</Button></div>
		</Tab>
		<Tab title="Five">
			<div id="view5">View Five</div>
		</Tab>
		<Tab title="Six">
			<div id="view6"><Button id="button6">Button Six</Button></div>
		</Tab>
		<Tab title="Seven">
			<div id="view7"><Button id="button7">Button Seven</Button></div>
		</Tab>
		<Tab title="Eight">
			<div id="view8">View Eight</div>
		</Tab>
		<Tab title="Nine">
			<div id="view9"><Button id="button9">Button Nine</Button></div>
		</Tab>
		<Tab title="Ten">
			<div id="view10">View Ten</div>
		</Tab>
	</TabLayout>
);

export default ThemeDecorator(app);