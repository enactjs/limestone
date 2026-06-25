import Slider, {SliderTooltip as Tooltip} from '../../../../Slider';

import {withConfig} from './utils';

import css from './Slider.module.less';

const padded = {wrapper: {padded: true}};

const sliderSmokeTests = [
	<Slider />,
	<Slider showMinMax />,
	<Slider disabled />,
	<Slider value={50} />,
	<Slider value={50} showAnchor />,
	<Slider backgroundProgress={0.5} value={25} />,
	<Slider disabled backgroundProgress={0.25} value={50} />,
	<Slider value={25} progressAnchor={0.5} showAnchor />,
	<Slider orientation="vertical" value={50} />,
	<Slider orientation="vertical" backgroundProgress={0.5} value={25} />,
	<Slider css={css} value={50} />,
	{
		component: <Slider value={25} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip percent value={50} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="left" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	}

];

const sliderQwtcTests = [
	// [QWTC-2192]
	{
		component: <Slider tooltip={<Tooltip position="above" />} disabled value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	}
];

const sliderCustomizedStyleTests = [
	// Customized style
	<Slider css={css} orientation="vertical" value={50} />,
	<Slider css={css} orientation="vertical" value={50} showAnchor />
];

const sliderColorPickerTests = [
	// Color Picker
	<Slider colorPicker />,
	<Slider colorPicker disabled />,
	{
		component: <Slider colorPicker value={50} tooltip />,
		...padded,
		focus: true
	},
	<Slider orientation="vertical" colorPicker value={50} />,
	{
		component: <Slider orientation="vertical" colorPicker value={50} tooltip />,
		...padded,
		focus: true
	},
	{
		component: <Slider value={25} progressAnchor={0.5} tooltip />,
		...padded,
		focus: true
	},
	{
		component: <Slider disabled value={25} />,
		...padded
	}
];

const sliderTooltipTests = [
	// *************************************************************
	// tooltip - all positions
	// NOTE: Tooltip won't show on slider without focus. Nothing should show!
	// *************************************************************
	{
		component: <Slider tooltip min={-60.0} max={60.0} step={0.5} value={4.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="above left" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below left" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	}
];

const sliderVerticalTooltipTests = [
	// Vertical tooltip placement -- valid positions: before/after/left/right
	{
		component: <Slider orientation="vertical" tooltip={<Tooltip position="left" />} disabled value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider orientation="vertical" tooltip={<Tooltip position="before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	}
];

const sliderRtlTests = [
	<Slider value={60} />,
	<Slider backgroundProgress={0.5} value={40} />
];

const sliderCommentedTests = [
	...sliderCustomizedStyleTests,
	...sliderColorPickerTests,
	...sliderTooltipTests,
	...sliderVerticalTooltipTests
];

const SliderTests = [
	...sliderSmokeTests,
	...sliderQwtcTests,
	...sliderCommentedTests,
	...withConfig({locale: 'ar-SA'}, sliderRtlTests)
];

export default SliderTests;
