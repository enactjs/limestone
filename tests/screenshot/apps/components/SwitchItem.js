import Icon from '../../../../Icon';
import SwitchItem from '../../../../SwitchItem';

import {pick, withConfig} from './utils';

const switchItemSmokeTests = [
	<SwitchItem />,
	<SwitchItem>Hello SwitchItem</SwitchItem>,
	<SwitchItem selected>Hello SwitchItem</SwitchItem>,
	<SwitchItem disabled>Hello SwitchItem</SwitchItem>,
	<SwitchItem disabled selected>Hello SwitchItem</SwitchItem>,
	<SwitchItem inline>Hello SwitchItem</SwitchItem>,
	<SwitchItem inline selected>Hello SwitchItem</SwitchItem>,

	// Icon slotAfter
	<SwitchItem>SwitchItem<Icon slot="slotAfter">home</Icon></SwitchItem>,

	// Centered
	<SwitchItem centered>Hello SwitchItem</SwitchItem>,
	<SwitchItem centered>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.</SwitchItem>
];

const switchItemFocusTests = [
	// [QWTC-2130]
	<SwitchItem>Focused SwitchItem</SwitchItem>,
	<SwitchItem selected>Focused SwitchItem</SwitchItem>,
	<SwitchItem disabled>Focused SwitchItem</SwitchItem>,
	// [QWTC-2130]
	<SwitchItem disabled selected>Focused SwitchItem</SwitchItem>,
	<SwitchItem inline>Focused SwitchItem</SwitchItem>,
	<SwitchItem inline selected>Focused SwitchItem</SwitchItem>,
	<SwitchItem centered>Focused Hello SwitchItem</SwitchItem>
];

const switchItemLargeTextTests = pick(switchItemSmokeTests, 0, 2, 5, 9);

const switchItemRtlTests = pick(switchItemSmokeTests, 0, 2, 5, 9);

const SwitchItemTests = [
	...switchItemSmokeTests,
	...withConfig({focus: true}, switchItemFocusTests),
	...withConfig({textSize: 'large'}, switchItemLargeTextTests),
	...withConfig({locale: 'ar-SA'}, switchItemRtlTests)
];

export default SwitchItemTests;
