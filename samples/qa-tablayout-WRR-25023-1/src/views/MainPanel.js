import {useCallback, useState} from 'react';
import {Panel, Header} from '@enact/limestone/Panels';
import {TabLayout, Tab} from '@enact/limestone/TabLayout';
import Item from '@enact/limestone/Item';

const list = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];

function MainPanel () {
	const [direction, setDirection] = useState('horizontal');
	const [dynamicList, setDynamicList] = useState(list);

	const handleChangeDirection = useCallback(() => {
		setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');
	}, [direction]);

	const handleAddList = useCallback(() => {
		const newList = [...dynamicList];
		newList.push('Added Tab');
		setDynamicList(newList);
	}, [dynamicList]);

	const tabList = () => {
		return dynamicList.map((tab) => {
			return (
				<Tab key={tab} title={tab}>
					<Header title={tab} />
					<Item
						onClick={handleChangeDirection}
					>
						Change Direction
					</Item>
					<Item
						onClick={handleAddList}
					>
						Add List
					</Item>
				</Tab>
			);
		});
	};

	return (
		<Panel>
			<TabLayout
				orientation={direction}
				style={{height: '100%', width: '100%'}}
			>
				{tabList()}
			</TabLayout>
		</Panel>
	);
}

export default MainPanel;