import {scaleToRem} from '@enact/ui/resolution';

import Dropdown from '../../../../Dropdown';

import {withProps} from './utils';

const children = (itemCount) => (new Array(itemCount)).fill().map((i, index) => `Option ${index + 1}`);

const Widths = [
	<Dropdown placeholder="Dropdown" width="tiny" />,
	<Dropdown placeholder="Dropdown" width="small" />,
	<Dropdown placeholder="Dropdown" width="large" />,
	<Dropdown placeholder="Dropdown" width="x-large" />,
	<Dropdown placeholder="Dropdown" width="huge" />
];

const dropdownSmokeTests = [
	<Dropdown />,  // default size is 'small'
	<Dropdown placeholder="Dropdown" />,
	<Dropdown placeholder="Dropdown" width="tiny" disabled />,

	// With title
	<Dropdown title="Select an option below" />,
	<Dropdown title="Select an option below" placeholder="Dropdown" />,
	<Dropdown title="Select an option below" placeholder="Dropdown" disabled />
];

const dropdownQwtcTests = [
	// Change 'size' dynamically [QWTC-2173]
	<Dropdown size="small" />,
	<Dropdown size="large" />,
	<Dropdown placeholder="Dropdown" size="large" />,

	// Change 'width' dynamically [QWTC-2174]
	// width - 'medium' is default
	...Widths,

	// size="large"
	...withProps({size: 'large'}, Widths),

	// size="small"
	...withProps({size: 'small'}, Widths)
];

const dropdownCommentedTests = [
	// open with number type width
	<Dropdown open width={360} title="Number type width">
		{children(5)}
	</Dropdown>,

	// open with number type width and small size
	<Dropdown open width={360} size="small" title="Number type width and small size">
		{children(5)}
	</Dropdown>,

	// open with children
	<Dropdown open title="Select an option below">
		{children(5)}
	</Dropdown>,

	// direction - 'above', 'below'
	// 'below' is default
	<Dropdown open direction="above" title="Select an option above" style={{marginTop: scaleToRem(300)}}>
		{children(3)}
	</Dropdown>,
	<Dropdown title="Select an option below">
		{children(3)}
	</Dropdown>
];

const dropdownFocusTests = [
	// size="large" — smoke representatives
	...withProps({focus: true}, [
		Widths[0],
		Widths[2]
	])
];

const dropdownRtlTests = [
	// locale = 'ar-SA'
	{
		locale: 'ar-SA',
		component: <Dropdown title="حدد أحد الخيارات أدناه">{children(5)}</Dropdown>
	}
];

const DropdownTests = [
	...dropdownSmokeTests,
	...dropdownQwtcTests,
	...dropdownCommentedTests,
	...dropdownFocusTests,
	...dropdownRtlTests
];

export default DropdownTests;
