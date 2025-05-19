import Button from '@enact/limestone/Button';
import ImageItem from '@enact/limestone/ImageItem';
import Icon from '@enact/limestone/Icon';
import Item from '@enact/limestone/Item';
import {Panel, Header} from '@enact/limestone/Panels';
import Scroller from '@enact/limestone/Scroller';
import TabLayout, {TabLayoutBase, Tab} from '@enact/limestone/TabLayout';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {range, select} from '@enact/storybook-utils/addons/controls';
import {scaleToRem} from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';
import spriteGear2k from '../../images/sprite-gear-2k.png';
import spriteGear4k from '../../images/sprite-gear-4k.png';

TabLayout.displayName = 'TabLayout';
const Config = mergeComponentMetadata('TabLayout', TabLayoutBase, TabLayout);

// `paddingBottom: '56.25%'` is a trick to impose 16:9 aspect ratio on the component, since padding percentage is based on the width, not the height.

const tabsWithIcons = [
	{title: 'Home', icon: 'home'},
	{title: 'Button', icon: 'gear'},
	{title: 'Item', icon: 'trash'}
];

const tabsWithoutIcons = [{title: 'Home'}, {title: 'Button'}, {title: 'Item'}];

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
				size={args['size']}
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
			</TabLayout>
		</Panel>
	);
};

select('tabs', _TabLayout, ['with icons', 'without icons'], Config, 'with icons');
select('size', _TabLayout, ['small', 'large'], Config, 'large');
select('orientation', _TabLayout, ['vertical', 'horizontal'], Config);

_TabLayout.storyName = 'TabLayout';
_TabLayout.parameters = {
	props: {
		noPanel: true
	}
};
