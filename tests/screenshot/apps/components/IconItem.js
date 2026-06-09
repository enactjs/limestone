import IconItem from '../../../../IconItem';

import {withConfig, withProps} from './utils';

import img from '../../images/200x200.png';

const imageProp = {src: img};

const defaultIconItemTests = [
	// Icon type
	<IconItem background="#000000" icon="usb" />,
	<IconItem background="#000000" icon="usb" label="Label" />,
	<IconItem background="#000000" icon="usb" label="This is very long label" />,
	<IconItem background="#000000" icon="usb" label="This is very long label" labelOn="focus" />,
	<IconItem background="#000000" icon="usb" title="App title" />,
	<IconItem background="#000000" icon="usb" title="This is very long title" />,
	<IconItem background="#000000" icon="usb" title="This is very long title" titleOn="focus" />,
	<IconItem background="#000000" icon="usb" label="Label" title="App title" />,
	<IconItem background="#000000" icon="usb" label="Label" labelOn="focus" title="App title" />,
	<IconItem background="#000000" icon="usb" label="Label" title="App title" titleOn="focus" />,
	<IconItem background="#000000" icon="usb" label="Label" labelOn="focus" title="App title" titleOn="focus" />,

	// Image type
	<IconItem background="#ffffff" image={imageProp} />,
	<IconItem background="radial-gradient(crimson, skyblue)" image={imageProp} />,
	<IconItem background={`url(${img})`} image={imageProp} />,
	<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" />,
	<IconItem background="#ffffff" image={imageProp} label="This is very long label" labelColor="dark" />,
	<IconItem background="#ffffff" image={imageProp} label="This is very long label" labelColor="dark" labelOn="focus" />,
	<IconItem background="#ffffff" image={imageProp} title="App title" />,
	<IconItem background="#ffffff" image={imageProp} title="This is very long title" />,
	<IconItem background="#ffffff" image={imageProp} title="This is very long title" titleOn="focus" />,
	<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" title="App title" />,
	<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" labelOn="focus" title="App title" />,
	<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" title="App title" titleOn="focus" />,
	<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" labelOn="focus" title="App title" titleOn="focus" />
];

const iconItemSmokeTests = [
	defaultIconItemTests[0],
	defaultIconItemTests[1],
	defaultIconItemTests[3],
	defaultIconItemTests[6],
	defaultIconItemTests[10],
	defaultIconItemTests[12],
	defaultIconItemTests[15],
	defaultIconItemTests[18],
	defaultIconItemTests[22]
];

const iconItemCommentedTests = [
	// Bordered
	...withProps({bordered: true}, defaultIconItemTests),

	// Disabled
	...withProps({disabled: true}, defaultIconItemTests),

	// Bordered and disabled.
	...withProps({bordered: true, disabled: true}, defaultIconItemTests)
];

const iconItemFocusTests = [
	// Focused
	...withConfig({focus: true, wrapper: {light: true, padded: true}}, [
		// Icon type
		<IconItem background="#000000" icon="usb" />,
		<IconItem background="#000000" icon="usb" label="Label" />,
		<IconItem background="#000000" icon="usb" label="This is very long label" />,
		<IconItem background="#000000" icon="usb" label="This is very long label" labelOn="focus" />,
		<IconItem background="#000000" icon="usb" title="App title" />,
		<IconItem background="#000000" icon="usb" title="This is very long title" />,
		<IconItem background="#000000" icon="usb" title="This is very long title" titleOn="focus" />,
		<IconItem background="#000000" icon="usb" label="Label" title="App title" />,
		<IconItem background="#000000" icon="usb" label="Label" labelOn="focus" title="App title" />,
		<IconItem background="#000000" icon="usb" label="Label" title="App title" titleOn="focus" />,
		<IconItem background="#000000" icon="usb" label="Label" labelOn="focus" title="App title" titleOn="focus" />,

		// Image type
		<IconItem background="#ffffff" image={imageProp} />,
		<IconItem background="radial-gradient(crimson, skyblue)" image={imageProp} />,
		<IconItem background={`url(${img})`} image={imageProp} />,
		<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" />,
		<IconItem background="#ffffff" image={imageProp} label="This is very long label" labelColor="dark" />,
		<IconItem background="#ffffff" image={imageProp} label="This is very long label" labelColor="dark" labelOn="focus" />,
		<IconItem background="#ffffff" image={imageProp} title="App title" />,
		<IconItem background="#ffffff" image={imageProp} title="This is very long title" />,
		<IconItem background="#ffffff" image={imageProp} title="This is very long title" titleOn="focus" />,
		<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" title="App title" />,
		<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" labelOn="focus" title="App title" />,
		<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" title="App title" titleOn="focus" />,
		<IconItem background="#ffffff" image={imageProp} label="Label" labelColor="dark" labelOn="focus" title="App title" titleOn="focus" />
	])
];

const IconItemTests = [
	...iconItemSmokeTests,
	...iconItemCommentedTests,
	...iconItemFocusTests,
	...withConfig({
		focusRing: true,
		focus: true
	}, [
		<IconItem background="#1b1b1b" icon="usb" />,
		<IconItem background="#1b1b1b" icon="usb" label="Label" />
	]),
	...withConfig({skinVariants: ['largeText']}, defaultIconItemTests)
];

export default IconItemTests;
