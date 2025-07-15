import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import {useCallback, useState} from 'react';

const tabsWithIcons = [
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'},
	{title: 'Heart', icon: 'heart'},
	{title: 'Plug', icon: 'plug'},
	{title: 'Circle', icon: 'circle'},
	{title: 'Stop', icon: 'stop'},
	{title: 'Square', icon: 'square'},
	{title: 'Play', icon: 'play'},
	{title: 'Pause', icon: 'pause'},
	{title: 'Forward', icon: 'forward'},
	{title: 'Backward', icon: 'backward'},
	{title: 'Skip', icon: 'skip'},
	{title: 'List', icon: 'list'},
	{title: 'Search', icon: 'search'}
];

const MainPanel = () => {
	const [noIcons, setNoIcons] = useState(false);

	const handleClickButton = useCallback(() => {
		setNoIcons(prevState => !prevState);
	}, []);

	const tabs = useCallback(() => {
		return [...Array(15)].map((_, index) => {
			return (
				<Tab title={tabsWithIcons[index].title} {...!noIcons && {icon: tabsWithIcons[index].icon}}>
					<Button onClick={handleClickButton}>{noIcons ? 'Show' : 'Hide'} Icons</Button>
					<BodyText>Tab {index + 1}</BodyText>
				</Tab>
			);
		});
	}, [handleClickButton, noIcons]);

	return (
		<TabLayout orientation="vertical">
			{tabs()}
		</TabLayout>
	);
};

export default MainPanel;
