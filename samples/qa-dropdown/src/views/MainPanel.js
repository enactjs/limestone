import Item from '@enact/limestone/Item';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import Panels, {Panel, Header} from '@enact/limestone/Panels';

const MainPanel = props => {
	return (
		<Panels>
			<Panel {...props}>
				<Header title="Hello world" />
				<TabLayout
					orientation="vertical"
					size="small"
				>
					<Tab title="First">
						<Item>This is item</Item>
					</Tab>
				</TabLayout>
			</Panel>
		</Panels>
	);
};

export default MainPanel;