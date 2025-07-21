/* eslint-disable react/jsx-no-bind */
import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import {InputField} from '@enact/limestone/Input';
import Item from '@enact/limestone/Item';
import {Panel, Header} from '@enact/limestone/Panels';
import {Scroller} from '@enact/limestone/Scroller';
import TabLayout, {TabLayoutBase, Tab} from '@enact/limestone/TabLayout';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, range, select} from '@enact/storybook-utils/addons/controls';
import Layout, {Cell, Column, Row} from '@enact/ui/Layout';
import {Component, useCallback, useMemo, useState} from 'react';

import {tabIcons} from '../helper/icons';

import css from './TabLayout.module.less';

TabLayout.displayName = 'TabLayout';
const Config = mergeComponentMetadata('TabLayout', TabLayoutBase, TabLayout);

const tabsWithIcons = [
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'},
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'},
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'},
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'}
];

class AddingTabSample extends Component {
	constructor (props) {
		super(props);

		this.state = {
			active: false,
			index: 0
		};
	}

	componentDidMount () {
		this.id = setInterval(() => {
			this.setState((state) => ({
				active: !state.active,
				// modeling updating the index when the tabs change
				index: state.active ? state.index - 1 : state.index + 1
			}));
		}, 3000);
	}

	componentWillUnmount () {
		clearInterval(this.id);
	}

	handleSelect = ({index}) => this.setState({index});

	render () {
		return (
			<TabLayout onSelect={this.handleSelect} index={this.state.index}>
				{this.state.active ? (
					<TabLayout.Tab title="added" icon="home">
						<BodyText>
							If this button is focused when the tab is removed, spotlight will be lost.
						</BodyText>
						<Button>Added button</Button>
					</TabLayout.Tab>
				) : null}
				<TabLayout.Tab title="one" icon="star">
					<Button>Button 1</Button>
				</TabLayout.Tab>
			</TabLayout>
		);
	}
}

export default {
	title: 'Limestone/TabLayout',
	component: 'TabLayout'
};

export const WithVariableNumberOfTabs = (args) => {
	const tabs = args['Number of Tabs'];
	const isHorizontal = args['orientation'] === 'horizontal';

	return (
		<Panel css={isHorizontal ? css : null}>
			<Header title="TabLayout" subtitle="With variable number of tabs" />
			<TabLayout
				css={isHorizontal ? css : null}
				orientation={args['orientation']}
				offset={132}
			>
				{Array.from({length: tabs}, (v, i) => (
					<TabLayout.Tab title={`Tab ${i}`} icon={tabIcons[i % tabIcons.length]} key={`tab${i}`}>
						<Scroller className={isHorizontal ? css.scroller : null} key={'view' + i}>
							<Button>Tab {i} Top</Button>
							<BodyText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ante sit amet dui
								cursus tempus ut nec nisl. In scelerisque, nunc in interdum varius, dolor magna
								auctor tellus, quis mattis mauris lectus vel metus. Maecenas tempus quam ac
								dignissim gravida. Integer ut posuere sapien. Duis consequat vitae libero nec
								posuere. Curabitur sagittis mauris vel massa cursus, et mollis est malesuada.
								Vestibulum ante libero, gravida id purus eget, varius porttitor ipsum. Suspendisse
								quis consequat sem, eget gravida est. Morbi pulvinar diam vel mattis lacinia.
								Integer eget est quis augue tincidunt tincidunt quis at nisi. Duis at massa nunc.
								Cras malesuada, sem quis aliquet vulputate, ante ipsum congue ante, eu volutpat
								ipsum sem posuere ante. Suspendisse potenti. Nullam in lacinia mi.
							</BodyText>
							<BodyText>
								Donec ac ultricies nunc, quis pharetra orci. Mauris semper blandit sodales. Morbi eu
								mollis eros. Fusce id lacinia massa. Nam vitae eleifend arcu. Ut ex leo, semper at
								lectus ullamcorper, congue dignissim nunc. Etiam volutpat est mauris. Nullam ut
								tellus vehicula, tempus urna ac, gravida urna. Nunc diam lorem, dictum consectetur
								libero vitae, aliquet tristique nibh. Maecenas tellus nibh, convallis et consectetur
								at, semper ac lacus. Quisque efficitur id risus eget fringilla. Vestibulum ac nibh
								viverra, efficitur tortor vitae, auctor eros. Nulla sit amet sagittis libero, a
								rhoncus nulla. Phasellus vitae tellus ut enim porttitor congue. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
							</BodyText>
							<BodyText>
								Vivamus at augue eget justo finibus commodo ut a urna. Pellentesque eu tempus
								libero, a tristique risus. Sed vel posuere elit. Nulla faucibus nisl turpis, id
								ultricies massa rutrum sit amet. Suspendisse aliquet suscipit convallis. Quisque
								convallis, ipsum nec feugiat vulputate, mi dolor posuere nisi, vel iaculis urna
								lacus sit amet massa. Ut a velit urna. Morbi id massa dui. Class aptent taciti
								sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer
								pharetra eros eget turpis maximus, in fermentum nisl bibendum. Phasellus mattis urna
								et libero malesuada, sed rutrum dolor dignissim.
							</BodyText>
							<BodyText>
								Sed vel nunc lobortis lectus tincidunt viverra. Nullam lobortis eros vel congue
								pellentesque. Donec faucibus felis non neque volutpat dapibus. Nam id mi vel ligula
								maximus imperdiet at eget sapien. Duis in eros lobortis, maximus risus commodo,
								dignissim erat. Suspendisse semper magna leo, eget tincidunt est laoreet non.
								Phasellus nec posuere ipsum, at egestas urna. Fusce pellentesque finibus magna, eget
								hendrerit enim aliquam condimentum.
							</BodyText>
							<BodyText>
								Donec at dolor eget ante faucibus gravida a eget erat. In vehicula nibh eu venenatis
								ullamcorper. Nulla nisl justo, tempus vitae felis et, molestie posuere augue. Morbi
								pellentesque lacinia lacus quis bibendum. Integer nec nisi id mauris gravida
								scelerisque eu eu nibh. Sed accumsan ut ligula at aliquam. Quisque odio ex, viverra
								sit amet lectus scelerisque, sollicitudin ornare ante. Vestibulum arcu augue,
								vehicula vel pellentesque sed, aliquam ut nunc.
							</BodyText>
							<Button>Tab {i} Bottom</Button>
						</Scroller>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

range('Number of Tabs', WithVariableNumberOfTabs, {groupId: 'TabLayout'}, {min: 0, max: 20, step: 1}, 3);
select('orientation', WithVariableNumberOfTabs, ['vertical', 'horizontal'], Config, 'vertical');

WithVariableNumberOfTabs.storyName = 'With variable number of tabs';
WithVariableNumberOfTabs.parameters = {
	props: {
		noPanel: true
	}
};

export const WithTabsWithoutIcons = (args) => {
	const tabs = args['Number of Tabs'];

	return (
		<Panel>
			<Header title="TabLayout" subtitle="With tabs without icons" />
			<TabLayout
				orientation={args['orientation']}
			>
				{Array.from({length: tabs}, (v, i) => (
					<TabLayout.Tab title={`Tab ${i}`} key={`tab${i}`}>
						<Scroller key={'view' + i}>
							<Button>Tab {i} Top</Button>
							<BodyText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ante sit amet dui
								cursus tempus ut nec nisl. In scelerisque, nunc in interdum varius, dolor magna
								auctor tellus, quis mattis mauris lectus vel metus. Maecenas tempus quam ac
								dignissim gravida. Integer ut posuere sapien. Duis consequat vitae libero nec
								posuere. Curabitur sagittis mauris vel massa cursus, et mollis est malesuada.
								Vestibulum ante libero, gravida id purus eget, varius porttitor ipsum. Suspendisse
								quis consequat sem, eget gravida est. Morbi pulvinar diam vel mattis lacinia.
								Integer eget est quis augue tincidunt tincidunt quis at nisi. Duis at massa nunc.
								Cras malesuada, sem quis aliquet vulputate, ante ipsum congue ante, eu volutpat
								ipsum sem posuere ante. Suspendisse potenti. Nullam in lacinia mi.
							</BodyText>
							<BodyText>
								Donec ac ultricies nunc, quis pharetra orci. Mauris semper blandit sodales. Morbi eu
								mollis eros. Fusce id lacinia massa. Nam vitae eleifend arcu. Ut ex leo, semper at
								lectus ullamcorper, congue dignissim nunc. Etiam volutpat est mauris. Nullam ut
								tellus vehicula, tempus urna ac, gravida urna. Nunc diam lorem, dictum consectetur
								libero vitae, aliquet tristique nibh. Maecenas tellus nibh, convallis et consectetur
								at, semper ac lacus. Quisque efficitur id risus eget fringilla. Vestibulum ac nibh
								viverra, efficitur tortor vitae, auctor eros. Nulla sit amet sagittis libero, a
								rhoncus nulla. Phasellus vitae tellus ut enim porttitor congue. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
							</BodyText>
							<BodyText>
								Vivamus at augue eget justo finibus commodo ut a urna. Pellentesque eu tempus
								libero, a tristique risus. Sed vel posuere elit. Nulla faucibus nisl turpis, id
								ultricies massa rutrum sit amet. Suspendisse aliquet suscipit convallis. Quisque
								convallis, ipsum nec feugiat vulputate, mi dolor posuere nisi, vel iaculis urna
								lacus sit amet massa. Ut a velit urna. Morbi id massa dui. Class aptent taciti
								sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer
								pharetra eros eget turpis maximus, in fermentum nisl bibendum. Phasellus mattis urna
								et libero malesuada, sed rutrum dolor dignissim.
							</BodyText>
							<BodyText>
								Sed vel nunc lobortis lectus tincidunt viverra. Nullam lobortis eros vel congue
								pellentesque. Donec faucibus felis non neque volutpat dapibus. Nam id mi vel ligula
								maximus imperdiet at eget sapien. Duis in eros lobortis, maximus risus commodo,
								dignissim erat. Suspendisse semper magna leo, eget tincidunt est laoreet non.
								Phasellus nec posuere ipsum, at egestas urna. Fusce pellentesque finibus magna, eget
								hendrerit enim aliquam condimentum.
							</BodyText>
							<BodyText>
								Donec at dolor eget ante faucibus gravida a eget erat. In vehicula nibh eu venenatis
								ullamcorper. Nulla nisl justo, tempus vitae felis et, molestie posuere augue. Morbi
								pellentesque lacinia lacus quis bibendum. Integer nec nisi id mauris gravida
								scelerisque eu eu nibh. Sed accumsan ut ligula at aliquam. Quisque odio ex, viverra
								sit amet lectus scelerisque, sollicitudin ornare ante. Vestibulum arcu augue,
								vehicula vel pellentesque sed, aliquam ut nunc.
							</BodyText>
							<Button>Tab {i} Bottom</Button>
						</Scroller>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

range('Number of Tabs', WithTabsWithoutIcons, {groupId: 'TabLayout'}, {min: 0, max: 20, step: 1}, 3);
select('orientation', WithTabsWithoutIcons, ['vertical', 'horizontal'], Config, 'vertical');

WithTabsWithoutIcons.storyName = 'With tabs without icons';
WithTabsWithoutIcons.parameters = {
	props: {
		noPanel: true
	}
};

export const WithDisabledTabs = (args) => {
	const tabs = args['Number of Tabs'];

	return (
		<Panel>
			<Header title="TabLayout" subtitle="With disabled tabs" />
			<TabLayout
				orientation={args['orientation']}
			>
				{Array.from({length: tabs}, (v, i) => (
					<TabLayout.Tab
						disabled={i % 2 === 1}
						icon={tabIcons[i % tabIcons.length]}
						title={`Tab ${i}`}
						key={`tab${i}`}
					>
						<Scroller key={'view' + i}>
							<Button>Tab {i} Top</Button>
							<BodyText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ante sit amet dui
								cursus tempus ut nec nisl. In scelerisque, nunc in interdum varius, dolor magna
								auctor tellus, quis mattis mauris lectus vel metus. Maecenas tempus quam ac
								dignissim gravida. Integer ut posuere sapien. Duis consequat vitae libero nec
								posuere. Curabitur sagittis mauris vel massa cursus, et mollis est malesuada.
								Vestibulum ante libero, gravida id purus eget, varius porttitor ipsum. Suspendisse
								quis consequat sem, eget gravida est. Morbi pulvinar diam vel mattis lacinia.
								Integer eget est quis augue tincidunt tincidunt quis at nisi. Duis at massa nunc.
								Cras malesuada, sem quis aliquet vulputate, ante ipsum congue ante, eu volutpat
								ipsum sem posuere ante. Suspendisse potenti. Nullam in lacinia mi.
							</BodyText>
							<BodyText>
								Donec ac ultricies nunc, quis pharetra orci. Mauris semper blandit sodales. Morbi eu
								mollis eros. Fusce id lacinia massa. Nam vitae eleifend arcu. Ut ex leo, semper at
								lectus ullamcorper, congue dignissim nunc. Etiam volutpat est mauris. Nullam ut
								tellus vehicula, tempus urna ac, gravida urna. Nunc diam lorem, dictum consectetur
								libero vitae, aliquet tristique nibh. Maecenas tellus nibh, convallis et consectetur
								at, semper ac lacus. Quisque efficitur id risus eget fringilla. Vestibulum ac nibh
								viverra, efficitur tortor vitae, auctor eros. Nulla sit amet sagittis libero, a
								rhoncus nulla. Phasellus vitae tellus ut enim porttitor congue. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
							</BodyText>
							<BodyText>
								Vivamus at augue eget justo finibus commodo ut a urna. Pellentesque eu tempus
								libero, a tristique risus. Sed vel posuere elit. Nulla faucibus nisl turpis, id
								ultricies massa rutrum sit amet. Suspendisse aliquet suscipit convallis. Quisque
								convallis, ipsum nec feugiat vulputate, mi dolor posuere nisi, vel iaculis urna
								lacus sit amet massa. Ut a velit urna. Morbi id massa dui. Class aptent taciti
								sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer
								pharetra eros eget turpis maximus, in fermentum nisl bibendum. Phasellus mattis urna
								et libero malesuada, sed rutrum dolor dignissim.
							</BodyText>
							<BodyText>
								Sed vel nunc lobortis lectus tincidunt viverra. Nullam lobortis eros vel congue
								pellentesque. Donec faucibus felis non neque volutpat dapibus. Nam id mi vel ligula
								maximus imperdiet at eget sapien. Duis in eros lobortis, maximus risus commodo,
								dignissim erat. Suspendisse semper magna leo, eget tincidunt est laoreet non.
								Phasellus nec posuere ipsum, at egestas urna. Fusce pellentesque finibus magna, eget
								hendrerit enim aliquam condimentum.
							</BodyText>
							<BodyText>
								Donec at dolor eget ante faucibus gravida a eget erat. In vehicula nibh eu venenatis
								ullamcorper. Nulla nisl justo, tempus vitae felis et, molestie posuere augue. Morbi
								pellentesque lacinia lacus quis bibendum. Integer nec nisi id mauris gravida
								scelerisque eu eu nibh. Sed accumsan ut ligula at aliquam. Quisque odio ex, viverra
								sit amet lectus scelerisque, sollicitudin ornare ante. Vestibulum arcu augue,
								vehicula vel pellentesque sed, aliquam ut nunc.
							</BodyText>
							<Button>Tab {i} Bottom</Button>
						</Scroller>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

range('Number of Tabs', WithDisabledTabs, {groupId: 'TabLayout'}, {min: 0, max: 20, step: 1}, 3);
select('orientation', WithDisabledTabs, ['vertical', 'horizontal'], Config, 'vertical');

WithDisabledTabs.storyName = 'With disabled tabs';
WithDisabledTabs.parameters = {
	props: {
		noPanel: true
	}
};

export const WithAllDisabledTabs = (args) => {
	const tabs = args['Number of Tabs'];

	return (
		<Panel>
			<Header title="TabLayout" subtitle="With all disabled tabs" />
			<TabLayout
				orientation={args['orientation']}
			>
				{Array.from({length: tabs}, (v, i) => (
					<TabLayout.Tab disabled icon={tabIcons[i % tabIcons.length]} title={`Tab ${i}`} key={`tab${i}`}>
						<Scroller key={'view' + i}>
							<Button>Tab {i} Top</Button>
							<BodyText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ante sit amet dui
								cursus tempus ut nec nisl. In scelerisque, nunc in interdum varius, dolor magna
								auctor tellus, quis mattis mauris lectus vel metus. Maecenas tempus quam ac
								dignissim gravida. Integer ut posuere sapien. Duis consequat vitae libero nec
								posuere. Curabitur sagittis mauris vel massa cursus, et mollis est malesuada.
								Vestibulum ante libero, gravida id purus eget, varius porttitor ipsum. Suspendisse
								quis consequat sem, eget gravida est. Morbi pulvinar diam vel mattis lacinia.
								Integer eget est quis augue tincidunt tincidunt quis at nisi. Duis at massa nunc.
								Cras malesuada, sem quis aliquet vulputate, ante ipsum congue ante, eu volutpat
								ipsum sem posuere ante. Suspendisse potenti. Nullam in lacinia mi.
							</BodyText>
							<BodyText>
								Donec ac ultricies nunc, quis pharetra orci. Mauris semper blandit sodales. Morbi eu
								mollis eros. Fusce id lacinia massa. Nam vitae eleifend arcu. Ut ex leo, semper at
								lectus ullamcorper, congue dignissim nunc. Etiam volutpat est mauris. Nullam ut
								tellus vehicula, tempus urna ac, gravida urna. Nunc diam lorem, dictum consectetur
								libero vitae, aliquet tristique nibh. Maecenas tellus nibh, convallis et consectetur
								at, semper ac lacus. Quisque efficitur id risus eget fringilla. Vestibulum ac nibh
								viverra, efficitur tortor vitae, auctor eros. Nulla sit amet sagittis libero, a
								rhoncus nulla. Phasellus vitae tellus ut enim porttitor congue. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
							</BodyText>
							<BodyText>
								Vivamus at augue eget justo finibus commodo ut a urna. Pellentesque eu tempus
								libero, a tristique risus. Sed vel posuere elit. Nulla faucibus nisl turpis, id
								ultricies massa rutrum sit amet. Suspendisse aliquet suscipit convallis. Quisque
								convallis, ipsum nec feugiat vulputate, mi dolor posuere nisi, vel iaculis urna
								lacus sit amet massa. Ut a velit urna. Morbi id massa dui. Class aptent taciti
								sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer
								pharetra eros eget turpis maximus, in fermentum nisl bibendum. Phasellus mattis urna
								et libero malesuada, sed rutrum dolor dignissim.
							</BodyText>
							<BodyText>
								Sed vel nunc lobortis lectus tincidunt viverra. Nullam lobortis eros vel congue
								pellentesque. Donec faucibus felis non neque volutpat dapibus. Nam id mi vel ligula
								maximus imperdiet at eget sapien. Duis in eros lobortis, maximus risus commodo,
								dignissim erat. Suspendisse semper magna leo, eget tincidunt est laoreet non.
								Phasellus nec posuere ipsum, at egestas urna. Fusce pellentesque finibus magna, eget
								hendrerit enim aliquam condimentum.
							</BodyText>
							<BodyText>
								Donec at dolor eget ante faucibus gravida a eget erat. In vehicula nibh eu venenatis
								ullamcorper. Nulla nisl justo, tempus vitae felis et, molestie posuere augue. Morbi
								pellentesque lacinia lacus quis bibendum. Integer nec nisi id mauris gravida
								scelerisque eu eu nibh. Sed accumsan ut ligula at aliquam. Quisque odio ex, viverra
								sit amet lectus scelerisque, sollicitudin ornare ante. Vestibulum arcu augue,
								vehicula vel pellentesque sed, aliquam ut nunc.
							</BodyText>
							<Button>Tab {i} Bottom</Button>
						</Scroller>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

range('Number of Tabs', WithAllDisabledTabs, {groupId: 'TabLayout'}, {min: 0, max: 20, step: 1}, 3);
select('orientation', WithAllDisabledTabs, ['vertical', 'horizontal'], Config, 'vertical');

WithAllDisabledTabs.storyName = 'With all disabled tabs';
WithAllDisabledTabs.parameters = {
	props: {
		noPanel: true
	}
};

export const WithAddingRemovingATab = () => (
	<Panel>
		<Header title="TabLayout" subtitle="With adding/removing a tab" />
		<AddingTabSample />
	</Panel>
);

WithAddingRemovingATab.storyName = 'With adding/removing a tab';
WithAddingRemovingATab.parameters = {
	props: {
		noPanel: true
	},
	controls: {
		hideNoControlsWarning: true
	}
};

export const WithControlledIndex = (args) => {
	const [selected, setSelected] = useState(1);

	return (
		<Panel>
			<Header title="Limestone TabLayout" subtitle="Controlled Index" />
			<TabLayout
				index={selected}
				onSelect={({index}) => setSelected(index)}
				orientation={args['orientation']}
			>
				<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
					<Button icon="demosync" onClick={() => setSelected(1)}>
						Change to 2nd tab
					</Button>
				</Tab>
				<Tab title={tabsWithIcons[1].title} icon={tabsWithIcons[1].icon}>
					<Button icon="demosync" onClick={() => setSelected(2)}>
						Change to 3rd tab
					</Button>
					<Button icon="demosync" onClick={() => setTimeout(() => setSelected(2), 2000)}>
						Delayed change to 3rd tab
					</Button>
				</Tab>
				<Tab title={tabsWithIcons[2].title} icon={tabsWithIcons[2].icon}>
					<Item onClick={() => setSelected(1)}>Change to 2nd tab</Item>
				</Tab>
			</TabLayout>
		</Panel>
	);
};

select('orientation', WithControlledIndex, ['vertical', 'horizontal'], Config);

WithControlledIndex.storyName = 'With controlled index';
WithControlledIndex.parameters = {
	props: {
		noPanel: true
	}
};

export const WithInputField = () => {
	return (
		<Panel>
			<Header title="TabLayout" subtitle="With InputField" />
			<TabLayout>
				<Tab title="Tab 0">
					<InputField defaultValue="Value 0" /><br /><br />
					<InputField defaultValue="Value 1" /><br /><br />
					<InputField defaultValue="Value 2" /><br /><br />
				</Tab>
			</TabLayout>
		</Panel>
	);
};

WithInputField.storyName = 'With InputField';

export const WithScroller = (args) => {
	const tabs = args['Number of Tabs'];
	const isHorizontal = args['orientation'] === 'horizontal';

	return (
		<Panel css={isHorizontal ? css : null}>
			<Header title="TabLayout" subtitle="With Scroller" />
			<TabLayout
				css={isHorizontal ? css : null}
				orientation={args['orientation']}
				tabSize={args['Tab Size'] || null}
				offset={132}
			>
				{Array.from({length: tabs}, (v, i) => (
					<TabLayout.Tab title={`Tab ${i + 1}`} key={`tab${i}`}>
						<Scroller className={isHorizontal ? css.scroller : null} key={'view' + i}>
							<Button>Tab {i + 1} Top</Button>
							<BodyText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ante sit amet dui
								cursus tempus ut nec nisl. In scelerisque, nunc in interdum varius, dolor magna
								auctor tellus, quis mattis mauris lectus vel metus. Maecenas tempus quam ac
								dignissim gravida. Integer ut posuere sapien. Duis consequat vitae libero nec
								posuere. Curabitur sagittis mauris vel massa cursus, et mollis est malesuada.
								Vestibulum ante libero, gravida id purus eget, varius porttitor ipsum. Suspendisse
								quis consequat sem, eget gravida est. Morbi pulvinar diam vel mattis lacinia.
								Integer eget est quis augue tincidunt tincidunt quis at nisi. Duis at massa nunc.
								Cras malesuada, sem quis aliquet vulputate, ante ipsum congue ante, eu volutpat
								ipsum sem posuere ante. Suspendisse potenti. Nullam in lacinia mi.
							</BodyText>
							<BodyText>
								Donec ac ultricies nunc, quis pharetra orci. Mauris semper blandit sodales. Morbi eu
								mollis eros. Fusce id lacinia massa. Nam vitae eleifend arcu. Ut ex leo, semper at
								lectus ullamcorper, congue dignissim nunc. Etiam volutpat est mauris. Nullam ut
								tellus vehicula, tempus urna ac, gravida urna. Nunc diam lorem, dictum consectetur
								libero vitae, aliquet tristique nibh. Maecenas tellus nibh, convallis et consectetur
								at, semper ac lacus. Quisque efficitur id risus eget fringilla. Vestibulum ac nibh
								viverra, efficitur tortor vitae, auctor eros. Nulla sit amet sagittis libero, a
								rhoncus nulla. Phasellus vitae tellus ut enim porttitor congue. Vestibulum ante
								ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
							</BodyText>
							<BodyText>
								Vivamus at augue eget justo finibus commodo ut a urna. Pellentesque eu tempus
								libero, a tristique risus. Sed vel posuere elit. Nulla faucibus nisl turpis, id
								ultricies massa rutrum sit amet. Suspendisse aliquet suscipit convallis. Quisque
								convallis, ipsum nec feugiat vulputate, mi dolor posuere nisi, vel iaculis urna
								lacus sit amet massa. Ut a velit urna. Morbi id massa dui. Class aptent taciti
								sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer
								pharetra eros eget turpis maximus, in fermentum nisl bibendum. Phasellus mattis urna
								et libero malesuada, sed rutrum dolor dignissim.
							</BodyText>
							<BodyText>
								Sed vel nunc lobortis lectus tincidunt viverra. Nullam lobortis eros vel congue
								pellentesque. Donec faucibus felis non neque volutpat dapibus. Nam id mi vel ligula
								maximus imperdiet at eget sapien. Duis in eros lobortis, maximus risus commodo,
								dignissim erat. Suspendisse semper magna leo, eget tincidunt est laoreet non.
								Phasellus nec posuere ipsum, at egestas urna. Fusce pellentesque finibus magna, eget
								hendrerit enim aliquam condimentum.
							</BodyText>
							<BodyText>
								Donec at dolor eget ante faucibus gravida a eget erat. In vehicula nibh eu venenatis
								ullamcorper. Nulla nisl justo, tempus vitae felis et, molestie posuere augue. Morbi
								pellentesque lacinia lacus quis bibendum. Integer nec nisi id mauris gravida
								scelerisque eu eu nibh. Sed accumsan ut ligula at aliquam. Quisque odio ex, viverra
								sit amet lectus scelerisque, sollicitudin ornare ante. Vestibulum arcu augue,
								vehicula vel pellentesque sed, aliquam ut nunc.
							</BodyText>
							<Button>Tab {i + 1} Bottom</Button>
						</Scroller>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

range('Number of Tabs', WithScroller, {groupId: 'TabLayout'}, {min: 0, max: 20, step: 1}, 8);
range('Tab Size', WithScroller, {groupId: 'TabLayout'}, {min: 0, max: 960, step: 60}, 960);
select('orientation', WithScroller, ['vertical', 'horizontal'], Config, 'horizontal');

WithScroller.storyName = 'With Scroller';
WithScroller.parameters = {
	props: {
		noPanel: true
	}
};

export const WithPrimaryIndex = (args) => {
	return (
		<Panel>
			<Header title="TabLayout" subtitle="With primary index" />
			<TabLayout
				orientation={args['orientation']}
				primaryIndex={args['primaryIndex']}
			>
				{tabsWithIcons.map((tab, i) => (
					<TabLayout.Tab title={tab.title} icon={tab.icon} key={`tab${i}`}>
						<Button>Tab {i + 1}</Button>
					</TabLayout.Tab>
				))}
			</TabLayout>
		</Panel>
	);
};

select('orientation', WithPrimaryIndex, ['vertical', 'horizontal'], Config, 'vertical');
range('primaryIndex', WithPrimaryIndex, {groupId: 'TabLayout'}, {min: 0, max: 2, step: 1}, 0);

WithPrimaryIndex.storyName = 'With primary index';
WithPrimaryIndex.parameters = {
	props: {
		noPanel: true
	}
};

export const WithRestoredFocus = (args) => {
	const list = useMemo(() => ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'], []);

	const [dynamicList, setDynamicList] = useState(list);

	const handleAddList = useCallback(() => {
		const newList = [...dynamicList];
		newList.push(`Added Tab ${newList.length + 1}`);
		setDynamicList(newList);
	}, [dynamicList]);

	const handleResetList = useCallback(() => {
		setDynamicList(list);
	}, [list]);

	const tabList = () => {
		return dynamicList.map((tab) => {
			return (
				<Tab key={tab} title={tab}>
					<Header title={tab} />
					<Item>Tab Item</Item>
					<Button onClick={handleAddList}>
						Add Tab
					</Button>
					<Button onClick={handleResetList}>
						Reset Tabs
					</Button>
				</Tab>
			);
		});
	};

	return (
		<Panel>
			<Header title="TabLayout" subtitle="With restored focus" />
			<TabLayout
				orientation={args['orientation']}
				tabSize={args['tabSize']}
			>
				{tabList()}
			</TabLayout>
		</Panel>
	);
};

range('tabSize', WithRestoredFocus, {groupId: 'TabLayout'}, {min: 0, max: 960, step: 60}, 960);
select('orientation', WithRestoredFocus, ['vertical', 'horizontal'], Config, 'horizontal');

WithRestoredFocus.storyName = 'with restored focus';
WithRestoredFocus.parameters = {
	props: {
		noPanel: true
	}
};

export const WithRetainedFocus = (args) => {
	const list = useMemo(() => ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'], []);

	const [dynamicList, setDynamicList] = useState(list);

	const handleAddList = useCallback(() => {
		const newList = [...dynamicList];
		newList.push(`Added Tab ${newList.length + 1}`);
		setDynamicList(newList);
	}, [dynamicList]);

	const handleResetList = useCallback(() => {
		setDynamicList(list);
	}, [list]);

	const tabList = () => {
		return dynamicList.map((tab) => {
			return (
				<Tab key={tab} title={tab}>
					<Header title={tab} />
					<Item>Tab Item</Item>
					<Button onClick={handleAddList}>
						Add Tab
					</Button>
					<Button onClick={handleResetList}>
						Reset Tabs
					</Button>
				</Tab>
			);
		});
	};

	const isHorizontal = args['orientation'] === 'horizontal';
	const LayoutComponent = isHorizontal ? Row : Column;

	return (
		<Panel>
			<Header noCloseButton={args['noCloseButton']} title="TabLayout" subtitle="With retained focus" />
			<Layout orientation={args['orientation']} style={{height:'100%'}}>
				{!args['hideFirstButton'] &&
					<LayoutComponent style={{alignItems: args['alignButtons'], ...(!isHorizontal && {height: 'fit-content'})}}>
						<Button minWidth={false}>First</Button>
					</LayoutComponent>
				}
				<Cell>
					<TabLayout
						orientation={args['orientation']}
						tabSize={args['tabSize']}
					>
						{tabList()}
					</TabLayout>
				</Cell>
				{!args['hideSecondButton'] &&
					<LayoutComponent style={{alignItems: args['alignButtons'], ...(!isHorizontal && {height: 'fit-content'})}}>
						<Button minWidth={false}>Second</Button>
					</LayoutComponent>
				}
			</Layout>
		</Panel>
	);
};

boolean('hideFirstButton', WithRetainedFocus, Config, false);
boolean('hideSecondButton', WithRetainedFocus, Config, false);
select('alignButtons', WithRetainedFocus, ['start', 'center', 'end'], Config, 'start');
range('tabSize', WithRetainedFocus, {groupId: 'TabLayout'}, {min: 0, max: 960, step: 60}, 960);
select('orientation', WithRetainedFocus, ['vertical', 'horizontal'], Config, 'horizontal');


WithRetainedFocus.storyName = 'With retained focus';
WithRetainedFocus.parameters = {
	props: {
		noPanel: true
	}
};
