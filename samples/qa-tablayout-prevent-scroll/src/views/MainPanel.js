import React, {useState} from 'react';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';

const list = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];

function MainPanel() {
	const [direction, setDirection] = useState('horizontal');
	const [dynamicList, setDynamicList] = useState(list);

	const tabList = () => {
		return dynamicList.map((tab) => {
			return (
				<Tab key={tab} title={tab}>
					<Header title={tab} />
					<Item onClick={() => {
						setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');
					}}>Change Direction</Item>
					<Item onClick={() => {
						const newList = [...dynamicList];
						newList.push('Added Tab');
						setDynamicList(newList);
					}}>
						Add List
					</Item>
				</Tab>
			);
		});
	}

	return (
		<Panel>
			<TabLayout
				orientation={direction}
				style={{ height: '100%', width: '100%' }}
			>
				{tabList()}
			</TabLayout>
		</Panel>
	);
}

export default MainPanel;
