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
	<Slider colorPicker showMinMax />,
	<Slider colorPicker disabled />,
	<Slider colorPicker value={50} />,
	{
		component: <Slider colorPicker value={50} tooltip />,
		...padded,
		focus: true
	},
	<Slider orientation="vertical" colorPicker />,
	<Slider orientation="vertical" colorPicker showMinMax />,
	<Slider orientation="vertical" colorPicker disabled />,
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
		component: <Slider value={25} showMinMax min={0} max={100} />,
		...padded
	},
	{
		component: <Slider disabled value={25} />,
		...padded
	},
	{
		component: <Slider colorPicker value={120} />,
		...padded
	},
	{
		component: <Slider colorPicker disabled value={120} />,
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
		component: <Slider tooltip min={0} max={100} step={5} value={20} focused />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="above left" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="above right" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="above before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="above after" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="right" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="after" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below left" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below right" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider tooltip={<Tooltip position="below after" />} value={40} backgroundProgress={0.5} />,
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
		component: <Slider orientation="vertical" tooltip={<Tooltip position="right" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider orientation="vertical" tooltip={<Tooltip position="before" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	},
	{
		component: <Slider orientation="vertical" tooltip={<Tooltip position="after" />} value={40} backgroundProgress={0.5} />,
		...padded,
		focus: true
	}
];

const sliderRtlTests = [
	<Slider value={60} />,
	<Slider backgroundProgress={0.5} value={40} />,
	<Slider orientation="vertical" value={60} />,
	<Slider orientation="vertical" backgroundProgress={0.5} value={40} />
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
