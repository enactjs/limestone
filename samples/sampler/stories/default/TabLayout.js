import Button from '@enact/limestone/Button';
import ImageItem from '@enact/limestone/ImageItem';
import Icon from '@enact/limestone/Icon';
import Item from '@enact/limestone/Item';
import {Panel, Header} from '@enact/limestone/Panels';
import Scroller from '@enact/limestone/Scroller';
import TabLayout, {TabLayoutBase, Tab} from '@enact/limestone/TabLayout';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, range, select} from '@enact/storybook-utils/addons/controls';
import {scaleToRem} from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';
import spriteGear2k from '../../images/sprite-gear-2k.png';
import spriteGear4k from '../../images/sprite-gear-4k.png';

TabLayout.displayName = 'TabLayout';
const Config = mergeComponentMetadata('TabLayout', TabLayoutBase, TabLayout);

// `paddingBottom: '56.25%'` is a trick to impose 16:9 aspect ratio on the component, since padding percentage is based on the width, not the height.

const tabsWithIcons = [
	{title: 'Home', icon: 'home'},
	{title: 'Settings', icon: 'gear'},
	{title: 'Item', icon: 'trash'},
	{title: 'Button', icon: 'accessibility'},
	{title: 'Control', icon: 'contrast'}
];

const tabsWithoutIcons = [
	{title: 'Home'}, {title: 'Settings'}, {title: 'Item'}, {title: 'Control'}, {title: 'Button'}];

const tabSelections = {
	'with icons': tabsWithIcons,
	'without icons': tabsWithoutIcons
};

export default {
	title: 'Limestone/TabLayout',
	component: 'TabLayout'
};

export const _TabLayout = (args) => {
	const tabs = args['tabs'];

	const images = new Array(20).fill().map((_, i) => (
		<ImageItem
			inline
			key={`image${i}`}
			label="ImageItem label"
			src={svgGenerator(360, 240, 'd8d8d8', '6e6e6e', '360 X 240')}
			style={{
				width: scaleToRem(768),
				height: scaleToRem(588)
			}}
		>
			{`ImageItem ${i + 1}`}
		</ImageItem>
	));

	return (
		<Panel>
			<Header title="Limestone TabLayout" subtitle="Basic TabLayout" />
			<TabLayout
				onSelect={action('onSelect')}
				onTabAnimationEnd={action('onTabAnimationEnd')}
				orientation={args['orientation']}
				noScrollByWheel={args['noScrollByWheel']}
				tabSize={args['tabSize'] || null}
			>
				<Tab title={tabSelections[tabs][0].title} icon={tabSelections[tabs][0].icon}>
					<Scroller>{images}</Scroller>
				</Tab>
				<Tab
					title={tabSelections[tabs][1].title}
					icon={tabSelections[tabs][1].icon}
					sprite={{
						columns: 6,
						rows: 5,
						iterations: 1,
						src: {
							fhd: spriteGear2k,
							uhd: spriteGear4k
						}
					}}
				>
					<Button icon="demosync">Button 1</Button>
					<Button icon="demosync">Button 2</Button>
					<Button icon="demosync">Button 3</Button>
					<Button icon="demosync">Button 4</Button>
					<Button icon="demosync">Button 5</Button>
				</Tab>
				<Tab title={tabSelections[tabs][2].title} icon={tabSelections[tabs][2].icon}>
					<Item slotBefore={<Icon>playcircle</Icon>}>Single Item</Item>
				</Tab>
				<Tab title={tabSelections[tabs][3].title} icon={tabSelections[tabs][3].icon}>
					<Item slotBefore={<Icon>download</Icon>}>Download</Item>
					{images[0]}
				</Tab>
				<Tab title={tabSelections[tabs][4].title} icon={tabSelections[tabs][4].icon}>
					<Item slotBefore={<Icon>arrowsmallleft</Icon>}>Control Left</Item>
					<Item slotBefore={<Icon>arrowsmallright</Icon>}>Control Right</Item>
					<Item slotBefore={<Icon>arrowsmalldown</Icon>}>Control Down</Item>
					<Item slotBefore={<Icon>arrowsmallup</Icon>}>Control Up</Item>
				</Tab>
			</TabLayout>
		</Panel>
	);
};

boolean('noScrollByWheel', _TabLayout, Config, false);
select('tabs', _TabLayout, ['with icons', 'without icons'], Config, 'with icons');
select('orientation', _TabLayout, ['vertical', 'horizontal'], Config);
range('tabSize', _TabLayout, Config, {min: 0, max: 960, step: 60}, 600);

_TabLayout.storyName = 'TabLayout';
_TabLayout.parameters = {
	props: {
		noPanel: true
	}
};
