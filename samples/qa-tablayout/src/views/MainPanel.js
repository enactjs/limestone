import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import Button from '@enact/limestone/Button';

const MainPanel = () => (
	<TabLayout>
		<Tab title="Settings" icon="gear">
			<Button>Edit</Button>
		</Tab>
		<Tab title="Sound" icon="sound">
			<Button>Edit</Button>
		</Tab>
	</TabLayout>
);

export default MainPanel;
